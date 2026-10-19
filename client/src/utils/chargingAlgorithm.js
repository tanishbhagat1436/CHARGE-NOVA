import { calculateDistanceKm, fetchStationsNearPoint } from '../services/openChargeMapService';

/**
 * Smart EV Charging Halt Optimizer
 * Calculates required charging halts snapped 100% STRICTLY onto the highway polyline coordinates.
 */
export const calculateSmartHalts = async ({
  coordinates,
  totalDistanceKm,
  vehicle,
  currentRangeKm,
  minSocBufferPercent,
  preferredPlug = 'CCS2',
  preferredNetwork = 'All Networks',
  acMode = 'Normal AC',
  ambientTemp = 30
}) => {
  if (!coordinates || coordinates.length === 0) {
    return { recommendedStops: [], batteryProfile: [], totalChargeTimeMins: 0 };
  }

  let climatePenaltyFactor = 1.0;
  if (acMode === 'Max AC') climatePenaltyFactor -= 0.12;
  if (ambientTemp > 38) climatePenaltyFactor -= 0.08;

  const effectiveMaxRangeKm = vehicle.range * climatePenaltyFactor;
  const usableBatteryCapKwh = vehicle.battery;

  let cumDistance = 0;
  const pathWithDist = coordinates.map((pt, idx) => {
    if (idx === 0) return { lat: pt[0], lng: pt[1], distFromStart: 0 };
    const prev = coordinates[idx - 1];
    const segment = calculateDistanceKm(prev[0], prev[1], pt[0], pt[1]);
    cumDistance += segment;
    return { lat: pt[0], lng: pt[1], distFromStart: cumDistance };
  });

  const recommendedStops = [];
  const batteryProfile = [];

  let currentDist = 0;
  let remainingRangeKm = currentRangeKm * climatePenaltyFactor;
  const minRangeBufferKm = (minSocBufferPercent / 100) * effectiveMaxRangeKm;

  for (let i = 0; i < pathWithDist.length; i++) {
    const point = pathWithDist[i];
    const distDelta = i === 0 ? 0 : point.distFromStart - pathWithDist[i - 1].distFromStart;

    remainingRangeKm -= distDelta;
    currentDist = point.distFromStart;

    const currentSocPercent = Math.max(0, Math.round((remainingRangeKm / effectiveMaxRangeKm) * 100));
    
    batteryProfile.push({
      distance: Math.round(currentDist),
      soc: currentSocPercent,
      lat: point.lat,
      lng: point.lng
    });

    // Check if battery reaches reserve threshold
    if (remainingRangeKm <= minRangeBufferKm && currentDist < totalDistanceKm - 15) {
      const nearby = await fetchStationsNearPoint(point.lat, point.lng, 15, preferredNetwork);
      const selectedStation = nearby[0];


      const arrivalSocPercent = Math.max(5, currentSocPercent);
      const targetChargeSocPercent = 85;
      const socToGainPercent = Math.max(20, targetChargeSocPercent - arrivalSocPercent);
      const energyNeededKwh = (socToGainPercent / 100) * usableBatteryCapKwh;
      
      // REALISTIC LITHIUM-ION CC/CV FAST CHARGING CURVE:
      // Phase 1 (Constant Current, up to 70% SoC): Accepts ~92% of charger rated power
      // Phase 2 (Constant Voltage Taper, 70% to 85% SoC): Power tapers to ~65% of rated power
      const chargePowerKw = selectedStation?.power || 60;
      
      let ccKwh = 0;
      let cvKwh = 0;
      
      if (arrivalSocPercent < 70) {
        const ccSocGain = Math.min(70, targetChargeSocPercent) - arrivalSocPercent;
        ccKwh = (ccSocGain / 100) * usableBatteryCapKwh;
        if (targetChargeSocPercent > 70) {
          const cvSocGain = targetChargeSocPercent - 70;
          cvKwh = (cvSocGain / 100) * usableBatteryCapKwh;
        }
      } else {
        const cvSocGain = Math.max(0, targetChargeSocPercent - arrivalSocPercent);
        cvKwh = (cvSocGain / 100) * usableBatteryCapKwh;
      }

      const ccHours = ccKwh / (chargePowerKw * 0.92);
      const cvHours = cvKwh / (chargePowerKw * 0.65);
      const handshakeOverheadMins = 4;
      const chargeTimeMins = Math.max(12, Math.round((ccHours + cvHours) * 60) + handshakeOverheadMins);

      // STRICT POLYLINE SNAPPING: Set lat & lng directly to point.lat and point.lng on the highway line!
      recommendedStops.push({
        ...selectedStation,
        lat: point.lat, // EXACT HIGHWAY ROUTE LATITUDE
        lng: point.lng, // EXACT HIGHWAY ROUTE LONGITUDE
        distanceFromStartKm: Math.round(currentDist),
        arrivalSocPercent,
        departureSocPercent: targetChargeSocPercent,
        energyAddedKwh: Math.round(energyNeededKwh * 10) / 10,
        chargeTimeMins
      });

      remainingRangeKm = (targetChargeSocPercent / 100) * effectiveMaxRangeKm;
    }
  }

  const totalChargeTimeMins = recommendedStops.reduce((acc, st) => acc + st.chargeTimeMins, 0);

  return {
    recommendedStops,
    batteryProfile,
    totalChargeTimeMins
  };
};
