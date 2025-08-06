import { Request, Response, NextFunction } from 'express';
import { ProductService, CreateProductData, UpdateProductData } from './product.service';
import { AppError } from '../../shared/middlewares/errorHandler';
import { logger } from '../../shared/utils/logger';
import mongoose from 'mongoose';

export class ProductController {
  private productService = new ProductService();

  /**
   * @desc    Create new product
   * @route   POST /api/v1/products
   * @access  Private/Admin
   */
  createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productData: CreateProductData = {
        ...req.body,
        createdBy: req.user._id
      };

      const product = await this.productService.createProduct(productData);

      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        messageVi: 'Tạo sản phẩm thành công',
        data: product,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @desc    Get all products with filtering, sorting, and pagination
   * @route   GET /api/v1/products
   * @access  Public
   */
  getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        // Filters
        category,
        brand,
        minPrice,
        maxPrice,
        tags,
        rating,
        isActive,
        status,
        isFeatured,
        search,
        // Sorting
        sortBy = 'createdAt',
        sortOrder = 'desc',
        // Pagination
        page = 1,
        limit = 20
      } = req.query;

      // Build filters
      const filters: any = {};
      
      if (category) filters.category = new mongoose.Types.ObjectId(category as string);
      if (brand) filters.brand = brand as string;
      if (minPrice) filters.minPrice = Number(minPrice);
      if (maxPrice) filters.maxPrice = Number(maxPrice);
      if (tags) filters.tags = (tags as string).split(',');
      if (rating) filters.rating = Number(rating);
      if (isActive !== undefined) filters.isActive = isActive === 'true';
      if (status) filters.status = status as string;
      if (isFeatured !== undefined) filters.isFeatured = isFeatured === 'true';
      if (search) filters.search = search as string;

      // For public access, always filter active products
      if (!req.user || req.user.role !== 'admin') {
        filters.isActive = true;
        filters.status = 'active';
      }

      const result = await this.productService.getProducts(
        filters,
        { sortBy: sortBy as string, sortOrder: sortOrder as 'asc' | 'desc' },
        { page: Number(page), limit: Number(limit) }
      );

      res.json({
        success: true,
        message: 'Products retrieved successfully',
        messageVi: 'Lấy danh sách sản phẩm thành công',
        ...result.data,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @desc    Get single product by ID
   * @route   GET /api/v1/products/:id
   * @access  Public
   */
  getProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const product = await this.productService.getProductById(id);

      // Check if user can view inactive products
      if (!product.isActive && (!req.user || req.user.role !== 'admin')) {
        throw new AppError('Sản phẩm không tồn tại hoặc đã bị ẩn', 404);
      }

      res.json({
        success: true,
        message: 'Product retrieved successfully',
        messageVi: 'Lấy thông tin sản phẩm thành công',
        data: product,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @desc    Get product by SKU
   * @route   GET /api/v1/products/sku/:sku
   * @access  Public
   */
  getProductBySku = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { sku } = req.params;
      const product = await this.productService.getProductBySku(sku);

      // Check if user can view inactive products
      if (!product.isActive && (!req.user || req.user.role !== 'admin')) {
        throw new AppError('Sản phẩm không tồn tại hoặc đã bị ẩn', 404);
      }

      res.json({
        success: true,
        message: 'Product retrieved successfully',
        messageVi: 'Lấy thông tin sản phẩm thành công',
        data: product,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @desc    Get products by category
   * @route   GET /api/v1/products/category/:categoryId
   * @access  Public
   */
  getProductsByCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { categoryId } = req.params;
      const { page = 1, limit = 20 } = req.query;

      const result = await this.productService.getProductsByCategory(
        categoryId,
        { page: Number(page), limit: Number(limit) }
      );

      res.json({
        success: true,
        message: 'Products by category retrieved successfully',
        messageVi: 'Lấy sản phẩm theo danh mục thành công',
        ...result,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @desc    Get featured products
   * @route   GET /api/v1/products/featured
   * @access  Public
   */
  getFeaturedProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { limit = 10 } = req.query;

      const result = await this.productService.getFeaturedProducts(Number(limit));

      res.json({
        success: true,
        message: 'Featured products retrieved successfully',
        messageVi: 'Lấy sản phẩm nổi bật thành công',
        ...result,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @desc    Search products
   * @route   GET /api/v1/products/search
   * @access  Public
   */
  searchProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { q: query, page = 1, limit = 20 } = req.query;

      if (!query || typeof query !== 'string') {
        throw new AppError('Từ khóa tìm kiếm là bắt buộc', 400);
      }

      const result = await this.productService.searchProducts(
        query,
        { page: Number(page), limit: Number(limit) }
      );

      res.json({
        success: true,
        message: 'Search completed successfully',
        messageVi: 'Tìm kiếm hoàn thành',
        ...result,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @desc    Update product
   * @route   PUT /api/v1/products/:id
   * @access  Private/Admin
   */
  updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const updateData: UpdateProductData = {
        ...req.body,
        updatedBy: req.user._id
      };

      const product = await this.productService.updateProduct(id, updateData);

      res.json({
        success: true,
        message: 'Product updated successfully',
        messageVi: 'Cập nhật sản phẩm thành công',
        data: product,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @desc    Update product stock
   * @route   PATCH /api/v1/products/:id/stock
   * @access  Private/Admin
   */
  updateProductStock = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { quantity } = req.body;

      if (typeof quantity !== 'number') {
        throw new AppError('Số lượng phải là số', 400);
      }

      const product = await this.productService.updateProductStock(id, quantity);

      res.json({
        success: true,
        message: 'Product stock updated successfully',
        messageVi: 'Cập nhật tồn kho thành công',
        data: product,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @desc    Add product review
   * @route   POST /api/v1/products/:id/reviews
   * @access  Private
   */
  addProductReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { rating, comment } = req.body;

      if (!rating || !comment) {
        throw new AppError('Đánh giá và bình luận là bắt buộc', 400);
      }

      const product = await this.productService.addProductReview(
        id,
        req.user._id.toString(),
        Number(rating),
        comment,
        false // TODO: Check if user actually purchased this product
      );

      res.status(201).json({
        success: true,
        message: 'Review added successfully',
        messageVi: 'Thêm đánh giá thành công',
        data: product,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @desc    Delete product
   * @route   DELETE /api/v1/products/:id
   * @access  Private/Admin
   */
  deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      await this.productService.deleteProduct(id);

      res.json({
        success: true,
        message: 'Product deleted successfully',
        messageVi: 'Xóa sản phẩm thành công',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @desc    Get top selling products
   * @route   GET /api/v1/products/analytics/top-selling
   * @access  Private/Admin
   */
  getTopSellingProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { limit = 10 } = req.query;

      const result = await this.productService.getTopSellingProducts(Number(limit));

      res.json({
        success: true,
        message: 'Top selling products retrieved successfully',
        messageVi: 'Lấy sản phẩm bán chạy thành công',
        ...result,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @desc    Get low stock products
   * @route   GET /api/v1/products/analytics/low-stock
   * @access  Private/Admin
   */
  getLowStockProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { threshold } = req.query;

      const result = await this.productService.getLowStockProducts(
        threshold ? Number(threshold) : undefined
      );

      res.json({
        success: true,
        message: 'Low stock products retrieved successfully',
        messageVi: 'Lấy sản phẩm sắp hết hàng thành công',
        ...result,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @desc    Get product analytics
   * @route   GET /api/v1/products/:id/analytics
   * @access  Private/Admin
   */
  getProductAnalytics = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const result = await this.productService.getProductAnalytics(id);

      res.json({
        success: true,
        message: 'Product analytics retrieved successfully',
        messageVi: 'Lấy thống kê sản phẩm thành công',
        ...result,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @desc    Bulk update products
   * @route   PATCH /api/v1/products/bulk-update
   * @access  Private/Admin
   */
  bulkUpdateProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { updates } = req.body;

      if (!Array.isArray(updates) || updates.length === 0) {
        throw new AppError('Danh sách cập nhật không hợp lệ', 400);
      }

      // Add updatedBy to each update
      const processedUpdates = updates.map(update => ({
        ...update,
        data: {
          ...update.data,
          updatedBy: req.user._id
        }
      }));

      await this.productService.bulkUpdateProducts(processedUpdates);

      res.json({
        success: true,
        message: 'Bulk update completed successfully',
        messageVi: 'Cập nhật hàng loạt thành công',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  };
}