import mongoose, { Schema, Document } from 'mongoose';

// Category interface
export interface ICategory extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  slug: string;
  image?: string;
  icon?: string;
  parent?: mongoose.Types.ObjectId;
  children: mongoose.Types.ObjectId[];
  level: number; // 0 for root categories, 1 for subcategories, etc.
  path: mongoose.Types.ObjectId[]; // Array of parent IDs for breadcrumb
  isActive: boolean;
  sortOrder: number;
  productCount: number; // Cache for performance
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  createdBy: mongoose.Types.ObjectId;
  updatedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    maxlength: [100, 'Category name cannot exceed 100 characters'],
    index: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  slug: {
    type: String,
    required: [true, 'Category slug is required'],
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: [100, 'Slug cannot exceed 100 characters'],
    match: [/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens']
  },
  image: {
    type: String,
    trim: true
  },
  icon: {
    type: String,
    trim: true
  },
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  children: [{
    type: Schema.Types.ObjectId,
    ref: 'Category'
  }],
  level: {
    type: Number,
    required: true,
    min: 0,
    max: 5, // Limit nesting depth
    default: 0
  },
  path: [{
    type: Schema.Types.ObjectId,
    ref: 'Category'
  }],
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  sortOrder: {
    type: Number,
    default: 0,
    index: true
  },
  productCount: {
    type: Number,
    default: 0,
    min: 0
  },
  seoTitle: {
    type: String,
    trim: true,
    maxlength: [200, 'SEO title cannot exceed 200 characters']
  },
  seoDescription: {
    type: String,
    trim: true,
    maxlength: [500, 'SEO description cannot exceed 500 characters']
  },
  seoKeywords: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
CategorySchema.index({ parent: 1, isActive: 1, sortOrder: 1 });
CategorySchema.index({ level: 1, isActive: 1 });
CategorySchema.index({ path: 1 });

// Virtual for checking if category has children
CategorySchema.virtual('hasChildren').get(function() {
  return this.children && this.children.length > 0;
});

// Virtual for checking if category is root
CategorySchema.virtual('isRoot').get(function() {
  return this.level === 0 && !this.parent;
});

// Pre-save middleware
CategorySchema.pre('save', async function(next) {
  // Auto-generate slug from name if not provided
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim();
  }

  // Set level and path based on parent
  if (this.parent) {
    const parentCategory = await this.constructor.findById(this.parent);
    if (parentCategory) {
      this.level = parentCategory.level + 1;
      this.path = [...parentCategory.path, parentCategory._id];
    } else {
      throw new Error('Parent category not found');
    }
  } else {
    this.level = 0;
    this.path = [];
  }

  next();
});

// Post-save middleware to update parent's children array
CategorySchema.post('save', async function() {
  if (this.parent) {
    await this.constructor.findByIdAndUpdate(
      this.parent,
      { $addToSet: { children: this._id } }
    );
  }
});

// Pre-remove middleware to handle cleanup
CategorySchema.pre('deleteOne', { document: true, query: false }, async function() {
  // Remove from parent's children array
  if (this.parent) {
    await this.constructor.findByIdAndUpdate(
      this.parent,
      { $pull: { children: this._id } }
    );
  }

  // Move children to parent or root level
  if (this.children && this.children.length > 0) {
    await this.constructor.updateMany(
      { _id: { $in: this.children } },
      { 
        parent: this.parent || null,
        $set: { level: this.level }
      }
    );
  }

  // Update products to uncategorized or remove category reference
  const Product = mongoose.model('Product');
  await Product.updateMany(
    { category: this._id },
    { $unset: { category: 1 } }
  );
});

// Static methods
CategorySchema.statics.findRootCategories = function() {
  return this.find({ level: 0, isActive: true }).sort({ sortOrder: 1, name: 1 });
};

CategorySchema.statics.findBySlug = function(slug: string) {
  return this.findOne({ slug, isActive: true });
};

CategorySchema.statics.findWithChildren = function(categoryId: mongoose.Types.ObjectId) {
  return this.findById(categoryId).populate('children');
};

CategorySchema.statics.getFullPath = async function(categoryId: mongoose.Types.ObjectId) {
  const category = await this.findById(categoryId).populate('path');
  if (!category) return [];
  
  return [...category.path, category];
};

CategorySchema.statics.buildTree = async function() {
  const categories = await this.find({ isActive: true }).sort({ level: 1, sortOrder: 1 });
  
  const categoryMap = new Map();
  const rootCategories = [];

  // Create map of all categories
  categories.forEach(cat => {
    categoryMap.set(cat._id.toString(), { ...cat.toObject(), children: [] });
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
      rootCategories.push(categoryObj);
    }
  });

  return rootCategories;
};

export const Category = mongoose.model<ICategory>('Category', CategorySchema);