// API Configuration
// This allows the API URL to be configured via environment variables
// For local development: http://localhost:4000
// For production: Set NEXT_PUBLIC_API_URL in Vercel environment variables

function getApiBaseUrl(): string {
  // Check environment variable first
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // For local development
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:4000';
  }
  
  // For production: Use Render backend URL as fallback
  // This prevents the browser from asking for local network permission
  if (typeof window !== 'undefined') {
    return 'https://omvirawellness-backend.onrender.com';
  }
  
  // Server-side fallback
  return 'https://omvirawellness-backend.onrender.com';
}

export const API_BASE_URL = getApiBaseUrl();
export const API_URL = API_BASE_URL ? `${API_BASE_URL}/api` : '';

