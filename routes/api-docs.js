const express = require('express');
const swaggerUi = require('swagger-ui-express');
const { swaggerSpec } = require('../swagger');

const router = express.Router();

// Serve Swagger UI
router.use('/', swaggerUi.serve);

// Custom HTML for SwaggerUI with export button
const customSwaggerHtml = swaggerUi.generateHTML(swaggerSpec, {
  customJs: '/custom-swagger.js',
  customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
  customfavIcon: '/favicon.ico',
});

// Serve SwaggerUI with custom HTML
router.get('/', (req, res) => {
  res.send(customSwaggerHtml.replace(
    '<div id="swagger-ui">',
    `<div style="padding: 8px 16px; background-color: #f8f9fa; border-bottom: 1px solid #dee2e6;">
      <button onclick="downloadSwaggerSpec()" style="padding: 8px 16px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">
        Export OpenAPI Specification
      </button>
    </div>
    <div id="swagger-ui">`
  ));
});

// Endpoint to export OpenAPI specification
router.get('/export', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename="openapi-spec.json"');
  res.send(swaggerSpec);
});

module.exports = router;
