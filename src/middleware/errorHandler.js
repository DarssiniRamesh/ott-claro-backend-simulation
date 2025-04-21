/**
 * Custom error classes for different types of API errors
 */
class ApiError extends Error {
  constructor(message, code, status = 500) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

class ValidationError extends ApiError {
  constructor(message, validationErrors = []) {
    super(message, 'VALIDATION_ERROR', 400);
    this.validationErrors = validationErrors;
  }
}

class AuthenticationError extends ApiError {
  constructor(message = 'Authentication required') {
    super(message, 'AUTHENTICATION_ERROR', 401);
  }
}

class AuthorizationError extends ApiError {
  constructor(message = 'Insufficient permissions') {
    super(message, 'AUTHORIZATION_ERROR', 403);
  }
}

class NotFoundError extends ApiError {
  constructor(message = 'Resource not found') {
    super(message, 'NOT_FOUND', 404);
  }
}

/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  // Log error for debugging
  console.error(err);

  // Default error response
  const errorResponse = {
    status: 'error',
    message: err.message || 'Internal server error',
    code: err.code || 'INTERNAL_ERROR'
  };

  // Add validation errors if present
  if (err instanceof ValidationError && err.validationErrors) {
    errorResponse.validationErrors = err.validationErrors;
  }

  // Add error details in development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.details = err.stack;
  }

  // Set HTTP status code
  const statusCode = err.status || 500;

  res.status(statusCode).json(errorResponse);
};

module.exports = {
  errorHandler,
  ApiError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError
};
