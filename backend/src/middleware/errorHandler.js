const logger = require('../utils/logger');
const ApiError = require('../utils/ApiError');

// ── Cast ObjectId errors (malformed Mongo ID) ─────────────
const handleCastError = (err) =>
  new ApiError(400, `Invalid value for field: ${err.path}`);

// ── Duplicate key (unique index violation) ────────────────
const handleDuplicateKey = (err) => {
  const field = Object.keys(err.keyValue)[0];
  return new ApiError(409, `${field} already exists. Please use a different value.`);
};

// ── Mongoose validation errors ────────────────────────────
const handleValidationError = (err) => {
  const messages = Object.values(err.errors).map((e) => e.message);
  return new ApiError(422, `Validation error: ${messages.join('. ')}`);
};

// ── Main error handler ────────────────────────────────────
const errorHandler = (err, req, res, next) => {
  let error = err;

  // Transform known Mongoose/Mongo errors into ApiErrors
  if (err.name === 'CastError') error = handleCastError(err);
  if (err.code === 11000)        error = handleDuplicateKey(err);
  if (err.name === 'ValidationError') error = handleValidationError(err);

  const statusCode = error.statusCode || 500;
  const status     = error.status || 'error';

  // Log non-operational (unexpected) errors with full stack
  if (!error.isOperational) {
    logger.error(`[UNHANDLED] ${err.message}`, { stack: err.stack, url: req.originalUrl });
  }

  res.status(statusCode).json({
    status,
    message: error.message || 'Something went wrong',
    ...(error.errors?.length && { errors: error.errors }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

// ── 404 catch-all (place BEFORE errorHandler in app.js) ───
const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

module.exports = { errorHandler, notFound };