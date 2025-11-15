const express = require('express');
const authRoutes = require('./auth');
const adminRoutes = require('./admin');
const doctorRoutes = require('./doctor');
const patientRoutes = require('./patient');

const router = express.Router();

// API routes
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/doctor', doctorRoutes);
router.use('/patient', patientRoutes);

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
