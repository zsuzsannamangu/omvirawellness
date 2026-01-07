// Run migration 014: Add OAuth provider IDs
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('localhost') ? false : { rejectUnauthorized: false }
});

async function runMigration() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const migrationSQL = fs.readFileSync(
      path.join(__dirname, '014_add_oauth_provider_ids.sql'),
      'utf8'
    );
    
    await client.query(migrationSQL);
    
    await client.query('COMMIT');
    console.log('✅ Migration 014 completed successfully: Added OAuth provider IDs');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Migration 014 failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration().catch(console.error);
