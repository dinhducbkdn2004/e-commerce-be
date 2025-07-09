import { UserRepository } from '../../repositories/UserRepository';
import { AppError } from '../../middlewares/errorHandler';
import { logger } from '../../utils/logger';
import { BaseUserService } from './BaseUserService';

export class WishlistService extends BaseUserService {
    async addToWishlist(userId: string, productId: string) {
        try {
            const user = await this.userRepo.findById(userId);
            if (!user) {
                throw new AppError('User not found', 404);
            }

            const updatedUser = await this.userRepo.addToWishlist(userId, productId);
            
            return {
                message: 'Product added to wishlist',
                wishlist: updatedUser?.wishlist || []
            };
        } catch (error) {
            logger.error('Error adding to wishlist', {
                userId,
                productId,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw new AppError('Failed to add to wishlist', 500);
        }
    }

    async removeFromWishlist(userId: string, productId: string) {
        try {
            const user = await this.userRepo.findById(userId);
            if (!user) {
                throw new AppError('User not found', 404);
            }

            const updatedUser = await this.userRepo.removeFromWishlist(userId, productId);
            
            return {
                message: 'Product removed from wishlist',
                wishlist: updatedUser?.wishlist || []
            };
        } catch (error) {
            logger.error('Error removing from wishlist', {
                userId,
                productId,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw new AppError('Failed to remove from wishlist', 500);
        }
    }
}
