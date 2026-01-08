const fs = require('fs');
const pool = require('../src/db');

(async () => {
  const client = await pool.connect();
  try {
    console.log('🚀 Running migration 004: Add specialties and fix provider profile fields...');
    
    const sql = fs.readFileSync('./migrations/004_fix_provider_profile_fields.sql', 'utf8');
    await client.query(sql);
    
    console.log('✅ Migration 004 completed successfully!');
    console.log('Added columns: work_location (JSONB), services (JSONB), specialties (TEXT), team_members (JSONB)');
  } catch (e) {
    console.error('❌ Error:', e.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
})();
