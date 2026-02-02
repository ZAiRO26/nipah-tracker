import { Client } from 'pg';
import { config } from 'dotenv';
config();

const SEED_NEWS = [
    {
        title: "Nipah virus outbreak in Kerala: What we know so far",
        summary: "Kerala reports 2 confirmed cases. Health ministry issues high alert in Kozhikode district.",
        source_url: "https://www.who.int/emergencies/disease-outbreak-news/item/2026-DON593-MOCK",
        published_at: new Date().toISOString(),
        source_name: "WHO",
        category: "Official",
        confidence_score: 0.99
    },
    {
        title: "West Bengal on alert following Nipah reports",
        summary: "State health department ramps up surveillance in border districts after neighboring outbreaks.",
        source_url: "https://timesofindia.indiatimes.com/city/kolkata/health/nipah-alert-mock",
        published_at: new Date(Date.now() - 86400000).toISOString(),
        source_name: "Times of India",
        category: "News",
        confidence_score: 0.85
    },
    {
        title: "Reddit Thread: Unusual fever cases in MyMensingh?",
        summary: "Local discussion about cluster of encephalitis cases. Unverified but matching NiV symptoms.",
        source_url: "https://reddit.com/r/bangladesh/comments/mock-thread",
        published_at: new Date(Date.now() - 3600000).toISOString(),
        source_name: "r/Bangladesh",
        category: "Social",
        confidence_score: 0.45
    }
];

async function seedNews() {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    try {
        await client.connect();
        console.log("🌱 Seeding News...");

        for (const art of SEED_NEWS) {
            await client.query(`
                INSERT INTO news_articles 
                (title, summary, source_url, published_at, source_name, category, confidence_score)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                ON CONFLICT (source_url) DO NOTHING
            `, [
                art.title, maxSummary(art.summary), art.source_url, art.published_at, art.source_name, art.category, art.confidence_score
            ]);
            console.log(`✅ Saved: ${art.title}`);
        }
    } catch (e) {
        console.error("Seed Failed:", e);
    } finally {
        await client.end();
    }
}

function maxSummary(s: string) {
    return s.length > 200 ? s.substring(0, 197) + '...' : s;
}

seedNews();
