/**
 * Swagger configuration
 * Sets up Swagger/OpenAPI documentation for the API
 */

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const config = require('../config/env.config');

/**
 * Swagger definition options
 */
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'OTT Claro Backend Simulation API',
      version: '1.0.0',
      description: 'A RESTful API built with Express.js for OTT Claro Backend Simulation',
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC',
      },
      contact: {
        name: 'API Support',
        url: 'https://github.com/DarssiniRamesh/ott-claro-backend-simulation',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${config.PORT}/api`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Item: {
          type: 'object',
          required: ['name', 'description', 'price', 'category'],
          properties: {
            id: {
              type: 'string',
              description: 'The auto-generated id of the item',
            },
            name: {
              type: 'string',
              description: 'The name of the item',
            },
            description: {
              type: 'string',
              description: 'The description of the item',
            },
            price: {
              type: 'number',
              description: 'The price of the item',
            },
            category: {
              type: 'string',
              description: 'The category of the item',
            },
            inStock: {
              type: 'boolean',
              description: 'Whether the item is in stock',
              default: true,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'The date the item was created',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'The date the item was last updated',
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'The auto-generated id of the user',
            },
            email: {
              type: 'string',
              description: 'The email of the user',
            },
            role: {
              type: 'string',
              description: 'The role of the user',
              enum: ['user', 'admin'],
            },
            profile: {
              type: 'object',
              properties: {
                firstName: {
                  type: 'string',
                  description: 'The first name of the user',
                },
                lastName: {
                  type: 'string',
                  description: 'The last name of the user',
                },
                avatar: {
                  type: 'string',
                  description: 'The avatar URL of the user',
                },
                phone: {
                  type: 'string',
                  description: 'The phone number of the user',
                },
              },
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'The date the user was created',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'The date the user was last updated',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              description: 'Error status',
            },
            message: {
              type: 'string',
              description: 'Error message',
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'], // Path to the API routes files
};

/**
 * Initialize Swagger documentation
 * @param {Object} app - Express application
 */
const swaggerSetup = (app) => {
  const specs = swaggerJsdoc(options);
  
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'OTT Claro API Documentation',
  }));
  
  // Serve swagger.json
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });
};

module.exports = swaggerSetup;
