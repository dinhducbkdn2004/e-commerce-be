import mongoose from 'mongoose';
import { CategoryRepository } from './category.repository';
import { ICategory } from '../../models/Category';
import { AppError } from '../../shared/middlewares/errorHandler';
import { logger } from '../../shared/utils/logger';

export interface CreateCategoryData {
  name: string;
  description?: string;
  slug?: string;
  image?: string;
  icon?: string;
  parent?: mongoose.Types.ObjectId;
  isActive?: boolean;
  sortOrder?: number;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  createdBy: mongoose.Types.ObjectId;
}

export interface UpdateCategoryData extends Partial<CreateCategoryData> {
  updatedBy: mongoose.Types.ObjectId;
}

export class CategoryService {
  private categoryRepo = new CategoryRepository();

  async createCategory(categoryData: CreateCategoryData): Promise<ICategory> {
    try {
      // Validate required fields
      if (!categoryData.name || categoryData.name.trim().length === 0) {
        throw new AppError('Tên danh mục là bắt buộc', 400);
      }

      // Generate slug if not provided
      if (!categoryData.slug) {
        categoryData.slug = this.generateSlug(categoryData.name);
      }

      // Validate slug uniqueness
      const isSlugUnique = await this.categoryRepo.validateSlugUnique(categoryData.slug);
      if (!isSlugUnique) {
        throw new AppError('Slug danh mục đã tồn tại', 409);
      }

      // Validate parent category if provided
      if (categoryData.parent) {
        const parentCategory = await this.categoryRepo.findById(categoryData.parent);
        if (!parentCategory) {
          throw new AppError('Danh mục cha không tồn tại', 404);
        }

        // Check depth limit (max 5 levels)
        if (parentCategory.level >= 4) {
          throw new AppError('Không thể tạo danh mục con quá 5 cấp', 400);
        }
      }

      // Set default values
      const processedData = {
        ...categoryData,
        isActive: categoryData.isActive !== undefined ? categoryData.isActive : true,
        sortOrder: categoryData.sortOrder || 0,
        updatedBy: categoryData.createdBy
      };

      const category = await this.categoryRepo.create(processedData);
      
      logger.info('Category created successfully', {
        categoryId: category._id,
        name: category.name,
        level: category.level,
        createdBy: categoryData.createdBy
      });

      return category;
    } catch (error) {
      logger.error('Error creating category', { error: error.message, categoryData });
      throw error;
    }
  }

