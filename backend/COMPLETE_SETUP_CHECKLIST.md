# Complete Setup Checklist

This checklist covers all Google Maps, OAuth, and 2FA setup steps.

## ✅ Google Maps APIs Setup

### APIs Enabled (Verify in Google Cloud Console)
- [ ] Address Validation API
- [ ] Geocoding API
- [ ] Distance Matrix API
- [ ] Places API
- [ ] Maps JavaScript API

### API Keys Created
- [ ] Backend API Key created
  - [ ] Restricted to: Address Validation API, Geocoding API, Distance Matrix API
  - [ ] Application restriction: IP addresses (or None if IP changes)
  - [ ] Key added to `backend/.env` as `GOOGLE_MAPS_API_KEY`

- [ ] Frontend API Key created
  - [ ] Restricted to: Places API, Maps JavaScript API
  - [ ] Application restriction: HTTP referrers (your domains)
  - [ ] Key added to `frontend/.env.local` as `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

## ✅ Google OAuth Setup

### OAuth Consent Screen
- [ ] OAuth consent screen configured
  - [ ] App name: Omvira Wellness
  - [ ] User support email set
  - [ ] Scopes: email, profile added

### OAuth Client ID Created
- [ ] OAuth 2.0 Client ID created (Web application)
- [ ] Authorized JavaScript origins added:
  - [ ] `http://localhost:4000` (development)
  - [ ] `https://yourdomain.com` (production)
- [ ] Authorized redirect URIs added:
  - [ ] `http://localhost:4000/api/oauth/google/callback` (development)
  - [ ] `https://yourdomain.com/api/oauth/google/callback` (production)

### Environment Variables
- [ ] `GOOGLE_CLIENT_ID` added to `backend/.env`
- [ ] `GOOGLE_CLIENT_SECRET` added to `backend/.env`
- [ ] `BACKEND_URL` set in `backend/.env`

## ✅ Facebook OAuth Setup

### Facebook App Created
- [ ] Facebook App created in Facebook Developers
- [ ] App name: Omvira Wellness
- [ ] App contact email set

### Facebook Login Product
- [ ] Facebook Login product added
- [ ] Platform: Web selected
- [ ] Valid OAuth Redirect URIs added:
  - [ ] `http://localhost:4000/api/oauth/facebook/callback` (development)
  - [ ] `https://yourdomain.com/api/oauth/facebook/callback` (production)

### Environment Variables
- [ ] `FACEBOOK_APP_ID` added to `backend/.env`
- [ ] `FACEBOOK_APP_SECRET` added to `backend/.env`

## ✅ TOTP 2FA (Google Authenticator)

### Already Implemented
- [x] Code already implemented (no setup needed)
- [x] Uses `speakeasy` library (already installed)
- [x] QR code generation working

### Optional Configuration
- [ ] `TOTP_ISSUER` set in `backend/.env` (optional, defaults to "Omvira Wellness")
- [ ] Test 2FA setup in your app

## ✅ Session Configuration

### Environment Variables
- [ ] `SESSION_SECRET` set in `backend/.env` (random secure string)

## 📝 Complete .env File Template

Your `backend/.env` should include:

```env
# Database
DATABASE_URL=your_postgresql_connection_string
PORT=4000

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# Google Maps (Backend)
GOOGLE_MAPS_API_KEY=your_backend_google_maps_api_key

# Google OAuth
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
BACKEND_URL=http://localhost:4000

# Facebook OAuth
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret

# Session (for OAuth)
SESSION_SECRET=your_random_secure_session_secret_here

# Email (optional)
SENDGRID_API_KEY=your_sendgrid_api_key

# 2FA (optional - defaults work)
TOTP_ISSUER=Omvira Wellness
```

Your `frontend/.env.local` should include:

```env
# API URL
NEXT_PUBLIC_API_URL=http://localhost:4000

# Google Maps (Frontend)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_frontend_google_maps_api_key
```

## 🧪 Testing Checklist

### Test Google Maps Features
- [ ] Address autocomplete works on booking page
- [ ] Distance calculation matches Google Maps
- [ ] Address validation rejects invalid addresses

### Test OAuth
- [ ] Google OAuth login works
  - [ ] Visit: `http://localhost:4000/api/oauth/google?user_type=client`
  - [ ] Redirects to Google login
  - [ ] After login, redirects back and creates/logs in user

- [ ] Facebook OAuth login works
  - [ ] Visit: `http://localhost:4000/api/oauth/facebook?user_type=client`
  - [ ] Redirects to Facebook login
  - [ ] After login, redirects back and creates/logs in user

### Test 2FA
- [ ] Can enable 2FA in user settings
- [ ] QR code displays correctly
- [ ] Can scan QR code with Google Authenticator app
- [ ] 6-digit codes work for login
- [ ] Backup codes work

## 🔒 Security Checklist

- [ ] `.env` files are in `.gitignore` (never commit secrets)
- [ ] API keys are restricted to specific APIs
- [ ] OAuth redirect URIs are restricted to your domains
- [ ] Backend API key restricted to server IPs (if possible)
- [ ] Frontend API key restricted to your website domains
- [ ] `SESSION_SECRET` is a strong random string
- [ ] `JWT_SECRET` is a strong random string

## 🚀 Deployment Checklist

### Before Going to Production

- [ ] Update `BACKEND_URL` to production domain
- [ ] Add production redirect URIs to Google OAuth
- [ ] Add production redirect URIs to Facebook OAuth
- [ ] Update frontend `NEXT_PUBLIC_API_URL` to production
- [ ] Add production domains to frontend API key restrictions
- [ ] Test all OAuth flows in production
- [ ] Test Google Maps features in production
- [ ] Set up billing alerts in Google Cloud Console
- [ ] Monitor API usage in Google Cloud Console

## 📚 Documentation References

- Google Maps Setup: `GOOGLE_MAPS_SETUP.md`
- OAuth & 2FA Setup: `OAUTH_2FA_SETUP.md`
- How to Check Enabled APIs: `HOW_TO_CHECK_ENABLED_APIS.md`
- Main Setup Guide: `SETUP_GUIDE.md`

## 🆘 Common Issues

### "redirect_uri_mismatch" (Google OAuth)
- Check redirect URI in Google Console matches exactly
- Verify `BACKEND_URL` in `.env` is correct

### "Invalid OAuth access token" (Facebook)
- Verify App ID and Secret are correct
- Check redirect URIs are added in Facebook App settings

### Address autocomplete not working
- Check `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is set
- Verify Places API and Maps JavaScript API are enabled
- Check browser console for errors

### Distance calculation not matching Google Maps
- Verify Distance Matrix API is enabled
- Check `GOOGLE_MAPS_API_KEY` is set in backend
- Make sure you're comparing driving distance, not straight-line

## ✅ Final Steps

1. [ ] Complete all checkboxes above
2. [ ] Restart backend server: `cd backend && npm run dev`
3. [ ] Restart frontend server: `cd frontend && npm run dev`
4. [ ] Test all features
5. [ ] Document any custom configurations

---

**You're all set!** Once all checkboxes are complete, your app will have:
- ✅ Accurate address validation and distance calculation
- ✅ Address autocomplete on booking page
- ✅ Google and Facebook OAuth login
- ✅ TOTP 2FA with Google Authenticator

