// src/middleware/auth.js
const { verifyToken } = require('../utils/jwt');

/**
 * Middleware to authenticate requests using JWT
 * Adds req.user with user information if token is valid
 */
function authenticate(req, res, next) {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ 
        success: false, 
        message: 'No authorization header provided' 
      });
    }

    // Extract token from "Bearer <token>"
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid authorization header format. Use: Bearer <token>' 
      });
    }

    const token = parts[1];

    // Verify token
    const decoded = verifyToken(token);
    
    // Attach user info to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      user_type: decoded.user_type,
    };

    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid or expired token',
      error: error.message 
    });
  }
}

/**
 * Middleware to check if user has specific role(s)
 * @param {String|Array} allowedRoles - Role or array of roles allowed
 */
function authorize(allowedRoles) {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    if (!roles.includes(req.user.user_type)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Insufficient permissions' 
      });
    }

    next();
  };
}

module.exports = {
  authenticate,
  authorize,
};

