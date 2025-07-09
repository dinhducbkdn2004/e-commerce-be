import { Router } from 'express';
import { CartController } from '../../controllers/user/CartController';
import { validate } from '../../middlewares/validate';
import { cartItemSchema, updateCartSchema } from '../../validators/user.validator';

const router = Router({ mergeParams: true });
const cartController = new CartController();

// Cart management
// POST /api/v1/users/:id/cart (add item to cart)
router.post('/', validate(cartItemSchema), cartController.addToCart.bind(cartController));
// PUT /api/v1/users/:id/cart/:productId (update cart item)
router.put('/:productId', validate(updateCartSchema), cartController.updateCartItem.bind(cartController));
// DELETE /api/v1/users/:id/cart/:productId (remove item from cart)
router.delete('/:productId', cartController.removeFromCart.bind(cartController));
// DELETE /api/v1/users/:id/cart (clear cart)
router.delete('/', cartController.clearCart.bind(cartController));

export default router;
