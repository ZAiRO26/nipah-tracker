import { schedule } from '@netlify/functions';
import Parser from 'rss-parser';
import { Client } from 'pg';
import Groq from 'groq-sdk';

const parser = new Parser();

const RSS_SOURCES = [
    "https://news.google.com/rss/search?q=Nipah+Virus&hl=en-IN&gl=IN&ceid=IN:en",
    "https://www.who.int/feeds/entity/emergencies/disease-outbreak-news/rss.xml",
    "https://www.reddit.com/r/GlobalHealth/search.rss?q=nipah&restrict_sr=1&sort=new"
];

const SYSTEM_PROMPT = `You are a news editor for a disease tracker.
Your job is to analyze news snippets about 'Nipah Virus'.
1. SUMMARIZE the article in 1 short sentence (max 20 words).
2. CATEGORIZE source: 'Official' (WHO/Govt), 'News' (Media), or 'Social' (Reddit).
3. SENTIMENT: Is this 'Urgent' (New outbreak) or 'Informational' (Research/General)?

Return JSON ONLY:
{
  "articles": [
    {
      "source_url": "string (original)",
      "title": "string (cleaned title)",
      "summary": "string (1 sentence)",
      "category": "Official" | "News" | "Social",
      "published_at": "ISO string",
      "confidence_score": 0.0 to 1.0 (relevance to Nipah)
    }
  ]
}
If irrelevant, return empty list.`;

const handler = schedule('0 */2 * * *', async (event) => {
    console.log("Running News Ingestion...");
    const db = new Client({ connectionString: process.env.DATABASE_URL });
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    try {
        await db.connect();

        for (const source of RSS_SOURCES) {
            try {
                const feed = await parser.parseURL(source);
                const items = feed.items.slice(0, 4); // Process top 4 from each

                for (const item of items) {
                    // Check existing
                    const check = await db.query('SELECT id FROM news_articles WHERE source_url = $1', [item.link]);
                    if (check.rowCount && check.rowCount > 0) continue;

                    const content = `${item.title}\n${item.contentSnippet || ''}`;

                    const completion = await groq.chat.completions.create({
                        model: "llama-3.1-8b-instant",
                        messages: [
                            { role: "system", content: SYSTEM_PROMPT },
                            { role: "user", content: `URL: ${item.link}\nContent: ${content}` }
                        ],
                        response_format: { type: "json_object" }
                    });

                    const result = JSON.parse(completion.choices[0]?.message?.content || '{"articles":[]}');

                    for (const art of result.articles) {
                        if (art.confidence_score < 0.6) continue;

                        await db.query(`
                            INSERT INTO news_articles 
                            (title, summary, source_url, published_at, source_name, category, confidence_score)
                            VALUES ($1, $2, $3, $4, $5, $6, $7)
                            ON CONFLICT (source_url) DO NOTHING
                        `, [
                            art.title,
                            art.summary,
                            item.link, // Use original link to be safe
                            art.published_at || new Date().toISOString(),
                            feed.title?.split('-')[0].trim() || 'Source',
                            art.category,
                            art.confidence_score
                        ]);
                        console.log(`[NEWS] Saved: ${art.title}`);
                    }
                }

            } catch (err) {
                console.error("Feed Error:", err);
            }
        }

    } catch (e) {
        console.error("News Ingest Critical:", e);
    } finally {
        await db.end();
    }

    return { statusCode: 200 };
});

export { handler };
