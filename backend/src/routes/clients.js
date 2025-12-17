const { Router } = require('express');
const pool = require('../db');
const jwt = require('jsonwebtoken');

const router = Router();

// Helper function to verify JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
    req.userId = decoded.id;
    req.userType = decoded.user_type;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// GET public client profile (accessible to the client themselves or providers who have bookings with this client)
router.get('/:clientId/public', verifyToken, async (req, res) => {
  try {
    const { clientId } = req.params;

    // Allow clients to view their own profile
    if (req.userType === 'client' && req.userId === clientId) {
      // Client viewing their own profile - no booking check needed
    } else if (req.userType === 'provider') {
      // Providers can only view profiles of clients who have booked with them
      // Get provider profile ID
      const providerProfileResult = await pool.query(
        'SELECT id FROM provider_profiles WHERE user_id = $1',
        [req.userId]
      );

      if (providerProfileResult.rows.length === 0) {
        return res.status(404).json({ error: 'Provider profile not found' });
      }

      const providerProfileId = providerProfileResult.rows[0].id;

      // Verify that this provider has at least one booking with this client
      const bookingCheck = await pool.query(
        `SELECT COUNT(*) as count
         FROM client_provider_bookings b
         JOIN client_profiles c ON b.client_id = c.id
         WHERE c.user_id = $1 AND b.provider_id = $2`,
        [clientId, providerProfileId]
      );

      if (parseInt(bookingCheck.rows[0]?.count) === 0) {
        return res.status(403).json({ error: 'Access denied. You can only view profiles of clients who have booked with you.' });
      }
    } else {
      return res.status(403).json({ error: 'Access denied. Only clients and providers can view client profiles.' });
    }

    // Get client profile (public info only - no address details except zip code)
    const result = await pool.query(
      `SELECT 
        cp.first_name,
        cp.last_name,
        cp.pronoun,
        cp.profile_photo_url,
        cp.zip_code,
        cp.wellness_goals,
        cp.preferred_services,
        cp.preferred_session_length,
        cp.preferred_frequency,
        cp.budget_per_session,
        cp.location_preference,
        cp.time_preference,
        cp.special_requirements,
        cp.travel_willingness,
        cp.max_travel_distance,
        cp.other_goals,
        cp.notes
      FROM client_profiles cp
      WHERE cp.user_id = $1`,
      [clientId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Client profile not found' });
    }

    const profile = result.rows[0];

    res.json({
      firstName: profile.first_name,
      lastName: profile.last_name,
      pronoun: profile.pronoun,
      profilePhotoUrl: profile.profile_photo_url,
      zipCode: profile.zip_code,
      wellnessGoals: profile.wellness_goals || [],
      preferredServices: profile.preferred_services || [],
      preferredSessionLength: profile.preferred_session_length,
      preferredFrequency: profile.preferred_frequency,
      budgetPerSession: profile.budget_per_session,
      locationPreference: profile.location_preference,
      timePreference: profile.time_preference,
      specialRequirements: profile.special_requirements,
      travelWillingness: profile.travel_willingness || false,
      maxTravelDistance: profile.max_travel_distance,
      otherGoals: profile.other_goals,
      notes: profile.notes
    });
  } catch (err) {
    console.error('Error fetching client public profile:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET providers who a client has booked with
router.get('/:clientId/providers', verifyToken, async (req, res) => {
  try {
    const { clientId } = req.params;
    
    // Verify the user is a client and matches the clientId
    if (req.userType !== 'client' || req.userId !== clientId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Get client profile ID from user ID
    const profileResult = await pool.query(
      'SELECT id FROM client_profiles WHERE user_id = $1',
      [clientId]
    );
    
    if (profileResult.rows.length === 0) {
      return res.status(404).json({ error: 'Client profile not found' });
    }
    
    const clientProfileId = profileResult.rows[0].id;
    
    // Get all unique providers who this client has booked with
    const result = await pool.query(`
      SELECT DISTINCT
        p.id as provider_profile_id,
        p.user_id,
        p.business_name,
        p.contact_name,
        p.phone_number,
        p.email,
        u.email as user_email
      FROM provider_profiles p
      JOIN users u ON p.user_id = u.id
      JOIN client_provider_bookings b ON p.id = b.provider_id
      WHERE b.client_id = $1
      ORDER BY p.business_name, p.contact_name
    `, [clientProfileId]);
    
    // Format the response to match what the frontend expects
    const formattedProviders = result.rows.map(row => ({
      id: row.user_id,
      business_name: row.business_name,
      contact_name: row.contact_name,
      phone_number: row.phone_number,
      email: row.user_email || row.email
    }));
    
    res.json(formattedProviders);
  } catch (err) {
    console.error('Error fetching client providers:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
