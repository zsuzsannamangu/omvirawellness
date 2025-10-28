// frontend/src/services/auth.js
const API_URL = 'http://localhost:4000/api/auth';

/**
 * Login - works for all user types
 */
export async function login(email, password) {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
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
 * Register a new client
 */
export async function registerClient(formData) {
  try {
    const response = await fetch(`${API_URL}/register/client`, {
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
    const response = await fetch(`${API_URL}/register/provider`, {
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
 * Register a new space owner
 */
export async function registerSpaceOwner(formData) {
  try {
    const response = await fetch(`${API_URL}/register/space-owner`, {
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

    const response = await fetch(`${API_URL}/profile/client`, {
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

