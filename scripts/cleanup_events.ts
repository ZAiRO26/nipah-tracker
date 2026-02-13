
import { Client } from 'pg';
import { config } from 'dotenv';
config();

async function cleanup() {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();

    try {
        console.log("🧹 Starting cleanup of outbreak_events...");

        // 1. Delete Reddit entries
        const resReddit = await client.query(`
            DELETE FROM outbreak_events 
            WHERE source_url ILIKE '%reddit.com%'
        `);
        console.log(`🗑️ Deleted ${resReddit.rowCount} entries from Reddit.`);

        // 2. Delete Google News entries
        const resGoogle = await client.query(`
            DELETE FROM outbreak_events 
            WHERE source_url ILIKE '%news.google.com%' OR source_url ILIKE '%google.com%'
        `);
        console.log(`🗑️ Deleted ${resGoogle.rowCount} entries from Google News.`);

        // 3. Delete any events with "MOCK" in source_url (if any leaked from seed_news logic)
        const resMock = await client.query(`
            DELETE FROM outbreak_events 
            WHERE source_url ILIKE '%MOCK%'
        `);
        console.log(`🗑️ Deleted ${resMock.rowCount} entries with MOCK URL.`);

        console.log("✅ Cleanup complete.");
    } catch (e) {
        console.error("Cleanup failed:", e);
    } finally {
        await client.end();
    }
}

cleanup();
