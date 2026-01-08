# 🚀 Deploy Backend to Render - Step by Step

## Prerequisites
- ✅ GitHub repository with your code
- ✅ Render account (free) - Sign up at [render.com](https://render.com)
- ✅ PostgreSQL database (can create on Render)

---

## Step 1: Create PostgreSQL Database on Render

1. **Go to Render Dashboard**
   - Visit [render.com](https://render.com) and sign in
   - Click **"New +"** → **"PostgreSQL"**

2. **Configure Database**
   - **Name**: `omvira-db` (or any name you prefer)
   - **Database**: `omvira_wellness` (will be auto-created)
   - **User**: (auto-generated)
   - **Region**: Choose closest to you
   - **PostgreSQL Version**: 16 (latest)
   - **Plan**: 
     - **Free** tier (1GB, 90-day limit) - good for testing
     - **Starter + 5GB storage** ($6 base + $1.50 storage = $7.50/month) - good for production
     - **Starter + 10GB** ($7/month) - also good option

3. **Create Database**
   - Click **"Create Database"**
   - Wait for it to provision (1-2 minutes)

4. **Get Connection String**
   - Once created, scroll down to **"Connections"** section
   - Look for connection details. You might see:
     - **Internal Database URL** (if shown, copy this - it starts with `postgres://`)
     - OR individual fields:
       - **Hostname**: Internal hostname (e.g., `dpg-xxxxx-a.oregon-postgres.render.com`)
       - **Port**: Usually `5432`
       - **Database**: Your database name (e.g., `omvira_wellness`)
       - **User**: Database username
       - **Password**: Database password (click "Show" if hidden)
   
   - **If you only see hostname and other fields**, construct the connection string:
     ```
     postgres://USERNAME:PASSWORD@HOSTNAME:PORT/DATABASE
     ```
     Example:
     ```
     postgres://omvira_user:your_password@dpg-xxxxx-a.oregon-postgres.render.com:5432/omvira_wellness
     ```
   
   - **Important**: Use the **Internal** hostname (not External) for services on Render
   - **Save this connection string** - you'll use it as `DATABASE_URL` environment variable!

---

## Step 2: Create Web Service (Backend)

1. **Create New Web Service**
   - Click **"New +"** → **"Web Service"**

2. **Connect Repository**
   - Click **"Connect account"** to link GitHub
   - Select your `omvirawellness` repository
   - Click **"Connect"**

3. **Configure Service**
   ```
   Name: omvira-backend
   Region: Same as your database
   Branch: main
   Root Directory: backend
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   ```

4. **Select Plan**
   - Choose **"Free"** plan
   - Click **"Advanced"** to add environment variables

---

## Step 3: Add Environment Variables

Click **"Add Environment Variable"** and add each of these:

### Required Variables (Must Have)

```bash
# Database
DATABASE_URL=<paste-your-internal-database-url-from-step-1>

# Server
PORT=4000
NODE_ENV=production

# JWT (Authentication)
JWT_SECRET=<generate-a-random-secret-key>
JWT_EXPIRES_IN=7d

# Frontend URL (for CORS)
FRONTEND_URL=https://omvirawellness.vercel.app
```

### Optional Variables (Only if you have them set up)

```bash
# Google OAuth (only if you have Google OAuth configured)
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
GOOGLE_CALLBACK_URL=https://omvira-backend.onrender.com/api/auth/google/callback

# Facebook OAuth (only if you have Facebook OAuth configured)
FACEBOOK_APP_ID=<your-facebook-app-id>
FACEBOOK_APP_SECRET=<your-facebook-app-secret>
FACEBOOK_CALLBACK_URL=https://omvira-backend.onrender.com/api/auth/facebook/callback

# Google Maps API (only if you're using distance/address features)
GOOGLE_MAPS_API_KEY=<your-google-maps-api-key>

# SendGrid (only if you have email sending configured)
SENDGRID_API_KEY=<your-sendgrid-api-key>
SENDGRID_FROM_EMAIL=noreply@omvirawellness.com

# Stripe (only if you have payments configured)
STRIPE_SECRET_KEY=<your-stripe-secret-key>
STRIPE_WEBHOOK_SECRET=<your-stripe-webhook-secret>
```

**Note:** You only need to add the variables you're actually using. The backend will work without the optional ones - those features just won't be available.

### How to Generate JWT_SECRET
Run this in your terminal:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
Copy the output and use it as your JWT_SECRET.

---

## Step 4: Deploy

1. Click **"Create Web Service"**
2. Render will:
   - Clone your repository
   - Install dependencies
   - Start your backend
   - Give you a URL like: `https://omvira-backend.onrender.com`

3. **Wait for deployment** (5-10 minutes first time)
   - Watch the logs for any errors
   - Look for: "Server is running on port 4000"

---

## Step 5: Run Database Migrations

Once deployed, you need to set up your database tables:

1. **Connect to Your Database**
   - In Render dashboard, go to your database
   - Click **"Connect"** → **"External Connection"**
   - Use a PostgreSQL client like:
     - pgAdmin
     - DBeaver
     - TablePlus
     - Or command line `psql`

2. **Run Migrations**
   ```sql
   -- Run each migration file in order from backend/migrations/
   -- Starting with 001_initial_schema.sql through 015_...
   ```

   Or if you have access to the Render shell:
   ```bash
   # In Render dashboard, click "Shell" tab
   cd backend
   node migrations/run-migration.js
   ```

---

## Step 6: Update Frontend to Use Backend

1. **Go to Vercel Dashboard**
   - Open your frontend project
   - Go to **Settings** → **Environment Variables**

2. **Add Backend URL**
   ```bash
   NEXT_PUBLIC_API_URL=https://omvira-backend.onrender.com
   ```

3. **Redeploy Frontend**
   - Go to **Deployments** tab
   - Click the three dots on latest deployment
   - Click **"Redeploy"**

---

## Step 7: Update OAuth Callback URLs

If you're using Google or Facebook OAuth:

### Google Cloud Console
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Select your project
3. Go to **APIs & Services** → **Credentials**
4. Edit your OAuth client
5. Add to **Authorized redirect URIs**:
   ```
   https://omvira-backend.onrender.com/api/auth/google/callback
   ```

### Facebook Developers
1. Go to [developers.facebook.com](https://developers.facebook.com)
2. Select your app
3. Go to **Facebook Login** → **Settings**
4. Add to **Valid OAuth Redirect URIs**:
   ```
   https://omvira-backend.onrender.com/api/auth/facebook/callback
   ```

---

## Step 8: Test Your Deployment

1. **Test Health Check**
   - Visit: `https://omvira-backend.onrender.com/health`
   - Should return: `{"status":"OK"}`

2. **Test API Endpoints**
   - Try registering a user on your frontend
   - Try logging in
   - Check Render logs for any errors

---

## Important Notes

### Free Tier Limitations
- ⚠️ Render free tier spins down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- Good for testing, not for production
- Consider upgrading to paid plan ($7/month) for always-on

### Database Backups
- Free PostgreSQL expires after 90 days
- Paid plan ($7/month) includes automatic backups

### Monitoring
- Check **Logs** tab in Render dashboard for errors
- Monitor **Metrics** tab for performance

---

## Troubleshooting

### Build Fails
```bash
# Check logs in Render dashboard
# Common issues:
- Missing dependencies in package.json
- Incorrect Node version
```

### Database Connection Fails
```bash
# Make sure DATABASE_URL is correct
# Should be "Internal Database URL" from Render
# Format: postgres://user:pass@host/database
```

### CORS Errors
```bash
# Make sure FRONTEND_URL is set correctly
# Check backend src/index.js for CORS configuration
```

### 502 Bad Gateway
```bash
# Backend crashed - check logs
# Usually missing environment variable or database issue
```

---

## Useful Commands

### View Logs
```bash
# In Render dashboard:
1. Go to your web service
2. Click "Logs" tab
3. Filter by date/time
```

### Restart Service
```bash
# In Render dashboard:
1. Go to your web service
2. Click "Manual Deploy" → "Clear build cache & deploy"
```

### Connect to Database
```bash
# Using psql:
psql <your-external-database-url>
```

---

## Next Steps

1. ✅ Backend deployed on Render
2. ✅ Database created and connected
3. ✅ Frontend updated with backend URL
4. ✅ Test login/signup functionality
5. 🎉 Your app is live!

---

## Cost Summary

**Free Tier:**
- Backend: $0 (with spin-down)
- Database: $0 (90-day limit)
- Total: $0

**Paid (Production Ready):**
- Backend: $7/month (always-on)
- Database: $7.50/month (Starter + 5GB storage, persistent + backups)
- Total: $14.50/month

**Alternative:**
- Backend: $7/month (always-on)
- Database: $7/month (Starter + 10GB storage)
- Total: $14/month

---

**Need help?** Check Render docs: https://render.com/docs

