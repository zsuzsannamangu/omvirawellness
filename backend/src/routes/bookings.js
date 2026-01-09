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
        u.id as provider_user_id,
        CASE WHEN r.id IS NOT NULL THEN true ELSE false END as has_review
      FROM client_provider_bookings b
      JOIN provider_profiles p ON b.provider_id = p.id
      JOIN users u ON p.user_id = u.id
      LEFT JOIN reviews r ON r.provider_id = p.id AND r.reviewer_id = $2
      WHERE b.client_id = $1
      ORDER BY b.booking_date DESC, b.start_time DESC`,
      [clientProfileId, req.userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching client bookings:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET client stats (booking count)
router.get('/client/:clientId/stats', verifyToken, async (req, res) => {
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

    // Get total booking count (excluding cancelled)
    const bookingCountResult = await pool.query(
      `SELECT COUNT(*) as total
       FROM client_provider_bookings
       WHERE client_id = $1 AND status != 'cancelled'`,
      [clientProfileId]
    );

    const totalBookings = parseInt(bookingCountResult.rows[0]?.total) || 0;

    res.json({ totalBookings });
  } catch (err) {
    console.error('Error fetching client stats:', err);
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

// POST - Cancel booking (client can cancel their own bookings)
router.post('/:bookingId/cancel', verifyToken, async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { cancellation_reason } = req.body;

    if (req.userType !== 'client') {
      return res.status(403).json({ error: 'Only clients can cancel bookings through this endpoint' });
    }

    // Get client profile ID from user ID
    const profileResult = await pool.query(
      'SELECT id FROM client_profiles WHERE user_id = $1',
      [req.userId]
    );

    if (profileResult.rows.length === 0) {
      return res.status(404).json({ error: 'Client profile not found' });
    }

    const clientProfileId = profileResult.rows[0].id;

    // Verify booking belongs to this client
    const bookingResult = await pool.query(
      'SELECT id, status FROM client_provider_bookings WHERE id = $1 AND client_id = $2',
      [bookingId, clientProfileId]
    );

    if (bookingResult.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const booking = bookingResult.rows[0];

    // Check if booking can be cancelled (not already cancelled or completed)
    if (booking.status === 'cancelled') {
      return res.status(400).json({ error: 'Booking is already cancelled' });
    }

    if (booking.status === 'completed') {
      return res.status(400).json({ error: 'Cannot cancel a completed booking' });
    }

    // Update booking status to cancelled
    const updateResult = await pool.query(
      `UPDATE client_provider_bookings 
       SET status = 'cancelled', 
           cancelled_by = 'client',
           cancellation_reason = $1,
           updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 
       RETURNING *`,
      [cancellation_reason || null, bookingId]
    );

    // Restore availability when booking is cancelled
    try {
      const bookingDetails = await pool.query(
        `SELECT provider_id, booking_date, start_time, duration_minutes 
         FROM client_provider_bookings 
         WHERE id = $1`,
        [bookingId]
      );

      if (bookingDetails.rows.length > 0) {
        const { provider_id, booking_date, start_time, duration_minutes } = bookingDetails.rows[0];
        
        // Get current availability
        const availRes = await pool.query(
          'SELECT availability FROM provider_profiles WHERE id = $1',
          [provider_id]
        );
        
        let availability = [];
        if (availRes.rows.length > 0 && availRes.rows[0].availability) {
          if (typeof availRes.rows[0].availability === 'string') {
            try { availability = JSON.parse(availRes.rows[0].availability); } catch { availability = []; }
          } else {
            availability = availRes.rows[0].availability;
          }
        }

        const normalizedDate = String(booking_date).slice(0, 10);
        const normalizedTime = String(start_time).slice(0, 5);
        
        // Remove the blocked slot for this cancelled booking
        const filtered = Array.isArray(availability)
          ? availability.filter((slot) => {
              if (!slot || slot.type !== 'blocked') return true;
              const slotDate = String(slot.date).slice(0, 10);
              const slotTime = String(slot.time).slice(0, 5);
              return !(slotDate === normalizedDate && slotTime === normalizedTime);
            })
          : [];

        await pool.query(
          'UPDATE provider_profiles SET availability = $1::JSONB, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
          [JSON.stringify(filtered), provider_id]
        );
      }
    } catch (availabilityError) {
      console.error('Error restoring availability on cancel:', availabilityError);
      // Don't fail the cancellation if availability update fails
    }

    res.json({ 
      success: true, 
      booking: updateResult.rows[0],
      message: 'Booking cancelled successfully'
    });
  } catch (err) {
    console.error('Error cancelling booking:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// POST - Reschedule booking (client can reschedule their own bookings)
router.post('/:bookingId/reschedule', verifyToken, async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { new_date, new_time } = req.body;

    console.log('Reschedule request:', { bookingId, new_date, new_time, userId: req.userId, userType: req.userType });

    if (req.userType !== 'client') {
      return res.status(403).json({ error: 'Only clients can reschedule their own bookings' });
    }

    if (!new_date || !new_time) {
      return res.status(400).json({ error: 'New date and time are required' });
    }

    // Get client profile ID from user ID
    const profileResult = await pool.query(
      'SELECT id FROM client_profiles WHERE user_id = $1',
      [req.userId]
    );

    if (profileResult.rows.length === 0) {
      return res.status(404).json({ error: 'Client profile not found' });
    }

    const clientProfileId = profileResult.rows[0].id;

    // Get the existing booking details (including provider user_id for notification)
    const bookingResult = await pool.query(
      `SELECT b.id, b.provider_id, b.booking_date, b.start_time, b.end_time, 
              b.duration_minutes, b.status, b.total_amount, b.payment_status,
              b.client_notes, b.provider_notes, p.user_id as provider_user_id,
              cp.first_name as client_first_name, cp.last_name as client_last_name
       FROM client_provider_bookings b
       JOIN provider_profiles p ON b.provider_id = p.id
       JOIN client_profiles cp ON b.client_id = cp.id
       WHERE b.id = $1 AND b.client_id = $2`,
      [bookingId, clientProfileId]
    );

    console.log('Booking query result:', { 
      bookingFound: bookingResult.rows.length > 0, 
      bookingId, 
      clientProfileId,
      booking: bookingResult.rows[0] 
    });

    if (bookingResult.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found or does not belong to this client' });
    }

    const oldBooking = bookingResult.rows[0];

    // Only allow rescheduling for confirmed bookings
    if (oldBooking.status !== 'confirmed') {
      return res.status(400).json({ 
        error: `Cannot reschedule a booking with status: ${oldBooking.status}. Only confirmed bookings can be rescheduled.` 
      });
    }

    // Calculate new end time
    const [hours, minutes] = new_time.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) {
      return res.status(400).json({ error: 'Invalid time format. Expected HH:MM' });
    }
    
    const durationMinutes = oldBooking.duration_minutes || 60; // Default to 60 if not set
    const totalMinutes = hours * 60 + minutes + durationMinutes;
    const endHours = Math.floor(totalMinutes / 60) % 24;
    const endMinutes = totalMinutes % 60;
    const newEndTimeStr = `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
    
    console.log('Time calculation:', { 
      new_time, 
      hours, 
      minutes, 
      durationMinutes, 
      totalMinutes, 
      endHours, 
      endMinutes, 
      newEndTimeStr 
    });

    // Start a transaction
    await pool.query('BEGIN');

    try {
      // 1. Restore old availability (remove blocked slot)
      const oldNormalizedDate = String(oldBooking.booking_date).slice(0, 10);
      const oldNormalizedTime = String(oldBooking.start_time).slice(0, 5);
      
      const availRes = await pool.query(
        'SELECT availability FROM provider_profiles WHERE id = $1',
        [oldBooking.provider_id]
      );
      
      let availability = [];
      if (availRes.rows.length > 0 && availRes.rows[0].availability) {
        if (typeof availRes.rows[0].availability === 'string') {
          try { availability = JSON.parse(availRes.rows[0].availability); } catch { availability = []; }
        } else {
          availability = availRes.rows[0].availability;
        }
      }

      // Remove the blocked slot for the old booking time AND restore the original slot if it was a one-time slot
      // First, remove the blocked slot
      let filtered = Array.isArray(availability)
        ? availability.filter((slot) => {
            if (!slot || slot.type !== 'blocked') return true;
            const slotDate = String(slot.date).slice(0, 10);
            const slotTime = String(slot.time).slice(0, 5);
            return !(slotDate === oldNormalizedDate && slotTime === oldNormalizedTime);
          })
        : [];

      // Check if we need to restore a one-time slot (if the blocked slot had notes indicating it was from a one-time slot)
      // Since we don't store that info, we'll restore it as an available one-time slot
      // This makes the original time available again for booking
      const wasBlocked = availability.some((slot) => {
        if (!slot || slot.type !== 'blocked') return false;
        const slotDate = String(slot.date).slice(0, 10);
        const slotTime = String(slot.time).slice(0, 5);
        return slotDate === oldNormalizedDate && slotTime === oldNormalizedTime;
      });

      // If there was a blocked slot, restore the original time as an available one-time slot
      // This ensures the original date/time becomes available again
      if (wasBlocked) {
        // Check if this slot already exists as a non-blocked slot (shouldn't happen, but check anyway)
        const slotExists = filtered.some((slot) => {
          if (!slot || slot.type === 'blocked') return false;
          const slotDate = String(slot.date).slice(0, 10);
          const slotTime = String(slot.time).slice(0, 5);
          return slotDate === oldNormalizedDate && slotTime === oldNormalizedTime;
        });

        // If the slot doesn't exist as available, add it back as a one-time available slot
        if (!slotExists) {
          filtered.push({
            id: `restored-${Date.now()}`,
            date: oldNormalizedDate,
            time: oldNormalizedTime,
            duration: oldBooking.duration_minutes,
            isRecurring: false,
            type: 'available',
            notes: 'Restored from rescheduled booking'
          });
        }
      }

      // 2. Block the new time slot
      const newNormalizedDate = String(new_date).slice(0, 10);
      const newNormalizedTime = String(new_time).slice(0, 5);
      
      // Check if new time slot is already blocked
      const isAlreadyBlocked = filtered.some((slot) => {
        if (!slot || slot.type !== 'blocked') return false;
        const slotDate = String(slot.date).slice(0, 10);
        const slotTime = String(slot.time).slice(0, 5);
        return slotDate === newNormalizedDate && slotTime === newNormalizedTime;
      });

      if (isAlreadyBlocked) {
        await pool.query('ROLLBACK');
        return res.status(409).json({ error: 'The selected time slot is no longer available' });
      }

      // Verify the time slot exists in provider's availability (either one-time or recurring)
      // Include slots that don't have a type field (legacy available slots) or have type 'available'
      const slotExists = filtered.some((slot) => {
        if (!slot) return false;
        // Skip blocked slots
        if (slot.type === 'blocked') return false;
        
        const slotDate = String(slot.date).slice(0, 10);
        const slotTime = String(slot.time).slice(0, 5);
        
        // Check one-time availability
        if (!slot.isRecurring && slotDate === newNormalizedDate && slotTime === newNormalizedTime) {
          console.log('Found matching one-time slot:', { slotDate, slotTime, newNormalizedDate, newNormalizedTime });
          return true;
        }
        
        // Check recurring availability
        if (slot.isRecurring && slot.recurringPattern && slot.recurringPattern.frequency === 'weekly') {
          // Parse date in local timezone to avoid timezone issues
          const [year, month, day] = newNormalizedDate.split('-').map(Number);
          const checkDate = new Date(year, month - 1, day);
          const dayOfWeek = checkDate.getDay();
          
          if (slotTime === newNormalizedTime && slot.recurringPattern.daysOfWeek) {
            // Check if daysOfWeek contains this day (can be numbers 0-6 or day names)
            const matches = slot.recurringPattern.daysOfWeek.some((day) => {
              if (typeof day === 'number') {
                return day === dayOfWeek;
              } else if (typeof day === 'string') {
                const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
                const dayName = dayNames[dayOfWeek].toLowerCase();
                return day.toLowerCase() === dayName;
              }
              return false;
            });
            
            if (matches) {
              // Check date range - use local date parsing to avoid timezone issues
              const [slotYear, slotMonth, slotDay] = slotDate.split('-').map(Number);
              const slotDateObj = new Date(slotYear, slotMonth - 1, slotDay);
              
              let startDate = slotDateObj;
              if (slot.recurringPattern.startDate) {
                const [startYear, startMonth, startDay] = String(slot.recurringPattern.startDate).slice(0, 10).split('-').map(Number);
                startDate = new Date(startYear, startMonth - 1, startDay);
              }
              
              let endDate = null;
              if (slot.recurringPattern.endDate) {
                const [endYear, endMonth, endDay] = String(slot.recurringPattern.endDate).slice(0, 10).split('-').map(Number);
                endDate = new Date(endYear, endMonth - 1, endDay);
              }
              
              // Compare dates at midnight (ignore time)
              checkDate.setHours(0, 0, 0, 0);
              startDate.setHours(0, 0, 0, 0);
              if (endDate) endDate.setHours(0, 0, 0, 0);
              
              if (checkDate >= startDate && (!endDate || checkDate <= endDate)) {
                console.log('Found matching recurring slot:', { 
                  slotDate, 
                  slotTime, 
                  newNormalizedDate, 
                  newNormalizedTime,
                  dayOfWeek,
                  startDate: startDate.toISOString().slice(0, 10),
                  endDate: endDate ? endDate.toISOString().slice(0, 10) : null
                });
                return true;
              }
            }
          }
        }
        
        return false;
      });

      console.log('Slot existence check:', {
        newNormalizedDate,
        newNormalizedTime,
        filteredCount: filtered.length,
        slotExists,
        availableSlots: filtered.filter(s => s.type !== 'blocked').map(s => ({
          date: String(s.date).slice(0, 10),
          time: String(s.time).slice(0, 5),
          isRecurring: s.isRecurring,
          type: s.type
        }))
      });

      if (!slotExists) {
        await pool.query('ROLLBACK');
        return res.status(400).json({ error: 'The selected time slot is not available in the provider\'s schedule' });
      }

      // Add blocked slot for new time
      filtered.push({
        id: Date.now().toString(),
        date: newNormalizedDate,
        time: newNormalizedTime,
        duration: oldBooking.duration_minutes,
        isRecurring: false,
        type: 'blocked',
        notes: 'Auto-blocked by booking'
      });

      // Update availability
      await pool.query(
        'UPDATE provider_profiles SET availability = $1::JSONB, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [JSON.stringify(filtered), oldBooking.provider_id]
      );

      // 3. Update the booking with new date and time
      const updateResult = await pool.query(
        `UPDATE client_provider_bookings 
         SET booking_date = $1,
             start_time = $2,
             end_time = $3,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $4
         RETURNING *`,
        [new_date, new_time, newEndTimeStr, bookingId]
      );

      // 4. Create notification for provider
      try {
        if (!oldBooking.provider_user_id) {
          console.error('Provider user_id not found in booking:', oldBooking);
          throw new Error('Provider user_id is missing');
        }

        const clientName = `${oldBooking.client_first_name || ''} ${oldBooking.client_last_name || ''}`.trim() || 'A client';
        
        // Format dates in local timezone to avoid timezone shifts
        // Parse date string (YYYY-MM-DD) directly without timezone conversion
        const formatDate = (dateInput) => {
          if (!dateInput) return 'Unknown date';
          
          let dateStr;
          // Handle different input types: Date object, string, or timestamp
          if (dateInput instanceof Date) {
            // If it's a Date object, extract YYYY-MM-DD
            const year = dateInput.getFullYear();
            const month = String(dateInput.getMonth() + 1).padStart(2, '0');
            const day = String(dateInput.getDate()).padStart(2, '0');
            dateStr = `${year}-${month}-${day}`;
          } else {
            // If it's a string, extract YYYY-MM-DD
            dateStr = String(dateInput).slice(0, 10);
          }
          
          // Validate the date string format (YYYY-MM-DD)
          if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            console.error('Invalid date format:', dateInput, 'extracted:', dateStr);
            return 'Invalid date';
          }
          
          const [year, month, day] = dateStr.split('-').map(Number);
          
          // Validate the parsed values
          if (isNaN(year) || isNaN(month) || isNaN(day) || month < 1 || month > 12 || day < 1 || day > 31) {
            console.error('Invalid date values:', { year, month, day, original: dateInput });
            return 'Invalid date';
          }
          
          // Create date in local timezone (not UTC)
          const date = new Date(year, month - 1, day);
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        };
        
        // Extract just the date part (YYYY-MM-DD) from both dates
        // Handle oldBooking.booking_date which might be a Date object from PostgreSQL
        let oldDateStr;
        if (oldBooking.booking_date instanceof Date) {
          const d = oldBooking.booking_date;
          oldDateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        } else {
          oldDateStr = String(oldBooking.booking_date).slice(0, 10);
        }
        
        const newDateStr = String(new_date).slice(0, 10);
        
        const oldDate = formatDate(oldDateStr);
        const newDateFormatted = formatDate(newDateStr);
        
        const formatTime = (timeStr) => {
          const [h, m] = timeStr.split(':').map(Number);
          const ampm = h >= 12 ? 'PM' : 'AM';
          const hh = h % 12 === 0 ? 12 : h % 12;
          return `${hh}:${String(m).padStart(2, '0')} ${ampm}`;
        };
        
        const notificationMessage = `${clientName} has rescheduled their appointment from ${oldDate} at ${formatTime(oldBooking.start_time)} to ${newDateFormatted} at ${formatTime(new_time)}.`;
        
        console.log('Creating notification:', {
          provider_user_id: oldBooking.provider_user_id,
          booking_id: bookingId,
          old_date_raw: oldBooking.booking_date,
          old_date_type: typeof oldBooking.booking_date,
          old_date_isDate: oldBooking.booking_date instanceof Date,
          new_date_raw: new_date,
          old_date_str: oldDateStr,
          new_date_str: newDateStr,
          old_date_formatted: oldDate,
          new_date_formatted: newDateFormatted,
          message: notificationMessage
        });

        const notificationResult = await pool.query(
          `INSERT INTO notifications (user_id, notification_type, title, message, booking_id, is_read, created_at)
           VALUES ($1, $2, $3, $4, $5, false, CURRENT_TIMESTAMP)
           RETURNING id`,
          [
            oldBooking.provider_user_id,
            'booking_rescheduled',
            'Appointment Rescheduled',
            notificationMessage,
            bookingId
          ]
        );

        console.log('Notification created successfully:', notificationResult.rows[0]);
      } catch (notificationError) {
        console.error('Error creating notification:', notificationError);
        console.error('Notification error stack:', notificationError.stack);
        // Don't fail the reschedule if notification fails
      }

      await pool.query('COMMIT');

      res.json({
        success: true,
        booking: updateResult.rows[0],
        message: 'Booking rescheduled successfully'
      });
    } catch (transactionError) {
      await pool.query('ROLLBACK');
      console.error('Transaction error in reschedule:', transactionError);
      throw transactionError;
    }
  } catch (err) {
    console.error('Error rescheduling booking:', err);
    console.error('Error stack:', err.stack);
    res.status(500).json({ error: 'Server error', details: err.message });
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

    // 2) verify booking belongs to provider and get booking details
    const bookingResult = await pool.query(
      `SELECT b.*, c.user_id as client_user_id, c.first_name, c.last_name, u.email as client_email,
              pp.business_name, pp.contact_name
       FROM client_provider_bookings b
       JOIN client_profiles c ON b.client_id = c.id
       JOIN users u ON c.user_id = u.id
       JOIN provider_profiles pp ON b.provider_id = pp.id
       WHERE b.id = $1 AND b.provider_id = $2`,
      [bookingId, providerProfileId]
    );
    if (bookingResult.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found for this provider' });
    }

    const booking = bookingResult.rows[0];
    const providerName = booking.contact_name || booking.business_name || 'Provider';
    
    // Validate we have the client user ID
    if (!booking.client_user_id) {
      console.error('ERROR: client_user_id is missing from booking query result:', booking);
      return res.status(500).json({ error: 'Unable to retrieve client information' });
    }
    
    console.log('Booking confirmation - Client user ID:', booking.client_user_id, 'Provider user ID:', req.userId);

    // 3) update status
    const updateFields = status === 'cancelled' 
      ? `status = $1, cancelled_by = 'provider', updated_at = CURRENT_TIMESTAMP`
      : `status = $1, updated_at = CURRENT_TIMESTAMP`;
    
    const updateResult = await pool.query(
      `UPDATE client_provider_bookings SET ${updateFields} WHERE id = $2 RETURNING *`,
      [status, bookingId]
    );

    // Helper functions for date/time formatting
    const formatDate = (dateInput) => {
      if (!dateInput) return 'Unknown date';
      try {
        // Handle different date formats
        let dateStr;
        if (dateInput instanceof Date) {
          dateStr = dateInput.toISOString().slice(0, 10);
        } else {
          dateStr = String(dateInput).slice(0, 10);
        }
        
        // Validate date string format (YYYY-MM-DD)
        if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
          console.error('Invalid date format:', dateInput);
          return 'Unknown date';
        }
        
        const [year, month, day] = dateStr.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        
        // Validate the date is valid
        if (isNaN(date.getTime())) {
          console.error('Invalid date:', dateInput);
          return 'Unknown date';
        }
        
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      } catch (error) {
        console.error('Error formatting date:', error, dateInput);
        return 'Unknown date';
      }
    };

    const formatTime = (timeInput) => {
      if (!timeInput) return 'Unknown time';
      try {
        const timeStr = String(timeInput).slice(0, 5);
        if (!/^\d{2}:\d{2}$/.test(timeStr)) {
          console.error('Invalid time format:', timeInput);
          return 'Unknown time';
        }
        const [hours, minutes] = timeStr.split(':').map(Number);
        const hour12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
        const ampm = hours >= 12 ? 'PM' : 'AM';
        return `${hour12}:${String(minutes).padStart(2, '0')} ${ampm}`;
      } catch (error) {
        console.error('Error formatting time:', error, timeInput);
        return 'Unknown time';
      }
    };

    // 4) Send message to client when status is confirmed or cancelled
    try {
      let messageSubject, messageBody;
      
      if (status === 'confirmed') {
        messageSubject = 'Appointment Confirmed';
        const appointmentDate = formatDate(booking.booking_date);
        const appointmentTime = formatTime(booking.start_time);
        messageBody = `Your appointment request for ${appointmentDate} at ${appointmentTime} has been confirmed. ${providerName} looks forward to seeing you!`;
      } else if (status === 'cancelled') {
        messageSubject = 'Appointment Declined';
        const appointmentDate = formatDate(booking.booking_date);
        const appointmentTime = formatTime(booking.start_time);
        messageBody = `We're sorry, but ${providerName} is unable to accommodate your appointment request for ${appointmentDate} at ${appointmentTime}. Please feel free to request another time that works for you.`;
      }

      if (messageSubject && messageBody) {
        // Validate IDs before creating message
        if (!req.userId) {
          console.error('ERROR: req.userId is missing');
          throw new Error('Provider user ID is missing');
        }
        if (!booking.client_user_id) {
          console.error('ERROR: booking.client_user_id is missing');
          throw new Error('Client user ID is missing');
        }
        
        console.log('Creating confirmation message:', {
          senderId: req.userId,
          recipientId: booking.client_user_id,
          subject: messageSubject,
          bodyLength: messageBody.length
        });
        
        // Insert message
        const messageResult = await pool.query(
          `INSERT INTO messages (sender_id, recipient_id, subject, body)
           VALUES ($1, $2, $3, $4)
           RETURNING *`,
          [req.userId, booking.client_user_id, messageSubject, messageBody]
        );

        if (!messageResult.rows || messageResult.rows.length === 0) {
          throw new Error('Message was not created - no rows returned');
        }

        const messageId = messageResult.rows[0].id;
        console.log('Message created successfully with ID:', messageId);
        
        // Verify the message exists
        const verifyResult = await pool.query(
          'SELECT id, sender_id, recipient_id FROM messages WHERE id = $1',
          [messageId]
        );
        if (verifyResult.rows.length === 0) {
          throw new Error('Message verification failed - message not found after creation');
        }
        console.log('Message verified in database:', verifyResult.rows[0]);

        // Create metadata records for both sender and recipient
        // Sender (provider): message is in "sent" folder, read, not starred, not deleted
        await pool.query(
          `INSERT INTO message_user_metadata (message_id, user_id, is_read, is_starred, is_deleted)
           VALUES ($1, $2, true, false, false)
           ON CONFLICT (message_id, user_id) DO NOTHING`,
          [messageId, req.userId]
        );

        // Recipient (client): message is in "inbox", not read, not starred, not deleted
        await pool.query(
          `INSERT INTO message_user_metadata (message_id, user_id, is_read, is_starred, is_deleted)
           VALUES ($1, $2, false, false, false)
           ON CONFLICT (message_id, user_id) DO NOTHING`,
          [messageId, booking.client_user_id]
        );
        
        console.log('Message metadata created successfully for both sender and recipient');
        
        // Verify the client can see the message in their inbox
        const inboxCheck = await pool.query(
          `SELECT m.id, m.subject, COALESCE(mum.is_deleted, false) as is_deleted
           FROM messages m
           LEFT JOIN message_user_metadata mum ON m.id = mum.message_id AND mum.user_id = $1
           WHERE m.recipient_id = $1 
           AND m.id = $2
           AND COALESCE(mum.is_deleted, false) = false`,
          [booking.client_user_id, messageId]
        );
        console.log('Inbox verification query result:', {
          messageId,
          clientUserId: booking.client_user_id,
          found: inboxCheck.rows.length > 0,
          message: inboxCheck.rows[0] || null
        });
      } else {
        console.warn('No message subject/body generated for booking status:', status);
      }
    } catch (messageError) {
      console.error('Error creating message:', messageError);
      console.error('Message error details:', {
        code: messageError.code,
        detail: messageError.detail,
        message: messageError.message,
        stack: messageError.stack
      });
      // Don't fail the status update if message creation fails
    }

    // 5) If cancelling, restore availability and create notification
    if (status === 'cancelled') {
      // Restore availability
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

        const normalizedDate = String(booking.booking_date).slice(0, 10);
        const normalizedTime = String(booking.start_time).slice(0, 5);
        
        // Remove the blocked slot for this cancelled booking
        const filtered = Array.isArray(availability)
          ? availability.filter((slot) => {
              if (!slot || slot.type !== 'blocked') return true;
              const slotDate = String(slot.date).slice(0, 10);
              const slotTime = String(slot.time).slice(0, 5);
              return !(slotDate === normalizedDate && slotTime === normalizedTime);
            })
          : [];

        await pool.query(
          'UPDATE provider_profiles SET availability = $1::JSONB, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
          [JSON.stringify(filtered), providerProfileId]
        );
      } catch (availabilityError) {
        console.error('Error restoring availability on cancel:', availabilityError);
        // Don't fail the cancellation if availability update fails
      }

      // Create notification for client
      try {
        const notificationMessage = `Your appointment scheduled for ${formatDate(booking.booking_date)} at ${formatTime(booking.start_time)} has been cancelled by the provider.`;

        await pool.query(
          `INSERT INTO notifications (user_id, notification_type, title, message, booking_id, is_read, created_at)
           VALUES ($1, $2, $3, $4, $5, false, CURRENT_TIMESTAMP)`,
          [
            booking.client_user_id,
            'booking_cancelled',
            'Appointment Cancelled',
            notificationMessage,
            bookingId
          ]
        );

        // TODO: Send email to client when email service is implemented
        console.log(`Email notification should be sent to: ${booking.client_email}`);
      } catch (notificationError) {
        console.error('Error creating notification:', notificationError);
        // Don't fail the cancellation if notification fails
      }
    } else if (status === 'confirmed') {
      // Create notification for client when booking is confirmed
      try {
        const notificationMessage = `Your appointment request for ${formatDate(booking.booking_date)} at ${formatTime(booking.start_time)} has been confirmed!`;

        await pool.query(
          `INSERT INTO notifications (user_id, notification_type, title, message, booking_id, is_read, created_at)
           VALUES ($1, $2, $3, $4, $5, false, CURRENT_TIMESTAMP)`,
          [
            booking.client_user_id,
            'booking_confirmed',
            'Appointment Confirmed',
            notificationMessage,
            bookingId
          ]
        );

        // TODO: Send email to client when email service is implemented
        console.log(`Email notification should be sent to: ${booking.client_email}`);
      } catch (notificationError) {
        console.error('Error creating notification:', notificationError);
        // Don't fail the confirmation if notification fails
      }
    }

    res.json({ success: true, booking: updateResult.rows[0] });
  } catch (err) {
    console.error('Error updating booking status:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST a new booking (client or provider must be authenticated)
router.post('/', verifyToken, async (req, res) => {
  try {
    // Allow both clients and providers to create bookings
    if (req.userType !== 'client' && req.userType !== 'provider') {
      return res.status(403).json({ error: 'Only clients and providers can create bookings' });
    }
    
    const {
      provider_id, // This is the user_id of the provider
      client_id, // This is the user_id of the client (required when provider creates booking)
      service_name,
      service_duration,
      service_price,
      booking_date,
      start_time,
      location_type,
      location_details,
      add_ons,
      total_amount,
      client_notes,
      status, // Allow provider to set initial status
      date, // Alternative field name
      time, // Alternative field name  
      duration, // Alternative field name
      price, // Alternative field name
      service_id // Alternative field name
    } = req.body;

    // Normalize field names (support both old and new formats)
    const normalizedDate = booking_date || date;
    const normalizedTime = start_time || time;
    const normalizedDuration = service_duration || duration;
    const normalizedPrice = service_price || price || total_amount;
    const normalizedServiceName = service_name || `Service ${service_id || ''}`;

    // Validate required fields
    if (!provider_id || !normalizedDate || !normalizedTime) {
      return res.status(400).json({ error: 'Missing required fields: provider_id, date, and time are required' });
    }

    // Determine client ID based on who is creating the booking
    let clientUserId;
    if (req.userType === 'client') {
      // Client is creating their own booking
      clientUserId = req.userId;
    } else if (req.userType === 'provider') {
      // Provider is creating booking for a client
      if (!client_id) {
        return res.status(400).json({ error: 'client_id is required when provider creates booking' });
      }
      clientUserId = client_id;
    }

    // Get client profile ID
    const clientProfileResult = await pool.query(
      'SELECT id FROM client_profiles WHERE user_id = $1',
      [clientUserId]
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

    // Check for duplicate booking (same client, provider, date, and time)
    const duplicateCheck = await pool.query(
      `SELECT id FROM client_provider_bookings 
       WHERE client_id = $1 
       AND provider_id = $2 
       AND booking_date = $3 
       AND start_time = $4 
       AND status NOT IN ('cancelled', 'no_show')`,
      [clientProfileId, providerProfileId, normalizedDate, normalizedTime]
    );

    if (duplicateCheck.rows.length > 0) {
      return res.status(409).json({ 
        error: 'A booking already exists for this date and time. Please choose a different time slot.' 
      });
    }

    // Calculate end time from duration
    const durationMinutes = normalizedDuration || 60;
    const [hours, minutes] = normalizedTime.split(':').map(Number);
    const startDateTime = new Date();
    startDateTime.setHours(hours, minutes, 0, 0);
    const endDateTime = new Date(startDateTime.getTime() + durationMinutes * 60000);
    const end_time = `${String(endDateTime.getHours()).padStart(2, '0')}:${String(endDateTime.getMinutes()).padStart(2, '0')}`;

    // For now, service_id is nullable - we'll store service info in notes or create a migration later
    // Store service details in provider_notes as JSON for now
    const serviceInfo = JSON.stringify({
      name: normalizedServiceName,
      duration: durationMinutes,
      price: normalizedPrice,
      location_type,
      location_details,
      add_ons: add_ons || []
    });

    // Determine initial status (provider can set to 'confirmed', otherwise 'pending')
    const bookingStatus = (req.userType === 'provider' && status === 'confirmed') ? 'confirmed' : 'pending';

    // Store service info in provider_notes for reference
    const providerNotesField = serviceInfo;

    // Insert booking
    // Note: service_id is NULL since services are stored as JSONB in provider_profiles
    let result;
    try {
      result = await pool.query(
        `INSERT INTO client_provider_bookings 
        (client_id, provider_id, service_id, booking_date, start_time, end_time, duration_minutes, 
         total_amount, payment_status, client_notes, provider_notes, status) 
        VALUES ($1, $2, NULL, $3, $4, $5, $6, $7, 'unpaid', $8, $9, $10) 
        RETURNING *`,
        [
          clientProfileId,
          providerProfileId,
          normalizedDate,
          normalizedTime,
          end_time,
          durationMinutes,
          normalizedPrice || 0,
          client_notes || null,
          providerNotesField,
          bookingStatus
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

      const availNormalizedDate = String(normalizedDate).slice(0,10);
      const availNormalizedTime = String(normalizedTime).slice(0,5);
      let filtered = Array.isArray(availability)
        ? availability.filter((slot) => {
            if (!slot || !slot.date || !slot.time) return true;
            const slotDate = String(slot.date).slice(0,10);
            const slotTime = String(slot.time).slice(0,5);
            // Only remove non-recurring exact matches
            if (slot.isRecurring) return true;
            return !(slotDate === availNormalizedDate && slotTime === availNormalizedTime);
          })
        : [];

      // Always add a one-time blocked slot to protect recurring or missed matches
      filtered = [
        ...filtered,
        {
          id: Date.now().toString(),
          date: availNormalizedDate,
          time: availNormalizedTime,
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
