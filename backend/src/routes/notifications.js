const { Router } = require('express');
const pool = require('../db');
const jwt = require('jsonwebtoken');

const router = Router();

// Helper function to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
    // JWT uses 'id' and 'user_type', not 'userId' and 'userType'
    req.userId = decoded.id || decoded.userId; // Support both for compatibility
    req.userType = decoded.user_type || decoded.userType; // Support both for compatibility
    
    if (!req.userId) {
      console.error('No user ID found in token:', decoded);
      return res.status(401).json({ error: 'Invalid token: missing user ID' });
    }
    
    console.log('Token decoded:', { id: req.userId, userType: req.userType });
    next();
  } catch (err) {
    console.error('Token verification error:', err.message);
    return res.status(401).json({ error: 'Invalid token', details: err.message });
  }
};

// GET - Get all notifications for the authenticated user
router.get('/', verifyToken, async (req, res) => {
  try {
    console.log('Fetching notifications for user_id:', req.userId);
    const result = await pool.query(
      `SELECT id, notification_type, title, message, booking_id, review_id, is_read, created_at
       FROM notifications
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 50`,
      [req.userId]
    );

    console.log('Found notifications:', result.rows.length);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// GET - Get unread notifications count
router.get('/unread-count', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT COUNT(*) as count
       FROM notifications
       WHERE user_id = $1 AND is_read = false`,
      [req.userId]
    );

    res.json({ count: parseInt(result.rows[0].count) || 0 });
  } catch (err) {
    console.error('Error fetching unread count:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// PUT - Mark notification as read
router.put('/:notificationId/read', verifyToken, async (req, res) => {
  try {
    const { notificationId } = req.params;

    // Verify the notification belongs to this user
    const checkResult = await pool.query(
      'SELECT id FROM notifications WHERE id = $1 AND user_id = $2',
      [notificationId, req.userId]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    await pool.query(
      'UPDATE notifications SET is_read = true WHERE id = $1',
      [notificationId]
    );

    res.json({ success: true });
  } catch (err) {
    console.error('Error marking notification as read:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// PUT - Mark all notifications as read
router.put('/read-all', verifyToken, async (req, res) => {
  try {
    await pool.query(
      'UPDATE notifications SET is_read = true WHERE user_id = $1 AND is_read = false',
      [req.userId]
    );

    res.json({ success: true });
  } catch (err) {
    console.error('Error marking all notifications as read:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

module.exports = router;

