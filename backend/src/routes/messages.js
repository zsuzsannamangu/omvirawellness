const express = require('express');
const router = express.Router();
const pool = require('../db');
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
    const result = await pool.query(
      `SELECT COUNT(*) as count 
       FROM messages m
       LEFT JOIN message_user_metadata mum ON m.id = mum.message_id AND mum.user_id = $1
       WHERE m.recipient_id = $1 
       AND COALESCE(mum.is_read, false) = false 
       AND COALESCE(mum.is_deleted, false) = false`,
      [req.userId]
    );
    
    res.json({ count: parseInt(result.rows[0].count) || 0 });
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

// Test endpoint to verify messages table exists
router.get('/test', verifyToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) as count FROM messages');
    res.json({ 
      success: true, 
      messageCount: parseInt(result.rows[0].count) || 0,
      userId: req.userId 
    });
  } catch (err) {
    res.status(500).json({ 
      error: 'Server error', 
      message: err.message,
      hint: 'Make sure the messages table exists. Run migration 011.'
    });
  }
});

// POST send a new message
router.post('/', verifyToken, async (req, res) => {
  try {
    const { recipientId, subject, body } = req.body;

    if (!recipientId || !subject || !body) {
      return res.status(400).json({ error: 'Recipient ID, subject, and body are required' });
    }

    // Verify recipient exists and is a provider (clients can only message providers)
    const recipientCheck = await pool.query(
      'SELECT id, user_type FROM users WHERE id = $1 AND is_active = true',
      [recipientId]
    );

    if (recipientCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Recipient not found' });
    }

    if (req.userType === 'client' && recipientCheck.rows[0].user_type !== 'provider') {
      return res.status(403).json({ error: 'Clients can only message providers' });
    }

    // Insert message (single row - folder is determined by query based on sender/recipient)
    const result = await pool.query(
      `INSERT INTO messages (sender_id, recipient_id, subject, body)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [req.userId, recipientId, subject, body]
    );

    const messageId = result.rows[0].id;

    // Create metadata records for both sender and recipient
    // Sender: message is in "sent" folder, not read, not starred, not deleted
    await pool.query(
      `INSERT INTO message_user_metadata (message_id, user_id, is_read, is_starred, is_deleted)
       VALUES ($1, $2, true, false, false)
       ON CONFLICT (message_id, user_id) DO NOTHING`,
      [messageId, req.userId]
    );

    // Recipient: message is in "inbox", not read, not starred, not deleted
    await pool.query(
      `INSERT INTO message_user_metadata (message_id, user_id, is_read, is_starred, is_deleted)
       VALUES ($1, $2, false, false, false)
       ON CONFLICT (message_id, user_id) DO NOTHING`,
      [messageId, recipientId]
    );

    res.status(201).json({
      success: true,
      message: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET messages for current user (inbox, sent, starred, trash)
router.get('/', verifyToken, async (req, res) => {
  try {
    const { folder = 'inbox' } = req.query;
    const validFolders = ['inbox', 'sent', 'starred', 'trash'];
    
    if (!validFolders.includes(folder)) {
      return res.status(400).json({ error: 'Invalid folder' });
    }

    let query;
    let params;

    if (folder === 'inbox') {
      query = `
        SELECT 
          m.*,
          COALESCE(mum.is_read, false) as is_read,
          COALESCE(mum.is_starred, false) as is_starred,
          COALESCE(mum.is_deleted, false) as is_deleted,
          sender.user_type as sender_type,
          COALESCE(pp_sender.contact_name, pp_sender.business_name) as sender_contact_name,
          pp_sender.business_name as sender_business_name,
          cp_sender.first_name as sender_client_first_name,
          cp_sender.last_name as sender_client_last_name
        FROM messages m
        LEFT JOIN message_user_metadata mum ON m.id = mum.message_id AND mum.user_id = $1
        LEFT JOIN users sender ON m.sender_id = sender.id
        LEFT JOIN provider_profiles pp_sender ON sender.id = pp_sender.user_id
        LEFT JOIN client_profiles cp_sender ON sender.id = cp_sender.user_id
        WHERE m.recipient_id = $1 
        AND COALESCE(mum.is_deleted, false) = false
        ORDER BY m.created_at DESC
      `;
      params = [req.userId];
    } else if (folder === 'sent') {
      query = `
        SELECT 
          m.*,
          COALESCE(mum.is_read, false) as is_read,
          COALESCE(mum.is_starred, false) as is_starred,
          COALESCE(mum.is_deleted, false) as is_deleted,
          recipient.user_type as recipient_type,
          COALESCE(pp_recipient.contact_name, pp_recipient.business_name) as recipient_contact_name,
          pp_recipient.business_name as recipient_business_name,
          cp_recipient.first_name as recipient_client_first_name,
          cp_recipient.last_name as recipient_client_last_name
        FROM messages m
        LEFT JOIN message_user_metadata mum ON m.id = mum.message_id AND mum.user_id = $1
        LEFT JOIN users recipient ON m.recipient_id = recipient.id
        LEFT JOIN provider_profiles pp_recipient ON recipient.id = pp_recipient.user_id
        LEFT JOIN client_profiles cp_recipient ON recipient.id = cp_recipient.user_id
        WHERE m.sender_id = $1 
        AND COALESCE(mum.is_deleted, false) = false
        ORDER BY m.created_at DESC
      `;
      params = [req.userId];
    } else if (folder === 'starred') {
      query = `
        SELECT 
          m.*,
          COALESCE(mum.is_read, false) as is_read,
          COALESCE(mum.is_starred, false) as is_starred,
          COALESCE(mum.is_deleted, false) as is_deleted,
          sender.user_type as sender_type,
          COALESCE(pp_sender.contact_name, pp_sender.business_name) as sender_contact_name,
          pp_sender.business_name as sender_business_name,
          cp_sender.first_name as sender_client_first_name,
          cp_sender.last_name as sender_client_last_name,
          recipient.user_type as recipient_type,
          COALESCE(pp_recipient.contact_name, pp_recipient.business_name) as recipient_contact_name,
          pp_recipient.business_name as recipient_business_name,
          cp_recipient.first_name as recipient_client_first_name,
          cp_recipient.last_name as recipient_client_last_name
        FROM messages m
        LEFT JOIN message_user_metadata mum ON m.id = mum.message_id AND mum.user_id = $1
        LEFT JOIN users sender ON m.sender_id = sender.id
        LEFT JOIN users recipient ON m.recipient_id = recipient.id
        LEFT JOIN provider_profiles pp_sender ON sender.id = pp_sender.user_id
        LEFT JOIN client_profiles cp_sender ON sender.id = cp_sender.user_id
        LEFT JOIN provider_profiles pp_recipient ON recipient.id = pp_recipient.user_id
        LEFT JOIN client_profiles cp_recipient ON recipient.id = cp_recipient.user_id
        WHERE (m.sender_id = $1 OR m.recipient_id = $1)
        AND COALESCE(mum.is_starred, false) = true
        AND COALESCE(mum.is_deleted, false) = false
        ORDER BY m.created_at DESC
      `;
      params = [req.userId];
    } else if (folder === 'trash') {
      query = `
        SELECT 
          m.*,
          COALESCE(mum.is_read, false) as is_read,
          COALESCE(mum.is_starred, false) as is_starred,
          COALESCE(mum.is_deleted, false) as is_deleted,
          sender.user_type as sender_type,
          COALESCE(pp_sender.contact_name, pp_sender.business_name) as sender_contact_name,
          pp_sender.business_name as sender_business_name,
          cp_sender.first_name as sender_client_first_name,
          cp_sender.last_name as sender_client_last_name,
          recipient.user_type as recipient_type,
          COALESCE(pp_recipient.contact_name, pp_recipient.business_name) as recipient_contact_name,
          pp_recipient.business_name as recipient_business_name,
          cp_recipient.first_name as recipient_client_first_name,
          cp_recipient.last_name as recipient_client_last_name
        FROM messages m
        LEFT JOIN message_user_metadata mum ON m.id = mum.message_id AND mum.user_id = $1
        LEFT JOIN users sender ON m.sender_id = sender.id
        LEFT JOIN users recipient ON m.recipient_id = recipient.id
        LEFT JOIN provider_profiles pp_sender ON sender.id = pp_sender.user_id
        LEFT JOIN client_profiles cp_sender ON sender.id = cp_sender.user_id
        LEFT JOIN provider_profiles pp_recipient ON recipient.id = pp_recipient.user_id
        LEFT JOIN client_profiles cp_recipient ON recipient.id = cp_recipient.user_id
        WHERE (m.sender_id = $1 OR m.recipient_id = $1)
        AND COALESCE(mum.is_deleted, false) = true
        ORDER BY m.created_at DESC
      `;
      params = [req.userId];
    }

    if (!query) {
      return res.status(400).json({ error: 'Invalid folder parameter' });
    }

    const result = await pool.query(query, params);

    // Format the response
    const messages = result.rows.map(row => {
      try {
        const isSent = row.sender_id === req.userId;
        
        let otherUserName = 'Unknown';
        if (isSent) {
          // For sent messages, get recipient name
          if (row.recipient_client_first_name && row.recipient_client_last_name) {
            otherUserName = `${row.recipient_client_first_name} ${row.recipient_client_last_name}`;
          } else if (row.recipient_contact_name) {
            otherUserName = row.recipient_contact_name;
          } else if (row.recipient_business_name) {
            otherUserName = row.recipient_business_name;
          }
        } else {
          // For inbox messages, get sender name
          if (row.sender_client_first_name && row.sender_client_last_name) {
            otherUserName = `${row.sender_client_first_name} ${row.sender_client_last_name}`;
          } else if (row.sender_contact_name) {
            otherUserName = row.sender_contact_name;
          } else if (row.sender_business_name) {
            otherUserName = row.sender_business_name;
          }
        }

        const message = {
          id: row.id,
          subject: row.subject || '',
          body: row.body || '',
          senderId: row.sender_id ? String(row.sender_id) : null,
          recipientId: row.recipient_id ? String(row.recipient_id) : null,
          senderName: isSent ? 'You' : otherUserName,
          recipientName: isSent ? otherUserName : 'You',
          timestamp: row.created_at,
          isRead: row.is_read !== undefined ? row.is_read : false,
          isStarred: row.is_starred !== undefined ? row.is_starred : false,
          isDeleted: row.is_deleted !== undefined ? row.is_deleted : false,
          folder: row.folder || (isSent ? 'sent' : 'inbox')
        };
        
        return message;
      } catch (mapError) {
        // Error mapping message row
        return null;
      }
    }).filter(msg => msg !== null);

    res.json(messages);
  } catch (err) {
    res.status(500).json({ 
      error: 'Server error',
      message: err.message,
      details: err.stack
    });
  }
});

// PATCH update message (mark as read, star/unstar, delete)
router.patch('/:messageId', verifyToken, async (req, res) => {
  try {
    const { messageId } = req.params;
    const { isRead, isStarred, isDeleted, folder } = req.body;

    // Verify user owns this message
    const messageCheck = await pool.query(
      'SELECT * FROM messages WHERE id = $1 AND (sender_id = $2 OR recipient_id = $2)',
      [messageId, req.userId]
    );

    if (messageCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Check if metadata record exists for this user and message
    const metadataCheck = await pool.query(
      'SELECT * FROM message_user_metadata WHERE message_id = $1 AND user_id = $2',
      [messageId, req.userId]
    );

    const updates = [];
    const values = [];
    let paramCount = 1;

    if (isRead !== undefined) {
      updates.push(`is_read = $${paramCount++}`);
      values.push(isRead);
    }

    if (isStarred !== undefined) {
      updates.push(`is_starred = $${paramCount++}`);
      values.push(isStarred);
    }

    if (isDeleted !== undefined) {
      updates.push(`is_deleted = $${paramCount++}`);
      values.push(isDeleted);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No updates provided' });
    }

    if (metadataCheck.rows.length === 0) {
      // Create metadata record if it doesn't exist
      const insertValues = [messageId, req.userId];
      const insertFields = ['message_id', 'user_id'];
      const insertPlaceholders = ['$1', '$2'];
      let insertParamCount = 3;

      if (isRead !== undefined) {
        insertFields.push('is_read');
        insertPlaceholders.push(`$${insertParamCount++}`);
        insertValues.push(isRead);
      } else {
        insertFields.push('is_read');
        insertPlaceholders.push('$' + insertParamCount++);
        insertValues.push(false);
      }

      if (isStarred !== undefined) {
        insertFields.push('is_starred');
        insertPlaceholders.push(`$${insertParamCount++}`);
        insertValues.push(isStarred);
      } else {
        insertFields.push('is_starred');
        insertPlaceholders.push('$' + insertParamCount++);
        insertValues.push(false);
      }

      if (isDeleted !== undefined) {
        insertFields.push('is_deleted');
        insertPlaceholders.push(`$${insertParamCount++}`);
        insertValues.push(isDeleted);
      } else {
        insertFields.push('is_deleted');
        insertPlaceholders.push('$' + insertParamCount++);
        insertValues.push(false);
      }

      await pool.query(
        `INSERT INTO message_user_metadata (${insertFields.join(', ')})
         VALUES (${insertPlaceholders.join(', ')})`,
        insertValues
      );
    } else {
      // Update existing metadata record
      values.push(messageId, req.userId);
      await pool.query(
        `UPDATE message_user_metadata 
         SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
         WHERE message_id = $${paramCount} 
         AND user_id = $${paramCount + 1}`,
        values
      );
    }

    res.json({ success: true, message: 'Message updated' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE permanently delete message
router.delete('/:messageId', verifyToken, async (req, res) => {
  try {
    const { messageId } = req.params;

    // Verify user owns this message
    const messageCheck = await pool.query(
      'SELECT * FROM messages WHERE id = $1 AND (sender_id = $2 OR recipient_id = $2)',
      [messageId, req.userId]
    );

    if (messageCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }

    await pool.query(
      'DELETE FROM messages WHERE id = $1',
      [messageId]
    );

    res.json({ success: true, message: 'Message permanently deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Cleanup function to permanently delete messages in trash older than 30 days
const cleanupOldTrashMessages = async () => {
  try {
    const result = await pool.query(
      `DELETE FROM message_user_metadata
       WHERE is_deleted = true
       AND updated_at < NOW() - INTERVAL '30 days'`
    );
    
    return result.rowCount;
  } catch (err) {
    // Error cleaning up old trash messages
    return 0;
  }
};

// Run cleanup on startup and then daily
cleanupOldTrashMessages();
setInterval(() => {
  cleanupOldTrashMessages();
}, 24 * 60 * 60 * 1000); // Run every 24 hours

module.exports = router;
