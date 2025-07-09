import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { UserRepository } from '../../repositories/UserRepository';
import { EmailVerificationDTO, UserPasswordResetDTO } from '../../dtos/user.dto';
import { AppError } from '../../middlewares/errorHandler';
import { logger } from '../../utils/logger';
import { BaseUserService } from './BaseUserService';

export class AuthenticationService extends BaseUserService {
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
