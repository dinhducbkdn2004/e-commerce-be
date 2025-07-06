import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/UserService';
import { logger } from '../utils/logger';

export class UserController {
  private userService = new UserService();

  async create(req: Request, res: Response, next: NextFunction) {
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

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      logger.info('Login request received', {
        ip: req.ip,
        username: req.body.username
      });

      const { username, password } = req.body;
      const result = await this.userService.login(username, password);
      
      logger.info('Login request completed successfully', {
        userId: result.user.id,
        username: result.user.username
      });

      res.json({
        status: 'success',
        data: result
      });
    } catch (error) {
      logger.error('Login request failed', {
        ip: req.ip,
        username: req.body.username,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      next(error);
    }
  }
}