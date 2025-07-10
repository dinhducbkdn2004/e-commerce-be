import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { Request } from 'express';
import { UserRepository } from '../../repositories/UserRepository';
import { EmailVerificationDTO, UserPasswordResetDTO } from '../../dtos/user.dto';
import { AppError } from '../../middlewares/errorHandler';
import { logger } from '../../utils/logger';
import { BaseUserService } from './BaseUserService';
import { config } from '../../config';
import { IUser } from '../../models/User';

export class AuthenticationService extends BaseUserService {
    async login(email: string, password: string, req: Request) {
        try {
            const user = await this.userRepo.findByEmail(email);
            
            if (!user) {
                // Log failed attempt for non-existent user
                logger.warn('Login attempt for non-existent user', {
                    email,
                    ip: req.ip,
                    userAgent: req.get('user-agent')
                });
                throw new AppError('Invalid credentials', 401);
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
                
                throw new AppError('Invalid credentials', 401);
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

    async refreshAccessToken(refreshToken: string, req: Request) {
        try {
            // Verify refresh token
            const decoded = jwt.verify(refreshToken, config.JWT_REFRESH_SECRET) as any;
            
            if (decoded.type !== 'refresh') {
                throw new AppError('Invalid token type', 401);
            }

            // Find user and validate refresh token
            const user = await this.userRepo.findById(decoded.id);
            if (!user) {
                throw new AppError('User not found', 401);
            }

            const storedToken = user.refreshTokens.find(
                rt => rt.token === refreshToken && rt.isActive
            );

            if (!storedToken) {
                throw new AppError('Invalid refresh token', 401);
            }

            // Check if token is expired
            if (storedToken.expiresAt < new Date()) {
                await this.revokeRefreshToken(user._id.toString(), refreshToken);
                throw new AppError('Refresh token expired', 401);
            }

            // Generate new tokens
            const newAccessToken = this.generateAccessToken(user);
            const newRefreshToken = this.generateRefreshToken(user);

            // Revoke old refresh token and save new one
            await this.revokeRefreshToken(user._id.toString(), refreshToken);
            await this.saveRefreshToken(user._id.toString(), newRefreshToken, req);

            logger.info('Access token refreshed', {
                userId: user._id,
                ip: req.ip
            });

            return {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
                tokenType: 'Bearer',
                expiresIn: 15 * 60
            };

        } catch (error) {
            logger.error('Token refresh failed', { 
                error: error instanceof Error ? error.message : 'Unknown error',
                ip: req.ip 
            });
            throw error instanceof AppError ? error : new AppError('Token refresh failed', 401);
        }
    }

    async revokeRefreshToken(userId: string, refreshToken: string) {
        try {
            const user = await this.userRepo.findById(userId);
            if (user) {
                await this.userRepo.updateUser(userId, {
                    $set: { 'refreshTokens.$[elem].isActive': false }
                }, {
                    arrayFilters: [{ 'elem.token': refreshToken }]
                });
            }
        } catch (error) {
            logger.error('Error revoking refresh token', { userId, error });
        }
    }

    async revokeAllRefreshTokens(userId: string) {
        try {
            await this.userRepo.updateUser(userId, {
                $set: { 'refreshTokens.$[].isActive': false }
            });
            
            logger.info('All refresh tokens revoked', { userId });
        } catch (error) {
            logger.error('Error revoking all refresh tokens', { userId, error });
            throw new AppError('Failed to revoke tokens', 500);
        }
    }

    private generateAccessToken(user: IUser): string {
        return jwt.sign(
            { 
                id: user._id, 
                email: user.email, 
                role: user.role,
                type: 'access'
            },
            config.JWT_SECRET,
            { expiresIn: config.JWT_EXPIRES_IN } as SignOptions
        );
    }

    private generateRefreshToken(user: IUser): string {
        return jwt.sign(
            { 
                id: user._id, 
                type: 'refresh',
                jti: crypto.randomUUID() // Unique token ID
            },
            config.JWT_REFRESH_SECRET,
            { expiresIn: config.JWT_EXPIRES_IN_REFRESH } as SignOptions
        );
    }

    private async saveRefreshToken(userId: string, refreshToken: string, req: Request) {
        try {
            const decoded = jwt.decode(refreshToken) as any;
            const deviceFingerprint = this.generateDeviceFingerprint(req);
            
            await this.userRepo.updateUser(userId, {
                $push: {
                    refreshTokens: {
                        token: refreshToken,
                        createdAt: new Date(),
                        expiresAt: new Date(decoded.exp * 1000),
                        deviceFingerprint,
                        isActive: true
                    }
                }
            });
        } catch (error) {
            logger.error('Error saving refresh token', { userId, error });
            throw new AppError('Failed to save refresh token', 500);
        }
    }

    private generateDeviceFingerprint(req: Request): string {
        const components = [
            req.get('user-agent') || '',
            req.get('accept-language') || '',
            req.ip || ''
        ];
        
        return crypto
            .createHash('sha256')
            .update(components.join('|'))
            .digest('hex');
    }

    private sanitizeUser(user: IUser) {
        const { password, refreshTokens, passwordResetToken, emailVerificationToken, ...sanitizedUser } = user.toObject();
        return sanitizedUser;
    }
    async verifyEmail(data: EmailVerificationDTO) {
        try {
            const { email, token } = data;
            
            const user = await this.userRepo.findByEmail(email);
            if (!user) {
                throw new AppError('User not found', 404);
            }
            
            if (user.isEmailVerified) {
                return { message: 'Email already verified' };
            }
            
            if (!user.emailVerificationToken || user.emailVerificationToken !== token) {
                throw new AppError('Invalid or expired verification token', 400);
            }
            
            const updatedUser = await this.userRepo.verifyEmail(user._id ? user._id.toString() : user.id);
            
            return { 
                message: 'Email verified successfully',
                isVerified: true
            };
        } catch (error) {
            logger.error('Error verifying email', {
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw error instanceof AppError ? error : new AppError('Failed to verify email', 500);
        }
    }

    async resendVerificationEmail(email: string) {
        try {
            const user = await this.userRepo.findByEmail(email);
            if (!user) {
                throw new AppError('User not found', 404);
            }
            
            if (user.isEmailVerified) {
                return { message: 'Email already verified' };
            }
            
            // Generate new verification token
            const emailVerificationToken = crypto.randomBytes(32).toString('hex');
            
            const updatedUser = await this.userRepo.setEmailVerificationToken(
                user._id ? user._id.toString() : user.id,
                emailVerificationToken
            );
            
            // In a real app, send email with token here
            
            return { 
                message: 'Verification email sent',
                // Include token in response for development purposes
                // In production, this would be sent via email only
                emailVerificationToken
            };
        } catch (error) {
            logger.error('Error resending verification email', {
                email,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw error instanceof AppError ? error : new AppError('Failed to resend verification email', 500);
        }
    }

    async requestPasswordReset(email: string) {
        try {
            const user = await this.userRepo.findByEmail(email);
            if (!user) {
                // For security reasons, always return success even if user not found
                return { message: 'If the email exists, a reset link has been sent' };
            }
            
            // Generate reset token
            const resetToken = crypto.randomBytes(32).toString('hex');
            
            // Token expires in 1 hour
            const resetTokenExpiry = new Date();
            resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1);
            
            await this.userRepo.setPasswordResetToken(
                email,
                resetToken,
                resetTokenExpiry
            );
            
            // In a real app, send email with reset token here
            
            return { 
                message: 'If the email exists, a reset link has been sent',
                // Include token in response for development purposes
                // In production, this would be sent via email only
                resetToken
            };
        } catch (error) {
            logger.error('Error requesting password reset', {
                email,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            // For security reasons, don't expose the error
            return { message: 'If the email exists, a reset link has been sent' };
        }
    }

    async resetPassword(data: UserPasswordResetDTO) {
        try {
            const { email, token, newPassword } = data;
            
            const user = await this.userRepo.findByEmail(email);
            if (!user) {
                throw new AppError('Invalid or expired reset token', 400);
            }
            
            if (!user.passwordResetToken || 
                user.passwordResetToken !== token || 
                !user.passwordResetExpires ||
                user.passwordResetExpires < new Date()) {
                throw new AppError('Invalid or expired reset token', 400);
            }
            
            const hashedPassword = await bcrypt.hash(newPassword, 12);
            
            const updatedUser = await this.userRepo.resetPassword(
                user._id ? user._id.toString() : user.id,
                hashedPassword
            );
            
            return { message: 'Password reset successfully' };
        } catch (error) {
            logger.error('Error resetting password', {
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw error instanceof AppError ? error : new AppError('Failed to reset password', 500);
        }
    }
}
