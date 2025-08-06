import mongoose from 'mongoose';
import { ProductRepository, ProductFilters, ProductSortOptions, PaginationOptions } from './product.repository';
import { IProduct } from '../../models/Product';
import { AppError } from '../../shared/middlewares/errorHandler';
import { logger } from '../../shared/utils/logger';

export interface CreateProductData {
  name: string;
  description: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  category: mongoose.Types.ObjectId;
  subcategory?: mongoose.Types.ObjectId;
  brand?: string;
  sku?: string;
  images: string[];
  thumbnail?: string;
  variants?: Array<{
    size?: string;
    color?: string;
    stock: number;
    price?: number;
    sku?: string;
    images?: string[];
  }>;
  tags?: string[];
  specifications?: { [key: string]: string };
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  stock: number;
  minStock?: number;
  isActive?: boolean;
  isFeatured?: boolean;
  isDigital?: boolean;
  status?: 'draft' | 'active' | 'inactive' | 'out_of_stock';
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  createdBy: mongoose.Types.ObjectId;
}

export interface UpdateProductData extends Partial<CreateProductData> {
  updatedBy: mongoose.Types.ObjectId;
}

export class ProductService {
  private productRepo = new ProductRepository();

  async createProduct(productData: CreateProductData): Promise<IProduct> {
    try {
      // Validate required fields
      if (!productData.name || !productData.description || !productData.price || !productData.category) {
        throw new AppError('Thiếu thông tin bắt buộc cho sản phẩm', 400);
      }

      // Validate price
      if (productData.price <= 0) {
        throw new AppError('Giá sản phẩm phải lớn hơn 0', 400);
      }

      // Validate images
      if (!productData.images || productData.images.length === 0) {
        throw new AppError('Sản phẩm phải có ít nhất một hình ảnh', 400);
      }

      // Check if SKU already exists (if provided)
      if (productData.sku) {
        const existingProduct = await this.productRepo.findBySku(productData.sku);
        if (existingProduct) {
          throw new AppError('SKU đã tồn tại', 409);
        }
      }

      // Set default values
      const processedData = {
        ...productData,
        thumbnail: productData.thumbnail || productData.images[0],
        isActive: productData.isActive !== undefined ? productData.isActive : true,
        status: productData.status || 'draft',
        stock: productData.stock || 0,
        minStock: productData.minStock || 10,
        updatedBy: productData.createdBy
      };

      const product = await this.productRepo.create(processedData);
      
      logger.info('Product created successfully', {
        productId: product._id,
        name: product.name,
        createdBy: productData.createdBy
      });

      return product;
    } catch (error) {
      logger.error('Error creating product', { error: error instanceof Error ? error.message : String(error), productData });
      throw error;
    }
  }

