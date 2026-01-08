// src/controllers/auth.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const { generateToken } = require('../utils/jwt');

/**
 * Register a new client
 */
async function registerClient(req, res) {
  try {
    console.log('Registration request body:', JSON.stringify(req.body, null, 2));
    
    const { 
      email, 
      password, 
      firstName, 
      lastName, 
      phoneNumber,
      dateOfBirth,
      gender,
      pronoun,
      emergencyContactName,
      emergencyContactPhone,
      emergencyContactRelationship,
      wellnessGoals,
      otherGoal,
      address,
      city,
      state,
      zipCode,
      country,
      preferredServices,
      sessionLength,
      frequency,
      budget,
      locationPreference,
      timePreference,
      specialRequirements,
      travelWillingness,
      maxTravelDistance
    } = req.body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, firstName, and lastName are required',
      });
    }

    // Check if email already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Start transaction - create user and client profile
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Insert user
      const userResult = await client.query(
        `INSERT INTO users (email, password_hash, user_type) 
         VALUES ($1, $2, 'client') 
         RETURNING id, email, user_type`,
        [email, passwordHash]
      );

      const userId = userResult.rows[0].id;

      // Insert client profile
      await client.query(
        `INSERT INTO client_profiles (
          user_id, 
          first_name, 
          last_name, 
          phone_number,
          date_of_birth,
          gender,
          pronoun,
          emergency_contact_name,
          emergency_contact_phone,
          emergency_contact_relationship,
          wellness_goals,
          other_goals,
          address_line1,
          city,
          state,
          zip_code,
          country,
          preferred_services,
          preferred_session_length,
          preferred_frequency,
          budget_per_session,
          location_preference,
          time_preference,
          special_requirements,
          travel_willingness,
          max_travel_distance,
          notes
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27)`,
        [
          userId, 
          firstName, 
          lastName, 
          phoneNumber || null,
          dateOfBirth || null,
          gender || null,
          pronoun || null,
          emergencyContactName || null,
          emergencyContactPhone || null,
          emergencyContactRelationship || null,
          wellnessGoals || null,
          otherGoal || null,
          address || null,
          city || null,
          state || null,
          zipCode || null,
          country || 'USA',
          preferredServices || null,
          sessionLength || null,
          frequency || null,
          budget || null,
          locationPreference || null,
          timePreference || null,
          specialRequirements || null,
          travelWillingness || false,
          maxTravelDistance || null,
          otherGoal || null
        ]
      );

      await client.query('COMMIT');

      const user = userResult.rows[0];
      const token = generateToken(user);

      // Return profile data
      res.status(201).json({
        success: true,
        message: 'Client registered successfully',
        data: {
          user: {
            id: user.id,
            email: user.email,
            user_type: user.user_type,
            profile: {
              first_name: firstName,
              last_name: lastName,
              phone_number: phoneNumber || null,
              date_of_birth: dateOfBirth || null,
              gender: gender || null,
              pronoun: pronoun || null,
              emergency_contact_name: emergencyContactName || null,
              emergency_contact_phone: emergencyContactPhone || null,
              emergency_contact_relationship: emergencyContactRelationship || null,
              wellness_goals: wellnessGoals || null,
              other_goals: otherGoal || null,
              address_line1: address || null,
              city: city || null,
              state: state || null,
              zip_code: zipCode || null,
              country: country || 'USA',
              preferred_services: preferredServices || null,
              preferred_session_length: sessionLength || null,
              preferred_frequency: frequency || null,
              budget_per_session: budget || null,
              location_preference: locationPreference || null,
              time_preference: timePreference || null,
              special_requirements: specialRequirements || null,
              travel_willingness: travelWillingness || false,
              max_travel_distance: maxTravelDistance || null,
              notes: otherGoal || null,
            },
          },
          token,
        },
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
}

/**
 * Register a new provider
 */
async function registerProvider(req, res) {
  try {
    console.log('Provider registration request body:', JSON.stringify(req.body, null, 2));
    
      const { 
        email, 
        password, 
        businessName, 
        contactName, 
        phoneNumber,
        businessType,
        bio,
        specialties,
        certifications,
        yearsExperience,
        languages,
        address_line1,
        city,
        state,
        zip_code,
        country,
        subscriptionPlan,
        billingCycle
      } = req.body;

    // Validate required fields
    if (!email || !password || !contactName || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, contactName, and phoneNumber are required',
      });
    }

    // Check if email already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Start transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Insert user
      const userResult = await client.query(
        `INSERT INTO users (email, password_hash, user_type, is_active) 
         VALUES ($1, $2, 'provider', true) 
         RETURNING id, email, user_type, is_active`,
        [email, passwordHash]
      );

      const userId = userResult.rows[0].id;

      // Prepare languages array for credentials field
      let credentialsArray = null;
      if (languages && Array.isArray(languages) && languages.length > 0) {
        credentialsArray = languages;
      }

      // Convert years experience from string range to integer
      let yearsExperienceNum = null;
      if (yearsExperience) {
        // Handle different formats: "6-10", "16+", "0-1", etc.
        if (yearsExperience.includes('+')) {
          // "16+" -> 16
          yearsExperienceNum = parseInt(yearsExperience.replace('+', '')) || null;
        } else if (yearsExperience.includes('-')) {
          // "6-10" -> 10 (take the max)
          const parts = yearsExperience.split('-');
          yearsExperienceNum = parseInt(parts[parts.length - 1]) || null;
        } else {
          // Try to parse as integer
          yearsExperienceNum = parseInt(yearsExperience) || null;
        }
      }

      // Insert provider profile with all fields
      console.log('Inserting provider profile with data:', {
        userId,
        businessName,
        contactName,
        phoneNumber,
        businessType,
        bio,
        credentialsArray,
        yearsExperienceNum,
        address_line1,
        city,
        state,
        zip_code,
        country
      });
      
      // Parse additional fields from request body
      const { 
        workLocation = [], 
        services = [], 
        travelPolicy = '', 
        travelFee = 0, 
        maxDistance = 15,
        teamMembers = [],
        subscriptionPlan = 'professional',
        billingCycle = 'monthly'
      } = req.body;
      
      // Calculate subscription price based on plan and billing cycle
      let subscriptionPrice = 0;
      if (subscriptionPlan === 'professional') {
        subscriptionPrice = billingCycle === 'yearly' ? 47 : 49;
      } else if (subscriptionPlan === 'growth') {
        subscriptionPrice = billingCycle === 'yearly' ? 79 : 99;
      }
      
      // Calculate next payment date (same day next month for monthly, same day next year for yearly)
      const nextPaymentDate = new Date();
      if (billingCycle === 'yearly') {
        nextPaymentDate.setFullYear(nextPaymentDate.getFullYear() + 1);
      } else {
        nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
      }
      
      const profileResult = await client.query(
        `INSERT INTO provider_profiles (
          user_id, 
          business_name, 
          contact_name, 
          phone_number, 
          business_type,
          bio,
          specialties,
          credentials,
          years_experience,
          address_line1,
          city,
          state,
          zip_code,
          country,
          work_location,
          services,
          travel_policy,
          travel_fee,
          max_distance,
          team_members
        ) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
         RETURNING *`,
        [
          userId, 
          businessName || null, 
          contactName, 
          phoneNumber, 
          businessType || null,
          bio || null,
          specialties || null,
          credentialsArray, // Store languages in credentials array
          yearsExperienceNum, // Converted to integer
          address_line1 || null,
          city || null,
          state || null,
          zip_code || null,
          country || 'USA',
          workLocation.length > 0 ? JSON.stringify(workLocation) : null,
          services.length > 0 ? JSON.stringify(services) : null,
          travelPolicy || null,
          parseFloat(travelFee) || 0,
          parseInt(maxDistance) || 15,
          teamMembers && teamMembers.length > 0 ? JSON.stringify(teamMembers) : '[]'
        ]
      );
      
      // Store subscription information
      // Note: This requires a metadata column in users table or subscription fields in provider_profiles
      // For now, we'll include it in the response and can add proper storage via migration later
      
      console.log('Provider profile inserted successfully:', profileResult.rows[0]);

      await client.query('COMMIT');

      const user = userResult.rows[0];
      const profile = profileResult.rows[0];
      const token = generateToken(user);

      // Parse JSONB fields if they're strings
      let work_location_parsed = [];
      let services_parsed = [];
      let team_members_parsed = [];
      
      if (typeof profile.work_location === 'string') {
        try {
          work_location_parsed = JSON.parse(profile.work_location);
        } catch (e) {
          work_location_parsed = [];
        }
      } else {
        work_location_parsed = profile.work_location || [];
      }
      
      if (typeof profile.services === 'string') {
        try {
          services_parsed = JSON.parse(profile.services);
        } catch (e) {
          services_parsed = [];
        }
      } else {
        services_parsed = profile.services || [];
      }
      
      if (typeof profile.team_members === 'string') {
        try {
          team_members_parsed = JSON.parse(profile.team_members);
        } catch (e) {
          team_members_parsed = [];
        }
      } else {
        team_members_parsed = profile.team_members || [];
      }

      res.status(201).json({
        success: true,
        message: 'Provider registered successfully',
        data: {
          user: {
            id: user.id,
            email: user.email,
            user_type: user.user_type,
            subscription: {
              plan: subscriptionPlan,
              billingCycle: billingCycle,
              price: subscriptionPrice,
              nextPaymentDate: nextPaymentDate.toISOString(),
            },
            profile: {
              business_name: profile.business_name,
              contact_name: profile.contact_name,
              phone_number: profile.phone_number,
              business_type: profile.business_type,
              bio: profile.bio,
              specialties: profile.specialties,
              credentials: profile.credentials,
              years_experience: profile.years_experience,
              address_line1: profile.address_line1,
              city: profile.city,
              state: profile.state,
              zip_code: profile.zip_code,
              country: profile.country,
              work_location: work_location_parsed,
              services: services_parsed,
              travel_policy: profile.travel_policy,
              travel_fee: profile.travel_fee,
              max_distance: profile.max_distance,
              team_members: team_members_parsed,
            }
          },
          token,
        },
      });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Database error:', error);
      console.error('Error stack:', error.stack);
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Registration error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
}

