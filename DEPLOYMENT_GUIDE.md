# 🚀 Deployment Guide for Omvira Wellness

This guide will help you deploy your Next.js frontend to Vercel for portfolio viewing.

## Prerequisites

- ✅ Vercel account (you mentioned you have one)
- ✅ Git repository (GitHub, GitLab, or Bitbucket)
- ✅ Your code pushed to the repository

## Option 1: Deploy Frontend Only (Portfolio/Demo)

This is perfect for showing the UI/UX without full backend functionality.

### Step 1: Push Your Code to GitHub

```bash
# If you haven't already, initialize git and push to GitHub
cd /Users/zsuzsi/Documents/My_Apps/omvirawellness
git init  # if not already initialized
git add .
git commit -m "Prepare for deployment"
git remote add origin <your-github-repo-url>
git push -u origin main
```

### Step 2: Deploy to Vercel

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Click "Add New Project"

2. **Import Your Repository**
   - Connect your GitHub account if needed
   - Select your `omvirawellness` repository
   - Click "Import"

3. **Configure Project Settings**
   - **Root Directory**: Set to `frontend` (since your Next.js app is in the frontend folder)
   - **Framework Preset**: Should auto-detect "Next.js"
   - **Build Command**: `npm run build` (should be auto-filled)
   - **Output Directory**: `.next` (should be auto-filled)
   - **Install Command**: `npm install` (should be auto-filled)

4. **Environment Variables** (Optional for demo)
   - For now, you can leave this empty if you just want to show the UI
   - If you deploy the backend later, add:
     - `NEXT_PUBLIC_API_URL` = `https://your-backend-url.onrender.com`

5. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete (usually 2-3 minutes)

6. **Access Your Site**
   - Vercel will provide you with a URL like: `https://omvirawellness.vercel.app`
   - You can share this URL with your partner or add it to your resume!

### Step 3: Custom Domain (Optional)

If you want a custom domain:
1. Go to your project settings in Vercel
2. Click "Domains"
3. Add your custom domain
4. Follow the DNS configuration instructions

---

## Option 2: Deploy Full Stack (Frontend + Backend)

If you want the site to be fully functional:

### Deploy Backend to Render

1. **Go to Render Dashboard**
   - Visit [render.com](https://render.com)
   - Click "New +" → "Web Service"

2. **Connect Repository**
   - Connect your GitHub account
   - Select your repository

3. **Configure Backend Service**
   - **Name**: `omvira-backend` (or any name you like)
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start` (or `node src/index.js`)
   - **Plan**: Free tier is fine for demo

4. **Environment Variables** (Important!)
   Add these in Render dashboard:
   ```
   DATABASE_URL=your_postgresql_connection_string
   PORT=4000
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=7d
   NODE_ENV=production
   ```

5. **Get Backend URL**
   - Render will give you a URL like: `https://omvira-backend.onrender.com`
   - Note this URL!

### Update Frontend with Backend URL

1. **In Vercel Dashboard**
   - Go to your project settings
   - Click "Environment Variables"
   - Add: `NEXT_PUBLIC_API_URL` = `https://omvira-backend.onrender.com`
   - Redeploy your frontend

2. **Or Update in Code**
   - The code now uses `process.env.NEXT_PUBLIC_API_URL`
   - You can set this in Vercel's environment variables

---

## Troubleshooting

### Build Fails
- Check the build logs in Vercel
- Make sure `package.json` has all dependencies
- Ensure TypeScript errors are resolved (we have `ignoreBuildErrors: true` in next.config.ts)

### API Calls Don't Work
- Check browser console for CORS errors
- Make sure backend URL is correct in environment variables
- Verify backend is running on Render

### Images Not Loading
- Check that images are in the `public` folder
- Verify image paths are correct

---

## Quick Commands

```bash
# Test build locally before deploying
cd frontend
npm run build

# If build succeeds, you're ready to deploy!
```

---

## Notes for Portfolio

- ✅ The site will be viewable at your Vercel URL
- ✅ All pages and UI components will work
- ⚠️ Login/signup won't work without backend (but UI will show)
- ✅ You can add a note on the site: "Demo/Portfolio - Backend not connected"

---

**Need Help?** Check Vercel's documentation: https://vercel.com/docs

