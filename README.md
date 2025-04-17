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
- npm (v6 or higher) or yarn
- MongoDB (v4.4 or higher, optional if you're using a remote MongoDB instance)

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

   If you encounter dependency issues, try:
   ```bash
   npm cache clean --force
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/ott-claro-api
   JWT_SECRET=your-secret-key-change-in-production
   JWT_EXPIRATION=1d
   CACHE_DURATION=300
   ```

### Starting the Server

1. Start the MongoDB service (if using local MongoDB):
   ```bash
   # On Ubuntu/Debian
   sudo service mongodb start
   
   # On macOS (if installed via Homebrew)
   brew services start mongodb-community
   
   # On Windows (if installed as a service)
   # MongoDB should be running as a service
   ```

2. If you've updated dependencies in package.json, reinstall them:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

   For development with auto-reload:
   ```bash
   npm run dev
   ```

3. Verify the server is running:
   - Access the API at `http://localhost:3000`
   - You should see a welcome message with a link to the documentation
   - Access the Swagger documentation at `http://localhost:3000/api-docs`

### Troubleshooting Common Issues

#### Module Not Found Errors

If you encounter "Cannot find module" errors:

1. Make sure all dependencies are installed:
   ```bash
   npm install
   ```

2. If errors persist, try clearing npm cache and reinstalling:
   ```bash
   npm cache clean --force
   rm -rf node_modules
   npm install
   ```

3. For specific missing modules like 'merge-descriptors' or 'parseurl', ensure they are in your package.json:
   ```json
   "dependencies": {
     "express": "^5.1.0",
     "merge-descriptors": "^2.0.0",
     "parseurl": "^1.3.3",
     // other dependencies
   }
   ```
   Then run `npm install` again.

4. If you still encounter issues with specific modules, you can install them individually:
   ```bash
   npm install merge-descriptors parseurl --save
   ```

5. Check for Node.js version compatibility:
   ```bash
   node -v
   ```
   Ensure you're using Node.js v14 or higher. Express.js v5.1.0 may require Node.js v18 or higher.

#### MongoDB Connection Issues

If the server fails to connect to MongoDB:

1. Verify MongoDB is running:
   ```bash
   # Check MongoDB status
   sudo service mongodb status
   
   # Or for macOS
   brew services list
   ```

2. Check your MongoDB connection string in the `.env` file:
   - For local MongoDB: `mongodb://localhost:27017/ott-claro-api`
   - For MongoDB Atlas: `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/ott-claro-api`

3. If using MongoDB Atlas or a remote instance, ensure your IP address is whitelisted in the MongoDB Atlas dashboard.

4. Try connecting with the MongoDB shell to verify credentials:
   ```bash
   mongo mongodb://localhost:27017/ott-claro-api
   ```

#### Port Already in Use

If you see "Port 3000 is already in use":

1. Change the port in your `.env` file:
   ```
   PORT=3001
   ```

2. Or find and terminate the process using port 3000:
   ```bash
   # Find the process
   lsof -i :3000
   
   # Kill the process
   kill -9 <PID>
   ```

#### JWT Authentication Issues

If you encounter JWT authentication problems:

1. Ensure your JWT_SECRET is properly set in the `.env` file
2. Check that your token hasn't expired (default expiration is 1 day)
3. Verify you're including the token correctly in the Authorization header:
   ```
   Authorization: Bearer <your-token>
   ```

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
