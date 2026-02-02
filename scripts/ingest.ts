import { config } from 'dotenv';
import Parser from 'rss-parser';

config();

enum OutbreakStatus {
    CONFIRMED = 'CONFIRMED',
    SUSPECTED = 'SUSPECTED',
    DISCARDED = 'DISCARDED'
}

interface OutbreakEvent {
    source_url: string;
    date: string;
    location: string;
    admin_level: string;
    cases: number;
    deaths: number;
    status: OutbreakStatus;
    confidence_score: number;
    raw_snippet: string;
    last_verified_at: string;
}

const RSS_SOURCES = [
    "https://www.who.int/feeds/entity/emergencies/disease-outbreak-news/rss.xml", // Real WHO DON RSS
    // "https://ncdc.mohfw.gov.in/index1.php?lang=1&level=1&sublinkid=703&lid=550" // Placeholder for NCDC scraping later
];

const parser = new Parser();

async function fetchSource(url: string): Promise<string> {
    console.log(`[INGEST] Fetching ${url}...`);
    try {
        const feed = await parser.parseURL(url);
        console.log(`[INGEST] Fetched ${feed.items.length} items from ${feed.title}`);

        // We will just process the latest 3 for this mock/demo
        const latestItems = feed.items.slice(0, 3);
        return JSON.stringify(latestItems.map(item => ({
            title: item.title,
            link: item.link,
            content: item.contentSnippet || item.content
        })));
    } catch (error) {
        console.error(`[INGEST] Error fetching RSS from ${url}:`, error);
        return "";
    }
}

async function extractData(text: string): Promise<OutbreakEvent[]> {
    console.log(`[INGEST] Sending to LLM for extraction...`);
    // Mock LLM Response with new fields
    // In production, this would call OpenAI/Gemini API
    return [
        {
            source_url: "https://www.who.int/emergencies/disease-outbreak-news/item/2026-DON123-MOCK",
            date: new Date().toISOString(),
            location: "Kozhikode, Kerala",
            admin_level: "District",
            cases: 2,
            deaths: 1,
            status: OutbreakStatus.CONFIRMED,
            confidence_score: 0.98,
            raw_snippet: "National authorities confirmed 2 cases of Nipah virus in Kozhikode district.",
            last_verified_at: new Date().toISOString()
        }
    ];
}

async function upsertEvents(events: OutbreakEvent[]) {
    console.log(`[INGEST] Upserting ${events.length} events to DB...`);
    events.forEach(e => {
        console.log(` - Saved: ${e.location} (${e.cases} cases) [Status: ${e.status}]`);
        console.log(`   Confidence: ${e.confidence_score}, Source: ${e.source_url}`);
    });
    // TODO: Implement actual DB upsert using pg with enum check
}

async function main() {
    console.log("Starting Ingestion Pipeline...");
    for (const source of RSS_SOURCES) {
        const textFragment = await fetchSource(source);
        if (!textFragment) continue;

        const events = await extractData(textFragment);
        if (events.length > 0) {
            await upsertEvents(events);
        }
    }
    console.log("Ingestion Complete.");
}

main().catch(console.error);
