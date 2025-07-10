import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { redisClient } from '../utils/redis';
import { AppError } from './errorHandler';
import { logger } from '../utils/logger';
import { config } from '../config';

interface TokenPayload {
  id: string;
  email?: string;
  role?: string;
  type: 'access' | 'refresh';
  jti?: string;
  iat?: number;
  exp?: number;
}

export const checkTokenBlacklist = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.substring(7);
    
    // Decode token to get payload
    const decoded = jwt.decode(token) as TokenPayload;
    
    if (!decoded) {
      return next();
    }

    // Check if specific token is blacklisted
    if (decoded.jti) {
      const isBlacklisted = await redisClient.isTokenBlacklisted(decoded.jti);
      if (isBlacklisted) {
        logger.warn('Attempted use of blacklisted token', {
          tokenId: decoded.jti,
          userId: decoded.id,
          ip: req.ip
        });
        
        res.status(401).json({
          status: 'error',
          message: 'Token has been revoked',
          code: 'TOKEN_REVOKED'
        });
        return;
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
        
        res.status(401).json({
          status: 'error',
          message: 'All user sessions have been invalidated',
          code: 'USER_SESSIONS_INVALIDATED'
        });
        return;
      }
    }

    next();
  } catch (error) {
    logger.error('Token blacklist check failed', { error });
    next();
  }
};
