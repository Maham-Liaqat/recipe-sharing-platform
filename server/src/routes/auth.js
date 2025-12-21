const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Validation rules
const registerValidation = [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
];

const loginValidation = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
];

// Routes
router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);
router.get('/me', protect, authController.getMe);
router.post('/logout', protect, authController.logout);
router.put('/profile', protect, authController.updateProfile);

module.exports = router;