const express = require('express');
const AuthController = require('../controllers/authController');
const authMiddleware = require('../../src/middleware/auth');
const { registerValidation, loginValidation } = require('../validators/authValidator');

const router = express.Router();

// Public routes
router.post('/register', registerValidation, AuthController.register);
router.post('/login', loginValidation, AuthController.login);

// Protected routes
router.get('/profile', authMiddleware, AuthController.getProfile);

module.exports = router;
