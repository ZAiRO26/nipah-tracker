import dotenv from 'dotenv';
dotenv.config();

import { Client } from 'pg';

async function run() {
    const db = new Client({
        connectionString: process.env.DATABASE_URL
    });

    try {
        await db.connect();
        console.log("Connected to Neon DB for Source Fix...");

        // Fix 1: Update WHO DON Link
        const res1 = await db.query(`
      UPDATE outbreak_events 
      SET source_url = 'https://www.who.int/emergencies/disease-outbreak-news/item/2026-DON593'
      WHERE source_url LIKE '%who.int/don-593%' OR location = 'North 24 Parganas, West Bengal';
    `);
        console.log(`Updated WHO Link: ${res1.rowCount} rows.`);

        // Fix 2: Update NCDC/Manual Link
        // The user mentioned "Manual Baseline Injection" often has a placeholder or the ncdc link.
        // Let's replace the placeholder or broken ncdc link with a real one or the Dashboard URL.
        const res2 = await db.query(`
      UPDATE outbreak_events 
      SET source_url = 'https://ncdc.mohfw.gov.in/index.php' 
      WHERE source_url LIKE '%ncdc.mohfw.gov.in/initial-report%';
    `);
        console.log(`Updated NCDC Link: ${res2.rowCount} rows.`);

    } catch (error) {
        console.error("Fix failed:", error);
    } finally {
        await db.end();
    }
}

run();
