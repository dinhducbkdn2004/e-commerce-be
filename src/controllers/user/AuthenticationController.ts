import { Request, Response, NextFunction } from 'express';
import { logger } from '../../utils/logger';
import { BaseUserController } from './BaseUserController';

export class AuthenticationController extends BaseUserController {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      logger.info('Registration request received', {
        ip: req.ip,
        email: req.body.email
      });

      const result = await this.userService.createUser(req.body);
      
      logger.info('Registration completed successfully', {
        userId: result.user._id,
        email: result.user.email,
        name: result.user.name
      });

      // In a real application, we would not return the verification token
      // but instead send it via email
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
          // Only for development purposes
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
      const result = await this.userService.login(email, password);
      
      logger.info('Login request completed successfully', {
        userId: result.user.id,
        email: result.user.email
      });

      res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      logger.error('Login request failed', {
        ip: req.ip,
        email: req.body.email,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      next(error);
    }
  }

  async verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, token } = req.body;

      logger.info('Verify email request received', {
        ip: req.ip,
        email
      });

      const result = await this.userService.verifyEmail({ email, token });
      
      res.status(200).json({
        status: 'success',
        message: result.message,
        data: {
          isVerified: result.isVerified
        }
      });
    } catch (error) {
      logger.error('Verify email request failed', {
        ip: req.ip,
        email: req.body.email,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      next(error);
    }
  }

  async resendVerificationEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;

      logger.info('Resend verification email request received', {
        ip: req.ip,
        email
      });

      const result = await this.userService.resendVerificationEmail(email);
      
      res.status(200).json({
        status: 'success',
        message: result.message,
        data: {
          // In production, we would not return the token
          emailVerificationToken: result.emailVerificationToken
        }
      });
    } catch (error) {
      logger.error('Resend verification email request failed', {
        ip: req.ip,
        email: req.body.email,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      next(error);
    }
  }

  async requestPasswordReset(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;

      logger.info('Password reset request received', {
        ip: req.ip,
        email
      });

      const result = await this.userService.requestPasswordReset(email);
      
      res.status(200).json({
        status: 'success',
        message: result.message,
        data: {
          // In production, we would not return the token
          resetToken: result.resetToken
        }
      });
    } catch (error) {
      logger.error('Password reset request failed', {
        ip: req.ip,
        email: req.body.email,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, token, newPassword } = req.body;

      logger.info('Reset password request received', {
        ip: req.ip,
        email
      });

      const result = await this.userService.resetPassword({ email, token, newPassword });
      
      res.status(200).json({
        status: 'success',
        message: result.message
      });
    } catch (error) {
      logger.error('Reset password request failed', {
        ip: req.ip,
        email: req.body.email,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      next(error);
    }
  }
}
