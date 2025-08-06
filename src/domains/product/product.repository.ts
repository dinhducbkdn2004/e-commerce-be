import { Product, IProduct } from '../../models/Product';
import { Category } from '../../models/Category';
import mongoose from 'mongoose';
import { logger } from '../../shared/utils/logger';

export interface ProductFilters {
  category?: mongoose.Types.ObjectId;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
  rating?: number;
  isActive?: boolean;
  status?: string;
  isFeatured?: boolean;
  search?: string;
}

export interface ProductSortOptions {
  sortBy?: 'name' | 'price' | 'rating' | 'sales' | 'createdAt' | 'views';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export class ProductRepository {
  async create(productData: Partial<IProduct>): Promise<IProduct> {
    try {
      const product = new Product(productData);
      await product.save();
      
      // Update category product count
      if (product.category) {
        await Category.findByIdAndUpdate(
          product.category,
          { $inc: { productCount: 1 } }
        );
      }

      logger.info('Product created successfully', { productId: product._id, name: product.name });
      return product;
    } catch (error) {
      logger.error('Error creating product', { error: error.message, productData });
      throw error;
    }
  }

  async findById(id: mongoose.Types.ObjectId): Promise<IProduct | null> {
    try {
      return await Product.findById(id)
        .populate('category', 'name slug')
        .populate('subcategory', 'name slug')
        .populate('createdBy', 'name email')
        .populate('updatedBy', 'name email');
    } catch (error) {
      logger.error('Error finding product by ID', { error: error.message, productId: id });
      throw error;
    }
  }

  async findBySku(sku: string): Promise<IProduct | null> {
    try {
      return await Product.findOne({ sku: sku.toUpperCase() })
        .populate('category', 'name slug')
        .populate('subcategory', 'name slug');
    } catch (error) {
      logger.error('Error finding product by SKU', { error: error.message, sku });
      throw error;
    }
  }

  async findAll(
    filters: ProductFilters = {},
    sortOptions: ProductSortOptions = {},
    paginationOptions: PaginationOptions = {}
  ): Promise<{ products: IProduct[]; total: number; page: number; pages: number }> {
    try {
      // Build query
      const query: any = {};

      if (filters.category) {
        query.category = filters.category;
      }

      if (filters.brand) {
        query.brand = new RegExp(filters.brand, 'i');
      }

      if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        query.price = {};
        if (filters.minPrice !== undefined) query.price.$gte = filters.minPrice;
        if (filters.maxPrice !== undefined) query.price.$lte = filters.maxPrice;
      }

      if (filters.tags && filters.tags.length > 0) {
        query.tags = { $in: filters.tags };
      }

      if (filters.rating) {
        query['ratings.average'] = { $gte: filters.rating };
      }

      if (filters.isActive !== undefined) {
        query.isActive = filters.isActive;
      }

      if (filters.status) {
        query.status = filters.status;
      }

      if (filters.isFeatured !== undefined) {
        query.isFeatured = filters.isFeatured;
      }

      if (filters.search) {
        query.$text = { $search: filters.search };
      }

      // Build sort
      const sort: any = {};
      const { sortBy = 'createdAt', sortOrder = 'desc' } = sortOptions;
      
      if (filters.search && sortBy === 'relevance') {
        sort.score = { $meta: 'textScore' };
      } else {
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
      }

      // Pagination
      const { page = 1, limit = 20 } = paginationOptions;
      const skip = (page - 1) * limit;

      // Execute query
      const [products, total] = await Promise.all([
        Product.find(query)
          .populate('category', 'name slug')
          .populate('subcategory', 'name slug')
          .sort(sort)
          .skip(skip)
          .limit(limit),
        Product.countDocuments(query)
      ]);

      const pages = Math.ceil(total / limit);

      logger.info('Products retrieved successfully', {
        total,
        page,
        pages,
        filtersApplied: Object.keys(filters).length
      });

      return { products, total, page, pages };
    } catch (error) {
      logger.error('Error finding products', { error: error.message, filters });
      throw error;
    }
  }

