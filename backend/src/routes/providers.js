const { Router } = require('express');
const pool = require('../db');

const router = Router();

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
