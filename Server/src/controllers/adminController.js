const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const { getPaginationParams, getPaginationMeta } = require('../utils/pagination');

class AdminController {
  // User Management
  static async getAllUsers(req, res) {
    try {
      const { page, limit, offset } = getPaginationParams(req.query);
      const { role, isActive } = req.query;

      const filters = { limit, offset };
      if (role) filters.role = role;
      if (isActive !== undefined) filters.isActive = isActive === 'true';

      const users = await User.getAll(filters);
      const total = await User.count(filters);

      res.status(200).json({
        success: true,
        data: users,
        meta: getPaginationMeta(total, page, limit),
      });
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  static async createUser(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { email, password, fullName, role, phone } = req.body;

      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ success: false, message: 'Email already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.create({
        email,
        password: hashedPassword,
        fullName,
        role,
        phone,
      });

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: user,
      });
    } catch (error) {
      console.error('Create user error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  static async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { fullName, phone, isActive } = req.body;

      const user = await User.update(id, { fullName, phone, isActive });
      
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: user,
      });
    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  static async deleteUser(req, res) {
    try {
      const { id } = req.params;

      const user = await User.delete(id);
      
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      res.status(200).json({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  // Doctor Management
  static async getAllDoctors(req, res) {
    try {
      const { page, limit, offset } = getPaginationParams(req.query);
      const { specialization, isActive } = req.query;

      const filters = { limit, offset };
      if (specialization) filters.specialization = specialization;
      if (isActive !== undefined) filters.isActive = isActive === 'true';

      const doctors = await Doctor.getAll(filters);
      const total = await Doctor.count(filters);

      res.status(200).json({
        success: true,
        data: doctors,
        meta: getPaginationMeta(total, page, limit),
      });
    } catch (error) {
      console.error('Get doctors error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  static async updateDoctor(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const doctor = await Doctor.update(id, updates);
      
      if (!doctor) {
        return res.status(404).json({ success: false, message: 'Doctor not found' });
      }

      res.status(200).json({
        success: true,
        message: 'Doctor updated successfully',
        data: doctor,
      });
    } catch (error) {
      console.error('Update doctor error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  static async deleteDoctor(req, res) {
    try {
      const { id } = req.params;

      const doctor = await Doctor.delete(id);
      
      if (!doctor) {
        return res.status(404).json({ success: false, message: 'Doctor not found' });
      }

      res.status(200).json({
        success: true,
        message: 'Doctor deleted successfully',
      });
    } catch (error) {
      console.error('Delete doctor error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  // Patient Management
  static async getAllPatients(req, res) {
    try {
      const { page, limit, offset } = getPaginationParams(req.query);
      const { isActive } = req.query;

      const filters = { limit, offset };
      if (isActive !== undefined) filters.isActive = isActive === 'true';

      const patients = await Patient.getAll(filters);
      const total = await Patient.count(filters);

      res.status(200).json({
        success: true,
        data: patients,
        meta: getPaginationMeta(total, page, limit),
      });
    } catch (error) {
      console.error('Get patients error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  static async updatePatient(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const patient = await Patient.update(id, updates);
      
      if (!patient) {
        return res.status(404).json({ success: false, message: 'Patient not found' });
      }

      res.status(200).json({
        success: true,
        message: 'Patient updated successfully',
        data: patient,
      });
    } catch (error) {
      console.error('Update patient error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  static async deletePatient(req, res) {
    try {
      const { id } = req.params;

      const patient = await Patient.delete(id);
      
      if (!patient) {
        return res.status(404).json({ success: false, message: 'Patient not found' });
      }

      res.status(200).json({
        success: true,
        message: 'Patient deleted successfully',
      });
    } catch (error) {
      console.error('Delete patient error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  // Appointment Management
  static async getAllAppointments(req, res) {
    try {
      const { page, limit, offset } = getPaginationParams(req.query);
      const { status, doctorId, patientId, date } = req.query;

      const filters = { limit, offset };
      if (status) filters.status = status;
      if (doctorId) filters.doctorId = parseInt(doctorId);
      if (patientId) filters.patientId = parseInt(patientId);
      if (date) filters.date = date;

      const appointments = await Appointment.getAll(filters);
      const total = await Appointment.count(filters);

      res.status(200).json({
        success: true,
        data: appointments,
        meta: getPaginationMeta(total, page, limit),
      });
    } catch (error) {
      console.error('Get appointments error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  static async createAppointment(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const appointment = await Appointment.create(req.body);

      res.status(201).json({
        success: true,
        message: 'Appointment created successfully',
        data: appointment,
      });
    } catch (error) {
      console.error('Create appointment error:', error);
      res.status(500).json({ 
        success: false, 
        message: error.message || 'Server error' 
      });
    }
  }

  static async updateAppointment(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const appointment = await Appointment.update(id, updates);
      
      if (!appointment) {
        return res.status(404).json({ success: false, message: 'Appointment not found' });
      }

      res.status(200).json({
        success: true,
        message: 'Appointment updated successfully',
        data: appointment,
      });
    } catch (error) {
      console.error('Update appointment error:', error);
      res.status(500).json({ 
        success: false, 
        message: error.message || 'Server error' 
      });
    }
  }

  static async deleteAppointment(req, res) {
    try {
      const { id } = req.params;

      const appointment = await Appointment.delete(id);
      
      if (!appointment) {
        return res.status(404).json({ success: false, message: 'Appointment not found' });
      }

      res.status(200).json({
        success: true,
        message: 'Appointment deleted successfully',
      });
    } catch (error) {
      console.error('Delete appointment error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  // Dashboard stats
  static async getDashboardStats(req, res) {
    try {
      const totalUsers = await User.count();
      const totalDoctors = await Doctor.count();
      const totalPatients = await Patient.count();
      const totalAppointments = await Appointment.count();
      const pendingAppointments = await Appointment.count({ status: 'pending' });
      const confirmedAppointments = await Appointment.count({ status: 'confirmed' });

      res.status(200).json({
        success: true,
        data: {
          totalUsers,
          totalDoctors,
          totalPatients,
          totalAppointments,
          pendingAppointments,
          confirmedAppointments,
        },
      });
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
}

module.exports = AdminController;
