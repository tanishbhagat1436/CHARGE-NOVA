import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'chargenova_secret_key_2026';

// In-memory fallback user store when MongoDB is offline
export const inMemoryUsers = [];

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

// @route   POST /api/auth/register
// @desc    Register a new real user account
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide name, email, and password.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters long.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let user;

    if (mongoose.connection.readyState === 1) {
      const existingUser = await User.findOne({ email: cleanEmail });
      if (existingUser) {
        return res.status(400).json({ success: false, error: 'An account with this email address already exists. Please login.' });
      }

      user = await User.create({
        name: name.trim(),
        email: cleanEmail,
        password: hashedPassword
      });
    } else {
      const existingMemUser = inMemoryUsers.find(u => u.email === cleanEmail);
      if (existingMemUser) {
        return res.status(400).json({ success: false, error: 'An account with this email address already exists. Please login.' });
      }

      user = {
        _id: 'mem_' + Date.now(),
        name: name.trim(),
        email: cleanEmail,
        password: hashedPassword,
        createdAt: new Date()
      };
      inMemoryUsers.push(user);
    }

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        defaultVehicle: user.defaultVehicle || 'Tata Nexon EV Max',
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Registration Error:', error.message);
    return res.status(500).json({ success: false, error: 'Registration error: ' + error.message });
  }
};

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please enter both email and password.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    let user;

    if (mongoose.connection.readyState === 1) {
      user = await User.findOne({ email: cleanEmail });
    } else {
      user = inMemoryUsers.find(u => u.email === cleanEmail);
    }

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    const token = generateToken(user._id || user.id);

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully!',
      token,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        defaultVehicle: user.defaultVehicle || 'Tata Nexon EV Max',
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Login Error:', error.message);
    return res.status(500).json({ success: false, error: 'Login error: ' + error.message });
  }
};

// @route   GET /api/auth/me
// @desc    Get currently logged in user profile
export const getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Not authenticated.' });
    }
    return res.status(200).json({
      success: true,
      user: {
        id: req.user._id || req.user.id,
        name: req.user.name,
        email: req.user.email,
        defaultVehicle: req.user.defaultVehicle || 'Tata Nexon EV Max',
        createdAt: req.user.createdAt
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Server error fetching user profile.' });
  }
};

// @route   PUT /api/auth/profile
// @desc    Update user profile & default vehicle
export const updateProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Not authenticated.' });
    }

    const { name, defaultVehicle } = req.body;
    const currentUserId = req.user._id || req.user.id;

    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(currentUserId);
      if (!user) return res.status(404).json({ success: false, error: 'User not found.' });
      if (name) user.name = name.trim();
      if (defaultVehicle) user.defaultVehicle = defaultVehicle.trim();
      await user.save();
      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully!',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          defaultVehicle: user.defaultVehicle,
          createdAt: user.createdAt
        }
      });
    } else {
      const user = inMemoryUsers.find(u => String(u._id || u.id) === String(currentUserId));
      if (user) {
        if (name) user.name = name.trim();
        if (defaultVehicle) user.defaultVehicle = defaultVehicle.trim();
      }
      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully!',
        user: {
          id: currentUserId,
          name: user?.name || req.user.name,
          email: user?.email || req.user.email,
          defaultVehicle: user?.defaultVehicle || defaultVehicle || 'Tata Nexon EV Max',
          createdAt: req.user.createdAt
        }
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to update profile' });
  }
};

