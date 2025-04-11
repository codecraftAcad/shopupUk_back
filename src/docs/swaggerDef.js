const { version } = require("../../package.json");
const config = require("../config/config");

const swaggerDef = {
  openapi: "3.0.0",
  info: {
    title: "ShopUpUK API Documentation",
    version,
    description: "API documentation for the e-commerce platform",
    license: {
      name: "MIT",
      url: "https://github.com/yourname/ecommerce-api/blob/master/LICENSE",
    },
  },
  servers: [
    {
      url: `http://localhost:${config.port}/v1`,
      description: "Development Server",
    },
    {
      url: "https://shopupuk-back.onrender.com/v1",
      description: "Production Server",
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
};

module.exports = swaggerDef;
