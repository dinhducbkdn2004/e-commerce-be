import { Router } from 'express';
import { WishlistController } from './wishlist.controller';
import { authMiddleware } from '../../shared/middlewares/authMiddleware';
import { validateRequest } from '../../shared/middlewares/validateRequest';
import { wishlistValidation } from '../../shared/validators/wishlistValidation';

const router = Router();
const wishlistController = new WishlistController();

// All wishlist routes require authentication
router.use(authMiddleware);

/**
 * @route GET /api/v1/wishlist
 * @desc Get user's wishlist (simple)
 * @access Private
 */
router.get('/', wishlistController.getWishlist.bind(wishlistController));

/**
 * @route GET /api/v1/wishlist/paginated
 * @desc Get user's wishlist with pagination
 * @access Private
 */
router.get('/paginated', wishlistController.getWishlistWithPagination.bind(wishlistController));

/**
 * @route GET /api/v1/wishlist/count
 * @desc Get wishlist count
 * @access Private
 */
router.get('/count', wishlistController.getWishlistCount.bind(wishlistController));

/**
 * @route GET /api/v1/wishlist/check/:productId
 * @desc Check if product is in wishlist
 * @access Private
 */
router.get('/check/:productId', wishlistController.isInWishlist.bind(wishlistController));

/**
 * @route POST /api/v1/wishlist
 * @desc Add product to wishlist
 * @access Private
 */
router.post(
  '/',
  validateRequest(wishlistValidation.addToWishlist),
  wishlistController.addToWishlist.bind(wishlistController)
);

/**
 * @route DELETE /api/v1/wishlist/:productId
 * @desc Remove product from wishlist
 * @access Private
 */
router.delete('/:productId', wishlistController.removeFromWishlist.bind(wishlistController));

/**
 * @route DELETE /api/v1/wishlist
 * @desc Clear entire wishlist
 * @access Private
 */
router.delete('/', wishlistController.clearWishlist.bind(wishlistController));

/**
 * @route POST /api/v1/wishlist/:productId/move-to-cart
 * @desc Move wishlist item to cart
 * @access Private
 */
router.post(
  '/:productId/move-to-cart',
  validateRequest(wishlistValidation.moveToCart),
  wishlistController.moveToCart.bind(wishlistController)
);

export default router;
