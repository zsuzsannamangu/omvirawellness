require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const emailToDelete = process.argv[2];

if (!emailToDelete) {
  console.error('Please provide an email address to delete');
  console.log('Usage: node delete-user.js <email>');
  process.exit(1);
}

async function deleteUser() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // First, get the user ID
    const userResult = await client.query(
      'SELECT id, user_type FROM users WHERE email = $1',
      [emailToDelete]
    );
    
    if (userResult.rows.length === 0) {
      console.log(`❌ User with email ${emailToDelete} not found`);
      await client.query('ROLLBACK');
      return;
    }
    
    const userId = userResult.rows[0].id;
    const userType = userResult.rows[0].user_type;
    
    console.log(`Found user: ${emailToDelete} (${userType})`);
    
    // Delete profile based on user type
    if (userType === 'client') {
      await client.query('DELETE FROM client_profiles WHERE user_id = $1', [userId]);
      console.log('✅ Deleted client profile');
    } else if (userType === 'provider') {
      await client.query('DELETE FROM provider_profiles WHERE user_id = $1', [userId]);
      console.log('✅ Deleted provider profile');
    } else if (userType === 'space_owner') {
      await client.query('DELETE FROM space_owner_profiles WHERE user_id = $1', [userId]);
      console.log('✅ Deleted space owner profile');
    }
    
    // Delete the user (this will cascade delete related data)
    await client.query('DELETE FROM users WHERE id = $1', [userId]);
    console.log('✅ Deleted user');
    
    await client.query('COMMIT');
    console.log(`✅ Successfully deleted user: ${emailToDelete}`);
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error deleting user:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

deleteUser();

