import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { UserRepository } from '../../repositories/UserRepository';
import { 
    CreateUserDTO,
    UpdateUserDTO
} from '../../dtos/user.dto';
import { AppError } from '../../middlewares/errorHandler';
import { logger } from '../../utils/logger';
import { config } from '../../config';

export class BaseUserService {
    protected userRepo = new UserRepository();

    async createUser(data: CreateUserDTO) {
        try {
            const existingUser = await this.userRepo.findByEmail(data.email);

            if (existingUser) {
                throw new AppError('Email already exists', 409);
            }

            const hashedPassword = await bcrypt.hash(data.password, 12);
            
            // Generate email verification token
            const emailVerificationToken = crypto.randomBytes(32).toString('hex');

            const user = await this.userRepo.create({
                ...data,
                password: hashedPassword,
                emailVerificationToken
            });

            // Business event - log ở Service
            logger.info('User created successfully', {
                userId: user._id,
                email: user.email,
                role: user.role
            });

            const { password, ...userWithoutPassword } = user.toObject();
            return {
                user: userWithoutPassword,
                emailVerificationToken // This should be sent via email in a real app
            };
        } catch (error) {
            // Business error - log ở Service
            logger.error('Error creating user', {
                email: data.email,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw error;
        }
    }

    async login(email: string, password: string) {
        try {
            const user = await this.userRepo.findByEmail(email);
            
            if (!user || !await bcrypt.compare(password, user.password)) {
                // Security event - log ở Service
                logger.warn('Failed login attempt', {
                    email,
                    timestamp: new Date().toISOString()
                });
                throw new AppError('Invalid credentials', 401);
            }

            const token = jwt.sign(
                { id: user._id, email: user.email, role: user.role },
                config.JWT_SECRET,
                { expiresIn: config.JWT_EXPIRES_IN } as jwt.SignOptions
            );

            // Security event - log ở Service
            logger.info('User logged in successfully', {
                userId: user._id,
                email: user.email
            });

            return { 
                token, 
                user: { 
                    id: user._id, 
                    name: user.name,
                    email: user.email, 
                    role: user.role,
                    isEmailVerified: user.isEmailVerified 
                } 
            };
        } catch (error) {
            if (error instanceof AppError) {
                throw error; // Đã được log ở trên
            }
            
            logger.error('Login service error', {
                email,
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

    async updateUser(userId: string, data: Partial<UpdateUserDTO>) {
        try {
            const user = await this.userRepo.findById(userId);
            if (!user) {
                throw new AppError('User not found', 404);
            }

            // If updating email, check if new email already exists
            if (data.email && data.email !== user.email) {
                const existingUser = await this.userRepo.findByEmail(data.email);
                if (existingUser) {
                    throw new AppError('Email already exists', 409);
                }
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
                email: user.email
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
