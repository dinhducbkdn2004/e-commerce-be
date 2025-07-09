import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/UserRepository';
import { CreateUserDTO } from '../dtos/user.dto';
import { AppError } from '../middlewares/errorHandler';
import { logger } from '../utils/logger';
import { config } from '../config';

export class UserService {
    private userRepo = new UserRepository();

    async createUser(data: CreateUserDTO) {
        try {
            const existingUser = await this.userRepo.findByUsername(data.username);

            if (existingUser) {
                throw new AppError('Username already exists', 409);
            }

            const hashedPassword = await bcrypt.hash(data.password, 12);

            const user = await this.userRepo.create({
                ...data,
                password: hashedPassword
            });

            // Business event - log ở Service
            logger.info('User created successfully', {
                userId: user._id,
                username: user.username,
                role: user.role
            });

            const { password, ...userWithoutPassword } = user.toObject();
            return userWithoutPassword;
        } catch (error) {
            // Business error - log ở Service
            logger.error('Error creating user', {
                username: data.username,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw error;
        }
    }

    async login(username: string, password: string) {
        try {
            const user = await this.userRepo.findByUsername(username);
            
            if (!user || !await bcrypt.compare(password, user.password)) {
                // Security event - log ở Service
                logger.warn('Failed login attempt', {
                    username,
                    timestamp: new Date().toISOString()
                });
                throw new AppError('Invalid credentials', 401);
            }

            const token = jwt.sign(
                { id: user._id, username: user.username, role: user.role },
                config.JWT_SECRET,
                { expiresIn: config.JWT_EXPIRES_IN } as jwt.SignOptions
            );

            // Security event - log ở Service
            logger.info('User logged in successfully', {
                userId: user._id,
                username: user.username
            });

            return { token, user: { id: user._id, username: user.username, role: user.role } };
        } catch (error) {
            if (error instanceof AppError) {
                throw error; // Đã được log ở trên
            }
            
            logger.error('Login service error', {
                username,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw new AppError('Login failed', 500);
        }
    }

    async getAllUsers() {
        try {
            const users = await this.userRepo.findAll();
            return users.map(user => {
                const { password, ...userWithoutPassword } = user.toObject();
                return userWithoutPassword;
            });
        } catch (error) {
            logger.error('Error fetching all users', {
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw new AppError('Failed to fetch users', 500);
        }
    }

    async getUserById(userId: string) {
        try {
            const user = await this.userRepo.findById(userId);
            if (!user) {
                throw new AppError('User not found', 404);
            }
            const { password, ...userWithoutPassword } = user.toObject();
            return userWithoutPassword;
        } catch (error) {
            logger.error('Error fetching user by ID', {
                userId,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw new AppError('Failed to fetch user', 500);
        }
    }

    async updateUser(userId: string, data: Partial<CreateUserDTO>) {
        try {
            const user = await this.userRepo.findById(userId);
            if (!user) {
                throw new AppError('User not found', 404);
            }

            if (data.password) {
                data.password = await bcrypt.hash(data.password, 12);
            }

            const updatedUser = await this.userRepo.update(userId, data);
            
            if (!updatedUser) {
                throw new AppError('Failed to update user', 500);
            }
            
            const { password, ...userWithoutPassword } = updatedUser.toObject();
            return userWithoutPassword;
        } catch (error) {
            logger.error('Error updating user', {
                userId,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw new AppError('Failed to update user', 500);
        }
    }

    async deleteUser(userId: string) {
        try {
            const user = await this.userRepo.findById(userId);
            if (!user) {
                throw new AppError('User not found', 404);
            }

            await this.userRepo.delete(userId);

            // Business event - log ở Service
            logger.info('User deleted successfully', {
                userId: user._id,
                username: user.username
            });

            return { message: 'User deleted successfully' };
        } catch (error) {
            logger.error('Error deleting user', {
                userId,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw new AppError('Failed to delete user', 500);
        }
    }
}