import { Client } from 'pg';
import { config } from 'dotenv';
config();

async function initDB() {
    if (!process.env.DATABASE_URL) {
        console.error("❌ DATABASE_URL is not set");
        process.exit(1);
    }

    const client = new Client({
        connectionString: process.env.DATABASE_URL
    });

    try {
        await client.connect();
        console.log("🔌 Connected to DB. Creating 'news_articles' table...");

        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS news_articles (
                id SERIAL PRIMARY KEY,
                title TEXT NOT NULL,
                summary TEXT,
                source_url TEXT UNIQUE NOT NULL,
                published_at TIMESTAMP NOT NULL,
                image_url TEXT,
                source_name TEXT,
                category TEXT DEFAULT 'General', 
                confidence_score FLOAT DEFAULT 0.5,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

        await client.query(createTableQuery);
        console.log("✅ Table 'news_articles' created/verified.");

    } catch (error) {
        console.error("❌ DB Init failed:", error);
    } finally {
        await client.end();
    }
}

initDB();
