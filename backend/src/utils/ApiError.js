/**
 * Operational (expected) API errors — caught by the global error handler.
 * Programming errors should NOT use this class (let them crash/log).
 */
class ApiError extends Error {
  constructor(statusCode, message, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.errors = errors; // validation error array
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;