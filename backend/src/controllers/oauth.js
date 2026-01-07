const pool = require('../db');
const { generateToken } = require('../utils/jwt');
const bcrypt = require('bcrypt');

/**
 * Handle Google OAuth callback
 * Creates or logs in user with Google account
 */
async function handleGoogleCallback(req, res) {
  try {
    const { id, displayName, emails, photos } = req.user;
    const email = emails[0].value;
    const profilePhoto = photos && photos[0] ? photos[0].value : null;
    const name = displayName || '';

    if (!email) {
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=no_email`);
    }

    // Check if user exists with this Google ID
    let userResult = await pool.query(
      'SELECT id, email, user_type, google_id FROM users WHERE google_id = $1',
      [id]
    );

    let user;

    if (userResult.rows.length > 0) {
      // User exists with Google ID - log them in
      user = userResult.rows[0];
    } else {
      // Check if user exists with this email
      const emailResult = await pool.query(
        'SELECT id, email, user_type, google_id FROM users WHERE email = $1',
        [email]
      );

      if (emailResult.rows.length > 0) {
        // User exists with email but no Google ID - link accounts
        user = emailResult.rows[0];
        await pool.query(
          'UPDATE users SET google_id = $1, last_login = CURRENT_TIMESTAMP WHERE id = $2',
          [id, user.id]
        );
      } else {
        // New user - need to determine user type from state parameter
        const userType = req.query.state || 'client'; // Default to client if not specified
        
        // Create new user
        const newUserResult = await pool.query(
          `INSERT INTO users (email, google_id, user_type, email_verified, password_hash)
           VALUES ($1, $2, $3, true, $4)
           RETURNING id, email, user_type`,
          [email, id, userType, null] // No password for OAuth users
        );

        user = newUserResult.rows[0];

        // Create profile based on user type
        if (userType === 'client') {
          const nameParts = name.split(' ');
          const firstName = nameParts[0] || '';
          const lastName = nameParts.slice(1).join(' ') || '';
          
          await pool.query(
            `INSERT INTO client_profiles (user_id, first_name, last_name, profile_photo_url)
             VALUES ($1, $2, $3, $4)`,
            [user.id, firstName, lastName, profilePhoto]
          );
        } else if (userType === 'provider') {
          await pool.query(
            `INSERT INTO provider_profiles (user_id, contact_name, profile_photo_url)
             VALUES ($1, $2, $3)`,
            [user.id, name, profilePhoto]
          );
        }
      }
    }

    // Update last login
    await pool.query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );

    // Fetch user profile for response and check if it's incomplete
    let profile = null;
    let isNewUser = false;
    
    if (user.user_type === 'client') {
      const profileResult = await pool.query(
        'SELECT first_name, last_name, phone_number, address_line1, city, state, profile_photo_url FROM client_profiles WHERE user_id = $1',
        [user.id]
      );
      if (profileResult.rows.length > 0) {
        profile = profileResult.rows[0];
        // Check if profile is incomplete (missing phone or address)
        isNewUser = !profile.phone_number || !profile.address_line1 || !profile.city || !profile.state;
      }
    } else if (user.user_type === 'provider') {
      const profileResult = await pool.query(
        `SELECT business_name, contact_name, phone_number, address_line1, city, state, business_type, profile_photo_url 
         FROM provider_profiles WHERE user_id = $1`,
        [user.id]
      );
      if (profileResult.rows.length > 0) {
        profile = profileResult.rows[0];
        // Check if profile is incomplete (missing required fields)
        isNewUser = !profile.phone_number || !profile.address_line1 || !profile.city || !profile.state || !profile.business_type;
      }
    }

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      user_type: user.user_type,
    });

    // Store token and user in localStorage via redirect with hash
    const userData = {
      id: user.id,
      email: user.email,
      user_type: user.user_type,
      email_verified: true,
      profile: profile,
    };

    // Redirect to profile completion if new OAuth user, otherwise to dashboard
    let redirectUrl;
    if (isNewUser) {
      // New OAuth user - redirect to dashboard Profile page to complete profile
      redirectUrl = user.user_type === 'provider' 
        ? `${process.env.FRONTEND_URL || 'http://localhost:3000'}/providers/dashboard/${user.id}?token=${encodeURIComponent(token)}&user=${encodeURIComponent(JSON.stringify(userData))}&complete_profile=true&section=profile`
        : `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard/${user.id}?token=${encodeURIComponent(token)}&user=${encodeURIComponent(JSON.stringify(userData))}&complete_profile=true&section=profile`;
    } else {
      // Existing user or complete profile - go to dashboard
      redirectUrl = user.user_type === 'provider' 
        ? `${process.env.FRONTEND_URL || 'http://localhost:3000'}/providers/dashboard/${user.id}?token=${encodeURIComponent(token)}&user=${encodeURIComponent(JSON.stringify(userData))}`
        : `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard/${user.id}?token=${encodeURIComponent(token)}&user=${encodeURIComponent(JSON.stringify(userData))}`;
    }

    res.redirect(redirectUrl);
  } catch (error) {
    console.error('Google OAuth error:', error);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=oauth_failed`);
  }
}

