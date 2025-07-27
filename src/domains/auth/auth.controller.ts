import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { logger } from '../../shared/utils/logger';
import { ResponseHelper, Messages } from '../../shared/utils/responseHelper';

export class AuthController {
  private authService = new AuthService();

  async register(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
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

      return ResponseHelper.created(res, {
        user: {
          id: result.user._id,
          name: result.user.name,
          email: result.user.email,
          role: result.user.role
        },
        emailVerificationToken: result.emailVerificationToken
      }, Messages.AUTH.REGISTER_SUCCESS.en, Messages.AUTH.REGISTER_SUCCESS.vi);
    } catch (error) {
      logger.error('Registration request failed', {
        ip: req.ip,
        email: req.body.email,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      logger.info('Login request received', {
        ip: req.ip,
        email: req.body.email
      });

      const { email, password } = req.body;
      const result = await this.authService.login(email, password, req);
      
      // 🔥 Set refresh token vào httpOnly cookie
      res.cookie('refresh_token', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // chỉ HTTPS ở production
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
        path: '/'
      });

      logger.info('Login successful', {
        userId: result.user._id,
        email: result.user.email,
        ip: req.ip
      });

      // 🔥 Không trả refresh token trong response body
      const { refreshToken, ...responseData } = result;
      
      return ResponseHelper.success(res, responseData, Messages.AUTH.LOGIN_SUCCESS.en, Messages.AUTH.LOGIN_SUCCESS.vi);
    } catch (error) {
      logger.error('Login failed', {
        ip: req.ip,
        email: req.body.email,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      next(error);
    }
  }

  async googleAuth(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { idToken, user } = req.body;
      const result = await this.authService.googleAuth(idToken, user, req);
      
      // 🔥 Set refresh token vào httpOnly cookie
      res.cookie('refresh_token', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/'
      });

      logger.info('Google authentication successful', {
        userId: result.user._id,
        email: result.user.email,
        ip: req.ip
      });

      // 🔥 Không trả refresh token trong response body
      const { refreshToken, ...responseData } = result;

      return ResponseHelper.success(res, responseData, Messages.AUTH.GOOGLE_AUTH_SUCCESS.en, Messages.AUTH.GOOGLE_AUTH_SUCCESS.vi);
    } catch (error) {
      logger.error('Google authentication failed', {
        ip: req.ip,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const userId = req.user?.id;
      await this.authService.logout(userId, req);
      
      // 🔥 Xóa refresh token cookie
      res.clearCookie('refresh_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/'
      });
      
      logger.info('Logout successful', {
        userId,
        ip: req.ip
      });

      return ResponseHelper.success(res, null, Messages.AUTH.LOGOUT_SUCCESS.en, Messages.AUTH.LOGOUT_SUCCESS.vi);
    } catch (error) {
      logger.error('Logout failed', {
        ip: req.ip,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      // 🔥 Đọc refresh token từ cookie thay vì request body
      const refreshToken = req.cookies.refresh_token;
      
      if (!refreshToken) {
        return ResponseHelper.unauthorized(res, 'Refresh token not found', 'Không tìm thấy refresh token');
      }
      
      const result = await this.authService.refreshToken(refreshToken);
      
      return ResponseHelper.success(res, result, Messages.AUTH.TOKEN_REFRESH_SUCCESS.en, Messages.AUTH.TOKEN_REFRESH_SUCCESS.vi);
    } catch (error) {
      next(error);
    }
  }

  async verifyEmail(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { token } = req.body;
      await this.authService.verifyEmail(token);
      
      return ResponseHelper.success(res, null, Messages.AUTH.EMAIL_VERIFIED.en, Messages.AUTH.EMAIL_VERIFIED.vi);
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { email } = req.body;
      await this.authService.requestPasswordReset(email);
      
      return ResponseHelper.success(res, null, Messages.AUTH.PASSWORD_RESET_SENT.en, Messages.AUTH.PASSWORD_RESET_SENT.vi);
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { token, password } = req.body;
      await this.authService.resetPassword(token, password);
      
      return ResponseHelper.success(res, null, Messages.AUTH.PASSWORD_RESET_SUCCESS.en, Messages.AUTH.PASSWORD_RESET_SUCCESS.vi);
    } catch (error) {
      next(error);
    }
  }
} 