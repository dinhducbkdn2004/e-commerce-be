import { User } from '../../models/User';
import { CartItemDTO } from '../../dtos/user.dto';
import { BaseUserRepository } from './BaseUserRepository';

export class CartRepository extends BaseUserRepository {
  async addToCart(userId: string, item: CartItemDTO) {
    // Check if the item already exists in cart
    const user = await User.findById(userId);
    const existingItemIndex = user?.cart.findIndex(
      cartItem => cartItem.productId.toString() === item.productId
    );

    if (existingItemIndex !== undefined && existingItemIndex >= 0) {
      // Update quantity of existing item
      return await User.findOneAndUpdate(
        { _id: userId, "cart.productId": item.productId },
        { 
          $inc: { "cart.$.quantity": item.quantity },
          $set: {
            "cart.$.selectedSize": item.selectedSize,
            "cart.$.selectedColor": item.selectedColor
          }
        },
        { new: true }
      );
    } else {
      // Add new item to cart
      return await User.findByIdAndUpdate(
        userId,
        { $push: { cart: item } },
        { new: true, runValidators: true }
      );
    }
  }

  async updateCartItem(userId: string, productId: string, updates: Partial<CartItemDTO>) {
    // Build the update object dynamically based on provided fields
    const updateFields: Record<string, any> = {};
    Object.keys(updates).forEach(key => {
      updateFields[`cart.$.${key}`] = (updates as any)[key];
    });
    
    return await User.findOneAndUpdate(
      { _id: userId, "cart.productId": productId },
      { $set: updateFields },
      { new: true, runValidators: true }
    );
  }

  async removeFromCart(userId: string, productId: string) {
    return await User.findByIdAndUpdate(
      userId,
      { $pull: { cart: { productId } } },
      { new: true }
    );
  }

  async clearCart(userId: string) {
    return await User.findByIdAndUpdate(
      userId,
      { $set: { cart: [] } },
      { new: true }
    );
  }
}
