# OTT Claro Backend Simulation API

A RESTful API built with Express.js that provides backend services for the OTT Claro platform simulation. This API handles user sessions, navigation data, asset management, and content metadata.

## Table of Contents

- [Project Overview](#project-overview)
- [Setup Instructions](#setup-instructions)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [Environment Variables](#environment-variables)
- [Development Guide](#development-guide)

## Project Overview

The API Core Component is structured into several layers:

1. **API Layer**
   - REST endpoint implementations with Express.js
   - Request/response handling with proper validation
   - Swagger/OpenAPI documentation
   - Response formatting with consistent structure

2. **Service Layer**
   - Business logic implementation
   - Caching implementation for improved performance
   - Mock data generation for development

3. **Data Access Layer**
   - MongoDB integration for data persistence
   - Data models and schemas
   - Query optimization

4. **Cross-Cutting Concerns**
   - JWT-based authentication
   - Error handling middleware
   - Request logging
   - Performance monitoring

## Setup Instructions

1. **Prerequisites**
   - Node.js (v14 or higher)
   - MongoDB (v4.4 or higher)
   - npm or yarn package manager

2. **Installation**
   ```bash
   # Clone the repository
   git clone [repository-url]
   
   # Install dependencies
   npm install
   
   # Create .env file
   cp .env.example .env
   
   # Start the server
   npm start
   ```

3. **Verify Installation**
   - Access the API at: http://localhost:3000
   - View API documentation at: http://localhost:3000/api-docs

## API Documentation

### Core Endpoints

1. **User Start Header Info**
   ```http
   GET /api/user/startheaderinfo
   ```
   Initializes user session with device and region information.
   
   **Response:**
   ```json
   {
     "status": "success",
     "data": {
       "headerInfo": {
         "userId": "60d21b4667d0d8992e610c85",
         "displayName": "John Doe",
         "avatar": "https://example.com/avatar.jpg",
         "notifications": 5,
         "region": "US",
         "deviceId": "device123"
       }
     }
   }
   ```

2. **Navigation Structure**
   ```http
   GET /api/nav/data
   ```
   Retrieves hierarchical navigation structure.
   
   **Query Parameters:**
   - `region` (optional): Region code for localized navigation data
   
   **Response:**
   ```json
   {
     "status": "success",
     "data": {
       "navigation": [
         {
           "id": "home",
           "title": "Home",
           "path": "/home",
           "icon": "home",
           "children": []
         }
       ]
     }
   }
   ```

3. **Asset Configuration**
   ```http
   GET /api/apa/asset
   ```
   Gets device-specific asset configurations.
   
   **Query Parameters:**
   - `id` (required): Asset ID
   
   **Response:**
   ```json
   {
     "status": "success",
     "data": {
       "asset": {
         "id": "asset123",
         "title": "Sample Movie",
         "type": "movie",
         "duration": 7200,
         "streamUrl": "https://example.com/stream/asset123",
         "thumbnailUrl": "https://example.com/thumb/asset123",
         "availableUntil": "2024-12-31T23:59:59Z",
         "isHD": true,
         "hasSubtitles": true,
         "supportedFormats": ["HLS", "DASH"],
         "supportedResolutions": ["720p", "1080p"]
       }
     }
   }
   ```

4. **Metadata Configuration**
   ```http
   GET /api/apa/metadata
   ```
   Retrieves content metadata and parameters.
   
   **Query Parameters:**
   - `id` (required): Asset ID
   
   **Response:**
   ```json
   {
     "status": "success",
     "data": {
       "metadata": {
         "assetId": "asset123",
         "title": "Sample Movie",
         "description": "A sample movie description",
         "releaseYear": 2023,
         "genres": ["Action", "Drama"],
         "cast": ["Actor 1", "Actor 2"],
         "director": "Director Name",
         "rating": "PG-13",
         "language": "English",
         "subtitles": ["English", "Spanish"],
         "runtime": "120 minutes",
         "posterUrl": "https://example.com/poster/asset123",
         "trailerUrl": "https://example.com/trailer/asset123"
       }
     }
   }
   ```

## Authentication

The API uses JWT (JSON Web Token) based authentication:

1. **Login**
   ```http
   POST /api/auth/login
   ```
   **Request Body:**
   ```json
   {
     "email": "user@example.com",
     "password": "password123"
   }
   ```
   
   **Response:**
   ```json
   {
     "status": "success",
     "message": "Login successful",
     "data": {
       "user": {
         "id": "user123",
         "email": "user@example.com",
         "role": "user"
       },
       "tokens": {
         "accessToken": "eyJhbGciOiJIUzI1...",
         "refreshToken": "eyJhbGciOiJIUzI1..."
       }
     }
   }
   ```

2. **Token Refresh**
   ```http
   POST /api/auth/refresh-token
   ```
   **Request Body:**
   ```json
   {
     "refreshToken": "eyJhbGciOiJIUzI1..."
   }
   ```

3. **Using Authentication**
   - Add the access token to the Authorization header:
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1...
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/ott-claro-api

# JWT Configuration
JWT_SECRET=your-secret-key
JWT_EXPIRATION=1d

# API Configuration
API_VERSION=v1

# Cache Configuration
CACHE_DURATION=300  # 5 minutes in seconds
```

## Development Guide

1. **Project Structure**
   ```
   src/
   ├── config/         # Configuration files
   ├── controllers/    # Request handlers
   ├── db/            # Database connection and models
   ├── middleware/    # Custom middleware
   ├── models/        # Data models
   ├── routes/        # API routes
   ├── swagger/       # API documentation
   ├── types/         # TypeScript type definitions
   ├── utils/         # Utility functions
   └── server.js      # Application entry point
   ```

2. **Adding New Endpoints**
   - Create route file in `src/routes/`
   - Add controller in `src/controllers/`
   - Add Swagger documentation
   - Update tests

3. **Error Handling**
   - Use the provided error middleware
   - Follow the standard error response format
   - Include appropriate HTTP status codes

4. **Testing**
   ```bash
   # Run tests
   npm test
   
   # Run tests with coverage
   npm run test:coverage
   ```

5. **API Documentation**
   - Documentation is auto-generated from JSDoc comments
   - Available at `/api-docs` endpoint
   - Update Swagger definitions in route files

6. **Performance Considerations**
   - Use caching middleware for frequently accessed data
   - Implement pagination for large datasets
   - Monitor response times and optimize as needed