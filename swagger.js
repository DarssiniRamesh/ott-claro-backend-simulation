const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'OTT Claro Backend Simulation API',
      version: '1.0.0',
      description: 'API documentation for OTT Claro Backend Simulation',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
      {
        url: 'https://api.claro.com',
        description: 'Production server',
      },
    ],
    security: [
      {
        apiAuth: [],
      },
    ],
    components: {
      securitySchemes: {
        apiAuth: {
          type: 'apiKey',
          in: 'query',
          name: 'authpt',
          description: 'Authentication token (must be vofee7ohhecai)',
        },
      },
      schemas: {
        StartHeaderInfo: {
          type: 'object',
          required: ['deviceId', 'region'],
          properties: {
            deviceId: {
              type: 'string',
              description: 'Unique identifier for the device',
            },
            region: {
              type: 'string',
              description: 'Geographic region code',
            },
            platform: {
              type: 'string',
              description: 'Device platform (iOS, Android, Web)',
            },
          },
        },
        NavigationData: {
          type: 'object',
          properties: {
            structure: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    description: 'Navigation item ID',
                  },
                  title: {
                    type: 'string',
                    description: 'Navigation item title',
                  },
                  children: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/NavigationData',
                    },
                  },
                },
              },
            },
          },
        },
        AssetConfig: {
          type: 'object',
          properties: {
            assetId: {
              type: 'string',
              description: 'Unique identifier for the asset',
            },
            configuration: {
              type: 'object',
              properties: {
                quality: {
                  type: 'string',
                  description: 'Asset quality configuration',
                },
                format: {
                  type: 'string',
                  description: 'Asset format configuration',
                },
              },
            },
          },
        },
        MetadataConfig: {
          type: 'object',
          properties: {
            contentId: {
              type: 'string',
              description: 'Content identifier',
            },
            metadata: {
              type: 'object',
              properties: {
                title: {
                  type: 'string',
                  description: 'Content title',
                },
                description: {
                  type: 'string',
                  description: 'Content description',
                },
                duration: {
                  type: 'number',
                  description: 'Content duration in seconds',
                },
              },
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Error message',
            },
            statusCode: {
              type: 'number',
              description: 'HTTP status code',
            },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js'], // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = {
  swaggerSpec,
  options
};
