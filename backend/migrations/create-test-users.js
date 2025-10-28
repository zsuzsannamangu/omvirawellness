// create-test-users.js - Create test users with properly hashed passwords
const bcrypt = require('bcrypt');
const pool = require('../src/db');

async function createTestUsers() {
  try {
    console.log('🔐 Creating test users with hashed passwords...\n');
    
    const saltRounds = 10;
    
    // Hash password
    const passwordHash = await bcrypt.hash('password123', saltRounds);
    
    // Client
    const clientUser = await pool.query(
      `INSERT INTO users (id, email, password_hash, user_type, email_verified) 
       VALUES ($1, $2, $3, $4, $5) 
       ON CONFLICT (id) DO UPDATE SET password_hash = EXCLUDED.password_hash
       RETURNING email, user_type`,
      ['11111111-1111-1111-1111-111111111111', 'client@test.com', passwordHash, 'client', true]
    );
    console.log('✅ Client user:', clientUser.rows[0].email);
    
    // Provider 1
    const provider1User = await pool.query(
      `INSERT INTO users (id, email, password_hash, user_type, email_verified) 
       VALUES ($1, $2, $3, $4, $5) 
       ON CONFLICT (id) DO UPDATE SET password_hash = EXCLUDED.password_hash
       RETURNING email, user_type`,
      ['22222222-2222-2222-2222-222222222222', 'provider1@test.com', passwordHash, 'provider', true]
    );
    console.log('✅ Provider 1:', provider1User.rows[0].email);
    
    // Provider 2
    const provider2User = await pool.query(
      `INSERT INTO users (id, email, password_hash, user_type, email_verified) 
       VALUES ($1, $2, $3, $4, $5) 
       ON CONFLICT (id) DO UPDATE SET password_hash = EXCLUDED.password_hash
       RETURNING email, user_type`,
      ['33333333-3333-3333-3333-333333333333', 'provider2@test.com', passwordHash, 'provider', true]
    );
    console.log('✅ Provider 2:', provider2User.rows[0].email);
    
    // Space Owner
    const spaceUser = await pool.query(
      `INSERT INTO users (id, email, password_hash, user_type, email_verified) 
       VALUES ($1, $2, $3, $4, $5) 
       ON CONFLICT (id) DO UPDATE SET password_hash = EXCLUDED.password_hash
       RETURNING email, user_type`,
      ['44444444-4444-4444-4444-444444444444', 'space@test.com', passwordHash, 'space_owner', true]
    );
    console.log('✅ Space owner:', spaceUser.rows[0].email);
    
    console.log('\n✨ All test users created with password: password123');
    console.log('🔒 Passwords are now properly hashed with bcrypt!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

createTestUsers();

