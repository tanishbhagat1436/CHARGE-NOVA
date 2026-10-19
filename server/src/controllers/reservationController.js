import Reservation from '../models/Reservation.js';
import StationReview from '../models/StationReview.js';

/**
 * Book / Reserve a charging slot for 30 minutes
 * POST /api/reservations/book
 */
export const bookSlot = async (req, res) => {
  try {
    const { stationId, stationName, operator, code, powerKW, connector, rateINR, coords } = req.body;

    if (!stationId || !stationName || !coords) {
      return res.status(400).json({ error: 'Missing required reservation fields' });
    }

    // Set 30 minute expiry from now
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    const reservation = new Reservation({
      userId: req.user.userId,
      stationId,
      stationName,
      operator: operator || 'EV Network',
      code: code || ('NOVA-' + Math.floor(1000 + Math.random() * 9000)),
      powerKW: powerKW || 60,
      connector: connector || 'CCS2',
      rateINR: rateINR || 19.5,
      coords,
      expiresAt,
      status: 'Active'
    });

    await reservation.save();

    res.status(201).json({
      message: 'Charging slot reserved successfully for 30 minutes',
      reservation
    });
  } catch (error) {
    console.error('Reservation Error:', error);
    res.status(500).json({ error: error.message || 'Server error reserving slot' });
  }
};

/**
 * Get all active reservations for authenticated user
 * GET /api/reservations/my-bookings
 */
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Reservation.find({ 
      userId: req.user.userId 
    }).sort({ createdAt: -1 });

    // Mark expired bookings
    const now = new Date();
    const updatedBookings = bookings.map(b => {
      const obj = b.toObject();
      if (obj.status === 'Active' && new Date(obj.expiresAt) < now) {
        obj.status = 'Expired';
      }
      return obj;
    });

    res.json({
      count: updatedBookings.length,
      bookings: updatedBookings
    });
  } catch (error) {
    console.error('Fetch Bookings Error:', error);
    res.status(500).json({ error: error.message || 'Server error fetching bookings' });
  }
};

/**
 * Cancel or delete a reservation
 * DELETE /api/reservations/:id
 */
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Reservation.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found or unauthorized' });
    }

    booking.status = 'Cancelled';
    await booking.save();

    res.json({ message: 'Reservation cancelled successfully', bookingId: req.params.id });
  } catch (error) {
    console.error('Cancel Booking Error:', error);
    res.status(500).json({ error: error.message || 'Server error cancelling booking' });
  }
};

/**
 * Get reviews for a specific station
 * GET /api/reservations/stations/:stationId/reviews
 */
export const getStationReviews = async (req, res) => {
  try {
    const reviews = await StationReview.find({ 
      stationId: req.params.stationId 
    }).sort({ createdAt: -1 }).limit(10);

    res.json({ reviews });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Submit community review & gun status
 * POST /api/reservations/stations/:stationId/reviews
 */
export const addStationReview = async (req, res) => {
  try {
    const { userName, rating, testedPowerKW, gunStatus, comment } = req.body;

    if (!comment) {
      return res.status(400).json({ error: 'Comment is required' });
    }

    const review = new StationReview({
      stationId: req.params.stationId,
      userName: userName || req.user?.name || 'EV Driver',
      userId: req.user?.userId || null,
      rating: rating || 5,
      testedPowerKW: testedPowerKW || 60,
      gunStatus: gunStatus || 'Working 100%',
      comment
    });

    await review.save();

    res.status(201).json({ message: 'Driver report saved successfully', review });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
