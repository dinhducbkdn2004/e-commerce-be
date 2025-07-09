import { User } from '../../models/User';
import { BaseUserRepository } from './BaseUserRepository';

export class AuthRepository extends BaseUserRepository {
  async verifyEmail(userId: string) {
    return await User.findByIdAndUpdate(
      userId,
      { 
        isEmailVerified: true,
        emailVerificationToken: undefined 
      },
      { new: true }
    );
  }

  async setEmailVerificationToken(userId: string, token: string) {
    return await User.findByIdAndUpdate(
      userId,
      { emailVerificationToken: token },
      { new: true }
    );
  }

  async setPasswordResetToken(email: string, token: string, expiry: Date) {
    return await User.findOneAndUpdate(
      { email },
      { 
        passwordResetToken: token,
        passwordResetExpires: expiry
      },
      { new: true }
    );
  }

  async resetPassword(userId: string, hashedPassword: string) {
    return await User.findByIdAndUpdate(
      userId,
      { 
        password: hashedPassword,
        passwordResetToken: undefined,
        passwordResetExpires: undefined
      },
      { new: true }
    );
  }
}
