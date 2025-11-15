const express = require('express');
const PatientController = require('../controllers/patientController');
const authMiddleware = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');
const { appointmentValidation } = require('../validators/authValidator');

const router = express.Router();

// All patient routes require authentication and patient role
router.use(authMiddleware, roleAuth('patient'));

// Profile management
router.get('/profile', PatientController.getMyProfile);
router.put('/profile', PatientController.updateMyProfile);

// Statistics
router.get('/stats', PatientController.getMyStats);

// Doctor browsing
router.get('/doctors', PatientController.getAllDoctors);
router.get('/doctors/:id', PatientController.getDoctorById);

// Appointment management
router.post('/appointments', appointmentValidation, PatientController.bookAppointment);
router.get('/appointments', PatientController.getMyAppointments);
router.get('/appointments/:id', PatientController.getAppointmentById);
router.put('/appointments/:id/cancel', PatientController.cancelAppointment);
router.get('/appointment-history', PatientController.getAppointmentHistory);

module.exports = router;
