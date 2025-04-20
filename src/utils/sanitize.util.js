/**
 * Utility functions for input sanitization
 */

const xss = require('xss');

/**
 * Sanitizes input data to prevent XSS attacks and other malicious inputs
 * @PUBLIC_INTERFACE
 * @param {*} input - Input data to sanitize (string, object, or array)
 * @returns {*} Sanitized data
 */
const sanitizeInput = (input) => {
  // Return null/undefined as is
  if (input == null) {
    return input;
  }

  // Handle different input types
  if (typeof input === 'string') {
    // Sanitize string input
    return xss(input.trim());
  } else if (Array.isArray(input)) {
    // Recursively sanitize array elements
    return input.map(item => sanitizeInput(item));
  } else if (typeof input === 'object') {
    // Recursively sanitize object properties
    const sanitized = {};
    for (const [key, value] of Object.entries(input)) {
      sanitized[key] = sanitizeInput(value);
    }
    return sanitized;
  }

  // Return other types (number, boolean, etc.) as is
  return input;
};

/**
 * Sanitizes a MongoDB query object to prevent NoSQL injection
 * @PUBLIC_INTERFACE
 * @param {Object} query - MongoDB query object
 * @returns {Object} Sanitized query object
 */
const sanitizeMongoQuery = (query) => {
  const sanitized = {};

  for (const [key, value] of Object.entries(query)) {
    // Skip MongoDB operators
    if (key.startsWith('$')) {
      continue;
    }

    // Sanitize values
    if (typeof value === 'string') {
      sanitized[key] = xss(value.trim());
    } else if (typeof value === 'object' && value !== null) {
      // Handle nested objects and operators
      if (Object.keys(value).some(k => k.startsWith('$'))) {
        // Contains MongoDB operators, preserve structure but sanitize values
        sanitized[key] = Object.entries(value).reduce((acc, [op, val]) => {
          acc[op] = op.startsWith('$') ? val : sanitizeInput(val);
          return acc;
        }, {});
      } else {
        // Regular nested object
        sanitized[key] = sanitizeMongoQuery(value);
      }
    } else {
      // Keep other types as is
      sanitized[key] = value;
    }
  }

  return sanitized;
};

/**
 * Sanitizes URL parameters
 * @PUBLIC_INTERFACE
 * @param {Object} params - URL parameters object
 * @returns {Object} Sanitized parameters object
 */
const sanitizeUrlParams = (params) => {
  const sanitized = {};

  for (const [key, value] of Object.entries(params)) {
    if (typeof value === 'string') {
      // Remove any HTML/script tags and trim whitespace
      sanitized[key] = xss(value.trim());
    } else {
      // Keep non-string values as is
      sanitized[key] = value;
    }
  }

  return sanitized;
};

module.exports = {
  sanitizeInput,
  sanitizeMongoQuery,
  sanitizeUrlParams
};
