const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const { handleGoogleCallback, handleFacebookCallback } = require('../controllers/oauth');
const pool = require('../db');

const router = express.Router();

// Configure Google OAuth Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  console.log('✅ Google OAuth configured');
  console.log('Callback URL:', `${process.env.BACKEND_URL || 'http://localhost:4000'}/api/oauth/google/callback`);
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.BACKEND_URL || 'http://localhost:4000'}/api/oauth/google/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Only pass minimal profile data to avoid HTTP 431 errors
          const minimalProfile = {
            id: profile.id,
            displayName: profile.displayName,
            emails: profile.emails ? [{ value: profile.emails[0]?.value }] : [],
            photos: profile.photos ? [{ value: profile.photos[0]?.value }] : []
          };
          return done(null, minimalProfile);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
}

// Configure Facebook OAuth Strategy
if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: `${process.env.BACKEND_URL || 'http://localhost:4000'}/api/oauth/facebook/callback`,
        profileFields: ['id', 'displayName', 'emails', 'photos'],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Only pass minimal profile data to avoid HTTP 431 errors
          const minimalProfile = {
            id: profile.id,
            displayName: profile.displayName,
            emails: profile.emails ? [{ value: profile.emails[0]?.value }] : [],
            photos: profile.photos ? [{ value: profile.photos[0]?.value }] : []
          };
          return done(null, minimalProfile);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
}

// No serialization needed - we're using stateless OAuth
// Profile data is passed directly through the callback

/**
 * @route   GET /api/oauth/google
 * @desc    Initiate Google OAuth login
 * @access  Public
 * @query   state - user_type (client or provider)
 */
router.get(
  '/google',
  (req, res, next) => {
    // Store user_type in session/state for callback
    const state = req.query.user_type || 'client';
    console.log('Initiating Google OAuth with user_type:', state);
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      console.error('❌ Google OAuth credentials not configured!');
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/providers/signup?error=oauth_not_configured`);
    }
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      state: state, // Pass user_type through state parameter
    })(req, res, next);
  }
);

/**
 * @route   GET /api/oauth/google/callback
 * @desc    Handle Google OAuth callback
 * @access  Public
 */
router.get(
  '/google/callback',
  (req, res, next) => {
    console.log('Google OAuth callback route hit');
    console.log('Query params:', req.query);
    // Use stateless authentication to avoid session size issues
    passport.authenticate('google', { session: false }, (err, user, info) => {
      if (err) {
        console.error('Passport authentication error:', err);
        console.error('Error details:', err.message, err.stack);
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/providers/signup?error=oauth_error&details=${encodeURIComponent(err.message)}`);
      }
      if (!user) {
        console.error('No user returned from Passport');
        console.log('Info object:', info);
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/providers/signup?error=no_user`);
      }
      console.log('Passport authentication successful, user:', user.id);
      // Attach user to request and continue
      req.user = user;
      next();
    })(req, res, next);
  },
  handleGoogleCallback
);

/**
 * @route   GET /api/oauth/facebook
 * @desc    Initiate Facebook OAuth login
 * @access  Public
 * @query   state - user_type (client or provider)
 */
router.get(
  '/facebook',
  (req, res, next) => {
    // Store user_type in session/state for callback
    const state = req.query.user_type || 'client';
    passport.authenticate('facebook', {
      scope: ['email'],
      state: state, // Pass user_type through state parameter
    })(req, res, next);
  }
);

/**
 * @route   GET /api/oauth/facebook/callback
 * @desc    Handle Facebook OAuth callback
 * @access  Public
 */
router.get(
  '/facebook/callback',
  (req, res, next) => {
    // Use stateless authentication to avoid session size issues
    passport.authenticate('facebook', { session: false }, (err, user, info) => {
      if (err) {
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=oauth_error`);
      }
      if (!user) {
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=no_user`);
      }
      // Attach user to request and continue
      req.user = user;
      next();
    })(req, res, next);
  },
  handleFacebookCallback
);

module.exports = router;
