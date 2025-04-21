const userService = require('../services/userService');

// PUBLIC_INTERFACE
const startHeaderInfo = async (req, res, next) => {
  try {
    const { authpn, authpt } = req.query;
    
    // Validate authentication parameters
    if (!authpn || !authpt) {
      const error = new Error('Missing required authentication parameters: authpn and authpt');
      error.statusCode = 400;
      throw error;
    }

    if (authpn !== 'tataelxsi' || authpt !== 'vofee7ohhecai') {
      const error = new Error('Invalid authentication credentials');
      error.statusCode = 401;
      throw error;
    }

    // Get client IP address with enhanced IPv6 support
    let clientIp = req.headers['x-forwarded-for']?.split(',')[0].trim() ||
                  req.headers['x-real-ip'] ||
                  req.headers['cf-connecting-ip'] ||
                  req.headers['x-client-ip'] ||
                  req.socket.remoteAddress;
    
    if (!clientIp) {
      const error = new Error('Unable to determine client IP address');
      error.statusCode = 500;
      throw error;
    }

    // Clean IPv6 formats
    if (clientIp === '::1' || clientIp === '::ffff:127.0.0.1' || clientIp === '::ffff:localhost') {
      clientIp = '127.0.0.1';
    } else if (clientIp.includes(':')) {
      // Handle IPv6 addresses
      if (clientIp.startsWith('::ffff:')) {
        // IPv4-mapped IPv6 address
        clientIp = clientIp.substring(7);
      } else {
        // Pure IPv6 address - keep as is for geoip lookup
        clientIp = clientIp.split('%')[0]; // Remove scope ID if present
      }
    }

    const headerInfo = await userService.getHeaderInfo(clientIp);
    res.status(200).json(headerInfo);
  } catch (error) {
    // Enhanced error handling with specific status codes
    if (!error.statusCode) {
      if (error.message.includes('authentication')) {
        error.statusCode = 401;
      } else if (error.message.includes('client IP')) {
        error.statusCode = 500;
      } else if (error.message.includes('required')) {
        error.statusCode = 400;
      } else {
        error.statusCode = 500;
      }
    }
    next(error);
  }
};

module.exports = {
  startHeaderInfo
};