/* SPACES FEATURE - COMMENTED OUT FOR MVP
 * Register a new space owner
async function registerSpaceOwner(req, res) {
  try {
    const { 
      email, 
      password, 
      businessName, 
      contactName, 
      phoneNumber,
      spaceType,
      address,
      city,
      state,
      zipCode,
      description,
      capacity,
      squareFootage,
      amenities,
      availability,
      hourlyRate,
      minimumBooking,
      cancellationPolicy,
      photos
    } = req.body;

    console.log('Space owner registration data:', {
      email, businessName, contactName, phoneNumber, spaceType,
      address, city, state, zipCode, description, capacity,
      squareFootage, amenities, hourlyRate, minimumBooking, cancellationPolicy
    });

    // Validate required fields
    if (!email || !password || !contactName || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, contactName, and phoneNumber are required',
      });
    }

    // Check if email already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Start transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Insert user
      const userResult = await client.query(
        `INSERT INTO users (email, password_hash, user_type) 
         VALUES ($1, $2, 'space_owner') 
         RETURNING id, email, user_type`,
        [email, passwordHash]
      );

      const userId = userResult.rows[0].id;

      // Insert space owner profile with all fields
      const profileResult = await client.query(
        `INSERT INTO space_owner_profiles (
          user_id, 
          business_name, 
          contact_name, 
          phone_number,
          bio,
          address_line1,
          city,
          state,
          zip_code,
          country
        ) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING id`,
        [
          userId, 
          businessName || null, 
          contactName, 
          phoneNumber,
          description || null,
          address || null,
          city || null,
          state || null,
          zipCode || null,
          'USA'
        ]
      );
      
      const spaceOwnerProfileId = profileResult.rows[0].id;
      console.log('Space owner profile created successfully:', spaceOwnerProfileId);

      // Format cancellation policy as readable text
      let formattedCancellationPolicy = '24 hours notice required';
      if (cancellationPolicy) {
        const hours = parseInt(cancellationPolicy);
        if (hours >= 24 && hours % 24 === 0) {
          const days = hours / 24;
          formattedCancellationPolicy = `${days} ${days === 1 ? 'day' : 'days'} notice required`;
        } else {
          formattedCancellationPolicy = `${hours} hours notice required`;
        }
      }

      console.log('Creating space listing with data:', {
        owner_id: spaceOwnerProfileId,
        space_name: businessName || `${contactName}'s Space`,
        space_type: spaceType || 'wellness_space',
        description: description || null,
        address: address || null,
        city: city || null,
        state: state || null,
        zipCode: zipCode || null,
        square_footage: squareFootage ? parseInt(squareFootage) : null,
        capacity: capacity ? parseInt(capacity) : null,
        hourly_rate: hourlyRate ? parseFloat(hourlyRate) : null,
        minimum_booking_hours: minimumBooking ? parseInt(minimumBooking) : 1,
        cancellation_policy: formattedCancellationPolicy
      });

      // Insert space listing with all details
      const spaceResult = await client.query(
        `INSERT INTO spaces (
          owner_id,
          space_name,
          space_type,
          description,
          address_line1,
          city,
          state,
          zip_code,
          square_footage,
          capacity,
          hourly_rate,
          minimum_booking_hours,
          cancellation_policy,
          is_active
        ) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, true)
         RETURNING *`,
        [
          spaceOwnerProfileId,
          businessName || `${contactName}'s Space`,
          spaceType || 'wellness_space',
          description || null,
          address || null,
          city || null,
          state || null,
          zipCode || null,
          squareFootage ? parseInt(squareFootage) : null,
          capacity ? parseInt(capacity) : null,
          hourlyRate ? parseFloat(hourlyRate) : null,
          minimumBooking ? parseInt(minimumBooking) : 1,
          formattedCancellationPolicy,
        ]
      );

      const spaceId = spaceResult.rows[0].id;
      const spaceData = spaceResult.rows[0];
      console.log('✅ Space listing created successfully!');
      console.log('Space ID:', spaceId);
      console.log('Space data:', JSON.stringify(spaceData, null, 2));

      // Insert amenities if provided
      if (amenities && Array.isArray(amenities) && amenities.length > 0) {
        for (const amenity of amenities) {
          await client.query(
            `INSERT INTO space_amenities (space_id, amenity_name)
             VALUES ($1, $2)`,
            [spaceId, amenity]
          );
        }
        console.log('Amenities added:', amenities.length);
      }

      // Insert availability if provided
      if (availability && typeof availability === 'object') {
        for (const [day, schedule] of Object.entries(availability)) {
          if (schedule.isOpen) {
            await client.query(
              `INSERT INTO space_availability (
                space_id, day_of_week, start_time, end_time, is_available
              )
               VALUES ($1, $2, $3, $4, true)`,
              [spaceId, day, schedule.startTime, schedule.endTime]
            );
          }
        }
        console.log('Availability added for space');
      }

      await client.query('COMMIT');

      const user = userResult.rows[0];
      const token = generateToken(user);

      console.log('✅ Space owner registration complete!');
      console.log('User ID:', user.id);
      console.log('Space Owner Profile ID:', spaceOwnerProfileId);
      console.log('Space ID:', spaceId);

      res.status(201).json({
        success: true,
        message: 'Space owner registered successfully',
        data: {
          user: {
            id: user.id,
            email: user.email,
            user_type: user.user_type,
          },
          space_owner_profile_id: spaceOwnerProfileId,
          space_id: spaceId,
          token,
        },
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
}
*/

