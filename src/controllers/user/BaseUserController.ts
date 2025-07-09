import { Request, Response, NextFunction } from 'express';
import { UserService } from '../../services/UserService';
import { logger } from '../../utils/logger';

export class BaseUserController {
  protected userService = new UserService();

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // HTTP request tracking - log ở Controller
      logger.info('Create user request received', {
        ip: req.ip,
        userAgent: req.get('user-agent')
      });

      const result = await this.userService.createUser(req.body);
      
      // HTTP success tracking - log ở Controller
      logger.info('Create user request completed successfully', {
        userId: result.user._id,
        statusCode: 201
      });

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
          // Only returning the token for development purposes
          emailVerificationToken: result.emailVerificationToken
        }
      });
    } catch (error) {
      // HTTP error tracking - log ở Controller
      logger.error('Create user request failed', {
        ip: req.ip,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      next(error);
    }
  }
  
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // HTTP request tracking - log ở Controller
      logger.info('Get all users request received', {
        ip: req.ip,
        userAgent: req.get('user-agent')
      });

      const users = await this.userService.getAllUsers();
      
      // HTTP success tracking - log ở Controller
      logger.info('Get all users request completed successfully', {
        count: users.length,
        statusCode: 200
      });

      res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
          users
        }
      });
    } catch (error) {
      // HTTP error tracking - log ở Controller
      logger.error('Get all users request failed', {
        ip: req.ip,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      next(error);
    }
  }
  
  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // HTTP request tracking - log ở Controller
      logger.info('Get user by ID request received', {
        ip: req.ip,
        userAgent: req.get('user-agent'),
        userId: req.params.id
      });

      const user = await this.userService.getUserById(req.params.id);
      
      // HTTP success tracking - log ở Controller
      logger.info('Get user by ID request completed successfully', {
        userId: req.params.id,
        statusCode: 200
      });

      res.status(200).json({
        status: 'success',
        data: {
          user
        }
      });
    } catch (error) {
      // HTTP error tracking - log ở Controller
      logger.error('Get user by ID request failed', {
        ip: req.ip,
        userId: req.params.id,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      next(error);
    }
  }
  
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // HTTP request tracking - log ở Controller
      logger.info('Update user request received', {
        ip: req.ip,
        userAgent: req.get('user-agent'),
        userId: req.params.id
      });

      const user = await this.userService.updateUser(req.params.id, req.body);
      
      // HTTP success tracking - log ở Controller
      logger.info('Update user request completed successfully', {
        userId: req.params.id,
        statusCode: 200
      });

      res.status(200).json({
        status: 'success',
        data: {
          user
        }
      });
    } catch (error) {
      // HTTP error tracking - log ở Controller
      logger.error('Update user request failed', {
        ip: req.ip,
        userId: req.params.id,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      next(error);
    }
  }
  
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // HTTP request tracking - log ở Controller
      logger.info('Delete user request received', {
        ip: req.ip,
        userAgent: req.get('user-agent'),
        userId: req.params.id
      });

      const result = await this.userService.deleteUser(req.params.id);
      
      // HTTP success tracking - log ở Controller
      logger.info('Delete user request completed successfully', {
        userId: req.params.id,
        statusCode: 200
      });

      res.status(200).json({
        status: 'success',
        message: result.message
      });
    } catch (error) {
      // HTTP error tracking - log ở Controller
      logger.error('Delete user request failed', {
        ip: req.ip,
        userId: req.params.id,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      next(error);
    }
  }
}
