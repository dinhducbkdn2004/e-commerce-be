import { Category, ICategory } from '../../models/Category';
import mongoose from 'mongoose';
import { logger } from '../../shared/utils/logger';

export class CategoryRepository {
  async create(categoryData: Partial<ICategory>): Promise<ICategory> {
    try {
      const category = new Category(categoryData);
      await category.save();
      
      logger.info('Category created successfully', { 
        categoryId: category._id, 
        name: category.name,
        level: category.level 
      });
      
      return category;
    } catch (error) {
      logger.error('Error creating category', { error: error instanceof Error ? error instanceof Error ? error.message : String(error) : String(error), categoryData });
      throw error;
    }
  }

  async findById(id: mongoose.Types.ObjectId): Promise<ICategory | null> {
    try {
      return await Category.findById(id)
        .populate('parent', 'name slug level')
        .populate('children', 'name slug level')
        .populate('createdBy', 'name email')
        .populate('updatedBy', 'name email');
    } catch (error) {
      logger.error('Error finding category by ID', { error: error instanceof Error ? error.message : String(error), categoryId: id });
      throw error;
    }
  }

  async findBySlug(slug: string): Promise<ICategory | null> {
    try {
      return await Category.findOne({ slug, isActive: true })
        .populate('parent', 'name slug level')
        .populate('children', 'name slug level');
    } catch (error) {
      logger.error('Error finding category by slug', { error: error instanceof Error ? error.message : String(error), slug });
      throw error;
    }
  }

  async findAll(isActive?: boolean): Promise<ICategory[]> {
    try {
      const query = isActive !== undefined ? { isActive } : {};
      
      return await Category.find(query)
        .populate('parent', 'name slug level')
        .populate('children', 'name slug level')
        .sort({ level: 1, sortOrder: 1, name: 1 });
    } catch (error) {
      logger.error('Error finding all categories', { error: error instanceof Error ? error.message : String(error) });
      throw error;
    }
  }

  async findRootCategories(isActive: boolean = true): Promise<ICategory[]> {
    try {
      return await Category.find({ level: 0, isActive })
        .populate('children', 'name slug level isActive')
        .sort({ sortOrder: 1, name: 1 });
    } catch (error) {
      logger.error('Error finding root categories', { error: error instanceof Error ? error.message : String(error) });
      throw error;
    }
  }

  async findChildren(parentId: mongoose.Types.ObjectId, isActive: boolean = true): Promise<ICategory[]> {
    try {
      return await Category.find({ parent: parentId, isActive })
        .populate('children', 'name slug level')
        .sort({ sortOrder: 1, name: 1 });
    } catch (error) {
      logger.error('Error finding child categories', { error: error instanceof Error ? error.message : String(error), parentId });
      throw error;
    }
  }

  async findWithChildren(categoryId: mongoose.Types.ObjectId): Promise<ICategory | null> {
    try {
      return await Category.findById(categoryId)
        .populate('children', 'name slug level isActive sortOrder')
        .populate('parent', 'name slug level');
    } catch (error) {
      logger.error('Error finding category with children', { error: error instanceof Error ? error.message : String(error), categoryId });
      throw error;
    }
  }

  async getFullPath(categoryId: mongoose.Types.ObjectId): Promise<ICategory[]> {
    try {
      const category = await Category.findById(categoryId);
      
      if (!category) return [];
      
      // Get path categories if they exist
      const pathCategories: ICategory[] = [];
      if (category.path && category.path.length > 0) {
        const pathCats = await Category.find({ 
          _id: { $in: category.path } 
        }).select('name slug level').sort({ level: 1 });
        pathCategories.push(...pathCats);
      }
      
      return [...pathCategories, category];
    } catch (error) {
      logger.error('Error getting category full path', { error: error instanceof Error ? error.message : String(error), categoryId });
      throw error;
    }
  }

  async buildTree(isActive: boolean = true): Promise<any[]> {
    try {
      const categories = await Category.find({ isActive })
        .sort({ level: 1, sortOrder: 1, name: 1 });
      
      const categoryMap = new Map<string, any>();
      const rootCategories: any[] = [];

      // Create map of all categories
      categories.forEach(cat => {
        categoryMap.set(cat._id.toString(), { 
          ...cat.toObject(), 
          children: [] 
        });
      });

      // Build tree structure
      categories.forEach(cat => {
        const categoryObj = categoryMap.get(cat._id.toString());
        
        if (cat.parent) {
          const parent = categoryMap.get(cat.parent.toString());
          if (parent) {
            parent.children.push(categoryObj);
          }
        } else {
          (rootCategories as any[]).push(categoryObj);
        }
      });

      logger.info('Category tree built successfully', { 
        totalCategories: categories.length, 
        rootCategories: (rootCategories as any[]).length 
      });

      return rootCategories;
    } catch (error) {
      logger.error('Error building category tree', { error: error instanceof Error ? error.message : String(error) });
      throw error;
    }
  }

