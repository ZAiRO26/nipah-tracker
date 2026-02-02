import type { APIRoute } from 'astro';
import { Client } from 'pg';

export const GET: APIRoute = async () => {
    if (!import.meta.env.DATABASE_URL) {
        return new Response(JSON.stringify({ error: "DATABASE_URL not set" }), { status: 500 });
    }

    const client = new Client({
        connectionString: import.meta.env.DATABASE_URL
    });

    try {
        await client.connect();

        // Fetch all events sorted by date
        const eventsRes = await client.query(`
        SELECT * FROM outbreak_events 
        ORDER BY date DESC
    `);

        return new Response(JSON.stringify(eventsRes.rows), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30"
            }
        });

    } catch (error) {
        console.error("DB Error:", error);
        // Fallback: Return empty array to keep UI stable (0 cases) instead of crashing
        return new Response(JSON.stringify([]), { status: 200, headers: { "Content-Type": "application/json" } });
    } finally {
        await client.end();
    }
}
