import { Request, Response, NextFunction } from 'express';
import { CategoryService, CreateCategoryData, UpdateCategoryData } from './category.service';
import { AppError } from '../../shared/middlewares/errorHandler';
import { logger } from '../../shared/utils/logger';

export class CategoryController {
  private categoryService = new CategoryService();

  /**
   * @desc    Create new category
   * @route   POST /api/v1/categories
   * @access  Private/Admin
   */
  createCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categoryData: CreateCategoryData = {
        ...req.body,
        createdBy: req.user._id
      };

      const category = await this.categoryService.createCategory(categoryData);

      res.status(201).json({
        success: true,
        message: 'Category created successfully',
        messageVi: 'Tạo danh mục thành công',
        data: category,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @desc    Get all categories
   * @route   GET /api/v1/categories
   * @access  Public
   */
  getCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { isActive } = req.query;
      
      // For public access, only show active categories
      const activeFilter = req.user && req.user.role === 'admin' 
        ? (isActive === 'true' ? true : isActive === 'false' ? false : undefined)
        : true;

      const result = await this.categoryService.getAllCategories(activeFilter);

      res.json({
        success: true,
        message: 'Categories retrieved successfully',
        messageVi: 'Lấy danh sách danh mục thành công',
        data: result.data,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @desc    Get root categories (top-level categories)
   * @route   GET /api/v1/categories/root
   * @access  Public
   */
  getRootCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { isActive = 'true' } = req.query;
      
      const result = await this.categoryService.getRootCategories(isActive === 'true');

      res.json({
        success: true,
        message: 'Root categories retrieved successfully',
        messageVi: 'Lấy danh mục gốc thành công',
        data: result.data,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @desc    Get category tree (hierarchical structure)
   * @route   GET /api/v1/categories/tree
   * @access  Public
   */
  getCategoryTree = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { isActive = 'true' } = req.query;
      
      const result = await this.categoryService.getCategoryTree(isActive === 'true');

      res.json({
        success: true,
        message: 'Category tree retrieved successfully',
        messageVi: 'Lấy cây danh mục thành công',
        data: result.data,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @desc    Get single category by ID
   * @route   GET /api/v1/categories/:id
   * @access  Public
   */
  getCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const category = await this.categoryService.getCategoryById(id);

      // Check if user can view inactive categories
      if (!category.isActive && (!req.user || req.user.role !== 'admin')) {
        throw new AppError('Danh mục không tồn tại hoặc đã bị ẩn', 404);
      }

      res.json({
        success: true,
        message: 'Category retrieved successfully',
        messageVi: 'Lấy thông tin danh mục thành công',
        data: category,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @desc    Get category by slug
   * @route   GET /api/v1/categories/slug/:slug
   * @access  Public
   */
  getCategoryBySlug = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { slug } = req.params;
      const category = await this.categoryService.getCategoryBySlug(slug);

      res.json({
        success: true,
        message: 'Category retrieved successfully',
        messageVi: 'Lấy thông tin danh mục thành công',
        data: category,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @desc    Get category children
   * @route   GET /api/v1/categories/:id/children
   * @access  Public
   */
  getCategoryChildren = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { isActive = 'true' } = req.query;

      const result = await this.categoryService.getCategoryChildren(id, isActive === 'true');

      res.json({
        success: true,
        message: 'Category children retrieved successfully',
        messageVi: 'Lấy danh mục con thành công',
        data: result.data,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @desc    Get category path (breadcrumb)
   * @route   GET /api/v1/categories/:id/path
   * @access  Public
   */
  getCategoryPath = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const result = await this.categoryService.getCategoryPath(id);

      res.json({
        success: true,
        message: 'Category path retrieved successfully',
        messageVi: 'Lấy đường dẫn danh mục thành công',
        data: result.data,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @desc    Search categories
   * @route   GET /api/v1/categories/search
   * @access  Public
   */
  searchCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { q: query, isActive = 'true' } = req.query;

      if (!query || typeof query !== 'string') {
        throw new AppError('Từ khóa tìm kiếm là bắt buộc', 400);
      }

      const result = await this.categoryService.searchCategories(query, isActive === 'true');

      res.json({
        success: true,
        message: 'Category search completed successfully',
        messageVi: 'Tìm kiếm danh mục hoàn thành',
        data: result.data,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @desc    Update category
   * @route   PUT /api/v1/categories/:id
   * @access  Private/Admin
   */
  updateCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const updateData: UpdateCategoryData = {
        ...req.body,
        updatedBy: req.user._id
      };

      const category = await this.categoryService.updateCategory(id, updateData);

      res.json({
        success: true,
        message: 'Category updated successfully',
        messageVi: 'Cập nhật danh mục thành công',
        data: category,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @desc    Delete category
   * @route   DELETE /api/v1/categories/:id
   * @access  Private/Admin
   */
  deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      await this.categoryService.deleteCategory(id);

      res.json({
        success: true,
        message: 'Category deleted successfully',
        messageVi: 'Xóa danh mục thành công',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @desc    Reorder categories
   * @route   PATCH /api/v1/categories/reorder
   * @access  Private/Admin
   */
  reorderCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { updates } = req.body;

      if (!Array.isArray(updates) || updates.length === 0) {
        throw new AppError('Danh sách cập nhật không hợp lệ', 400);
      }

      await this.categoryService.reorderCategories(updates);

      res.json({
        success: true,
        message: 'Categories reordered successfully',
        messageVi: 'Sắp xếp danh mục thành công',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @desc    Get categories with product count
   * @route   GET /api/v1/categories/with-product-count
   * @access  Private/Admin
   */
  getCategoriesWithProductCount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.categoryService.getCategoriesWithProductCount();

      res.json({
        success: true,
        message: 'Categories with product count retrieved successfully',
        messageVi: 'Lấy danh mục với số lượng sản phẩm thành công',
        data: result.data,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @desc    Get category analytics
   * @route   GET /api/v1/categories/:id/analytics
   * @access  Private/Admin
   */
  getCategoryAnalytics = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const result = await this.categoryService.getCategoryAnalytics(id);

      res.json({
        success: true,
        message: 'Category analytics retrieved successfully',
        messageVi: 'Lấy thống kê danh mục thành công',
        data: result.data,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @desc    Bulk create categories
   * @route   POST /api/v1/categories/bulk-create
   * @access  Private/Admin
   */
  bulkCreateCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { categories } = req.body;

      if (!Array.isArray(categories) || categories.length === 0) {
        throw new AppError('Danh sách danh mục không hợp lệ', 400);
      }

      // Add createdBy to each category
      const processedCategories = categories.map(category => ({
        ...category,
        createdBy: req.user._id
      }));

      const createdCategories = await this.categoryService.bulkCreateCategories(processedCategories);

      res.status(201).json({
        success: true,
        message: 'Categories created successfully',
        messageVi: 'Tạo danh mục hàng loạt thành công',
        data: createdCategories,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @desc    Validate category hierarchy
   * @route   GET /api/v1/categories/validate-hierarchy
   * @access  Private/Admin
   */
  validateCategoryHierarchy = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.categoryService.validateCategoryHierarchy();

      res.json({
        success: true,
        message: 'Category hierarchy validation completed',
        messageVi: 'Kiểm tra cấu trúc danh mục hoàn thành',
        data: result,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  };
}