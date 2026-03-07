import { Client } from 'pg';
import { config } from 'dotenv';
import fs from 'fs';
config();

async function inspect() {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();

    // Latest 15 news articles
    const news = await client.query(`
        SELECT id, title, summary, source_url, published_at, source_name, category, confidence_score 
        FROM news_articles 
        ORDER BY published_at DESC 
        LIMIT 15
    `);

    // Count total
    const count = await client.query(`SELECT count(*) as total FROM news_articles`);

    // Date range
    const range = await client.query(`
        SELECT min(published_at) as oldest, max(published_at) as newest 
        FROM news_articles
    `);

    const dump = {
        total_articles: count.rows[0].total,
        date_range: { oldest: range.rows[0].oldest, newest: range.rows[0].newest },
        latest_15: news.rows
    };

    fs.writeFileSync('news_dump.json', JSON.stringify(dump, null, 2));
    console.log("News dump written to news_dump.json");
    console.log(`Total: ${count.rows[0].total}, Newest: ${range.rows[0].newest}`);

    await client.end();
}

inspect();
