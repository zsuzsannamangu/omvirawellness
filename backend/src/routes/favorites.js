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

// GET all favorites for a client
router.get('/client/:clientId', verifyToken, async (req, res) => {
  try {
    const { clientId } = req.params;
    
    // Verify the user is a client and matches the clientId
    if (req.userType !== 'client' || req.userId !== clientId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Get client's favorites with provider details
    const result = await pool.query(
      `SELECT 
        f.id as favorite_id,
        f.created_at as favorited_at,
        p.id as provider_id,
        u.id as user_id,
        u.email,
        p.business_name,
        p.contact_name,
        p.phone_number,
        p.bio,
        p.specialties,
        p.profile_photo_url,
        p.city,
        p.state,
        p.average_rating,
        p.total_reviews,
        p.work_location,
        p.services
      FROM favorites f
      JOIN provider_profiles p ON f.provider_id = p.id
      JOIN users u ON p.user_id = u.id
      WHERE f.user_id = $1 AND f.provider_id IS NOT NULL
      ORDER BY f.created_at DESC`,
      [clientId]
    );
    
    // Parse JSONB fields
    const favorites = result.rows.map(row => ({
      ...row,
      work_location: typeof row.work_location === 'string' ? JSON.parse(row.work_location) : row.work_location,
      services: typeof row.services === 'string' ? JSON.parse(row.services) : row.services,
    }));
    
    res.json(favorites);
  } catch (err) {
    console.error('Error fetching favorites:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET favorite status for specific providers (for search pages)
router.get('/client/:clientId/status', verifyToken, async (req, res) => {
  try {
    const { clientId } = req.params;
    const { providerIds } = req.query; // comma-separated list of provider IDs
    
    if (req.userType !== 'client' || req.userId !== clientId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    if (!providerIds) {
      return res.json({});
    }
    
    const providerIdArray = providerIds.split(',').filter(id => id.trim());
    
    if (providerIdArray.length === 0) {
      return res.json({});
    }
    
    // Get provider profile IDs first, then get user_ids
    const providerProfilesResult = await pool.query(
      `SELECT id, user_id FROM provider_profiles WHERE user_id = ANY($1::UUID[])`,
      [providerIdArray]
    );
    
    if (providerProfilesResult.rows.length === 0) {
      return res.json({});
    }
    
    const providerProfileIds = providerProfilesResult.rows.map(row => row.id);
    const profileIdToUserId = {};
    providerProfilesResult.rows.forEach(row => {
      profileIdToUserId[row.id] = row.user_id;
    });
    
    // Get favorite status
    const result = await pool.query(
      `SELECT provider_id 
      FROM favorites 
      WHERE user_id = $1 AND provider_id = ANY($2::UUID[])`,
      [clientId, providerProfileIds]
    );
    
    // Create a map of user_id -> true for favorites
    const favoriteMap = {};
    result.rows.forEach(row => {
      const userId = profileIdToUserId[row.provider_id];
      if (userId) {
        favoriteMap[userId] = true;
      }
    });
    
    res.json(favoriteMap);
  } catch (err) {
    console.error('Error fetching favorite status:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST add favorite (for a provider)
router.post('/client/:clientId/provider/:providerId', verifyToken, async (req, res) => {
  try {
    const { clientId, providerId } = req.params;
    
    // Verify the user is a client and matches the clientId
    if (req.userType !== 'client' || req.userId !== clientId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Get provider profile ID from user ID
    const providerProfileResult = await pool.query(
      'SELECT id FROM provider_profiles WHERE user_id = $1',
      [providerId]
    );
    
    if (providerProfileResult.rows.length === 0) {
      return res.status(404).json({ error: 'Provider not found' });
    }
    
    const providerProfileId = providerProfileResult.rows[0].id;
    
    // Check if already favorited
    const existingResult = await pool.query(
      'SELECT id FROM favorites WHERE user_id = $1 AND provider_id = $2',
      [clientId, providerProfileId]
    );
    
    if (existingResult.rows.length > 0) {
      return res.json({ success: true, message: 'Already favorited', favorite: existingResult.rows[0] });
    }
    
    // Add to favorites
    const result = await pool.query(
      'INSERT INTO favorites (user_id, provider_id) VALUES ($1, $2) RETURNING *',
      [clientId, providerProfileId]
    );
    
    res.json({ success: true, favorite: result.rows[0] });
  } catch (err) {
    console.error('Error adding favorite:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE remove favorite
router.delete('/client/:clientId/provider/:providerId', verifyToken, async (req, res) => {
  try {
    const { clientId, providerId } = req.params;
    
    // Verify the user is a client and matches the clientId
    if (req.userType !== 'client' || req.userId !== clientId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Get provider profile ID from user ID
    const providerProfileResult = await pool.query(
      'SELECT id FROM provider_profiles WHERE user_id = $1',
      [providerId]
    );
    
    if (providerProfileResult.rows.length === 0) {
      return res.status(404).json({ error: 'Provider not found' });
    }
    
    const providerProfileId = providerProfileResult.rows[0].id;
    
    // Remove from favorites
    const result = await pool.query(
      'DELETE FROM favorites WHERE user_id = $1 AND provider_id = $2 RETURNING *',
      [clientId, providerProfileId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Favorite not found' });
    }
    
    res.json({ success: true, message: 'Favorite removed' });
  } catch (err) {
    console.error('Error removing favorite:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

