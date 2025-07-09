import swaggerJsdoc from 'swagger-jsdoc';
// Sử dụng giá trị tĩnh cho version thay vì import từ package.json
const version = '1.0.0';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-Commerce API Documentation',
      version,
      description: `
## API Documentation for E-Commerce Backend

This documentation provides details for all available API endpoints.

### Getting Started
To begin using the API, register a new account using the Authentication endpoints.
      `,
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      }
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || '3000'}`,
        description: 'Development Server',
      },
      {
        url: 'https://api.example.com',
        description: 'Production Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            id: {
              type: 'string',
              description: 'Auto-generated ID of the user',
              example: '60d21b4667d0d8992e610c85'
            },
            email: {
              type: 'string',
              description: 'User email address',
              example: 'user@example.com'
            },
            password: {
              type: 'string',
              description: 'User password (hashed)',
              example: '$2b$10$X/rTLt3.apFG4DRjiGxnIOX3yWH9Tb70qPv9.5Q...'
            },
            name: {
              type: 'string',
              description: 'User full name',
              example: 'John Doe'
            },
            role: {
              type: 'string',
              description: 'User role',
              enum: ['user', 'admin'],
              example: 'user'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date and time when the user was created',
              example: '2023-01-01T00:00:00.000Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date and time when the user was last updated',
              example: '2023-01-01T00:00:00.000Z'
            }
          }
        },
        UserResponse: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '60d21b4667d0d8992e610c85'
            },
            email: {
              type: 'string',
              example: 'user@example.com'
            },
            name: {
              type: 'string',
              example: 'John Doe'
            },
            role: {
              type: 'string',
              example: 'user'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T00:00:00.000Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T00:00:00.000Z'
            }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              example: 'user@example.com'
            },
            password: {
              type: 'string',
              example: 'password123'
            }
          }
        },
        RegisterRequest: {
          type: 'object',
          required: ['email', 'password', 'name'],
          properties: {
            email: {
              type: 'string',
              example: 'user@example.com'
            },
            password: {
              type: 'string',
              example: 'password123'
            },
            name: {
              type: 'string',
              example: 'John Doe'
            }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            user: {
              $ref: '#/components/schemas/UserResponse'
            },
            token: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string'
            },
            status: {
              type: 'number'
            },
            error: {
              type: 'string'
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts', './src/docs/*.docs.ts'],
};

export const specs = swaggerJsdoc(options);
