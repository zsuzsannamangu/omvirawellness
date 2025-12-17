// Run migration 011: Add messages table
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const pool = require('../src/db');

async function runMigration() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Starting migration 011: Add messages table...');
    
    // Read the migration file
    const migrationPath = path.join(__dirname, '011_add_messages_table.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Execute the migration
    await client.query(migrationSQL);
    
    console.log('✅ Migration 011 completed successfully!');
    console.log('\nCreated table:');
    console.log('  - messages');
    console.log('\nCreated indexes:');
    console.log('  - idx_messages_sender');
    console.log('  - idx_messages_recipient');
    console.log('  - idx_messages_folder');
    console.log('  - idx_messages_is_read');
    console.log('  - idx_messages_is_starred');
    console.log('  - idx_messages_is_deleted');
    console.log('  - idx_messages_created_at');
    console.log('\nCreated trigger:');
    console.log('  - trigger_update_messages_updated_at');
    
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
