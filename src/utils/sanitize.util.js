const xss = require('xss');

/**
 * Sanitizes input object by removing potential XSS threats
 * @param {Object} input - Input object to sanitize
 * @returns {Object} Sanitized object
 */
const sanitizeInput = (input) => {
  if (typeof input !== 'object' || input === null) {
    return input;
  }

  const sanitized = {};

  for (const [key, value] of Object.entries(input)) {
    if (typeof value === 'string') {
      sanitized[key] = xss(value.trim());
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeInput(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
};

module.exports = {
  sanitizeInput
};
