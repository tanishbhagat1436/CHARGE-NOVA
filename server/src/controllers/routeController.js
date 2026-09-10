import mongoose from 'mongoose';
import RouteHistory from '../models/RouteHistory.js';

const inMemoryTrips = [];

export const saveRoute = async (req, res) => {
  try {
    const { title, sourceName, destName, sourceCoords, destCoords, vehicleName, distanceKm, durationMins, stopsCount, chargingCostINR, savedCostINR } = req.body;

    const tripData = {
      userId: req.user?._id || req.user?.id || null,
      title: title || `${sourceName} to ${destName}`,
      sourceName,
      destName,
      sourceCoords,
      destCoords,
      vehicleName,
      distanceKm,
      durationMins,
      stopsCount,
      chargingCostINR,
      savedCostINR,
      createdAt: new Date()
    };

    let savedTrip;

    if (mongoose.connection.readyState === 1) {
      const newTrip = new RouteHistory(tripData);
      savedTrip = await newTrip.save();
    } else {
      savedTrip = { _id: 'mem_trip_' + Date.now(), ...tripData };
      inMemoryTrips.unshift(savedTrip);
    }

    return res.status(201).json({ success: true, message: 'Trip saved successfully', trip: savedTrip });
  } catch (error) {
    console.error('Error saving trip:', error.message);
    return res.status(500).json({ error: 'Failed to save trip to database' });
  }
};

export const getSavedRoutes = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      let query = {};
      if (req.user) {
        query = { userId: req.user._id || req.user.id };
      }
      const history = await RouteHistory.find(query).sort({ createdAt: -1 }).limit(20);
      return res.status(200).json({ success: true, data: history });
    } else {
      let trips = inMemoryTrips;
      if (req.user) {
        trips = inMemoryTrips.filter(t => String(t.userId) === String(req.user._id || req.user.id));
      }
      return res.status(200).json({ success: true, data: trips });
    }
  } catch (error) {
    console.error('Error fetching trips:', error.message);
    return res.status(500).json({ error: 'Failed to fetch saved trips' });
  }
};
