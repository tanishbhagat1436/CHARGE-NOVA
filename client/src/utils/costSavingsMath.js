/**
 * EV vs Petrol/Diesel Fuel Cost & Carbon Savings Calculator (India Rates)
 */
export const calculateTripCostAndSavings = (distanceKm, totalKwhCharged = 0) => {
  const DISTANCE = Math.max(0, distanceKm || 0);

  // 1. EV Charging Cost Calculation
  // Average Fast DC Charging Rate in India = ₹18 / kWh
  // Base energy used during trip = (Distance / 6 km per kWh)
  const baseEnergyKwh = DISTANCE / 6.2;
  const totalEnergyKwh = totalKwhCharged > 0 ? totalKwhCharged : baseEnergyKwh;
  const evChargingCostINR = Math.round(totalEnergyKwh * 18);

  // 2. Petrol Vehicle Cost Calculation
  // Average Petrol Price in India = ₹102 / Liter
  // Average Petrol Mileage = 14 km / Liter
  const petrolLitersUsed = DISTANCE / 14;
  const petrolFuelCostINR = Math.round(petrolLitersUsed * 102);

  // 3. Money Saved (₹)
  const savedCostINR = Math.max(0, petrolFuelCostINR - evChargingCostINR);

  // 4. CO2 Emissions Saved (kg of Carbon)
  // Petrol cars emit ~0.14 kg CO2 per km
  const co2SavedKg = Math.round((DISTANCE * 0.135) * 10) / 10;

  return {
    evChargingCostINR,
    petrolFuelCostINR,
    savedCostINR,
    co2SavedKg
  };
};
