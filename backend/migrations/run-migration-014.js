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
    
    const sql = fs.readFileSync(
      path.join(__dirname, '014_add_two_factor_auth.sql'),
      'utf8'
    );
    
    await client.query(sql);
    
    await client.query('COMMIT');
    console.log('Migration 014 completed successfully: Added 2FA columns to users table');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Migration 014 failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration().catch(console.error);

