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

        // Fetch aggregated stats
        const statsRes = await client.query(`
        SELECT 
            SUM(cases) as total_cases,
            SUM(deaths) as total_deaths,
            COUNT(DISTINCT location) as active_clusters,
            MAX(date) as last_updated
        FROM outbreak_events
    `);

        // Fetch confirmed/suspected events
        const eventsRes = await client.query(`
        SELECT * FROM outbreak_events 
        ORDER BY date DESC 
        LIMIT 50
    `);

        const stats = {
            totalCases: parseInt(statsRes.rows[0].total_cases || '0'),
            totalDeaths: parseInt(statsRes.rows[0].total_deaths || '0'),
            activeClusters: parseInt(statsRes.rows[0].active_clusters || '0'),
            lastUpdated: statsRes.rows[0].last_updated || new Date().toISOString()
        };

        return new Response(JSON.stringify({
            stats,
            events: eventsRes.rows
        }), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        });

    } catch (error) {
        console.error("DB Error:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch data" }), { status: 500 });
    } finally {
        await client.end();
    }
}
