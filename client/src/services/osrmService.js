import axios from 'axios';

/**
 * Fetch driving route polyline, turn-by-turn navigation instructions, and distance from OSRM
 * @param {[number, number]} startCoords - [lat, lng]
 * @param {[number, number]} endCoords - [lat, lng]
 * @returns {Promise<{coordinates: Array<[number, number]>, distanceKm: number, durationMins: number, steps: Array}>}
 */
export const getRouteFromOSRM = async (startCoords, endCoords) => {
  try {
    // Request full geometry + detailed turn steps from free OSRM API
    const url = `https://router.project-osrm.org/route/v1/driving/${startCoords[1]},${startCoords[0]};${endCoords[1]},${endCoords[0]}?overview=full&geometries=geojson&steps=true`;

    const response = await axios.get(url);

    if (response.data.code !== 'Ok' || !response.data.routes.length) {
      throw new Error('No valid highway route found between selected points.');
    }

    const route = response.data.routes[0];
    
    // Convert GeoJSON [lng, lat] coordinates to Leaflet [lat, lng]
    const coordinates = route.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
    const distanceKm = Math.round((route.distance / 1000) * 10) / 10;
    const durationMins = Math.round(route.duration / 60);

    // Parse OSRM turn-by-turn navigation maneuvers
    const osrmSteps = route.legs[0]?.steps || [];
    let accumulatedDistKm = 0;

    const navigationSteps = osrmSteps.map((step, idx) => {
      const stepDistKm = Math.round((step.distance / 1000) * 10) / 10;
      accumulatedDistKm += stepDistKm;

      const maneuverType = step.maneuver?.type || 'straight';
      const modifier = step.maneuver?.modifier || '';
      const streetName = step.name && step.name.trim() !== '' ? step.name : 'Highway Expressway';

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
        instruction = `Arrive at Destination (${streetName})`;
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
