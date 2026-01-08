# ✅ Deployment Checklist

## Quick Reference

### What You Need
- [ ] GitHub repository with code pushed
- [ ] Render account (free) at [render.com](https://render.com)
- [ ] Vercel account (you already have this)
- [ ] 30-45 minutes of time

---

## Deployment Order

### ✅ Already Done
- [x] Frontend deployed to Vercel
- [x] Frontend URL: `https://omvirawellness.vercel.app` (or similar)

### 🔄 Now Do This

#### 1. Create Database on Render (5 minutes)
- [ ] Go to render.com → New+ → PostgreSQL
- [ ] Name: `omvira-db`
- [ ] Plan: Free
- [ ] Copy Internal Database URL

#### 2. Deploy Backend to Render (10 minutes)
- [ ] New+ → Web Service
- [ ] Connect GitHub repo
- [ ] Root Directory: `backend`
- [ ] Build: `npm install`
- [ ] Start: `npm start`
- [ ] Add environment variables (see below)

#### 3. Environment Variables (10 minutes)
**Required (minimum to work):**
- [ ] `DATABASE_URL` - from step 1
- [ ] `PORT=4000`
- [ ] `NODE_ENV=production`
- [ ] `JWT_SECRET` - generate with crypto
- [ ] `FRONTEND_URL` - your Vercel URL

**Optional (for full features):**
- [ ] Google OAuth credentials
- [ ] Facebook OAuth credentials
- [ ] Google Maps API key
- [ ] SendGrid API key
- [ ] Stripe keys

#### 4. Run Database Migrations (10 minutes)
- [ ] Connect to database
- [ ] Run migration files in order
- [ ] Verify tables created

#### 5. Update Frontend (5 minutes)
- [ ] Vercel → Settings → Environment Variables
- [ ] Add: `NEXT_PUBLIC_API_URL=<your-render-url>`
- [ ] Redeploy frontend

#### 6. Update OAuth URLs (5 minutes, if using OAuth)
- [ ] Google Cloud Console → Add redirect URI
- [ ] Facebook Developers → Add redirect URI

#### 7. Test Everything (10 minutes)
- [ ] Visit your Vercel URL
- [ ] Try creating an account
- [ ] Try logging in
- [ ] Test search functionality
- [ ] Check provider/client dashboards

---

## Quick Command Reference

### Generate JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Test Backend Health
```
https://your-backend.onrender.com/health
```

---

## Important URLs to Save

| Service | URL | Notes |
|---------|-----|-------|
| Frontend | `https://omvirawellness.vercel.app` | Already deployed |
| Backend | `https://omvira-backend.onrender.com` | Will get after deploy |
| Database | (Internal URL) | Copy from Render |

---

## Common Issues & Fixes

### Issue: Backend build fails
**Fix:** Check Render logs, usually missing dependencies

### Issue: Database connection fails  
**Fix:** Double-check DATABASE_URL is the Internal URL

### Issue: CORS errors
**Fix:** Make sure FRONTEND_URL matches your Vercel URL exactly

### Issue: 502 Bad Gateway
**Fix:** Backend crashed - check Render logs for errors

### Issue: Login doesn't work
**Fix:** Make sure JWT_SECRET is set and database migrations ran

---

## Cost Breakdown

**Current Setup (Free):**
- Vercel Frontend: $0
- Render Backend: $0 (spins down after 15 min)
- Render Database: $0 (90-day trial)
- **Total: $0/month**

**Production Ready:**
- Vercel Frontend: $0
- Render Backend: $7/month (always-on)
- Render Database: $7/month (persistent)
- **Total: $14/month**

---

## Need Help?

1. Check RENDER_BACKEND_DEPLOY.md for detailed steps
2. Check Render logs in dashboard
3. Test each endpoint individually
4. Verify environment variables are set correctly

---

## Success Criteria

✅ Backend URL responds at `/health`
✅ Can create new account on frontend
✅ Can log in with credentials
✅ Dashboard loads correctly
✅ Search works
✅ No CORS errors in browser console

---

**You're almost there! Follow the steps and you'll be live in 30-45 minutes! 🚀**

