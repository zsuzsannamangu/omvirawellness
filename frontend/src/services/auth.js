// frontend/src/services/auth.js
import { API_URL } from '../config/api';

const AUTH_API_URL = `${API_URL}/auth`;

/**
 * Login - works for all user types
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} twoFactorToken - Optional 2FA token
 * @param {string} backupCode - Optional backup code
 * @returns {Promise<Object>} User data and token, or 2FA requirement
 */
export async function login(email, password, twoFactorToken = null, backupCode = null) {
  try {
    const response = await fetch(`${AUTH_API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email, 
        password,
        twoFactorToken,
        backupCode
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Convert backend error messages to user-friendly ones
      let errorMessage = data.message || 'Login failed. Please check your credentials.';
      
      if (errorMessage.includes('Invalid') && errorMessage.includes('credentials')) {
        errorMessage = 'The email or password you entered is incorrect. Please try again.';
      } else if (errorMessage.includes('not found') || errorMessage.includes('does not exist')) {
        errorMessage = 'No account found with this email address. Please check your email or sign up.';
      } else if (errorMessage.includes('password') && errorMessage.includes('incorrect')) {
        errorMessage = 'The password you entered is incorrect. Please try again.';
      } else if (errorMessage.includes('pattern') || errorMessage.includes('match')) {
        errorMessage = 'Please check your email address and password, then try again.';
      } else if (!errorMessage.includes('Please') && !errorMessage.includes('try')) {
        // Generic fallback for technical errors
        errorMessage = 'Email or password is incorrect. Please try again.';
      }
      
      const error = new Error(errorMessage);
      error.name = 'ValidationError';
      throw error;
    }

    // Check if 2FA is required
    if (data.requires2FA) {
      return {
        requires2FA: true,
        userId: data.userId,
        message: data.message
      };
    }

    // Check if response has the expected structure
    if (!data.success || !data.data) {
      console.error('Unexpected login response structure:', data);
      throw new Error('Invalid response from server. Please try again.');
    }

    // Store token and user info
    if (data.data.token && data.data.user) {
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
    } else {
      console.error('Missing token or user in response:', data.data);
      throw new Error('Invalid response from server. Missing authentication data.');
    }

    return data.data;
  } catch (error) {
    throw error;
  }
}

/**
 * Register a new client
 */
export async function registerClient(formData) {
  try {
    const response = await fetch(`${AUTH_API_URL}/register/client`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    // Store token and user info
    if (data.success && data.data.token) {
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
    }

    return data.data;
  } catch (error) {
    throw error;
  }
}

/**
 * Register a new provider
 */
export async function registerProvider(formData) {
  try {
    const response = await fetch(`${AUTH_API_URL}/register/provider`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    // Store token and user info
    if (data.success && data.data.token) {
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
    }

    return data.data;
  } catch (error) {
    throw error;
  }
}

/**
 * Check whether an email can be used for provider signup (step 1 — before long form).
 * @returns {Promise<{ success: boolean, available: boolean, message?: string, userType?: string }>}
 */
export async function checkProviderSignupEmail(email) {
  const response = await fetch(`${AUTH_API_URL}/check-email-provider-signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: String(email || '').trim() }),
  });

  let data = {};
  try {
    data = await response.json();
  } catch {
    throw new Error('Could not verify email. Please try again.');
  }

  if (!response.ok) {
    throw new Error(data.message || 'Could not verify email. Please try again.');
  }

  return data;
}

/* SPACES FEATURE - COMMENTED OUT FOR MVP
 * Register a new space owner
export async function registerSpaceOwner(formData) {
  try {
    const response = await fetch(`${AUTH_API_URL}/register/space-owner`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    // Store token and user info
    if (data.success && data.data.token) {
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
    }

    return data.data;
  } catch (error) {
    throw error;
  }
}
*/

/**
 * Logout - clear stored credentials
 */
export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

/**
 * Get current user from localStorage
 */
export function getCurrentUser() {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

/**
 * Get auth token from localStorage
 */
export function getToken() {
  return localStorage.getItem('token');
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated() {
  return !!localStorage.getItem('token');
}

/**
 * Get Authorization header for authenticated requests
 */
export function getAuthHeaders() {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
}

/**
 * Update client profile
 */
export async function updateClientProfile(profileData) {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${AUTH_API_URL}/profile/client`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Update failed');
    }

    return data.data;
  } catch (error) {
    throw error;
  }
}

