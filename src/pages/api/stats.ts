
import type { APIRoute } from 'astro';
import { Client } from 'pg';

export const GET: APIRoute = async () => {
    let client;
    try {
        client = new Client({ connectionString: import.meta.env.DATABASE_URL });
        await client.connect();

        const res = await client.query(`
            SELECT * FROM outbreak_events 
            WHERE date >= '2025-11-01'
            ORDER BY date DESC 
            LIMIT 50
        `);

        return new Response(JSON.stringify(res.rows), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Error fetching stats" }), { status: 500 });
    } finally {
        if (client) await client.end();
    }
}
