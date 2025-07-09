import { Request, Response, NextFunction } from 'express';
import { logger } from '../../utils/logger';
import { BaseUserController } from './BaseUserController';

export class AddressController extends BaseUserController {
  async addAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.params.id;
      const address = req.body;

      logger.info('Add address request received', {
        ip: req.ip,
        userId
      });

      const result = await this.userService.addAddress(userId, address);
      
      res.status(201).json({
        status: 'success',
        message: result.message,
        data: {
          addresses: result.addresses
        }
      });
    } catch (error) {
      logger.error('Add address request failed', {
        ip: req.ip,
        userId: req.params.id,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      next(error);
    }
  }

  async updateAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id: userId, addressId } = req.params;
      const addressData = req.body;

      logger.info('Update address request received', {
        ip: req.ip,
        userId,
        addressId
      });

      const result = await this.userService.updateAddress(userId, addressId, addressData);
      
      res.status(200).json({
        status: 'success',
        message: result.message,
        data: {
          addresses: result.addresses
        }
      });
    } catch (error) {
      logger.error('Update address request failed', {
        ip: req.ip,
        userId: req.params.id,
        addressId: req.params.addressId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      next(error);
    }
  }

  async removeAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id: userId, addressId } = req.params;

      logger.info('Remove address request received', {
        ip: req.ip,
        userId,
        addressId
      });

      const result = await this.userService.removeAddress(userId, addressId);
      
      res.status(200).json({
        status: 'success',
        message: result.message,
        data: {
          addresses: result.addresses
        }
      });
    } catch (error) {
      logger.error('Remove address request failed', {
        ip: req.ip,
        userId: req.params.id,
        addressId: req.params.addressId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      next(error);
    }
  }
}
