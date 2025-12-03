const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
    req.userId = decoded.id || decoded.userId;
    req.userType = decoded.user_type || decoded.userType;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// GET unread messages count
router.get('/unread-count', verifyToken, async (req, res) => {
  try {
    // For now, return 0 as there's no messaging system implemented yet
    // This can be extended when a messaging system is added
    // Example: Count unread messages from a messages table where recipient_id = req.userId and is_read = false
    
    // TODO: When messaging system is implemented, query the messages table:
    // const result = await pool.query(
    //   'SELECT COUNT(*) as count FROM messages WHERE recipient_id = $1 AND is_read = false',
    //   [req.userId]
    // );
    // res.json({ count: parseInt(result.rows[0].count) || 0 });
    
    res.json({ count: 0 });
  } catch (err) {
    console.error('Error fetching unread messages count:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

