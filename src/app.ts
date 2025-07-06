import express from 'express';
import helmet from 'helmet';
import { corsMiddleware } from './middlewares/corsMiddleware';
import { rateLimitMiddleware } from './middlewares/rateLimitMiddleware';
import { morganMiddleware } from './utils/morganConfig';
import { errorHandler } from './middlewares/errorHandler';
import { logger } from './utils/logger';

// Routes
import baseRoutes from './routes/index';
import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';

const app = express();

// Security middleware
app.use(helmet());
app.use(corsMiddleware);

// Rate limiting
app.use('/api', rateLimitMiddleware);

// Request logging
app.use(morganMiddleware);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/', baseRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/auth', authRoutes);

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
      'POST /api/v1/auth/login'
    ]
  });
});

// Error handling (must be last)
app.use(errorHandler);

export default app;