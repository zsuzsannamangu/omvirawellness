// Favorites API service

const API_BASE_URL = 'http://localhost:4000/api/favorites';

/**
 * Get all favorites for a client
 */
export async function getClientFavorites(clientId) {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/client/${clientId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Not authenticated');
      }
      throw new Error('Failed to fetch favorites');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching favorites:', error);
    throw error;
  }
}

/**
 * Get favorite status for multiple providers
 */
export async function getFavoriteStatus(clientId, providerIds) {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return {};
    }

    const idsString = Array.isArray(providerIds) ? providerIds.join(',') : providerIds;
    const response = await fetch(
      `${API_BASE_URL}/client/${clientId}/status?providerIds=${idsString}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      return {};
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching favorite status:', error);
    return {};
  }
}

/**
 * Add a provider to favorites
 */
export async function addFavorite(clientId, providerId) {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/client/${clientId}/provider/${providerId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Not authenticated');
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to add favorite');
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding favorite:', error);
    throw error;
  }
}

/**
 * Remove a provider from favorites
 */
export async function removeFavorite(clientId, providerId) {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/client/${clientId}/provider/${providerId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Not authenticated');
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to remove favorite');
    }

    return await response.json();
  } catch (error) {
    console.error('Error removing favorite:', error);
    throw error;
  }
}

/**
 * Check if user is authenticated as a client
 */
export function isClientAuthenticated() {
  try {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
      return false;
    }

    const userData = JSON.parse(user);
    return userData.user_type === 'client';
  } catch (error) {
    return false;
  }
}

/**
 * Get current client ID
 */
export function getClientId() {
  try {
    const user = localStorage.getItem('user');
    if (!user) {
      return null;
    }

    const userData = JSON.parse(user);
    if (userData.user_type === 'client') {
      return userData.id;
    }
    return null;
  } catch (error) {
    return null;
  }
}

