// migrations/run-migration.js
const fs = require('fs');
const path = require('path');
const pool = require('../src/db');

async function runMigration() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Starting database migration...');
    
    // Read the migration file
    const migrationPath = path.join(__dirname, '001_initial_schema.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Execute the migration
    await client.query(migrationSQL);
    
    console.log('✅ Migration completed successfully!');
    console.log('\nCreated tables:');
    console.log('  - users');
    console.log('  - client_profiles');
    console.log('  - provider_profiles');
    console.log('  - provider_services');
    console.log('  - provider_availability');
    console.log('  - provider_photos');
    console.log('  - space_owner_profiles');
    console.log('  - spaces');
    console.log('  - space_amenities');
    console.log('  - space_availability');
    console.log('  - space_photos');
    console.log('  - client_provider_bookings');
    console.log('  - provider_space_bookings');
    console.log('  - reviews');
    console.log('  - notifications');
    console.log('  - favorites');
    
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

