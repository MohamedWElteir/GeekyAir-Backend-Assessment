const swaggerJSDoc = require("swagger-jsdoc");
require("dotenv").config();
const PORT = process.env.PORT
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "SRMS",
    version: "1.0.0",
    description: "API documentation for the application.",
  },
  servers: [
    {
      url: `http://localhost:${PORT}`,
      description: "Development server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'], 
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
