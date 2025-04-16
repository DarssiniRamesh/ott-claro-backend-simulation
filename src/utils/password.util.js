/**
 * Password utility functions
 * Utility functions for password hashing and verification
 */

const bcrypt = require('bcrypt');

/**
 * Hash a password using bcrypt
 * @PUBLIC_INTERFACE
 * @param {string} password - The plain text password to hash
 * @returns {Promise<string>} - The hashed password
 */
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

/**
 * Verify a password against a hash
 * @PUBLIC_INTERFACE
 * @param {string} password - The plain text password to verify
 * @param {string} hash - The hashed password to compare against
 * @returns {Promise<boolean>} - True if the password matches the hash, false otherwise
 */
const verifyPassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

/**
 * Validate password strength
 * @PUBLIC_INTERFACE
 * @param {string} password - The password to validate
 * @returns {Object} - Object containing validation result and message
 */
const validatePasswordStrength = (password) => {
  // Password must be at least 8 characters long
  if (password.length < 8) {
    return {
      isValid: false,
      message: 'Password must be at least 8 characters long'
    };
  }
  
  // Password must contain at least one uppercase letter, one lowercase letter, and one number
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  
  if (!hasUppercase || !hasLowercase || !hasNumber) {
    return {
      isValid: false,
      message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    };
  }
  
  return {
    isValid: true,
    message: 'Password is strong'
  };
};

module.exports = {
  hashPassword,
  verifyPassword,
  validatePasswordStrength
};
