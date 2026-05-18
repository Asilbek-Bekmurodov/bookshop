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
        Author: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '664f1a2b3c4d5e6f7a8b9c0d' },
            name: { type: 'string', example: 'Fyodor Dostoevsky' },
            nationality: { type: 'string', example: 'Russian' },
            bio: { type: 'string', example: 'Russian novelist...' },
            photo: { type: 'string', example: 'https://...' },
          },
        },
        Book: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '664f1a2b3c4d5e6f7a8b9c0d' },
            title: { type: 'string', example: 'Crime and Punishment' },
            author: { $ref: '#/components/schemas/Author' },
            category: { type: 'string', example: 'Fiction' },
            rating: { type: 'number', example: 4.8 },
            description: { type: 'string', example: 'A psychological novel...' },
            coverColor: { type: 'string', example: 'purple' },
            badge: { type: 'string', enum: ['Bestseller', 'New', 'Hot', ''], example: 'Bestseller' },
            genre: { type: 'string', example: 'Drama' },
            pageCount: { type: 'integer', example: 551 },
            publishedYear: { type: 'integer', example: 1866 },
            pdfUrl: { type: 'string', example: 'https://supabase.co/storage/...' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        BookInput: {
          type: 'object',
          required: ['title', 'authorId'],
          properties: {
            title: { type: 'string', example: 'Crime and Punishment' },
            authorId: { type: 'string', example: '664f1a2b3c4d5e6f7a8b9c0d' },
            authorName: { type: 'string', example: 'Fyodor Dostoevsky', description: 'authorId yo\'q bo\'lsa ishlatiladi' },
            category: { type: 'string', example: 'Fiction' },
            rating: { type: 'number', example: 4.8 },
            description: { type: 'string', example: 'A psychological novel...' },
            coverColor: { type: 'string', example: 'purple' },
            badge: { type: 'string', enum: ['Bestseller', 'New', 'Hot', ''] },
            genre: { type: 'string', example: 'Drama' },
            pageCount: { type: 'integer', example: 551 },
            publishedYear: { type: 'integer', example: 1866 },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

export default swaggerJsdoc(options);
