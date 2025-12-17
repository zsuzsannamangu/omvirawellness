// Run migration 012: Add message_user_metadata table
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const pool = require('../src/db');

async function runMigration() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Starting migration 012: Add message_user_metadata table...');
    
    // Read the migration file
    const migrationPath = path.join(__dirname, '012_add_message_user_metadata.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Execute the migration
    await client.query(migrationSQL);
    
    console.log('✅ Migration 012 completed successfully!');
    console.log('\nCreated table:');
    console.log('  - message_user_metadata');
    console.log('\nCreated indexes:');
    console.log('  - idx_message_user_metadata_message_id');
    console.log('  - idx_message_user_metadata_user_id');
    console.log('  - idx_message_user_metadata_is_read');
    console.log('  - idx_message_user_metadata_is_starred');
    console.log('  - idx_message_user_metadata_is_deleted');
    console.log('\nCreated trigger:');
    console.log('  - trigger_update_message_user_metadata_updated_at');
    console.log('\nMigrated existing message data to per-user metadata.');
    
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
