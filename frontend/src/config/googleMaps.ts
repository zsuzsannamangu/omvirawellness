// Google Maps API Configuration
// For frontend use, you need a separate API key restricted to:
// - Places API (for autocomplete)
// - Your domain (HTTP referrer restrictions)
//
// Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in Vercel environment variables

export const getGoogleMapsApiKey = (): string | null => {
  // Check for frontend-specific Google Maps API key
  // This should be a different key than the backend one, restricted to your domain
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  }
  
  // No API key configured - autocomplete will be disabled
  // Users can still manually enter addresses
  if (typeof window !== 'undefined') {
    console.warn('Google Maps API key not configured. Address autocomplete will be disabled. Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in Vercel environment variables.');
  }
  
  return null;
};

export const isGoogleMapsLoaded = (): boolean => {
  return typeof window !== 'undefined' && 
         typeof (window as any).google !== 'undefined' && 
         typeof (window as any).google.maps !== 'undefined' &&
         typeof (window as any).google.maps.places !== 'undefined';
};