  async getProductById(productId: string): Promise<IProduct> {
    try {
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new AppError('ID sản phẩm không hợp lệ', 400);
      }

      const product = await this.productRepo.findById(new mongoose.Types.ObjectId(productId));
      
      if (!product) {
        throw new AppError('Không tìm thấy sản phẩm', 404);
      }

      // Increment view count (don't wait for it)
      this.productRepo.incrementViews(product._id).catch(err => 
        logger.warn('Failed to increment view count', { productId, error: err.message })
      );

      return product;
    } catch (error) {
      logger.error('Error getting product by ID', { error: error instanceof Error ? error.message : String(error), productId });
      throw error;
    }
  }

  async getProductBySku(sku: string): Promise<IProduct> {
    try {
      if (!sku || sku.trim().length === 0) {
        throw new AppError('SKU không hợp lệ', 400);
      }

      const product = await this.productRepo.findBySku(sku.trim());
      
      if (!product) {
        throw new AppError('Không tìm thấy sản phẩm với SKU này', 404);
      }

      return product;
    } catch (error) {
      logger.error('Error getting product by SKU', { error: error instanceof Error ? error.message : String(error), sku });
      throw error;
    }
  }

  async getProducts(
    filters: ProductFilters = {},
    sortOptions: ProductSortOptions = {},
    paginationOptions: PaginationOptions = {}
  ) {
    try {
      const result = await this.productRepo.findAll(filters, sortOptions, paginationOptions);
      
      logger.info('Products retrieved', {
        total: result.total,
        page: result.page,
        filtersCount: Object.keys(filters).length
      });

      return {
        success: true,
        data: result,
        message: 'Lấy danh sách sản phẩm thành công',
        messageVi: 'Lấy danh sách sản phẩm thành công'
      };
    } catch (error) {
      logger.error('Error getting products', { error: error instanceof Error ? error.message : String(error), filters });
      throw error;
    }
  }

  async getProductsByCategory(categoryId: string, options: PaginationOptions = {}) {
    try {
      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        throw new AppError('ID danh mục không hợp lệ', 400);
      }

      const products = await this.productRepo.findByCategory(
        new mongoose.Types.ObjectId(categoryId),
        options
      );

      return {
        success: true,
        data: products,
        message: 'Lấy sản phẩm theo danh mục thành công',
        messageVi: 'Lấy sản phẩm theo danh mục thành công'
      };
    } catch (error) {
      logger.error('Error getting products by category', { error: error instanceof Error ? error.message : String(error), categoryId });
      throw error;
    }
  }

  async getFeaturedProducts(limit: number = 10) {
    try {
      const products = await this.productRepo.findFeatured(limit);

      return {
        success: true,
        data: products,
        message: 'Lấy sản phẩm nổi bật thành công',
        messageVi: 'Lấy sản phẩm nổi bật thành công'
      };
    } catch (error) {
      logger.error('Error getting featured products', { error: error instanceof Error ? error.message : String(error) });
      throw error;
    }
  }

  async searchProducts(query: string, options: PaginationOptions = {}) {
    try {
      if (!query || query.trim().length === 0) {
        throw new AppError('Từ khóa tìm kiếm không được để trống', 400);
      }

      const products = await this.productRepo.searchProducts(query.trim(), options);

      return {
        success: true,
        data: products,
        message: 'Tìm kiếm sản phẩm thành công',
        messageVi: 'Tìm kiếm sản phẩm thành công'
      };
    } catch (error) {
      logger.error('Error searching products', { error: error instanceof Error ? error.message : String(error), query });
      throw error;
    }
  }

  async updateProduct(productId: string, updateData: UpdateProductData): Promise<IProduct> {
    try {
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new AppError('ID sản phẩm không hợp lệ', 400);
      }

      // Validate price if provided
      if (updateData.price !== undefined && updateData.price <= 0) {
        throw new AppError('Giá sản phẩm phải lớn hơn 0', 400);
      }

      // Check SKU uniqueness if updating SKU
      if (updateData.sku) {
        const existingProduct = await this.productRepo.findBySku(updateData.sku);
        if (existingProduct && existingProduct._id.toString() !== productId) {
          throw new AppError('SKU đã tồn tại', 409);
        }
      }

      const product = await this.productRepo.update(
        new mongoose.Types.ObjectId(productId),
        updateData
      );

      if (!product) {
        throw new AppError('Không tìm thấy sản phẩm', 404);
      }

      logger.info('Product updated successfully', {
        productId,
        updatedBy: updateData.updatedBy
      });

      return product;
    } catch (error) {
      logger.error('Error updating product', { error: error instanceof Error ? error.message : String(error), productId });
      throw error;
    }
  }

  async updateProductStock(productId: string, quantity: number): Promise<IProduct> {
    try {
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new AppError('ID sản phẩm không hợp lệ', 400);
      }

      const product = await this.productRepo.updateStock(
        new mongoose.Types.ObjectId(productId),
        quantity
      );

      if (!product) {
        throw new AppError('Không tìm thấy sản phẩm', 404);
      }

      return product;
    } catch (error) {
      logger.error('Error updating product stock', { error: error instanceof Error ? error.message : String(error), productId, quantity });
      throw error;
    }
  }

  async addProductReview(
    productId: string,
    userId: string,
    rating: number,
    comment: string,
    isVerified: boolean = false
  ): Promise<IProduct> {
    try {
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new AppError('ID sản phẩm không hợp lệ', 400);
      }

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new AppError('ID người dùng không hợp lệ', 400);
      }

      if (rating < 1 || rating > 5) {
        throw new AppError('Đánh giá phải từ 1 đến 5 sao', 400);
      }

      if (!comment || comment.trim().length === 0) {
        throw new AppError('Bình luận không được để trống', 400);
      }

      const product = await this.productRepo.addReview(
        new mongoose.Types.ObjectId(productId),
        {
          user: new mongoose.Types.ObjectId(userId),
          rating,
          comment: comment.trim(),
          isVerified
        }
      );

      if (!product) {
        throw new AppError('Không tìm thấy sản phẩm', 404);
      }

      return product;
    } catch (error) {
      logger.error('Error adding product review', { error: error instanceof Error ? error.message : String(error), productId, userId });
      throw error;
    }
  }

  async deleteProduct(productId: string): Promise<void> {
    try {
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new AppError('ID sản phẩm không hợp lệ', 400);
      }

      const deleted = await this.productRepo.delete(new mongoose.Types.ObjectId(productId));

      if (!deleted) {
        throw new AppError('Không tìm thấy sản phẩm', 404);
      }

      logger.info('Product deleted successfully', { productId });
    } catch (error) {
      logger.error('Error deleting product', { error: error instanceof Error ? error.message : String(error), productId });
      throw error;
    }
  }

  async getTopSellingProducts(limit: number = 10) {
    try {
      const products = await this.productRepo.getTopSellingProducts(limit);

      return {
        success: true,
        data: products,
        message: 'Lấy sản phẩm bán chạy thành công',
        messageVi: 'Lấy sản phẩm bán chạy thành công'
      };
    } catch (error) {
      logger.error('Error getting top selling products', { error: error instanceof Error ? error.message : String(error) });
      throw error;
    }
  }

  async getLowStockProducts(threshold?: number) {
    try {
      const products = await this.productRepo.getLowStockProducts(threshold);

      return {
        success: true,
        data: products,
        message: 'Lấy sản phẩm sắp hết hàng thành công',
        messageVi: 'Lấy sản phẩm sắp hết hàng thành công'
      };
    } catch (error) {
      logger.error('Error getting low stock products', { error: error instanceof Error ? error.message : String(error) });
      throw error;
    }
  }

  async bulkUpdateProducts(updates: Array<{ id: string; data: Partial<UpdateProductData> }>): Promise<void> {
    try {
      const updatePromises = updates.map(update => {
        if (!mongoose.Types.ObjectId.isValid(update.id)) {
          throw new AppError(`ID sản phẩm không hợp lệ: ${update.id}`, 400);
        }
        
        return this.productRepo.update(
          new mongoose.Types.ObjectId(update.id),
          update.data
        );
      });

      await Promise.all(updatePromises);
      
      logger.info('Bulk product update completed', { count: updates.length });
    } catch (error) {
      logger.error('Error in bulk product update', { error: error instanceof Error ? error.message : String(error), updatesCount: updates.length });
      throw error;
    }
  }

  async getProductAnalytics(productId: string) {
    try {
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new AppError('ID sản phẩm không hợp lệ', 400);
      }

      const product = await this.productRepo.findById(new mongoose.Types.ObjectId(productId));
      
      if (!product) {
        throw new AppError('Không tìm thấy sản phẩm', 404);
      }

      return {
        success: true,
        data: {
          id: product._id,
          name: product.name,
          views: product.views,
          sales: product.sales,
          stock: product.stock,
          revenue: product.sales * product.price,
          rating: {
            average: product.ratings.average,
            count: product.ratings.count
          },
          reviewCount: product.reviews.length,
          isLowStock: product.stock <= product.minStock
        },
        message: 'Lấy thống kê sản phẩm thành công',
        messageVi: 'Lấy thống kê sản phẩm thành công'
      };
    } catch (error) {
      logger.error('Error getting product analytics', { error: error instanceof Error ? error.message : String(error), productId });
      throw error;
    }
  }
}