  async update(id: mongoose.Types.ObjectId, updateData: Partial<ICategory>): Promise<ICategory | null> {
    try {
      const category = await Category.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true }
      )
        .populate('parent', 'name slug level')
        .populate('children', 'name slug level');

      if (category) {
        logger.info('Category updated successfully', { 
          categoryId: id, 
          name: category.name 
        });
      }

      return category;
    } catch (error) {
      logger.error('Error updating category', { error: error instanceof Error ? error.message : String(error), categoryId: id });
      throw error;
    }
  }

  async delete(id: mongoose.Types.ObjectId): Promise<boolean> {
    try {
      const category = await Category.findById(id);
      if (!category) return false;

      // Check if category has children
      if (category.children && category.children.length > 0) {
        throw new Error('Cannot delete category that has subcategories');
      }

      // Check if category has products
      const Product = mongoose.model('Product');
      const productCount = await Product.countDocuments({ category: id });
      if (productCount > 0) {
        throw new Error('Cannot delete category that has products');
      }

      await Category.findByIdAndDelete(id);
      
      logger.info('Category deleted successfully', { 
        categoryId: id, 
        name: category.name 
      });
      
      return true;
    } catch (error) {
      logger.error('Error deleting category', { error: error instanceof Error ? error.message : String(error), categoryId: id });
      throw error;
    }
  }

  async updateProductCount(categoryId: mongoose.Types.ObjectId, increment: number = 1): Promise<void> {
    try {
      await Category.findByIdAndUpdate(
        categoryId,
        { $inc: { productCount: increment } }
      );
      
      logger.info('Category product count updated', { 
        categoryId, 
        increment 
      });
    } catch (error) {
      logger.error('Error updating category product count', { 
        error: error instanceof Error ? error.message : String(error), 
        categoryId, 
        increment 
      });
      // Don't throw error for product count updates
    }
  }

  async reorderCategories(categoryUpdates: Array<{ id: mongoose.Types.ObjectId; sortOrder: number }>): Promise<void> {
    try {
      const updatePromises = categoryUpdates.map(update =>
        Category.findByIdAndUpdate(update.id, { sortOrder: update.sortOrder })
      );

      await Promise.all(updatePromises);
      
      logger.info('Categories reordered successfully', { 
        count: categoryUpdates.length 
      });
    } catch (error) {
      logger.error('Error reordering categories', { error: error instanceof Error ? error.message : String(error) });
      throw error;
    }
  }

  async searchCategories(query: string, isActive: boolean = true): Promise<ICategory[]> {
    try {
      return await Category.find({
        $text: { $search: query },
        isActive
      })
        .populate('parent', 'name slug level')
        .sort({ score: { $meta: 'textScore' } });
    } catch (error) {
      logger.error('Error searching categories', { error: error instanceof Error ? error.message : String(error), query });
      throw error;
    }
  }

  async getCategoriesWithProductCount(): Promise<ICategory[]> {
    try {
      return await Category.find({ isActive: true })
        .populate('children', 'name slug productCount')
        .sort({ level: 1, sortOrder: 1, name: 1 });
    } catch (error) {
      logger.error('Error getting categories with product count', { error: error instanceof Error ? error.message : String(error) });
      throw error;
    }
  }

  async findByIds(categoryIds: mongoose.Types.ObjectId[]): Promise<ICategory[]> {
    try {
      return await Category.find({ 
        _id: { $in: categoryIds },
        isActive: true 
      })
        .sort({ level: 1, sortOrder: 1, name: 1 });
    } catch (error) {
      logger.error('Error finding categories by IDs', { error: error instanceof Error ? error.message : String(error), categoryIds });
      throw error;
    }
  }

  async validateSlugUnique(slug: string, excludeId?: mongoose.Types.ObjectId): Promise<boolean> {
    try {
      const query: any = { slug };
      if (excludeId) {
        query._id = { $ne: excludeId };
      }

      const existingCategory = await Category.findOne(query);
      return !existingCategory;
    } catch (error) {
      logger.error('Error validating slug uniqueness', { error: error instanceof Error ? error.message : String(error), slug });
      throw error;
    }
  }

  async getChildrenRecursive(parentId: mongoose.Types.ObjectId): Promise<mongoose.Types.ObjectId[]> {
    try {
      const children = await Category.find({ parent: parentId }, '_id');
      const childIds = children.map(child => child._id);
      
      const allDescendants = [...childIds];
      
      // Get children of children recursively
      for (const childId of childIds) {
        const grandChildren = await this.getChildrenRecursive(childId);
        allDescendants.push(...grandChildren);
      }
      
      return allDescendants;
    } catch (error) {
      logger.error('Error getting children recursively', { error: error instanceof Error ? error.message : String(error), parentId });
      throw error;
    }
  }
}