const { Router } = require('express');
const pool = require('../db');

// Initialize Stripe only if secret key is provided
let stripe = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
} else {
  console.warn('⚠️  Stripe secret key not found. Stripe features will be disabled.');
}

const router = Router();
const jwt = require('jsonwebtoken');

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

// POST create or get Stripe customer
router.post('/customer', verifyToken, async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ error: 'Stripe is not configured. Please add STRIPE_SECRET_KEY to environment variables.' });
  }
  
  try {
    const { id: userId } = req;
    const { email, name } = req.body;

    // Check if provider profile exists
    const profileCheck = await pool.query(
      'SELECT id, stripe_customer_id FROM provider_profiles WHERE user_id = $1',
      [userId]
    );

    if (profileCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Provider profile not found' });
    }

    const providerProfile = profileCheck.rows[0];
    let customerId = providerProfile.stripe_customer_id;

    // If customer doesn't exist in Stripe, create one
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: email,
        name: name,
        metadata: {
          user_id: userId,
          user_type: 'provider'
        }
      });

      customerId = customer.id;

      // Store Stripe customer ID in database
      await pool.query(
        'UPDATE provider_profiles SET stripe_customer_id = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2',
        [customerId, userId]
      );
    } else {
      // Verify customer exists in Stripe
      try {
        await stripe.customers.retrieve(customerId);
      } catch (error) {
        // Customer doesn't exist in Stripe, create a new one
        const customer = await stripe.customers.create({
          email: email,
          name: name,
          metadata: {
            user_id: userId,
            user_type: 'provider'
          }
        });

        customerId = customer.id;

        await pool.query(
          'UPDATE provider_profiles SET stripe_customer_id = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2',
          [customerId, userId]
        );
      }
    }

    res.json({ customerId });
  } catch (err) {
    console.error('Error creating Stripe customer:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// POST create setup intent for adding payment method
router.post('/setup-intent', verifyToken, async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ error: 'Stripe is not configured. Please add STRIPE_SECRET_KEY to environment variables.' });
  }
  
  try {
    const { id: userId } = req;

    // Get Stripe customer ID
    const profileCheck = await pool.query(
      'SELECT stripe_customer_id FROM provider_profiles WHERE user_id = $1',
      [userId]
    );

    if (profileCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Provider profile not found' });
    }

    const customerId = profileCheck.rows[0].stripe_customer_id;

    if (!customerId) {
      return res.status(400).json({ error: 'Stripe customer not found. Please create customer first.' });
    }

    // Create setup intent
    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ['card'],
    });

    res.json({
      clientSecret: setupIntent.client_secret
    });
  } catch (err) {
    console.error('Error creating setup intent:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// POST attach payment method to customer
router.post('/payment-method', verifyToken, async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ error: 'Stripe is not configured. Please add STRIPE_SECRET_KEY to environment variables.' });
  }
  
  try {
    const { id: userId } = req;
    const { paymentMethodId, billingAddress, nameOnCard } = req.body;

    if (!paymentMethodId) {
      return res.status(400).json({ error: 'Payment method ID is required' });
    }

    // Get Stripe customer ID
    const profileCheck = await pool.query(
      'SELECT id, stripe_customer_id FROM provider_profiles WHERE user_id = $1',
      [userId]
    );

    if (profileCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Provider profile not found' });
    }

    const customerId = profileCheck.rows[0].stripe_customer_id;
    const providerProfileId = profileCheck.rows[0].id;

    if (!customerId) {
      return res.status(400).json({ error: 'Stripe customer not found. Please create customer first.' });
    }

    // Attach payment method to customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });

    // Set as default payment method
    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    // Get payment method details from Stripe
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);

    // Store payment method info in database
    const paymentMethodData = {
      stripePaymentMethodId: paymentMethodId,
      stripeCustomerId: customerId,
      cardType: paymentMethod.card?.brand || 'Unknown',
      last4: paymentMethod.card?.last4 || '',
      expiryMonth: String(paymentMethod.card?.exp_month || '').padStart(2, '0'),
      expiryYear: String(paymentMethod.card?.exp_year || '').slice(-2),
      nameOnCard: nameOnCard || null,
      billingAddress: billingAddress || null,
      updatedAt: new Date().toISOString()
    };

    // Ensure payment_method column exists
    try {
      await pool.query(`
        ALTER TABLE provider_profiles 
        ADD COLUMN IF NOT EXISTS payment_method JSONB,
        ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255)
      `);
    } catch (alterErr) {
      // Columns might already exist, that's fine
      if (!alterErr.message || !alterErr.message.includes('already exists')) {
        console.error('Error ensuring columns exist:', alterErr);
      }
    }

    await pool.query(
      'UPDATE provider_profiles SET payment_method = $1::JSONB, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [JSON.stringify(paymentMethodData), providerProfileId]
    );

    res.json({
      success: true,
      paymentMethod: paymentMethodData
    });
  } catch (err) {
    console.error('Error attaching payment method:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// GET payment methods for customer
router.get('/payment-methods', verifyToken, async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ error: 'Stripe is not configured. Please add STRIPE_SECRET_KEY to environment variables.' });
  }
  
  try {
    const { id: userId } = req;

    // Get Stripe customer ID
    const profileCheck = await pool.query(
      'SELECT stripe_customer_id, payment_method FROM provider_profiles WHERE user_id = $1',
      [userId]
    );

    if (profileCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Provider profile not found' });
    }

    const customerId = profileCheck.rows[0].stripe_customer_id;
    const storedPaymentMethod = profileCheck.rows[0].payment_method;

    if (!customerId) {
      return res.json({ paymentMethods: [], storedPaymentMethod: null });
    }

    // List payment methods from Stripe
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    });

    res.json({
      paymentMethods: paymentMethods.data,
      storedPaymentMethod: storedPaymentMethod
    });
  } catch (err) {
    console.error('Error fetching payment methods:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// DELETE detach payment method
router.delete('/payment-method/:paymentMethodId', verifyToken, async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ error: 'Stripe is not configured. Please add STRIPE_SECRET_KEY to environment variables.' });
  }
  
  try {
    const { id: userId } = req;
    const { paymentMethodId } = req.params;

    // Verify payment method belongs to user's customer
    const profileCheck = await pool.query(
      'SELECT stripe_customer_id FROM provider_profiles WHERE user_id = $1',
      [userId]
    );

    if (profileCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Provider profile not found' });
    }

    const customerId = profileCheck.rows[0].stripe_customer_id;

    // Get payment method to verify it belongs to customer
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
    
    if (paymentMethod.customer !== customerId) {
      return res.status(403).json({ error: 'Payment method does not belong to this customer' });
    }

    // Detach payment method
    await stripe.paymentMethods.detach(paymentMethodId);

    // Clear payment method from database
    await pool.query(
      'UPDATE provider_profiles SET payment_method = NULL, updated_at = CURRENT_TIMESTAMP WHERE user_id = $1',
      [userId]
    );

    res.json({ success: true });
  } catch (err) {
    console.error('Error detaching payment method:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

module.exports = router;

