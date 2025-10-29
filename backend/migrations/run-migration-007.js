require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function runMigration() {
  const client = await pool.connect();
  try {
    const sql = fs.readFileSync(path.join(__dirname, '007_add_provider_certifications.sql'), 'utf8');
    await client.query(sql);
    console.log('Migration 007 completed successfully: Added certifications column to provider_profiles');
  } catch (error) {
    console.error('Migration 007 failed:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration();

