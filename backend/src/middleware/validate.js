const { validationResult, body, query, param } = require('express-validator');
const ApiError = require('../utils/ApiError');

/**
 * Run after validator chains — collects errors and forwards to error handler.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ApiError(422, 'Validation failed', errors.array()));
  }
  next();
};

// ── Auth validators ───────────────────────────────────────

const registerRules = [
  body('name').trim().isLength({ min: 2, max: 60 }).withMessage('Name must be 2–60 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number'),
];

const loginRules = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password is required'),
];

// ── Task validators ───────────────────────────────────────

const createTaskRules = [
  body('title').trim().isLength({ min: 5, max: 120 }).withMessage('Title must be 5–120 characters'),
  body('description').trim().isLength({ min: 20, max: 2000 }).withMessage('Description must be 20–2000 characters'),
  body('budget').isFloat({ min: 1 }).withMessage('Budget must be a positive number'),
  body('currency').optional().isAlpha().isLength({ min: 3, max: 3 }).withMessage('Currency must be a 3-letter code'),

  // Location: expects { longitude, latitude } in body
  body('longitude').isFloat({ min: -180, max: 180 }).withMessage('Longitude must be between -180 and 180'),
  body('latitude').isFloat({ min: -90, max: 90 }).withMessage('Latitude must be between -90 and 90'),

  body('radius').optional().isFloat({ min: 0.1, max: 50 }).withMessage('Radius must be 0.1–50 km'),
  body('address').optional().trim().isLength({ max: 255 }),
  body('category').optional().trim().isLength({ max: 50 }),
  body('tags').optional().isArray({ max: 10 }).withMessage('Max 10 tags'),
];

const nearbyTasksRules = [
  query('longitude').isFloat({ min: -180, max: 180 }).withMessage('Valid longitude required'),
  query('latitude').isFloat({ min: -90, max: 90 }).withMessage('Valid latitude required'),
  query('radius').optional().isFloat({ min: 0.1, max: 50 }).withMessage('Radius must be 0.1–50 km'),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
];

const mongoIdRule = (paramName) =>
  param(paramName).isMongoId().withMessage(`Invalid ${paramName}`);

module.exports = {
  validate,
  registerRules,
  loginRules,
  createTaskRules,
  nearbyTasksRules,
  mongoIdRule,
};