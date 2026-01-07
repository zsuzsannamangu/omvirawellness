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

// GET all providers with optional search and filters
router.get('/', async (req, res) => {
  try {
    // Extract query parameters
    const { search, service, location, minPrice, maxPrice, sortBy } = req.query;
    
    // Build WHERE clause conditions
    const conditions = ['u.user_type = $1', 'u.is_active = true'];
    const params = ['provider'];
    let paramCounter = 2;
    
    // Search filter (name, business name, city, state, business type)
    if (search) {
      conditions.push(`(
        LOWER(pp.contact_name) LIKE $${paramCounter} OR 
        LOWER(pp.business_name) LIKE $${paramCounter} OR 
        LOWER(pp.city) LIKE $${paramCounter} OR 
        LOWER(pp.state) LIKE $${paramCounter} OR 
        LOWER(pp.business_type) LIKE $${paramCounter}
      )`);
      params.push(`%${search.toLowerCase()}%`);
      paramCounter++;
    }
    
    // Service/business type filter
    if (service) {
      conditions.push(`LOWER(pp.business_type) LIKE $${paramCounter}`);
      params.push(`%${service.toLowerCase()}%`);
      paramCounter++;
    }
    
    // Location filter (work_location is JSONB array)
    if (location) {
      let locationValue;
      if (location === 'Comes to Me') {
        locationValue = 'at-client-location';
      } else if (location === "Provider's Studio" || location === "Provider's Home") {
        locationValue = 'at-my-place';
      } else if (location === 'Virtual Session') {
        locationValue = 'online';
      }
      
      if (locationValue) {
        conditions.push(`pp.work_location::jsonb ? $${paramCounter}`);
        params.push(locationValue);
        paramCounter++;
      }
    }
    
    // Build ORDER BY clause
    let orderBy = 'pp.average_rating DESC, pp.total_reviews DESC';
    if (sortBy === 'Highest Rated') {
      orderBy = 'pp.average_rating DESC, pp.total_reviews DESC';
    } else if (sortBy === 'Most Experienced') {
      orderBy = 'pp.total_reviews DESC, pp.average_rating DESC';
    }
    // Price sorting would need to be done client-side since services is JSONB
    
    const query = `
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
      WHERE ${conditions.join(' AND ')}
      ORDER BY ${orderBy}
    `;
    
    const result = await pool.query(query, params);
    
    // Parse JSONB fields
    let providers = result.rows.map(row => {
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
    
    // Client-side price filtering (since services is JSONB)
    if (minPrice !== undefined || maxPrice !== undefined) {
      providers = providers.filter(provider => {
        if (!provider.services || provider.services.length === 0) return false;
        const prices = provider.services.map(s => parseFloat(s.price) || 0);
        const providerMinPrice = Math.min(...prices);
        
        if (minPrice !== undefined && providerMinPrice < parseFloat(minPrice)) return false;
        if (maxPrice !== undefined && providerMinPrice > parseFloat(maxPrice)) return false;
        return true;
      });
    }
    
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
    
    // Also get existing confirmed bookings and add them as blocked slots
    // This ensures rescheduled bookings are properly blocked even if the blocked slot wasn't saved correctly
    const bookingsResult = await pool.query(
      `SELECT booking_date, start_time, duration_minutes 
       FROM client_provider_bookings 
       WHERE provider_id = $1 
       AND status IN ('confirmed', 'requested')
       AND booking_date >= CURRENT_DATE`,
      [providerProfileId]
    );
    
    // Create a set of existing blocked slots to avoid duplicates
    const existingBlockedSlots = new Set();
    availability.forEach((slot) => {
      if (slot.type === 'blocked' && slot.date && slot.time) {
        const dateStr = String(slot.date).slice(0, 10);
        const timeStr = String(slot.time).slice(0, 5);
        existingBlockedSlots.add(`${dateStr}|${timeStr}`);
      }
    });
    
    // Add blocked slots for existing confirmed bookings
    bookingsResult.rows.forEach((booking) => {
      const bookingDate = String(booking.booking_date).slice(0, 10);
      const bookingTime = String(booking.start_time).slice(0, 5);
      const slotKey = `${bookingDate}|${bookingTime}`;
      
      // Only add if it doesn't already exist as a blocked slot
      if (!existingBlockedSlots.has(slotKey)) {
        availability.push({
          id: `booking-${bookingDate}-${bookingTime}`,
          date: bookingDate,
          time: bookingTime,
          duration: booking.duration_minutes || 60,
          isRecurring: false,
          type: 'blocked',
          notes: 'Auto-blocked by existing booking'
        });
        existingBlockedSlots.add(slotKey);
      }
    });
    
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
        pp.team_members,
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
    provider.team_members = typeof provider.team_members === 'string' ? JSON.parse(provider.team_members) : (provider.team_members || []);
    
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

// Track profile visit
router.post('/:id/visit', async (req, res) => {
  try {
    const { id } = req.params;
    const { visitorId } = req.body; // Optional: logged-in user ID
    const visitorIp = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];
    const referrer = req.headers['referer'] || req.headers['referrer'];
    
    // Insert visit record
    await pool.query(`
      INSERT INTO profile_visits (provider_id, visitor_id, visitor_ip, user_agent, referrer)
      VALUES ($1, $2, $3, $4, $5)
    `, [id, visitorId || null, visitorIp, userAgent, referrer]);
    
    res.json({ success: true });
  } catch (err) {
    console.error('Error tracking visit:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get visit statistics for a provider
router.get('/:id/visits/stats', async (req, res) => {
  try {
    const { id } = req.params;
    let { period = 'today', timezone = 'UTC' } = req.query;
    
    // Validate timezone to prevent SQL injection
    // Check if timezone is valid by trying to use it
    try {
      // Test if the timezone is valid
      const testDate = new Date();
      testDate.toLocaleString('en-US', { timeZone: timezone });
    } catch (e) {
      // Invalid timezone, default to UTC
      timezone = 'UTC';
    }
    
    // Sanitize timezone string to only allow alphanumeric, underscore, slash, and hyphen
    timezone = timezone.replace(/[^a-zA-Z0-9_/\-+]/g, '');
    
    // Use timezone-aware date truncation
    // CURRENT_TIMESTAMP is always in UTC, we convert to user's timezone for day boundaries
    let dateCondition = '';
    
    switch (period) {
      case 'today':
        dateCondition = `visited_at >= DATE_TRUNC('day', CURRENT_TIMESTAMP AT TIME ZONE '${timezone}') AT TIME ZONE '${timezone}'`;
        break;
      case 'yesterday':
        dateCondition = `visited_at >= (DATE_TRUNC('day', CURRENT_TIMESTAMP AT TIME ZONE '${timezone}') - INTERVAL '1 day') AT TIME ZONE '${timezone}' 
                         AND visited_at < DATE_TRUNC('day', CURRENT_TIMESTAMP AT TIME ZONE '${timezone}') AT TIME ZONE '${timezone}'`;
        break;
      case 'last_7_days':
        dateCondition = `visited_at >= (DATE_TRUNC('day', CURRENT_TIMESTAMP AT TIME ZONE '${timezone}') - INTERVAL '7 days') AT TIME ZONE '${timezone}'`;
        break;
      case 'last_30_days':
        dateCondition = `visited_at >= (DATE_TRUNC('day', CURRENT_TIMESTAMP AT TIME ZONE '${timezone}') - INTERVAL '30 days') AT TIME ZONE '${timezone}'`;
        break;
      case 'this_month':
        dateCondition = `visited_at >= DATE_TRUNC('month', CURRENT_TIMESTAMP AT TIME ZONE '${timezone}') AT TIME ZONE '${timezone}'`;
        break;
      case 'last_month':
        dateCondition = `visited_at >= (DATE_TRUNC('month', CURRENT_TIMESTAMP AT TIME ZONE '${timezone}') - INTERVAL '1 month') AT TIME ZONE '${timezone}' 
                         AND visited_at < DATE_TRUNC('month', CURRENT_TIMESTAMP AT TIME ZONE '${timezone}') AT TIME ZONE '${timezone}'`;
        break;
      case 'this_year':
        dateCondition = `visited_at >= DATE_TRUNC('year', CURRENT_TIMESTAMP AT TIME ZONE '${timezone}') AT TIME ZONE '${timezone}'`;
        break;
      case 'last_year':
        dateCondition = `visited_at >= (DATE_TRUNC('year', CURRENT_TIMESTAMP AT TIME ZONE '${timezone}') - INTERVAL '1 year') AT TIME ZONE '${timezone}' 
                         AND visited_at < DATE_TRUNC('year', CURRENT_TIMESTAMP AT TIME ZONE '${timezone}') AT TIME ZONE '${timezone}'`;
        break;
      default:
        dateCondition = `visited_at >= DATE_TRUNC('day', CURRENT_TIMESTAMP AT TIME ZONE '${timezone}') AT TIME ZONE '${timezone}'`;
    }
    
    // Get total count for the period
    const countResult = await pool.query(`
      SELECT COUNT(*) as count
      FROM profile_visits
      WHERE provider_id = $1 AND ${dateCondition}
    `, [id]);
    
    // Get breakdown for charts - hourly for today/yesterday, daily for others
    let dailyResult;
    if (period === 'today' || period === 'yesterday') {
      // Hourly breakdown for today/yesterday
      dailyResult = await pool.query(`
        SELECT 
          visited_at as date,
          1 as count
        FROM profile_visits
        WHERE provider_id = $1 AND ${dateCondition}
        ORDER BY visited_at ASC
      `, [id]);
    } else {
      // Daily breakdown for other periods
      dailyResult = await pool.query(`
        SELECT 
          DATE_TRUNC('day', visited_at AT TIME ZONE '${timezone}') AT TIME ZONE '${timezone}' as date,
          COUNT(*) as count
        FROM profile_visits
        WHERE provider_id = $1 
          AND visited_at >= (DATE_TRUNC('day', CURRENT_TIMESTAMP AT TIME ZONE '${timezone}') - INTERVAL '30 days') AT TIME ZONE '${timezone}'
        GROUP BY DATE_TRUNC('day', visited_at AT TIME ZONE '${timezone}')
        ORDER BY date ASC
      `, [id]);
    }
    
    res.json({
      count: parseInt(countResult.rows[0].count),
      daily: dailyResult.rows.map(row => ({
        date: row.date,
        count: parseInt(row.count)
      }))
    });
  } catch (err) {
    console.error('Error fetching visit stats:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT update provider subscription
router.put('/:id/subscription', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { plan, billingCycle, price, nextPaymentDate } = req.body;

    // Verify the user is updating their own subscription
    if (req.userId !== id) {
      return res.status(403).json({ error: 'Forbidden: You can only update your own subscription' });
    }

    // Verify user is a provider
    if (req.userType !== 'provider') {
      return res.status(403).json({ error: 'Forbidden: Only providers can update subscriptions' });
    }

    // Validate required fields
    if (!plan || !billingCycle || price === undefined) {
      return res.status(400).json({ error: 'Plan, billingCycle, and price are required' });
    }

    // Check if provider profile exists
    const profileCheck = await pool.query(
      'SELECT id FROM provider_profiles WHERE user_id = $1',
      [id]
    );

    if (profileCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Provider profile not found' });
    }

    // Update or insert subscription data in provider_profiles
    // We'll store it as JSONB in a subscription_data column
    // First check if column exists, if not we'll need a migration
    // For now, let's use a simple approach: store in a JSONB column
    
    // Check if subscription_data column exists by trying to update it
    // If it doesn't exist, we'll need to add it via migration
    // For MVP, let's use a workaround: store in a text field or create the column if needed
    
    // Ensure subscription_data column exists (add if it doesn't)
    try {
      await pool.query(`
        ALTER TABLE provider_profiles 
        ADD COLUMN IF NOT EXISTS subscription_data JSONB
      `);
    } catch (alterErr) {
      // Column might already exist, that's fine
      // Only fail if it's a different error
      if (!alterErr.message || !alterErr.message.includes('already exists')) {
        console.error('Error ensuring subscription_data column exists:', alterErr);
        // Continue anyway - might work if column already exists
      }
    }

    // Update subscription_data column
    const subscriptionData = {
      plan,
      billingCycle,
      price,
      nextPaymentDate: nextPaymentDate || null,
      updatedAt: new Date().toISOString()
    };

    const updateResult = await pool.query(`
      UPDATE provider_profiles 
      SET subscription_data = $1::JSONB,
          updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $2
      RETURNING subscription_data
    `, [
      JSON.stringify(subscriptionData),
      id
    ]);

    if (!updateResult || updateResult.rowCount === 0) {
      return res.status(404).json({ error: 'Provider profile not found' });
    }

    res.json({
      success: true,
      message: 'Subscription updated successfully',
      subscription: updateResult.rows[0].subscription_data
    });
  } catch (err) {
    console.error('Error updating subscription:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// GET provider subscription data
router.get('/:id/subscription', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Verify the user is accessing their own subscription
    if (req.userId !== id) {
      return res.status(403).json({ error: 'Forbidden: You can only access your own subscription' });
    }

    // Verify user is a provider
    if (req.userType !== 'provider') {
      return res.status(403).json({ error: 'Forbidden: Only providers can access subscriptions' });
    }

    // Fetch subscription data from database
    const result = await pool.query(`
      SELECT subscription_data
      FROM provider_profiles
      WHERE user_id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Provider profile not found' });
    }

    const subscriptionData = result.rows[0].subscription_data;

    if (!subscriptionData) {
      return res.json({ subscription: null });
    }

    res.json({ subscription: subscriptionData });
  } catch (err) {
    console.error('Error fetching subscription:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// DELETE cancel provider subscription
router.delete('/:id/subscription', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Verify the user is cancelling their own subscription
    if (req.userId !== id) {
      return res.status(403).json({ error: 'Forbidden: You can only cancel your own subscription' });
    }

    // Verify user is a provider
    if (req.userType !== 'provider') {
      return res.status(403).json({ error: 'Forbidden: Only providers can cancel subscriptions' });
    }

    // Check if provider profile exists
    const profileCheck = await pool.query(
      'SELECT id FROM provider_profiles WHERE user_id = $1',
      [id]
    );

    if (profileCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Provider profile not found' });
    }

    // Set subscription to Essential (free) plan
    const essentialPlanData = {
      plan: 'essential',
      billingCycle: 'monthly',
      price: 0,
      nextPaymentDate: null,
      updatedAt: new Date().toISOString()
    };

    const updateResult = await pool.query(`
      UPDATE provider_profiles 
      SET subscription_data = $1::JSONB,
          updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $2
      RETURNING id
    `, [JSON.stringify(essentialPlanData), id]);

    if (!updateResult || updateResult.rowCount === 0) {
      return res.status(404).json({ error: 'Provider profile not found' });
    }

    res.json({
      success: true,
      message: 'Subscription cancelled successfully'
    });
  } catch (err) {
    console.error('Error cancelling subscription:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// PUT update provider payment method
router.put('/:id/payment-method', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { cardNumber, expiryDate, cvv } = req.body;

    // Verify the user is updating their own payment method
    if (req.userId !== id) {
      return res.status(403).json({ error: 'Forbidden: You can only update your own payment method' });
    }

    // Verify user is a provider
    if (req.userType !== 'provider') {
      return res.status(403).json({ error: 'Forbidden: Only providers can update payment methods' });
    }

    // Validate required fields
    const { nameOnCard, billingAddress } = req.body;
    
    // Check if this is a billing address-only update:
    // - No card number provided
    // - Card number is masked (contains asterisks)
    // - Card number is all zeros
    // - Card number is too short (less than 13 digits, indicating it's just last 4 digits or dummy)
    const cardNumberDigits = cardNumber ? cardNumber.replace(/\D/g, '') : '';
    const isMaskedCard = cardNumber && cardNumber.includes('*');
    const isBillingAddressOnly = !cardNumber || 
                                 isMaskedCard || 
                                 cardNumberDigits === '0000000000000000' || 
                                 cardNumberDigits.length === 0 ||
                                 cardNumberDigits.length < 13;
    
    if (!isBillingAddressOnly) {
      // Full payment method update - validate card number and expiry date
      if (!cardNumber || !expiryDate) {
        return res.status(400).json({ error: 'Card number and expiry date are required' });
      }

      // Validate card number (basic validation - should be 13-19 digits)
      if (cardNumberDigits.length < 13 || cardNumberDigits.length > 19) {
        return res.status(400).json({ error: 'Invalid card number' });
      }

      // Validate expiry date format (MM/YY)
      if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
        return res.status(400).json({ error: 'Invalid expiry date format. Use MM/YY' });
      }
    }

    // Check if provider profile exists
    const profileCheck = await pool.query(
      'SELECT id FROM provider_profiles WHERE user_id = $1',
      [id]
    );

    if (profileCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Provider profile not found' });
    }

    // Ensure payment_method column exists
    try {
      await pool.query(`
        ALTER TABLE provider_profiles 
        ADD COLUMN IF NOT EXISTS payment_method JSONB
      `);
    } catch (alterErr) {
      // Column might already exist, that's fine
      if (!alterErr.message || !alterErr.message.includes('already exists')) {
        console.error('Error ensuring payment_method column exists:', alterErr);
      }
    }

    // Get existing payment method to preserve card data if only updating billing address
    let existingPaymentMethod = null;
    const existingResult = await pool.query(
      'SELECT payment_method FROM provider_profiles WHERE user_id = $1',
      [id]
    );
    if (existingResult.rows.length > 0 && existingResult.rows[0].payment_method) {
      existingPaymentMethod = typeof existingResult.rows[0].payment_method === 'string'
        ? JSON.parse(existingResult.rows[0].payment_method)
        : existingResult.rows[0].payment_method;
    }

    let paymentMethodData;
    
    if (isBillingAddressOnly) {
      // Only updating billing address - preserve existing card data
      paymentMethodData = {
        ...existingPaymentMethod,
        nameOnCard: nameOnCard || existingPaymentMethod?.nameOnCard || null,
        billingAddress: billingAddress || null,
        updatedAt: new Date().toISOString()
      };
    } else {
      // Full payment method update - process card number
      const cardNumberDigits = cardNumber.replace(/\D/g, '');
      
      // Mask card number (only store last 4 digits)
      const last4 = cardNumberDigits.slice(-4);
      const maskedCardNumber = `**** **** **** ${last4}`;

      // Detect card type from first digit
      const firstDigit = cardNumberDigits[0];
      let cardType = 'Visa';
      if (firstDigit === '4') {
        cardType = 'Visa';
      } else if (firstDigit === '5') {
        cardType = 'Mastercard';
      } else if (firstDigit === '3' && (cardNumberDigits[1] === '4' || cardNumberDigits[1] === '7')) {
        cardType = 'American Express';
      } else if (firstDigit === '6') {
        cardType = 'Discover';
      }

      // Store payment method data (never store CVV)
      paymentMethodData = {
        cardNumber: maskedCardNumber,
        last4: last4,
        cardType: cardType,
        expiryDate: expiryDate,
        nameOnCard: nameOnCard || null,
        billingAddress: billingAddress || null,
        updatedAt: new Date().toISOString()
      };
    }

    const updateResult = await pool.query(`
      UPDATE provider_profiles 
      SET payment_method = $1::JSONB,
          updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $2
      RETURNING payment_method
    `, [
      JSON.stringify(paymentMethodData),
      id
    ]);

    if (!updateResult || updateResult.rowCount === 0) {
      return res.status(404).json({ error: 'Provider profile not found' });
    }

    res.json({
      success: true,
      message: 'Payment method updated successfully',
      paymentMethod: updateResult.rows[0].payment_method
    });
  } catch (err) {
    console.error('Error updating payment method:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// GET provider payment method
router.get('/:id/payment-method', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Verify the user is accessing their own payment method
    if (req.userId !== id) {
      return res.status(403).json({ error: 'Forbidden: You can only access your own payment method' });
    }

    // Verify user is a provider
    if (req.userType !== 'provider') {
      return res.status(403).json({ error: 'Forbidden: Only providers can access payment methods' });
    }

    // Get payment method from provider profile
    const result = await pool.query(`
      SELECT payment_method
      FROM provider_profiles
      WHERE user_id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Provider profile not found' });
    }

    res.json({
      success: true,
      paymentMethod: result.rows[0].payment_method
    });
  } catch (err) {
    console.error('Error fetching payment method:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// POST calculate distance between provider and client addresses
router.post('/:id/check-distance', async (req, res) => {
  try {
    const { id } = req.params;
    const { clientAddress, clientCity, clientState, clientZipCode } = req.body;

    if (!clientAddress || !clientCity || !clientState) {
      return res.status(400).json({ 
        error: 'Client address, city, and state are required' 
      });
    }

    // Get provider address
    const providerResult = await pool.query(`
      SELECT address_line1, city, state, zip_code, max_distance
      FROM provider_profiles
      WHERE user_id = $1
    `, [id]);

    if (providerResult.rows.length === 0) {
      return res.status(404).json({ error: 'Provider profile not found' });
    }

    const provider = providerResult.rows[0];
    
    if (!provider.address_line1 || !provider.city || !provider.state) {
      return res.status(400).json({ 
        error: 'Provider address not set' 
      });
    }

    // Import distance utilities
    const { validateAndGeocodeAddress, calculateDrivingDistance } = require('../utils/distance');

    // First, validate addresses using Address Validation API (if available) or geocoding
    const providerCoords = await validateAndGeocodeAddress(
      provider.address_line1,
      provider.city,
      provider.state,
      provider.zip_code
    );

    const clientCoords = await validateAndGeocodeAddress(
      clientAddress,
      clientCity,
      clientState,
      clientZipCode
    );

    // Check if geocoding was successful
    if (!providerCoords) {
      return res.status(400).json({ 
        error: 'Could not validate provider address. Please contact the provider.',
        addressValid: false
      });
    }

    if (!clientCoords) {
      return res.status(400).json({ 
        error: 'Could not validate the address you entered. Please check that it is a valid address.',
        addressValid: false
      });
    }

    // Calculate driving distance (will use Google Maps Distance Matrix if API key is set)
    const distance = await calculateDrivingDistance(
      {
        address: provider.address_line1,
        city: provider.city,
        state: provider.state,
        zipCode: provider.zip_code
      },
      {
        address: clientAddress,
        city: clientCity,
        state: clientState,
        zipCode: clientZipCode
      }
    );

    if (distance === null) {
      return res.status(400).json({ 
        error: 'Could not calculate distance. Please try again or contact the provider.',
        addressValid: false
      });
    }
    const maxDistance = provider.max_distance || 0;
    const withinRange = maxDistance > 0 ? distance <= maxDistance : true; // If no max_distance set, assume provider travels anywhere

    const providerZipCode = provider.zip_code || '';
    const locationText = providerZipCode ? `their location at ${providerZipCode}` : 'their location';
    
    res.json({
      distance: distance,
      maxDistance: maxDistance,
      withinRange: withinRange,
      providerCity: provider.city,
      providerState: provider.state,
      providerZipCode: providerZipCode,
      addressValid: true,
      message: withinRange 
        ? `Provider is willing to travel up to ${maxDistance} miles from ${locationText}. Your location is approximately ${distance} miles away.`
        : `Provider is willing to travel up to ${maxDistance} miles from ${locationText}. Your location is approximately ${distance} miles away, which is outside this range.`
    });
  } catch (err) {
    console.error('Error checking distance:', err);
    res.status(500).json({ 
      error: 'Server error while checking distance', 
      details: err.message,
      addressValid: false
    });
  }
});

module.exports = router;
