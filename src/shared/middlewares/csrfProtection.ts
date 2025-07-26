import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { AppError } from './errorHandler';
import { logger } from '../utils/logger';
import { config } from '../config';

interface CSRFRequest extends Request {
  csrfToken?: () => string;
}

// Generate CSRF token
export const generateCSRFToken = (secret: string): string => {
  const token = crypto.randomBytes(32).toString('hex');
  const hash = crypto.createHmac('sha256', secret).update(token).digest('hex');
  return `${token}.${hash}`;
};

// Verify CSRF token
export const verifyCSRFToken = (token: string, secret: string): boolean => {
  if (!token || !token.includes('.')) return false;
  
  const [tokenPart, hashPart] = token.split('.');
  const expectedHash = crypto.createHmac('sha256', secret).update(tokenPart).digest('hex');
  
  return crypto.timingSafeEqual(Buffer.from(hashPart), Buffer.from(expectedHash));
};

// CSRF middleware
export const csrfProtection = (req: CSRFRequest, res: Response, next: NextFunction): void => {
  // Skip CSRF for GET, HEAD, OPTIONS requests
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  // Skip CSRF for API endpoints that use Bearer token authentication
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return next();
  }

  const csrfToken = req.headers['x-csrf-token'] as string || req.body._csrf;
  
  if (!csrfToken) {
    logger.warn('CSRF token missing', {
      ip: req.ip,
      userAgent: req.get('user-agent'),
      method: req.method,
      path: req.path
    });
    
    res.status(403).json({
      status: 'error',
      message: 'CSRF token missing',
      code: 'CSRF_TOKEN_MISSING'
    });
    return;
  }

  if (!verifyCSRFToken(csrfToken, config.CSRF_SECRET)) {
    logger.warn('Invalid CSRF token', {
      ip: req.ip,
      userAgent: req.get('user-agent'),
      method: req.method,
      path: req.path
    });
    
    res.status(403).json({
      status: 'error',
      message: 'Invalid CSRF token',
      code: 'INVALID_CSRF_TOKEN'
    });
    return;
  }

  next();
};

// Generate and attach CSRF token to request
export const attachCSRFToken = (req: CSRFRequest, res: Response, next: NextFunction) => {
  req.csrfToken = () => generateCSRFToken(config.CSRF_SECRET);
  next();
};

// Middleware to provide CSRF token endpoint
export const getCSRFToken = (req: CSRFRequest, res: Response) => {
  const token = generateCSRFToken(config.CSRF_SECRET);
  
  res.json({
    status: 'success',
    data: {
      csrfToken: token
    }
  });
};
