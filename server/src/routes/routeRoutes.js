import express from 'express';
import { saveRoute, getSavedRoutes, deleteRoute } from '../controllers/routeController.js';
import { optionalAuth, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', optionalAuth, saveRoute);
router.post('/save', optionalAuth, saveRoute);
router.get('/', optionalAuth, getSavedRoutes);
router.get('/history', optionalAuth, getSavedRoutes);
router.delete('/:id', protect, deleteRoute);

export default router;

