# OTT Claro Backend Simulation API

## Project Overview

The API Core Component is a robust backend simulation service designed to support OTT (Over-The-Top) content delivery platforms. This service provides essential endpoints for user session management, navigation structure, and asset configuration.

### Key Features

- User session initialization with device and region support
- Hierarchical navigation structure retrieval
- Device-specific asset configuration management
- Content metadata configuration
- Cross-cutting concerns implementation (error handling, logging)
- RESTful API architecture

## Installation & Setup

### Prerequisites

- Node.js (v12 or higher)
- npm (Node Package Manager)

### Installation Steps

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd ott-claro-backend-simulation
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```env
   PORT=3000
   ```

### Running the Application

- Development mode (with auto-reload):
  ```bash
  npm run dev
  ```

- Production mode:
  ```bash
  npm start
  ```

## API Documentation

### 1. User Session Management

#### Start Header Info
- **Endpoint:** `GET /user/startheaderinfo`
- **Purpose:** Initialize user session with device and region information
- **Query Parameters:**
  - `deviceInfo`: JSON string containing device information (required)
    ```json
    {
      "type": "string",
      "model": "string"
    }
    ```
  - `region`: Geographic region code (required)
- **Response:** `201 Created`
  ```json
  {
    "sessionId": "string",
    "timestamp": "string"
  }
  ```

### 2. Navigation Structure

#### Get Navigation Data
- **Endpoint:** `GET /nav/data`
- **Purpose:** Retrieve hierarchical navigation structure
- **Response:** `200 OK`
  ```json
  {
    "navigation": [
      {
        "id": "string",
        "title": "string",
        "children": []
      }
    ]
  }
  ```

### 3. Asset Configuration

#### Get Asset Configuration
- **Endpoint:** `GET /apa/asset`
- **Query Parameters:**
  - `deviceType` (required): Type of device requesting asset configuration
- **Response:** `200 OK`
  ```json
  {
    "assetConfig": {
      "deviceType": "string",
      "settings": {}
    }
  }
  ```

#### Get Metadata Configuration
- **Endpoint:** `GET /apa/metadata`
- **Purpose:** Retrieve content metadata and parameters
- **Response:** `200 OK`
  ```json
  {
    "metadata": {
      "parameters": {},
      "configurations": {}
    }
  }
  ```

## Project Structure

```
├── controllers/          # Request handlers
│   ├── apaController.js
│   ├── navController.js
│   └── userController.js
├── routes/              # API route definitions
│   ├── apaRoutes.js
│   ├── navRoutes.js
│   └── userRoutes.js
├── services/            # Business logic layer
│   ├── apaService.js
│   ├── dbService.js
│   ├── navService.js
│   └── userService.js
├── middleware/          # Custom middleware
│   └── errorHandler.js
├── data/                # Data storage
│   └── db.json
├── logs/                # Application logs
├── server.js            # Application entry point
└── package.json         # Project configuration
```

### Component Descriptions

