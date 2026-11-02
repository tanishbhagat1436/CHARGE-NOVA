import axios from 'axios';

// High-Performance In-Memory Geocoding Cache to avoid Nominatim rate limits
const geocodeCache = new Map();
const reverseCache = new Map();

/**
 * Geocode location query using Nominatim with in-memory caching and resilient fallbacks
 * @param {string} query 
 * @returns {Promise<Array<{lat: number, lng: number, displayName: string, city: string, state: string}>>}
 */
export const searchLocation = async (query) => {
  if (!query || query.trim().length < 2) return [];

  const cleanQuery = query.trim().toLowerCase();
  if (geocodeCache.has(cleanQuery)) {
    return geocodeCache.get(cleanQuery);
  }

  try {
    const isIndiaSpecific = !cleanQuery.includes(',') && !cleanQuery.includes('usa') && !cleanQuery.includes('uk') && !cleanQuery.includes('dubai');
    const searchParam = isIndiaSpecific ? `${query}, India` : query;

    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: searchParam,
        format: 'json',
        addressdetails: 1,
        limit: 5,
        ...(isIndiaSpecific ? { countrycodes: 'in' } : {})
      },
      timeout: 4500
    });

    let data = response.data;

    // Fallback to global query if country-scoped query returned nothing
    if ((!data || data.length === 0) && isIndiaSpecific) {
      const fallbackRes = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: query,
          format: 'json',
          addressdetails: 1,
          limit: 5
        },
        timeout: 4500
      });
      data = fallbackRes.data || [];
    }

    const formatted = (data || []).map((item) => ({
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      displayName: item.display_name,
      city: item.address?.city || item.address?.town || item.address?.state_district || item.display_name.split(',')[0],
      state: item.address?.state || ''
    }));

    if (geocodeCache.size > 150) geocodeCache.clear();
    geocodeCache.set(cleanQuery, formatted);

    return formatted;
  } catch (error) {
    console.warn('Nominatim Geocoding notice:', error.message);
    return [];
  }
};

/**
 * Reverse geocode coordinates [lat, lng] into a human-readable location name
 * @param {number} lat 
 * @param {number} lng 
 * @returns {Promise<{lat: number, lng: number, displayName: string, city: string}>}
 */
export const reverseGeocode = async (lat, lng) => {
  const cacheKey = `${lat.toFixed(4)},${lng.toFixed(4)}`;
  if (reverseCache.has(cacheKey)) {
    return reverseCache.get(cacheKey);
  }

  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
      params: {
        lat,
        lon: lng,
        format: 'json',
        addressdetails: 1
      },
      timeout: 4500
    });

    const addr = response.data?.address;
    const locationName = addr?.city || addr?.town || addr?.suburb || addr?.county || addr?.state || 'Your Current Location';

    const result = {
      lat,
      lng,
      displayName: response.data?.display_name || `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
      city: locationName
    };

    if (reverseCache.size > 150) reverseCache.clear();
    reverseCache.set(cacheKey, result);

    return result;
  } catch (error) {
    console.warn('Reverse Geocoding Error:', error.message);
    return {
      lat,
      lng,
      displayName: `Current Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
      city: 'Current Location'
    };
  }
};

/**
 * Retrieves the best available live user location:
 * 1. Fast browser HTML5 Geolocation (low-accuracy first, which is instant on laptops/Wi-Fi)
 * 2. High-accuracy fallback
 * 3. IP-based Geolocation fallback (BigDataCloud reverse geocode client)
 * 4. Safe default (New Delhi)
 * @returns {Promise<{lat: number, lng: number, displayName: string, city: string}>}
 */
export const getBestUserLocation = async () => {
  const getBrowserCoords = (highAccuracy) => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) return reject(new Error('Geolocation unsupported'));
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => reject(err),
        { enableHighAccuracy: highAccuracy, timeout: highAccuracy ? 5000 : 4000, maximumAge: 60000 }
      );
    });
  };

  try {
    let coords;
    try {
      coords = await getBrowserCoords(false);
    } catch (e1) {
      try {
        coords = await getBrowserCoords(true);
      } catch (e2) {}
    }

    if (coords) {
      return await reverseGeocode(coords.lat, coords.lng);
    }

    // IP-based Geolocation Fallback
    const ipResponse = await axios.get('https://api.bigdatacloud.net/data/reverse-geocode-client', { timeout: 4000 });
    if (ipResponse.data && ipResponse.data.latitude && ipResponse.data.longitude) {
      const { latitude, longitude, city, principalSubdivision } = ipResponse.data;
      const locationName = city || principalSubdivision || 'Current Location';
      return {
        lat: latitude,
        lng: longitude,
        displayName: `${locationName}, India`,
        city: locationName
      };
    }
  } catch (ipError) {
    console.warn('Geolocation fallback notice:', ipError?.message);
  }

  // Default fallback if all layers fail
  return {
    lat: 28.6139,
    lng: 77.2090,
    displayName: 'New Delhi',
    city: 'New Delhi'
  };
};