  async findByCategory(categoryId: mongoose.Types.ObjectId, options: PaginationOptions = {}): Promise<IProduct[]> {
    try {
      const { page = 1, limit = 20 } = options;
      const skip = (page - 1) * limit;

      return await Product.find({
        category: categoryId,
        isActive: true,
        status: 'active'
      })
        .populate('category', 'name slug')
        .sort({ isFeatured: -1, sales: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit);
    } catch (error) {
      logger.error('Error finding products by category', { error: error.message, categoryId });
      throw error;
    }
  }

  async findFeatured(limit: number = 10): Promise<IProduct[]> {
    try {
      return await Product.find({
        isFeatured: true,
        isActive: true,
        status: 'active'
      })
        .populate('category', 'name slug')
        .sort({ sales: -1, 'ratings.average': -1 })
        .limit(limit);
    } catch (error) {
      logger.error('Error finding featured products', { error: error.message });
      throw error;
    }
  }

  async searchProducts(query: string, options: PaginationOptions = {}): Promise<IProduct[]> {
    try {
      const { page = 1, limit = 20 } = options;
      const skip = (page - 1) * limit;

      return await Product.find(
        {
          $text: { $search: query },
          isActive: true,
          status: 'active'
        },
        { score: { $meta: 'textScore' } }
      )
        .populate('category', 'name slug')
        .sort({ score: { $meta: 'textScore' } })
        .skip(skip)
        .limit(limit);
    } catch (error) {
      logger.error('Error searching products', { error: error.message, query });
      throw error;
    }
  }

  async update(id: mongoose.Types.ObjectId, updateData: Partial<IProduct>): Promise<IProduct | null> {
    try {
      const product = await Product.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true }
      )
        .populate('category', 'name slug')
        .populate('subcategory', 'name slug');

      if (product) {
        logger.info('Product updated successfully', { productId: id, name: product.name });
      }

      return product;
    } catch (error) {
      logger.error('Error updating product', { error: error.message, productId: id });
      throw error;
    }
  }

  async updateStock(id: mongoose.Types.ObjectId, quantity: number): Promise<IProduct | null> {
    try {
      const product = await Product.findByIdAndUpdate(
        id,
        { 
          $inc: { stock: quantity },
          updatedAt: new Date()
        },
        { new: true, runValidators: true }
      );

      if (product) {
        logger.info('Product stock updated', { productId: id, newStock: product.stock, change: quantity });
      }

      return product;
    } catch (error) {
      logger.error('Error updating product stock', { error: error.message, productId: id });
      throw error;
    }
  }

  async incrementViews(id: mongoose.Types.ObjectId): Promise<void> {
    try {
      await Product.findByIdAndUpdate(id, { $inc: { views: 1 } });
    } catch (error) {
      logger.error('Error incrementing product views', { error: error.message, productId: id });
      // Don't throw error for view tracking
    }
  }

  async incrementSales(id: mongoose.Types.ObjectId, quantity: number = 1): Promise<void> {
    try {
      await Product.findByIdAndUpdate(id, { $inc: { sales: quantity } });
      logger.info('Product sales incremented', { productId: id, quantity });
    } catch (error) {
      logger.error('Error incrementing product sales', { error: error.message, productId: id });
      throw error;
    }
  }

  async addReview(
    productId: mongoose.Types.ObjectId,
    review: {
      user: mongoose.Types.ObjectId;
      rating: number;
      comment: string;
      isVerified?: boolean;
    }
  ): Promise<IProduct | null> {
    try {
      const product = await Product.findByIdAndUpdate(
        productId,
        {
          $push: { reviews: review },
          updatedAt: new Date()
        },
        { new: true }
      );

      if (product) {
        // Recalculate ratings
        await this.recalculateRatings(productId);
        logger.info('Review added to product', { productId, userId: review.user, rating: review.rating });
      }

      return product;
    } catch (error) {
      logger.error('Error adding review to product', { error: error.message, productId });
      throw error;
    }
  }

  async recalculateRatings(productId: mongoose.Types.ObjectId): Promise<void> {
    try {
      const product = await Product.findById(productId);
      if (!product || !product.reviews.length) return;

      const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / product.reviews.length;

      await Product.findByIdAndUpdate(productId, {
        'ratings.average': Math.round(averageRating * 10) / 10, // Round to 1 decimal
        'ratings.count': product.reviews.length
      });

      logger.info('Product ratings recalculated', { productId, averageRating, reviewCount: product.reviews.length });
    } catch (error) {
      logger.error('Error recalculating product ratings', { error: error.message, productId });
      throw error;
    }
  }

  async delete(id: mongoose.Types.ObjectId): Promise<boolean> {
    try {
      const product = await Product.findById(id);
      if (!product) return false;

      // Update category product count
      if (product.category) {
        await Category.findByIdAndUpdate(
          product.category,
          { $inc: { productCount: -1 } }
        );
      }

      await Product.findByIdAndDelete(id);
      logger.info('Product deleted successfully', { productId: id, name: product.name });
      return true;
    } catch (error) {
      logger.error('Error deleting product', { error: error.message, productId: id });
      throw error;
    }
  }

  async getProductsByIds(productIds: mongoose.Types.ObjectId[]): Promise<IProduct[]> {
    try {
      return await Product.find({ _id: { $in: productIds } })
        .populate('category', 'name slug');
    } catch (error) {
      logger.error('Error getting products by IDs', { error: error.message, productIds });
      throw error;
    }
  }

  async getLowStockProducts(threshold?: number): Promise<IProduct[]> {
    try {
      const query = threshold 
        ? { stock: { $lte: threshold }, isActive: true }
        : { $expr: { $lte: ['$stock', '$minStock'] }, isActive: true };

      return await Product.find(query)
        .populate('category', 'name slug')
        .sort({ stock: 1 });
    } catch (error) {
      logger.error('Error getting low stock products', { error: error.message });
      throw error;
    }
  }

  async getTopSellingProducts(limit: number = 10): Promise<IProduct[]> {
    try {
      return await Product.find({ isActive: true, status: 'active' })
        .populate('category', 'name slug')
        .sort({ sales: -1 })
        .limit(limit);
    } catch (error) {
      logger.error('Error getting top selling products', { error: error.message });
      throw error;
    }
  }
}