const express = require('express');
const AdminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');
const { createUserValidation, appointmentValidation } = require('../validators/authValidator');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authMiddleware, roleAuth('admin'));

// Dashboard
router.get('/dashboard', AdminController.getDashboardStats);

// User Management
router.get('/users', AdminController.getAllUsers);
router.post('/users', createUserValidation, AdminController.createUser);
router.put('/users/:id', AdminController.updateUser);
router.delete('/users/:id', AdminController.deleteUser);

// Doctor Management
router.get('/doctors', AdminController.getAllDoctors);
router.put('/doctors/:id', AdminController.updateDoctor);
router.delete('/doctors/:id', AdminController.deleteDoctor);

// Patient Management
router.get('/patients', AdminController.getAllPatients);
router.put('/patients/:id', AdminController.updatePatient);
router.delete('/patients/:id', AdminController.deletePatient);

// Appointment Management
router.get('/appointments', AdminController.getAllAppointments);
router.post('/appointments', appointmentValidation, AdminController.createAppointment);
router.put('/appointments/:id', AdminController.updateAppointment);
router.delete('/appointments/:id', AdminController.deleteAppointment);

module.exports = router;
