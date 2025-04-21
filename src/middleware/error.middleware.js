'use strict';

const winston = require('winston');

// Configure winston logger
const logger = winston.createLogger({
  level: 'error',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log' })
  ]
});

/**
 * Base error class for custom errors
 * @class BaseError
 * @extends Error
 */
class BaseError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 404 Not Found Error
 * @class NotFoundError
 * @extends BaseError
 */
class NotFoundError extends BaseError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

/**
 * 400 Validation Error
 * @class ValidationError
 * @extends BaseError
 */
class ValidationError extends BaseError {
  constructor(message = 'Validation failed') {
    super(message, 400);
  }
}

/**
 * 401 Authentication Error
 * @class AuthenticationError
 * @extends BaseError
 */
class AuthenticationError extends BaseError {
  constructor(message = 'Authentication failed') {
    super(message, 401);
  }
}

/**
 * 403 Authorization Error
 * @class AuthorizationError
 * @extends BaseError
 */
class AuthorizationError extends BaseError {
  constructor(message = 'Not authorized') {
    super(message, 403);
  }
}

/**
 * 500 Database Error
 * @class DatabaseError
 * @extends BaseError
 */
class DatabaseError extends BaseError {
  constructor(message = 'Database operation failed') {
    super(message, 500, true);
  }
}

/**
 * Map MongoDB errors to custom error classes
 * @param {Error} err - MongoDB error
 * @returns {BaseError} Mapped custom error
 */
function handleMongoError(err) {
  if (err.name === 'ValidationError') {
    return new ValidationError(err.message);
  }
  if (err.name === 'CastError') {
    return new ValidationError('Invalid ID format');
  }
  if (err.code === 11000) {
    return new ValidationError('Duplicate key error');
  }
  return new DatabaseError(err.message);
}

/**
 * Map JWT errors to custom error classes
 * @param {Error} err - JWT error
 * @returns {BaseError} Mapped custom error
 */
function handleJWTError(err) {
  if (err.name === 'JsonWebTokenError') {
    return new AuthenticationError('Invalid token');
  }
  if (err.name === 'TokenExpiredError') {
    return new AuthenticationError('Token expired');
  }
  return new AuthenticationError(err.message);
}

/**
 * Format error response
 * @param {BaseError} err - Error object
 * @returns {Object} Formatted error response
 */
function formatError(err) {
  return {
    status: 'error',
    code: err.statusCode || 500,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  };
}

/**
 * Global error handling middleware
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
function errorHandler(err, req, res, next) {
  let error = err;

  // Log error
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body,
    query: req.query,
    params: req.params,
    headers: req.headers
  });

  // Map known errors
  if (err.name && err.name.includes('Mongo')) {
    error = handleMongoError(err);
  } else if (err.name && err.name.includes('JWT')) {
    error = handleJWTError(err);
  } else if (!(err instanceof BaseError)) {
    // Handle unknown errors
    error = new BaseError(
      'Internal Server Error',
      500,
      false
    );
  }

  // Send error response
  res.status(error.statusCode).json(formatError(error));
}

// Export all error classes and the error handler
module.exports = {
  BaseError,
  NotFoundError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  DatabaseError,
  errorHandler
};
