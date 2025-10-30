const { Router } = require('express');
const pool = require('../db');

const router = Router();
const jwt = require('jsonwebtoken');

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

// GET all providers
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.id,
        u.email,
        pp.business_name,
        pp.contact_name,
        pp.phone_number,
        pp.bio,
        pp.specialties,
        pp.credentials,
        pp.years_experience,
        pp.address_line1,
        pp.city,
        pp.state,
        pp.zip_code,
        pp.country,
        pp.business_type,
        pp.profile_photo_url,
        pp.work_location,
        pp.services,
        pp.add_ons,
        pp.certifications,
        pp.travel_policy,
        pp.travel_fee,
        pp.max_distance,
        pp.average_rating,
        pp.total_reviews,
        pp.availability
      FROM users u
      JOIN provider_profiles pp ON u.id = pp.user_id
      WHERE u.user_type = 'provider' AND u.is_active = true
      ORDER BY pp.average_rating DESC
    `);
    
    // Parse JSONB fields
    const providers = result.rows.map(row => {
      // Parse availability
      let availability = [];
      if (row.availability) {
        if (typeof row.availability === 'string') {
          try {
            availability = JSON.parse(row.availability);
          } catch (e) {
            availability = [];
          }
        } else if (Array.isArray(row.availability)) {
          availability = row.availability;
        }
      }

      return {
        ...row,
        work_location: typeof row.work_location === 'string' ? JSON.parse(row.work_location) : row.work_location,
        services: typeof row.services === 'string' ? JSON.parse(row.services) : row.services,
        add_ons: typeof row.add_ons === 'string' ? JSON.parse(row.add_ons) : (row.add_ons || []),
        certifications: typeof row.certifications === 'string' ? JSON.parse(row.certifications) : (row.certifications || []),
        availability: availability,
      };
    });
    
    res.json(providers);
  } catch (err) {
    console.error('Error fetching providers:', err);
    console.error('Error details:', err.message);
    console.error('Error stack:', err.stack);
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

// Availability endpoints (must come BEFORE /:id route)
// GET provider availability
router.get('/:id/availability', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get provider profile ID from user ID
    const profileResult = await pool.query(
      'SELECT id FROM provider_profiles WHERE user_id = $1',
      [id]
    );
    
    if (profileResult.rows.length === 0) {
      return res.status(404).json({ error: 'Provider profile not found' });
    }
    
    const providerProfileId = profileResult.rows[0].id;
    
    // Get availability from provider_profiles
    const result = await pool.query(
      'SELECT availability FROM provider_profiles WHERE id = $1',
      [providerProfileId]
    );
    
    let availability = [];
    if (result.rows.length > 0 && result.rows[0].availability) {
      availability = typeof result.rows[0].availability === 'string' 
        ? JSON.parse(result.rows[0].availability)
        : result.rows[0].availability;
    }
    
    res.json({ availability });
  } catch (err) {
    console.error('Error fetching availability:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT provider availability
router.put('/:id/availability', async (req, res) => {
  try {
    const { id } = req.params;
    const { availability } = req.body;
    
    // Verify authentication
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const jwt = require('jsonwebtoken');
    const token = authHeader.split(' ')[1];
    let userId;
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
      userId = decoded.id;
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    // Verify the user ID matches
    if (userId !== id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    // Get provider profile ID
    const profileResult = await pool.query(
      'SELECT id FROM provider_profiles WHERE user_id = $1',
      [id]
    );
    
    if (profileResult.rows.length === 0) {
      return res.status(404).json({ error: 'Provider profile not found' });
    }
    
    const providerProfileId = profileResult.rows[0].id;
    
    // Update availability
    await pool.query(
      'UPDATE provider_profiles SET availability = $1::JSONB, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [JSON.stringify(availability), providerProfileId]
    );
    
    res.json({ success: true, availability });
  } catch (err) {
    console.error('Error updating availability:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET clients who have booked with a provider
router.get('/:providerId/clients', verifyToken, async (req, res) => {
  try {
    const { providerId } = req.params;
    
    // Verify the user is a provider and matches the providerId
    if (req.userType !== 'provider') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Get provider profile ID from user ID
    const profileResult = await pool.query(
      'SELECT id FROM provider_profiles WHERE user_id = $1',
      [providerId]
    );
    
    if (profileResult.rows.length === 0) {
      return res.status(404).json({ error: 'Provider profile not found' });
    }
    
    const providerProfileId = profileResult.rows[0].id;
    
    // Get all unique clients who have booked with this provider
    const result = await pool.query(`
      SELECT DISTINCT
        c.id as client_profile_id,
        c.user_id,
        c.first_name,
        c.last_name,
        c.phone_number,
        c.date_of_birth,
        c.gender,
        c.pronoun,
        c.wellness_goals,
        c.city,
        c.state,
        u.email
      FROM client_profiles c
      JOIN users u ON c.user_id = u.id
      JOIN client_provider_bookings b ON c.id = b.client_id
      WHERE b.provider_id = $1
      ORDER BY c.last_name, c.first_name
    `, [providerProfileId]);
    
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching provider clients:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET notes for a provider's clients
router.get('/:providerId/clients/notes', verifyToken, async (req, res) => {
  try {
    const { providerId } = req.params;
    
    if (req.userType !== 'provider') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Get provider profile ID
    const profileResult = await pool.query(
      'SELECT id, client_notes FROM provider_profiles WHERE user_id = $1',
      [providerId]
    );
    
    if (profileResult.rows.length === 0) {
      return res.status(404).json({ error: 'Provider profile not found' });
    }
    
    const providerProfile = profileResult.rows[0];
    let notes = {};
    
    // Parse client_notes JSONB if it exists
    if (providerProfile.client_notes) {
      if (typeof providerProfile.client_notes === 'string') {
        try {
          notes = JSON.parse(providerProfile.client_notes);
        } catch (e) {
          notes = {};
        }
      } else {
        notes = providerProfile.client_notes;
      }
    }
    
    res.json({ notes });
  } catch (err) {
    console.error('Error fetching client notes:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST/PUT note for a specific client
router.post('/:providerId/clients/:clientId/notes', verifyToken, async (req, res) => {
  try {
    const { providerId, clientId } = req.params;
    const { note } = req.body;
    
    if (req.userType !== 'provider') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    if (!note || !note.trim()) {
      return res.status(400).json({ error: 'Note cannot be empty' });
    }
    
    // Get provider profile ID
    const profileResult = await pool.query(
      'SELECT id, client_notes FROM provider_profiles WHERE user_id = $1',
      [providerId]
    );
    
    if (profileResult.rows.length === 0) {
      return res.status(404).json({ error: 'Provider profile not found' });
    }
    
    const providerProfileId = profileResult.rows[0].id;
    let notes = {};
    
    // Parse existing notes
    if (profileResult.rows[0].client_notes) {
      if (typeof profileResult.rows[0].client_notes === 'string') {
        try {
          notes = JSON.parse(profileResult.rows[0].client_notes);
        } catch (e) {
          notes = {};
        }
      } else {
        notes = profileResult.rows[0].client_notes;
      }
    }
    
    // Add or update note for this client
    notes[clientId] = {
      note: note.trim(),
      created_at: notes[clientId]?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Update provider profile
    await pool.query(
      'UPDATE provider_profiles SET client_notes = $1::JSONB, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [JSON.stringify(notes), providerProfileId]
    );
    
    res.json({ success: true, notes });
  } catch (err) {
    console.error('Error saving client note:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET provider by ID (must come AFTER more specific routes)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(`
      SELECT 
        u.id,
        u.email,
        pp.business_name,
        pp.contact_name,
        pp.phone_number,
        pp.bio,
        pp.specialties,
        pp.credentials,
        pp.years_experience,
        pp.license_number,
        pp.address_line1,
        pp.city,
        pp.state,
        pp.zip_code,
        pp.country,
        pp.business_type,
        pp.profile_photo_url,
        pp.work_location,
        pp.services,
        pp.add_ons,
        pp.certifications,
        pp.travel_policy,
        pp.travel_fee,
        pp.max_distance,
        pp.average_rating,
        pp.total_reviews,
        pp.availability
      FROM users u
      JOIN provider_profiles pp ON u.id = pp.user_id
      WHERE u.id = $1 AND u.user_type = 'provider' AND u.is_active = true
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Provider not found' });
    }
    
    const provider = result.rows[0];
    
    // Parse JSONB fields
    provider.work_location = typeof provider.work_location === 'string' ? JSON.parse(provider.work_location) : provider.work_location;
    provider.services = typeof provider.services === 'string' ? JSON.parse(provider.services) : provider.services;
    provider.add_ons = typeof provider.add_ons === 'string' ? JSON.parse(provider.add_ons) : (provider.add_ons || []);
    provider.certifications = typeof provider.certifications === 'string' ? JSON.parse(provider.certifications) : (provider.certifications || []);
    
    // Parse credentials (TEXT[] array in PostgreSQL)
    if (provider.credentials && typeof provider.credentials !== 'object') {
      // If it's a string, try to parse it
      try {
        provider.credentials = JSON.parse(provider.credentials);
      } catch (e) {
        // If not JSON, treat as comma-separated string
        provider.credentials = provider.credentials.split(',').map(function(s) { return s.trim(); });
      }
    }
    // If it's already an array or null/undefined, use as-is
    
    // Parse availability
    let availability = [];
    if (provider.availability) {
      availability = typeof provider.availability === 'string' 
        ? JSON.parse(provider.availability)
        : provider.availability;
    }
    provider.availability = availability;
    
    res.json(provider);
  } catch (err) {
    console.error('Error fetching provider:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
