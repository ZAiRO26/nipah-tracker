import { schedule } from '@netlify/functions';
import Parser from 'rss-parser';
import { Client } from 'pg';
import Groq from 'groq-sdk';

// Initialize Clients
const parser = new Parser();

// Types corresponding to DB Schema
interface OutbreakEvent {
    source_url: string;
    date: string;
    location: string;
    admin_level: 'National' | 'State' | 'District' | 'City';
    cases: number;
    deaths: number;
    status: 'CONFIRMED' | 'SUSPECTED' | 'DISCARDED';
    confidence_score: number;
    raw_snippet: string;
}

const RSS_SOURCES = [
    "https://www.who.int/feeds/entity/emergencies/disease-outbreak-news/rss.xml",
    "https://www.cidrap.umn.edu/news/rss",
    "https://tools.cdc.gov/api/v2/resources/media/132608.rss"
];

// System Prompt for AI
const SYSTEM_PROMPT = `You are a crisis intelligence filter. 

1. For WHO/Official sources: Trust high confidence.
2. For Google News: Mark as SUSPECTED unless multiple sources cite officials.

CRITICAL INSTRUCTION:
- Extract ONLY NEW / FRESH cases reported in this specific article.
- DO NOT extract cumulative totals (e.g. "Total cases since Jan are 10" -> Ignore. "2 new cases reported today" -> Extract 2).
- If the article discusses history or general facts, return empty events.

Extract confirmed Nipah cases GLOBALLY. Do NOT limit to India. 
For CDC/CIDRAP feeds, specifically look for keywords 'Nipah', 'NiV', or 'Encephalitis outbreaks'.

Return JSON ONLY with this schema:
{
  "events": [
    {
      "source_url": "string (original url)",
      "date": "ISO8601 string",
      "location": "string (specific place)",
      "admin_level": "National" | "State" | "District" | "City",
      "cases": number (ONLY NEWLY CONFIRMED count),
      "deaths": number (ONLY NEW DEATHS),
      "status": "CONFIRMED" | "SUSPECTED" | "DISCARDED",
      "confidence_score": number (0.0 to 1.0),
      "raw_snippet": "string (exact quote supporting the extraction)"
    }
  ]
}
If no relevant Nipah cases are found, return { "events": [] }.`;

const handler = schedule('*/30 * * * *', async (event) => {
    console.log("Running Scheduled Ingestion (Groq Intelligence + Reddit Scout)...");

    const db = new Client({
        connectionString: process.env.DATABASE_URL
    });

    const groq = new Groq({
        apiKey: process.env.GROQ_API_KEY
    });

    try {
        await db.connect();

        for (const source of RSS_SOURCES) {
            try {
                const isReddit = source.includes("reddit.com");
                const feed = await parser.parseURL(source);
                console.log(`[INGEST] Fetched ${feed.items.length} items from ${feed.title} (Reddit: ${isReddit})`);

                // Limit Reddit items to avoid noise
                const latestItems = feed.items.slice(0, isReddit ? 5 : 3);
                let discardedCount = 0;
                let draftedCount = 0;

                for (const item of latestItems) {
                    if (!item.link || (!item.content && !item.contentSnippet)) continue;

                    const checkRes = await db.query('SELECT id FROM outbreak_events WHERE source_url = $1', [item.link]);
                    if (checkRes.rowCount && checkRes.rowCount > 0) {
                        // console.log(`[SKIP] Already processed: ${item.title}`);
                        continue;
                    }

                    const textContent = `${item.title}\n${item.contentSnippet || item.content?.substring(0, 1000)}`;

                    const completion = await groq.chat.completions.create({
                        model: "llama-3.1-8b-instant",
                        messages: [
                            { role: "system", content: SYSTEM_PROMPT },
                            { role: "user", content: `Source: ${isReddit ? 'REDDIT' : 'NEWS'}\nSource URL: ${item.link}\n\nContent:\n${textContent}` }
                        ],
                        response_format: { type: "json_object" }
                    });

                    const result = JSON.parse(completion.choices[0]?.message?.content || '{"events":[]}');
                    const events: OutbreakEvent[] = result.events;

                    if (events.length === 0) discardedCount++;

                    for (const ev of events) {
                        // Safety Nets
                        if (isReddit) {
                            if (ev.status === 'CONFIRMED') {
                                console.warn(`[SAFETY] Downgrading Reddit 'CONFIRMED' to 'SUSPECTED'`);
                                ev.status = 'SUSPECTED';
                            }
                            if (ev.confidence_score > 0.3) {
                                ev.confidence_score = 0.3; // Cap confidence
                            }
                        }

                        // Confidence Threshold (Lower for Social drafts? No, keep high for DB purity, rely on 'SUSPECTED')
                        // But Prompt says set confidence=0.2 for Reddit.
                        // DB Filter: If we want to show 'SUSPECTED' clusters on map, we need to allow them.
                        // Let's filter purely garbage (<0.1) but maybe keep 0.2 if it's a valid rumor?
                        // Current threshold was 0.7. We must lower it for Reddit to pass if we want to track rumors.
                        // But user said "Prevent misinformation". 
                        // Let's stick to: Social drafts are SUSPECTED.
                        // If confidence is < 0.5 and NOT Reddit, discard.
                        // If Reddit, allow > 0.1 but mark SUSPECTED.

                        if (!isReddit && ev.confidence_score < 0.7) {
                            discardedCount++;
                            continue;
                        }
                        if (isReddit && ev.confidence_score < 0.2) {
                            discardedCount++;
                            continue;
                        }

                        const insertQuery = `
                        INSERT INTO outbreak_events 
                        (source_url, date, location, admin_level, cases, deaths, status, confidence_score, raw_snippet)
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                        ON CONFLICT (source_url) DO NOTHING;
                     `;

                        await db.query(insertQuery, [
                            item.link,
                            ev.date,
                            ev.location,
                            ev.admin_level,
                            ev.cases,
                            ev.deaths,
                            ev.status,
                            ev.confidence_score,
                            ev.raw_snippet
                        ]);
                        draftedCount++;
                        console.log(`[SAVED] [${ev.status}] ${ev.location} (${ev.cases} cases) from ${isReddit ? 'Reddit' : 'News'}`);
                    }
                }
                console.log(`[SUMMARY] ${draftedCount} Drafted, ${discardedCount} Discarded from ${feed.title}`);

            } catch (feedError) {
                console.error(`[ERROR] Feed processing failed:`, feedError);
            }
        }
    } catch (dbError) {
        console.error("[CRITICAL] Database/API failed:", dbError);
    } finally {
        await db.end();
    }

    return { statusCode: 200 };
});

export { handler };
