import { WishlistRepository } from './wishlist.repository';
import { CartService } from '../cart/cart.service';
import { logger } from '../../shared/utils/logger';

export class WishlistService {
  private wishlistRepository: WishlistRepository;
  private cartService: CartService;

  constructor() {
    this.wishlistRepository = new WishlistRepository();
    this.cartService = new CartService();
  }

  async getWishlist(userId: string): Promise<any> {
    try {
      const wishlistItems = await this.wishlistRepository.getWishlist(userId);
      
      return {
        items: wishlistItems,
        count: wishlistItems.length
      };
    } catch (error) {
      logger.error('Error in getWishlist:', error);
      throw error;
    }
  }

  async addToWishlist(userId: string, productId: string): Promise<boolean> {
    try {
      // Check if product is already in wishlist
      const isAlreadyInWishlist = await this.wishlistRepository.isInWishlist(userId, productId);
      
      if (isAlreadyInWishlist) {
        return false; // Product already in wishlist
      }

      await this.wishlistRepository.addToWishlist(userId, productId);
      logger.info(`Product ${productId} added to wishlist for user ${userId}`);
      return true;
    } catch (error) {
      logger.error('Error in addToWishlist:', error);
      throw error;
    }
  }

  async removeFromWishlist(userId: string, productId: string): Promise<boolean> {
    try {
      const success = await this.wishlistRepository.removeFromWishlist(userId, productId);
      
      if (success) {
        logger.info(`Product ${productId} removed from wishlist for user ${userId}`);
      }
      
      return success;
    } catch (error) {
      logger.error('Error in removeFromWishlist:', error);
      throw error;
    }
  }

  async clearWishlist(userId: string): Promise<void> {
    try {
      await this.wishlistRepository.clearWishlist(userId);
      logger.info(`Wishlist cleared for user ${userId}`);
    } catch (error) {
      logger.error('Error in clearWishlist:', error);
      throw error;
    }
  }

  async isInWishlist(userId: string, productId: string): Promise<boolean> {
    try {
      return await this.wishlistRepository.isInWishlist(userId, productId);
    } catch (error) {
      logger.error('Error in isInWishlist:', error);
      throw error;
    }
  }

  async getWishlistCount(userId: string): Promise<number> {
    try {
      return await this.wishlistRepository.getWishlistCount(userId);
    } catch (error) {
      logger.error('Error in getWishlistCount:', error);
      throw error;
    }
  }

  async moveToCart(userId: string, productId: string, options: {
    quantity: number;
    selectedSize?: string;
    selectedColor?: string;
  }): Promise<boolean> {
    try {
      // Check if product is in wishlist
      const isInWishlist = await this.wishlistRepository.isInWishlist(userId, productId);
      
      if (!isInWishlist) {
        throw new Error('Product not found in wishlist');
      }

      // Add to cart
      await this.cartService.addToCart(userId, {
        productId,
        quantity: options.quantity,
        selectedSize: options.selectedSize,
        selectedColor: options.selectedColor
      });

      // Remove from wishlist
      await this.wishlistRepository.removeFromWishlist(userId, productId);

      logger.info(`Product ${productId} moved from wishlist to cart for user ${userId}`);
      return true;
    } catch (error) {
      logger.error('Error in moveToCart:', error);
      throw error;
    }
  }

  async getWishlistWithPagination(userId: string, page: number, limit: number): Promise<any> {
    try {
      const result = await this.wishlistRepository.getWishlistWithPagination(userId, page, limit);
      return result;
    } catch (error) {
      logger.error('Error in getWishlistWithPagination:', error);
      throw error;
    }
  }

  async toggleWishlist(userId: string, productId: string): Promise<{ isInWishlist: boolean; action: 'added' | 'removed' }> {
    try {
      const isCurrentlyInWishlist = await this.wishlistRepository.isInWishlist(userId, productId);
      
      if (isCurrentlyInWishlist) {
        await this.wishlistRepository.removeFromWishlist(userId, productId);
        return { isInWishlist: false, action: 'removed' };
      } else {
        await this.wishlistRepository.addToWishlist(userId, productId);
        return { isInWishlist: true, action: 'added' };
      }
    } catch (error) {
      logger.error('Error in toggleWishlist:', error);
      throw error;
    }
  }

  async bulkAddToCart(userId: string, productIds: string[]): Promise<{ successCount: number; failedProducts: string[] }> {
    try {
      let successCount = 0;
      const failedProducts: string[] = [];

      for (const productId of productIds) {
        try {
          // Check if product is in wishlist
          const isInWishlist = await this.wishlistRepository.isInWishlist(userId, productId);
          
          if (isInWishlist) {
            // Add to cart with default quantity 1
            await this.cartService.addToCart(userId, {
              productId,
              quantity: 1
            });

            // Remove from wishlist
            await this.wishlistRepository.removeFromWishlist(userId, productId);
            successCount++;
          } else {
            failedProducts.push(productId);
          }
        } catch (error) {
          logger.error(`Error moving product ${productId} to cart:`, error);
          failedProducts.push(productId);
        }
      }

      return { successCount, failedProducts };
    } catch (error) {
      logger.error('Error in bulkAddToCart:', error);
      throw error;
    }
  }
}