/**
 * Handle Facebook OAuth callback
 * Creates or logs in user with Facebook account
 */
async function handleFacebookCallback(req, res) {
  try {
    const { id, displayName, emails, photos } = req.user;
    const email = emails && emails[0] ? emails[0].value : null;
    const profilePhoto = photos && photos[0] ? photos[0].value : null;
    const name = displayName || '';

    // Facebook may not always provide email - handle this case
    if (!email) {
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=no_email`);
    }

    // Check if user exists with this Facebook ID
    let userResult = await pool.query(
      'SELECT id, email, user_type, facebook_id FROM users WHERE facebook_id = $1',
      [id]
    );

    let user;

    if (userResult.rows.length > 0) {
      // User exists with Facebook ID - log them in
      user = userResult.rows[0];
    } else {
      // Check if user exists with this email
      const emailResult = await pool.query(
        'SELECT id, email, user_type, facebook_id FROM users WHERE email = $1',
        [email]
      );

      if (emailResult.rows.length > 0) {
        // User exists with email but no Facebook ID - link accounts
        user = emailResult.rows[0];
        await pool.query(
          'UPDATE users SET facebook_id = $1, last_login = CURRENT_TIMESTAMP WHERE id = $2',
          [id, user.id]
        );
      } else {
        // New user - need to determine user type from state parameter
        const userType = req.query.state || 'client'; // Default to client if not specified
        
        // Create new user
        const newUserResult = await pool.query(
          `INSERT INTO users (email, facebook_id, user_type, email_verified, password_hash)
           VALUES ($1, $2, $3, true, $4)
           RETURNING id, email, user_type`,
          [email, id, userType, null] // No password for OAuth users
        );

        user = newUserResult.rows[0];

        // Create profile based on user type
        if (userType === 'client') {
          const nameParts = name.split(' ');
          const firstName = nameParts[0] || '';
          const lastName = nameParts.slice(1).join(' ') || '';
          
          await pool.query(
            `INSERT INTO client_profiles (user_id, first_name, last_name, profile_photo_url)
             VALUES ($1, $2, $3, $4)`,
            [user.id, firstName, lastName, profilePhoto]
          );
        } else if (userType === 'provider') {
          await pool.query(
            `INSERT INTO provider_profiles (user_id, contact_name, profile_photo_url)
             VALUES ($1, $2, $3)`,
            [user.id, name, profilePhoto]
          );
        }
      }
    }

    // Update last login
    await pool.query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );

    // Fetch user profile for response and check if it's incomplete
    let profile = null;
    let isNewUser = false;
    
    if (user.user_type === 'client') {
      const profileResult = await pool.query(
        'SELECT first_name, last_name, phone_number, address_line1, city, state, profile_photo_url FROM client_profiles WHERE user_id = $1',
        [user.id]
      );
      if (profileResult.rows.length > 0) {
        profile = profileResult.rows[0];
        // Check if profile is incomplete (missing phone or address)
        isNewUser = !profile.phone_number || !profile.address_line1 || !profile.city || !profile.state;
      }
    } else if (user.user_type === 'provider') {
      const profileResult = await pool.query(
        `SELECT business_name, contact_name, phone_number, address_line1, city, state, business_type, profile_photo_url 
         FROM provider_profiles WHERE user_id = $1`,
        [user.id]
      );
      if (profileResult.rows.length > 0) {
        profile = profileResult.rows[0];
        // Check if profile is incomplete (missing required fields)
        isNewUser = !profile.phone_number || !profile.address_line1 || !profile.city || !profile.state || !profile.business_type;
      }
    }

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      user_type: user.user_type,
    });

    // Store token and user in localStorage via redirect with hash
    const userData = {
      id: user.id,
      email: user.email,
      user_type: user.user_type,
      email_verified: true,
      profile: profile,
    };

    // Redirect to profile completion if new OAuth user, otherwise to dashboard
    let redirectUrl;
    if (isNewUser) {
      // New OAuth user - redirect to dashboard Profile page to complete profile
      redirectUrl = user.user_type === 'provider' 
        ? `${process.env.FRONTEND_URL || 'http://localhost:3000'}/providers/dashboard/${user.id}?token=${encodeURIComponent(token)}&user=${encodeURIComponent(JSON.stringify(userData))}&complete_profile=true&section=profile`
        : `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard/${user.id}?token=${encodeURIComponent(token)}&user=${encodeURIComponent(JSON.stringify(userData))}&complete_profile=true&section=profile`;
    } else {
      // Existing user or complete profile - go to dashboard
      redirectUrl = user.user_type === 'provider' 
        ? `${process.env.FRONTEND_URL || 'http://localhost:3000'}/providers/dashboard/${user.id}?token=${encodeURIComponent(token)}&user=${encodeURIComponent(JSON.stringify(userData))}`
        : `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard/${user.id}?token=${encodeURIComponent(token)}&user=${encodeURIComponent(JSON.stringify(userData))}`;
    }

    res.redirect(redirectUrl);
  } catch (error) {
    console.error('Facebook OAuth error:', error);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=oauth_failed`);
  }
}

module.exports = {
  handleGoogleCallback,
  handleFacebookCallback,
};
