import { calculateTripCostAndSavings } from '../utils/costSavingsMath';

/**
 * Intelligent AI Assistant Knowledge Engine ("Nova AI")
 * Answers EV driver questions using live vehicle context, battery SOC, route coordinates, and traffic data.
 */
export const queryNovaAiAssistant = async ({
  prompt,
  vehicle,
  currentSoc,
  currentRangeKm,
  routeData,
  stops,
  totalChargeTimeMins,
  trafficData,
  sourceLocation,
  destLocation
}) => {
  const query = (prompt || '').toLowerCase();
  
  const distanceKm = routeData?.distanceKm || 0;
  const savings = calculateTripCostAndSavings(distanceKm);
  const nextStop = stops?.[0];

  // 1. Can battery reach destination without stopping?
  if (query.includes('reach') || query.includes('enough') || query.includes('without stop') || query.includes('battery')) {
    if (stops && stops.length > 0) {
      return `⚡ Your ${vehicle.name} currently has ${currentSoc}% battery (~${currentRangeKm} km range). For your ${distanceKm} km trip to ${destLocation?.displayName || 'destination'}, Nova AI recommends stopping at ${nextStop?.name || 'charging station'} for ~${nextStop?.chargeTimeMins || 25} minutes to maintain a safe 15% battery buffer.`;
    } else {
      return `✅ Yes! Your ${vehicle.name} has ${currentSoc}% battery (${currentRangeKm} km range), which is sufficient to reach ${destLocation?.displayName || 'your destination'} directly (${distanceKm} km) without any charging stops!`;
    }
  }

  // 2. Nearest Fast Charging Station
  if (query.includes('nearest') || query.includes('charger') || query.includes('station') || query.includes('plug') || query.includes('tata')) {
    if (nextStop) {
      return `🔌 The nearest recommended fast charging station is ${nextStop.name} at Km ${nextStop.distanceFromStartKm}. It features ${nextStop.power || 60} kW DC Fast Charging (${nextStop.connectors?.join(', ') || 'CCS2'}) with amenities including Food Court & Restrooms.`;
    }
    return `🔌 Tata Power & Zeon EV Fast Chargers are available along your highway corridor. Click any station pin on the map to reserve a 30-minute slot!`;
  }

  // 3. Traffic Status
  if (query.includes('traffic') || query.includes('delay') || query.includes('jam') || query.includes('speed')) {
    if (trafficData?.totalDelayMins > 0) {
      return `🚦 Live TomTom Traffic report: There is an estimated +${trafficData.totalDelayMins} minute traffic delay along your corridor. Blue segments indicate smooth flow, while Yellow & Red segments indicate congestion.`;
    }
    return `🔵 Highway traffic is clear and fast-flowing with zero major delays on your route!`;
  }

  // 4. Fuel Savings & Money
  if (query.includes('cost') || query.includes('saving') || query.includes('money') || query.includes('rupees') || query.includes('petrol')) {
    return `💰 For this ${distanceKm} km trip, your EV charging cost is estimated at ₹${savings.evChargingCostINR}. Compared to a petrol car (₹${savings.petrolFuelCostINR}), you are saving ₹${savings.savedCostINR} and reducing ${savings.co2SavedKg} kg of CO₂ carbon emissions!`;
  }

  // 5. Coffee / Rest Stop
  if (query.includes('coffee') || query.includes('food') || query.includes('rest') || query.includes('eat') || query.includes('snack')) {
    return `☕ Nova AI recommends taking a 15-minute coffee break at ${nextStop?.name || 'the next Highway Service Hub'}. Fast charging will replenish your battery while you relax!`;
  }

  // Default AI Smart Response
  return `🤖 Nova AI Assistant Active: Your ${vehicle.name} is navigating a ${distanceKm} km highway corridor to ${destLocation?.displayName || 'destination'}. Your battery is at ${currentSoc}% (${currentRangeKm} km range). How else can I assist your drive today?`;
};
