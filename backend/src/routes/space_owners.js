/* SPACES FEATURE - COMMENTED OUT FOR MVP
const { Router } = require('express');
const pool = require('../db');
const jwt = require('jsonwebtoken');

const router = Router();

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
    req.userId = decoded.id;
    req.userType = decoded.user_type;
    
    if (req.userType !== 'space_owner') {
      return res.status(403).json({ error: 'Access denied. Space owners only.' });
    }
    
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// GET - Get space owner profile by user ID
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('\n=== Fetching space owner profile ===');
    console.log('User ID:', userId);
    
    // Get space owner profile with all fields
    const profileResult = await pool.query(
      `SELECT 
        u.id,
        u.email,
        u.user_type,
        u.created_at,
        sp.id as space_owner_profile_id,
        sp.business_name,
        sp.contact_name,
        sp.phone_number,
        sp.bio,
        sp.address_line1,
        sp.address_line2,
        sp.city,
        sp.state,
        sp.zip_code,
        sp.country,
        sp.profile_photo_url,
        sp.created_at as profile_created_at,
        sp.updated_at as profile_updated_at
      FROM users u
      LEFT JOIN space_owner_profiles sp ON u.id = sp.user_id
      WHERE u.id = $1 AND u.user_type = 'space_owner'`,
      [userId]
    );

    console.log('Profile query result rows:', profileResult.rows.length);

    if (profileResult.rows.length === 0) {
      console.log('No space owner found for userId:', userId);
      return res.status(404).json({ error: 'Space owner not found' });
    }

    const spaceOwner = profileResult.rows[0];
    const spaceOwnerProfileId = spaceOwner.space_owner_profile_id;
    
    console.log('Space owner data:', {
      business_name: spaceOwner.business_name,
      contact_name: spaceOwner.contact_name,
      phone_number: spaceOwner.phone_number,
      bio: spaceOwner.bio,
      address_line1: spaceOwner.address_line1,
      city: spaceOwner.city,
      state: spaceOwner.state,
      zip_code: spaceOwner.zip_code,
      profile_photo_url: spaceOwner.profile_photo_url,
      has_profile: !!spaceOwner.profile_created_at
    });

    // Get space details (including first/primary space)
    let spaceDetails = null;
    if (spaceOwnerProfileId) {
      const spaceResult = await pool.query(
        `SELECT 
          id,
          space_name,
          space_type,
          description,
          address_line1,
          address_line2,
          city,
          state,
          zip_code,
          country,
          square_footage,
          capacity,
          hourly_rate,
          minimum_booking_hours,
          cancellation_policy,
          average_rating,
          total_reviews
        FROM spaces
        WHERE owner_id = $1
        ORDER BY created_at DESC
        LIMIT 1`,
        [spaceOwnerProfileId]
      );

      if (spaceResult.rows.length > 0) {
        spaceDetails = spaceResult.rows[0];
        console.log('Space details found:', spaceDetails.space_name);

        // Get amenities for this space
        const amenitiesResult = await pool.query(
          `SELECT amenity_name FROM space_amenities WHERE space_id = $1`,
          [spaceDetails.id]
        );
        spaceDetails.amenities = amenitiesResult.rows.map(row => row.amenity_name);

        // Get availability for this space
        const availabilityResult = await pool.query(
          `SELECT day_of_week, start_time, end_time, is_available
           FROM space_availability
           WHERE space_id = $1
           ORDER BY 
             CASE day_of_week
               WHEN 'Monday' THEN 1
               WHEN 'Tuesday' THEN 2
               WHEN 'Wednesday' THEN 3
               WHEN 'Thursday' THEN 4
               WHEN 'Friday' THEN 5
               WHEN 'Saturday' THEN 6
               WHEN 'Sunday' THEN 7
             END`,
          [spaceDetails.id]
        );
        spaceDetails.availability = availabilityResult.rows;
      }
    }

    // Get total bookings count
    const bookingsResult = await pool.query(
      `SELECT COUNT(*) as total
       FROM provider_space_bookings psb
       JOIN spaces s ON psb.space_id = s.id
       WHERE s.owner_id = $1 AND psb.status = 'confirmed'`,
      [spaceOwnerProfileId]
    );
    const totalBookings = parseInt(bookingsResult.rows[0]?.total) || 0;

    const response = {
      ...spaceOwner,
      space: spaceDetails,
      total_bookings: totalBookings,
      average_rating: spaceDetails?.average_rating || null
    };
    
    console.log('Sending response with space details');
    console.log('=== End fetch ===\n');
    
    res.json(response);
  } catch (err) {
    console.error('\n=== ERROR fetching space owner ===');
    console.error('Error:', err.message);
    console.error('Code:', err.code);
    console.error('Detail:', err.detail);
    console.error('Stack:', err.stack);
    console.error('=== End error ===\n');
    res.status(500).json({ error: 'Server error', details: err.message, code: err.code });
  }
});

// PUT - Update space owner profile
router.put('/:userId', verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Verify the user is updating their own profile
    if (req.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const {
      businessName,
      contactName,
      phoneNumber,
      bio,
      addressLine1,
      addressLine2,
      city,
      state,
      zipCode,
      country,
      profilePhotoUrl,
      // Space details
      spaceName,
      spaceType,
      description,
      squareFootage,
      capacity,
      hourlyRate,
      minimumBookingHours,
      cancellationPolicy,
      amenities,
      availability
    } = req.body;

    console.log('Updating space owner profile - received fields:', {
      userId,
      hasBusinessName: wasProvided('businessName'),
      hasContactName: wasProvided('contactName'),
      hasPhoneNumber: wasProvided('phoneNumber'),
      hasBio: wasProvided('bio'),
      hasAddressLine1: wasProvided('addressLine1'),
      hasCity: wasProvided('city'),
      hasState: wasProvided('state'),
      hasProfilePhotoUrl: wasProvided('profilePhotoUrl'),
      hasSpaceName: wasProvided('spaceName'),
      hasSpaceType: wasProvided('spaceType'),
      hasDescription: wasProvided('description'),
      hasCapacity: wasProvided('capacity'),
      hasSquareFootage: wasProvided('squareFootage'),
      hasHourlyRate: wasProvided('hourlyRate'),
      hasMinimumBookingHours: wasProvided('minimumBookingHours'),
      hasCancellationPolicy: wasProvided('cancellationPolicy')
    });
    console.log('Full request body:', JSON.stringify(req.body, null, 2));
    console.log('Request body keys:', Object.keys(req.body));

    // Helper function to check if a field was provided
    const wasProvided = (key) => req.body.hasOwnProperty(key);
    
    // Helper function to process values (convert empty strings to null only if field was provided)
    const processValue = (value, fieldName) => {
      if (!wasProvided(fieldName)) {
        return undefined; // Field not provided, skip update (use undefined, not null)
      }
      // Field was provided - convert empty strings to null, but keep other values
      if (value === '' || value === null || value === undefined) {
        return null;
      }
      return value;
    };

    // Build dynamic UPDATE query for space_owner_profiles
    const updateFields = [];
    const values = [];
    let paramCounter = 1;

    if (wasProvided('businessName')) {
      const val = processValue(businessName, 'businessName');
      if (val !== undefined) {
        updateFields.push(`business_name = $${paramCounter}`);
        values.push(val);
        paramCounter++;
      }
    }
    if (wasProvided('contactName')) {
      const val = processValue(contactName, 'contactName');
      if (val !== undefined) {
        updateFields.push(`contact_name = $${paramCounter}`);
        values.push(val);
        paramCounter++;
      }
    }
    if (wasProvided('phoneNumber')) {
      const val = processValue(phoneNumber, 'phoneNumber');
      if (val !== undefined) {
        updateFields.push(`phone_number = $${paramCounter}`);
        values.push(val);
        paramCounter++;
        console.log('Adding phone_number to update:', val);
      } else {
        console.log('phoneNumber was provided but value is undefined');
      }
    } else {
      console.log('phoneNumber was NOT provided in request body');
    }
    if (wasProvided('bio')) {
      updateFields.push(`bio = $${paramCounter}`);
      values.push(processValue(bio, 'bio'));
      paramCounter++;
    }
    if (wasProvided('addressLine1')) {
      updateFields.push(`address_line1 = $${paramCounter}`);
      values.push(processValue(addressLine1, 'addressLine1'));
      paramCounter++;
    }
    if (wasProvided('addressLine2')) {
      updateFields.push(`address_line2 = $${paramCounter}`);
      values.push(processValue(addressLine2, 'addressLine2'));
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
    if (wasProvided('zipCode')) {
      updateFields.push(`zip_code = $${paramCounter}`);
      values.push(processValue(zipCode, 'zipCode'));
      paramCounter++;
    }
    if (wasProvided('country')) {
      updateFields.push(`country = $${paramCounter}`);
      values.push(processValue(country, 'country'));
      paramCounter++;
    }
    if (wasProvided('profilePhotoUrl')) {
      updateFields.push(`profile_photo_url = $${paramCounter}`);
      values.push(processValue(profilePhotoUrl, 'profilePhotoUrl'));
      paramCounter++;
    }

    // Always update updated_at
    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    
    // Add user_id for WHERE clause
    values.push(userId);

    if (updateFields.length === 1) {
      // Only updated_at was updated, nothing else
      return res.json({
        success: true,
        message: 'No profile fields to update',
        profile: null,
      });
    }

    // Update space owner profile
    const profileUpdateQuery = `
      UPDATE space_owner_profiles 
      SET ${updateFields.join(', ')}
      WHERE user_id = $${paramCounter}
      RETURNING *
    `;

    console.log('Profile update query:', profileUpdateQuery);
    console.log('Profile update values:', values);
    console.log('Profile update fields count:', updateFields.length);

    const profileResult = await pool.query(profileUpdateQuery, values);
    
    console.log('Profile update result:', profileResult.rows[0] ? {
      business_name: profileResult.rows[0].business_name,
      contact_name: profileResult.rows[0].contact_name,
      phone_number: profileResult.rows[0].phone_number,
      bio: profileResult.rows[0].bio,
      city: profileResult.rows[0].city,
      state: profileResult.rows[0].state
    } : 'No rows returned');

    if (profileResult.rows.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const updatedProfile = profileResult.rows[0];
    const spaceOwnerProfileId = updatedProfile.id;

    // Update space details if provided
    let updatedSpace = null;
    if (spaceOwnerProfileId && (
      wasProvided('spaceName') || wasProvided('spaceType') || 
      wasProvided('description') || wasProvided('squareFootage') || 
      wasProvided('capacity') || wasProvided('hourlyRate') || 
      wasProvided('minimumBookingHours') || wasProvided('cancellationPolicy')
    )) {
      const spaceUpdateFields = [];
      const spaceValues = [];
      let spaceParamCounter = 1;

      if (wasProvided('spaceName')) {
        spaceUpdateFields.push(`space_name = $${spaceParamCounter}`);
        spaceValues.push(processValue(spaceName, 'spaceName'));
        spaceParamCounter++;
      }
      if (wasProvided('spaceType')) {
        spaceUpdateFields.push(`space_type = $${spaceParamCounter}`);
        spaceValues.push(processValue(spaceType, 'spaceType'));
        spaceParamCounter++;
      }
      if (wasProvided('description')) {
        spaceUpdateFields.push(`description = $${spaceParamCounter}`);
        spaceValues.push(processValue(description, 'description'));
        spaceParamCounter++;
      }
      if (wasProvided('squareFootage')) {
        spaceUpdateFields.push(`square_footage = $${spaceParamCounter}`);
        spaceValues.push(squareFootage ? parseInt(squareFootage) : null);
        spaceParamCounter++;
      }
      if (wasProvided('capacity')) {
        spaceUpdateFields.push(`capacity = $${spaceParamCounter}`);
        spaceValues.push(capacity ? parseInt(capacity) : null);
        spaceParamCounter++;
      }
      if (wasProvided('hourlyRate')) {
        spaceUpdateFields.push(`hourly_rate = $${spaceParamCounter}`);
        spaceValues.push(hourlyRate ? parseFloat(hourlyRate) : null);
        spaceParamCounter++;
      }
      if (wasProvided('minimumBookingHours')) {
        spaceUpdateFields.push(`minimum_booking_hours = $${spaceParamCounter}`);
        spaceValues.push(minimumBookingHours ? parseInt(minimumBookingHours) : null);
        spaceParamCounter++;
      }
      if (wasProvided('cancellationPolicy')) {
        spaceUpdateFields.push(`cancellation_policy = $${spaceParamCounter}`);
        spaceValues.push(processValue(cancellationPolicy, 'cancellationPolicy'));
        spaceParamCounter++;
      }

      // Update address fields from profile if provided
      if (wasProvided('addressLine1')) {
        spaceUpdateFields.push(`address_line1 = $${spaceParamCounter}`);
        spaceValues.push(processValue(addressLine1, 'addressLine1'));
        spaceParamCounter++;
      }
      if (wasProvided('addressLine2')) {
        spaceUpdateFields.push(`address_line2 = $${spaceParamCounter}`);
        spaceValues.push(processValue(addressLine2, 'addressLine2'));
        spaceParamCounter++;
      }
      if (wasProvided('city')) {
        spaceUpdateFields.push(`city = $${spaceParamCounter}`);
        spaceValues.push(processValue(city, 'city'));
        spaceParamCounter++;
      }
      if (wasProvided('state')) {
        spaceUpdateFields.push(`state = $${spaceParamCounter}`);
        spaceValues.push(processValue(state, 'state'));
        spaceParamCounter++;
      }
      if (wasProvided('zipCode')) {
        spaceUpdateFields.push(`zip_code = $${spaceParamCounter}`);
        spaceValues.push(processValue(zipCode, 'zipCode'));
        spaceParamCounter++;
      }
      if (wasProvided('country')) {
        spaceUpdateFields.push(`country = $${spaceParamCounter}`);
        spaceValues.push(processValue(country, 'country'));
        spaceParamCounter++;
      }

      spaceUpdateFields.push(`updated_at = CURRENT_TIMESTAMP`);

      // Get the primary space for this owner
      const spaceCheckResult = await pool.query(
        `SELECT id FROM spaces WHERE owner_id = $1 ORDER BY created_at DESC LIMIT 1`,
        [spaceOwnerProfileId]
      );

      console.log('Space check result:', spaceCheckResult.rows.length, 'spaces found');

      if (spaceCheckResult.rows.length > 0) {
        const spaceId = spaceCheckResult.rows[0].id;
        console.log('Updating space with ID:', spaceId);
        console.log('Space update fields count:', spaceUpdateFields.length);
        console.log('Space update values count:', spaceValues.length);
        console.log('Space param counter:', spaceParamCounter);
        
        // Add space_id as the last parameter for WHERE clause
        // The WHERE clause parameter number should be spaceParamCounter (which is already incremented past the last field)
        spaceValues.push(spaceId);
        const whereParamNumber = spaceParamCounter;
        
        const spaceUpdateQuery = `
          UPDATE spaces 
          SET ${spaceUpdateFields.join(', ')}
          WHERE id = $${whereParamNumber}
          RETURNING *
        `;

        console.log('Space update query:', spaceUpdateQuery);
        console.log('Space update params:', spaceValues);
        console.log('WHERE param number:', whereParamNumber);

        try {
          const spaceResult = await pool.query(spaceUpdateQuery, spaceValues);
          
          if (spaceResult.rows.length > 0) {
            updatedSpace = spaceResult.rows[0];
            console.log('✅ Space updated successfully:', updatedSpace.space_name);

            // Update amenities if provided
            if (wasProvided('amenities') && Array.isArray(amenities)) {
              // Delete existing amenities
              await pool.query(`DELETE FROM space_amenities WHERE space_id = $1`, [spaceId]);
              
              // Insert new amenities
              for (const amenity of amenities) {
                if (amenity && amenity.trim()) {
                  await pool.query(
                    `INSERT INTO space_amenities (space_id, amenity_name) VALUES ($1, $2)`,
                    [spaceId, amenity.trim()]
                  );
                }
              }
            }

            // Update availability if provided
            if (wasProvided('availability') && typeof availability === 'object') {
              // Delete existing availability
              await pool.query(`DELETE FROM space_availability WHERE space_id = $1`, [spaceId]);
              
              // Insert new availability
              for (const [day, schedule] of Object.entries(availability)) {
                if (schedule && schedule.isOpen && schedule.startTime && schedule.endTime) {
                  await pool.query(
                    `INSERT INTO space_availability (space_id, day_of_week, start_time, end_time, is_available)
                     VALUES ($1, $2, $3, $4, true)`,
                    [spaceId, day, schedule.startTime, schedule.endTime]
                  );
                }
              }
            }
          } else {
            console.error('❌ Space update returned no rows');
          }
        } catch (spaceError) {
          console.error('❌ Error updating space:', spaceError);
          console.error('Query:', spaceUpdateQuery);
          console.error('Values:', spaceValues);
          console.error('Error details:', spaceError.message, spaceError.code);
          throw spaceError;
        }
      } else {
        console.log('⚠️ No space found for owner_id:', spaceOwnerProfileId);
        console.log('Space update fields were:', spaceUpdateFields);
      }
    }

    res.json({ 
      success: true, 
      profile: updatedProfile,
      space: updatedSpace
    });
  } catch (err) {
    console.error('Error updating space owner profile:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

module.exports = router;
*/

