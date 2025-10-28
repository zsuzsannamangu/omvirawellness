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
    await client.query('BEGIN');
    
    const sql = fs.readFileSync(
      path.join(__dirname, '002_add_client_profile_fields.sql'),
      'utf8'
    );
    
    await client.query(sql);
    
    await client.query('COMMIT');
    
    console.log('✅ Migration 002 executed successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Migration 002 failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration();

