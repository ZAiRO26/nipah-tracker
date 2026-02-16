
import { Client } from 'pg';
import { config } from 'dotenv';
config();

async function check() {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();

    console.log("--- 📊 TRACKER STATUS CHECK ---");

    // 1. Check Outbreak Events (Home Page Data)
    const events = await client.query(`
        SELECT count(*) as count, max(date) as last_update 
        FROM outbreak_events
    `);
    console.log(`\n🦠 Outbreak Events (Home Map/Stats):`);
    console.log(`   - Total Verified Events: ${events.rows[0].count}`);
    console.log(`   - Last Data Entry: ${events.rows[0].last_update}`);

    // Detail of last 3 events
    const lastEvents = await client.query(`
        SELECT date, location, cases, deaths, status, source_url 
        FROM outbreak_events 
        ORDER BY date DESC LIMIT 3
    `);
    lastEvents.rows.forEach(e => {
        console.log(`     > [${e.date ? new Date(e.date).toISOString().split('T')[0] : 'No Date'}] ${e.location}: ${e.cases} cases, ${e.deaths} deaths (${e.status})`);
    });

    // 2. Check News Articles (News Page)
    const news = await client.query(`
        SELECT count(*) as count, max(published_at) as last_update 
        FROM news_articles
    `);
    console.log(`\n📰 News Feed (News Page):`);
    console.log(`   - Total Articles: ${news.rows[0].count}`);
    console.log(`   - Last Article: ${news.rows[0].last_update}`);

    await client.end();
}

check();
