// check-database.js
const pool = require('./src/db');

async function checkDatabase() {
  try {
    console.log('📊 Checking database...\n');
    
    // Check users
    const usersResult = await pool.query('SELECT email, user_type, created_at FROM users ORDER BY created_at');
    console.log('👥 Users in database:');
    usersResult.rows.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.email} (${user.user_type})`);
    });
    
    // Count records in key tables
    const [providers, spaces, bookings, reviews] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM provider_profiles'),
      pool.query('SELECT COUNT(*) FROM spaces'),
      pool.query('SELECT COUNT(*) FROM client_provider_bookings'),
      pool.query('SELECT COUNT(*) FROM reviews'),
    ]);
    
    console.log('\n📈 Database Statistics:');
    console.log(`  • Providers: ${providers.rows[0].count}`);
    console.log(`  • Spaces: ${spaces.rows[0].count}`);
    console.log(`  • Bookings: ${bookings.rows[0].count}`);
    console.log(`  • Reviews: ${reviews.rows[0].count}`);
    
    console.log('\n✅ Database is ready!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkDatabase();

