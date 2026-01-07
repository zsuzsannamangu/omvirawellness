// src/routes/auth.js
const express = require('express');
const router = express.Router();
const {
  registerClient,
  registerProvider,
  // SPACES FEATURE - COMMENTED OUT FOR MVP
  // registerSpaceOwner,
  login,
  updateClientProfile,
  updateProviderProfile,
  verifyToken,
  changePassword,
  updateEmail,
  enable2FA,
  verifyAndActivate2FA,
  disable2FA,
  verify2FALogin,
  regenerateBackupCodes,
} = require('../controllers/auth');
const { authenticate } = require('../middleware/auth');

/**
 * @route   POST /api/auth/register/client
 * @desc    Register a new client
 * @access  Public
 */
router.post('/register/client', registerClient);

/**
 * @route   POST /api/auth/register/provider
 * @desc    Register a new provider
 * @access  Public
 */
router.post('/register/provider', registerProvider);

// SPACES FEATURE - COMMENTED OUT FOR MVP
/**
 * @route   POST /api/auth/register/space-owner
 * @desc    Register a new space owner
 * @access  Public
 */
// router.post('/register/space-owner', registerSpaceOwner);

/**
 * @route   POST /api/auth/login
 * @desc    Login for all user types
 * @access  Public
 */
router.post('/login', login);

/**
 * @route   PUT /api/auth/profile/client
 * @desc    Update client profile
 * @access  Protected
 */
router.put('/profile/client', updateClientProfile);

/**
 * @route   PUT /api/auth/profile/provider
 * @desc    Update provider profile
 * @access  Protected
 */
router.put('/profile/provider', updateProviderProfile);

/**
 * @route   GET /api/auth/verify
 * @desc    Verify JWT token
 * @access  Protected
 */
router.get('/verify', authenticate, verifyToken);

/**
 * @route   PUT /api/auth/change-password
 * @desc    Change user password
 * @access  Protected
 */
router.put('/change-password', authenticate, changePassword);

/**
 * @route   PUT /api/auth/update-email
 * @desc    Update user email
 * @access  Protected
 */
router.put('/update-email', authenticate, updateEmail);

/**
 * @route   POST /api/auth/2fa/enable
 * @desc    Enable 2FA - Generate secret and QR code
 * @access  Protected
 */
router.post('/2fa/enable', authenticate, enable2FA);

/**
 * @route   POST /api/auth/2fa/verify
 * @desc    Verify and activate 2FA
 * @access  Protected
 */
router.post('/2fa/verify', authenticate, verifyAndActivate2FA);

/**
 * @route   POST /api/auth/2fa/disable
 * @desc    Disable 2FA
 * @access  Protected
 */
router.post('/2fa/disable', authenticate, disable2FA);

/**
 * @route   POST /api/auth/2fa/verify-login
 * @desc    Verify 2FA token during login
 * @access  Public (but requires userId from login flow)
 */
router.post('/2fa/verify-login', verify2FALogin);

/**
 * @route   POST /api/auth/2fa/regenerate-backup-codes
 * @desc    Regenerate backup codes
 * @access  Protected
 */
router.post('/2fa/regenerate-backup-codes', authenticate, regenerateBackupCodes);

module.exports = router;