/**
 * Login - works for all user types
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;
    
    console.log('Login attempt:', { email });

    // Validate required fields
    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // Find user by email
    const userResult = await pool.query(
      'SELECT id, email, password_hash, user_type, COALESCE(email_verified, false) as email_verified FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      console.log('User not found:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const user = userResult.rows[0];
    console.log('User found:', user.email, user.user_type);

    // SPACES FEATURE - COMMENTED OUT FOR MVP
    // Reject space_owner logins
    if (user.user_type === 'space_owner') {
      console.log('Space owner login attempt rejected for MVP');
      return res.status(403).json({
        success: false,
        message: 'Space owner accounts are not available in the MVP. Please contact support.',
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    console.log('Password valid:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('Invalid password');
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check if user is active and 2FA status
    // Note: two_factor_enabled column may not exist in all databases, so we check for it first
    let isActiveResult;
    try {
      isActiveResult = await pool.query(
        'SELECT COALESCE(is_active, true) as is_active, COALESCE(two_factor_enabled, false) as two_factor_enabled FROM users WHERE id = $1',
        [user.id]
      );
    } catch (error) {
      // If two_factor_enabled column doesn't exist, query without it
      if (error.code === '42703' && error.message.includes('two_factor_enabled')) {
        isActiveResult = await pool.query(
          'SELECT COALESCE(is_active, true) as is_active FROM users WHERE id = $1',
          [user.id]
        );
        // Add two_factor_enabled as false if column doesn't exist
        if (isActiveResult.rows[0]) {
          isActiveResult.rows[0].two_factor_enabled = false;
        }
      } else {
        throw error;
      }
    }

    if (isActiveResult.rows[0] && isActiveResult.rows[0].is_active === false) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated',
      });
    }

    const requires2FA = isActiveResult.rows[0]?.two_factor_enabled || false;

    // If 2FA is enabled, check if token is provided
    const { twoFactorToken, backupCode } = req.body;
    
    if (requires2FA && !twoFactorToken && !backupCode) {
      // Password is valid, but 2FA is required
      return res.status(200).json({
        success: true,
        requires2FA: true,
        userId: user.id,
        message: 'Two-factor authentication required',
      });
    }

    // If 2FA token is provided, verify it
    if (requires2FA && (twoFactorToken || backupCode)) {
      const twoFactorResult = await pool.query(
        'SELECT two_factor_secret, backup_codes FROM users WHERE id = $1',
        [user.id]
      );

      if (twoFactorResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      let isValid = false;

      if (twoFactorToken) {
        const { verifyToken } = require('../utils/2fa');
        isValid = verifyToken(twoFactorToken, twoFactorResult.rows[0].two_factor_secret);
      } else if (backupCode) {
        const { verifyBackupCode } = require('../utils/2fa');
        const backupCodes = twoFactorResult.rows[0].backup_codes 
          ? JSON.parse(twoFactorResult.rows[0].backup_codes)
          : [];

        for (const hashedCode of backupCodes) {
          if (await verifyBackupCode(backupCode, hashedCode)) {
            isValid = true;
            // Remove used backup code
            const updatedCodes = backupCodes.filter(c => c !== hashedCode);
            await pool.query(
              'UPDATE users SET backup_codes = $1 WHERE id = $2',
              [JSON.stringify(updatedCodes), user.id]
            );
            break;
          }
        }
      }

      if (!isValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid 2FA code',
        });
      }
    }

    // Update last login
    await pool.query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );

    // Fetch user profile based on user type
    let profile = null;
    if (user.user_type === 'client') {
      const profileResult = await pool.query(
        `SELECT 
          first_name, 
          last_name, 
          phone_number,
          date_of_birth,
          gender,
          pronoun,
          emergency_contact_name,
          emergency_contact_phone,
          emergency_contact_relationship,
          wellness_goals,
          other_goals,
          address_line1,
          city,
          state,
          zip_code,
          country,
          preferred_services,
          preferred_session_length,
          preferred_frequency,
          budget_per_session,
          location_preference,
          time_preference,
          special_requirements,
          travel_willingness,
          max_travel_distance,
          notes
        FROM client_profiles WHERE user_id = $1`,
        [user.id]
      );
      if (profileResult.rows.length > 0) {
        profile = profileResult.rows[0];
      }
    } else if (user.user_type === 'provider') {
      const profileResult = await pool.query(
        `SELECT 
          business_name,
          contact_name,
          phone_number,
          bio,
          specialties,
          credentials,
          years_experience,
          license_number,
          address_line1,
          city,
          state,
          zip_code,
          country,
          business_type,
          accepts_insurance,
          insurance_providers,
          work_location,
          services,
          add_ons,
          certifications,
          travel_policy,
          travel_fee,
          max_distance,
          team_members,
          profile_photo_url,
          subscription_data
        FROM provider_profiles WHERE user_id = $1`,
        [user.id]
      );
      if (profileResult.rows.length > 0) {
        profile = profileResult.rows[0];
        // Parse JSONB fields if they're strings
        if (typeof profile.work_location === 'string') {
          try {
            profile.work_location = JSON.parse(profile.work_location);
          } catch (e) {
            profile.work_location = [];
          }
        }
        if (typeof profile.services === 'string') {
          try {
            profile.services = JSON.parse(profile.services);
          } catch (e) {
            profile.services = [];
          }
        }
        if (typeof profile.add_ons === 'string') {
          try {
            profile.add_ons = JSON.parse(profile.add_ons);
          } catch (e) {
            profile.add_ons = [];
          }
        } else if (!profile.add_ons) {
          profile.add_ons = [];
        }
        if (typeof profile.certifications === 'string') {
          try {
            profile.certifications = JSON.parse(profile.certifications);
          } catch (e) {
            profile.certifications = [];
          }
        } else if (!profile.certifications) {
          profile.certifications = [];
        }
        if (typeof profile.team_members === 'string') {
          try {
            profile.team_members = JSON.parse(profile.team_members);
          } catch (e) {
            profile.team_members = [];
          }
        }
        // Parse credentials if it's a string or ensure it's an array
        if (Array.isArray(profile.credentials) && profile.credentials.length > 0) {
          // credentials is already an array
        } else if (typeof profile.credentials === 'string') {
          try {
            profile.credentials = JSON.parse(profile.credentials);
          } catch (e) {
            profile.credentials = [];
          }
        } else {
          profile.credentials = [];
        }
        // Parse subscription_data if it exists
        if (profile.subscription_data) {
          if (typeof profile.subscription_data === 'string') {
            try {
              profile.subscription_data = JSON.parse(profile.subscription_data);
            } catch (e) {
              profile.subscription_data = null;
            }
          }
        }
      }
    }

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      user_type: user.user_type,
    });

    // Include subscription data in response for providers
    const responseData = {
      user: {
        id: user.id,
        email: user.email,
        user_type: user.user_type,
        email_verified: user.email_verified || false,
        profile: profile,
      },
      token,
    };

    // Add subscription data if provider has it
    if (user.user_type === 'provider' && profile && profile.subscription_data) {
      responseData.user.subscription = profile.subscription_data;
    }

    res.json({
      success: true,
      message: 'Login successful',
      data: responseData,
    });
  } catch (error) {
    console.error('Login error:', error);
    console.error('Error stack:', error.stack);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      detail: error.detail,
    });
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    });
  }
}

/**
 * Update client profile
 */
