const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

// ── Token helpers ─────────────────────────────────────────

const signAccessToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const signRefreshToken = (id) =>
  jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  });

const sendTokens = (user, statusCode, res) => {
  const accessToken  = signAccessToken(user._id);
  const refreshToken = signRefreshToken(user._id);

  // httpOnly cookie for refresh token (XSS-safe)
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.status(statusCode).json({
    status: 'success',
    accessToken,
    data: { user },
  });
};

// ── Controllers ───────────────────────────────────────────

/**
 * POST /api/auth/register
 */
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // 🔥 VALIDATION ADD
    if (!name || !email || !password) {
      return next(new ApiError(400, 'All fields are required'));
    }

    if (password.length < 6) {
      return next(new ApiError(400, 'Password must be at least 6 characters'));
    }

    const exists = await User.findOne({ email });
    if (exists) return next(new ApiError(409, 'Email already registered'));

    const user = await User.create({ name, email, password });
    logger.info(`New user registered: ${email}`);

    sendTokens(user, 201, res);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/login
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 🔥 VALIDATION ADD
    if (!email || !password) {
      return next(new ApiError(400, 'Email and password required'));
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return next(new ApiError(401, 'Invalid email or password'));
    }

    if (!user.isActive) {
      return next(new ApiError(403, 'Account is deactivated. Contact support.'));
    }

    logger.info(`User logged in: ${email}`);
    sendTokens(user, 200, res);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/refresh
 */
exports.refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return next(new ApiError(401, 'Refresh token missing'));

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      return next(new ApiError(401, 'User not found'));
    }

    const accessToken = signAccessToken(user._id);

    res.status(200).json({
      status: 'success',
      accessToken,
    });
  } catch (err) {
    if (['TokenExpiredError', 'JsonWebTokenError'].includes(err.name)) {
      return next(new ApiError(401, 'Invalid or expired refresh token. Please log in again.'));
    }
    next(err);
  }
};

/**
 * POST /api/auth/logout
 */
exports.logout = (req, res) => {
  res.clearCookie('refreshToken');
  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully',
  });
};

/**
 * GET /api/auth/me
 */
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      status: 'success',
      data: { user },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 🔥 NEW: UPDATE PROFILE (IMPORTANT)
 * PUT /api/auth/update
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const { name } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) return next(new ApiError(404, 'User not found'));

    if (name) user.name = name;

    await user.save();

    res.status(200).json({
      status: 'success',
      data: { user },
    });
  } catch (err) {
    next(err);
  }
};