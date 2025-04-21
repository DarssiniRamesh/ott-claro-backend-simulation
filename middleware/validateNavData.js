/**
 * Validates navigation data request parameters
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const validateNavData = (req, res, next) => {
  const {
    authpn,
    authpt,
    device_category,
    device_type,
    device_model,
    device_manufacturer,
    HKS,
    api_version,
    region,
    device_id
  } = req.query;

  // Validate all required parameters are present and are strings
  const requiredParams = {
    authpn,
    authpt,
    device_category,
    device_type,
    device_model,
    device_manufacturer,
    HKS,
    api_version,
    region,
    device_id
  };

  for (const [param, value] of Object.entries(requiredParams)) {
    if (!value || typeof value !== 'string') {
      return res.status(400).json({
        entry: {},
        response: {},
        status: 1,
        msg: `ERROR: Missing or invalid ${param}`
      });
    }
  }

  // Validate fixed values
  const fixedValues = {
    authpn: 'tataelxsi',
    authpt: 'vofee7ohhecai',
    device_category: 'stb',
    device_model: 'androidTV',
    device_manufacturer: 'ZTE',
    api_version: 'v5.93'
  };

  for (const [param, expectedValue] of Object.entries(fixedValues)) {
    if (req.query[param] !== expectedValue) {
      return res.status(400).json({
        entry: {},
        response: {},
        status: 1,
        msg: `ERROR: Invalid ${param}. Expected: ${expectedValue}`
      });
    }
  }

  // Validate device_type
  if (!['ptv', 'ott'].includes(device_type)) {
    return res.status(400).json({
      entry: {},
      response: {},
      status: 1,
      msg: 'ERROR: Invalid device_type. Expected: ptv or ott'
    });
  }

  // Store validated parameters in request object
  req.navParams = {
    authpn,
    authpt,
    device_category,
    device_type,
    device_model,
    device_manufacturer,
    HKS,
    api_version,
    region,
    device_id
  };

  next();
};

module.exports = validateNavData;
