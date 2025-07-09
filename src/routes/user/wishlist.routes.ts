import { Router } from 'express';
import { WishlistController } from '../../controllers/user/WishlistController';

const router = Router({ mergeParams: true });
const wishlistController = new WishlistController();

// Wishlist management
// POST /api/v1/users/:id/wishlist (add item to wishlist)
router.post('/', wishlistController.addToWishlist.bind(wishlistController));
// DELETE /api/v1/users/:id/wishlist/:productId (remove from wishlist)
router.delete('/:productId', wishlistController.removeFromWishlist.bind(wishlistController));

export default router;
