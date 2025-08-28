import { CartRepository } from './cart.repository';
import { CartItemDTO, UpdateCartDTO } from '../../dtos/cart.dto';
import { ICartItem } from '../../models/CartItem';
import { logger } from '../../shared/utils/logger';

export class CartService {
  private cartRepository: CartRepository;

  constructor() {
    this.cartRepository = new CartRepository();
  }

  async getCartByUserId(userId: string): Promise<any> {
    try {
      const cartItems = await this.cartRepository.getCartByUserId(userId);
      
      // Calculate total amount and count
      const totalAmount = cartItems.reduce((total, item) => {
        return total + (item.product?.price || 0) * item.quantity;
      }, 0);
      
      const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

      return {
        items: cartItems,
        totalAmount,
        totalItems,
        currency: 'VND'
      };
    } catch (error) {
      logger.error('Error in getCartByUserId:', error);
      throw error;
    }
  }

  async addToCart(userId: string, cartItemData: CartItemDTO): Promise<any> {
    try {
      // Check if item already exists in cart
      const existingItem = await this.cartRepository.findCartItem(
        userId, 
        cartItemData.productId, 
        cartItemData.selectedSize, 
        cartItemData.selectedColor
      );

      if (existingItem) {
        // Update quantity if item exists
        const newQuantity = existingItem.quantity + cartItemData.quantity;
        return await this.cartRepository.updateCartItemQuantity(
          userId, 
          existingItem._id.toString(), 
          newQuantity
        );
      } else {
        // Add new item to cart
        return await this.cartRepository.addToCart(userId, cartItemData);
      }
    } catch (error) {
      logger.error('Error in addToCart:', error);
      throw error;
    }
  }

  async updateCartItem(userId: string, itemId: string, updateData: UpdateCartDTO): Promise<any> {
    try {
      return await this.cartRepository.updateCartItem(userId, itemId, updateData);
    } catch (error) {
      logger.error('Error in updateCartItem:', error);
      throw error;
    }
  }

  async removeFromCart(userId: string, itemId: string): Promise<void> {
    try {
      await this.cartRepository.removeFromCart(userId, itemId);
    } catch (error) {
      logger.error('Error in removeFromCart:', error);
      throw error;
    }
  }

  async clearCart(userId: string): Promise<void> {
    try {
      await this.cartRepository.clearCart(userId);
    } catch (error) {
      logger.error('Error in clearCart:', error);
      throw error;
    }
  }

  async getCartItemCount(userId: string): Promise<number> {
    try {
      return await this.cartRepository.getCartItemCount(userId);
    } catch (error) {
      logger.error('Error in getCartItemCount:', error);
      throw error;
    }
  }

  async validateCartItem(userId: string, itemId: string): Promise<boolean> {
    try {
      const item = await this.cartRepository.findCartItemById(userId, itemId);
      return !!item;
    } catch (error) {
      logger.error('Error in validateCartItem:', error);
      return false;
    }
  }
}
