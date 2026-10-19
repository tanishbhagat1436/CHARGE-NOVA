import express from 'express';
import { saveRoute, getSavedRoutes } from '../controllers/routeController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', optionalAuth, saveRoute);
router.post('/save', optionalAuth, saveRoute);
router.get('/', optionalAuth, getSavedRoutes);
router.get('/history', optionalAuth, getSavedRoutes);

export default router;
