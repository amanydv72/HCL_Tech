const { validationResult } = require('express-validator');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const { getPaginationParams, getPaginationMeta } = require('../utils/pagination');

class PatientController {
  // Get patient's own profile
  static async getMyProfile(req, res) {
    try {
      const patient = await Patient.findByUserId(req.user.userId);
      
      if (!patient) {
        return res.status(404).json({ success: false, message: 'Patient profile not found' });
      }

      res.status(200).json({
        success: true,
        data: patient,
      });
    } catch (error) {
      console.error('Get patient profile error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  // Update own profile
  static async updateMyProfile(req, res) {
    try {
      const patient = await Patient.findByUserId(req.user.userId);
      
      if (!patient) {
        return res.status(404).json({ success: false, message: 'Patient profile not found' });
      }

      const updates = req.body;
      const updatedPatient = await Patient.update(patient.id, updates);

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: updatedPatient,
      });
    } catch (error) {
      console.error('Update patient profile error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  // View all doctors
  static async getAllDoctors(req, res) {
    try {
      const { page, limit, offset } = getPaginationParams(req.query);
      const { specialization } = req.query;

      const filters = { limit, offset, isActive: true };
      if (specialization) filters.specialization = specialization;

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

  // Get doctor details
  static async getDoctorById(req, res) {
    try {
      const { id } = req.params;

      const doctor = await Doctor.findById(id);
      
      if (!doctor) {
        return res.status(404).json({ success: false, message: 'Doctor not found' });
      }

      res.status(200).json({
        success: true,
        data: doctor,
      });
    } catch (error) {
      console.error('Get doctor error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  // Book appointment
  static async bookAppointment(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const patient = await Patient.findByUserId(req.user.userId);
      
      if (!patient) {
        return res.status(404).json({ success: false, message: 'Patient profile not found' });
      }

      const { doctorId, appointmentDate, appointmentTime, reason } = req.body;

      // Verify doctor exists
      const doctor = await Doctor.findById(doctorId);
      if (!doctor) {
        return res.status(404).json({ success: false, message: 'Doctor not found' });
      }

      const appointment = await Appointment.create({
        patientId: patient.id,
        doctorId,
        appointmentDate,
        appointmentTime,
        reason,
        status: 'pending',
      });

      res.status(201).json({
        success: true,
        message: 'Appointment booked successfully',
        data: appointment,
      });
    } catch (error) {
      console.error('Book appointment error:', error);
      res.status(500).json({ 
        success: false, 
        message: error.message || 'Server error' 
      });
    }
  }

  // Get patient's appointments
  static async getMyAppointments(req, res) {
    try {
      const { page, limit, offset } = getPaginationParams(req.query);
      const { status, date } = req.query;

      const patient = await Patient.findByUserId(req.user.userId);
      
      if (!patient) {
        return res.status(404).json({ success: false, message: 'Patient profile not found' });
      }

      const filters = { patientId: patient.id, limit, offset };
      if (status) filters.status = status;
      if (date) filters.date = date;

      const appointments = await Appointment.getAll(filters);
      const total = await Appointment.count({ patientId: patient.id, status, date });

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

  // Get appointment details
  static async getAppointmentById(req, res) {
    try {
      const { id } = req.params;

      const appointment = await Appointment.findById(id);
      
      if (!appointment) {
        return res.status(404).json({ success: false, message: 'Appointment not found' });
      }

      const patient = await Patient.findByUserId(req.user.userId);
      
      if (appointment.patient_id !== patient.id) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }

      res.status(200).json({
        success: true,
        data: appointment,
      });
    } catch (error) {
      console.error('Get appointment error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  // Cancel appointment
  static async cancelAppointment(req, res) {
    try {
      const { id } = req.params;

      const appointment = await Appointment.findById(id);
      
      if (!appointment) {
        return res.status(404).json({ success: false, message: 'Appointment not found' });
      }

      const patient = await Patient.findByUserId(req.user.userId);
      
      if (appointment.patient_id !== patient.id) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }

      if (appointment.status === 'completed') {
        return res.status(400).json({ 
          success: false, 
          message: 'Cannot cancel completed appointment' 
        });
      }

      if (appointment.status === 'cancelled') {
        return res.status(400).json({ 
          success: false, 
          message: 'Appointment already cancelled' 
        });
      }

      const updatedAppointment = await Appointment.update(id, { status: 'cancelled' });

      res.status(200).json({
        success: true,
        message: 'Appointment cancelled successfully',
        data: updatedAppointment,
      });
    } catch (error) {
      console.error('Cancel appointment error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  // Get appointment history
  static async getAppointmentHistory(req, res) {
    try {
      const { page, limit, offset } = getPaginationParams(req.query);

      const patient = await Patient.findByUserId(req.user.userId);
      
      if (!patient) {
        return res.status(404).json({ success: false, message: 'Patient profile not found' });
      }

      const filters = { 
        patientId: patient.id, 
        limit, 
        offset,
      };

      const appointments = await Appointment.getAll(filters);
      const total = await Appointment.count({ patientId: patient.id });

      res.status(200).json({
        success: true,
        data: appointments,
        meta: getPaginationMeta(total, page, limit),
      });
    } catch (error) {
      console.error('Get appointment history error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  // Get patient statistics
  static async getMyStats(req, res) {
    try {
      const patient = await Patient.findByUserId(req.user.userId);
      
      if (!patient) {
        return res.status(404).json({ success: false, message: 'Patient profile not found' });
      }

      const totalAppointments = await Appointment.count({ patientId: patient.id });
      const pendingAppointments = await Appointment.count({ patientId: patient.id, status: 'pending' });
      const confirmedAppointments = await Appointment.count({ patientId: patient.id, status: 'confirmed' });
      const completedAppointments = await Appointment.count({ patientId: patient.id, status: 'completed' });
      const cancelledAppointments = await Appointment.count({ patientId: patient.id, status: 'cancelled' });

      res.status(200).json({
        success: true,
        data: {
          totalAppointments,
          pendingAppointments,
          confirmedAppointments,
          completedAppointments,
          cancelledAppointments,
        },
      });
    } catch (error) {
      console.error('Get stats error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
}

module.exports = PatientController;