  async getCategoryById(categoryId: string): Promise<ICategory> {
    try {
      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        throw new AppError('ID danh mục không hợp lệ', 400);
      }

      const category = await this.categoryRepo.findById(new mongoose.Types.ObjectId(categoryId));
      
      if (!category) {
        throw new AppError('Không tìm thấy danh mục', 404);
      }

      return category;
    } catch (error) {
      logger.error('Error getting category by ID', { error: error.message, categoryId });
      throw error;
    }
  }

  async getCategoryBySlug(slug: string): Promise<ICategory> {
    try {
      if (!slug || slug.trim().length === 0) {
        throw new AppError('Slug danh mục không hợp lệ', 400);
      }

      const category = await this.categoryRepo.findBySlug(slug.trim().toLowerCase());
      
      if (!category) {
        throw new AppError('Không tìm thấy danh mục', 404);
      }

      return category;
    } catch (error) {
      logger.error('Error getting category by slug', { error: error.message, slug });
      throw error;
    }
  }

  async getAllCategories(isActive?: boolean) {
    try {
      const categories = await this.categoryRepo.findAll(isActive);

      return {
        success: true,
        data: categories,
        message: 'Lấy danh sách danh mục thành công',
        messageVi: 'Lấy danh sách danh mục thành công'
      };
    } catch (error) {
      logger.error('Error getting all categories', { error: error.message });
      throw error;
    }
  }

  async getRootCategories(isActive: boolean = true) {
    try {
      const categories = await this.categoryRepo.findRootCategories(isActive);

      return {
        success: true,
        data: categories,
        message: 'Lấy danh mục gốc thành công',
        messageVi: 'Lấy danh mục gốc thành công'
      };
    } catch (error) {
      logger.error('Error getting root categories', { error: error.message });
      throw error;
    }
  }

  async getCategoryChildren(categoryId: string, isActive: boolean = true) {
    try {
      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        throw new AppError('ID danh mục không hợp lệ', 400);
      }

      const children = await this.categoryRepo.findChildren(
        new mongoose.Types.ObjectId(categoryId),
        isActive
      );

      return {
        success: true,
        data: children,
        message: 'Lấy danh mục con thành công',
        messageVi: 'Lấy danh mục con thành công'
      };
    } catch (error) {
      logger.error('Error getting category children', { error: error.message, categoryId });
      throw error;
    }
  }

  async getCategoryTree(isActive: boolean = true) {
    try {
      const tree = await this.categoryRepo.buildTree(isActive);

      return {
        success: true,
        data: tree,
        message: 'Lấy cây danh mục thành công',
        messageVi: 'Lấy cây danh mục thành công'
      };
    } catch (error) {
      logger.error('Error getting category tree', { error: error.message });
      throw error;
    }
  }

  async getCategoryPath(categoryId: string) {
    try {
      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        throw new AppError('ID danh mục không hợp lệ', 400);
      }

      const path = await this.categoryRepo.getFullPath(new mongoose.Types.ObjectId(categoryId));

      return {
        success: true,
        data: path,
        message: 'Lấy đường dẫn danh mục thành công',
        messageVi: 'Lấy đường dẫn danh mục thành công'
      };
    } catch (error) {
      logger.error('Error getting category path', { error: error.message, categoryId });
      throw error;
    }
  }

  async updateCategory(categoryId: string, updateData: UpdateCategoryData): Promise<ICategory> {
    try {
      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        throw new AppError('ID danh mục không hợp lệ', 400);
      }

      const categoryObjectId = new mongoose.Types.ObjectId(categoryId);

      // Check if category exists
      const existingCategory = await this.categoryRepo.findById(categoryObjectId);
      if (!existingCategory) {
        throw new AppError('Không tìm thấy danh mục', 404);
      }

      // Validate slug uniqueness if updating slug
      if (updateData.slug) {
        const isSlugUnique = await this.categoryRepo.validateSlugUnique(
          updateData.slug,
          categoryObjectId
        );
        if (!isSlugUnique) {
          throw new AppError('Slug danh mục đã tồn tại', 409);
        }
      }

      // Validate parent category change
      if (updateData.parent) {
        // Can't set self as parent
        if (updateData.parent.toString() === categoryId) {
          throw new AppError('Danh mục không thể là cha của chính nó', 400);
        }

        // Check if new parent exists
        const parentCategory = await this.categoryRepo.findById(updateData.parent);
        if (!parentCategory) {
          throw new AppError('Danh mục cha không tồn tại', 404);
        }

        // Check if new parent is not a descendant
        const descendants = await this.categoryRepo.getChildrenRecursive(categoryObjectId);
        if (descendants.some(id => id.toString() === updateData.parent!.toString())) {
          throw new AppError('Không thể chọn danh mục con làm danh mục cha', 400);
        }

        // Check depth limit
        if (parentCategory.level >= 4) {
          throw new AppError('Không thể tạo danh mục con quá 5 cấp', 400);
        }
      }

      const category = await this.categoryRepo.update(categoryObjectId, updateData);

      if (!category) {
        throw new AppError('Không thể cập nhật danh mục', 500);
      }

      logger.info('Category updated successfully', {
        categoryId,
        updatedBy: updateData.updatedBy
      });

      return category;
    } catch (error) {
      logger.error('Error updating category', { error: error.message, categoryId });
      throw error;
    }
  }

  async deleteCategory(categoryId: string): Promise<void> {
    try {
      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        throw new AppError('ID danh mục không hợp lệ', 400);
      }

      const deleted = await this.categoryRepo.delete(new mongoose.Types.ObjectId(categoryId));

      if (!deleted) {
        throw new AppError('Không tìm thấy danh mục hoặc không thể xóa', 404);
      }

      logger.info('Category deleted successfully', { categoryId });
    } catch (error) {
      logger.error('Error deleting category', { error: error.message, categoryId });
      throw error;
    }
  }

  async searchCategories(query: string, isActive: boolean = true) {
    try {
      if (!query || query.trim().length === 0) {
        throw new AppError('Từ khóa tìm kiếm không được để trống', 400);
      }

      const categories = await this.categoryRepo.searchCategories(query.trim(), isActive);

      return {
        success: true,
        data: categories,
        message: 'Tìm kiếm danh mục thành công',
        messageVi: 'Tìm kiếm danh mục thành công'
      };
    } catch (error) {
      logger.error('Error searching categories', { error: error.message, query });
      throw error;
    }
  }

  async reorderCategories(categoryUpdates: Array<{ id: string; sortOrder: number }>): Promise<void> {
    try {
      // Validate all category IDs
      const validUpdates = categoryUpdates.map(update => {
        if (!mongoose.Types.ObjectId.isValid(update.id)) {
          throw new AppError(`ID danh mục không hợp lệ: ${update.id}`, 400);
        }
        return {
          id: new mongoose.Types.ObjectId(update.id),
          sortOrder: update.sortOrder
        };
      });

      await this.categoryRepo.reorderCategories(validUpdates);
      
      logger.info('Categories reordered successfully', { count: validUpdates.length });
    } catch (error) {
      logger.error('Error reordering categories', { error: error.message });
      throw error;
    }
  }

  async getCategoriesWithProductCount() {
    try {
      const categories = await this.categoryRepo.getCategoriesWithProductCount();

      return {
        success: true,
        data: categories,
        message: 'Lấy danh mục với số lượng sản phẩm thành công',
        messageVi: 'Lấy danh mục với số lượng sản phẩm thành công'
      };
    } catch (error) {
      logger.error('Error getting categories with product count', { error: error.message });
      throw error;
    }
  }

  async getCategoryAnalytics(categoryId: string) {
    try {
      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        throw new AppError('ID danh mục không hợp lệ', 400);
      }

      const category = await this.categoryRepo.findById(new mongoose.Types.ObjectId(categoryId));
      
      if (!category) {
        throw new AppError('Không tìm thấy danh mục', 404);
      }

      // Get children count recursively
      const allDescendants = await this.categoryRepo.getChildrenRecursive(category._id);
      
      return {
        success: true,
        data: {
          id: category._id,
          name: category.name,
          level: category.level,
          productCount: category.productCount,
          directChildren: category.children.length,
          totalDescendants: allDescendants.length,
          isActive: category.isActive,
          path: category.path
        },
        message: 'Lấy thống kê danh mục thành công',
        messageVi: 'Lấy thống kê danh mục thành công'
      };
    } catch (error) {
      logger.error('Error getting category analytics', { error: error.message, categoryId });
      throw error;
    }
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  }

  async bulkCreateCategories(categories: CreateCategoryData[]): Promise<ICategory[]> {
    try {
      const createdCategories = [];

      for (const categoryData of categories) {
        const category = await this.createCategory(categoryData);
        createdCategories.push(category);
      }

      logger.info('Bulk categories created successfully', { count: createdCategories.length });
      return createdCategories;
    } catch (error) {
      logger.error('Error in bulk category creation', { error: error.message });
      throw error;
    }
  }

  async validateCategoryHierarchy(): Promise<{ isValid: boolean; errors: string[] }> {
    try {
      const categories = await this.categoryRepo.findAll();
      const errors: string[] = [];

      for (const category of categories) {
        // Check if parent exists (if specified)
        if (category.parent) {
          const parent = categories.find(c => c._id.toString() === category.parent!.toString());
          if (!parent) {
            errors.push(`Category "${category.name}" has invalid parent ID`);
          }
        }

        // Check level consistency
        if (category.parent) {
          const parent = categories.find(c => c._id.toString() === category.parent!.toString());
          if (parent && category.level !== parent.level + 1) {
            errors.push(`Category "${category.name}" has incorrect level`);
          }
        } else if (category.level !== 0) {
          errors.push(`Root category "${category.name}" should have level 0`);
        }
      }

      return {
        isValid: errors.length === 0,
        errors
      };
    } catch (error) {
      logger.error('Error validating category hierarchy', { error: error.message });
      throw error;
    }
  }
}