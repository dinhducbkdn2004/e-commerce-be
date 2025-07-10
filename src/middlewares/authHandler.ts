import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { config } from '../config';
import { AppError } from './errorHandler';
import { redisClient } from '../utils/redis';
import { logger } from '../utils/logger';

interface AuthRequest extends Request {
  user?: any;
}

interface TokenPayload {
  id: string;
  email?: string;
  role?: string;
  type: 'access' | 'refresh';
  jti?: string;
  iat?: number;
  exp?: number;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new AppError('Access token required', 401);
    }

    // Verify JWT token
    const decoded = jwt.verify(token, config.JWT_SECRET) as TokenPayload;
    
    // Additional security checks
    if (decoded.type !== 'access') {
      throw new AppError('Invalid token type', 401);
    }

    // Check if token is blacklisted
    if (decoded.jti) {
      const isBlacklisted = await redisClient.isTokenBlacklisted(decoded.jti);
      if (isBlacklisted) {
        logger.warn('Attempted use of blacklisted token', {
          tokenId: decoded.jti,
          userId: decoded.id,
          ip: req.ip
        });
        throw new AppError('Token has been revoked', 401);
      }
    }

    // Check if all user tokens are blacklisted
    if (decoded.id && decoded.iat) {
      const isUserBlacklisted = await redisClient.isUserTokensBlacklisted(decoded.id, decoded.iat * 1000);
      if (isUserBlacklisted) {
        logger.warn('Attempted use of invalidated user token', {
          userId: decoded.id,
          ip: req.ip
        });
        throw new AppError('All user sessions have been invalidated', 401);
      }
    }

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AppError('Invalid token', 401);
    }
    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError('Token expired', 401);
    }
    throw new AppError('Authentication failed', 401);
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError('Insufficient permissions', 403);
    }

    next();
  };
};