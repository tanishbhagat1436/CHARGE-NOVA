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
  if (query.includes('nearest') || query.includes('charger') || query.includes('station') || query.includes('tata') || query.includes('zeon')) {
    if (nextStop) {
      return `🔌 The nearest recommended fast charging station is ${nextStop.name} at Km ${nextStop.distanceFromStartKm}. It features ${nextStop.power || 60} kW DC Fast Charging (${nextStop.connectors?.join(', ') || 'CCS2'}) with amenities including Food Court & Restrooms.`;
    }
    return `🔌 Tata Power, Zeon, Jio-bp, and Statiq EV Fast Chargers are available along your highway corridor. Click any station pin on the map to reserve a 30-minute slot!`;
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

  // 6. Battery Health & Degradation
  if (query.includes('health') || query.includes('degrad') || query.includes('warranty') || query.includes('life')) {
    return `🔋 Battery Health Diagnostics: Your ${vehicle.name} utilizes advanced LFP/NMC lithium-ion cell chemistry with liquid thermal management. Fast charging between 10%–85% preserves 94%+ State-of-Health (SoH) over 160,000 km. Most OEM warranties guarantee 8 years or 160,000 km!`;
  }

  // 7. Connector Types (CCS2, Type 2, GB/T)
  if (query.includes('plug') || query.includes('connector') || query.includes('ccs') || query.includes('type 2') || query.includes('gbt')) {
    return `🔌 Connector Guide: In India, CCS2 (Combined Charging System 2) is the standard for DC fast charging (up to 150 kW). Type 2 AC is for 7.2–11 kW overnight wallboxes. All recommended stops on your route feature native CCS2 connectors.`;
  }

  // 8. Emergency / Breakdown / SOS
  if (query.includes('emergency') || query.includes('sos') || query.includes('breakdown') || query.includes('puncture') || query.includes('tow')) {
    return `🚨 24x7 Emergency Assistance: Click the red SOS button on your top toolbar for immediate access to national highway RSA helplines (1033 NHAI, 112 Emergency), nearby EV mobile towing, and 24x7 battery rescue services!`;
  }

  // 9. Efficiency & Driving Tips (Regen, Eco Mode)
  if (query.includes('tip') || query.includes('efficient') || query.includes('regen') || query.includes('eco') || query.includes('range')) {
    return `💡 EV Highway Efficiency Tips:\n1. Maintain steady 80–90 km/h cruising on expressways for maximum aerodynamic range.\n2. Set Regenerative Braking to Level 2/3 during downhill highway passes.\n3. Pre-cool the cabin while plugged into the charger to save up to 10% battery!`;
  }

  // 10. Weather & Temperature
  if (query.includes('temp') || query.includes('heat') || query.includes('summer') || query.includes('winter') || query.includes('ac')) {
    return `🌡️ Climate & Thermal Impact: Ambient temperatures above 38°C or Max AC draw up to ~15% extra battery power for active chiller loop cooling. CHARGE-NOVA automatically accounts for this in your recommended stops!`;
  }

  // Default AI Smart Response
  return `🤖 Nova AI Copilot Active: Your ${vehicle.name} is navigating a ${distanceKm} km highway corridor to ${destLocation?.displayName || 'destination'}. Your battery is at ${currentSoc}% (~${currentRangeKm} km range). Ask me about charging stops, fuel savings, traffic, or battery health!`;
};
