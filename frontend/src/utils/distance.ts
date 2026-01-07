/**
 * Calculate distance between two addresses using coordinates
 * Uses Haversine formula for great-circle distance
 */

interface Coordinates {
  lat: number;
  lng: number;
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in miles
 */
export function calculateDistance(
  coord1: Coordinates,
  coord2: Coordinates
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = toRadians(coord2.lat - coord1.lat);
  const dLon = toRadians(coord2.lng - coord1.lng);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(coord1.lat)) *
      Math.cos(toRadians(coord2.lat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Geocode an address to get coordinates
 * This is a placeholder - you'll need to integrate with a geocoding service
 * Options: Google Maps Geocoding API, Mapbox Geocoding API, etc.
 */
export async function geocodeAddress(
  address: string,
  city: string,
  state: string,
  zipCode?: string
): Promise<Coordinates | null> {
  // Build full address string
  const fullAddress = [
    address,
    city,
    state,
    zipCode
  ].filter(Boolean).join(', ');
  
  try {
    // TODO: Replace with actual geocoding service
    // Example using a free service or your preferred geocoding API
    // For now, return null to indicate geocoding is not yet implemented
    // You can use:
    // - Google Maps Geocoding API
    // - Mapbox Geocoding API
    // - OpenStreetMap Nominatim (free but rate-limited)
    
    console.warn('Geocoding not yet implemented. Please integrate a geocoding service.');
    return null;
  } catch (error) {
    console.error('Error geocoding address:', error);
    return null;
  }
}

/**
 * Calculate distance between two addresses
 * Returns distance in miles, or null if geocoding fails
 */
export async function calculateAddressDistance(
  address1: { address: string; city: string; state: string; zipCode?: string },
  address2: { address: string; city: string; state: string; zipCode?: string }
): Promise<number | null> {
  const coord1 = await geocodeAddress(
    address1.address,
    address1.city,
    address1.state,
    address1.zipCode
  );
  
  const coord2 = await geocodeAddress(
    address2.address,
    address2.city,
    address2.state,
    address2.zipCode
  );
  
  if (!coord1 || !coord2) {
    return null;
  }
  
  return calculateDistance(coord1, coord2);
}

/**
 * Simple distance estimation using city/state (less accurate but works without geocoding)
 * This is a fallback that estimates distance based on city/state matching
 * Returns null if cities don't match (can't estimate)
 */
export function estimateDistanceByCity(
  city1: string,
  state1: string,
  city2: string,
  state2: string
): number | null {
  // If same city and state, distance is 0
  if (city1.toLowerCase() === city2.toLowerCase() && 
      state1.toLowerCase() === state2.toLowerCase()) {
    return 0;
  }
  
  // If different states, can't estimate accurately
  if (state1.toLowerCase() !== state2.toLowerCase()) {
    return null;
  }
  
  // Same state, different cities - rough estimate
  // This is a very rough approximation
  // In a real implementation, you'd want a city-to-city distance lookup table
  return null; // Can't estimate without coordinates
}
