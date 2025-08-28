import { Router } from 'express';
import authRoutes from '../domains/auth/auth.routes';
import userRoutes from '../domains/user/user.routes';
import { productRoutes } from '../domains/product/product.routes';
import { categoryRoutes } from '../domains/category/category.routes';
import cartRoutes from '../domains/cart/cart.routes';
import orderRoutes from '../domains/order/order.routes';
import addressRoutes from '../domains/address/address.routes';
import wishlistRoutes from '../domains/wishlist/wishlist.routes';
import loyaltyRoutes from '../domains/loyalty/loyalty.routes';

const router = Router();

// API v1 routes with domain-based structure
router.use('/api/v1/auth', authRoutes);
router.use('/api/v1/users', userRoutes);
router.use('/api/v1/products', productRoutes);
router.use('/api/v1/categories', categoryRoutes);
router.use('/api/v1/cart', cartRoutes);
router.use('/api/v1/orders', orderRoutes);
router.use('/api/v1/address', addressRoutes);
router.use('/api/v1/wishlist', wishlistRoutes);
router.use('/api/v1/loyalty', loyaltyRoutes);

// Default
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the E-Commerce API',
    messageVi: 'Chào mừng đến với API Thương mại điện tử',
    data: {
      version: '1.0.0',
      description: 'This is a RESTful API for managing an e-commerce platform.',
      documentation: '/docs'
    },
    timestamp: new Date().toISOString()
  });
});


// Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running smoothly',
    messageVi: 'API đang hoạt động tốt',
    data: {
      status: 'healthy',
      uptime: process.uptime(),
      version: '1.0.0'
    },
    timestamp: new Date().toISOString()
  });
});

export default router;
