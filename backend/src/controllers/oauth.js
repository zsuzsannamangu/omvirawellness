const pool = require('../db');
const { generateToken } = require('../utils/jwt');
const bcrypt = require('bcrypt');

/**
 * Handle Google OAuth callback
 * Creates or logs in user with Google account
 */
async function handleGoogleCallback(req, res) {
  try {
    console.log('Google OAuth callback received');
    console.log('req.user:', req.user ? 'exists' : 'missing');
    
    if (!req.user) {
      console.error('No user object in request');
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/providers/signup?error=oauth_no_user`);
    }

    const { id, displayName, emails, photos } = req.user;
    console.log('Profile data:', { id, displayName, hasEmails: !!emails, hasPhotos: !!photos });
    
    if (!emails || !emails[0] || !emails[0].value) {
      console.error('No email in Google profile');
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/providers/signup?error=no_email`);
    }
    
    const email = emails[0].value;
    const profilePhoto = photos && photos[0] ? photos[0].value : null;
    const name = displayName || '';

    console.log('Processing OAuth for:', email);

    // Get requested user type from state parameter
    const requestedUserType = req.query.state || 'client';
    console.log('Requested user type:', requestedUserType);

    // Check if user exists with this Google ID
    let userResult = await pool.query(
      'SELECT id, email, user_type, google_id FROM users WHERE google_id = $1',
      [id]
    );

    let user;

    if (userResult.rows.length > 0) {
      // User exists with Google ID - check if user type matches
      user = userResult.rows[0];
      if (user.user_type !== requestedUserType) {
        console.error(`User type mismatch: existing=${user.user_type}, requested=${requestedUserType}`);
        const signupPath = requestedUserType === 'provider' 
          ? '/providers/signup' 
          : '/signup';
        return res.redirect(
          `${process.env.FRONTEND_URL || 'http://localhost:3000'}${signupPath}?error=account_type_mismatch&existing_type=${user.user_type}`
        );
      }
    } else {
      // Check if user exists with this email
      const emailResult = await pool.query(
        'SELECT id, email, user_type, google_id FROM users WHERE email = $1',
        [email]
      );

      if (emailResult.rows.length > 0) {
        // User exists with email but no Google ID - check user type match
        user = emailResult.rows[0];
        if (user.user_type !== requestedUserType) {
          console.error(`User type mismatch: existing=${user.user_type}, requested=${requestedUserType}`);
          const signupPath = requestedUserType === 'provider' 
            ? '/providers/signup' 
            : '/join';
          return res.redirect(
            `${process.env.FRONTEND_URL || 'http://localhost:3000'}${signupPath}?error=account_type_mismatch&existing_type=${user.user_type}`
          );
        }
        // Link Google ID to existing account
        await pool.query(
          'UPDATE users SET google_id = $1, last_login = CURRENT_TIMESTAMP WHERE id = $2',
          [id, user.id]
        );
      } else {
        // New user - use requested user type
        const userType = requestedUserType;
        
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

    // Store minimal user data in localStorage via redirect - avoid HTTP 431 by not passing large profile data
    // The frontend will fetch the full profile data after login
    const minimalUserData = {
      id: user.id,
      email: user.email,
      user_type: user.user_type,
      email_verified: true,
    };

    // Redirect to profile completion if new OAuth user, otherwise to dashboard
    // Use hash fragment instead of query params to avoid URL length limits
    let redirectUrl;
    console.log('Determining redirect - isNewUser:', isNewUser, 'user_type:', user.user_type);
    if (isNewUser) {
      // New OAuth user - redirect to dashboard Profile page to complete profile
      // Store token and user data in hash fragment to avoid HTTP 431
      const hashData = {
        token: token,
        user: minimalUserData,
        complete_profile: true,
        section: 'profile'
      };
      redirectUrl = user.user_type === 'provider' 
        ? `${process.env.FRONTEND_URL || 'http://localhost:3000'}/providers/dashboard/${user.id}#${encodeURIComponent(JSON.stringify(hashData))}`
        : `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard/${user.id}#${encodeURIComponent(JSON.stringify(hashData))}`;
      console.log('Redirecting NEW USER to profile completion (using hash)');
    } else {
      // Existing user or complete profile - go to dashboard
      const hashData = {
        token: token,
        user: minimalUserData
      };
      redirectUrl = user.user_type === 'provider' 
        ? `${process.env.FRONTEND_URL || 'http://localhost:3000'}/providers/dashboard/${user.id}#${encodeURIComponent(JSON.stringify(hashData))}`
        : `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard/${user.id}#${encodeURIComponent(JSON.stringify(hashData))}`;
      console.log('Redirecting EXISTING USER to dashboard (using hash)');
    }

    res.redirect(redirectUrl);
  } catch (error) {
    console.error('Google OAuth error:', error);
    console.error('Error stack:', error.stack);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/providers/signup?error=oauth_failed&details=${encodeURIComponent(error.message)}`);
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

    // Get requested user type from state parameter
    const requestedUserType = req.query.state || 'client';

    // Check if user exists with this Facebook ID
    let userResult = await pool.query(
      'SELECT id, email, user_type, facebook_id FROM users WHERE facebook_id = $1',
      [id]
    );

    let user;

    if (userResult.rows.length > 0) {
      // User exists with Facebook ID - check if user type matches
      user = userResult.rows[0];
      if (user.user_type !== requestedUserType) {
        const signupPath = requestedUserType === 'provider' 
          ? '/providers/signup' 
          : '/signup';
        return res.redirect(
          `${process.env.FRONTEND_URL || 'http://localhost:3000'}${signupPath}?error=account_type_mismatch&existing_type=${user.user_type}`
        );
      }
    } else {
      // Check if user exists with this email
      const emailResult = await pool.query(
        'SELECT id, email, user_type, facebook_id FROM users WHERE email = $1',
        [email]
      );

      if (emailResult.rows.length > 0) {
        // User exists with email but no Facebook ID - check user type match
        user = emailResult.rows[0];
        if (user.user_type !== requestedUserType) {
          const signupPath = requestedUserType === 'provider' 
            ? '/providers/signup' 
            : '/join';
          return res.redirect(
            `${process.env.FRONTEND_URL || 'http://localhost:3000'}${signupPath}?error=account_type_mismatch&existing_type=${user.user_type}`
          );
        }
        // Link Facebook ID to existing account
        await pool.query(
          'UPDATE users SET facebook_id = $1, last_login = CURRENT_TIMESTAMP WHERE id = $2',
          [id, user.id]
        );
      } else {
        // New user - use requested user type
        const userType = requestedUserType;
        
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

    // Store minimal user data - avoid HTTP 431 by not passing large profile data
    // The frontend will fetch the full profile data after login
    const minimalUserData = {
      id: user.id,
      email: user.email,
      user_type: user.user_type,
      email_verified: true,
    };

    // Redirect to profile completion if new OAuth user, otherwise to dashboard
    // Use hash fragment instead of query params to avoid URL length limits
    let redirectUrl;
    if (isNewUser) {
      // New OAuth user - redirect to dashboard Profile page to complete profile
      const hashData = {
        token: token,
        user: minimalUserData,
        complete_profile: true,
        section: 'profile'
      };
      redirectUrl = user.user_type === 'provider' 
        ? `${process.env.FRONTEND_URL || 'http://localhost:3000'}/providers/dashboard/${user.id}#${encodeURIComponent(JSON.stringify(hashData))}`
        : `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard/${user.id}#${encodeURIComponent(JSON.stringify(hashData))}`;
    } else {
      // Existing user or complete profile - go to dashboard
      const hashData = {
        token: token,
        user: minimalUserData
      };
      redirectUrl = user.user_type === 'provider' 
        ? `${process.env.FRONTEND_URL || 'http://localhost:3000'}/providers/dashboard/${user.id}#${encodeURIComponent(JSON.stringify(hashData))}`
        : `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard/${user.id}#${encodeURIComponent(JSON.stringify(hashData))}`;
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
