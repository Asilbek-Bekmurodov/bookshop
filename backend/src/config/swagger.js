import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Bookshop API',
      version: '1.0.0',
      description: 'Bookshop loyihasi uchun REST API dokumentatsiyasi',
    },
    servers: [
      { url: 'https://bookshop-u08d.onrender.com', description: 'Production server' },
      { url: 'http://localhost:5001', description: 'Local server' },
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
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '664f1a2b3c4d5e6f7a8b9c0d' },
            name: { type: 'string', example: 'Ali Karimov' },
            email: { type: 'string', example: 'ali@example.com' },
            role: { type: 'string', enum: ['user', 'admin'], example: 'user' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            accessToken: { type: 'string', example: 'eyJhbGci...' },
            user: { $ref: '#/components/schemas/User' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Xato xabari' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

export default swaggerJsdoc(options);
