import { Router } from 'express';
import { ProductController } from './product.controller';
import { authMiddleware } from '../../shared/middlewares/authMiddleware';
import { adminMiddleware } from '../../shared/middlewares/adminMiddleware';
import { validateRequest } from '../../shared/middlewares/validateRequest';
import { productValidation } from '../../shared/validators/productValidation';

const router = Router();
const productController = new ProductController();

// Public routes (no authentication required)
router.get('/', productController.getProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/search', productController.searchProducts);
router.get('/category/:categoryId', productController.getProductsByCategory);
router.get('/sku/:sku', productController.getProductBySku);
router.get('/:id', productController.getProduct);

// Protected routes (authentication required)
router.post('/:id/reviews', authMiddleware, productController.addProductReview);

// Admin only routes
router.post('/', 
  authMiddleware, 
  adminMiddleware, 
  validateRequest(productValidation.createProduct),
  productController.createProduct
);

router.put('/:id', 
  authMiddleware, 
  adminMiddleware,
  validateRequest(productValidation.updateProduct),
  productController.updateProduct
);

router.patch('/:id/stock', 
  authMiddleware, 
  adminMiddleware,
  productController.updateProductStock
);

router.patch('/bulk-update', 
  authMiddleware, 
  adminMiddleware,
  productController.bulkUpdateProducts
);

router.delete('/:id', 
  authMiddleware, 
  adminMiddleware,
  productController.deleteProduct
);

// Analytics routes (Admin only)
router.get('/analytics/top-selling', 
  authMiddleware, 
  adminMiddleware,
  productController.getTopSellingProducts
);

router.get('/analytics/low-stock', 
  authMiddleware, 
  adminMiddleware,
  productController.getLowStockProducts
);

router.get('/:id/analytics', 
  authMiddleware, 
  adminMiddleware,
  productController.getProductAnalytics
);

export { router as productRoutes };