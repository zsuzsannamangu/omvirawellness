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

// GET all bookings for a provider (authenticated)
router.get('/provider/:providerId', verifyToken, async (req, res) => {
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
    
    // Get bookings for this provider
    const result = await pool.query(
      `SELECT 
        b.id,
        b.booking_date,
        b.start_time,
        b.end_time,
        b.duration_minutes,
        b.status,
        b.total_amount,
        b.payment_status,
        b.client_notes,
        b.provider_notes,
        b.created_at,
        c.first_name,
        c.last_name,
        u.email,
        c.phone_number
      FROM client_provider_bookings b
      JOIN client_profiles c ON b.client_id = c.id
      JOIN users u ON c.user_id = u.id
      WHERE b.provider_id = $1
      ORDER BY b.booking_date DESC, b.start_time DESC`,
      [providerProfileId]
    );
    
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching provider bookings:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET bookings by status for provider
router.get('/provider/:providerId/:status', verifyToken, async (req, res) => {
  try {
    const { providerId, status } = req.params;
    
    if (req.userType !== 'provider') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Get provider profile ID
    const profileResult = await pool.query(
      'SELECT id FROM provider_profiles WHERE user_id = $1',
      [providerId]
    );
    
    if (profileResult.rows.length === 0) {
      return res.status(404).json({ error: 'Provider profile not found' });
    }
    
    const providerProfileId = profileResult.rows[0].id;
    
    const result = await pool.query(
      `SELECT 
        b.id,
        b.booking_date,
        b.start_time,
        b.end_time,
        b.duration_minutes,
        b.status,
        b.total_amount,
        b.payment_status,
        b.client_notes,
        b.provider_notes,
        b.created_at,
        c.first_name,
        c.last_name,
        u.email,
        c.phone_number
      FROM client_provider_bookings b
      JOIN client_profiles c ON b.client_id = c.id
      JOIN users u ON c.user_id = u.id
      WHERE b.provider_id = $1 AND b.status = $2
      ORDER BY b.booking_date DESC, b.start_time DESC`,
      [providerProfileId, status]
    );
    
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching provider bookings by status:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET all bookings for a client (authenticated)
router.get('/client/:clientId', verifyToken, async (req, res) => {
  try {
    const { clientId } = req.params;

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

    const result = await pool.query(
      `SELECT 
        b.id,
        b.booking_date,
        b.start_time,
        b.end_time,
        b.duration_minutes,
        b.status,
        b.total_amount,
        b.payment_status,
        b.client_notes,
        b.provider_notes,
        b.created_at,
        p.business_name,
        p.contact_name,
        u.id as provider_user_id
      FROM client_provider_bookings b
      JOIN provider_profiles p ON b.provider_id = p.id
      JOIN users u ON p.user_id = u.id
      WHERE b.client_id = $1
      ORDER BY b.booking_date DESC, b.start_time DESC`,
      [clientProfileId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching client bookings:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET bookings by status for client
router.get('/client/:clientId/:status', verifyToken, async (req, res) => {
  try {
    const { clientId, status } = req.params;

    if (req.userType !== 'client' || req.userId !== clientId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const profileResult = await pool.query(
      'SELECT id FROM client_profiles WHERE user_id = $1',
      [clientId]
    );
    if (profileResult.rows.length === 0) {
      return res.status(404).json({ error: 'Client profile not found' });
    }
    const clientProfileId = profileResult.rows[0].id;

    const result = await pool.query(
      `SELECT 
        b.id,
        b.booking_date,
        b.start_time,
        b.end_time,
        b.duration_minutes,
        b.status,
        b.total_amount,
        b.payment_status,
        b.client_notes,
        b.provider_notes,
        b.created_at,
        p.business_name,
        p.contact_name
      FROM client_provider_bookings b
      JOIN provider_profiles p ON b.provider_id = p.id
      WHERE b.client_id = $1 AND b.status = $2
      ORDER BY b.booking_date DESC, b.start_time DESC`,
      [clientProfileId, status]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching client bookings by status:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// UPDATE booking status (provider confirms/declines)
router.put('/:bookingId/status', verifyToken, async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body; // expected: 'confirmed' or 'cancelled'

    if (req.userType !== 'provider') {
      return res.status(403).json({ error: 'Only providers can update booking status' });
    }

    if (!['confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Ensure this booking belongs to this provider
    // 1) get provider profile id from user id
    const profileResult = await pool.query(
      'SELECT id FROM provider_profiles WHERE user_id = $1',
      [req.userId]
    );
    if (profileResult.rows.length === 0) {
      return res.status(404).json({ error: 'Provider profile not found' });
    }
    const providerProfileId = profileResult.rows[0].id;

    // 2) verify booking belongs to provider
    const bookingResult = await pool.query(
      'SELECT id FROM client_provider_bookings WHERE id = $1 AND provider_id = $2',
      [bookingId, providerProfileId]
    );
    if (bookingResult.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found for this provider' });
    }

    // 3) update status
    const updateResult = await pool.query(
      'UPDATE client_provider_bookings SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, bookingId]
    );

    res.json({ success: true, booking: updateResult.rows[0] });
  } catch (err) {
    console.error('Error updating booking status:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST a new booking (client must be authenticated)
router.post('/', verifyToken, async (req, res) => {
  try {
    // Verify user is a client
    if (req.userType !== 'client') {
      return res.status(403).json({ error: 'Only clients can create bookings' });
    }
    
    const {
      provider_id, // This is the user_id of the provider
      service_name,
      service_duration,
      service_price,
      booking_date,
      start_time,
      location_type,
      location_details,
      add_ons,
      total_amount,
      client_notes
    } = req.body;

    // Validate required fields
    if (!provider_id || !service_name || !booking_date || !start_time || !total_amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get client profile ID
    const clientProfileResult = await pool.query(
      'SELECT id FROM client_profiles WHERE user_id = $1',
      [req.userId]
    );
    
    if (clientProfileResult.rows.length === 0) {
      return res.status(404).json({ error: 'Client profile not found' });
    }
    
    const clientProfileId = clientProfileResult.rows[0].id;

    // Get provider profile ID
    const providerProfileResult = await pool.query(
      'SELECT id FROM provider_profiles WHERE user_id = $1',
      [provider_id]
    );
    
    if (providerProfileResult.rows.length === 0) {
      return res.status(404).json({ error: 'Provider profile not found' });
    }
    
    const providerProfileId = providerProfileResult.rows[0].id;

    // Calculate end time from duration
    const durationMinutes = service_duration || 60;
    const [hours, minutes] = start_time.split(':').map(Number);
    const startDateTime = new Date();
    startDateTime.setHours(hours, minutes, 0, 0);
    const endDateTime = new Date(startDateTime.getTime() + durationMinutes * 60000);
    const end_time = `${String(endDateTime.getHours()).padStart(2, '0')}:${String(endDateTime.getMinutes()).padStart(2, '0')}`;

    // For now, service_id is nullable - we'll store service info in notes or create a migration later
    // Store service details in provider_notes as JSON for now
    const serviceInfo = JSON.stringify({
      name: service_name,
      duration: durationMinutes,
      price: service_price,
      location_type,
      location_details,
      add_ons: add_ons || []
    });

    // Insert booking
    // Note: service_id is NULL since services are stored as JSONB in provider_profiles
    let result;
    try {
      result = await pool.query(
        `INSERT INTO client_provider_bookings 
        (client_id, provider_id, service_id, booking_date, start_time, end_time, duration_minutes, 
         total_amount, payment_status, client_notes, provider_notes, status) 
        VALUES ($1, $2, NULL, $3, $4, $5, $6, $7, 'unpaid', $8, $9, 'pending') 
        RETURNING *`,
        [
          clientProfileId,
          providerProfileId,
          booking_date,
          start_time,
          end_time,
          durationMinutes,
          total_amount,
          client_notes || null,
          serviceInfo
        ]
      );
    } catch (dbError) {
      console.error('Database insert error:', dbError);
      console.error('Database error code:', dbError.code);
      console.error('Database error detail:', dbError.detail);
      console.error('Database error constraint:', dbError.constraint);
      throw dbError;
    }

    // Remove the booked one-time slot from provider availability (exact date+time)
    try {
      const availRes = await pool.query(
        'SELECT availability FROM provider_profiles WHERE id = $1',
        [providerProfileId]
      );
      let availability = [];
      if (availRes.rows.length > 0 && availRes.rows[0].availability) {
        if (typeof availRes.rows[0].availability === 'string') {
          try { availability = JSON.parse(availRes.rows[0].availability); } catch { availability = []; }
        } else {
          availability = availRes.rows[0].availability;
        }
      }

      const normalizedDate = String(booking_date).slice(0,10);
      const normalizedTime = String(start_time).slice(0,5);
      let filtered = Array.isArray(availability)
        ? availability.filter((slot) => {
            if (!slot || !slot.date || !slot.time) return true;
            const slotDate = String(slot.date).slice(0,10);
            const slotTime = String(slot.time).slice(0,5);
            // Only remove non-recurring exact matches
            if (slot.isRecurring) return true;
            return !(slotDate === normalizedDate && slotTime === normalizedTime);
          })
        : [];

      // Always add a one-time blocked slot to protect recurring or missed matches
      filtered = [
        ...filtered,
        {
          id: Date.now().toString(),
          date: normalizedDate,
          time: normalizedTime,
          duration: durationMinutes,
          isRecurring: false,
          type: 'blocked',
          notes: 'Auto-blocked by booking'
        }
      ];

      await pool.query(
        'UPDATE provider_profiles SET availability = $1::JSONB, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [JSON.stringify(filtered), providerProfileId]
      );
    } catch (availabilityError) {
      console.error('Post-booking availability update failed:', availabilityError);
      // Don't fail the booking if availability update fails
    }

    res.status(201).json({
      success: true,
      booking: result.rows[0]
    });
  } catch (err) {
    console.error('Error creating booking:', err);
    console.error('Error stack:', err.stack);
    console.error('Request body:', req.body);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

module.exports = router;
