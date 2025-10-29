const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function runMigration() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const migrationSql = fs.readFileSync(
      path.join(__dirname, '006_add_provider_add_ons.sql'),
      'utf8'
    );
    
    await client.query(migrationSql);
    
    await client.query('COMMIT');
    console.log('Migration 006 completed successfully: Added add_ons column to provider_profiles');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Migration 006 failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration().catch(console.error);

