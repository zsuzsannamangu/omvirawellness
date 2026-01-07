# How to Check Which Google Maps APIs Are Enabled

## Step-by-Step Guide

### 1. Go to Google Cloud Console
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Select your project (the one you created for Omvira Wellness)

### 2. Navigate to APIs & Services
1. In the left sidebar, click **"APIs & Services"**
2. Click **"Library"** (or **"Enabled APIs"** to see what's already enabled)

### 3. Check Enabled APIs
- Click **"Enabled APIs"** in the left sidebar under "APIs & Services"
- This shows all APIs currently enabled for your project

### 4. Enable Missing APIs
If any APIs are missing, follow these steps:

#### For Each Required API:

1. In the **"APIs & Services"** → **"Library"** section, use the search bar
2. Search for the API name (see list below)
3. Click on the API
4. Click the **"Enable"** button (if it's not already enabled)

## Required APIs Checklist

### ✅ Backend APIs (for distance calculation and validation):
- [ ] **Address Validation API** - Most accurate address validation
- [ ] **Geocoding API** - Fallback for address validation
- [ ] **Distance Matrix API** - For calculating driving distances

### ✅ Frontend APIs (for address autocomplete):
- [ ] **Places API** - For address autocomplete suggestions
- [ ] **Maps JavaScript API** - Required for Places API to work

## Quick Verification

After enabling, go to **"APIs & Services"** → **"Enabled APIs"** and verify you see all 5 APIs listed:
1. Address Validation API
2. Geocoding API
3. Distance Matrix API
4. Places API
5. Maps JavaScript API

## What Each API Does

- **Address Validation API**: Validates addresses with high accuracy (recommended)
- **Geocoding API**: Converts addresses to coordinates (fallback if Address Validation not available)
- **Distance Matrix API**: Calculates actual driving distances between addresses
- **Places API**: Provides address autocomplete suggestions as users type
- **Maps JavaScript API**: Required library for Places API to work in the browser

## Troubleshooting

**If you can't find an API:**
- Make sure you're in the correct Google Cloud project
- Some APIs might be under different names (e.g., "Address Validation API" might be listed as "Address Validation")

**If "Enable" button is grayed out:**
- You might need to set up billing first (even though you get $200/month free)
- Go to "Billing" in the left sidebar and link a payment method

**After enabling APIs:**
- Wait a few minutes for changes to propagate
- Restart your backend server if it's running
- Clear browser cache if testing frontend features
