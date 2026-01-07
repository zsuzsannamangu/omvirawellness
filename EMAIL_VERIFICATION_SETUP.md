# Email Verification Setup with SendGrid

## Overview
Email verification functionality has been implemented using SendGrid. When users update their email address, they receive a verification email and must verify it before the email is marked as verified.

## Installation

### Backend
```bash
cd backend
npm install @sendgrid/mail
```

## Environment Variables

### Backend `.env`
Add these variables:
```env
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@omvirawellness.com
FRONTEND_URL=https://yourdomain.com  # Optional: defaults to localhost:3000 in dev
```

### Getting SendGrid API Key
1. Sign up at https://sendgrid.com
2. Go to **Settings > API Keys**
3. Click **Create API Key**
4. Name it (e.g., "Omvira Wellness Production")
5. Select **Full Access** or **Restricted Access** (with Mail Send permissions)
6. Copy the API key (starts with `SG.`)
7. Add it to your `.env` file as `SENDGRID_API_KEY`

### Verifying Sender Identity
1. Go to **Settings > Sender Authentication**
2. Either:
   - **Single Sender Verification**: Verify a single email address
   - **Domain Authentication**: Verify your entire domain (recommended for production)
3. Use the verified email/domain in `SENDGRID_FROM_EMAIL`

## How It Works

### Email Update Flow
1. User updates email in account settings
2. Backend generates a verification token
3. Token is stored in database with the user record
4. SendGrid sends verification email with link
5. User clicks link → `/verify-email?token=xxx&userId=xxx`
6. Backend verifies token and marks email as verified
7. User can now use all features

### API Endpoints

#### `GET /api/auth/verify-email`
Verifies email using token from email link.
- **Query params**: `token` (verification token), `userId` (user ID)
- **Access**: Public
- **Response**: Success/error message

#### `POST /api/auth/resend-verification`
Resends verification email to current user.
- **Headers**: `Authorization: Bearer <token>`
- **Access**: Protected (requires authentication)
- **Response**: Success/error message

## Frontend Features

### Verification Page
- **Route**: `/verify-email`
- Shows loading state while verifying
- Shows success/error messages
- Allows resending verification email if failed

### Account Settings
- Shows email verification status (✓ verified / ✗ not verified)
- "Resend verification email" button if not verified
- Updates automatically when email is verified

## Database Schema

The `users` table already has:
- `email_verified` (BOOLEAN) - Verification status
- `verification_token` (VARCHAR) - Token for verification

## Testing

### Test Email Update
1. Update email in account settings
2. Check inbox for verification email
3. Click verification link
4. Should see success message
5. Account settings should show "Email verified"

### Test Resend
1. If verification fails or email not received
2. Click "Resend verification email" in account settings
3. New email should be sent

## Production Checklist

- [ ] SendGrid API key added to production environment variables
- [ ] Sender email/domain verified in SendGrid
- [ ] `FRONTEND_URL` set to production domain
- [ ] `SENDGRID_FROM_EMAIL` set to verified sender
- [ ] Test email delivery in production
- [ ] Monitor SendGrid dashboard for delivery rates

## Troubleshooting

### Emails Not Sending
- Check SendGrid API key is correct
- Verify sender email/domain is authenticated
- Check SendGrid dashboard for errors
- Verify `FRONTEND_URL` is set correctly

### Verification Link Not Working
- Check token hasn't expired (24 hours)
- Verify `FRONTEND_URL` matches your domain
- Check backend logs for errors

### Email Goes to Spam
- Set up SPF, DKIM, and DMARC records (domain authentication)
- Use a verified domain instead of single sender
- Monitor SendGrid reputation
