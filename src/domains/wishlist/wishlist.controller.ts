import { Request, Response } from 'express';
import { WishlistService } from './wishlist.service';
import { ResponseHelper } from '../../shared/utils/ResponseHelper';
import { logger } from '../../shared/utils/logger';
import { AuthenticatedRequest } from '../../shared/types/express';

export class WishlistController {
  private wishlistService: WishlistService;

  constructor() {
    this.wishlistService = new WishlistService();
  }

  // Get user's wishlist
  async getWishlist(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        ResponseHelper.unauthorized(res, 'User not authenticated');
        return;
      }

      const wishlist = await this.wishlistService.getWishlist(userId);
      ResponseHelper.success(res, wishlist, 'Wishlist retrieved successfully', 'Lấy danh sách yêu thích thành công');
    } catch (error: any) {
      logger.error('Error getting wishlist:', error);
      ResponseHelper.error(res, error.message, 'Không thể lấy danh sách yêu thích');
    }
  }

  // Add product to wishlist
  async addToWishlist(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { productId } = req.body;
      
      if (!userId) {
        ResponseHelper.unauthorized(res, 'User not authenticated');
        return;
      }

      const success = await this.wishlistService.addToWishlist(userId, productId);
      
      if (success) {
        ResponseHelper.success(res, null, 'Product added to wishlist successfully', 'Thêm sản phẩm vào danh sách yêu thích thành công');
      } else {
        ResponseHelper.badRequest(res, 'Product already in wishlist', 'Sản phẩm đã có trong danh sách yêu thích');
      }
    } catch (error: any) {
      logger.error('Error adding to wishlist:', error);
      ResponseHelper.error(res, error.message, 'Không thể thêm sản phẩm vào danh sách yêu thích');
    }
  }

  // Remove product from wishlist
  async removeFromWishlist(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { productId } = req.params;
      
      if (!userId) {
        ResponseHelper.unauthorized(res, 'User not authenticated');
        return;
      }

      const success = await this.wishlistService.removeFromWishlist(userId, productId);
      
      if (success) {
        ResponseHelper.success(res, null, 'Product removed from wishlist successfully', 'Xóa sản phẩm khỏi danh sách yêu thích thành công');
      } else {
        ResponseHelper.notFound(res, 'Product not found in wishlist', 'Không tìm thấy sản phẩm trong danh sách yêu thích');
      }
    } catch (error: any) {
      logger.error('Error removing from wishlist:', error);
      ResponseHelper.error(res, error.message, 'Không thể xóa sản phẩm khỏi danh sách yêu thích');
    }
  }

  // Clear entire wishlist
  async clearWishlist(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        ResponseHelper.unauthorized(res, 'User not authenticated');
        return;
      }

      await this.wishlistService.clearWishlist(userId);
      ResponseHelper.success(res, null, 'Wishlist cleared successfully', 'Xóa toàn bộ danh sách yêu thích thành công');
    } catch (error: any) {
      logger.error('Error clearing wishlist:', error);
      ResponseHelper.error(res, error.message, 'Không thể xóa toàn bộ danh sách yêu thích');
    }
  }

  // Check if product is in wishlist
  async isInWishlist(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { productId } = req.params;
      
      if (!userId) {
        ResponseHelper.unauthorized(res, 'User not authenticated');
        return;
      }

      const isInWishlist = await this.wishlistService.isInWishlist(userId, productId);
      ResponseHelper.success(res, { isInWishlist }, 'Wishlist status checked successfully', 'Kiểm tra trạng thái yêu thích thành công');
    } catch (error: any) {
      logger.error('Error checking wishlist status:', error);
      ResponseHelper.error(res, error.message, 'Không thể kiểm tra trạng thái yêu thích');
    }
  }

  // Get wishlist count
  async getWishlistCount(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        ResponseHelper.unauthorized(res, 'User not authenticated');
        return;
      }

      const count = await this.wishlistService.getWishlistCount(userId);
      ResponseHelper.success(res, { count }, 'Wishlist count retrieved successfully', 'Lấy số lượng sản phẩm yêu thích thành công');
    } catch (error: any) {
      logger.error('Error getting wishlist count:', error);
      ResponseHelper.error(res, error.message, 'Không thể lấy số lượng sản phẩm yêu thích');
    }
  }

  // Move wishlist item to cart
  async moveToCart(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { productId } = req.params;
      const { quantity = 1, selectedSize, selectedColor } = req.body;
      
      if (!userId) {
        ResponseHelper.unauthorized(res, 'User not authenticated');
        return;
      }

      const success = await this.wishlistService.moveToCart(userId, productId, {
        quantity,
        selectedSize,
        selectedColor
      });
      
      if (success) {
        ResponseHelper.success(res, null, 'Product moved to cart successfully', 'Chuyển sản phẩm vào giỏ hàng thành công');
      } else {
        ResponseHelper.badRequest(res, 'Failed to move product to cart', 'Không thể chuyển sản phẩm vào giỏ hàng');
      }
    } catch (error: any) {
      logger.error('Error moving to cart:', error);
      ResponseHelper.error(res, error.message, 'Không thể chuyển sản phẩm vào giỏ hàng');
    }
  }

  // Get wishlist with pagination
  async getWishlistWithPagination(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 12;
      
      if (!userId) {
        ResponseHelper.unauthorized(res, 'User not authenticated');
        return;
      }

      const result = await this.wishlistService.getWishlistWithPagination(userId, page, limit);
      ResponseHelper.success(res, result, 'Wishlist retrieved successfully', 'Lấy danh sách yêu thích thành công');
    } catch (error: any) {
      logger.error('Error getting wishlist with pagination:', error);
      ResponseHelper.error(res, error.message, 'Không thể lấy danh sách yêu thích');
    }
  }
}
