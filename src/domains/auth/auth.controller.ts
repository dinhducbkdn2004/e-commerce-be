import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { logger } from '../../shared/utils/logger';

export class AuthController {
  private authService = new AuthService();

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      logger.info('Registration request received', {
        ip: req.ip,
        email: req.body.email
      });

      const result = await this.authService.register(req.body);
      
      logger.info('Registration completed successfully', {
        userId: result.user._id,
        email: result.user.email,
        name: result.user.name
      });

      res.status(201).json({
        status: 'success',
        message: 'User registered successfully. Please verify your email.',
        data: {
          user: {
            id: result.user._id,
            name: result.user.name,
            email: result.user.email,
            role: result.user.role
          },
          emailVerificationToken: result.emailVerificationToken
        }
      });
    } catch (error) {
      logger.error('Registration request failed', {
        ip: req.ip,
        email: req.body.email,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      logger.info('Login request received', {
        ip: req.ip,
        email: req.body.email
      });

      const { email, password } = req.body;
      const result = await this.authService.login(email, password, req);
      
      logger.info('Login successful', {
        userId: result.user._id,
        email: result.user.email,
        ip: req.ip
      });

      res.json({
        status: 'success',
        message: 'Login successful',
        data: result
      });
    } catch (error) {
      logger.error('Login failed', {
        ip: req.ip,
        email: req.body.email,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      next(error);
    }
  }

  async googleAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { idToken, user } = req.body;
      const result = await this.authService.googleAuth(idToken, user, req);
      
      logger.info('Google authentication successful', {
        userId: result.user._id,
        email: result.user.email,
        ip: req.ip
      });

      res.json({
        status: 'success',
        message: 'Google authentication successful',
        data: result
      });
    } catch (error) {
      logger.error('Google authentication failed', {
        ip: req.ip,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      await this.authService.logout(userId, req);
      
      logger.info('Logout successful', {
        userId,
        ip: req.ip
      });

      res.json({
        status: 'success',
        message: 'Logout successful'
      });
    } catch (error) {
      logger.error('Logout failed', {
        ip: req.ip,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;
      const result = await this.authService.refreshToken(refreshToken);
      
      res.json({
        status: 'success',
        message: 'Token refreshed successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token } = req.body;
      await this.authService.verifyEmail(token);
      
      res.json({
        status: 'success',
        message: 'Email verified successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;
      await this.authService.requestPasswordReset(email);
      
      res.json({
        status: 'success',
        message: 'Password reset email sent'
      });
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token, password } = req.body;
      await this.authService.resetPassword(token, password);
      
      res.json({
        status: 'success',
        message: 'Password reset successfully'
      });
    } catch (error) {
      next(error);
    }
  }
} 