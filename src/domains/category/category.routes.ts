import { Router } from 'express';
import { CategoryController } from './category.controller';
import { authMiddleware, optionalAuthMiddleware } from '../../shared/middlewares/authMiddleware';
import { adminMiddleware } from '../../shared/middlewares/adminMiddleware';
import { validateRequest } from '../../shared/middlewares/validateRequest';
import { categoryValidation } from '../../shared/validators/categoryValidation';

const router = Router();
const categoryController = new CategoryController();

// Public routes (no authentication required)
router.get('/', optionalAuthMiddleware, categoryController.getCategories);
router.get('/root', categoryController.getRootCategories);
router.get('/tree', categoryController.getCategoryTree);
router.get('/search', categoryController.searchCategories);
router.get('/slug/:slug', categoryController.getCategoryBySlug);
router.get('/:id', optionalAuthMiddleware, categoryController.getCategory);
router.get('/:id/children', categoryController.getCategoryChildren);
router.get('/:id/path', categoryController.getCategoryPath);

// Admin only routes
router.post('/', 
  authMiddleware, 
  adminMiddleware, 
  validateRequest(categoryValidation.createCategory),
  categoryController.createCategory
);

router.post('/bulk-create', 
  authMiddleware, 
  adminMiddleware,
  categoryController.bulkCreateCategories
);

router.put('/:id', 
  authMiddleware, 
  adminMiddleware,
  validateRequest(categoryValidation.updateCategory),
  categoryController.updateCategory
);

router.patch('/reorder', 
  authMiddleware, 
  adminMiddleware,
  categoryController.reorderCategories
);

router.delete('/:id', 
  authMiddleware, 
  adminMiddleware,
  categoryController.deleteCategory
);

// Analytics routes (Admin only)
router.get('/with-product-count', 
  authMiddleware, 
  adminMiddleware,
  categoryController.getCategoriesWithProductCount
);

router.get('/validate-hierarchy', 
  authMiddleware, 
  adminMiddleware,
  categoryController.validateCategoryHierarchy
);

router.get('/:id/analytics', 
  authMiddleware, 
  adminMiddleware,
  categoryController.getCategoryAnalytics
);

export { router as categoryRoutes };