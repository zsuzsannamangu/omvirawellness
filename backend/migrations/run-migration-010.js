// Run migration 010: Add space owner profile fields
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const pool = require('../src/db');

async function runMigration() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Starting migration 010: Add space owner profile fields...');
    
    // Read the migration file
    const migrationPath = path.join(__dirname, '010_add_space_owner_profile_fields.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Execute the migration
    await client.query(migrationSQL);
    
    console.log('✅ Migration 010 completed successfully!');
    console.log('\nAdded columns to space_owner_profiles:');
    console.log('  - bio');
    console.log('  - address_line1');
    console.log('  - address_line2');
    console.log('  - city');
    console.log('  - state');
    console.log('  - zip_code');
    console.log('  - country');
    console.log('  - profile_photo_url');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the migration
runMigration();
