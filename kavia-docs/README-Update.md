# OTT Claro Backend Simulation API

A RESTful API service that provides backend functionality for OTT streaming platform simulation, built with Express.js and MongoDB.

## Project Overview

This API service provides core functionality for an OTT streaming platform, including user session management, navigation structure, asset configuration, and content metadata. The service is designed with a layered architecture consisting of:

- API Layer for request/response handling and input validation using TypeScript types
- Service Layer for business logic and caching
- Data Access Layer for MongoDB interactions with Mongoose schemas
- Cross-cutting concerns like authentication, error handling, and logging

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/DarssiniRamesh/ott-claro-backend-simulation.git
cd ott-claro-backend-simulation
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```bash
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ott-claro-api
JWT_SECRET=your-secret-key
JWT_EXPIRATION=1d
API_VERSION=v1
CACHE_DURATION=300
```

4. Start the server:
```bash
npm start
```

The API will be available at `http://localhost:3000/api` and the Swagger documentation at `http://localhost:3000/api-docs`.

## API Documentation

### Authentication

The API uses JWT (JSON Web Token) for authentication. Protected endpoints require a valid Bearer token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

To obtain a token, use the authentication endpoints:

#### Login
**Endpoint:** POST /auth/login

**Request Schema:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response Schema:**
```json
{
  "status": "success",
  "data": {
    "accessToken": "string",
    "refreshToken": "string",
    "user": {
      "id": "string",
      "email": "string",
      "role": "user | admin",
      "profile": {
        "firstName": "string",
        "lastName": "string",
        "avatar": "string",
        "phone": "string"
      }
    }
  }
}
```

#### Refresh Token
**Endpoint:** POST /auth/refresh

**Request Schema:**
```json
{
  "refreshToken": "string"
}
```

**Response Schema:**
```json
{
  "status": "success",
  "data": {
    "accessToken": "string"
  }
}
```

### Core API Endpoints

### 1. User Start Header Info

Initialize user session with device and region information.

**Endpoint:** POST /user/startheaderinfo

**Request Schema:**
```typescript
{
  deviceId: string;
  region: string;
  platform: string;
  appVersion: string;
}
```

**Response Schema:**
```typescript
{
  status: "success";
  data: {
    userId: string;
    displayName: string;
    avatar: string;
    notifications: number;
    region: string;
    deviceId: string;
  }
}
```

### 2. Navigation Structure

Retrieve hierarchical navigation structure.

**Endpoint:** GET /nav/data

**Response Schema:**
```typescript
{
  status: "success";
  data: {
    navigation: Array<{
      id: string;
      title: string;
      path: string;
      icon: string;
      children?: Array<{
        id: string;
        title: string;
        path: string;
        icon: string;
      }>;
    }>;
  }
}
```

### 3. Asset Configuration

Get device-specific asset configurations.

**Endpoint:** GET /apa/asset

**Query Parameters:**
```typescript
{
  id: string;
  deviceId: string;
  resolution?: string;
  format?: string;
}
```

**Response Schema:**
```typescript
{
  status: "success";
  data: {
    id: string;
    title: string;
    type: "movie" | "series";
    duration: number;
    streamUrl: string;
    thumbnailUrl: string;
    availableUntil: string;
    isHD: boolean;
    hasSubtitles: boolean;
    supportedFormats: string[];
    supportedResolutions: string[];
    drm?: {
      provider: string;
      token: string;
    };
  }
}
```

### 4. Metadata Configuration

Retrieve content metadata and parameters.

**Endpoint:** GET /apa/metadata

**Query Parameters:**
```typescript
{
  id: string;
  language?: string;
}
```

**Response Schema:**
```typescript
{
  status: "success";
  data: {
    assetId: string;
    title: string;
    description: string;
    releaseYear: number;
    genres: string[];
    cast: string[];
    director?: string;
    creator?: string;
    rating: string;
    language: string;
    subtitles: string[];
    runtime?: string;
    seasons?: number;
    episodes?: number;
    posterUrl: string;
    trailerUrl: string;
    tags: string[];
    popularity: number;
    averageRating: number;
  }
}
```

### Error Handling

All endpoints follow a consistent error response format:

```typescript
{
  status: "error" | "fail";
  message: string;
  data?: any;
}
```

Common HTTP status codes:
- 200: Successful request
- 400: Bad request (invalid parameters)
- 401: Unauthorized (missing or invalid authentication)
- 403: Forbidden (insufficient permissions)
- 404: Resource not found
- 500: Internal server error

## Environment Variables

| Variable | Description | Default Value | Required |
|----------|-------------|---------------|----------|
| PORT | Server port number | 3000 | Yes |
| NODE_ENV | Environment mode | development | Yes |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/ott-claro-api | Yes |
| JWT_SECRET | Secret key for JWT signing | - | Yes |
| JWT_EXPIRATION | JWT token expiration time | 1d | Yes |
| API_VERSION | API version | v1 | Yes |
| CACHE_DURATION | Cache duration in seconds | 300 | No |

## Development

For development purposes, you can use the following npm scripts:

```bash
npm run dev     # Start server in development mode with nodemon
npm test       # Run tests with Jest
npm run lint   # Run ESLint for TypeScript and JavaScript files
npm run build  # Build TypeScript files for production
```

## API Documentation

Full API documentation is available through Swagger UI at `/api-docs` when the server is running. The Swagger documentation includes:

- Detailed request/response schemas
- Authentication requirements
- Example requests and responses
- Error responses
- API versioning information

The API documentation can also be accessed in JSON format at `/api-docs.json`.