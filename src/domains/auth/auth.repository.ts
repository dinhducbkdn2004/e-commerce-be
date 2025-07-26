import { User } from '../../models/User';
import { CreateUserDTO, UpdateUserDTO } from '../../dtos/user.dto';

export class AuthRepository {
  async create(data: CreateUserDTO) {
    const user = new User(data);
    return await user.save();
  }

  async findByEmail(email: string) {
    return await User.findOne({ email });
  }

  async findById(id: string) {
    return await User.findById(id);
  }

  async findByEmailVerificationToken(token: string) {
    return await User.findOne({ emailVerificationToken: token });
  }

  async findByPasswordResetToken(token: string) {
    return await User.findOne({ 
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() }
    });
  }

  async verifyEmail(userId: string) {
    return await User.findByIdAndUpdate(
      userId,
      { 
        isEmailVerified: true,
        emailVerificationToken: undefined,
        emailVerificationExpires: undefined
      },
      { new: true }
    );
  }

  async setEmailVerificationToken(userId: string, token: string, expiry: Date) {
    return await User.findByIdAndUpdate(
      userId,
      { 
        emailVerificationToken: token,
        emailVerificationExpires: expiry
      },
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

  async saveRefreshToken(userId: string, tokenData: any) {
    return await User.findByIdAndUpdate(
      userId,
      { 
        $push: { 
          refreshTokens: tokenData 
        }
      },
      { new: true }
    );
  }

  async invalidateRefreshTokens(userId: string) {
    return await User.findByIdAndUpdate(
      userId,
      { 
        $set: { 
          'refreshTokens.$[].isActive': false 
        }
      },
      { new: true }
    );
  }

  async removeRefreshToken(userId: string, token: string) {
    return await User.findByIdAndUpdate(
      userId,
      { 
        $pull: { 
          refreshTokens: { token } 
        }
      },
      { new: true }
    );
  }

  async update(id: string, data: Partial<UpdateUserDTO>) {
    return await User.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async delete(id: string) {
    return await User.findByIdAndDelete(id);
  }
} 