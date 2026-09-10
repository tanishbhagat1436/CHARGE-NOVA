import { calculateDistanceKm } from '../services/openChargeMapService';

/**
 * Generate Traffic Signal (🚦) Junctions along the highway polyline
 * @param {Array<[number, number]>} coordinates 
 * @param {Array} steps - OSRM turn maneuvers
 */
export const generateTrafficSignals = (coordinates, steps = []) => {
  if (!coordinates || coordinates.length < 5) return [];

  const signals = [];
  const minSpacingKm = 8; // Highway signal spacing ~8km

  let lastSignalDistKm = -minSpacingKm;
  let cumDistKm = 0;

  // 1. Convert OSRM turn maneuvers into intersection traffic signals
  steps.forEach((step, idx) => {
    if (idx > 0 && step.type !== 'arrive' && step.location) {
      const isMajorJunction = step.type === 'turn' || step.type === 'roundabout' || step.type === 'fork';
      if (isMajorJunction) {
        const signalState = idx % 3 === 0 ? 'RED' : idx % 3 === 1 ? 'GREEN' : 'AMBER';
        signals.push({
          id: `sig-turn-${idx}`,
          lat: step.location[0],
          lng: step.location[1],
          name: `${step.streetName || 'Highway'} Signal Junction`,
          state: signalState,
          durationSec: signalState === 'RED' ? 35 : signalState === 'AMBER' ? 5 : 45,
          type: 'Interchange Signal'
        });
      }
    }
  });

  // 2. Add corridor intersection signals if steps are sparse
  if (signals.length < 3) {
    const chunk = Math.floor(coordinates.length / 4);
    [chunk, chunk * 2, chunk * 3].forEach((idx, i) => {
      if (coordinates[idx]) {
        const signalState = i % 2 === 0 ? 'GREEN' : 'RED';
        signals.push({
          id: `sig-corridor-${i}`,
          lat: coordinates[idx][0],
          lng: coordinates[idx][1],
          name: `Highway Crossing Signal #${i + 1}`,
          state: signalState,
          durationSec: signalState === 'RED' ? 30 : 40,
          type: 'Corridor Traffic Light'
        });
      }
    });
  }

  return signals;
};
