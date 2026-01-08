/**
 * User-friendly error messages
 * Following cognitive accessibility principles:
 * - Short sentences
 * - Active voice
 * - Clear instructions
 * - Plain language
 */

export const ERROR_MESSAGES = {
  // Authentication
  AUTH_INVALID_CREDENTIALS: 'Email or password is incorrect. Please try again.',
  AUTH_EMAIL_NOT_FOUND: 'No account found with this email. Try signing up instead?',
  AUTH_ACCOUNT_LOCKED: 'Too many login attempts. Please try again in 15 minutes.',
  AUTH_SESSION_EXPIRED: 'Your session expired. Please log in again.',
  AUTH_REQUIRED: 'Please log in to continue.',
  
  // Password
  PASSWORD_TOO_SHORT: 'Password must be at least 8 characters.',
  PASSWORD_TOO_WEAK: 'Password needs a mix of letters, numbers, and symbols.',
  PASSWORD_MISMATCH: 'Passwords don\'t match. Please try again.',
  
  // Email
  EMAIL_INVALID: 'Please enter a valid email address.',
  EMAIL_ALREADY_EXISTS: 'This email is already in use. Try logging in instead?',
  EMAIL_REQUIRED: 'Please enter your email address.',
  
  // Form validation
  FIELD_REQUIRED: (fieldName: string) => `Please enter your ${fieldName}.`,
  FIELD_TOO_SHORT: (fieldName: string, minLength: number) => 
    `${fieldName} must be at least ${minLength} characters.`,
  FIELD_TOO_LONG: (fieldName: string, maxLength: number) => 
    `${fieldName} can't be longer than ${maxLength} characters.`,
  FIELD_INVALID_FORMAT: (fieldName: string) => 
    `Please check your ${fieldName} and try again.`,
  
  // Network
  NETWORK_ERROR: 'Connection lost. Please check your internet and try again.',
  SERVER_ERROR: 'Something went wrong. Please try again in a moment.',
  REQUEST_TIMEOUT: 'Request took too long. Please try again.',
  
  // Booking
  BOOKING_UNAVAILABLE: 'This time slot is no longer available. Please choose another.',
  BOOKING_OVERLAP: 'You already have a booking at this time.',
  BOOKING_TOO_SOON: 'Bookings must be made at least 24 hours in advance.',
  BOOKING_PAST_DATE: 'Please select a future date and time.',
  
  // Payment
  PAYMENT_FAILED: 'Payment didn\'t go through. Please check your payment method.',
  PAYMENT_DECLINED: 'Your card was declined. Try a different payment method?',
  PAYMENT_REQUIRED: 'Please add a payment method to continue.',
  
  // Upload
  FILE_TOO_LARGE: (maxSize: string) => `File is too large. Maximum size is ${maxSize}.`,
  FILE_INVALID_TYPE: (allowedTypes: string) => `Please upload a ${allowedTypes} file.`,
  UPLOAD_FAILED: 'Upload failed. Please try again.',
  
  // Generic
  SOMETHING_WRONG: 'Something went wrong. Please try again.',
  TRY_AGAIN_LATER: 'Service temporarily unavailable. Please try again later.',
  CONTACT_SUPPORT: 'Need help? Contact us at support@omvirawellness.com',
};

export const SUCCESS_MESSAGES = {
  // Authentication
  LOGIN_SUCCESS: 'Welcome back!',
  LOGOUT_SUCCESS: 'You\'ve been logged out.',
  SIGNUP_SUCCESS: 'Account created! Welcome to Omvira.',
  PASSWORD_RESET_SENT: 'Check your email for a reset link.',
  PASSWORD_CHANGED: 'Password updated successfully.',
  
  // Profile
  PROFILE_UPDATED: 'Profile saved!',
  PHOTO_UPLOADED: 'Photo uploaded successfully.',
  AVAILABILITY_UPDATED: 'Availability saved.',
  
  // Booking
  BOOKING_CONFIRMED: 'Booking confirmed! Check your email for details.',
  BOOKING_CANCELLED: 'Booking cancelled.',
  
  // General
  CHANGES_SAVED: 'Changes saved.',
  MESSAGE_SENT: 'Message sent!',
  FAVORITE_ADDED: 'Added to favorites.',
  FAVORITE_REMOVED: 'Removed from favorites.',
};

/**
 * Convert technical error codes to user-friendly messages
 */
export const formatErrorMessage = (error: any): string => {
  if (typeof error === 'string') {
    // Check if it's already a user-friendly message
    if (error.includes('Please') || error.includes('must') || error.includes('can\'t')) {
      return error;
    }
    
    // Common error patterns
    if (error.includes('401') || error.includes('unauthorized')) {
      return ERROR_MESSAGES.AUTH_REQUIRED;
    }
    if (error.includes('403') || error.includes('forbidden')) {
      return ERROR_MESSAGES.AUTH_SESSION_EXPIRED;
    }
    if (error.includes('404') || error.includes('not found')) {
      return ERROR_MESSAGES.AUTH_EMAIL_NOT_FOUND;
    }
    if (error.includes('500') || error.includes('server')) {
      return ERROR_MESSAGES.SERVER_ERROR;
    }
    if (error.includes('network') || error.includes('connection')) {
      return ERROR_MESSAGES.NETWORK_ERROR;
    }
  }
  
  // Check error object properties
  if (error?.message) {
    return formatErrorMessage(error.message);
  }
  
  if (error?.response?.data?.message) {
    return formatErrorMessage(error.response.data.message);
  }
  
  // Fallback
  return ERROR_MESSAGES.SOMETHING_WRONG;
};