async function updateClientProfile(req, res) {
  try {
    // Get user ID from token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No authentication token provided',
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Decode JWT token to get user ID
    const { verifyToken } = require('../utils/jwt');
    
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }

    const userId = decoded.id;
    
    const {
      firstName,
      lastName,
      phoneNumber,
      dateOfBirth,
      gender,
      pronoun,
      emergencyContactName,
      emergencyContactPhone,
      emergencyContactRelationship,
      wellnessGoals,
      otherGoals,
      address,
      city,
      state,
      zipCode,
      country,
      preferredServices,
      sessionLength,
      frequency,
      budget,
      locationPreference,
      timePreference,
      specialRequirements,
      travelWillingness,
      maxTravelDistance,
      notes
    } = req.body;

    console.log('Received data:', req.body);

    // Helper function to convert empty strings to null
    const toNull = (value) => value === '' || value === null || value === undefined ? null : value;
    
    // Helper function to handle array fields (wellnessGoals, preferredServices)
    const toArray = (value) => {
      if (!value) return null;
      if (Array.isArray(value)) return value.length > 0 ? value : null;
      if (typeof value === 'string') {
        try {
          const parsed = JSON.parse(value);
          return Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
        } catch {
          return value.split(',').map(s => s.trim()).filter(s => s.length > 0);
        }
      }
      return null;
    };

    // Update client profile
    const result = await pool.query(
      `UPDATE client_profiles SET
        first_name = COALESCE($1, first_name),
        last_name = COALESCE($2, last_name),
        phone_number = COALESCE($3, phone_number),
        date_of_birth = COALESCE($4, date_of_birth),
        gender = COALESCE($5, gender),
        pronoun = COALESCE($6, pronoun),
        emergency_contact_name = COALESCE($7, emergency_contact_name),
        emergency_contact_phone = COALESCE($8, emergency_contact_phone),
        emergency_contact_relationship = COALESCE($9, emergency_contact_relationship),
        wellness_goals = COALESCE($10, wellness_goals),
        other_goals = COALESCE($11, other_goals),
        address_line1 = COALESCE($12, address_line1),
        city = COALESCE($13, city),
        state = COALESCE($14, state),
        zip_code = COALESCE($15, zip_code),
        country = COALESCE($16, country),
        preferred_services = COALESCE($17, preferred_services),
        preferred_session_length = COALESCE($18, preferred_session_length),
        preferred_frequency = COALESCE($19, preferred_frequency),
        budget_per_session = COALESCE($20, budget_per_session),
        location_preference = COALESCE($21, location_preference),
        time_preference = COALESCE($22, time_preference),
        special_requirements = COALESCE($23, special_requirements),
        travel_willingness = COALESCE($24, travel_willingness),
        max_travel_distance = COALESCE($25, max_travel_distance),
        notes = COALESCE($26, notes),
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $27
      RETURNING *`,
      [
        toNull(firstName),
        toNull(lastName),
        toNull(phoneNumber),
        toNull(dateOfBirth),
        toNull(gender),
        toNull(pronoun),
        toNull(emergencyContactName),
        toNull(emergencyContactPhone),
        toNull(emergencyContactRelationship),
        toArray(wellnessGoals),
        toNull(otherGoals),
        toNull(address),
        toNull(city),
        toNull(state),
        toNull(zipCode),
        toNull(country),
        toArray(preferredServices),
        toNull(sessionLength),
        toNull(frequency),
        toNull(budget),
        toNull(locationPreference),
        toNull(timePreference),
        toNull(specialRequirements),
        toNull(travelWillingness),
        toNull(maxTravelDistance),
        toNull(notes),
        userId
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    console.log('Updated profile:', result.rows[0]);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        profile: result.rows[0],
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
}

/**
 * Update provider profile (specifically for profile photo URL)
 */
async function updateProviderProfile(req, res) {
  try {
    // Get user ID from token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided',
      });
    }

    const token = authHeader.split(' ')[1];
    let userId;
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
      userId = decoded.id;
    } catch (error) {
      console.error('JWT verification error:', error);
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
        error: error.message,
      });
    }

    const {
      business_name,
      contact_name,
      phone_number,
      business_type,
      bio,
      specialties,
      years_experience,
      credentials,
      address_line1,
      city,
      state,
      zip_code,
      country,
      work_location,
      services,
      travel_policy,
      travel_fee,
      max_distance,
      team_members,
      profile_photo_url
    } = req.body;

    console.log('Received provider profile update data:', req.body);

    // Helper function to check if a field was provided in the request
    const wasProvided = (key) => req.body.hasOwnProperty(key);

    // Helper function to convert empty strings to null only if field was provided
    const processValue = (value, fieldName) => {
      if (!wasProvided(fieldName)) {
        return null; // Field not provided, skip update
      }
      // Field was provided, even if empty, we should update it
      return value === '' || value === null || value === undefined ? null : value;
    };

    // Helper function to handle JSONB fields
    const toJsonb = (value, fieldName) => {
      if (!wasProvided(fieldName)) {
        return null; // Field not provided, use COALESCE to keep existing
      }
      if (value === null || value === undefined || value === '') return null;
      if (Array.isArray(value)) return JSON.stringify(value);
      if (typeof value === 'string') {
        try {
          JSON.parse(value);
          return value;
        } catch {
          return JSON.stringify(value);
        }
      }
      return JSON.stringify(value);
    };

    // Convert years_experience from string range to integer if needed
    let yearsExpValue = null;
    if (wasProvided('years_experience') && years_experience) {
      if (typeof years_experience === 'string') {
        if (years_experience.includes('+')) {
          yearsExpValue = parseInt(years_experience.replace('+', '')) || null;
        } else if (years_experience.includes('-')) {
          const parts = years_experience.split('-');
          yearsExpValue = parseInt(parts[parts.length - 1]) || null;
        } else {
          yearsExpValue = parseInt(years_experience) || null;
        }
      } else {
        yearsExpValue = years_experience;
      }
    }


    // Process travel_fee and max_distance with special handling
    let travelFeeValue = null;
    if (wasProvided('travel_fee')) {
      if (travel_fee !== null && travel_fee !== undefined && travel_fee !== '') {
        travelFeeValue = parseFloat(travel_fee);
      } else {
        travelFeeValue = null;
      }
    }
    
    let maxDistanceValue = null;
    if (wasProvided('max_distance')) {
      if (max_distance !== null && max_distance !== undefined && max_distance !== '') {
        maxDistanceValue = parseInt(max_distance);
      } else {
        maxDistanceValue = null;
      }
    }

    // Build dynamic UPDATE query - only update fields that were provided
    const updateFields = [];
    const values = [];
    let paramCounter = 1;

    if (wasProvided('business_name')) {
      updateFields.push(`business_name = $${paramCounter}`);
      values.push(processValue(business_name, 'business_name'));
      paramCounter++;
    }
    if (wasProvided('contact_name')) {
      updateFields.push(`contact_name = $${paramCounter}`);
      values.push(processValue(contact_name, 'contact_name'));
      paramCounter++;
    }
    if (wasProvided('phone_number')) {
      updateFields.push(`phone_number = $${paramCounter}`);
      values.push(processValue(phone_number, 'phone_number'));
      paramCounter++;
    }
    if (wasProvided('business_type')) {
      updateFields.push(`business_type = $${paramCounter}`);
      values.push(processValue(business_type, 'business_type'));
      paramCounter++;
    }
    if (wasProvided('bio')) {
      updateFields.push(`bio = $${paramCounter}`);
      values.push(processValue(bio, 'bio'));
      paramCounter++;
    }
    if (wasProvided('specialties')) {
      updateFields.push(`specialties = $${paramCounter}`);
      values.push(processValue(specialties, 'specialties'));
      paramCounter++;
    }
    if (wasProvided('years_experience')) {
      updateFields.push(`years_experience = $${paramCounter}`);
      values.push(yearsExpValue);
      paramCounter++;
    }
    if (wasProvided('credentials')) {
      updateFields.push(`credentials = $${paramCounter}`);
      // credentials is a TEXT[] array, not JSONB - pass as JavaScript array
      let credentialsArray = null;
      if (credentials !== null && credentials !== undefined) {
        if (Array.isArray(credentials)) {
          credentialsArray = credentials;
        } else if (typeof credentials === 'string') {
          try {
            credentialsArray = JSON.parse(credentials);
          } catch {
            credentialsArray = credentials.split(',').map(c => c.trim());
          }
        } else {
          credentialsArray = [];
        }
      }
      values.push(credentialsArray);
      paramCounter++;
    }
    if (wasProvided('address_line1')) {
      updateFields.push(`address_line1 = $${paramCounter}`);
      values.push(processValue(address_line1, 'address_line1'));
      paramCounter++;
    }
    if (wasProvided('city')) {
      updateFields.push(`city = $${paramCounter}`);
      values.push(processValue(city, 'city'));
      paramCounter++;
    }
    if (wasProvided('state')) {
      updateFields.push(`state = $${paramCounter}`);
      values.push(processValue(state, 'state'));
      paramCounter++;
    }
    if (wasProvided('zip_code')) {
      updateFields.push(`zip_code = $${paramCounter}`);
      values.push(processValue(zip_code, 'zip_code'));
      paramCounter++;
    }
    if (wasProvided('country')) {
      updateFields.push(`country = $${paramCounter}`);
      values.push(processValue(country, 'country'));
      paramCounter++;
    }
    if (wasProvided('work_location')) {
      updateFields.push(`work_location = $${paramCounter}::JSONB`);
      values.push(toJsonb(work_location, 'work_location'));
      paramCounter++;
    }
    if (wasProvided('services')) {
      updateFields.push(`services = $${paramCounter}::JSONB`);
      values.push(toJsonb(services, 'services'));
      paramCounter++;
    }
    if (req.body.hasOwnProperty('add_ons')) {
      updateFields.push(`add_ons = $${paramCounter}::JSONB`);
      values.push(toJsonb(req.body.add_ons, 'add_ons'));
      paramCounter++;
    }
    if (req.body.hasOwnProperty('certifications')) {
      updateFields.push(`certifications = $${paramCounter}::JSONB`);
      values.push(toJsonb(req.body.certifications, 'certifications'));
      paramCounter++;
    }
    if (wasProvided('travel_policy')) {
      updateFields.push(`travel_policy = $${paramCounter}`);
      values.push(processValue(travel_policy, 'travel_policy'));
      paramCounter++;
    }
    if (wasProvided('travel_fee')) {
      updateFields.push(`travel_fee = $${paramCounter}`);
      values.push(travelFeeValue);
      paramCounter++;
    }
    if (wasProvided('max_distance')) {
      updateFields.push(`max_distance = $${paramCounter}`);
      values.push(maxDistanceValue);
      paramCounter++;
    }
    if (wasProvided('team_members')) {
      updateFields.push(`team_members = $${paramCounter}::JSONB`);
      let teamMembersValue;
      if (Array.isArray(team_members)) {
        // Always save as JSON string, even if empty array
        teamMembersValue = JSON.stringify(team_members);
      } else if (team_members === null || team_members === undefined) {
        teamMembersValue = null;
      } else {
        teamMembersValue = toJsonb(team_members, 'team_members');
      }
      values.push(teamMembersValue);
      paramCounter++;
    }
    if (wasProvided('profile_photo_url')) {
      updateFields.push(`profile_photo_url = $${paramCounter}`);
      values.push(processValue(profile_photo_url, 'profile_photo_url'));
      paramCounter++;
    }

    // Always update updated_at (doesn't need a parameter)
    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    
    // Add user_id for WHERE clause - it will be the next parameter
    values.push(userId);
    const whereParamNumber = paramCounter; // userId is the paramCounter-th parameter

    if (updateFields.length === 1) {
      // Only updated_at was updated, nothing else
      return res.json({
        success: true,
        message: 'No fields to update',
        profile: null,
      });
    }

    const updateQuery = `
      UPDATE provider_profiles 
      SET ${updateFields.join(', ')}
      WHERE user_id = $${whereParamNumber}
      RETURNING *
    `;
    console.log('Number of parameters needed:', paramCounter);
    console.log('Number of values provided:', values.length);

    let result;
    try {
      result = await pool.query(updateQuery, values);
    } catch (dbError) {
      console.error('Database query error:', dbError.message);
      console.error('Query:', updateQuery);
      console.error('Values:', values);
      throw dbError;
    }
    
    console.log('Update query result rows:', result.rows.length);
    console.log('Updated profile:', result.rows[0]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Provider profile not found',
      });
    }

    console.log('Updated provider profile:', result.rows[0]);

    // Parse JSONB fields for response
    const profile = result.rows[0];
    if (typeof profile.work_location === 'string') {
      try {
        profile.work_location = JSON.parse(profile.work_location);
      } catch (e) {
        profile.work_location = [];
      }
    }
    if (typeof profile.services === 'string') {
      try {
        profile.services = JSON.parse(profile.services);
      } catch (e) {
        profile.services = [];
      }
    }
        if (typeof profile.add_ons === 'string') {
          try {
            profile.add_ons = JSON.parse(profile.add_ons);
          } catch (e) {
            profile.add_ons = [];
          }
        } else if (!profile.add_ons) {
          profile.add_ons = [];
        }
        if (typeof profile.certifications === 'string') {
          try {
            profile.certifications = JSON.parse(profile.certifications);
          } catch (e) {
            profile.certifications = [];
          }
        } else if (!profile.certifications) {
          profile.certifications = [];
        }
        if (typeof profile.team_members === 'string') {
      try {
        profile.team_members = JSON.parse(profile.team_members);
      } catch (e) {
        profile.team_members = [];
      }
    }
    if (Array.isArray(profile.credentials) && profile.credentials.length > 0) {
      // credentials is already an array
    } else {
      profile.credentials = [];
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      profile: profile,
    });
  } catch (error) {
    console.error('Error updating provider profile:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
}

/**
 * Verify JWT token
 */
async function verifyToken(req, res) {
  try {
    // SPACES FEATURE - COMMENTED OUT FOR MVP
    // Reject space_owner tokens
    if (req.user && req.user.user_type === 'space_owner') {
      return res.status(403).json({
        success: false,
        message: 'Space owner accounts are not available in the MVP. Please contact support.',
      });
    }

    // Token is already verified by middleware, just return success
    res.json({
      success: true,
      message: 'Token is valid',
      data: {
        user: {
          id: req.user.id,
          email: req.user.email,
          user_type: req.user.user_type,
        },
      },
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
      error: error.message,
    });
  }
}

/**
 * Enable 2FA - Generate secret and QR code
 */
async function enable2FA(req, res) {
  try {
    const userId = req.user.id;
    const userEmail = req.user.email;

    // Check if 2FA is already enabled
    const userResult = await pool.query(
      'SELECT two_factor_enabled, two_factor_secret FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (userResult.rows[0].two_factor_enabled) {
      return res.status(400).json({
        success: false,
        message: 'Two-factor authentication is already enabled',
      });
    }

    // Generate secret
    const { generateSecret, generateQRCode } = require('../utils/2fa');
    const { secret, otpauthUrl } = generateSecret(userEmail);

    // Generate QR code
    const qrCodeDataUrl = await generateQRCode(otpauthUrl);

    // Store secret (encrypted) in database - for now we'll store it, user needs to verify before enabling
    await pool.query(
      'UPDATE users SET two_factor_secret = $1 WHERE id = $2',
      [secret, userId]
    );

    res.json({
      success: true,
      secret: secret, // Send secret for manual entry option
      qrCode: qrCodeDataUrl,
      otpauthUrl: otpauthUrl
    });
  } catch (error) {
    console.error('Enable 2FA error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
}

/**
 * Verify and activate 2FA
 */
async function verifyAndActivate2FA(req, res) {
  try {
    const { token } = req.body;
    const userId = req.user.id;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Verification token is required',
      });
    }

    // Get user's secret
    const userResult = await pool.query(
      'SELECT two_factor_secret, two_factor_enabled FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const secret = userResult.rows[0].two_factor_secret;
    if (!secret) {
      return res.status(400).json({
        success: false,
        message: '2FA secret not found. Please enable 2FA first.',
      });
    }

    if (userResult.rows[0].two_factor_enabled) {
      return res.status(400).json({
        success: false,
        message: 'Two-factor authentication is already enabled',
      });
    }

    // Verify token
    const { verifyToken } = require('../utils/2fa');
    const isValid = verifyToken(token, secret);

    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid verification code',
      });
    }

    // Generate backup codes
    const { generateBackupCodes, hashBackupCode } = require('../utils/2fa');
    const backupCodes = generateBackupCodes(10);
    const hashedBackupCodes = await Promise.all(
      backupCodes.map(code => hashBackupCode(code))
    );

    // Enable 2FA and store backup codes
    await pool.query(
      'UPDATE users SET two_factor_enabled = true, backup_codes = $1 WHERE id = $2',
      [JSON.stringify(hashedBackupCodes), userId]
    );

    res.json({
      success: true,
      message: 'Two-factor authentication enabled successfully',
      backupCodes: backupCodes // Show only once - user must save these
    });
  } catch (error) {
    console.error('Verify 2FA error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
}

/**
 * Disable 2FA
 */
async function disable2FA(req, res) {
  try {
    const { password, token } = req.body;
    const userId = req.user.id;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required to disable 2FA',
      });
    }

    // Verify password
    const userResult = await pool.query(
      'SELECT password_hash, two_factor_enabled, two_factor_secret FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      userResult.rows[0].password_hash
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password',
      });
    }

    // If 2FA is enabled, require token
    if (userResult.rows[0].two_factor_enabled) {
      if (!token) {
        return res.status(400).json({
          success: false,
          message: '2FA token is required to disable 2FA',
        });
      }

      const { verifyToken } = require('../utils/2fa');
      const isValid = verifyToken(token, userResult.rows[0].two_factor_secret);

      if (!isValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid 2FA token',
        });
      }
    }

    // Disable 2FA and clear secret
    await pool.query(
      'UPDATE users SET two_factor_enabled = false, two_factor_secret = NULL, backup_codes = NULL WHERE id = $1',
      [userId]
    );

    res.json({
      success: true,
      message: 'Two-factor authentication disabled successfully',
    });
  } catch (error) {
    console.error('Disable 2FA error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
}

/**
 * Verify 2FA token during login
 */
async function verify2FALogin(req, res) {
  try {
    const { userId, token, backupCode } = req.body;

    if (!userId || (!token && !backupCode)) {
      return res.status(400).json({
        success: false,
        message: 'User ID and either token or backup code is required',
      });
    }

    // Get user's 2FA info
    const userResult = await pool.query(
      'SELECT two_factor_enabled, two_factor_secret, backup_codes FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (!userResult.rows[0].two_factor_enabled) {
      return res.status(400).json({
        success: false,
        message: 'Two-factor authentication is not enabled for this account',
      });
    }

    let isValid = false;

    // Verify token or backup code
    if (token) {
      const { verifyToken } = require('../utils/2fa');
      isValid = verifyToken(token, userResult.rows[0].two_factor_secret);
    } else if (backupCode) {
      const { verifyBackupCode } = require('../utils/2fa');
      const backupCodes = userResult.rows[0].backup_codes 
        ? JSON.parse(userResult.rows[0].backup_codes)
        : [];

      // Try to match backup code
      for (const hashedCode of backupCodes) {
        if (await verifyBackupCode(backupCode, hashedCode)) {
          isValid = true;
          // Remove used backup code
          const updatedCodes = backupCodes.filter(c => c !== hashedCode);
          await pool.query(
            'UPDATE users SET backup_codes = $1 WHERE id = $2',
            [JSON.stringify(updatedCodes), userId]
          );
          break;
        }
      }
    }

    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid verification code',
      });
    }

    res.json({
      success: true,
      message: '2FA verification successful',
    });
  } catch (error) {
    console.error('Verify 2FA login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
}

/**
 * Regenerate backup codes
 */
async function regenerateBackupCodes(req, res) {
  try {
    const { password } = req.body;
    const userId = req.user.id;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required',
      });
    }

    // Verify password
    const userResult = await pool.query(
      'SELECT password_hash, two_factor_enabled FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      userResult.rows[0].password_hash
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password',
      });
    }

    if (!userResult.rows[0].two_factor_enabled) {
      return res.status(400).json({
        success: false,
        message: 'Two-factor authentication is not enabled',
      });
    }

    // Generate new backup codes
    const { generateBackupCodes, hashBackupCode } = require('../utils/2fa');
    const backupCodes = generateBackupCodes(10);
    const hashedBackupCodes = await Promise.all(
      backupCodes.map(code => hashBackupCode(code))
    );

    // Update backup codes
    await pool.query(
      'UPDATE users SET backup_codes = $1 WHERE id = $2',
      [JSON.stringify(hashedBackupCodes), userId]
    );

    res.json({
      success: true,
      message: 'Backup codes regenerated successfully',
      backupCodes: backupCodes // Show only once
    });
  } catch (error) {
    console.error('Regenerate backup codes error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
}

/**
 * Update user email
 */
async function updateEmail(req, res) {
  try {
    const { newEmail, password } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!newEmail || !password) {
      return res.status(400).json({
        success: false,
        message: 'New email and password are required',
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
      });
    }

    // Verify password
    const userResult = await pool.query(
      'SELECT password_hash, email FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      userResult.rows[0].password_hash
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password',
      });
    }

    // Check if new email is same as current
    if (userResult.rows[0].email === newEmail) {
      return res.status(400).json({
        success: false,
        message: 'New email must be different from current email',
      });
    }

    // Check if email is already taken
    const emailCheck = await pool.query(
      'SELECT id FROM users WHERE email = $1 AND id != $2',
      [newEmail, userId]
    );

    if (emailCheck.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Email is already registered',
      });
    }

    // Generate verification token
    const { generateVerificationToken, sendVerificationEmail } = require('../utils/email');
    const verificationToken = generateVerificationToken();
    const tokenExpires = new Date();
    tokenExpires.setHours(tokenExpires.getHours() + 24); // Token expires in 24 hours

    // Update email and set verification token
    await pool.query(
      'UPDATE users SET email = $1, email_verified = false, verification_token = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
      [newEmail, verificationToken, userId]
    );

    // Send verification email
    try {
      await sendVerificationEmail(newEmail, verificationToken, userId);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Don't fail the request if email fails, but log it
      // The user can request a resend later
    }

    res.json({
      success: true,
      message: 'Email updated successfully. Please check your inbox to verify your new email address.',
      newEmail: newEmail
    });
  } catch (error) {
    console.error('Update email error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
}

/**
 * Change user password
 */
async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required',
      });
    }

    // Validate new password strength
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters long',
      });
    }

    // Get current password hash
    const userResult = await pool.query(
      'SELECT password_hash FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      userResult.rows[0].password_hash
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    // Check if new password is same as current
    const isSamePassword = await bcrypt.compare(
      newPassword,
      userResult.rows[0].password_hash
    );

    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: 'New password must be different from current password',
      });
    }

    // Hash new password
    const saltRounds = 10;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await pool.query(
      'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [newPasswordHash, userId]
    );

    res.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
}

