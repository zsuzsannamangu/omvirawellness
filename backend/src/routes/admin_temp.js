const { Router } = require('express');
const pool = require('../db');

const router = Router();

// SPACES FEATURE - COMMENTED OUT FOR MVP
// TEMPORARY ENDPOINT - List all space owners
/* router.get('/list-space-owners', async (req, res) => {
  try {
    console.log('Fetching all space owners...');

    const result = await pool.query(
      `SELECT u.id, u.email, u.user_type, u.created_at,
              sp.business_name, sp.contact_name
       FROM users u
       LEFT JOIN space_owner_profiles sp ON u.id = sp.user_id
       WHERE u.user_type = 'space_owner'
       ORDER BY u.created_at DESC`
    );

    res.json({ 
      count: result.rows.length,
      space_owners: result.rows 
    });
  } catch (error) {
    console.error('Error listing space owners:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});
*/

// TEMPORARY ENDPOINT - Check specific email
router.get('/check-email/:email', async (req, res) => {
  try {
    const { email } = req.params;
    console.log('Checking for email:', email);

    const result = await pool.query(
      `SELECT id, email, user_type, created_at 
       FROM users 
       WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.json({ 
        found: false,
        message: 'Email not found in database'
      });
    }

    res.json({ 
      found: true,
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Error checking email:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// TEMPORARY ENDPOINT - Search for users
router.get('/search-users/:email', async (req, res) => {
  try {
    const { email } = req.params;
    console.log('Searching for users with email containing:', email);

    const result = await pool.query(
      `SELECT id, email, user_type, created_at 
       FROM users 
       WHERE LOWER(email) LIKE LOWER($1)
       ORDER BY created_at DESC`,
      [`%${email}%`]
    );

    res.json({ 
      count: result.rows.length,
      users: result.rows 
    });
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// TEMPORARY ENDPOINT - List ALL users
router.get('/list-all-users', async (req, res) => {
  try {
    console.log('Fetching all users...');

    const result = await pool.query(
      `SELECT id, email, user_type, created_at
       FROM users
       ORDER BY created_at DESC`
    );

    res.json({ 
      count: result.rows.length,
      users: result.rows 
    });
  } catch (error) {
    console.error('Error listing users:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// TEMPORARY ENDPOINT - Delete ANY user by email (any user type)
router.delete('/delete-user/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const cleanEmail = email.trim().toLowerCase();
    console.log('Attempting to delete user with email:', cleanEmail);

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      // Get user_id first (case-insensitive search)
      const userResult = await client.query(
        'SELECT id, email, user_type FROM users WHERE LOWER(TRIM(email)) = $1',
        [cleanEmail]
      );
      
      if (userResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ 
          error: 'No user found with that email',
          searchedFor: cleanEmail
        });
      }
      
      const user = userResult.rows[0];
      console.log('Found user:', user.email, 'type:', user.user_type);

      // Delete from appropriate profile table based on user type
      // SPACES FEATURE - COMMENTED OUT FOR MVP
      // if (user.user_type === 'space_owner') {
      //   await client.query('DELETE FROM space_owner_profiles WHERE user_id = $1', [user.id]);
      // } else 
      if (user.user_type === 'provider') {
        await client.query('DELETE FROM provider_profiles WHERE user_id = $1', [user.id]);
      } else if (user.user_type === 'client') {
        await client.query('DELETE FROM client_profiles WHERE user_id = $1', [user.id]);
      }

      // Delete user
      await client.query('DELETE FROM users WHERE id = $1', [user.id]);
      
      await client.query('COMMIT');
      
      res.json({ 
        success: true, 
        message: `Successfully deleted ${user.user_type} user: ${user.email}`
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// SPACES FEATURE - COMMENTED OUT FOR MVP
// TEMPORARY ENDPOINT - Remove after use (case-insensitive) - SPACE OWNERS ONLY
/* router.delete('/delete-space-owner/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const cleanEmail = email.trim().toLowerCase();
    console.log('Attempting to delete space owner with email:', cleanEmail);

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      // Get user_id first (case-insensitive search)
      const userResult = await client.query(
        'SELECT id, email FROM users WHERE LOWER(TRIM(email)) = $1',
        [cleanEmail]
      );
      
      if (userResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ 
          error: 'No user found with that email',
          searchedFor: cleanEmail
        });
      }
      
      console.log('Found user:', userResult.rows[0].email);
      
      const userId = userResult.rows[0].id;
      console.log('Found user with ID:', userId);
      
      // Delete space owner profile
      const profileResult = await client.query(
        'DELETE FROM space_owner_profiles WHERE user_id = $1 RETURNING *',
        [userId]
      );
      console.log('Deleted space owner profile:', profileResult.rowCount, 'rows');
      
      // Delete user
      const deleteResult = await client.query(
        'DELETE FROM users WHERE id = $1 RETURNING *',
        [userId]
      );
      console.log('Deleted user:', deleteResult.rowCount, 'rows');
      
      await client.query('COMMIT');
      
      res.json({ 
        success: true, 
        message: 'Successfully deleted space owner account',
        deleted: {
          profiles: profileResult.rowCount,
          users: deleteResult.rowCount
        }
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error deleting space owner:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});
*/

module.exports = router;

