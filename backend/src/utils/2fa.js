const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

/**
 * Generate a secret for TOTP 2FA
 * @param {string} email - User's email for the QR code label
 * @returns {Object} { secret, otpauthUrl }
 */
function generateSecret(email, serviceName = 'Omvira Wellness') {
  const secret = speakeasy.generateSecret({
    name: `${serviceName} (${email})`,
    issuer: serviceName,
    length: 32
  });

  return {
    secret: secret.base32,
    otpauthUrl: secret.otpauth_url
  };
}

/**
 * Generate QR code data URL from otpauth URL
 * @param {string} otpauthUrl - The otpauth URL
 * @returns {Promise<string>} Data URL of the QR code image
 */
async function generateQRCode(otpauthUrl) {
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl);
    return qrCodeDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
}

/**
 * Verify a TOTP token
 * @param {string} token - The 6-digit token from the authenticator app
 * @param {string} secret - The user's secret (base32 encoded)
 * @returns {boolean} True if token is valid
 */
function verifyToken(token, secret) {
  try {
    return speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: token,
      window: 2 // Allow 2 time steps (60 seconds) of clock skew
    });
  } catch (error) {
    console.error('Error verifying token:', error);
    return false;
  }
}

/**
 * Generate backup codes
 * @param {number} count - Number of backup codes to generate (default: 10)
 * @returns {Array<string>} Array of backup codes
 */
function generateBackupCodes(count = 10) {
  const codes = [];
  for (let i = 0; i < count; i++) {
    // Generate 8-character alphanumeric code
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    codes.push(code);
  }
  return codes;
}

/**
 * Hash a backup code for storage
 * @param {string} code - The backup code
 * @returns {Promise<string>} Hashed code
 */
async function hashBackupCode(code) {
  const bcrypt = require('bcrypt');
  return await bcrypt.hash(code, 10);
}

/**
 * Verify a backup code
 * @param {string} code - The backup code to verify
 * @param {string} hashedCode - The hashed backup code from database
 * @returns {Promise<boolean>} True if code matches
 */
async function verifyBackupCode(code, hashedCode) {
  const bcrypt = require('bcrypt');
  return await bcrypt.compare(code, hashedCode);
}

module.exports = {
  generateSecret,
  generateQRCode,
  verifyToken,
  generateBackupCodes,
  hashBackupCode,
  verifyBackupCode
};

