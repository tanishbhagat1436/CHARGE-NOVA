import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import stationRoutes from './routes/stationRoutes.js';
import routeRoutes from './routes/routeRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000' }));
app.use(express.json());

// Database Connection
connectDB();

// API Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Charge Nova REST API Active', timestamp: new Date() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/stations', stationRoutes);
app.use('/api/routes', routeRoutes);

app.listen(PORT, () => {
  console.log(`⚡ Charge Nova Server running on port ${PORT}`);
});
