import { calculateDistanceKm } from '../services/openChargeMapService';

// Standard Indian Highway Speed Cameras & Radar Trap Locations (NH48, Yamuna Expressway, Mumbai-Pune Expressway)
const SPEED_CAMERAS = [
  { id: 'cam-1', name: 'Yamuna Expressway Km 42 Radar', lat: 28.1800, lng: 77.5200, speedLimit: 100 },
  { id: 'cam-2', name: 'NH48 Neemrana Speed Camera', lat: 27.9900, lng: 76.3800, speedLimit: 80 },
  { id: 'cam-3', name: 'Mumbai-Pune Expressway Lonavala Trap', lat: 18.7500, lng: 73.4000, speedLimit: 80 },
  { id: 'cam-4', name: 'NH44 Delhi-Chandigarh Ambala Radar', lat: 30.3700, lng: 76.7800, speedLimit: 90 },
  { id: 'cam-5', name: 'Bengaluru-Mysuru Expressway Toll Cam', lat: 12.5200, lng: 76.8900, speedLimit: 100 }
];

/**
 * Check if current car position is near a speed camera (within 1.5 km)
 */
export const checkSpeedCameraAlert = (lat, lng) => {
  if (!lat || !lng) return null;

  for (const cam of SPEED_CAMERAS) {
    const distKm = calculateDistanceKm(lat, lng, cam.lat, cam.lng);
    if (distKm <= 1.5) {
      return {
        ...cam,
        distMeters: Math.round(distKm * 1000)
      };
    }
  }

  return null;
};
