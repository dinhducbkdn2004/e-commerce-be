import { User } from '../../models/User';
import { BaseUserRepository } from './BaseUserRepository';

export class WishlistRepository extends BaseUserRepository {
  async addToWishlist(userId: string, productId: string) {
    return await User.findByIdAndUpdate(
      userId,
      { $addToSet: { wishlist: productId } },
      { new: true }
    );
  }

  async removeFromWishlist(userId: string, productId: string) {
    return await User.findByIdAndUpdate(
      userId,
      { $pull: { wishlist: productId } },
      { new: true }
    );
  }
}
