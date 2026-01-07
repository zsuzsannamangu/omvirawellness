const sgMail = require('@sendgrid/mail');

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
} else {
  console.warn('⚠️  SendGrid API key not found. Email functionality will be disabled.');
}

/**
 * Generate a secure verification token
 * @returns {string} Random token
 */
function generateVerificationToken() {
  const crypto = require('crypto');
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Send email verification email
 * @param {string} email - User's email address
 * @param {string} token - Verification token
 * @param {string} userId - User ID for the verification link
 * @returns {Promise<Object>} SendGrid response
 */
async function sendVerificationEmail(email, token, userId) {
  if (!process.env.SENDGRID_API_KEY) {
    throw new Error('SendGrid is not configured. Please add SENDGRID_API_KEY to environment variables.');
  }

  const baseUrl = process.env.FRONTEND_URL || process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3000';
  const verificationUrl = `${baseUrl}/verify-email?token=${token}&userId=${userId}`;

  const msg = {
    to: email,
    from: process.env.SENDGRID_FROM_EMAIL || 'noreply@omvirawellness.com',
    subject: 'Verify Your Email Address - Omvira Wellness',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #ED6E95 0%, #6D4f71 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0;">Omvira Wellness</h1>
          </div>
          <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px;">
            <h2 style="color: #294055; margin-top: 0;">Verify Your Email Address</h2>
            <p>Thank you for updating your email address with Omvira Wellness!</p>
            <p>Please click the button below to verify your new email address:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="display: inline-block; background: #4F8D80; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600;">
                Verify Email Address
              </a>
            </div>
            <p style="font-size: 14px; color: #666;">Or copy and paste this link into your browser:</p>
            <p style="font-size: 12px; color: #999; word-break: break-all;">${verificationUrl}</p>
            <p style="font-size: 14px; color: #666; margin-top: 30px;">
              This link will expire in 24 hours. If you didn't request this email, please ignore it.
            </p>
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
            <p style="font-size: 12px; color: #999; text-align: center;">
              © ${new Date().getFullYear()} Omvira Wellness. All rights reserved.
            </p>
          </div>
        </body>
      </html>
    `,
    text: `
      Verify Your Email Address - Omvira Wellness

      Thank you for updating your email address with Omvira Wellness!

      Please click the link below to verify your new email address:
      ${verificationUrl}

      This link will expire in 24 hours. If you didn't request this email, please ignore it.

      © ${new Date().getFullYear()} Omvira Wellness. All rights reserved.
    `
  };

  try {
    await sgMail.send(msg);
    return { success: true };
  } catch (error) {
    console.error('SendGrid error:', error);
    if (error.response) {
      console.error('Error response body:', error.response.body);
    }
    throw new Error('Failed to send verification email');
  }
}

/**
 * Send password reset email (for future use)
 * @param {string} email - User's email address
 * @param {string} token - Reset token
 * @returns {Promise<Object>} SendGrid response
 */
async function sendPasswordResetEmail(email, token) {
  if (!process.env.SENDGRID_API_KEY) {
    throw new Error('SendGrid is not configured. Please add SENDGRID_API_KEY to environment variables.');
  }

  const baseUrl = process.env.FRONTEND_URL || process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3000';
  const resetUrl = `${baseUrl}/reset-password?token=${token}`;

  const msg = {
    to: email,
    from: process.env.SENDGRID_FROM_EMAIL || 'noreply@omvirawellness.com',
    subject: 'Reset Your Password - Omvira Wellness',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #ED6E95 0%, #6D4f71 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0;">Omvira Wellness</h1>
          </div>
          <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px;">
            <h2 style="color: #294055; margin-top: 0;">Reset Your Password</h2>
            <p>You requested to reset your password for your Omvira Wellness account.</p>
            <p>Click the button below to reset your password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="display: inline-block; background: #4F8D80; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600;">
                Reset Password
              </a>
            </div>
            <p style="font-size: 14px; color: #666;">Or copy and paste this link into your browser:</p>
            <p style="font-size: 12px; color: #999; word-break: break-all;">${resetUrl}</p>
            <p style="font-size: 14px; color: #666; margin-top: 30px;">
              This link will expire in 1 hour. If you didn't request a password reset, please ignore this email.
            </p>
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
            <p style="font-size: 12px; color: #999; text-align: center;">
              © ${new Date().getFullYear()} Omvira Wellness. All rights reserved.
            </p>
          </div>
        </body>
      </html>
    `
  };

  try {
    await sgMail.send(msg);
    return { success: true };
  } catch (error) {
    console.error('SendGrid error:', error);
    throw new Error('Failed to send password reset email');
  }
}

module.exports = {
  generateVerificationToken,
  sendVerificationEmail,
  sendPasswordResetEmail
};
