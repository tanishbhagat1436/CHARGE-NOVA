import express from 'express';
import { getNearbyStations } from '../controllers/stationController.js';

const router = express.Router();

// GET /api/stations/nearby?lat=...&lng=...&distance=...
router.get('/nearby', getNearbyStations);

export default router;
