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

// POST - Create a new review
router.post('/', verifyToken, async (req, res) => {
  try {
    // Verify user is a client
    if (req.userType !== 'client') {
      return res.status(403).json({ error: 'Only clients can create reviews' });
    }

    const { provider_id, booking_id, rating, title, comment, recommends } = req.body;

    // Validate required fields
    if (!provider_id || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Provider ID and rating (1-5) are required' });
    }

    // Get provider profile ID from user_id
    const providerProfileResult = await pool.query(
      'SELECT id FROM provider_profiles WHERE user_id = $1',
      [provider_id]
    );

    if (providerProfileResult.rows.length === 0) {
      return res.status(404).json({ error: 'Provider not found' });
    }

    const providerProfileId = providerProfileResult.rows[0].id;

    // Check if review already exists for this booking (if booking_id provided)
    if (booking_id) {
      const existingReview = await pool.query(
        `SELECT r.id FROM reviews r
         JOIN client_provider_bookings b ON b.provider_id = r.provider_id
         WHERE b.id = $1 AND r.reviewer_id = $2`,
        [booking_id, req.userId]
      );

      if (existingReview.rows.length > 0) {
        return res.status(409).json({ error: 'You have already submitted a review for this booking' });
      }
    }

    // Check if user already reviewed this provider (optional - you might want to allow multiple reviews)
    // For now, we'll allow multiple reviews but you can uncomment this to prevent duplicates:
    /*
    const existingProviderReview = await pool.query(
      'SELECT id FROM reviews WHERE reviewer_id = $1 AND provider_id = $2',
      [req.userId, providerProfileId]
    );

    if (existingProviderReview.rows.length > 0) {
      return res.status(409).json({ error: 'You have already reviewed this provider' });
    }
    */

    // Insert review (note: recommends column doesn't exist in DB yet, so we skip it)
    const result = await pool.query(
      `INSERT INTO reviews (reviewer_id, provider_id, rating, title, comment, is_published)
       VALUES ($1, $2, $3, $4, $5, true)
       RETURNING *`,
      [
        req.userId,
        providerProfileId,
        rating,
        title || null,
        comment || null
      ]
    );

    const review = result.rows[0];

    // Update provider's average rating and total reviews count
    try {
      const ratingStats = await pool.query(
        `SELECT 
          COUNT(*) as total_reviews,
          AVG(rating)::numeric(3,2) as average_rating
         FROM reviews 
         WHERE provider_id = $1 AND is_published = true`,
        [providerProfileId]
      );

      if (ratingStats.rows.length > 0) {
        const stats = ratingStats.rows[0];
        await pool.query(
          `UPDATE provider_profiles 
           SET average_rating = $1, 
               total_reviews = $2,
               updated_at = CURRENT_TIMESTAMP
           WHERE id = $3`,
          [
            parseFloat(stats.average_rating) || 0,
            parseInt(stats.total_reviews) || 0,
            providerProfileId
          ]
        );
      }
    } catch (updateError) {
      console.error('Error updating provider rating:', updateError);
      // Don't fail the review creation if rating update fails
    }

    // Create notification for provider
    try {
      // Get provider's user_id and client's name
      const providerUserResult = await pool.query(
        `SELECT p.user_id
         FROM provider_profiles p
         WHERE p.id = $1`,
        [providerProfileId]
      );

      const clientNameResult = await pool.query(
        `SELECT first_name, last_name
         FROM client_profiles
         WHERE user_id = $1`,
        [req.userId]
      );

      if (providerUserResult.rows.length > 0) {
        const providerUserId = providerUserResult.rows[0].user_id;
        const clientName = clientNameResult.rows.length > 0
          ? `${clientNameResult.rows[0].first_name || ''} ${clientNameResult.rows[0].last_name || ''}`.trim() || 'A client'
          : 'A client';
        const stars = '★'.repeat(rating);
        
        console.log('Creating review notification:', {
          providerUserId,
          clientName,
          rating,
          title
        });

        const notificationResult = await pool.query(
          `INSERT INTO notifications (user_id, notification_type, title, message, review_id, is_read, created_at)
           VALUES ($1, $2, $3, $4, $5, false, CURRENT_TIMESTAMP)
           RETURNING id`,
          [
            providerUserId,
            'review_received',
            'New Review Received',
            `${clientName} left you a ${rating}-star review${title ? `: "${title}"` : ''}. ${stars}`,
            review.id
          ]
        );
        console.log('Review notification created successfully:', notificationResult.rows[0]);
      } else {
        console.error('Provider user_id not found for notification, providerProfileId:', providerProfileId);
      }
    } catch (notificationError) {
      console.error('Error creating review notification:', notificationError);
      console.error('Notification error stack:', notificationError.stack);
      // Don't fail the review creation if notification fails
    }

    res.status(201).json({
      success: true,
      review: review
    });
  } catch (err) {
    console.error('Error creating review:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// GET - Get reviews for a provider
router.get('/provider/:providerId', async (req, res) => {
  try {
    const { providerId } = req.params;

    // Get provider profile ID from user_id
    const providerProfileResult = await pool.query(
      'SELECT id FROM provider_profiles WHERE user_id = $1',
      [providerId]
    );

    if (providerProfileResult.rows.length === 0) {
      return res.status(404).json({ error: 'Provider not found' });
    }

    const providerProfileId = providerProfileResult.rows[0].id;

    // Get all published reviews for this provider
    const reviewsResult = await pool.query(
      `SELECT 
        r.id,
        r.rating,
        r.title,
        r.comment,
        r.created_at,
        u.email as reviewer_email,
        cp.first_name as reviewer_first_name,
        cp.last_name as reviewer_last_name
       FROM reviews r
       JOIN users u ON u.id = r.reviewer_id
       LEFT JOIN client_profiles cp ON cp.user_id = u.id
       WHERE r.provider_id = $1 AND r.is_published = true
       ORDER BY r.created_at DESC`,
      [providerProfileId]
    );

    res.json(reviewsResult.rows);
  } catch (err) {
    console.error('Error fetching reviews:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

module.exports = router;

