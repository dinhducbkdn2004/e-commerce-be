# E-Commerce Backend API

[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.x-green.svg)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-5.x-black.svg)](https://expressjs.com/)
[![Jest](https://img.shields.io/badge/Jest-30.x-red.svg)](https://jestjs.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A comprehensive e-commerce backend API built with Node.js, TypeScript, Express, and MongoDB following clean architecture principles. This project provides all the necessary backend services for a modern e-commerce platform including user management, product catalog, shopping cart, orders, wishlist, and more.

## 🚀 Features

- **Clean Architecture** - Separation of concerns with layered architecture
- **TypeScript** - Type safety and better developer experience
- **Authentication & Authorization** - JWT-based auth with role-based access
- **User Management** - Registration, profile management, addresses
- **Shopping Cart** - Add, update, remove items with persistence
- **Order Processing** - Create, track, and manage orders
- **Wishlist** - Save products for later
- **Loyalty Program** - Points system and vouchers
- **Comprehensive Logging** - Winston logger with Morgan HTTP logging
- **Security** - Helmet, CORS, Rate limiting, and input validation
- **Testing** - Unit tests, integration tests, and test coverage
- **API Documentation** - Swagger/OpenAPI documentation
- **Error Handling** - Centralized error handling with proper responses

## 📋 Table of Contents

- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## 🛠️ Installation

### Prerequisites

- Node.js (v20.x or higher)
- MongoDB (v7.x or higher)
- npm or yarn

### Clone the repository

```bash
git clone https://github.com/your-username/e-commerce-be.git
cd e-commerce-be
```

### Install dependencies

```bash
npm install
```

### Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` with your configuration values.

## 🔧 Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# Database
MONGO_URI=mongodb://localhost:27017/mybackend

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=1h
JWT_EXPIRES_IN_REFRESH=7d

# Server
PORT=3000
NODE_ENV=development

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_REQUESTS=100

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# Logging
LOG_LEVEL=info
```

## 🚀 Usage

### Development

```bash
# Start in development mode with hot reload
npm run dev

# Start in development mode (alternative)
npm run start:dev
```

### Production

```bash
# Build the project
npm run build

# Start production server
npm start
```

### Other Commands

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Lint code
npm run lint

# Format code
npm run format
```

## 📚 API Endpoints

### Base URL

```
http://localhost:3000
```

### Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Endpoints

#### **General**

- `GET /` - API information
- `GET /health` - Health check

#### **Authentication**

- `POST /api/v1/users` - Register a new user
- `POST /api/v1/users/login` - Login user

### Request/Response Examples

#### Register User

```bash
POST /api/v1/users
Content-Type: application/json

{
  "username": "john_doe",
  "password": "securePassword123",
  "role": "user"
}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "_id": "60f7b3b3e6b3a12345678901",
    "username": "john_doe",
    "role": "user",
    "createdAt": "2025-07-06T10:30:00.000Z",
    "updatedAt": "2025-07-06T10:30:00.000Z"
  }
}
```

#### Login User

```bash
POST /api/v1/users/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "securePassword123"
}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "60f7b3b3e6b3a12345678901",
      "username": "john_doe",
      "role": "user"
    }
  }
}
```

## 🧪 Testing

This project includes comprehensive test coverage:

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- UserService.test.ts
```

### Test Types

- **Unit Tests** - Testing individual components (services, repositories, controllers)
- **Integration Tests** - Testing API endpoints end-to-end
- **Test Coverage** - Minimum 70% coverage required

### Test Structure

```
src/__tests__/
├── setup.ts                 # Test configuration
├── controllers/              # Controller tests
├── services/                 # Service tests
├── repositories/             # Repository tests
└── integration/              # Integration tests
```

## 📁 Project Structure

```
my-backend/
├── src/
│   ├── __tests__/           # Test files
│   ├── config/              # Configuration files
│   ├── controllers/         # Request handlers
│   ├── dtos/                # Data Transfer Objects
│   ├── middlewares/         # Custom middleware
│   ├── models/              # Database models
│   ├── repositories/        # Data access layer
│   ├── routes/              # Route definitions
│   ├── services/            # Business logic
│   ├── utils/               # Utility functions
│   ├── validators/          # Input validation
│   ├── app.ts               # Express app setup
│   └── server.ts            # Server entry point
├── logs/                    # Log files
├── dist/                    # Compiled JavaScript
├── coverage/                # Test coverage reports
├── .env                     # Environment variables
├── .eslintrc.json           # ESLint configuration
├── .prettierrc.json         # Prettier configuration
├── jest.config.js           # Jest configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Project dependencies
```

## 🏗️ Architecture

This project follows **Clean Architecture** principles:

### Layers

1. **Controllers** - Handle HTTP requests and responses
2. **Services** - Contains business logic
3. **Repositories** - Data access layer
4. **Models** - Database entities
5. **Middlewares** - Cross-cutting concerns

### Data Flow

```
Request → Controller → Service → Repository → Database
Response ← Controller ← Service ← Repository ← Database
```

## 🏗️ Project Structure

```
e-commerce-be/
├── src/                 # Source code
│   ├── config/          # Application configuration
│   ├── controllers/     # Request handlers
│   │   └── user/        # User-related controllers
│   ├── docs/            # API documentation
│   ├── dtos/            # Data Transfer Objects
│   ├── middlewares/     # Express middlewares
│   ├── models/          # Mongoose models
│   ├── repositories/    # Data access layer
│   │   └── user/        # User-related repositories
│   ├── routes/          # API routes
│   │   └── user/        # User-related routes
│   ├── services/        # Business logic
│   │   └── user/        # User-related services
│   ├── utils/           # Utility functions
│   ├── validators/      # Input validation schemas
│   ├── app.ts           # Express app setup
│   └── server.ts        # Server entry point
├── logs/                # Application logs
├── scripts/             # Utility scripts
├── __tests__/           # Test files
│   ├── integration/     # Integration tests
│   ├── controllers/     # Controller tests
│   ├── services/        # Service tests
│   └── repositories/    # Repository tests
├── jest.config.js       # Jest configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Project dependencies
```

The project follows a clean architecture pattern with clear separation of concerns:

1. **Models**: Database schemas and interfaces
2. **DTOs**: Data transfer objects for API requests/responses
3. **Repositories**: Data access layer that interacts with the database
4. **Services**: Business logic layer
5. **Controllers**: Handle HTTP requests and responses
6. **Routes**: Define API endpoints
7. **Middlewares**: Handle cross-cutting concerns like auth, validation, etc.
8. **Utils**: Shared utility functions
9. **Config**: Application configuration

## 🛡️ Security Features

- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - Prevent abuse
- **Input Validation** - Joi validation
- **Password Hashing** - bcrypt with salt rounds
- **JWT Authentication** - Secure token-based auth

## 📊 Logging

- **Winston** - Structured logging
- **Morgan** - HTTP request logging
- **Log Levels** - info, warn, error, debug
- **Log Files** - Separate files for different log levels

## 🔄 Development Workflow

1. **Code** - Write your feature/fix
2. **Test** - Run tests to ensure quality
3. **Lint** - Check code style with ESLint
4. **Format** - Auto-format with Prettier
5. **Commit** - Commit your changes
6. **Deploy** - Deploy to your environment

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Follow TypeScript best practices
- Use ESLint and Prettier configurations
- Write comprehensive tests
- Follow conventional commit messages

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Express.js team for the excellent framework
- MongoDB team for the database
- All contributors and the open-source community

---

**Made with ❤️ by Dinh Duc**
