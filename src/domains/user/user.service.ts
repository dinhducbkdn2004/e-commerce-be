import bcrypt from 'bcrypt';
import { UserRepository } from './user.repository';
import { UpdateUserDTO } from '../../dtos/user.dto';
import { AppError } from '../../shared/middlewares/errorHandler';
import { logger } from '../../shared/utils/logger';

export class UserService {
  private userRepo = new UserRepository();

  async getAllUsers() {
    try {
      const users = await this.userRepo.findAll();
      
      logger.info('Retrieved all users successfully', {
        count: users.length
      });

      return users.map(user => this.sanitizeUser(user));
    } catch (error) {
      logger.error('Error retrieving all users', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  async getUserById(id: string) {
    try {
      const user = await this.userRepo.findById(id);
      
      if (!user) {
        throw new AppError('User not found', 404);
      }

      logger.info('Retrieved user by ID successfully', {
        userId: id
      });

      return this.sanitizeUser(user);
    } catch (error) {
      logger.error('Error retrieving user by ID', {
        userId: id,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  async updateUser(id: string, data: UpdateUserDTO) {
    try {
      const user = await this.userRepo.findById(id);
      
      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Hash password if provided
      if (data.password) {
        data.password = await bcrypt.hash(data.password, 12);
      }

      // Check if email is being changed and if it already exists
      if (data.email && data.email !== user.email) {
        const existingUser = await this.userRepo.findByEmail(data.email);
        if (existingUser) {
          throw new AppError('Email already exists', 409);
        }
      }

      const updatedUser = await this.userRepo.update(id, data);
      
      if (!updatedUser) {
        throw new AppError('Failed to update user', 500);
      }

      logger.info('User updated successfully', {
        userId: id,
        updatedFields: Object.keys(data)
      });

      return this.sanitizeUser(updatedUser);
    } catch (error) {
      logger.error('Error updating user', {
        userId: id,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  async deleteUser(id: string) {
    try {
      const user = await this.userRepo.findById(id);
      
      if (!user) {
        throw new AppError('User not found', 404);
      }

      await this.userRepo.delete(id);
      
      logger.info('User deleted successfully', {
        userId: id,
        email: user.email
      });

      return { message: 'User deleted successfully' };
    } catch (error) {
      logger.error('Error deleting user', {
        userId: id,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  async searchUsers(query: string) {
    try {
      const users = await this.userRepo.searchUsers(query);
      
      logger.info('User search completed', {
        query,
        resultCount: users.length
      });

      return users.map(user => this.sanitizeUser(user));
    } catch (error) {
      logger.error('Error searching users', {
        query,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  async updateUserStatus(id: string, isActive: boolean) {
    try {
      const updatedUser = await this.userRepo.update(id, { isActive });
      
      if (!updatedUser) {
        throw new AppError('User not found', 404);
      }

      logger.info('User status updated', {
        userId: id,
        isActive
      });

      return this.sanitizeUser(updatedUser);
    } catch (error) {
      logger.error('Error updating user status', {
        userId: id,
        isActive,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  private sanitizeUser(user: any) {
    const { password, refreshTokens, emailVerificationToken, passwordResetToken, ...sanitized } = user.toObject();
    return sanitized;
  }
} 