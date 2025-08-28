import mongoose from 'mongoose';
import { User } from '../../models/User';
import { Product } from '../../models/Product';
import { CartItemDTO, UpdateCartDTO } from '../../dtos/cart.dto';
import { ICartItem } from '../../models/CartItem';
import { logger } from '../../shared/utils/logger';

export class CartRepository {
  
  async getCartByUserId(userId: string): Promise<any[]> {
    try {
      const user = await User.findById(userId)
        .populate({
          path: 'cart.productId',
          model: 'Product',
          select: 'name price images brand category stock isActive'
        })
        .lean();

      if (!user || !user.cart) {
        return [];
      }

      // Filter out items with invalid products and map to response format
      return user.cart
        .filter((item: any) => item.productId && item.productId.isActive)
        .map((item: any) => ({
          _id: item._id,
          product: {
            _id: item.productId._id,
            name: item.productId.name,
            price: item.productId.price,
            images: item.productId.images,
            brand: item.productId.brand,
            category: item.productId.category,
            stock: item.productId.stock,
            isActive: item.productId.isActive
          },
          quantity: item.quantity,
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor,
          subtotal: item.productId.price * item.quantity
        }));
    } catch (error) {
      logger.error('Error in getCartByUserId:', error);
      throw new Error('Failed to get cart items');
    }
  }

  async findCartItem(userId: string, productId: string, selectedSize?: string, selectedColor?: string): Promise<any> {
    try {
      const user = await User.findOne({
        _id: userId,
        'cart.productId': productId,
        ...(selectedSize && { 'cart.selectedSize': selectedSize }),
        ...(selectedColor && { 'cart.selectedColor': selectedColor })
      }).lean();

      if (!user || !user.cart) return null;

      return user.cart.find((item: any) => 
        item.productId.toString() === productId &&
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor
      );
    } catch (error) {
      logger.error('Error in findCartItem:', error);
      throw new Error('Failed to find cart item');
    }
  }

  async addToCart(userId: string, cartItemData: CartItemDTO): Promise<any> {
    try {
      // Verify product exists and is active
      const product = await Product.findById(cartItemData.productId);
      if (!product || !product.isActive) {
        throw new Error('Product not found or not available');
      }

      // Check stock availability
      if (product.stock < cartItemData.quantity) {
        throw new Error(`Insufficient stock. Available: ${product.stock}`);
      }

      const cartItem: ICartItem = {
        productId: new mongoose.Types.ObjectId(cartItemData.productId),
        quantity: cartItemData.quantity,
        selectedSize: cartItemData.selectedSize,
        selectedColor: cartItemData.selectedColor
      };

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $push: { cart: cartItem } },
        { new: true }
      );

      if (!updatedUser) {
        throw new Error('User not found');
      }

      // Return the newly added item with product details
      const newItem = updatedUser.cart[updatedUser.cart.length - 1];
      return {
        _id: newItem._id,
        product: {
          _id: product._id,
          name: product.name,
          price: product.price,
          images: product.images,
          brand: product.brand,
          category: product.category,
          stock: product.stock
        },
        quantity: newItem.quantity,
        selectedSize: newItem.selectedSize,
        selectedColor: newItem.selectedColor,
        subtotal: product.price * newItem.quantity
      };
    } catch (error) {
      logger.error('Error in addToCart:', error);
      throw error;
    }
  }

  async updateCartItem(userId: string, itemId: string, updateData: UpdateCartDTO): Promise<any> {
    try {
      // Verify product exists if productId is being updated
      if (updateData.productId) {
        const product = await Product.findById(updateData.productId);
        if (!product || !product.isActive) {
          throw new Error('Product not found or not available');
        }
      }

      const updateFields: any = {};
      if (updateData.quantity !== undefined) updateFields['cart.$.quantity'] = updateData.quantity;
      if (updateData.selectedSize !== undefined) updateFields['cart.$.selectedSize'] = updateData.selectedSize;
      if (updateData.selectedColor !== undefined) updateFields['cart.$.selectedColor'] = updateData.selectedColor;

      const updatedUser = await User.findOneAndUpdate(
        { _id: userId, 'cart._id': itemId },
        { $set: updateFields },
        { new: true }
      ).populate({
        path: 'cart.productId',
        model: 'Product',
        select: 'name price images brand category stock isActive'
      });

      if (!updatedUser) {
        throw new Error('Cart item not found');
      }

      const updatedItem = updatedUser.cart.find((item: any) => item._id.toString() === itemId);
      if (!updatedItem) {
        throw new Error('Cart item not found after update');
      }

      return {
        _id: updatedItem._id,
        product: updatedItem.productId,
        quantity: updatedItem.quantity,
        selectedSize: updatedItem.selectedSize,
        selectedColor: updatedItem.selectedColor,
        subtotal: updatedItem.productId.price * updatedItem.quantity
      };
    } catch (error) {
      logger.error('Error in updateCartItem:', error);
      throw error;
    }
  }

  async updateCartItemQuantity(userId: string, itemId: string, quantity: number): Promise<any> {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: userId, 'cart._id': itemId },
        { $set: { 'cart.$.quantity': quantity } },
        { new: true }
      ).populate({
        path: 'cart.productId',
        model: 'Product',
        select: 'name price images brand category stock isActive'
      });

      if (!updatedUser) {
        throw new Error('Cart item not found');
      }

      const updatedItem = updatedUser.cart.find((item: any) => item._id.toString() === itemId);
      return {
        _id: updatedItem._id,
        product: updatedItem.productId,
        quantity: updatedItem.quantity,
        selectedSize: updatedItem.selectedSize,
        selectedColor: updatedItem.selectedColor,
        subtotal: updatedItem.productId.price * updatedItem.quantity
      };
    } catch (error) {
      logger.error('Error in updateCartItemQuantity:', error);
      throw error;
    }
  }

  async removeFromCart(userId: string, itemId: string): Promise<void> {
    try {
      const result = await User.findByIdAndUpdate(
        userId,
        { $pull: { cart: { _id: itemId } } },
        { new: true }
      );

      if (!result) {
        throw new Error('User or cart item not found');
      }
    } catch (error) {
      logger.error('Error in removeFromCart:', error);
      throw error;
    }
  }

  async clearCart(userId: string): Promise<void> {
    try {
      const result = await User.findByIdAndUpdate(
        userId,
        { $set: { cart: [] } },
        { new: true }
      );

      if (!result) {
        throw new Error('User not found');
      }
    } catch (error) {
      logger.error('Error in clearCart:', error);
      throw error;
    }
  }

  async getCartItemCount(userId: string): Promise<number> {
    try {
      const user = await User.findById(userId).lean();
      if (!user || !user.cart) {
        return 0;
      }
      return user.cart.reduce((total: number, item: any) => total + item.quantity, 0);
    } catch (error) {
      logger.error('Error in getCartItemCount:', error);
      throw new Error('Failed to get cart item count');
    }
  }

  async findCartItemById(userId: string, itemId: string): Promise<any> {
    try {
      const user = await User.findOne({
        _id: userId,
        'cart._id': itemId
      }).lean();

      if (!user || !user.cart) return null;

      return user.cart.find((item: any) => item._id.toString() === itemId);
    } catch (error) {
      logger.error('Error in findCartItemById:', error);
      throw new Error('Failed to find cart item');
    }
  }
}
