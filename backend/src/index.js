const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const providerRoutes = require('./routes/providers');
const bookingRoutes = require('./routes/bookings');
const authRoutes = require('./routes/auth');
const favoriteRoutes = require('./routes/favorites');
const reviewRoutes = require('./routes/reviews');
const notificationRoutes = require('./routes/notifications');
const messageRoutes = require('./routes/messages');
// SPACES FEATURE - COMMENTED OUT FOR MVP
// const spaceOwnerRoutes = require('./routes/space_owners');
const adminTempRoutes = require('./routes/admin_temp');
const clientRoutes = require('./routes/clients');
const stripeRoutes = require('./routes/stripe');

dotenv.config();

const app = express();

// CORS configuration - allow frontend URL in production
const corsOptions = {
  origin: process.env.FRONTEND_URL || process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || '*',
  credentials: true
};
app.use(cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// OAuth routes (only load if packages are installed)
let oauthRoutes;
try {
  const passport = require('passport');
  
  // Initialize Passport WITHOUT sessions to avoid HTTP 431 errors
  // OAuth will be completely stateless
  app.use(passport.initialize());
  // Note: We're NOT using passport.session() to avoid cookie size issues
  
  oauthRoutes = require('./routes/oauth');
  app.use('/api/oauth', oauthRoutes);
  console.log('✅ OAuth routes enabled (stateless mode)');
} catch (error) {
  console.log('⚠️  OAuth packages not installed. Google/Facebook login will not work until packages are installed.');
  console.log('   Run: cd backend && npm install passport passport-google-oauth20');
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/providers', providerRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/messages', messageRoutes);
// SPACES FEATURE - COMMENTED OUT FOR MVP
// app.use('/api/space-owners', spaceOwnerRoutes);
app.use('/api/admin-temp', adminTempRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/stripe', stripeRoutes);

app.get('/', (req, res) => {
  res.send('Omvira backend is running!');
});

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
