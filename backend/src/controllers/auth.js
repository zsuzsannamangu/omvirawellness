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
        country
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
        `INSERT INTO users (email, password_hash, user_type) 
         VALUES ($1, $2, 'provider') 
         RETURNING id, email, user_type`,
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
        teamMembers = []
      } = req.body;
      
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
          teamMembers.length > 0 ? JSON.stringify(teamMembers) : null
        ]
      );
      
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

/**
 * Register a new space owner
 */
async function registerSpaceOwner(req, res) {
  try {
    const { email, password, businessName, contactName, phoneNumber } = req.body;

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

      // Insert space owner profile
      await client.query(
        `INSERT INTO space_owner_profiles (user_id, business_name, contact_name, phone_number) 
         VALUES ($1, $2, $3, $4)`,
        [userId, businessName || null, contactName, phoneNumber]
      );

      await client.query('COMMIT');

      const user = userResult.rows[0];
      const token = generateToken(user);

      res.status(201).json({
        success: true,
        message: 'Space owner registered successfully',
        data: {
          user: {
            id: user.id,
            email: user.email,
            user_type: user.user_type,
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
      'SELECT id, email, password_hash, user_type FROM users WHERE email = $1',
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

    // Check if user is active
    const isActiveResult = await pool.query(
      'SELECT is_active FROM users WHERE id = $1',
      [user.id]
    );

    if (isActiveResult.rows[0] && !isActiveResult.rows[0].is_active) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated',
      });
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
          profile_photo_url
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
      }
    }

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      user_type: user.user_type,
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          user_type: user.user_type,
          profile: profile,
        },
        token,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
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
        other_goals = COALESCE($10, other_goals),
        address_line1 = COALESCE($11, address_line1),
        city = COALESCE($12, city),
        state = COALESCE($13, state),
        zip_code = COALESCE($14, zip_code),
        country = COALESCE($15, country),
        preferred_services = COALESCE($16, preferred_services),
        preferred_session_length = COALESCE($17, preferred_session_length),
        preferred_frequency = COALESCE($18, preferred_frequency),
        budget_per_session = COALESCE($19, budget_per_session),
        location_preference = COALESCE($20, location_preference),
        time_preference = COALESCE($21, time_preference),
        special_requirements = COALESCE($22, special_requirements),
        travel_willingness = COALESCE($23, travel_willingness),
        max_travel_distance = COALESCE($24, max_travel_distance),
        notes = COALESCE($25, notes),
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $26
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
        toNull(otherGoals),
        toNull(address),
        toNull(city),
        toNull(state),
        toNull(zipCode),
        toNull(country),
        toNull(preferredServices),
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

    console.log('Updating provider profile for user:', userId);
    console.log('Update data received:', req.body);

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
      values.push(toJsonb(team_members, 'team_members'));
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
    
    console.log('Update query:', updateQuery);
    console.log('Update values:', values);
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

module.exports = {
  registerClient,
  registerProvider,
  registerSpaceOwner,
  login,
  updateClientProfile,
  updateProviderProfile,
};

