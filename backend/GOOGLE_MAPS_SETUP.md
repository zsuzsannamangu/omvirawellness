# Google Maps API Setup Guide

This guide will walk you through setting up Google Maps API for accurate distance calculations in the Omvira Wellness platform.

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Click the project dropdown at the top of the page
4. Click **"New Project"**
5. Enter a project name (e.g., "Omvira Wellness")
6. Click **"Create"**

## Step 2: Enable Required APIs

1. In your Google Cloud project, go to **"APIs & Services"** → **"Library"** (or use the search bar)
2. Search for and enable the following APIs:
   - **Address Validation API** (recommended - most accurate address validation)
   - **Geocoding API** (fallback for address validation on backend)
   - **Distance Matrix API** (for driving distance calculations on backend)
   - **Places API** (for address autocomplete on frontend)
   - **Maps JavaScript API** (required for Places API to work)

3. For each API:
   - Click on the API name
   - Click **"Enable"** button

## Step 3: Create API Key

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"** at the top
3. Select **"API key"**
4. Your API key will be created and displayed
5. **Important**: Copy the API key immediately (you won't be able to see it again in full)

## Step 4: Restrict API Key (Recommended for Security)

1. Click **"Restrict Key"** (or edit the key you just created)
2. Under **"API restrictions"**:
   - Select **"Restrict key"**
   - Check only these APIs (depending on whether it's for backend or frontend):
     - **For Backend Key**: Address Validation API, Geocoding API, Distance Matrix API
     - **For Frontend Key**: Places API, Maps JavaScript API
3. Under **"Application restrictions"** (optional but recommended):
   - Select **"HTTP referrers (web sites)"**
   - Add your domain(s) (e.g., `https://yourdomain.com/*`)
   - Or select **"IP addresses"** and add your server IPs
4. Click **"Save"**

## Step 5: Set Up Billing

**Note**: Google Maps APIs require a billing account, but they offer $200 in free credits per month.

1. Go to **"Billing"** in the left sidebar
2. Click **"Link a billing account"** or **"Create billing account"**
3. Follow the prompts to add a payment method
4. Don't worry - you won't be charged unless you exceed the free tier

**Free Tier Limits** (as of 2024):
- Geocoding API: $5 per 1,000 requests (first $200/month free)
- Distance Matrix API: $5 per 1,000 requests (first $200/month free)
- This means approximately 40,000 free requests per month

## Step 6: Add API Key to Your Backend

1. Open your backend `.env` file (create it if it doesn't exist in the `backend` directory)
2. Add the following line:
   ```env
   GOOGLE_MAPS_API_KEY=your_actual_api_key_here
   ```
3. Replace `your_actual_api_key_here` with the API key you copied in Step 3
4. Save the file

## Step 8: Restart Your Servers

After adding the API key, restart your backend server:

```bash
cd backend
npm run dev
# or
npm start
```

## Step 8: Test the Setup

1. **Test Address Autocomplete**:
   - Go to a provider booking page
   - Select "Come to Me" location option
   - Start typing an address in the address field
   - You should see Google Places autocomplete suggestions
   - Select an address - it should auto-fill street, city, state, and zip

2. **Test Distance Calculation**:
   - After selecting an address, click "Check Distance"
   - The distance should match what you see in Google Maps

## Troubleshooting

### Error: "This API project is not authorized to use this API"
- Make sure you've enabled the Geocoding API and Distance Matrix API in Step 2

### Error: "API key not valid"
- Double-check that you copied the entire API key correctly
- Make sure there are no extra spaces in your `.env` file
- Verify the API key is not restricted to specific IPs/domains that don't match your server

### Error: "Billing account required"
- You need to set up billing (Step 5) even though you get free credits

### Distances still don't match Google Maps
- Make sure the Distance Matrix API is enabled (not just Geocoding API)
- Check that your `.env` file is being loaded correctly
- Restart your backend server after adding the API key

## Security Best Practices

1. **Never commit your `.env` file to git** (it should already be in `.gitignore`)
2. **Restrict your API key** to only the APIs you need (Step 4)
3. **Set application restrictions** to limit where the key can be used
4. **Monitor usage** in Google Cloud Console → APIs & Services → Dashboard
5. **Set up billing alerts** to get notified if you approach your budget

## Alternative: Using OpenStreetMap (Free, No Setup)

If you don't want to set up Google Maps API, the system will automatically use OpenStreetMap Nominatim, which is:
- Completely free
- No API key required
- Rate-limited (1 request per second)
- Less accurate than Google Maps (uses straight-line distance instead of driving distance)

The system will automatically fall back to OpenStreetMap if `GOOGLE_MAPS_API_KEY` is not set.
