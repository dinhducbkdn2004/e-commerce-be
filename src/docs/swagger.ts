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

This comprehensive API supports a full-featured e-commerce platform with the following capabilities:

### Features
- **Authentication**: User registration, login, password reset, email verification
- **User Management**: Profile management, address book
- **Product Catalog**: Browse products, categories, search and filtering
- **Shopping Cart**: Add, update, remove items from cart
- **Order Management**: Create orders, track status, order history
- **Wishlist**: Save favorite products for later
- **Loyalty Program**: Earn and redeem points, tier system
- **Admin Functions**: Manage orders, view analytics

### API Endpoints Overview
- \`/api/v1/auth/*\` - Authentication endpoints
- \`/api/v1/users/*\` - User management
- \`/api/v1/products/*\` - Product catalog
- \`/api/v1/categories/*\` - Product categories
- \`/api/v1/cart/*\` - Shopping cart management
- \`/api/v1/orders/*\` - Order management
- \`/api/v1/address/*\` - Address management
- \`/api/v1/wishlist/*\` - Wishlist management
- \`/api/v1/loyalty/*\` - Loyalty program

### Getting Started
1. Register a new account using the Authentication endpoints
2. Login to receive a Bearer token
3. Include the token in the Authorization header for protected endpoints
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
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean'
            },
            message: {
              type: 'string'
            },
            messageVi: {
              type: 'string'
            },
            data: {
              type: 'object'
            },
            timestamp: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Pagination: {
          type: 'object',
          properties: {
            page: {
              type: 'integer'
            },
            pages: {
              type: 'integer'
            },
            total: {
              type: 'integer'
            },
            hasNext: {
              type: 'boolean'
            },
            hasPrev: {
              type: 'boolean'
            }
          }
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'Access token is missing or invalid',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ApiResponse'
              }
            }
          }
        },
        ForbiddenError: {
          description: 'Insufficient permissions',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ApiResponse'
              }
            }
          }
        },
        NotFoundError: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ApiResponse'
              }
            }
          }
        },
        BadRequestError: {
          description: 'Bad request - validation error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ApiResponse'
              }
            }
          }
        }
      }
    }
  },
  apis: [
    './src/docs/*.docs.ts',
    './src/routes/*.ts',
    './src/domains/*/*.routes.ts'
  ],
};

export const specs = swaggerJsdoc(options);