- **controllers/**: Contains request handlers that process incoming HTTP requests
- **routes/**: Defines API endpoints and routes requests to appropriate controllers
- **services/**: Implements business logic and data processing
- **middleware/**: Custom middleware functions including error handling
- **data/**: Local data storage using JSON files
- **logs/**: Application log files

## Development Guide

### Local Development Setup

1. Ensure all prerequisites are installed
2. Follow the installation steps above
3. Configure environment variables in `.env`
4. Start the development server with `npm run dev`

## Testing Instructions

### Prerequisites

1. Node.js (v12 or higher)
2. npm (Node Package Manager)
3. A REST API client (e.g., Postman, cURL, or any HTTP client)
4. Access to the development environment

### Environment Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```
   The server will start on port 3000 by default (or the port specified in your .env file)

### Testing the /apa/metadata Endpoint

#### Endpoint Details
- **Method:** GET
- **URL:** `http://localhost:3000/apa/metadata`
- **Purpose:** Retrieve content metadata and parameters for device configuration

#### Required Query Parameters

All parameters are mandatory and some have specific fixed values:

| Parameter | Required | Fixed Value | Description |
|-----------|----------|-------------|-------------|
| authpn | Yes | tataelxsi | Authentication parameter name |
| authpt | Yes | vofee7ohhecai | Authentication parameter token |
| device_category | Yes | stb | Device category |
| device_type | Yes | - | Device type (e.g., ptv, ott) |
| device_model | Yes | androidTV | Device model |
| device_manufacturer | Yes | ZTE | Device manufacturer |
| api_version | Yes | v5.93 | API version |
| region | Yes | - | User region |
| user_id | Yes | - | User ID (must be an integer) |
| sessionKey | Yes | - | Session key |

#### Example Request

```bash
curl -X GET 'http://localhost:3000/apa/metadata?authpn=tataelxsi&authpt=vofee7ohhecai&device_category=stb&device_type=ott&device_model=androidTV&device_manufacturer=ZTE&api_version=v5.93&region=US&user_id=12345&sessionKey=abc123'
```

#### Example Response

```json
{
  "translations": {},
  "sprites_configuration": {},
  "atv_hide_pack_logo": false,
  "third_party_epg_apps": [],
  "logs_dashboard_url": "https://logs.example.com",
  "lms_bootstrap_url": "https://lms.example.com",
  "byr_filterlist_configuration": {},
  "time_to_get_favs": 300000,
  "sentinel_reminders_interval": 60000,
  "pin_use_channel_rating_flow": true,
  "time_to_get_recordings": 300000,
  "onboarding": {},
  "interval_time_check_epg_version": 3600000,
  "interval_time_check_lineal_channels": 300000,
  "fast_forward_rewind_option": {},
  "supported_stream": ["HLS", "DASH"],
  "isloggedin_refresh_hours_time": 24,
  "atv_max_buffer_ms": 30000,
  "atv_min_buffer_ms": 15000,
  "atv_rebuffer_ms": 5000,
  "atv_start_buffer_ms": 10000,
  "myaccount_configuration": {},
  "fallback_interval_time": 60000
}
```

#### Response Status Codes

- **200:** Successful request
- **400:** Validation error (missing or invalid parameters)
- **401:** Authentication failed
- **500:** Server error

#### Troubleshooting Guide

1. **400 Bad Request**
   - Verify all required parameters are included
   - Check that fixed values match exactly (case-sensitive)
   - Ensure user_id is a valid integer
   - Verify parameter names are spelled correctly

2. **401 Unauthorized**
   - Verify authpn and authpt values are correct
   - Check if sessionKey is valid

3. **500 Server Error**
   - Verify the server is running
   - Check server logs for detailed error information
   - Ensure database connection is working

#### Common Issues and Solutions

1. **Parameter Validation Errors**
   - **Issue:** "authpn is required" or similar messages
   - **Solution:** Ensure all required parameters are included in the request

2. **Invalid Fixed Values**
   - **Issue:** "Invalid device_category. Expected: stb"
   - **Solution:** Use exact fixed values as specified in the parameters table

3. **User ID Format**
   - **Issue:** "user_id must be an integer"
   - **Solution:** Ensure user_id is a valid number without decimals

4. **Connection Issues**
   - **Issue:** Cannot connect to server
   - **Solution:** Verify server is running and port is correct

### Running Automated Tests

1. Create test files in a `tests/` directory
2. Run tests using:
   ```bash
   npm test
   ```

### Error Handling

The application implements centralized error handling through the `errorHandler.js` middleware. Common error responses include:

- `400 Bad Request`: Missing or invalid parameters
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server-side errors

Errors are returned in the following format:
```json
{
  "error": {
    "message": "Error description",
    "statusCode": 400
  }
}
```

### Best Practices

1. Use async/await for asynchronous operations
2. Implement proper error handling in controllers
3. Follow the established project structure
4. Document new endpoints in this README
5. Use meaningful commit messages

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

[License Information]
