const swaggerJSDoc = require("swagger-jsdoc");
require("dotenv").config();
const PORT = process.env.PORT || 3000;  

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "SRMS",
    version: "1.0.0",
    description: "API documentation for the application.",
  },
  servers: [
    {
      url: process.env.NODE_ENV === 'production' 
        ? `https://geeky-air-lyart.vercel.app/`
        : `http://localhost:${PORT}`,
      description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
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
