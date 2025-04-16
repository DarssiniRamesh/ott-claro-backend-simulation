# OTT Claro Backend Simulation API

A RESTful API built with Node.js/Express.js for OTT Claro Backend Simulation.

## Features

- RESTful API with Express.js
- MongoDB connection setup
- JWT authentication with Passport.js
- Swagger/OpenAPI documentation
- Basic error handling and validation
- In-memory caching for GET endpoints

## Project Structure

```
├── src/
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── db/               # Database connection and models
│   ├── middleware/       # Custom middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── swagger/          # Swagger documentation
│   └── server.js         # Express app and server setup
├── .env                  # Environment variables
├── package.json          # Project dependencies and scripts
└── README.md            # Project documentation
```

## API Endpoints

### Items

- `GET /api/items` - Get all items
- `GET /api/items/:id` - Get a specific item
- `POST /api/items` - Create a new item (requires authentication)
- `PUT /api/items/:id` - Update an existing item (requires authentication)
- `DELETE /api/items/:id` - Delete an item (requires authentication)

### Authentication

- `POST /api/auth/login` - User login

## Setup and Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (optional for actual database operations)

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
   ```
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/ott-claro-api
   JWT_SECRET=your-secret-key-change-in-production
   JWT_EXPIRATION=1d
   ```

4. Start the server:
   ```bash
   npm start
   ```

   For development with auto-reload:
   ```bash
   npm run dev
   ```

5. Access the API at `http://localhost:3000`
6. Access the Swagger documentation at `http://localhost:3000/api-docs`

## Authentication

The API uses JWT for authentication. To access protected endpoints, you need to include the JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

To get a token, use the login endpoint with the following credentials:

```json
{
  "email": "user@example.com",
  "password": "password"
}
```

## Caching

GET endpoints use in-memory caching to improve performance. The cache duration is set to 5 minutes by default and can be configured in the `.env` file.

## Error Handling

The API uses a centralized error handling mechanism. All errors are formatted consistently and include appropriate HTTP status codes.

## Documentation

API documentation is available through Swagger UI at `/api-docs`. The documentation includes all endpoints, request/response schemas, and authentication requirements.
