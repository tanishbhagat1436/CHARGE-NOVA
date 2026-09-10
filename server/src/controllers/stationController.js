import axios from 'axios';
import Station from '../models/Station.js';

export const getNearbyStations = async (req, res) => {
  try {
    const { lat, lng, distance = 25 } = req.query; // distance in km

    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and Longitude are required' });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    // 1. Try querying local MongoDB cache first using GeoJSON 2dsphere $near
    let localStations = [];
    try {
      localStations = await Station.find({
        location: {
          $near: {
            $geometry: { type: 'Point', coordinates: [longitude, latitude] },
            $maxDistance: distance * 1000 // Convert km to meters
          }
        }
      }).limit(10);
    } catch (err) {
      console.log('MongoDB spatial query fallback to OpenChargeMap API');
    }

    if (localStations.length > 0) {
      return res.status(200).json({ source: 'mongodb_cache', data: localStations });
    }

    // 2. Fallback to OpenChargeMap API for India (CountryCode = IN / 106)
    const ocmUrl = `https://api.openchargemap.io/v3/poi/?output=json&countrycode=IN&latitude=${latitude}&longitude=${longitude}&distance=${distance}&distanceunit=KM&maxresults=15`;
    const response = await axios.get(ocmUrl, {
      headers: {
        'User-Agent': 'ChargeNova-EVPlanner/1.0',
        ...(process.env.OPENCHARGEMAP_API_KEY ? { 'X-API-Key': process.env.OPENCHARGEMAP_API_KEY } : {})
      }
    });

    const formattedStations = response.data.map(poi => ({
      openChargeMapId: poi.ID,
      title: poi.AddressInfo?.Title || 'EV Charging Point',
      operator: poi.OperatorInfo?.Title || 'Independent',
      address: `${poi.AddressInfo?.AddressLine1 || ''}, ${poi.AddressInfo?.Town || ''}`,
      location: {
        type: 'Point',
        coordinates: [poi.AddressInfo?.Longitude, poi.AddressInfo?.Latitude]
      },
      powerKW: poi.Connections?.[0]?.PowerKW || 50,
      connectionTypes: poi.Connections?.map(c => c.ConnectionType?.Title).filter(Boolean) || ['CCS2'],
      isFastCharger: (poi.Connections?.[0]?.PowerKW || 0) >= 30,
      status: poi.StatusType?.Title || 'Operational'
    }));

    return res.status(200).json({ source: 'openchargemap_api', data: formattedStations });
  } catch (error) {
    console.error('Error fetching stations:', error.message);
    return res.status(500).json({ error: 'Failed to fetch charging station data', details: error.message });
  }
};
