// src/routes/auth.js
const express = require('express');
const router = express.Router();
const {
  registerClient,
  registerProvider,
  registerSpaceOwner,
  login,
  updateClientProfile,
} = require('../controllers/auth');

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

/**
 * @route   POST /api/auth/register/space-owner
 * @desc    Register a new space owner
 * @access  Public
 */
router.post('/register/space-owner', registerSpaceOwner);

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

module.exports = router;

