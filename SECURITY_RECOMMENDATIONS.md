# Security Recommendations: Account Settings & Two-Factor Authentication

## Current State

### Account Settings
- ✅ Account Settings section exists in provider dashboard
- ✅ "Change Password" button exists but **not functional**
- ❌ No password change backend endpoint
- ❌ No email update functionality
- ❌ No account deletion/deactivation

### Two-Factor Authentication
- ❌ No 2FA implementation currently

---

## Recommendations

### 1. Two-Factor Authentication (2FA) Options

#### **Recommended: TOTP (Time-based One-Time Password)**
**Best Choice for Security & UX**

**Pros:**
- ✅ Industry standard (used by Google, Microsoft, GitHub, etc.)
- ✅ Works offline (no SMS/email dependency)
- ✅ More secure than SMS (not vulnerable to SIM swapping)
- ✅ Free to implement
- ✅ Users can use any authenticator app (Google Authenticator, Authy, Microsoft Authenticator, 1Password, etc.)
- ✅ Works on all devices

**Implementation:**
- Use `speakeasy` or `otplib` npm package
- Generate secret key per user
- Store encrypted secret in database
- Generate QR code for easy setup
- Verify 6-digit codes during login

**User Flow:**
1. User enables 2FA in account settings
2. System generates secret + QR code
3. User scans QR code with authenticator app
4. User enters verification code to confirm setup
5. System stores encrypted secret
6. On login: user enters password + 6-digit code from app

---

#### Alternative Options (Not Recommended as Primary)

**SMS-Based 2FA:**
- ❌ Vulnerable to SIM swapping attacks
- ❌ Costs money (Twilio, etc.)
- ❌ Can be delayed or fail
- ✅ Easy for users (no app needed)

**Email-Based 2FA:**
- ❌ Less secure (email can be compromised)
- ❌ Slower (waiting for email)
- ✅ No additional setup needed
- ✅ Good as backup method

**Recommendation:** Use TOTP as primary, email as backup recovery method.

---

## Implementation Plan

### Phase 1: Password Management

#### Backend Endpoints Needed:
```javascript
// Change password
PUT /api/auth/change-password
Body: { currentPassword, newPassword }

// Update email
PUT /api/auth/update-email
Body: { newEmail, password }

// Delete account
DELETE /api/auth/account
Body: { password, confirmation }
```

#### Frontend Components Needed:
1. **ChangePasswordModal** - Modal with:
   - Current password field
   - New password field
   - Confirm new password field
   - Password strength indicator
   - Validation rules

2. **UpdateEmailModal** - Modal with:
   - New email field
   - Password confirmation
   - Email verification flow

3. **AccountDeletionModal** - Modal with:
   - Warning message
   - Password confirmation
   - Confirmation checkbox

---

### Phase 2: Two-Factor Authentication (TOTP)

#### Backend Endpoints Needed:
```javascript
// Enable 2FA - Generate secret and QR code
POST /api/auth/2fa/enable
Response: { secret, qrCodeUrl }

// Verify and activate 2FA
POST /api/auth/2fa/verify
Body: { token }
Response: { backupCodes: [...] }

// Disable 2FA
POST /api/auth/2fa/disable
Body: { password, token }

// Verify 2FA code during login
POST /api/auth/2fa/verify-login
Body: { token }

// Regenerate backup codes
POST /api/auth/2fa/regenerate-backup-codes
Body: { password }
```

#### Database Schema Changes:
```sql
ALTER TABLE users ADD COLUMN two_factor_secret VARCHAR(255);
ALTER TABLE users ADD COLUMN two_factor_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN backup_codes TEXT; -- JSON array of hashed codes
```

#### Frontend Components Needed:
1. **TwoFactorSetupModal** - Shows:
   - QR code for scanning
   - Manual entry code (for users who can't scan)
   - Instructions
   - Verification input

2. **TwoFactorVerifyModal** - For login:
   - 6-digit code input
   - "Use backup code" option
   - "Lost access?" recovery link

3. **TwoFactorSettings** - In account settings:
   - Enable/Disable toggle
   - Status indicator
   - Regenerate backup codes button
   - View backup codes (one-time)

---

## Recommended Packages

### Backend:
```bash
npm install speakeasy qrcode
```

- `speakeasy`: Generate and verify TOTP codes
- `qrcode`: Generate QR codes for authenticator setup

### Frontend:
```bash
npm install qrcode.react  # For displaying QR codes
```

---

## Security Best Practices

### Password Change:
1. ✅ Require current password verification
2. ✅ Enforce password strength (min 8 chars, uppercase, lowercase, number)
3. ✅ Prevent reusing last 3 passwords
4. ✅ Rate limit password change attempts
5. ✅ Send email notification on password change
6. ✅ Invalidate all other sessions after password change

### 2FA:
1. ✅ Encrypt 2FA secrets in database
2. ✅ Generate 10 backup codes (single-use, hashed)
3. ✅ Require password + 2FA code to disable 2FA
4. ✅ Show backup codes only once during setup
5. ✅ Allow recovery via email if 2FA is lost
6. ✅ Rate limit 2FA verification attempts (prevent brute force)
7. ✅ Lock account after 5 failed 2FA attempts

---

## User Experience Flow

### Enabling 2FA:
1. User goes to Account Settings → Security
2. Clicks "Enable Two-Factor Authentication"
3. Modal shows QR code + instructions
4. User scans with authenticator app
5. User enters 6-digit code to verify
6. System shows backup codes (user must save them)
7. 2FA is now enabled

### Login with 2FA:
1. User enters email + password
2. If 2FA enabled, show code input screen
3. User enters 6-digit code from app
4. Or uses backup code if app unavailable
5. Login successful

### Disabling 2FA:
1. User goes to Account Settings → Security
2. Clicks "Disable Two-Factor Authentication"
3. Requires password + current 2FA code
4. Confirmation modal
5. 2FA disabled

---

## Implementation Priority

1. **High Priority:**
   - Change password functionality
   - Basic account settings (email update)

2. **Medium Priority:**
   - TOTP 2FA implementation
   - Backup codes system

3. **Low Priority:**
   - Account deletion
   - SMS 2FA (as alternative)
   - Email 2FA (as backup)

---

## Code Structure Recommendation

```
backend/src/
  routes/
    auth.js (add password/2FA routes)
  controllers/
    auth.js (add password/2FA controllers)
  utils/
    2fa.js (TOTP generation/verification)
    password.js (password validation utilities)

frontend/src/
  components/
    Providers/Dashboard/
      ChangePasswordModal.tsx
      TwoFactorSetupModal.tsx
      TwoFactorVerifyModal.tsx
      AccountSettings.tsx
    Clients/Dashboard/
      (same components)
```

---

## Next Steps

Would you like me to:
1. ✅ Implement change password functionality?
2. ✅ Implement TOTP 2FA?
3. ✅ Create the account settings UI components?
4. ✅ Set up the backend endpoints?

Let me know which you'd like to prioritize!