/**
 * Verify email address using token
 */
async function verifyEmail(req, res) {
  try {
    const { token, userId } = req.query;

    if (!token || !userId) {
      return res.status(400).json({
        success: false,
        message: 'Token and user ID are required',
      });
    }

    // Find user with matching token
    const userResult = await pool.query(
      'SELECT id, email, email_verified, verification_token FROM users WHERE id = $1 AND verification_token = $2',
      [userId, token]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token',
      });
    }

    const user = userResult.rows[0];

    // Check if already verified
    if (user.email_verified) {
      return res.status(400).json({
        success: true,
        message: 'Email is already verified',
        alreadyVerified: true,
      });
    }

    // Verify email
    await pool.query(
      'UPDATE users SET email_verified = true, verification_token = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [userId]
    );

    res.json({
      success: true,
      message: 'Email verified successfully',
    });
  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
}

/**
 * Resend verification email
 */
async function resendVerificationEmail(req, res) {
  try {
    const userId = req.user.id;

    // Get user email
    const userResult = await pool.query(
      'SELECT id, email, email_verified FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const user = userResult.rows[0];

    // Check if already verified
    if (user.email_verified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified',
      });
    }

    // Generate new verification token
    const { generateVerificationToken, sendVerificationEmail } = require('../utils/email');
    const verificationToken = generateVerificationToken();

    // Update verification token
    await pool.query(
      'UPDATE users SET verification_token = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [verificationToken, userId]
    );

    // Send verification email
    try {
      await sendVerificationEmail(user.email, verificationToken, userId);
      
      res.json({
        success: true,
        message: 'Verification email sent successfully. Please check your inbox.',
      });
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      res.status(500).json({
        success: false,
        message: 'Failed to send verification email. Please try again later.',
      });
    }
  } catch (error) {
    console.error('Resend verification email error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
}

/**
 * Forgot password - Send password reset email
 */
async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    // Find user by email
    const userResult = await pool.query(
      'SELECT id, email FROM users WHERE email = $1',
      [email]
    );

    // Always return success to prevent email enumeration
    // If user exists, send reset email; if not, still return success
    if (userResult.rows.length > 0) {
      const user = userResult.rows[0];
      
      // Generate reset token
      const crypto = require('crypto');
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpires = new Date();
      resetTokenExpires.setHours(resetTokenExpires.getHours() + 1); // Expires in 1 hour

      // Store reset token in database
      await pool.query(
        'UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE id = $3',
        [resetToken, resetTokenExpires, user.id]
      );

      // Send reset email if SendGrid is configured
      try {
        const { sendPasswordResetEmail } = require('../utils/email');
        await sendPasswordResetEmail(user.email, resetToken);
      } catch (emailError) {
        // If SendGrid is not configured, log but don't fail
        console.warn('Password reset email not sent (SendGrid not configured):', emailError.message);
        // In development, log the reset link
        if (process.env.NODE_ENV === 'development') {
          const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
          console.log(`Password reset link for ${user.email}: ${baseUrl}/reset-password?token=${resetToken}`);
        }
      }
    }

    // Always return success to prevent email enumeration
    res.json({
      success: true,
      message: 'If an account with that email exists, we\'ve sent you a password reset link.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
}

module.exports = {
  registerClient,
  registerProvider,
  // SPACES FEATURE - COMMENTED OUT FOR MVP
  // registerSpaceOwner,
  login,
  updateClientProfile,
  updateProviderProfile,
  verifyToken,
  changePassword,
  updateEmail,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  enable2FA,
  verifyAndActivate2FA,
  disable2FA,
  verify2FALogin,
  regenerateBackupCodes,
};

