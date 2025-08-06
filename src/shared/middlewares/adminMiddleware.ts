import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';
import { logger } from '../utils/logger';

interface AuthRequest extends Request {
  user?: any;
}

export const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Check if user is authenticated (should be called after authMiddleware)
    if (!req.user) {
      throw new AppError('Yêu cầu xác thực', 401);
    }

    // Check if user has admin role
    if (req.user.role !== 'admin') {
      logger.warn('Unauthorized admin access attempt', {
        userId: req.user._id,
        userRole: req.user.role,
        route: req.originalUrl,
        method: req.method
      });
      
      throw new AppError('Quyền truy cập bị từ chối. Cần quyền quản trị viên.', 403);
    }

    // Check if admin account is active
    if (!req.user.isActive) {
      throw new AppError('Tài khoản quản trị viên đã bị vô hiệu hóa', 403);
    }

    logger.info('Admin access granted', {
      adminId: req.user._id,
      adminEmail: req.user.email,
      route: req.originalUrl,
      method: req.method
    });

    next();
  } catch (error) {
    next(error);
  }
};

// Middleware to check for super admin (if you have different admin levels)
export const superAdminMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('Yêu cầu xác thực', 401);
    }

    if (req.user.role !== 'super_admin') {
      logger.warn('Unauthorized super admin access attempt', {
        userId: req.user._id,
        userRole: req.user.role,
        route: req.originalUrl,
        method: req.method
      });
      
      throw new AppError('Quyền truy cập bị từ chối. Cần quyền super admin.', 403);
    }

    next();
  } catch (error) {
    next(error);
  }
};