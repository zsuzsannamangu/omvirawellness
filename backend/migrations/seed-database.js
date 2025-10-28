// migrations/seed-database.js
const fs = require('fs');
const path = require('path');
const pool = require('../src/db');

async function seedDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('🌱 Starting database seeding...');
    
    // Read the seed data file
    const seedPath = path.join(__dirname, 'seed-data.sql');
    const seedSQL = fs.readFileSync(seedPath, 'utf8');
    
    // Execute the seed data
    await client.query(seedSQL);
    
    console.log('✅ Seed data inserted successfully!');
    console.log('\nTest accounts created:');
    console.log('  📧 Client: client@test.com (password: password123)');
    console.log('  📧 Provider 1: provider1@test.com (password: password123)');
    console.log('  📧 Provider 2: provider2@test.com (password: password123)');
    console.log('  📧 Space Owner: space@test.com (password: password123)');
    console.log('\n✨ You can now test the application with these accounts!');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the seeding
seedDatabase();

