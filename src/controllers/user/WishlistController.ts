import { Request, Response, NextFunction } from 'express';
import { logger } from '../../utils/logger';
import { BaseUserController } from './BaseUserController';

export class WishlistController extends BaseUserController {
  async addToWishlist(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.params.id;
      const { productId } = req.body;

      logger.info('Add to wishlist request received', {
        ip: req.ip,
        userId,
        productId
      });

      const result = await this.userService.addToWishlist(userId, productId);
      
      res.status(201).json({
        status: 'success',
        message: result.message,
        data: {
          wishlist: result.wishlist
        }
      });
    } catch (error) {
      logger.error('Add to wishlist request failed', {
        ip: req.ip,
        userId: req.params.id,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      next(error);
    }
  }

  async removeFromWishlist(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id: userId, productId } = req.params;

      logger.info('Remove from wishlist request received', {
        ip: req.ip,
        userId,
        productId
      });

      const result = await this.userService.removeFromWishlist(userId, productId);
      
      res.status(200).json({
        status: 'success',
        message: result.message,
        data: {
          wishlist: result.wishlist
        }
      });
    } catch (error) {
      logger.error('Remove from wishlist request failed', {
        ip: req.ip,
        userId: req.params.id,
        productId: req.params.productId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      next(error);
    }
  }
}
