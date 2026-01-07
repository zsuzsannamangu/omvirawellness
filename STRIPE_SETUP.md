# Stripe Integration Setup Guide

## Overview
This application now uses Stripe for secure payment processing. Credit card numbers are **never stored** on your servers - only Stripe tokens are stored.

## Installation

### Backend
```bash
cd backend
npm install stripe
```

### Frontend
```bash
cd frontend
npm install @stripe/stripe-js @stripe/react-stripe-js
```

## Environment Variables

### Backend `.env`
Add these variables:
```env
STRIPE_SECRET_KEY=sk_test_...  # Your Stripe secret key (test or live)
JWT_SECRET=your_jwt_secret_here
DATABASE_URL=your_database_url
```

### Frontend `.env.local`
Create this file:
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...  # Your Stripe publishable key (test or live)
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## Getting Stripe Keys

1. Sign up at https://stripe.com
2. Go to Developers > API keys
3. Copy:
   - **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - **Secret key** → `STRIPE_SECRET_KEY`

**Important**: 
- Use **test keys** for development (start with `pk_test_` and `sk_test_`)
- Use **live keys** for production (start with `pk_live_` and `sk_live_`)

## Database Migration

The Stripe integration requires a new column in `provider_profiles`:

```sql
ALTER TABLE provider_profiles 
ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255);
```

This is automatically handled by the code, but you can run it manually if needed.

## How It Works

1. **User enters card details** → Stripe Elements (secure iframe) collects card data
2. **Card data goes directly to Stripe** → Your server never sees the card number
3. **Stripe returns a Payment Method token** → e.g., `pm_1ABC123...`
4. **You store only the token** → Safe to store in your database
5. **For future charges** → Use the token to charge the customer

## Security Benefits

✅ **PCI Compliance**: Stripe handles all PCI requirements
✅ **No Card Storage**: Card numbers never touch your servers
✅ **Secure by Default**: Stripe Elements uses secure iframes
✅ **Automatic Updates**: Stripe handles card updates/expirations
✅ **Token-based**: Only safe tokens stored in database

## Testing

Use Stripe test cards:
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`

Use any future expiry date and any 3-digit CVC.

## API Endpoints

### POST `/api/stripe/customer`
Creates or retrieves a Stripe customer for the provider.

### POST `/api/stripe/setup-intent`
Creates a setup intent for adding a payment method.

### POST `/api/stripe/payment-method`
Attaches a payment method to a customer.

### GET `/api/stripe/payment-methods`
Lists all payment methods for a customer.

### DELETE `/api/stripe/payment-method/:paymentMethodId`
Removes a payment method.

## What Gets Stored

**In Your Database:**
- `stripe_customer_id` (e.g., `cus_ABC123`)
- `stripePaymentMethodId` (e.g., `pm_XYZ789`)
- Last 4 digits (for display)
- Card brand (Visa, Mastercard, etc.)
- Expiration date (for display)
- Billing address

**In Stripe:**
- Full card number
- CVV
- All sensitive payment data

## Next Steps

1. Install packages: `npm install` in both backend and frontend
2. Add environment variables
3. Test with Stripe test cards
4. Switch to live keys when ready for production

