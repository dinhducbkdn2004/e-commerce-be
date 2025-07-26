import { Router } from 'express';
import authRoutes from '../domains/auth/auth.routes';
import userRoutes from '../domains/user/user.routes';
// import cartRoutes from '../domains/cart/cart.routes';
// import orderRoutes from '../domains/order/order.routes';
// import addressRoutes from '../domains/address/address.routes';

const router = Router();

// API v1 routes with domain-based structure
router.use('/api/v1/auth', authRoutes);
router.use('/api/v1/users', userRoutes);
// router.use('/api/v1/cart', cartRoutes);
// router.use('/api/v1/orders', orderRoutes);
// router.use('/api/v1/address', addressRoutes);

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

export default router;
