const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../../src/models/User');
const Doctor = require('../../src/models/Doctor');
const Patient = require('../../src/models/Patient');
const config = require('../../src/config');

class AuthController {
  static async register(req, res) {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false, 
          errors: errors.array() 
        });
      }

      const { email, password, fullName, role, phone, ...roleData } = req.body;

      // Validate role
      if (!['doctor', 'patient'].includes(role)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid role. Must be either doctor or patient' 
        });
      }

      // Check if user exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ 
          success: false, 
          message: 'User already exists with this email' 
        });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user
      const user = await User.create({
        email,
        password: hashedPassword,
        fullName,
        role,
        phone,
      });

      // Create role-specific record
      let roleRecord;
      if (role === 'doctor') {
        roleRecord = await Doctor.create({
          userId: user.id,
          specialization: roleData.specialization,
          qualifications: roleData.qualifications,
          experienceYears: roleData.experienceYears,
          consultationFee: roleData.consultationFee,
          availability: roleData.availability,
        });
      } else if (role === 'patient') {
        roleRecord = await Patient.create({
          userId: user.id,
          dateOfBirth: roleData.dateOfBirth,
          gender: roleData.gender,
          address: roleData.address,
          medicalHistory: roleData.medicalHistory,
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      );

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: {
            id: user.id,
            email: user.email,
            fullName: user.full_name,
            role: user.role,
            phone: user.phone,
          },
          roleId: roleRecord?.id,
          token,
        },
      });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({ 
        success: false, 
        message: error.message || 'Server error during registration' 
      });
    }
  }

  static async login(req, res) {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false, 
          errors: errors.array() 
        });
      }

      const { email, password } = req.body;

      // Find user
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid credentials' 
        });
      }

      // Check if user is active
      if (!user.is_active) {
        return res.status(403).json({ 
          success: false, 
          message: 'Account is deactivated. Please contact admin.' 
        });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid credentials' 
        });
      }

      // Get role-specific ID
      let roleId = null;
      if (user.role === 'doctor') {
        const doctor = await Doctor.findByUserId(user.id);
        roleId = doctor?.id;
      } else if (user.role === 'patient') {
        const patient = await Patient.findByUserId(user.id);
        roleId = patient?.id;
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role, roleId },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      );

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user.id,
            email: user.email,
            fullName: user.full_name,
            role: user.role,
            phone: user.phone,
          },
          roleId,
          token,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Server error during login' 
      });
    }
  }

  static async getProfile(req, res) {
    try {
      const user = await User.findById(req.user.userId);
      
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: 'User not found' 
        });
      }

      // Get role-specific data
      let roleData = null;
      if (user.role === 'doctor') {
        roleData = await Doctor.findByUserId(user.id);
      } else if (user.role === 'patient') {
        roleData = await Patient.findByUserId(user.id);
      }

      res.status(200).json({
        success: true,
        data: { 
          user,
          roleData 
        },
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Server error' 
      });
    }
  }
}

module.exports = AuthController;
