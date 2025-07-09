import { Request, Response, NextFunction } from 'express';
import { logger } from '../../utils/logger';
import { BaseUserController } from './BaseUserController';

export class CartController extends BaseUserController {
  async addToCart(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.params.id;
      const cartItem = req.body;

      logger.info('Add to cart request received', {
        ip: req.ip,
        userId,
        productId: cartItem.productId
      });

      const result = await this.userService.addToCart(userId, cartItem);
      
      res.status(201).json({
        status: 'success',
        message: result.message,
        data: {
          cart: result.cart
        }
      });
    } catch (error) {
      logger.error('Add to cart request failed', {
        ip: req.ip,
        userId: req.params.id,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      next(error);
    }
  }

  async updateCartItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id: userId, productId } = req.params;
      const updates = req.body;

      logger.info('Update cart item request received', {
        ip: req.ip,
        userId,
        productId
      });

      const result = await this.userService.updateCartItem(userId, productId, updates);
      
      res.status(200).json({
        status: 'success',
        message: result.message,
        data: {
          cart: result.cart
        }
      });
    } catch (error) {
      logger.error('Update cart item request failed', {
        ip: req.ip,
        userId: req.params.id,
        productId: req.params.productId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      next(error);
    }
  }

  async removeFromCart(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id: userId, productId } = req.params;

      logger.info('Remove from cart request received', {
        ip: req.ip,
        userId,
        productId
      });

      const result = await this.userService.removeFromCart(userId, productId);
      
      res.status(200).json({
        status: 'success',
        message: result.message,
        data: {
          cart: result.cart
        }
      });
    } catch (error) {
      logger.error('Remove from cart request failed', {
        ip: req.ip,
        userId: req.params.id,
        productId: req.params.productId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      next(error);
    }
  }

  async clearCart(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.params.id;

      logger.info('Clear cart request received', {
        ip: req.ip,
        userId
      });

      const result = await this.userService.clearCart(userId);
      
      res.status(200).json({
        status: 'success',
        message: result.message,
        data: {
          cart: result.cart
        }
      });
    } catch (error) {
      logger.error('Clear cart request failed', {
        ip: req.ip,
        userId: req.params.id,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      next(error);
    }
  }
}
