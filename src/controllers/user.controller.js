/**
 * User controller
 * Controller functions for user management operations
 */

const User = require('../models/user.model');
const { ApiError } = require('../middleware/error.middleware');
const { sanitizeInput } = require('../utils/sanitize.util');

/**
 * Initialize user session with device and region information
 * @PUBLIC_INTERFACE
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const startHeaderInfo = async (req, res, next) => {
  try {
    const { deviceId, region, platform, appVersion } = sanitizeInput(req.body);

    // Validate required fields
    if (!deviceId || !region || !platform || !appVersion) {
      throw new ApiError(400, 'All fields are required: deviceId, region, platform, appVersion');
    }

    // Mock user header info response
    const headerInfo = {
      userId: req.user.id,
      displayName: req.user.displayName || 'User',
      avatar: req.user.avatar || 'https://example.com/default-avatar.png',
      notifications: 0,
      region,
      deviceId
    };

    res.json({
      status: 'success',
      data: headerInfo
    });
  } catch (error) {
    next(error);
  }
};
const { validatePasswordStrength } = require('../utils/password.util');
const jwt = require('jsonwebtoken');
const config = require('../config/env.config');

/**
 * Register a new user
 * @PUBLIC_INTERFACE
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const registerUser = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      throw new ApiError(400, 'Please provide email and password');
    }
    
    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      throw new ApiError(400, 'Please provide a valid email address');
    }
    
    // Validate password strength
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      throw new ApiError(400, passwordValidation.message);
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(409, 'User with this email already exists');
    }
    
    // Create new user
    const user = new User({
      email,
      password,
      profile: {
        firstName: firstName || '',
        lastName: lastName || '',
        phone: phone || ''
      }
    });
    
    // Save user to database
    await user.save();
    
    // Generate tokens
    const tokens = await user.generateAuthTokens();
    
    // Return user data and tokens
    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: {
        user: user.getPublicProfile(),
        tokens
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 * @PUBLIC_INTERFACE
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      throw new ApiError(400, 'Please provide email and password');
    }
    
    // Find user by email and include password field
    const user = await User.findOne({ email }).select('+password');
    
    // Check if user exists and password is correct
    if (!user || !(await user.comparePassword(password))) {
      throw new ApiError(401, 'Invalid credentials');
    }
    
    // Generate tokens
    const tokens = await user.generateAuthTokens();
    
    // Return user data and tokens
    res.json({
      status: 'success',
      message: 'Login successful',
      data: {
        user: user.getPublicProfile(),
        tokens
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Refresh access token using refresh token
 * @PUBLIC_INTERFACE
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      throw new ApiError(400, 'Refresh token is required');
    }
    
    // Verify refresh token
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, config.JWT_SECRET);
    } catch (error) {
      throw new ApiError(401, 'Invalid or expired refresh token');
    }
    
    // Check if token is a refresh token
    if (decoded.type !== 'refresh') {
      throw new ApiError(401, 'Invalid token type');
    }
    
    // Find user by ID and include refreshToken field
    const user = await User.findById(decoded.id).select('+refreshToken');
    
    if (!user || user.refreshToken !== refreshToken) {
      throw new ApiError(401, 'Invalid refresh token');
    }
    
    // Generate new tokens
    const tokens = await user.generateAuthTokens();
    
    // Return new tokens
    res.json({
      status: 'success',
      message: 'Token refreshed successfully',
      data: {
        tokens
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user profile
 * @PUBLIC_INTERFACE
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const getCurrentUser = async (req, res, next) => {
  try {
    // User is already set in req.user by the authenticate middleware
    const user = await User.findById(req.user.id);
    
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    
    res.json({
      status: 'success',
      data: {
        user: user.getPublicProfile()
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user profile
 * @PUBLIC_INTERFACE
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, phone, avatar } = req.body;
    
    // Find user by ID
    const user = await User.findById(req.user.id);
    
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    
    // Update profile fields if provided
    if (firstName !== undefined) user.profile.firstName = firstName;
    if (lastName !== undefined) user.profile.lastName = lastName;
    if (phone !== undefined) user.profile.phone = phone;
    if (avatar !== undefined) user.profile.avatar = avatar;
    
    // Save updated user
    await user.save();
    
    res.json({
      status: 'success',
      message: 'Profile updated successfully',
      data: {
        user: user.getPublicProfile()
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Change user password
 * @PUBLIC_INTERFACE
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Validate required fields
    if (!currentPassword || !newPassword) {
      throw new ApiError(400, 'Please provide current password and new password');
    }
    
    // Validate password strength
    const passwordValidation = validatePasswordStrength(newPassword);
    if (!passwordValidation.isValid) {
      throw new ApiError(400, passwordValidation.message);
    }
    
    // Find user by ID and include password field
    const user = await User.findById(req.user.id).select('+password');
    
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    
    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      throw new ApiError(401, 'Current password is incorrect');
    }
    
    // Update password
    user.password = newPassword;
    
    // Save updated user
    await user.save();
    
    res.json({
      status: 'success',
      message: 'Password changed successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Logout user (invalidate refresh token)
 * @PUBLIC_INTERFACE
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const logoutUser = async (req, res, next) => {
  try {
    // Find user by ID
    const user = await User.findById(req.user.id);
    
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    
    // Clear refresh token
    user.refreshToken = null;
    
    // Save updated user
    await user.save();
    
    res.json({
      status: 'success',
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user header information
 * @PUBLIC_INTERFACE
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const getStartHeaderInfo = async (req, res, next) => {
  try {
    const { deviceId, region, platform, appVersion } = sanitizeInput(req.body);

    // Validate required fields
    if (!deviceId || !region || !platform || !appVersion) {
      throw new ApiError(400, 'Missing required fields: deviceId, region, platform, appVersion');
    }

    // User is already set in req.user by the authenticate middleware
    const user = await User.findById(req.user.id);
    
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    
    // Create header info object with device and region information
    const headerInfo = {
      userId: user._id,
      displayName: `${user.profile.firstName} ${user.profile.lastName}`.trim(),
      avatar: user.profile.avatar,
      notifications: 5, // Mock notification count
      region,
      deviceId,
      platform,
      lastUpdated: new Date().toISOString()
    };
    
    res.json({
      status: 'success',
      data: {
        headerInfo
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  startHeaderInfo,
  registerUser,
  loginUser,
  refreshToken,
  getCurrentUser,
  updateProfile,
  changePassword,
  logoutUser,
  getStartHeaderInfo
};
