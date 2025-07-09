import { Router } from 'express';
import baseRoutes from './user/base.routes';
import addressRoutes from './user/address.routes';
import cartRoutes from './user/cart.routes';
import wishlistRoutes from './user/wishlist.routes';
import authenticationRoutes from './user/authentication.routes';
import loyaltyRoutes from './user/loyalty.routes';
import orderRoutes from './user/order.routes';

const router = Router();

// Mount the base user routes at the root level
router.use('/', baseRoutes);

// Mount domain-specific routes with their respective prefixes
router.use('/:id/addresses', addressRoutes);
router.use('/:id/cart', cartRoutes);
router.use('/:id/wishlist', wishlistRoutes);
// We still keep user-specific auth routes (like verifying specific user)
router.use('/:id/auth', authenticationRoutes);
router.use('/:id/loyalty', loyaltyRoutes);
router.use('/:id/orders', orderRoutes);

export default router;