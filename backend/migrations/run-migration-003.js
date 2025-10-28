const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function runMigration() {
  try {
    await client.connect();
    console.log('Connected to database');

    const sql = fs.readFileSync(
      path.join(__dirname, '003_add_provider_profile_fields.sql'),
      'utf8'
    );

    await client.query(sql);
    console.log('Migration 003 completed successfully');

    await client.end();
  } catch (error) {
    console.error('Migration failed:', error);
    await client.end();
    process.exit(1);
  }
}

runMigration();
