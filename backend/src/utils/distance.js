/**
 * Distance calculation utilities
 * Uses Haversine formula for great-circle distance between coordinates
 */

const axios = require('axios');

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {Object} coord1 - { lat: number, lng: number }
 * @param {Object} coord2 - { lat: number, lng: number }
 * @returns {number} Distance in miles
 */
function calculateDistance(coord1, coord2) {
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

function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * Validate and geocode an address using Google Address Validation API (if available)
 * Falls back to Geocoding API, then OpenStreetMap
 * @param {string} address - Street address
 * @param {string} city - City name
 * @param {string} state - State abbreviation
 * @param {string} zipCode - ZIP code (optional)
 * @returns {Object|null} { lat: number, lng: number, validated: boolean } or null if validation fails
 */
async function validateAndGeocodeAddress(address, city, state, zipCode) {
  const fullAddress = [address, city, state, zipCode]
    .filter(Boolean)
    .join(', ');
  
  // Try Google Address Validation API first (most accurate)
  if (process.env.GOOGLE_MAPS_API_KEY) {
    try {
      const validationUrl = `https://addressvalidation.googleapis.com/v1:validateAddress?key=${process.env.GOOGLE_MAPS_API_KEY}`;
      const addressLines = [address].filter(Boolean);
      if (city) addressLines.push(city);
      
      const requestBody = {
        address: {
          addressLines: addressLines,
          locality: city || undefined,
          administrativeArea: state || undefined,
          postalCode: zipCode || undefined,
          regionCode: 'US' // Assuming US addresses
        }
      };
      
      const response = await axios.post(validationUrl, requestBody, {
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data && response.data.result) {
        const result = response.data.result;
        const verdict = result.verdict;
        
        // Check if address is valid
        if (verdict.validationGranularity === 'SUB_PREMISE' || 
            verdict.validationGranularity === 'PREMISE' ||
            verdict.validationGranularity === 'ROUTE' ||
            (verdict.validationGranularity === 'OTHER' && verdict.addressComplete)) {
          
          // Address is valid, get coordinates
          const geocode = result.geocode;
          if (geocode && geocode.location) {
            return {
              lat: geocode.location.latitude,
              lng: geocode.location.longitude
            };
          }
        } else {
          // Address is not valid or incomplete
          console.warn('Address validation failed:', verdict.validationGranularity);
          return null;
        }
      }
    } catch (error) {
      // Address Validation API might not be enabled, fall through to geocoding
      if (error.response && error.response.status === 403) {
        console.warn('Address Validation API not enabled or not accessible. Falling back to Geocoding API.');
      } else {
        console.error('Google Address Validation API error:', error.message);
      }
      // Fall through to geocoding
    }
  }
  
  // Fall back to geocoding (existing implementation)
  return await geocodeAddress(address, city, state, zipCode);
}

/**
 * Geocode an address using OpenStreetMap Nominatim (free, no API key required)
 * Falls back to Google Maps Geocoding API if GOOGLE_MAPS_API_KEY is set
 * @param {string} address - Street address
 * @param {string} city - City name
 * @param {string} state - State abbreviation
 * @param {string} zipCode - ZIP code (optional)
 * @returns {Object|null} { lat: number, lng: number } or null if geocoding fails
 */
async function geocodeAddress(address, city, state, zipCode) {
  const fullAddress = [address, city, state, zipCode]
    .filter(Boolean)
    .join(', ');
  
  // Try Google Maps API first if API key is configured
  if (process.env.GOOGLE_MAPS_API_KEY) {
    try {
      const googleUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(fullAddress)}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
      const response = await axios.get(googleUrl, { timeout: 5000 });
      
      if (response.data.status === 'OK' && response.data.results.length > 0) {
        const location = response.data.results[0].geometry.location;
        return {
          lat: location.lat,
          lng: location.lng
        };
      } else if (response.data.status === 'ZERO_RESULTS') {
        // Address not found - invalid address
        return null;
      }
    } catch (error) {
      console.error('Google Maps geocoding error:', error.message);
      // Fall through to OpenStreetMap
    }
  }
  
  // Use OpenStreetMap Nominatim (free, no API key required)
  try {
    // Rate limit: max 1 request per second
    // Add a small delay to respect rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}&limit=1&addressdetails=1`;
    const response = await axios.get(nominatimUrl, {
      timeout: 5000,
      headers: {
        'User-Agent': 'OmviraWellness/1.0' // Required by Nominatim
      }
    });
    
    if (response.data && response.data.length > 0) {
      const result = response.data[0];
      return {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon)
      };
    } else {
      // Address not found - invalid address
      return null;
    }
  } catch (error) {
    console.error('OpenStreetMap geocoding error:', error.message);
    return null;
  }
}

/**
 * Calculate driving distance between two addresses using Google Maps Distance Matrix API
 * Returns distance in miles, or null if calculation fails
 * Falls back to straight-line distance if Google Maps API is not available
 */
async function calculateDrivingDistance(address1, address2) {
  // If Google Maps API key is available, use Distance Matrix API for actual driving distance
  if (process.env.GOOGLE_MAPS_API_KEY) {
    try {
      const origin = [address1.address, address1.city, address1.state, address1.zipCode]
        .filter(Boolean)
        .join(', ');
      const destination = [address2.address, address2.city, address2.state, address2.zipCode]
        .filter(Boolean)
        .join(', ');
      
      const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&units=imperial&key=${process.env.GOOGLE_MAPS_API_KEY}`;
      
      const response = await axios.get(url, { timeout: 5000 });
      
      if (response.data.status === 'OK' && 
          response.data.rows && 
          response.data.rows[0] && 
          response.data.rows[0].elements && 
          response.data.rows[0].elements[0] &&
          response.data.rows[0].elements[0].status === 'OK') {
        const distanceInMeters = response.data.rows[0].elements[0].distance.value;
        const distanceInMiles = distanceInMeters / 1609.34; // Convert meters to miles
        return Math.round(distanceInMiles * 10) / 10; // Round to 1 decimal place
      } else {
        console.warn('Google Maps Distance Matrix API returned error:', response.data.status);
        // Fall through to straight-line distance calculation
      }
    } catch (error) {
      console.error('Google Maps Distance Matrix API error:', error.message);
      // Fall through to straight-line distance calculation
    }
  }
  
  // Fallback: Calculate straight-line distance using coordinates
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
 * Calculate distance between two addresses
 * Returns distance in miles, or null if geocoding fails
 * @deprecated Use calculateDrivingDistance for more accurate results
 */
async function calculateAddressDistance(address1, address2) {
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

module.exports = {
  calculateDistance,
  geocodeAddress,
  validateAndGeocodeAddress,
  calculateAddressDistance,
  calculateDrivingDistance
};
