import mongoose, { Schema, Document } from 'mongoose';

// Product Variant interface
export interface IProductVariant {
  size?: string;
  color?: string;
  stock: number;
  price?: number; // Optional price override for variants
  sku?: string;
  images?: string[];
}

// Product Review interface
export interface IProductReview {
  user: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
  isVerified: boolean; // Whether purchase is verified
}

// Product interface
export interface IProduct extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number; // For discount calculations
  category: mongoose.Types.ObjectId;
  subcategory?: mongoose.Types.ObjectId;
  brand?: string;
  sku: string;
  images: string[];
  thumbnail: string; // Main product image
  variants: IProductVariant[];
  tags: string[];
  specifications: { [key: string]: string }; // Flexible specs like "Weight", "Dimensions"
  weight?: number; // For shipping calculations
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  stock: number;
  minStock: number; // Alert threshold
  isActive: boolean;
  isFeatured: boolean;
  isDigital: boolean; // For digital products
  status: 'draft' | 'active' | 'inactive' | 'out_of_stock';
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  ratings: {
    average: number;
    count: number;
  };
  reviews: IProductReview[];
  sales: number; // Total sales count
  views: number; // View count for analytics
  createdBy: mongoose.Types.ObjectId;
  updatedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Product Variant Schema
const ProductVariantSchema = new Schema<IProductVariant>({
  size: { type: String, trim: true },
  color: { type: String, trim: true },
  stock: { type: Number, required: true, min: 0, default: 0 },
  price: { type: Number, min: 0 },
  sku: { type: String, trim: true, unique: true, sparse: true },
  images: [{ type: String, trim: true }]
});

// Product Review Schema
const ProductReviewSchema = new Schema<IProductReview>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true, trim: true, maxlength: 1000 },
  createdAt: { type: Date, default: Date.now },
  isVerified: { type: Boolean, default: false }
});

// Main Product Schema
const ProductSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters'],
    index: 'text' // For text search
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true,
    maxlength: [5000, 'Description cannot exceed 5000 characters'],
    index: 'text'
  },
  shortDescription: {
    type: String,
    trim: true,
    maxlength: [500, 'Short description cannot exceed 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Product category is required']
  },
  subcategory: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  },
  brand: {
    type: String,
    trim: true,
    maxlength: [100, 'Brand name cannot exceed 100 characters'],
    index: true
  },
  sku: {
    type: String,
    required: [true, 'SKU is required'],
    unique: true,
    trim: true,
    uppercase: true,
    maxlength: [50, 'SKU cannot exceed 50 characters']
  },
  images: [{
    type: String,
    required: true,
    trim: true
  }],
  thumbnail: {
    type: String,
    required: [true, 'Product thumbnail is required'],
    trim: true
  },
  variants: [ProductVariantSchema],
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  specifications: {
    type: Map,
    of: String
  },
  weight: {
    type: Number,
    min: [0, 'Weight cannot be negative']
  },
  dimensions: {
    length: { type: Number, min: 0 },
    width: { type: Number, min: 0 },
    height: { type: Number, min: 0 }
  },
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  minStock: {
    type: Number,
    default: 10,
    min: [0, 'Minimum stock cannot be negative']
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  isFeatured: {
    type: Boolean,
    default: false,
    index: true
  },
  isDigital: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'inactive', 'out_of_stock'],
    default: 'draft',
    index: true
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
  ratings: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0, min: 0 }
  },
  reviews: [ProductReviewSchema],
  sales: {
    type: Number,
    default: 0,
    min: 0
  },
  views: {
    type: Number,
    default: 0,
    min: 0
  },
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

// Indexes for better performance
ProductSchema.index({ name: 'text', description: 'text', tags: 'text' });
ProductSchema.index({ category: 1, isActive: 1, status: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ 'ratings.average': -1 });
ProductSchema.index({ sales: -1 });
ProductSchema.index({ createdAt: -1 });
ProductSchema.index({ brand: 1, isActive: 1 });
ProductSchema.index({ tags: 1 });

// Virtual for discount percentage
ProductSchema.virtual('discountPercentage').get(function() {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

// Virtual for availability status
ProductSchema.virtual('isInStock').get(function() {
  return this.stock > 0 && this.status === 'active' && this.isActive;
});

// Virtual for total variant stock
ProductSchema.virtual('totalVariantStock').get(function() {
  return this.variants.reduce((total, variant) => total + variant.stock, 0);
});

// Pre-save middleware
ProductSchema.pre('save', function(next) {
  // Auto-generate SKU if not provided
  if (!this.sku && this.name) {
    const namePrefix = this.name.substring(0, 3).toUpperCase();
    const timestamp = Date.now().toString().slice(-6);
    this.sku = `${namePrefix}${timestamp}`;
  }

  // Set thumbnail as first image if not provided
  if (!this.thumbnail && this.images.length > 0) {
    this.thumbnail = this.images[0];
  }

  // Update status based on stock
  if (this.stock === 0 && !this.variants.some(v => v.stock > 0)) {
    this.status = 'out_of_stock';
  } else if (this.status === 'out_of_stock' && (this.stock > 0 || this.variants.some(v => v.stock > 0))) {
    this.status = 'active';
  }

  next();
});

// Static methods for advanced queries
ProductSchema.statics.findByCategory = function(categoryId: mongoose.Types.ObjectId) {
  return this.find({ category: categoryId, isActive: true, status: 'active' });
};

ProductSchema.statics.findFeatured = function() {
  return this.find({ isFeatured: true, isActive: true, status: 'active' });
};

ProductSchema.statics.searchProducts = function(query: string) {
  return this.find(
    { $text: { $search: query }, isActive: true, status: 'active' },
    { score: { $meta: 'textScore' } }
  ).sort({ score: { $meta: 'textScore' } });
};

export const Product = mongoose.model<IProduct>('Product', ProductSchema);