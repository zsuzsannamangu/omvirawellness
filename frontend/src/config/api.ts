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
  
  // For production without backend (portfolio mode)
  // Return empty string - API calls will fail gracefully
  return '';
}

export const API_BASE_URL = getApiBaseUrl();
export const API_URL = API_BASE_URL ? `${API_BASE_URL}/api` : '';

