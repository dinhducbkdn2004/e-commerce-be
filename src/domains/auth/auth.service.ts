import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { Request } from 'express';
import { AuthRepository } from './auth.repository';
import { EmailVerificationDTO, UserPasswordResetDTO } from '../../dtos/user.dto';
import { AppError } from '../../shared/middlewares/errorHandler';
import { logger } from '../../shared/utils/logger';
import { config } from '../../shared/config';
import { IUser } from '../../models/User';

export class AuthService {
  private authRepo = new AuthRepository();

  async register(userData: any) {
    try {
      // Check if user already exists
      const existingUser = await this.authRepo.findByEmail(userData.email);
      if (existingUser) {
        throw new AppError('Email đã tồn tại', 409);
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      
      // Generate email verification token
      const emailVerificationToken = crypto.randomBytes(32).toString('hex');
      const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      const newUser = await this.authRepo.create({
        ...userData,
        password: hashedPassword,
        emailVerificationToken,
        emailVerificationExpires,
        isEmailVerified: false
      });

      logger.info('User registered successfully', {
        userId: newUser._id,
        email: newUser.email
      });

      return {
        user: this.sanitizeUser(newUser),
        emailVerificationToken
      };
    } catch (error) {
      logger.error('Registration error', {
        email: userData.email,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  async login(email: string, password: string, req: Request) {
    try {
      const user = await this.authRepo.findByEmail(email);
      
      if (!user) {
        logger.warn('Login attempt for non-existent user', {
          email,
          ip: req.ip,
          userAgent: req.get('user-agent')
        });
        throw new AppError('Email hoặc mật khẩu không đúng', 401);
      }

      // Check if account is locked
      if (user.isLocked) {
        const lockUntil = user.lockUntil || new Date();
        const remainingTime = Math.ceil((lockUntil.getTime() - Date.now()) / (1000 * 60));
        throw new AppError(`Account locked. Try again in ${remainingTime} minutes`, 423);
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        await user.incrementFailedAttempts();
        
        logger.warn('Failed login attempt', {
          userId: user._id,
          email,
          ip: req.ip,
          failedAttempts: user.failedAttempts + 1
        });
        
        throw new AppError('Email hoặc mật khẩu không đúng', 401);
      }

      // Reset failed attempts on successful login
      await user.resetFailedAttempts();

      // Generate tokens
      const accessToken = this.generateAccessToken(user);
      const refreshToken = this.generateRefreshToken(user);

      // Save refresh token to database
      await this.saveRefreshToken(user._id.toString(), refreshToken, req);

      logger.info('User logged in successfully', {
        userId: user._id,
        email: user.email,
        ip: req.ip
      });

      return {
        user: this.sanitizeUser(user),
        accessToken,
        refreshToken,
        tokenType: 'Bearer',
        expiresIn: 15 * 60 // 15 minutes for access token
      };

    } catch (error) {
      logger.error('Login error', {
        email,
        ip: req.ip,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  async googleAuth(idToken: string, googleUser: any, req: Request) {
    try {
      // In a real app, verify the idToken with Google
      // For now, we'll trust the provided user data
      
      let user = await this.authRepo.findByEmail(googleUser.email);
      
      if (!user) {
        // Create new user from Google data
        user = await this.authRepo.create({
          name: googleUser.displayName,
          email: googleUser.email,
          password: crypto.randomBytes(32).toString('hex'), // Random password
          isEmailVerified: googleUser.emailVerified,
          googleId: googleUser.uid,
          avatar: googleUser.photoURL
        });
      } else if (!user.googleId) {
        // Link Google account to existing user
        user.googleId = googleUser.uid;
        await user.save();
      }

      // Generate tokens
      const accessToken = this.generateAccessToken(user);
      const refreshToken = this.generateRefreshToken(user);

      // Save refresh token
      await this.saveRefreshToken(user._id.toString(), refreshToken, req);

      return {
        user: this.sanitizeUser(user),
        accessToken,
        refreshToken,
        tokenType: 'Bearer',
        expiresIn: 15 * 60
      };
    } catch (error) {
      logger.error('Google authentication error', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  async logout(userId: string, req: Request) {
    try {
      if (userId) {
        // Invalidate all refresh tokens for this user
        await this.authRepo.invalidateRefreshTokens(userId);
      }
      
      logger.info('User logged out', {
        userId,
        ip: req.ip
      });
    } catch (error) {
      logger.error('Logout error', {
        userId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, config.JWT_REFRESH_SECRET) as any;
      
      if (decoded.type !== 'refresh') {
        throw new AppError('Invalid token type', 401);
      }

      // Find user and validate refresh token
      const user = await this.authRepo.findById(decoded.id);
      if (!user) {
        throw new AppError('User not found', 401);
      }

      const storedToken = user.refreshTokens.find(
        rt => rt.token === refreshToken && rt.isActive
      );

      if (!storedToken) {
        throw new AppError('Invalid refresh token', 401);
      }

      // Generate new access token
      const newAccessToken = this.generateAccessToken(user);

      return {
        accessToken: newAccessToken,
        tokenType: 'Bearer',
        expiresIn: 15 * 60
      };
    } catch (error) {
      throw new AppError('Invalid refresh token', 401);
    }
  }

  async verifyEmail(token: string) {
    try {
      const user = await this.authRepo.findByEmailVerificationToken(token);
      
      if (!user) {
        throw new AppError('Invalid verification token', 400);
      }

      if (user.emailVerificationExpires && user.emailVerificationExpires < new Date()) {
        throw new AppError('Verification token has expired', 400);
      }

      user.isEmailVerified = true;
      user.emailVerificationToken = undefined;
      user.emailVerificationExpires = undefined;
      await user.save();

      logger.info('Email verified successfully', {
        userId: user._id,
        email: user.email
      });
    } catch (error) {
      throw error;
    }
  }

  async requestPasswordReset(email: string) {
    try {
      const user = await this.authRepo.findByEmail(email);
      
      if (!user) {
        // Don't reveal if email exists or not
        return;
      }

      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      user.passwordResetToken = resetToken;
      user.passwordResetExpires = resetExpires;
      await user.save();

      // In real app, send email with reset token
      logger.info('Password reset requested', {
        userId: user._id,
        email: user.email
      });
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const user = await this.authRepo.findByPasswordResetToken(token);
      
      if (!user) {
        throw new AppError('Invalid reset token', 400);
      }

      if (user.passwordResetExpires && user.passwordResetExpires < new Date()) {
        throw new AppError('Reset token has expired', 400);
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);
      
      user.password = hashedPassword;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();

      logger.info('Password reset successfully', {
        userId: user._id,
        email: user.email
      });
    } catch (error) {
      throw error;
    }
  }

  private generateAccessToken(user: IUser): string {
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
      type: 'access'
    };

    const options: SignOptions = {
      expiresIn: '15m',
      issuer: 'ecommerce-api'
    };

    return jwt.sign(payload, config.JWT_SECRET, options);
  }

  private generateRefreshToken(user: IUser): string {
    const payload = {
      id: user._id,
      email: user.email,
      type: 'refresh'
    };

    const options: SignOptions = {
      expiresIn: '7d',
      issuer: 'ecommerce-api'
    };

    return jwt.sign(payload, config.JWT_REFRESH_SECRET, options);
  }

  private async saveRefreshToken(userId: string, token: string, req: Request) {
    const refreshTokenData = {
      token,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      isActive: true
    };

    await this.authRepo.saveRefreshToken(userId, refreshTokenData);
  }

  private sanitizeUser(user: IUser) {
    const { password, refreshTokens, emailVerificationToken, passwordResetToken, ...sanitized } = user.toObject();
    return sanitized;
  }
} 