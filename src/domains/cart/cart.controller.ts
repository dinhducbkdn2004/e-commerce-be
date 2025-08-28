import { Request, Response } from 'express';
import { CartService } from './cart.service';
import { CartItemDTO, UpdateCartDTO } from '../../dtos/cart.dto';
import { ResponseHelper } from '../../shared/utils/responseHelper';
import { logger } from '../../shared/utils/logger';
import { AuthenticatedRequest } from '../../shared/types/express';

export class CartController {
  private cartService: CartService;

  constructor() {
    this.cartService = new CartService();
  }

  // Get user's cart
  async getCart(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        ResponseHelper.unauthorized(res, 'User not authenticated');
        return;
      }

      const cart = await this.cartService.getCartByUserId(userId);
      ResponseHelper.success(res, cart, 'Cart retrieved successfully', 'Lấy giỏ hàng thành công');
    } catch (error: any) {
      logger.error('Error getting cart:', error);
      ResponseHelper.error(res, 'Failed to get cart', 'Không thể lấy giỏ hàng');
    }
  }

  // Add item to cart
  async addToCart(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        ResponseHelper.unauthorized(res, 'User not authenticated');
        return;
      }

      const cartItemData: CartItemDTO = req.body;
      const cartItem = await this.cartService.addToCart(userId, cartItemData);
      
      ResponseHelper.created(res, cartItem, 'Item added to cart successfully', 'Thêm sản phẩm vào giỏ hàng thành công');
    } catch (error: any) {
      logger.error('Error adding to cart:', error);
      ResponseHelper.error(res, error.message, 'Không thể thêm sản phẩm vào giỏ hàng');
    }
  }

  // Update cart item quantity
  async updateCartItem(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { itemId } = req.params;
      
      if (!userId) {
        ResponseHelper.unauthorized(res, 'User not authenticated');
        return;
      }

      const updateData: UpdateCartDTO = req.body;
      const updatedItem = await this.cartService.updateCartItem(userId, itemId, updateData);
      
      ResponseHelper.success(res, updatedItem, 'Cart item updated successfully', 'Cập nhật sản phẩm trong giỏ hàng thành công');
    } catch (error: any) {
      logger.error('Error updating cart item:', error);
      ResponseHelper.error(res, error.message, 'Không thể cập nhật sản phẩm trong giỏ hàng');
    }
  }

  // Remove item from cart
  async removeFromCart(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { itemId } = req.params;
      
      if (!userId) {
        ResponseHelper.unauthorized(res, 'User not authenticated');
        return;
      }

      await this.cartService.removeFromCart(userId, itemId);
      
      ResponseHelper.success(res, null, 'Item removed from cart successfully', 'Xóa sản phẩm khỏi giỏ hàng thành công');
    } catch (error: any) {
      logger.error('Error removing from cart:', error);
      ResponseHelper.error(res, error.message, 'Không thể xóa sản phẩm khỏi giỏ hàng');
    }
  }

  // Clear entire cart
  async clearCart(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        ResponseHelper.unauthorized(res, 'User not authenticated');
        return;
      }

      await this.cartService.clearCart(userId);
      
      ResponseHelper.success(res, null, 'Cart cleared successfully', 'Xóa toàn bộ giỏ hàng thành công');
    } catch (error: any) {
      logger.error('Error clearing cart:', error);
      ResponseHelper.error(res, error.message, 'Không thể xóa toàn bộ giỏ hàng');
    }
  }

  // Get cart item count
  async getCartItemCount(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        ResponseHelper.unauthorized(res, 'User not authenticated');
        return;
      }

      const count = await this.cartService.getCartItemCount(userId);
      
      ResponseHelper.success(res, { count }, 'Cart item count retrieved successfully', 'Lấy số lượng sản phẩm trong giỏ hàng thành công');
    } catch (error: any) {
      logger.error('Error getting cart item count:', error);
      ResponseHelper.error(res, error.message, 'Không thể lấy số lượng sản phẩm trong giỏ hàng');
    }
  }
}
