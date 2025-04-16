/**
 * User model definition
 * Defines the Mongoose schema and model for users
 */

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/env.config');

/**
 * User Schema
 * @typedef {Object} User
 * @property {string} email - The email of the user (unique)
 * @property {string} password - The hashed password of the user
 * @property {string} role - The role of the user (user, admin)
 * @property {Object} profile - The profile information of the user
 * @property {string} profile.firstName - The first name of the user
 * @property {string} profile.lastName - The last name of the user
 * @property {string} profile.avatar - The avatar URL of the user
 * @property {string} profile.phone - The phone number of the user
 * @property {string} refreshToken - The refresh token for JWT authentication
 * @property {Date} createdAt - The date the user was created
 * @property {Date} updatedAt - The date the user was last updated
 */
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false // Don't include password in query results by default
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  profile: {
    firstName: {
      type: String,
      trim: true
    },
    lastName: {
      type: String,
      trim: true
    },
    avatar: {
      type: String,
      default: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
    },
    phone: {
      type: String,
      trim: true
    }
  },
  refreshToken: {
    type: String,
    select: false // Don't include refresh token in query results by default
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  versionKey: false
});

/**
 * Pre-save hook to hash password before saving
 */
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password along with the new salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Method to compare password for login
 * @param {string} candidatePassword - The password to compare
 * @returns {Promise<boolean>} - True if passwords match, false otherwise
 */
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Method to generate an access token
 * @returns {string} - JWT access token
 */
userSchema.methods.generateAccessToken = function() {
  const payload = {
    id: this._id,
    email: this.email,
    role: this.role
  };
  
  return jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRATION
  });
};

/**
 * Method to generate a refresh token
 * @returns {string} - JWT refresh token
 */
userSchema.methods.generateRefreshToken = function() {
  const payload = {
    id: this._id,
    type: 'refresh'
  };
  
  // Refresh token has a longer expiration time
  const refreshToken = jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: '7d' // 7 days
  });
  
  // Save the refresh token to the user document
  this.refreshToken = refreshToken;
  
  return refreshToken;
};

/**
 * Method to generate auth tokens (both access and refresh)
 * @returns {Object} - Object containing access and refresh tokens
 */
userSchema.methods.generateAuthTokens = async function() {
  const accessToken = this.generateAccessToken();
  const refreshToken = this.generateRefreshToken();
  
  // Save the user with the new refresh token
  await this.save();
  
  return {
    accessToken,
    refreshToken
  };
};

/**
 * Method to get public profile (without sensitive data)
 * @returns {Object} - User's public profile
 */
userSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  
  // Remove sensitive fields
  delete userObject.password;
  delete userObject.refreshToken;
  
  return userObject;
};

// Create and export the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
