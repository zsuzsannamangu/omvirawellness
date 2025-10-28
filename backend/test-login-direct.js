// test-login-direct.js - Test login directly
const bcrypt = require('bcrypt');
const pool = require('./src/db');

async function testLogin() {
  try {
    console.log('Testing login with client@test.com...\n');
    
    const result = await pool.query(
      'SELECT email, password_hash FROM users WHERE email = $1',
      ['client@test.com']
    );
    
    if (result.rows.length === 0) {
      console.log('❌ User not found');
      return;
    }
    
    const user = result.rows[0];
    console.log('✅ User found:');
    console.log('  Email:', user.email);
    console.log('  Password hash:', user.password_hash.substring(0, 30) + '...');
    
    // Test password
    const testPassword = 'password123';
    const isValid = await bcrypt.compare(testPassword, user.password_hash);
    console.log('  Password valid:', isValid);
    
    if (isValid) {
      console.log('\n✅ Login should work!');
    } else {
      console.log('\n❌ Password mismatch!');
      console.log('   Need to update password hash...');
      
      const newHash = await bcrypt.hash(testPassword, 10);
      await pool.query(
        'UPDATE users SET password_hash = $1 WHERE email = $2',
        [newHash, 'client@test.com']
      );
      console.log('✅ Password hash updated!');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

testLogin();

