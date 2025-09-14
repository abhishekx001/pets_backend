const express = require('express');
const AuthController = require('../controllers/authController');
const { 
  userRegistrationSchema, 
  userLoginSchema, 
  validateSchema 
} = require('../schemas/validation');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', validateSchema(userRegistrationSchema), AuthController.register);
router.post('/login', validateSchema(userLoginSchema), AuthController.login);

// Protected routes
router.get('/profile', authenticateToken, AuthController.getProfile);
router.put('/profile', authenticateToken, AuthController.updateProfile);

module.exports = router;
