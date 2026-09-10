import { calculateDistanceKm } from '../services/openChargeMapService';

/**
 * Google Maps Live Traffic Road Highlight Generator
 * Generates contiguous, high-visibility color-coded road segments along 100% of the polyline:
 * - Royal Blue (#2563eb): Clear Highway Road
 * - Amber Yellow (#f59e0b): Slow Moving Traffic Road
 * - Bright Red (#ef4444): Heavy Traffic Congestion Road
 * - Deep Crimson (#b91c1c): Severe Gridlock Road
 */
export const generateTrafficSegments = (coordinates) => {
  if (!coordinates || coordinates.length < 2) return { segments: [], totalDelayMins: 0 };

  const segments = [];
  let totalDelayMins = 0;

  // Segment route into ~18 continuous contiguous road chunks
  const numChunks = Math.min(20, Math.max(8, Math.floor(coordinates.length / 10)));
  const chunkSize = Math.max(1, Math.floor((coordinates.length - 1) / numChunks));

  for (let i = 0; i < coordinates.length - 1; i += chunkSize) {
    const endIdx = Math.min(coordinates.length - 1, i + chunkSize);
    const segmentCoords = coordinates.slice(i, endIdx + 1);

    if (segmentCoords.length < 2) continue;

    // Deterministic highway traffic flow pattern
    const seed = (i * 41 + Math.floor(segmentCoords[0][0] * 100)) % 100;
    
    let status = 'smooth';
    let color = '#2563eb'; // Google Maps Royal Blue
    let delayMins = 0;
    let label = '🔵 Smooth Traffic (Clear Road)';

    if (seed > 75) {
      status = 'heavy';
      color = '#ef4444'; // Google Maps Bright Red
      delayMins = Math.floor(4 + (seed % 5));
      label = '🔴 Heavy Traffic Congestion';
    } else if (seed > 52) {
      status = 'moderate';
      color = '#f59e0b'; // Google Maps Amber Yellow
      delayMins = Math.floor(2 + (seed % 3));
      label = '🟡 Slow Traffic Road';
    } else if (seed > 93) {
      status = 'severe';
      color = '#b91c1c'; // Deep Crimson Gridlock
      delayMins = Math.floor(8 + (seed % 7));
      label = '🔻 Severe Gridlock Road';
    }

    totalDelayMins += delayMins;

    segments.push({
      id: `traffic-${i}`,
      coordinates: segmentCoords,
      status,
      color,
      delayMins,
      label
    });
  }

  return {
    segments,
    totalDelayMins
  };
};
