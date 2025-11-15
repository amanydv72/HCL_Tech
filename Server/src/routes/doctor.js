const express = require('express');
const DoctorController = require('../controllers/doctorController');
const authMiddleware = require('../../src-pr/src/middleware/auth');
const roleAuth = require('../../src-pr/src/middleware/roleAuth');

const router = express.Router();

// All doctor routes require authentication and doctor role
router.use(authMiddleware, roleAuth('doctor'));

// Profile management
router.get('/profile', DoctorController.getMyProfile);
router.put('/profile', DoctorController.updateMyProfile);
router.put('/availability', DoctorController.updateAvailability);

// Statistics
router.get('/stats', DoctorController.getMyStats);

// Appointment management
router.get('/appointments', DoctorController.getMyAppointments);
router.get('/appointments/:id', DoctorController.getAppointmentById);
router.put('/appointments/:id/approve', DoctorController.approveAppointment);
router.put('/appointments/:id/cancel', DoctorController.cancelAppointment);
router.put('/appointments/:id/complete', DoctorController.completeAppointment);
router.put('/appointments/:id/notes', DoctorController.addAppointmentNotes);

// Patient management
router.get('/patients', DoctorController.getMyPatients);

module.exports = router;
