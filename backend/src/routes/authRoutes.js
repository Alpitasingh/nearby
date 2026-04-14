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

// 🔥 DEBUG: removed validation (temporary)
router.post('/register', authController.register);

/**
 * @route   POST /api/auth/login
 */
router.post('/login', loginRules, validate, authController.login);

router.post('/refresh', authController.refreshToken);
router.post('/logout', authController.logout);

router.get('/me', protect, authController.getMe);

router.put('/update', protect, authController.updateProfile);

module.exports = router;