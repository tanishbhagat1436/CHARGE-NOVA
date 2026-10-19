import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import os from 'os';
import { connectDB } from './config/db.js';
import stationRoutes from './routes/stationRoutes.js';
import routeRoutes from './routes/routeRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware - Allow local network and phone browsers to communicate
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Database Connection
connectDB();

// API Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Charge Nova REST API Active', timestamp: new Date() });
});

// Real-Time Local Network Interfaces Discovery for Mobile QR Access
app.get('/api/network-info', (req, res) => {
  try {
    const nets = os.networkInterfaces();
    const addresses = [];
    
    for (const name of Object.keys(nets)) {
      for (const net of nets[name]) {
        if (net.family === 'IPv4' && !net.internal) {
          const isWifi = /wi-fi|wireless|wlan/i.test(name);
          const isVirtual = /vEthernet|VirtualBox|VMware|WSL|Loopback/i.test(name);
          addresses.push({
            interface: name,
            ip: net.address,
            isWifi,
            isVirtual,
            priority: isWifi ? 1 : (isVirtual ? 3 : 2)
          });
        }
      }
    }

    addresses.sort((a, b) => a.priority - b.priority);
    const primaryIp = addresses.length > 0 ? addresses[0].ip : 'localhost';

    res.json({
      status: 'OK',
      ip: primaryIp,
      allInterfaces: addresses,
      clientPort: 3000,
      serverPort: PORT
    });
  } catch (error) {
    res.status(500).json({ status: 'ERROR', message: error.message });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/stations', stationRoutes);
app.use('/api/routes', routeRoutes);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`⚡ Charge Nova Server running on port ${PORT} (0.0.0.0)`);
});
