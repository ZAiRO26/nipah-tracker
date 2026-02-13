
import { Client } from 'pg';
import { config } from 'dotenv';
import fs from 'fs';
config();

async function inspect() {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();

    const events = await client.query(`SELECT id, location, date, status, raw_snippet, source_url FROM outbreak_events ORDER BY date DESC LIMIT 20`);
    const news = await client.query(`SELECT id, title, published_at, source_name FROM news_articles ORDER BY published_at DESC LIMIT 20`);

    const dump = {
        outbreak_events: events.rows,
        news_articles: news.rows
    };

    fs.writeFileSync('db_dump.json', JSON.stringify(dump, null, 2));
    console.log("Dump written to db_dump.json");

    await client.end();
}

inspect();
