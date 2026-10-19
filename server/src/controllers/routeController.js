import mongoose from 'mongoose';
import RouteHistory from '../models/RouteHistory.js';

const inMemoryTrips = [];

// @route   POST /api/routes / POST /api/routes/save
// @desc    Save a planned EV trip under the authenticated user's account
export const saveRoute = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required. Please log in or sign up to save trips to your account.'
      });
    }

    const currentUserId = req.user._id || req.user.id;
    const { 
      title, 
      sourceName, 
      destName, 
      sourceCoords, 
      destCoords, 
      vehicleName, 
      distanceKm, 
      durationMins, 
      stopsCount, 
      chargingCostINR, 
      savedCostINR 
    } = req.body;

    const tripData = {
      userId: currentUserId,
      title: title || `${sourceName} to ${destName}`,
      sourceName,
      destName,
      sourceCoords,
      destCoords,
      vehicleName: vehicleName || 'Tata Nexon EV Max',
      distanceKm: Number(distanceKm) || 0,
      durationMins: Number(durationMins) || 0,
      stopsCount: Number(stopsCount) || 0,
      chargingCostINR: Number(chargingCostINR) || 0,
      savedCostINR: Number(savedCostINR) || 0,
      createdAt: new Date()
    };

    let savedTrip;

    if (mongoose.connection.readyState === 1) {
      // If currentUserId is valid ObjectId, assign; otherwise fallback to string representation
      const mongoTripData = {
        ...tripData,
        userId: mongoose.Types.ObjectId.isValid(currentUserId) ? currentUserId : undefined
      };
      const newTrip = new RouteHistory(mongoTripData);
      savedTrip = await newTrip.save();
    } else {
      savedTrip = { _id: 'mem_trip_' + Date.now(), ...tripData };
      inMemoryTrips.unshift(savedTrip);
    }

    return res.status(201).json({ 
      success: true, 
      message: 'Trip saved successfully to your account', 
      trip: savedTrip 
    });
  } catch (error) {
    console.error('Error saving trip:', error.message);
    return res.status(500).json({ success: false, error: 'Failed to save trip to database' });
  }
};

// @route   GET /api/routes / GET /api/routes/history
// @desc    Get saved trips strictly belonging to the currently logged in user
export const getSavedRoutes = async (req, res) => {
  try {
    // STRICT PER-USER DATA ISOLATION:
    // If not authenticated, return an empty array — never leak other users' trips!
    if (!req.user) {
      return res.status(200).json({ 
        success: true, 
        data: [],
        message: 'No active authenticated user. Saved trips are scoped per user account.' 
      });
    }

    const currentUserId = String(req.user._id || req.user.id);

    if (mongoose.connection.readyState === 1) {
      const query = mongoose.Types.ObjectId.isValid(currentUserId) 
        ? { userId: currentUserId } 
        : { userId: currentUserId };

      const history = await RouteHistory.find(query).sort({ createdAt: -1 }).limit(50);
      return res.status(200).json({ success: true, data: history });
    } else {
      // In-memory fallback: strictly filter by current user's ID
      const userTrips = inMemoryTrips.filter(t => String(t.userId) === currentUserId);
      return res.status(200).json({ success: true, data: userTrips });
    }
  } catch (error) {
    console.error('Error fetching trips:', error.message);
    return res.status(500).json({ success: false, error: 'Failed to fetch saved trips' });
  }
};

// @route   DELETE /api/routes/:id
// @desc    Delete a saved trip owned by the authenticated user
export const deleteRoute = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Authentication required.' });
    }

    const { id } = req.params;
    const currentUserId = String(req.user._id || req.user.id);

    if (mongoose.connection.readyState === 1) {
      const trip = await RouteHistory.findById(id);
      if (!trip) {
        return res.status(404).json({ success: false, error: 'Trip not found.' });
      }
      if (String(trip.userId) !== currentUserId) {
        return res.status(403).json({ success: false, error: 'Unauthorized: you can only delete your own trips.' });
      }
      await RouteHistory.findByIdAndDelete(id);
      return res.status(200).json({ success: true, message: 'Trip deleted successfully.' });
    } else {
      const index = inMemoryTrips.findIndex(t => String(t._id) === String(id) && String(t.userId) === currentUserId);
      if (index === -1) {
        return res.status(404).json({ success: false, error: 'Trip not found or unauthorized.' });
      }
      inMemoryTrips.splice(index, 1);
      return res.status(200).json({ success: true, message: 'Trip deleted successfully.' });
    }
  } catch (error) {
    console.error('Error deleting trip:', error.message);
    return res.status(500).json({ success: false, error: 'Failed to delete trip' });
  }
};

