// scripts/verify-ingestion.ts
import dotenv from 'dotenv';
dotenv.config();

import Parser from 'rss-parser';
import { Client } from 'pg';
import Groq from 'groq-sdk';

// Initialize Clients
const parser = new Parser();

const RSS_SOURCES = [
    "https://www.reddit.com/search.rss?q=nipah+virus&sort=new"
];

const SYSTEM_PROMPT = `You are a crisis epidemiologist tracking the 2026 Nipah Virus outbreak. 
Extract structured data from the provided news text.
Return JSON ONLY with this schema:
{
  "events": [
    {
      "source_url": "string (original url)",
      "date": "ISO8601 string",
      "location": "string (specific place)",
      "admin_level": "National" | "State" | "District" | "City",
      "cases": number (confirmed count),
      "deaths": number,
      "status": "CONFIRMED" | "SUSPECTED" | "DISCARDED",
      "confidence_score": number (0.0 to 1.0),
      "raw_snippet": "string (exact quote supporting the extraction)"
    }
  ]
}
If no relevant Nipah cases are found, return { "events": [] }.`;

async function run() {
    console.log("Running Ingestion Verification (Groq)...");

    if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL missing");
    if (!process.env.GROQ_API_KEY) throw new Error("GROQ_API_KEY missing");

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const db = new Client({ connectionString: process.env.DATABASE_URL });

    try {
        // Only test Groq connectivity and one feed item, don't write to DB to avoid dupes/spam
        // Or write to DB if we want full E2E. Let's do a read-only test or a dry-run.

        console.log("Checking Groq Connection...");
        const models = await groq.models.list();
        console.log(`Connected to Groq! Available models: ${models.data.length}`);

        console.log("Fetching RSS Feed...");
        const feed = await parser.parseURL(RSS_SOURCES[0]);
        console.log(`Fetched ${feed.items.length} items from Google News.`);

        if (feed.items.length > 0) {
            const item = feed.items[0];
            console.log(`Processing Item: ${item.title}`);

            const textContent = `${item.title}\n${item.contentSnippet || item.content?.substring(0, 500)}`;

            console.log("Sending to Groq Llama 3.1...");
            const completion = await groq.chat.completions.create({
                model: "llama-3.1-8b-instant",
                messages: [
                    { role: "system", content: SYSTEM_PROMPT },
                    { role: "user", content: `Source URL: ${item.link}\n\nContent:\n${textContent}` }
                ],
                response_format: { type: "json_object" }
            });

            const result = JSON.parse(completion.choices[0]?.message?.content || '{}');
            console.log("Groq Extraction Result:", JSON.stringify(result, null, 2));
        }

    } catch (error) {
        console.error("Verification Failed:", error);
    } finally {
        await db.end();
    }
}

run();
