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

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new AppError('Token xác thực là bắt buộc', 401);
    }

    // Check if token is blacklisted
    const isBlacklisted = await redisClient.isTokenBlacklisted(token);
    if (isBlacklisted) {
      throw new AppError('Token đã bị vô hiệu hóa', 401);
    }

    // Verify JWT token
    const decoded = jwt.verify(token, config.JWT_SECRET!) as TokenPayload;
    
    if (decoded.type !== 'access') {
      throw new AppError('Token không hợp lệ', 401);
    }

    // Get user from database or cache
    const User = require('../../models/User').User;
    const user = await User.findById(decoded.id).select('-password -refreshTokens');
    
    if (!user) {
      throw new AppError('Người dùng không tồn tại', 401);
    }

    if (!user.isActive) {
      throw new AppError('Tài khoản đã bị vô hiệu hóa', 401);
    }

    if (!user.isEmailVerified) {
      throw new AppError('Email chưa được xác thực', 401);
    }

    // Check if account is locked
    if (user.lockUntil && user.lockUntil > Date.now()) {
      throw new AppError('Tài khoản đã bị khóa tạm thời', 423);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      logger.warn('Token expired', { token: req.header('Authorization') });
      return next(new AppError('Token đã hết hạn', 401));
    } else if (error instanceof jwt.JsonWebTokenError) {
      logger.warn('Invalid token', { token: req.header('Authorization') });
      return next(new AppError('Token không hợp lệ', 401));
    }
    
    logger.error('Authentication error', { 
      error: error instanceof Error ? error.message : 'Unknown error',
      userId: req.user?._id 
    });
    next(error);
  }
};

// Optional authentication middleware (for routes that work with or without auth)
export const optionalAuthMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return next(); // Continue without user
    }

    // Check if token is blacklisted
    const isBlacklisted = await redisClient.isTokenBlacklisted(token);
    if (isBlacklisted) {
      return next(); // Continue without user
    }

    // Verify JWT token
    const decoded = jwt.verify(token, config.JWT_SECRET!) as TokenPayload;
    
    if (decoded.type !== 'access') {
      return next(); // Continue without user
    }

    // Get user from database
    const User = require('../../models/User').User;
    const user = await User.findById(decoded.id).select('-password -refreshTokens');
    
    if (user && user.isActive && user.isEmailVerified) {
      req.user = user;
    }

    next();
  } catch (error) {
    // Continue without user if there's any error
    next();
  }
};