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
        pp.travel_policy,
        pp.travel_fee,
        pp.max_distance,
        pp.average_rating,
        pp.total_reviews
      FROM users u
      JOIN provider_profiles pp ON u.id = pp.user_id
      WHERE u.user_type = 'provider' AND u.is_active = true
      ORDER BY pp.average_rating DESC
    `);
    
    // Parse JSONB fields
    const providers = result.rows.map(row => ({
      ...row,
      work_location: typeof row.work_location === 'string' ? JSON.parse(row.work_location) : row.work_location,
      services: typeof row.services === 'string' ? JSON.parse(row.services) : row.services,
    }));
    
    res.json(providers);
  } catch (err) {
    console.error('Error fetching providers:', err);
    console.error('Error details:', err.message);
    console.error('Error stack:', err.stack);
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

// GET provider by ID
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
        pp.address_line1,
        pp.city,
        pp.state,
        pp.zip_code,
        pp.country,
        pp.business_type,
        pp.profile_photo_url,
        pp.work_location,
        pp.services,
        pp.travel_policy,
        pp.travel_fee,
        pp.max_distance,
        pp.average_rating,
        pp.total_reviews
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
    
    res.json(provider);
  } catch (err) {
    console.error('Error fetching provider:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
