import mongoose from 'mongoose';
import { User } from '../../models/User';
import { Product } from '../../models/Product';
import { logger } from '../../shared/utils/logger';

export class WishlistRepository {

  async getWishlist(userId: string): Promise<any[]> {
    try {
      const user = await User.findById(userId)
        .populate({
          path: 'wishlist',
          model: 'Product',
          select: 'name price images brand category stock isActive rating reviewCount',
          match: { isActive: true } // Only get active products
        })
        .lean();

      if (!user || !user.wishlist) {
        return [];
      }

      // Filter out null entries (products that may have been deleted)
      return user.wishlist.filter(product => product !== null);
    } catch (error) {
      logger.error('Error in getWishlist:', error);
      throw new Error('Failed to get wishlist');
    }
  }

  async addToWishlist(userId: string, productId: string): Promise<void> {
    try {
      // Verify product exists and is active
      const product = await Product.findById(productId);
      if (!product || !product.isActive) {
        throw new Error('Product not found or not available');
      }

      const result = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { wishlist: new mongoose.Types.ObjectId(productId) } },
        { new: true }
      );

      if (!result) {
        throw new Error('User not found');
      }
    } catch (error) {
      logger.error('Error in addToWishlist:', error);
      throw error;
    }
  }

  async removeFromWishlist(userId: string, productId: string): Promise<boolean> {
    try {
      const result = await User.findByIdAndUpdate(
        userId,
        { $pull: { wishlist: new mongoose.Types.ObjectId(productId) } },
        { new: true }
      );

      return !!result;
    } catch (error) {
      logger.error('Error in removeFromWishlist:', error);
      throw error;
    }
  }

  async clearWishlist(userId: string): Promise<void> {
    try {
      const result = await User.findByIdAndUpdate(
        userId,
        { $set: { wishlist: [] } },
        { new: true }
      );

      if (!result) {
        throw new Error('User not found');
      }
    } catch (error) {
      logger.error('Error in clearWishlist:', error);
      throw error;
    }
  }

  async isInWishlist(userId: string, productId: string): Promise<boolean> {
    try {
      const user = await User.findOne({
        _id: userId,
        wishlist: new mongoose.Types.ObjectId(productId)
      }).lean();

      return !!user;
    } catch (error) {
      logger.error('Error in isInWishlist:', error);
      throw error;
    }
  }

  async getWishlistCount(userId: string): Promise<number> {
    try {
      const user = await User.findById(userId).lean();
      return user?.wishlist?.length || 0;
    } catch (error) {
      logger.error('Error in getWishlistCount:', error);
      throw error;
    }
  }

  async getWishlistWithPagination(userId: string, page: number, limit: number): Promise<any> {
    try {
      const skip = (page - 1) * limit;

      const user = await User.findById(userId)
        .populate({
          path: 'wishlist',
          model: 'Product',
          select: 'name price images brand category stock isActive rating reviewCount createdAt',
          match: { isActive: true },
          options: {
            skip,
            limit,
            sort: { createdAt: -1 } // Most recently added first
          }
        })
        .lean();

      if (!user) {
        throw new Error('User not found');
      }

      const totalItems = await this.getWishlistCount(userId);
      const totalPages = Math.ceil(totalItems / limit);

      return {
        items: user.wishlist?.filter(product => product !== null) || [],
        pagination: {
          page,
          limit,
          total: totalItems,
          pages: totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      };
    } catch (error) {
      logger.error('Error in getWishlistWithPagination:', error);
      throw error;
    }
  }

  async getWishlistProductIds(userId: string): Promise<string[]> {
    try {
      const user = await User.findById(userId).select('wishlist').lean();
      
      if (!user || !user.wishlist) {
        return [];
      }

      return user.wishlist.map(id => id.toString());
    } catch (error) {
      logger.error('Error in getWishlistProductIds:', error);
      throw error;
    }
  }

  async bulkRemoveFromWishlist(userId: string, productIds: string[]): Promise<number> {
    try {
      const objectIds = productIds.map(id => new mongoose.Types.ObjectId(id));
      
      const result = await User.findByIdAndUpdate(
        userId,
        { $pullAll: { wishlist: objectIds } },
        { new: true }
      );

      if (!result) {
        throw new Error('User not found');
      }

      return productIds.length;
    } catch (error) {
      logger.error('Error in bulkRemoveFromWishlist:', error);
      throw error;
    }
  }

  async getWishlistByCategory(userId: string, categoryId: string): Promise<any[]> {
    try {
      const user = await User.findById(userId)
        .populate({
          path: 'wishlist',
          model: 'Product',
          select: 'name price images brand category stock isActive rating reviewCount',
          match: { 
            isActive: true,
            category: new mongoose.Types.ObjectId(categoryId)
          }
        })
        .lean();

      if (!user || !user.wishlist) {
        return [];
      }

      return user.wishlist.filter(product => product !== null);
    } catch (error) {
      logger.error('Error in getWishlistByCategory:', error);
      throw error;
    }
  }
}
