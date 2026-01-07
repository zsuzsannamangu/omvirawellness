# Quick Start Guide

Get your Omvira Wellness backend up and running quickly!

## 🚀 5-Minute Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Set Up Database
- Create a PostgreSQL database (Supabase recommended)
- Run migrations: `node migrations/run-migration.js`

### 3. Create `.env` File
Copy the template below and fill in your values:

```env
# Database
DATABASE_URL=your_postgresql_connection_string
PORT=4000

# JWT
JWT_SECRET=your_random_secret_key_here
JWT_EXPIRES_IN=7d

# Session (for OAuth)
SESSION_SECRET=your_random_secret_key_here
BACKEND_URL=http://localhost:4000
```

### 4. Start Server
```bash
npm run dev
```

**That's it!** Your basic backend is running.

## 🎯 Optional Features (Set Up Later)

### Google Maps (Address Validation & Distance)
- See: `GOOGLE_MAPS_SETUP.md`
- Adds: Address autocomplete, distance calculation, address validation

### OAuth Login (Google & Facebook)
- See: `OAUTH_2FA_SETUP.md`
- Adds: "Sign in with Google" and "Sign in with Facebook"

### TOTP 2FA (Google Authenticator)
- Already implemented! No setup needed.
- Users can enable 2FA in their settings

## 📋 Full Setup Checklist

For complete setup with all features, see: `COMPLETE_SETUP_CHECKLIST.md`

## 🆘 Need Help?

- **Database issues**: Check `SETUP_GUIDE.md`
- **Google Maps not working**: Check `GOOGLE_MAPS_SETUP.md`
- **OAuth not working**: Check `OAUTH_2FA_SETUP.md`
- **API issues**: Check `HOW_TO_CHECK_ENABLED_APIS.md`

## ✅ Verify Setup

Test your backend is working:
```bash
curl http://localhost:4000/api/health
```

Or visit in browser: `http://localhost:4000/api/providers`

---

**Ready to go!** Start with basic setup, then add features as needed.

