import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { inMemoryUsers } from '../controllers/authController.js';

const JWT_SECRET = process.env.JWT_SECRET || 'chargenova_secret_key_2026';

// Mandatory Auth Middleware
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);

      if (mongoose.connection.readyState === 1) {
        req.user = await User.findById(decoded.id).select('-password');
      } else {
        req.user = inMemoryUsers.find(u => String(u._id || u.id) === String(decoded.id)) || {
          _id: decoded.id,
          name: 'EV Driver',
          email: 'user@chargenova.com'
        };
      }

      if (!req.user) {
        return res.status(401).json({ success: false, error: 'User account no longer exists.' });
      }
      return next();
    } catch (error) {
      return res.status(401).json({ success: false, error: 'Not authorized, token invalid or expired.' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, error: 'Not authorized, no session token provided.' });
  }
};

// Optional Auth Middleware
export const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      if (mongoose.connection.readyState === 1) {
        req.user = await User.findById(decoded.id).select('-password');
      } else {
        req.user = inMemoryUsers.find(u => String(u._id || u.id) === String(decoded.id)) || {
          _id: decoded.id,
          name: 'EV Driver',
          email: 'user@chargenova.com'
        };
      }
    } catch (error) {
      console.warn('Optional auth token invalid:', error.message);
    }
  }
  next();
};
