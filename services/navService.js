const fs = require('fs');
const path = require('path');

class NavService {
  /**
   * PUBLIC_INTERFACE
   * Get navigation data with device information
   * @param {Object} navParams - Navigation parameters including device info
   * @returns {Object} Navigation data response
   */
  getNavigationData(navParams = {}) {
    try {
      // Read navigation data
      console.log('Reading navigation data from: navigation.json');
      const navData = require('./dataAccess').readJsonFile('navigation.json');
      console.log('Navigation data read:', navData);

      // Construct response with navigation data and device info
      const response = {
        entry: {
          authpn: navParams.authpn || "tataelxsi",
          authpt: navParams.authpt || "vofee7ohhecai",
          device_category: navParams.device_category || "stb",
          device_type: navParams.device_type || "ptv",
          device_model: navParams.device_model || "androidTV",
          device_manufacturer: navParams.device_manufacturer || "ZTE",
          HKS: navParams.HKS || "63eb2f6aebf9b",
          api_version: navParams.api_version || "v5.93",
          region: navParams.region || "peru",
          device_id: navParams.device_id || "ZTEATV41200438564",
          device_so: navParams.device_so || "Android 10",
          format: "json",
          device_name: navParams.device_name || "B866V2_AMX_ATV_PE"
        },
        response: {
          nodes: navData.nodes || []
        },
        status: 0,
        msg: "OK"
      };

      // Return response object (not stringified)
      console.log('Sending navigation response:', response);
      return response;

    } catch (error) {
      // Return error response object (not stringified)
      return {
        entry: {
          authpn: "",
          authpt: "",
          device_category: "",
          device_type: "",
          device_model: "",
          device_manufacturer: "",
          HKS: "",
          api_version: "",
          region: "",
          device_id: "",
          device_so: "",
          format: "json",
          device_name: ""
        },
        response: {
          nodes: []
        },
        status: 1,
        msg: String(error.message || "Unknown error")
      };
    }
  }
}

module.exports = NavService;