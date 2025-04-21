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

  // Check for required parameters
  if (!authpn || !authpt || !device_category || !device_type || !device_model ||
      !device_manufacturer || !HKS || !api_version || !region || !device_id) {
    return res.status(400).json({
      entry: {},
      response: {},
      status: 1,
      msg: 'ERROR: Missing required parameters'
    });
  }

  // Validate fixed values
  if (authpn !== 'tataelxsi') {
    return res.status(400).json({
      entry: {},
      response: {},
      status: 1,
      msg: 'ERROR: Invalid authpn value'
    });
  }

  if (authpt !== 'vofee7ohhecai') {
    return res.status(400).json({
      entry: {},
      response: {},
      status: 1,
      msg: 'ERROR: Invalid authpt value'
    });
  }

  if (device_category !== 'stb') {
    return res.status(400).json({
      entry: {},
      response: {},
      status: 1,
      msg: 'ERROR: Invalid device_category value'
    });
  }

  if (!['ptv', 'ott'].includes(device_type)) {
    return res.status(400).json({
      entry: {},
      response: {},
      status: 1,
      msg: 'ERROR: Invalid device_type value'
    });
  }

  if (device_model !== 'androidTV') {
    return res.status(400).json({
      entry: {},
      response: {},
      status: 1,
      msg: 'ERROR: Invalid device_model value'
    });
  }

  if (device_manufacturer !== 'ZTE') {
    return res.status(400).json({
      entry: {},
      response: {},
      status: 1,
      msg: 'ERROR: Invalid device_manufacturer value'
    });
  }

  if (api_version !== 'v5.93') {
    return res.status(400).json({
      entry: {},
      response: {},
      status: 1,
      msg: 'ERROR: Invalid api_version value'
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
