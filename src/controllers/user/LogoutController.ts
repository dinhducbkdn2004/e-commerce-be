import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticationService } from '../../services/user/AuthenticationService';
import { BaseUserController } from './BaseUserController';
import { logger } from '../../utils/logger';
import { AppError } from '../../middlewares/errorHandler';
import { redisClient } from '../../utils/redis';
import { destroySession } from '../../middlewares/sessionMiddleware';
import { config } from '../../config';

interface TokenPayload {
  id: string;
  email?: string;
  role?: string;
  type: 'access' | 'refresh';
  jti?: string;
  iat?: number;
  exp?: number;
}

export class LogoutController extends BaseUserController {
  private authService: AuthenticationService;

  constructor() {
    super();
    this.authService = new AuthenticationService();
  }

  // Single device logout
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;
      const { refreshToken } = req.body;
      const userId = req.user?.id;

      logger.info('Logout attempt', {
        userId,
        ip: req.ip,
        userAgent: req.get('user-agent'),
        hasAccessToken: !!authHeader,
        hasRefreshToken: !!refreshToken
      });

      // Blacklist access token if provided
      if (authHeader && authHeader.startsWith('Bearer ')) {
        await this.blacklistAccessToken(authHeader.substring(7), req);
      }

      // Revoke refresh token if provided
      if (refreshToken && userId) {
        await this.authService.revokeRefreshToken(userId, refreshToken);
      }

      // Destroy session
      if (req.session) {
        await destroySession(req);
      }

      // Clear cookies
      this.clearAuthCookies(res);

      logger.info('Logout successful', {
        userId,
        ip: req.ip,
        userAgent: req.get('user-agent'),
        timestamp: new Date().toISOString()
      });

      res.status(200).json({
        status: 'success',
        message: 'Logged out successfully',
        data: {
          logoutTime: new Date().toISOString(),
          redirectTo: '/login'
        }
      });

    } catch (error) {
      logger.error('Logout failed', {
        userId: req.user?.id,
        ip: req.ip,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      next(error);
    }
  }

  // Logout from all devices
  async logoutAll(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const userEmail = req.user?.email;

      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      logger.info('Logout all devices attempt', {
        userId,
        userEmail,
        ip: req.ip,
        userAgent: req.get('user-agent')
      });

      // Blacklist all user tokens
      await this.blacklistAllUserTokens(userId);

      // Revoke all refresh tokens
      await this.authService.revokeAllRefreshTokens(userId);

      // Destroy current session
      if (req.session) {
        await destroySession(req);
      }

      // Clear cookies
      this.clearAuthCookies(res);

      logger.info('Logout all devices successful', {
        userId,
        userEmail,
        ip: req.ip,
        timestamp: new Date().toISOString()
      });

      res.status(200).json({
        status: 'success',
        message: 'Logged out from all devices successfully',
        data: {
          logoutTime: new Date().toISOString(),
          redirectTo: '/login'
        }
      });

    } catch (error) {
      logger.error('Logout all devices failed', {
        userId: req.user?.id,
        ip: req.ip,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      next(error);
    }
  }

  // Logout specific device/session
  async logoutDevice(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const { refreshToken, deviceFingerprint } = req.body;

      if (!userId || !refreshToken) {
        throw new AppError('User ID and refresh token are required', 400);
      }

      logger.info('Logout device attempt', {
        userId,
        deviceFingerprint,
        ip: req.ip,
        userAgent: req.get('user-agent')
      });

      // Revoke specific refresh token
      await this.authService.revokeRefreshToken(userId, refreshToken);

      // If it's current device, also clear session and cookies
      if (req.session?.userId === userId) {
        await destroySession(req);
        this.clearAuthCookies(res);
      }

      logger.info('Logout device successful', {
        userId,
        deviceFingerprint,
        ip: req.ip,
        timestamp: new Date().toISOString()
      });

      res.status(200).json({
        status: 'success',
        message: 'Device logged out successfully',
        data: {
          logoutTime: new Date().toISOString()
        }
      });

    } catch (error) {
      logger.error('Logout device failed', {
        userId: req.user?.id,
        ip: req.ip,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      next(error);
    }
  }

  // Check logout status
  async checkLogoutStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        res.status(200).json({
          status: 'success',
          data: {
            isLoggedOut: true,
            message: 'No active session'
          }
        });
        return;
      }

      // Check if user has active sessions
      const user = await this.authService.findById(userId);
      const activeTokensCount = user.refreshTokens.filter(
        token => token.isActive && token.expiresAt > new Date()
      ).length;

      res.status(200).json({
        status: 'success',
        data: {
          isLoggedOut: activeTokensCount === 0,
          activeTokensCount,
          user: {
            id: user._id,
            email: user.email,
            name: user.name
          }
        }
      });

    } catch (error) {
      logger.error('Check logout status failed', {
        userId: req.user?.id,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      next(error);
    }
  }

  private async blacklistAccessToken(token: string, req: Request) {
    try {
      const decoded = jwt.verify(token, config.JWT_SECRET) as TokenPayload;
      
      if (decoded.jti && decoded.exp) {
        const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);
        await redisClient.blacklistToken(decoded.jti, expiresIn);
        
        logger.info('Access token blacklisted', {
          tokenId: decoded.jti,
          userId: decoded.id,
          ip: req.ip
        });
      }
    } catch (error) {
      logger.error('Failed to blacklist access token', { error });
    }
  }

  private async blacklistAllUserTokens(userId: string) {
    try {
      // Blacklist all tokens for 24 hours (max access token lifetime)
      const expiresIn = 24 * 60 * 60; // 24 hours
      await redisClient.blacklistAllUserTokens(userId, expiresIn);
      
      logger.info('All user tokens blacklisted', { userId });
    } catch (error) {
      logger.error('Failed to blacklist all user tokens', { userId, error });
    }
  }

  private clearAuthCookies(res: Response) {
    try {
      // Clear all authentication-related cookies
      const cookieOptions = {
        httpOnly: true,
        secure: config.NODE_ENV === 'production',
        sameSite: 'strict' as const,
        path: '/'
      };

      res.clearCookie('accessToken', cookieOptions);
      res.clearCookie('refreshToken', cookieOptions);
      res.clearCookie('sessionId', cookieOptions);
      res.clearCookie('connect.sid', cookieOptions);

      logger.info('Authentication cookies cleared');
    } catch (error) {
      logger.error('Failed to clear cookies', { error });
    }
  }
}
