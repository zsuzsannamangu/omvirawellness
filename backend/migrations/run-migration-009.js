const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function runMigration() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const sqlPath = path.join(__dirname, '009_add_provider_client_notes.sql');
    console.log('Reading SQL from:', sqlPath);
    const sql = fs.readFileSync(sqlPath, 'utf8');
    await client.query(sql);
    
    await client.query('COMMIT');
    console.log('Migration 009 completed successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Migration 009 failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration().catch(console.error);

