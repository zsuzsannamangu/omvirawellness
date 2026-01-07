# Security Guide for Omvira Wellness Platform

## Current Security Status & Recommendations

### 🔴 Critical Issues to Address

#### 1. **Hardcoded API URLs**
**Issue**: Frontend has hardcoded `localhost:4000` URLs
**Location**: All frontend API calls
**Fix**: 
- Use environment variables for API base URL
- Create `frontend/.env.local`:
  ```
  NEXT_PUBLIC_API_URL=http://localhost:4000
  ```
- In production: `NEXT_PUBLIC_API_URL=https://api.yourdomain.com`
- Update all fetch calls to use: `process.env.NEXT_PUBLIC_API_URL`

#### 2. **JWT Secret Fallback**
**Issue**: Backend has insecure fallback: `process.env.JWT_SECRET || 'your-secret-key-change-in-production'`
**Location**: `backend/src/routes/*.js` (multiple files)
**Fix**:
- Remove fallback, require JWT_SECRET in .env
- Add validation on server startup:
  ```javascript
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
  }
  ```
- Use a strong, randomly generated secret (at least 32 characters)

#### 3. **Token Storage in localStorage**
**Issue**: JWT tokens stored in localStorage (vulnerable to XSS attacks)
**Current**: `localStorage.getItem('token')`
**Recommendation**:
- **Option A (Better)**: Use httpOnly cookies (most secure)
- **Option B (Acceptable)**: Use sessionStorage (cleared on tab close)
- **Option C (Current)**: Keep localStorage but add:
  - Content Security Policy (CSP) headers
  - XSS protection
  - Input sanitization

#### 4. **Missing Input Validation**
**Issue**: Need comprehensive input validation
**Fix**: Add validation middleware (e.g., `express-validator` or `joi`)

#### 5. **Missing Rate Limiting**
**Issue**: No rate limiting on API endpoints
**Fix**: Add `express-rate-limit` middleware

#### 6. **Missing Security Headers**
**Issue**: No security headers configured
**Fix**: Add `helmet` middleware

#### 7. **Error Messages Expose Information**
**Issue**: Error messages may expose sensitive details
**Fix**: Sanitize error messages in production

---

## Implementation Steps

### Step 1: Environment Variables Setup

**Backend `.env`** (already exists, but verify):
```env
DATABASE_URL=your_database_url
JWT_SECRET=your_very_strong_secret_key_here_min_32_chars
NODE_ENV=production
PORT=4000
```

**Frontend `.env.local`** (create this):
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Step 2: Install Security Packages

```bash
cd backend
npm install express-rate-limit helmet express-validator
```

### Step 3: Add Security Middleware

Create `backend/src/middleware/security.js`:
```javascript
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many login attempts, please try again later.'
});

// Security headers
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
});

module.exports = {
  apiLimiter,
  authLimiter,
  securityHeaders
};
```

### Step 4: Update Backend Server

In `backend/src/index.js`, add:
```javascript
const { apiLimiter, authLimiter, securityHeaders } = require('./middleware/security');

// Apply security headers
app.use(securityHeaders);

// Apply rate limiting to auth routes
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Apply rate limiting to all API routes
app.use('/api/', apiLimiter);
```

### Step 5: Add Input Validation

Create `backend/src/middleware/validation.js`:
```javascript
const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const validateSubscription = [
  body('plan').isIn(['essential', 'professional', 'growth']),
  body('billingCycle').isIn(['monthly', 'yearly']),
  body('price').isNumeric().isFloat({ min: 0 }),
  validate
];

module.exports = { validate, validateSubscription };
```

### Step 6: Update Frontend API Calls

Create `frontend/src/utils/api.ts`:
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || error.message || 'Request failed');
  }

  return response.json();
};
```

### Step 7: Sanitize Error Messages

In production, don't expose detailed error messages:
```javascript
// In error handlers
const errorMessage = process.env.NODE_ENV === 'production' 
  ? 'An error occurred' 
  : err.message;
```

---

## Additional Security Recommendations

### 1. **HTTPS in Production**
- Use HTTPS for all API calls
- Set up SSL/TLS certificates
- Redirect HTTP to HTTPS

### 2. **Database Security**
- ✅ Already using parameterized queries (good!)
- Use connection pooling (already implemented)
- Regular backups
- Limit database user permissions

### 3. **Password Security**
- ✅ Already using bcrypt (good!)
- Consider adding password strength requirements
- Implement password reset with secure tokens

### 4. **CORS Configuration**
- Restrict CORS to specific origins in production
- Don't use `*` in production

### 5. **Logging & Monitoring**
- Log security events (failed logins, etc.)
- Set up monitoring/alerts
- Don't log sensitive data (passwords, tokens)

### 6. **Payment Security**
- ✅ Already masking card numbers (good!)
- ✅ Not storing CVV (good!)
- Consider using a payment processor (Stripe, PayPal) instead of storing card data
- PCI DSS compliance if storing card data

### 7. **Session Management**
- Implement token refresh
- Add token expiration
- Implement logout that invalidates tokens

### 8. **File Upload Security**
- Validate file types
- Scan for malware
- Limit file sizes
- Store uploads outside web root

---

## Priority Implementation Order

1. **High Priority** (Do First):
   - Remove JWT_SECRET fallback
   - Add environment variables for API URLs
   - Add rate limiting
   - Add security headers (helmet)

2. **Medium Priority**:
   - Add input validation
   - Sanitize error messages
   - Improve token storage (consider httpOnly cookies)

3. **Low Priority** (Nice to Have):
   - Add monitoring/logging
   - Implement token refresh
   - Add password strength requirements

---

## Testing Security

1. **Test rate limiting**: Try making many requests quickly
2. **Test authentication**: Try accessing protected routes without token
3. **Test authorization**: Try accessing other users' data
4. **Test input validation**: Try sending invalid/malicious input
5. **Test SQL injection**: Try SQL injection attempts (should all fail with parameterized queries)

---

## Production Checklist

- [ ] All environment variables set
- [ ] JWT_SECRET is strong and unique
- [ ] HTTPS enabled
- [ ] Rate limiting configured
- [ ] Security headers added
- [ ] Input validation on all endpoints
- [ ] Error messages sanitized
- [ ] CORS configured for production domain
- [ ] Database backups configured
- [ ] Monitoring/logging set up
- [ ] API URLs use environment variables
- [ ] No hardcoded secrets in code

