import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/UserService';
import { logger } from '../utils/logger';

export class UserController {
  private userService = new UserService();

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // HTTP request tracking - log ở Controller
      logger.info('Create user request received', {
        ip: req.ip,
        userAgent: req.get('user-agent')
      });

      const user = await this.userService.createUser(req.body);
      
      // HTTP success tracking - log ở Controller
      logger.info('Create user request completed successfully', {
        userId: user._id,
        statusCode: 201
      });

      res.status(201).json({
        status: 'success',
        data: user
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
        userCount: users.length,
        statusCode: 200
      });

      res.status(200).json({
        status: 'success',
        data: users
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
      const userId = req.params.id;

      // HTTP request tracking - log ở Controller
      logger.info(`Get user by ID request received for user ${userId}`, {
        ip: req.ip,
        userAgent: req.get('user-agent')
      });

      const user = await this.userService.getUserById(userId);
      
      if (!user) {
        logger.warn(`User not found with ID ${userId}`, { userId });
        res.status(404).json({
          status: 'error',
          message: `User with ID ${userId} not found`
        });
        return;
      }

      // HTTP success tracking - log ở Controller
      logger.info(`Get user by ID request completed successfully for user ${userId}`, {
        statusCode: 200
      });

      res.status(200).json({
        status: 'success',
        data: user
      });
    } catch (error) {
      // HTTP error tracking - log ở Controller
      logger.error(`Get user by ID request failed for user ${req.params.id}`, {
        ip: req.ip,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.params.id;

      // HTTP request tracking - log ở Controller
      logger.info(`Update user request received for user ${userId}`, {
        ip: req.ip,
        userAgent: req.get('user-agent')
      });

      const updatedUser = await this.userService.updateUser(userId, req.body);
      
      if (!updatedUser) {
        logger.warn(`User not found for update with ID ${userId}`, { userId });
        res.status(404).json({
          status: 'error',
          message: `User with ID ${userId} not found`
        });
        return;
      }

      // HTTP success tracking - log ở Controller
      logger.info(`Update user request completed successfully for user ${userId}`, {
        statusCode: 200
      });

      res.status(200).json({
        status: 'success',
        data: updatedUser
      });
    } catch (error) {
      // HTTP error tracking - log ở Controller
      logger.error(`Update user request failed for user ${req.params.id}`, {
        ip: req.ip,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.params.id;

      // HTTP request tracking - log ở Controller
      logger.info(`Delete user request received for user ${userId}`, {
        ip: req.ip,
        userAgent: req.get('user-agent')
      });

      const deletedUser = await this.userService.deleteUser(userId);
      
      if (!deletedUser) {
        logger.warn(`User not found for deletion with ID ${userId}`, { userId });
        res.status(404).json({
          status: 'error',
          message: `User with ID ${userId} not found`
        });
        return;
      }

      // HTTP success tracking - log ở Controller
      logger.info(`Delete user request completed successfully for user ${userId}`, {
        statusCode: 200
      });

      res.status(200).json({
        status: 'success',
        data: deletedUser
      });
    } catch (error) {
      // HTTP error tracking - log ở Controller
      logger.error(`Delete user request failed for user ${req.params.id}`, {
        ip: req.ip,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      next(error);
    }
  }

}