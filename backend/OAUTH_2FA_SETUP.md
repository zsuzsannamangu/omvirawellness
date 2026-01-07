# OAuth & 2FA Setup Guide

This guide covers setting up Google OAuth, Facebook OAuth, and TOTP 2FA (Google Authenticator).

## Important Note About Google Authenticator

**Google Authenticator doesn't require a Google API!** It's a mobile app that uses TOTP (Time-based One-Time Password) standard. We're already using the `speakeasy` library for this, which doesn't need any Google APIs.

## Part 1: Google OAuth Setup

### Step 1: Create OAuth 2.0 Credentials in Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to **"APIs & Services"** → **"Credentials"**
4. Click **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**

### Step 2: Configure OAuth Consent Screen (First Time Only)

If you haven't set this up:
1. Click **"OAuth consent screen"** in the left sidebar
2. Choose **"External"** (unless you have a Google Workspace)
3. Fill in required fields:
   - **App name**: Omvira Wellness
   - **User support email**: Your email
   - **Developer contact information**: Your email
4. Click **"Save and Continue"**
5. **Scopes**: Add `email` and `profile` (usually already there)
6. **Test users**: Add your email for testing (optional)
7. Click **"Save and Continue"** through the rest

### Step 3: Create OAuth Client ID

1. Go back to **"Credentials"** → **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
2. **Application type**: Select **"Web application"**
3. **Name**: "Omvira Backend OAuth"
4. **Authorized JavaScript origins**:
   - `http://localhost:4000` (for development)
   - `https://yourdomain.com` (for production)
5. **Authorized redirect URIs**:
   - `http://localhost:4000/api/oauth/google/callback` (for development)
   - `https://yourdomain.com/api/oauth/google/callback` (for production)
6. Click **"Create"**
7. **Copy the Client ID and Client Secret** (you'll need these)

### Step 4: Add to Backend .env

Add these to your `backend/.env` file:

```env
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
BACKEND_URL=http://localhost:4000
```

For production, update `BACKEND_URL` to your production domain.

## Part 2: Facebook OAuth Setup

### Step 1: Create Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click **"My Apps"** → **"Create App"**
3. Choose **"Consumer"** or **"Business"** as app type
4. Fill in:
   - **App name**: Omvira Wellness
   - **App contact email**: Your email
5. Click **"Create App"**

### Step 2: Add Facebook Login Product

1. In your app dashboard, find **"Add a Product"**
2. Click **"Set Up"** on **"Facebook Login"**
3. Choose **"Web"** platform

### Step 3: Configure Facebook Login Settings

1. Go to **"Settings"** → **"Basic"**
2. Note your **App ID** and **App Secret** (click "Show" to reveal secret)
3. Add **"Valid OAuth Redirect URIs"**:
   - `http://localhost:4000/api/oauth/facebook/callback`
   - `https://yourdomain.com/api/oauth/facebook/callback`
4. Click **"Save Changes"**

### Step 4: Add to Backend .env

Add these to your `backend/.env` file:

```env
FACEBOOK_APP_ID=your_facebook_app_id_here
FACEBOOK_APP_SECRET=your_facebook_app_secret_here
```

## Part 3: TOTP 2FA (Google Authenticator) - Already Configured!

**Good news**: TOTP 2FA is already implemented and doesn't require any API setup!

### How It Works

- Uses the `speakeasy` library (already installed)
- Generates QR codes for users to scan with Google Authenticator app
- No Google API needed - it's a standard TOTP implementation

### What Users Need

- Install **Google Authenticator** app (or any TOTP app like Authy, Microsoft Authenticator)
- Scan QR code from your app
- Enter 6-digit codes when logging in

### Environment Variables (Optional)

If you want to customize 2FA settings, you can add to `.env`:

```env
# 2FA settings (optional - defaults work fine)
TOTP_ISSUER=Omvira Wellness
TOTP_ALGORITHM=sha1
TOTP_DIGITS=6
TOTP_STEP=30
```

## Part 4: Verify Setup

### Test Google OAuth

1. Start your backend: `cd backend && npm run dev`
2. Visit: `http://localhost:4000/api/oauth/google?user_type=client`
3. You should be redirected to Google login
4. After login, you should be redirected back

### Test Facebook OAuth

1. Visit: `http://localhost:4000/api/oauth/facebook?user_type=client`
2. You should be redirected to Facebook login
3. After login, you should be redirected back

### Test 2FA

1. Log in to your app
2. Go to Settings → Security
3. Click "Enable Google Authenticator"
4. Scan QR code with Google Authenticator app
5. Enter verification code
6. 2FA should be enabled!

## Troubleshooting

### Google OAuth Issues

**Error: "redirect_uri_mismatch"**
- Check that your redirect URI in Google Console exactly matches your backend URL
- Make sure `BACKEND_URL` in `.env` matches

**Error: "invalid_client"**
- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct
- Make sure there are no extra spaces in `.env` file

### Facebook OAuth Issues

**Error: "Invalid OAuth access token"**
- Verify `FACEBOOK_APP_ID` and `FACEBOOK_APP_SECRET` are correct
- Make sure redirect URIs are added in Facebook App settings

**App in Development Mode**
- Facebook apps start in development mode
- Only you (and added test users) can log in
- Submit for review to make it public (optional for now)

### 2FA Issues

**QR code not showing**
- Make sure `qrcode` package is installed: `npm install qrcode`
- Check browser console for errors

**Codes not working**
- Make sure device time is synchronized
- Try regenerating the QR code

## Security Best Practices

1. **Never commit `.env` files** to git
2. **Use different OAuth credentials** for development and production
3. **Restrict OAuth redirect URIs** to your actual domains
4. **Enable 2FA** for your own Google/Facebook developer accounts
5. **Rotate secrets** periodically

## Summary of Environment Variables

Add all of these to `backend/.env`:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
BACKEND_URL=http://localhost:4000

# Facebook OAuth
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret

# Session (for OAuth)
SESSION_SECRET=your_random_secret_key_here

# 2FA (optional - defaults work)
TOTP_ISSUER=Omvira Wellness
```

## Next Steps

1. Set up Google OAuth credentials
2. Set up Facebook OAuth credentials
3. Add environment variables to `.env`
4. Restart backend server
5. Test OAuth flows
6. Test 2FA setup

All the code is already implemented - you just need to configure the credentials!
