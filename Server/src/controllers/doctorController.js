const Doctor = require('../../src/models/Doctor');
const Patient = require('../../src/models/Patient');
const Appointment = require('../../src/models/Appointment');
const { getPaginationParams, getPaginationMeta } = require('../../src/utils/pagination');

class DoctorController {
  // Get doctor's own profile with extended details
  static async getMyProfile(req, res) {
    try {
      const doctor = await Doctor.findByUserId(req.user.userId);
      
      if (!doctor) {
        return res.status(404).json({ success: false, message: 'Doctor profile not found' });
      }

      res.status(200).json({
        success: true,
        data: doctor,
      });
    } catch (error) {
      console.error('Get doctor profile error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  // Update own profile
  static async updateMyProfile(req, res) {
    try {
      const doctor = await Doctor.findByUserId(req.user.userId);
      
      if (!doctor) {
        return res.status(404).json({ success: false, message: 'Doctor profile not found' });
      }

      const updates = req.body;
      const updatedDoctor = await Doctor.update(doctor.id, updates);

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: updatedDoctor,
      });
    } catch (error) {
      console.error('Update doctor profile error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  // Update availability schedule
  static async updateAvailability(req, res) {
    try {
      const { availability } = req.body;

      if (!Array.isArray(availability)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Availability must be an array' 
        });
      }

      const doctor = await Doctor.findByUserId(req.user.userId);
      
      if (!doctor) {
        return res.status(404).json({ success: false, message: 'Doctor profile not found' });
      }

      const updatedDoctor = await Doctor.update(doctor.id, { availability });

      res.status(200).json({
        success: true,
        message: 'Availability updated successfully',
        data: updatedDoctor,
      });
    } catch (error) {
      console.error('Update availability error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  // Get doctor's appointments
  static async getMyAppointments(req, res) {
    try {
      const { page, limit, offset } = getPaginationParams(req.query);
      const { status, date } = req.query;

      const doctor = await Doctor.findByUserId(req.user.userId);
      
      if (!doctor) {
        return res.status(404).json({ success: false, message: 'Doctor profile not found' });
      }

      const filters = { doctorId: doctor.id, limit, offset };
      if (status) filters.status = status;
      if (date) filters.date = date;

      const appointments = await Appointment.getAll(filters);
      const total = await Appointment.count({ doctorId: doctor.id, status, date });

      res.status(200).json({
        success: true,
        data: appointments,
        meta: getPaginationMeta(total, page, limit),
      });
    } catch (error) {
      console.error('Get doctor appointments error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  // Get appointment by ID (only own appointments)
  static async getAppointmentById(req, res) {
    try {
      const { id } = req.params;

      const appointment = await Appointment.findById(id);
      
      if (!appointment) {
        return res.status(404).json({ success: false, message: 'Appointment not found' });
      }

      const doctor = await Doctor.findByUserId(req.user.userId);
      
      if (appointment.doctor_id !== doctor.id) {
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

  // Approve appointment
  static async approveAppointment(req, res) {
    try {
      const { id } = req.params;

      const appointment = await Appointment.findById(id);
      
      if (!appointment) {
        return res.status(404).json({ success: false, message: 'Appointment not found' });
      }

      const doctor = await Doctor.findByUserId(req.user.userId);
      
      if (appointment.doctor_id !== doctor.id) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }

      const updatedAppointment = await Appointment.update(id, { status: 'confirmed' });

      res.status(200).json({
        success: true,
        message: 'Appointment approved successfully',
        data: updatedAppointment,
      });
    } catch (error) {
      console.error('Approve appointment error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  // Cancel appointment
  static async cancelAppointment(req, res) {
    try {
      const { id } = req.params;
      const { notes } = req.body;

      const appointment = await Appointment.findById(id);
      
      if (!appointment) {
        return res.status(404).json({ success: false, message: 'Appointment not found' });
      }

      const doctor = await Doctor.findByUserId(req.user.userId);
      
      if (appointment.doctor_id !== doctor.id) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }

      const updatedAppointment = await Appointment.update(id, { 
        status: 'cancelled',
        notes: notes || appointment.notes 
      });

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

  // Complete appointment
  static async completeAppointment(req, res) {
    try {
      const { id } = req.params;
      const { notes } = req.body;

      const appointment = await Appointment.findById(id);
      
      if (!appointment) {
        return res.status(404).json({ success: false, message: 'Appointment not found' });
      }

      const doctor = await Doctor.findByUserId(req.user.userId);
      
      if (appointment.doctor_id !== doctor.id) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }

      const updatedAppointment = await Appointment.update(id, { 
        status: 'completed',
        notes: notes || appointment.notes 
      });

      res.status(200).json({
        success: true,
        message: 'Appointment marked as completed',
        data: updatedAppointment,
      });
    } catch (error) {
      console.error('Complete appointment error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  // Add notes to appointment
  static async addAppointmentNotes(req, res) {
    try {
      const { id } = req.params;
      const { notes } = req.body;

      const appointment = await Appointment.findById(id);
      
      if (!appointment) {
        return res.status(404).json({ success: false, message: 'Appointment not found' });
      }

      const doctor = await Doctor.findByUserId(req.user.userId);
      
      if (appointment.doctor_id !== doctor.id) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }

      const updatedAppointment = await Appointment.update(id, { notes });

      res.status(200).json({
        success: true,
        message: 'Notes added successfully',
        data: updatedAppointment,
      });
    } catch (error) {
      console.error('Add notes error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  // View assigned patients
  static async getMyPatients(req, res) {
    try {
      const { page, limit, offset } = getPaginationParams(req.query);

      const doctor = await Doctor.findByUserId(req.user.userId);
      
      if (!doctor) {
        return res.status(404).json({ success: false, message: 'Doctor profile not found' });
      }

      const patients = await Patient.getByDoctorId(doctor.id, { limit, offset });

      res.status(200).json({
        success: true,
        data: patients,
        meta: { page, limit },
      });
    } catch (error) {
      console.error('Get patients error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  // Get doctor statistics
  static async getMyStats(req, res) {
    try {
      const doctor = await Doctor.findByUserId(req.user.userId);
      
      if (!doctor) {
        return res.status(404).json({ success: false, message: 'Doctor profile not found' });
      }

      const totalAppointments = await Appointment.count({ doctorId: doctor.id });
      const pendingAppointments = await Appointment.count({ doctorId: doctor.id, status: 'pending' });
      const confirmedAppointments = await Appointment.count({ doctorId: doctor.id, status: 'confirmed' });
      const completedAppointments = await Appointment.count({ doctorId: doctor.id, status: 'completed' });

      res.status(200).json({
        success: true,
        data: {
          totalAppointments,
          pendingAppointments,
          confirmedAppointments,
          completedAppointments,
        },
      });
    } catch (error) {
      console.error('Get stats error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
}

module.exports = DoctorController;
