import { Router } from 'express';
import { CartController } from './cart.controller';
import { authMiddleware } from '../../shared/middlewares/authMiddleware';
import { validateRequest } from '../../shared/middlewares/validateRequest';
import { cartValidation } from '../../shared/validators/cartValidation';

const router = Router();
const cartController = new CartController();

// All cart routes require authentication
router.use(authMiddleware);

/**
 * @route GET /api/v1/cart
 * @desc Get user's cart
 * @access Private
 */
router.get('/', cartController.getCart.bind(cartController));

/**
 * @route GET /api/v1/cart/count
 * @desc Get cart item count
 * @access Private
 */
router.get('/count', cartController.getCartItemCount.bind(cartController));

/**
 * @route POST /api/v1/cart
 * @desc Add item to cart
 * @access Private
 */
router.post(
  '/',
  validateRequest(cartValidation.addToCart),
  cartController.addToCart.bind(cartController)
);

/**
 * @route PUT /api/v1/cart/:itemId
 * @desc Update cart item
 * @access Private
 */
router.put(
  '/:itemId',
  validateRequest(cartValidation.updateCartItem),
  cartController.updateCartItem.bind(cartController)
);

/**
 * @route DELETE /api/v1/cart/:itemId
 * @desc Remove item from cart
 * @access Private
 */
router.delete('/:itemId', cartController.removeFromCart.bind(cartController));

/**
 * @route DELETE /api/v1/cart
 * @desc Clear entire cart
 * @access Private
 */
router.delete('/', cartController.clearCart.bind(cartController));

export default router;
