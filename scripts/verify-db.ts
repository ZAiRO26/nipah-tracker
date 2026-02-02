import { Client } from 'pg';
import { config } from 'dotenv';
config();

async function verify() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL
    });

    try {
        await client.connect();
        const res = await client.query('SELECT * FROM outbreak_events');
        console.log(`\n🔍 Verification Check: Found ${res.rowCount} records.`);
        res.rows.forEach(row => {
            console.log(` - [${row.status}] ${row.location}: ${row.cases} cases`);
        });
    } catch (error) {
        console.error("Verification failed:", error);
    } finally {
        await client.end();
    }
}

verify();
