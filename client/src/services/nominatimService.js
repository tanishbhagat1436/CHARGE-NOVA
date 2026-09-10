import axios from 'axios';

/**
 * Geocode location query for Indian cities, towns, and highways using Nominatim (Free OpenStreetMap API)
 * @param {string} query 
 * @returns {Promise<Array<{lat: number, lng: number, displayName: string}>>}
 */
export const searchLocation = async (query) => {
  if (!query || query.trim().length < 2) return [];

  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: `${query}, India`,
        format: 'json',
        addressdetails: 1,
        limit: 5,
        countrycodes: 'in'
      },
      headers: {
        'Accept-Language': 'en-US,en;q=0.9',
        'User-Agent': 'ChargeNova-EVTripPlanner/1.0'
      }
    });

    return response.data.map((item) => ({
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      displayName: item.display_name,
      city: item.address?.city || item.address?.town || item.address?.state_district || item.display_name.split(',')[0],
      state: item.address?.state || ''
    }));
  } catch (error) {
    console.error('Nominatim Geocoding Error:', error);
    return [];
  }
};

/**
 * Reverse geocode user's live GPS coordinates [lat, lng] into a human-readable location name
 * @param {number} lat 
 * @param {number} lng 
 * @returns {Promise<{lat: number, lng: number, displayName: string}>}
 */
export const reverseGeocode = async (lat, lng) => {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
      params: {
        lat,
        lon: lng,
        format: 'json',
        addressdetails: 1
      },
      headers: {
        'User-Agent': 'ChargeNova-EVTripPlanner/1.0'
      }
    });

    const addr = response.data?.address;
    const locationName = addr?.city || addr?.town || addr?.suburb || addr?.county || addr?.state || 'Your Current Location';

    return {
      lat,
      lng,
      displayName: response.data?.display_name || `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
      city: locationName
    };
  } catch (error) {
    console.error('Reverse Geocoding Error:', error);
    return {
      lat,
      lng,
      displayName: `Current Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
      city: 'Current Location'
    };
  }
};

/**
 * Retrieves the best available live user location using a 3-stage fallback:
 * 1. High-accuracy HTML5 browser Geolocation (5s timeout)
 * 2. Low-accuracy HTML5 browser Geolocation (8s timeout)
 * 3. Free IP-based Geolocation (bigdatacloud fallback)
 * @returns {Promise<{lat: number, lng: number, displayName: string, city: string}>}
 */
export const getBestUserLocation = async () => {
  const getBrowserCoords = (highAccuracy) => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) return reject(new Error('Geolocation unsupported'));
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => reject(err),
        { enableHighAccuracy: highAccuracy, timeout: highAccuracy ? 5000 : 8000, maximumAge: 60000 }
      );
    });
  };

  try {
    let coords;
    try {
      coords = await getBrowserCoords(true);
    } catch (e1) {
      console.warn('High-accuracy GPS failed/timed out, trying low-accuracy...', e1?.message);
      try {
        coords = await getBrowserCoords(false);
      } catch (e2) {
        console.warn('Low-accuracy GPS failed/blocked, attempting IP geolocation...', e2?.message);
      }
    }

    if (coords) {
      return await reverseGeocode(coords.lat, coords.lng);
    }

    // IP-based Geolocation Fallback
    const ipResponse = await axios.get('https://api.bigdatacloud.net/data/reverse-geocode-client', { timeout: 5000 });
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
    console.error('IP Geolocation error:', ipError);
  }

  // Default fallback if all layers fail
  return {
    lat: 28.6139,
    lng: 77.2090,
    displayName: 'New Delhi',
    city: 'New Delhi'
  };
};

