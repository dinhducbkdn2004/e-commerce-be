import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import { specs } from './docs/swagger';
import { corsMiddleware } from './shared/middlewares/corsMiddleware';
import { rateLimitMiddleware } from './shared/middlewares/rateLimitMiddleware';
import { morganMiddleware } from './shared/utils/morganConfig';
import { errorHandler } from './shared/middlewares/errorHandler';
import { logger } from './shared/utils/logger';
import { sessionConfig } from './shared/middlewares/sessionMiddleware';
import { attachCSRFToken } from './shared/middlewares/csrfProtection';
import { checkTokenBlacklist } from './shared/middlewares/tokenBlacklist';
import { redisClient } from './shared/utils/redis';

// Routes
import baseRoutes from './routes/index';

const app = express();

// Initialize Redis connection
redisClient.connect().catch(err => {
  logger.error('Failed to connect to Redis', { error: err.message });
});

// Security middleware
app.use(helmet());
app.use(corsMiddleware);

// Cookie parser
app.use(cookieParser());

// Session management
app.use(sessionConfig);

// CSRF token attachment
app.use(attachCSRFToken);

// Rate limiting
app.use('/api', rateLimitMiddleware);

// Token blacklist check
app.use(checkTokenBlacklist);

// Request logging
app.use(morganMiddleware);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Body parsing middleware

// Swagger API Documentation
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true, // Cho phép khám phá schema
  customSiteTitle: 'E-Commerce API Documentation', // Chỉ tùy chỉnh tiêu đề trang
  swaggerOptions: {
    persistAuthorization: true, // Lưu trữ token xác thực
    docExpansion: 'list', // Mở rộng tags, default của Swagger
    filter: true // Cho phép tìm kiếm API
  }
}));

// Routes
app.use('/', baseRoutes);

// 404 handler for undefined routes
app.use((req, res) => {
  logger.warn(`🔍 Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: [
      'GET /',
      'GET /health',
      'GET /api/v1/users',
      'POST /api/v1/users',
      'POST /api/v1/auth/login',
      'GET /docs' // Added Swagger documentation route
    ]
  });
});

// Error handling (must be last)
app.use(errorHandler);

export default app;