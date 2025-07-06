import { Router } from 'express';
import { config } from '../config';
import { logger } from '../utils/logger';

const router = Router();

// Root route
router.get('/', (req, res) => {
  logger.info('📍 Root endpoint accessed');
  res.json({ 
    message: 'Welcome to My Backend API',
    version: '1.0.0',
    docs: '/api/v1/docs',
    health: '/health',
    endpoints: {
      users: '/api/v1/users',
      login: '/api/v1/users/login'
    }
  });
});

// Health check
router.get('/health', (req, res) => {
  logger.info('💚 Health check endpoint accessed');
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: config.NODE_ENV
  });
});

export default router;
