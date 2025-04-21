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

### Testing

To implement tests, follow these steps:

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
