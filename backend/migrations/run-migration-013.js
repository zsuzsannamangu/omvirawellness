const fs = require('fs');
const path = require('path');
const pool = require('../src/db');

async function runMigration() {
  const client = await pool.connect();
  
  try {
    console.log('Starting migration 013: Add profile visits tracking table...');
    
    // Read and execute the migration SQL
    const migrationSQL = fs.readFileSync(
      path.join(__dirname, '013_add_profile_visits_table.sql'),
      'utf8'
    );
    
    await client.query('BEGIN');
    await client.query(migrationSQL);
    await client.query('COMMIT');
    
    console.log('✓ Migration 013 completed successfully!');
    console.log('✓ Created profile_visits table');
    console.log('✓ Added indexes for performance');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('✗ Migration 013 failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration()
  .then(() => {
    console.log('\nMigration complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\nMigration failed:', error);
    process.exit(1);
  });
