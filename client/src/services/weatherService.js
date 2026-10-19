import axios from 'axios';

/**
 * Open-Meteo Free Global Weather API Service
 * No API key required, 100% free with unlimited open forecast access.
 */

export const getWeatherDescription = (code) => {
  if (code === 0) return { label: 'Clear Sky', icon: '☀️' };
  if (code === 1 || code === 2) return { label: 'Mainly Clear', icon: '🌤️' };
  if (code === 3) return { label: 'Overcast', icon: '☁️' };
  if (code === 45 || code === 48) return { label: 'Foggy Highway', icon: '🌫️' };
  if (code >= 51 && code <= 55) return { label: 'Light Drizzle', icon: '🌦️' };
  if (code >= 61 && code <= 65) return { label: 'Rainy', icon: '🌧️' };
  if (code >= 80 && code <= 82) return { label: 'Heavy Rain Showers', icon: '⛈️' };
  if (code >= 95) return { label: 'Thunderstorm', icon: '⚡' };
  return { label: 'Clear', icon: '☀️' };
};

export const fetchLiveWeather = async (lat, lng) => {
  try {
    const response = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`,
      { timeout: 3500 }
    );

    if (response.data && response.data.current_weather) {
      const cw = response.data.current_weather;
      const temp = Math.round(cw.temperature);
      const wind = Math.round(cw.windspeed);
      const weatherInfo = getWeatherDescription(cw.weathercode);

      // Calculate EV range penalty factor based on real highway weather
      let penaltyPercent = 0;
      if (temp > 38) penaltyPercent += 8; // Heavy AC compressor load in extreme heat
      else if (temp < 12) penaltyPercent += 12; // Cold battery chemistry & heater load
      
      if (wind > 32) penaltyPercent += 4; // Aerodynamic drag from highway headwind
      if (cw.weathercode >= 61 && cw.weathercode <= 82) penaltyPercent += 4; // Wet tire rolling resistance

      return {
        temperature: temp,
        windSpeed: wind,
        weatherCode: cw.weathercode,
        isDay: cw.is_day,
        label: weatherInfo.label,
        icon: weatherInfo.icon,
        penaltyPercent: Math.min(25, penaltyPercent)
      };
    }
  } catch (error) {
    console.warn('Open-Meteo live weather fetch notice:', error.message);
  }

  // Fallback defaults for typical highway condition
  return {
    temperature: 32,
    windSpeed: 12,
    weatherCode: 0,
    isDay: 1,
    label: 'Sunny / Clear',
    icon: '☀️',
    penaltyPercent: 2
  };
};
