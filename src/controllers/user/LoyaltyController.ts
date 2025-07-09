import { Request, Response, NextFunction } from 'express';
import { logger } from '../../utils/logger';
import { BaseUserController } from './BaseUserController';

export class LoyaltyController extends BaseUserController {
  async updatePoints(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.params.id;
      const { points } = req.body;

      logger.info('Update points request received', {
        ip: req.ip,
        userId,
        points
      });

      const result = await this.userService.updatePoints(userId, points);
      
      res.status(200).json({
        status: 'success',
        message: result.message,
        data: {
          currentPoints: result.currentPoints
        }
      });
    } catch (error) {
      logger.error('Update points request failed', {
        ip: req.ip,
        userId: req.params.id,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      next(error);
    }
  }

  async addVoucher(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.params.id;
      const { voucherId } = req.body;

      logger.info('Add voucher request received', {
        ip: req.ip,
        userId,
        voucherId
      });

      const result = await this.userService.addVoucher(userId, voucherId);
      
      res.status(201).json({
        status: 'success',
        message: result.message,
        data: {
          vouchers: result.vouchers
        }
      });
    } catch (error) {
      logger.error('Add voucher request failed', {
        ip: req.ip,
        userId: req.params.id,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      next(error);
    }
  }

  async removeVoucher(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id: userId, voucherId } = req.params;

      logger.info('Remove voucher request received', {
        ip: req.ip,
        userId,
        voucherId
      });

      const result = await this.userService.removeVoucher(userId, voucherId);
      
      res.status(200).json({
        status: 'success',
        message: result.message,
        data: {
          vouchers: result.vouchers
        }
      });
    } catch (error) {
      logger.error('Remove voucher request failed', {
        ip: req.ip,
        userId: req.params.id,
        voucherId: req.params.voucherId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      next(error);
    }
  }
}
