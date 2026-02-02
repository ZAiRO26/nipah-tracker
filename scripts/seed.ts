import { Client } from 'pg';
import { config } from 'dotenv';
config();

const SEED_DATA = [
    {
        source_url: 'https://ncdc.mohfw.gov.in/index.php',
        date: '2026-01-30',
        location: 'Barasat, West Bengal',
        admin_level: 'City',
        cases: 2,
        deaths: 0,
        status: 'CONFIRMED',
        confidence_score: 1.0,
        raw_snippet: 'Manual Baseline Injection'
    },
    {
        source_url: 'https://www.who.int/emergencies/disease-outbreak-news/item/2026-DON593',
        date: '2026-02-01',
        location: 'North 24 Parganas, West Bengal',
        admin_level: 'District',
        cases: 0,
        deaths: 0,
        status: 'SUSPECTED',
        confidence_score: 0.8,
        raw_snippet: 'WHO DON Report 593'
    }
];

async function seed() {
    if (!process.env.DATABASE_URL) {
        console.error("❌ DATABASE_URL is not set in .env");
        process.exit(1);
    }

    const client = new Client({
        connectionString: process.env.DATABASE_URL
    });

    try {
        await client.connect();
        console.log("🌱 Connected to Database. Seeding baseline data...");

        for (const data of SEED_DATA) {
            const query = `
                INSERT INTO outbreak_events 
                (source_url, date, location, admin_level, cases, deaths, status, confidence_score, raw_snippet)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                ON CONFLICT (source_url) DO NOTHING;
            `;

            await client.query(query, [
                data.source_url,
                data.date,
                data.location,
                data.admin_level,
                data.cases,
                data.deaths,
                data.status,
                data.confidence_score,
                data.raw_snippet
            ]);
            console.log(`✅ Inserted: ${data.location} (${data.status})`);
        }

        console.log("🚀 Seeding Complete.");

    } catch (error) {
        console.error("❌ Seeding failed:", error);
    } finally {
        await client.end();
    }
}

seed();
