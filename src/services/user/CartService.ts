import { UserRepository } from '../../repositories/UserRepository';
import { CartItemDTO } from '../../dtos/user.dto';
import { AppError } from '../../middlewares/errorHandler';
import { logger } from '../../utils/logger';
import { BaseUserService } from './BaseUserService';

export class CartService extends BaseUserService {
    async addToCart(userId: string, item: CartItemDTO) {
        try {
            const user = await this.userRepo.findById(userId);
            if (!user) {
                throw new AppError('User not found', 404);
            }

            const updatedUser = await this.userRepo.addToCart(userId, item);
            if (!updatedUser) {
                throw new AppError('Failed to add item to cart', 500);
            }

            return {
                message: 'Item added to cart',
                cart: updatedUser.cart
            };
        } catch (error) {
            logger.error('Error adding item to cart', {
                userId,
                productId: item.productId,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw new AppError('Failed to add item to cart', 500);
        }
    }

    async updateCartItem(userId: string, productId: string, updates: Partial<CartItemDTO>) {
        try {
            const user = await this.userRepo.findById(userId);
            if (!user) {
                throw new AppError('User not found', 404);
            }

            const itemInCart = user.cart.some(item => item.productId.toString() === productId);
            if (!itemInCart) {
                throw new AppError('Item not in cart', 404);
            }

            const updatedUser = await this.userRepo.updateCartItem(userId, productId, updates);
            if (!updatedUser) {
                throw new AppError('Failed to update cart item', 500);
            }

            return {
                message: 'Cart item updated',
                cart: updatedUser.cart
            };
        } catch (error) {
            logger.error('Error updating cart item', {
                userId,
                productId,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw new AppError('Failed to update cart item', 500);
        }
    }

    async removeFromCart(userId: string, productId: string) {
        try {
            const user = await this.userRepo.findById(userId);
            if (!user) {
                throw new AppError('User not found', 404);
            }

            const updatedUser = await this.userRepo.removeFromCart(userId, productId);
            
            return {
                message: 'Item removed from cart',
                cart: updatedUser?.cart || []
            };
        } catch (error) {
            logger.error('Error removing item from cart', {
                userId,
                productId,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw new AppError('Failed to remove item from cart', 500);
        }
    }

    async clearCart(userId: string) {
        try {
            const user = await this.userRepo.findById(userId);
            if (!user) {
                throw new AppError('User not found', 404);
            }

            const updatedUser = await this.userRepo.clearCart(userId);
            
            return {
                message: 'Cart cleared',
                cart: updatedUser?.cart || []
            };
        } catch (error) {
            logger.error('Error clearing cart', {
                userId,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw new AppError('Failed to clear cart', 500);
        }
    }
}
