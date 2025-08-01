import { Request, Response, NextFunction } from 'express';
import { UserService } from './user.service';
import { logger } from '../../shared/utils/logger';
import { ResponseHelper, Messages } from '../../shared/utils/responseHelper';

export class UserController {
  private userService = new UserService();

  async getProfile(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const userId = req.user?.id;
      const user = await this.userService.getUserById(userId);
      
      logger.info('Get user profile request completed', {
        userId,
        ip: req.ip
      });

      return ResponseHelper.success(res, { user }, Messages.USER.PROFILE_RETRIEVED.en, Messages.USER.PROFILE_RETRIEVED.vi);
    } catch (error) {
      logger.error('Get user profile failed', {
        userId: req.user?.id,
        ip: req.ip,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      next(error);
    }
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      logger.info('Get all users request received', {
        ip: req.ip,
        userAgent: req.get('user-agent')
      });

      const users = await this.userService.getAllUsers();
      
      logger.info('Get all users request completed successfully', {
        count: users.length,
        statusCode: 200
      });

      return ResponseHelper.success(res, { users }, Messages.USER.USERS_RETRIEVED.en, Messages.USER.USERS_RETRIEVED.vi);
    } catch (error) {
      logger.error('Get all users request failed', {
        ip: req.ip,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      next(error);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { id } = req.params;
      logger.info('Get user by ID request received', {
        targetUserId: id,
        ip: req.ip
      });

      const user = await this.userService.getUserById(id);
      
      logger.info('Get user by ID request completed successfully', {
        targetUserId: id,
        statusCode: 200
      });

      return ResponseHelper.success(res, { user }, Messages.USER.PROFILE_RETRIEVED.en, Messages.USER.PROFILE_RETRIEVED.vi);
    } catch (error) {
      logger.error('Get user by ID request failed', {
        targetUserId: req.params.id,
        ip: req.ip,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      next(error);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const userId = req.user?.id;
      logger.info('Update user profile request received', {
        userId,
        ip: req.ip
      });

      const updatedUser = await this.userService.updateUser(userId, req.body);
      
      logger.info('Update user profile request completed successfully', {
        userId,
        statusCode: 200
      });

      return ResponseHelper.success(res, { user: updatedUser }, Messages.USER.PROFILE_UPDATED.en, Messages.USER.PROFILE_UPDATED.vi);
    } catch (error) {
      logger.error('Update user profile request failed', {
        userId: req.user?.id,
        ip: req.ip,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      next(error);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { id } = req.params;
      logger.info('Update user request received', {
        targetUserId: id,
        requesterId: req.user?.id,
        ip: req.ip
      });

      const updatedUser = await this.userService.updateUser(id, req.body);
      
      logger.info('Update user request completed successfully', {
        targetUserId: id,
        statusCode: 200
      });

      return ResponseHelper.success(res, { user: updatedUser }, Messages.USER.USER_UPDATED.en, Messages.USER.USER_UPDATED.vi);
    } catch (error) {
      logger.error('Update user request failed', {
        targetUserId: req.params.id,
        requesterId: req.user?.id,
        ip: req.ip,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      next(error);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { id } = req.params;
      logger.info('Delete user request received', {
        targetUserId: id,
        requesterId: req.user?.id,
        ip: req.ip
      });

      await this.userService.deleteUser(id);
      
      logger.info('Delete user request completed successfully', {
        targetUserId: id,
        statusCode: 200
      });

      return ResponseHelper.success(res, null, Messages.USER.USER_DELETED.en, Messages.USER.USER_DELETED.vi);
    } catch (error) {
      logger.error('Delete user request failed', {
        targetUserId: req.params.id,
        requesterId: req.user?.id,
        ip: req.ip,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      next(error);
    }
  }
} 