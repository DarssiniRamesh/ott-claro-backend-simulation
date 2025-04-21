const { v4: uuidv4 } = require('uuid');
const moment = require('moment-timezone');
const geoip = require('geoip-lite');
const dbService = require('./dbService');

// Helper function to get client IP and geolocation
const DEFAULT_REGION = 'US';
const DEFAULT_TIMEZONE = 'America/New_York';

/**
 * Get location information from IP address with enhanced error handling
 * @param {string} ip - IPv4 or IPv6 address
 * @returns {Object} Location info with region and timezone
 */
const getLocationInfo = (ip) => {
  // Default values for development/local environment
  if (ip === '127.0.0.1' || ip === 'localhost') {
    return { region: DEFAULT_REGION, timezone: DEFAULT_TIMEZONE };
  }

  if (!ip) {
    console.warn('No IP address provided');
    return { region: DEFAULT_REGION, timezone: DEFAULT_TIMEZONE };
  }

  try {
    const geo = geoip.lookup(ip);
    if (!geo) {
      console.warn(`Unable to determine location for IP: ${ip}`);
      return { region: DEFAULT_REGION, timezone: DEFAULT_TIMEZONE };
    }

    // Enhanced timezone validation
    let timezone = DEFAULT_TIMEZONE;
    if (geo.timezone) {
      const zone = moment.tz.zone(geo.timezone);
      if (zone) {
        // Verify timezone is valid and currently active
        const now = moment();
        if (zone.utcOffset(now.unix())) {
          timezone = geo.timezone;
        }
      }
    }

    // Validate region format (should be 2-letter code)
    const region = geo.region && /^[A-Z]{2}$/.test(geo.region)
      ? geo.region
      : DEFAULT_REGION;

    return { region, timezone };
  } catch (error) {
    console.error(`Error in geolocation lookup for IP ${ip}:`, error);
    return { region: DEFAULT_REGION, timezone: DEFAULT_TIMEZONE };
  }
};

// PUBLIC_INTERFACE
const getHeaderInfo = async (clientIp) => {
  const locationInfo = getLocationInfo(clientIp);
  // Ensure we're using moment-timezone for all operations
  // Ensure UTC base time
  const now = moment().tz('UTC');
  
  // Create local time with timezone validation
  const localTime = now.clone().tz(locationInfo.timezone);
  if (!localTime.isValid()) {
    console.error(`Invalid timezone conversion for ${locationInfo.timezone}`);
    // Fallback to UTC
    localTime = now.clone();
  }
  
  return {
    region: locationInfo.region,
    session_stringvalue: uuidv4(),
    session_parametername: 'HKS',
    date: localTime.format('YYYY-MM-DD'),
    time: localTime.format('HH:mm:ss'),
    timezone: locationInfo.timezone,
    utc: now.toISOString(),  // Use ISO format for better compatibility
    local_time: localTime.format('YYYY-MM-DD HH:mm:ss Z'),  // Include timezone offset
    offset: localTime.format('Z')  // Add explicit offset information
  };
};

module.exports = {
  getHeaderInfo
};
