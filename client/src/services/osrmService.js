import axios from 'axios';

/**
 * Fetch driving route polyline, turn-by-turn navigation instructions, and distance from OSRM
 * Supports multi-point routes with intermediate waypoints (via stops).
 * @param {[number, number]} startCoords - [lat, lng]
 * @param {[number, number]} endCoords - [lat, lng]
 * @param {Array<[number, number] | {lat: number, lng: number}>} waypoints - Optional intermediate stops
 * @returns {Promise<{coordinates: Array<[number, number]>, distanceKm: number, durationMins: number, steps: Array}>}
 */
export const getRouteFromOSRM = async (startCoords, endCoords, waypoints = []) => {
  try {
    // Normalize all coordinates into [lat, lng]
    const normalizedWaypoints = (waypoints || []).map(wp => {
      if (Array.isArray(wp)) return wp;
      if (wp && typeof wp.lat === 'number' && typeof wp.lng === 'number') return [wp.lat, wp.lng];
      return null;
    }).filter(Boolean);

    const allPoints = [startCoords, ...normalizedWaypoints, endCoords];

    // OSRM expects coordinates in lng,lat format joined by semicolon
    const coordsStr = allPoints.map(pt => `${pt[1]},${pt[0]}`).join(';');
    const url = `https://router.project-osrm.org/route/v1/driving/${coordsStr}?overview=full&geometries=geojson&steps=true`;

    const response = await axios.get(url, { timeout: 6000 });

    if (response.data.code !== 'Ok' || !response.data.routes || !response.data.routes.length) {
      throw new Error('No valid highway route found between selected points.');
    }

    const route = response.data.routes[0];
    
    // Convert GeoJSON [lng, lat] coordinates to Leaflet [lat, lng]
    const coordinates = route.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
    const distanceKm = Math.round((route.distance / 1000) * 10) / 10;
    const durationMins = Math.round(route.duration / 60);

    // Parse OSRM turn-by-turn navigation maneuvers across ALL route legs
    const allOsrmSteps = [];
    if (route.legs && Array.isArray(route.legs)) {
      route.legs.forEach((leg, legIdx) => {
        if (leg.steps && Array.isArray(leg.steps)) {
          allOsrmSteps.push(...leg.steps);
        }
      });
    }

    let accumulatedDistKm = 0;
    const navigationSteps = allOsrmSteps.map((step, idx) => {
      const stepDistKm = Math.round((step.distance / 1000) * 10) / 10;
      accumulatedDistKm += stepDistKm;

      const maneuverType = step.maneuver?.type || 'straight';
      const modifier = step.maneuver?.modifier || '';
      const streetName = step.name && step.name.trim() !== '' ? step.name : 'Highway Corridor';

      let instruction = `Continue on ${streetName}`;
      if (maneuverType === 'depart') {
        instruction = `Head ${modifier || 'forward'} on ${streetName}`;
      } else if (maneuverType === 'turn') {
        instruction = `Turn ${modifier || 'onto'} ${streetName}`;
      } else if (maneuverType === 'new name' || maneuverType === 'fork') {
        instruction = `Keep ${modifier || 'straight'} towards ${streetName}`;
      } else if (maneuverType === 'off ramp' || maneuverType === 'on ramp') {
        instruction = `Take the ramp onto ${streetName}`;
      } else if (maneuverType === 'roundabout' || maneuverType === 'rotary') {
        instruction = `At the roundabout, exit onto ${streetName}`;
      } else if (maneuverType === 'arrive') {
        instruction = `Arrive at stop (${streetName})`;
      }

      return {
        id: idx,
        instruction,
        streetName,
        type: maneuverType,
        modifier: modifier,
        distanceKm: stepDistKm,
        cumulativeKm: Math.round(accumulatedDistKm * 10) / 10,
        location: [step.maneuver.location[1], step.maneuver.location[0]]
      };
    });

    return {
      coordinates,
      distanceKm,
      durationMins,
      steps: navigationSteps
    };
  } catch (error) {
    console.error('OSRM Routing Service Error:', error);
    throw error;
  }
};

