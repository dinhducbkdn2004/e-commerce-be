import { Request, Response, NextFunction } from 'express';
import { logger } from '../../utils/logger';
import { BaseUserController } from './BaseUserController';

export class OrderController extends BaseUserController {
  async addOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.params.id;
      const { orderId } = req.body;

      logger.info('Add order to user history request received', {
        ip: req.ip,
        userId,
        orderId
      });

      const result = await this.userService.addOrder(userId, orderId);
      
      res.status(201).json({
        status: 'success',
        message: result.message,
        data: {
          orders: result.orders
        }
      });
    } catch (error) {
      logger.error('Add order to user history request failed', {
        ip: req.ip,
        userId: req.params.id,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      next(error);
    }
  }
}
