import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/UserService';
import { logger } from '../utils/logger';

export class AuthController {
  private userService = new UserService();

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
