import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { 
  bookSlot, 
  getMyBookings, 
  cancelBooking,
  getStationReviews,
  addStationReview
} from '../controllers/reservationController.js';

const router = express.Router();

// User slot booking routes (Require Auth)
router.post('/book', requireAuth, bookSlot);
router.get('/my-bookings', requireAuth, getMyBookings);
router.delete('/:id', requireAuth, cancelBooking);

// Station community reviews (Public read, optional/authenticated write)
router.get('/stations/:stationId/reviews', getStationReviews);
router.post('/stations/:stationId/reviews', addStationReview);

export default router;
