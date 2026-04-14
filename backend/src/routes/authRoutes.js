const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const {
  validate,
  registerRules,
  loginRules,
} = require('../middleware/validate');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', registerRules, validate, authController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Login and receive tokens
 * @access  Public
 */
router.post('/login', loginRules, validate, authController.login);

/**
 * @route   POST /api/auth/refresh
 * @desc    Get a new access token using refresh token cookie
 * @access  Public (requires refreshToken cookie)
 */
router.post('/refresh', authController.refreshToken);

/**
 * @route   POST /api/auth/logout
 * @desc    Clear refresh token cookie
 * @access  Public
 */
router.post('/logout', authController.logout);

/**
 * @route   GET /api/auth/me
 * @desc    Get currently authenticated user
 * @access  Protected
 */
router.get('/me', protect, authController.getMe);

module.exports = router;