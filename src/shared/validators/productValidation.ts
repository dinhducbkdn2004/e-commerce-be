import Joi from 'joi';

// Product variant validation schema
const productVariantSchema = Joi.object({
  size: Joi.string().trim().max(50).optional(),
  color: Joi.string().trim().max(50).optional(),
  stock: Joi.number().integer().min(0).required(),
  price: Joi.number().min(0).optional(),
  sku: Joi.string().trim().max(50).optional(),
  images: Joi.array().items(Joi.string().uri()).optional()
});

// Product dimensions validation schema
const dimensionsSchema = Joi.object({
  length: Joi.number().min(0).required(),
  width: Joi.number().min(0).required(),
  height: Joi.number().min(0).required()
});

// Create product validation
const createProduct = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(200)
    .required()
    .messages({
      'string.empty': 'Tên sản phẩm không được để trống',
      'string.min': 'Tên sản phẩm phải có ít nhất 2 ký tự',
      'string.max': 'Tên sản phẩm không được vượt quá 200 ký tự',
      'any.required': 'Tên sản phẩm là bắt buộc'
    }),

  description: Joi.string()
    .trim()
    .min(10)
    .max(5000)
    .required()
    .messages({
      'string.empty': 'Mô tả sản phẩm không được để trống',
      'string.min': 'Mô tả sản phẩm phải có ít nhất 10 ký tự',
      'string.max': 'Mô tả sản phẩm không được vượt quá 5000 ký tự',
      'any.required': 'Mô tả sản phẩm là bắt buộc'
    }),

  shortDescription: Joi.string()
    .trim()
    .max(500)
    .optional()
    .messages({
      'string.max': 'Mô tả ngắn không được vượt quá 500 ký tự'
    }),

  price: Joi.number()
    .min(0)
    .required()
    .messages({
      'number.min': 'Giá sản phẩm không được âm',
      'any.required': 'Giá sản phẩm là bắt buộc'
    }),

  originalPrice: Joi.number()
    .min(0)
    .optional()
    .messages({
      'number.min': 'Giá gốc không được âm'
    }),

  category: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'ID danh mục không hợp lệ',
      'any.required': 'Danh mục sản phẩm là bắt buộc'
    }),

  subcategory: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .messages({
      'string.pattern.base': 'ID danh mục con không hợp lệ'
    }),

  brand: Joi.string()
    .trim()
    .max(100)
    .optional()
    .messages({
      'string.max': 'Tên thương hiệu không được vượt quá 100 ký tự'
    }),

  sku: Joi.string()
    .trim()
    .max(50)
    .optional()
    .messages({
      'string.max': 'SKU không được vượt quá 50 ký tự'
    }),

  images: Joi.array()
    .items(Joi.string().uri())
    .min(1)
    .required()
    .messages({
      'array.min': 'Sản phẩm phải có ít nhất một hình ảnh',
      'any.required': 'Hình ảnh sản phẩm là bắt buộc'
    }),

  thumbnail: Joi.string()
    .uri()
    .optional(),

  variants: Joi.array()
    .items(productVariantSchema)
    .optional(),

  tags: Joi.array()
    .items(Joi.string().trim().max(50))
    .optional(),

  specifications: Joi.object()
    .pattern(Joi.string(), Joi.string())
    .optional(),

  weight: Joi.number()
    .min(0)
    .optional()
    .messages({
      'number.min': 'Trọng lượng không được âm'
    }),

  dimensions: dimensionsSchema.optional(),

  stock: Joi.number()
    .integer()
    .min(0)
    .required()
    .messages({
      'number.min': 'Tồn kho không được âm',
      'any.required': 'Số lượng tồn kho là bắt buộc'
    }),

  minStock: Joi.number()
    .integer()
    .min(0)
    .optional()
    .messages({
      'number.min': 'Tồn kho tối thiểu không được âm'
    }),

  isActive: Joi.boolean().optional(),

  isFeatured: Joi.boolean().optional(),

  isDigital: Joi.boolean().optional(),

  status: Joi.string()
    .valid('draft', 'active', 'inactive', 'out_of_stock')
    .optional()
    .messages({
      'any.only': 'Trạng thái sản phẩm không hợp lệ'
    }),

  seoTitle: Joi.string()
    .trim()
    .max(200)
    .optional()
    .messages({
      'string.max': 'Tiêu đề SEO không được vượt quá 200 ký tự'
    }),

  seoDescription: Joi.string()
    .trim()
    .max(500)
    .optional()
    .messages({
      'string.max': 'Mô tả SEO không được vượt quá 500 ký tự'
    }),

  seoKeywords: Joi.array()
    .items(Joi.string().trim().max(100))
    .optional()
});

// Update product validation (all fields optional except updatedBy)
const updateProduct = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(200)
    .optional()
    .messages({
      'string.min': 'Tên sản phẩm phải có ít nhất 2 ký tự',
      'string.max': 'Tên sản phẩm không được vượt quá 200 ký tự'
    }),

  description: Joi.string()
    .trim()
    .min(10)
    .max(5000)
    .optional()
    .messages({
      'string.min': 'Mô tả sản phẩm phải có ít nhất 10 ký tự',
      'string.max': 'Mô tả sản phẩm không được vượt quá 5000 ký tự'
    }),

  shortDescription: Joi.string()
    .trim()
    .max(500)
    .optional()
    .messages({
      'string.max': 'Mô tả ngắn không được vượt quá 500 ký tự'
    }),

  price: Joi.number()
    .min(0)
    .optional()
    .messages({
      'number.min': 'Giá sản phẩm không được âm'
    }),

  originalPrice: Joi.number()
    .min(0)
    .optional()
    .messages({
      'number.min': 'Giá gốc không được âm'
    }),

  category: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .messages({
      'string.pattern.base': 'ID danh mục không hợp lệ'
    }),

  subcategory: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .messages({
      'string.pattern.base': 'ID danh mục con không hợp lệ'
    }),

  brand: Joi.string()
    .trim()
    .max(100)
    .optional()
    .messages({
      'string.max': 'Tên thương hiệu không được vượt quá 100 ký tự'
    }),

  sku: Joi.string()
    .trim()
    .max(50)
    .optional()
    .messages({
      'string.max': 'SKU không được vượt quá 50 ký tự'
    }),

  images: Joi.array()
    .items(Joi.string().uri())
    .min(1)
    .optional()
    .messages({
      'array.min': 'Sản phẩm phải có ít nhất một hình ảnh'
    }),

  thumbnail: Joi.string()
    .uri()
    .optional(),

  variants: Joi.array()
    .items(productVariantSchema)
    .optional(),

  tags: Joi.array()
    .items(Joi.string().trim().max(50))
    .optional(),

  specifications: Joi.object()
    .pattern(Joi.string(), Joi.string())
    .optional(),

  weight: Joi.number()
    .min(0)
    .optional()
    .messages({
      'number.min': 'Trọng lượng không được âm'
    }),

  dimensions: dimensionsSchema.optional(),

  stock: Joi.number()
    .integer()
    .min(0)
    .optional()
    .messages({
      'number.min': 'Tồn kho không được âm'
    }),

  minStock: Joi.number()
    .integer()
    .min(0)
    .optional()
    .messages({
      'number.min': 'Tồn kho tối thiểu không được âm'
    }),

  isActive: Joi.boolean().optional(),

  isFeatured: Joi.boolean().optional(),

  isDigital: Joi.boolean().optional(),

  status: Joi.string()
    .valid('draft', 'active', 'inactive', 'out_of_stock')
    .optional()
    .messages({
      'any.only': 'Trạng thái sản phẩm không hợp lệ'
    }),

  seoTitle: Joi.string()
    .trim()
    .max(200)
    .optional()
    .messages({
      'string.max': 'Tiêu đề SEO không được vượt quá 200 ký tự'
    }),

  seoDescription: Joi.string()
    .trim()
    .max(500)
    .optional()
    .messages({
      'string.max': 'Mô tả SEO không được vượt quá 500 ký tự'
    }),

  seoKeywords: Joi.array()
    .items(Joi.string().trim().max(100))
    .optional()
});

// Product review validation
const createProductReview = Joi.object({
  rating: Joi.number()
    .integer()
    .min(1)
    .max(5)
    .required()
    .messages({
      'number.min': 'Đánh giá phải từ 1 đến 5 sao',
      'number.max': 'Đánh giá phải từ 1 đến 5 sao',
      'any.required': 'Đánh giá là bắt buộc'
    }),

  comment: Joi.string()
    .trim()
    .min(5)
    .max(1000)
    .required()
    .messages({
      'string.empty': 'Bình luận không được để trống',
      'string.min': 'Bình luận phải có ít nhất 5 ký tự',
      'string.max': 'Bình luận không được vượt quá 1000 ký tự',
      'any.required': 'Bình luận là bắt buộc'
    })
});

// Stock update validation
const updateStock = Joi.object({
  quantity: Joi.number()
    .integer()
    .required()
    .messages({
      'any.required': 'Số lượng thay đổi là bắt buộc'
    })
});

// Bulk update validation
const bulkUpdate = Joi.object({
  updates: Joi.array()
    .items(
      Joi.object({
        id: Joi.string()
          .pattern(/^[0-9a-fA-F]{24}$/)
          .required()
          .messages({
            'string.pattern.base': 'ID sản phẩm không hợp lệ',
            'any.required': 'ID sản phẩm là bắt buộc'
          }),
        data: updateProduct.required()
      })
    )
    .min(1)
    .required()
    .messages({
      'array.min': 'Phải có ít nhất một sản phẩm để cập nhật',
      'any.required': 'Danh sách cập nhật là bắt buộc'
    })
});

// Query validation schemas
const getProductsQuery = Joi.object({
  category: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  brand: Joi.string().trim().max(100).optional(),
  minPrice: Joi.number().min(0).optional(),
  maxPrice: Joi.number().min(0).optional(),
  tags: Joi.string().optional(), // Will be split by comma
  rating: Joi.number().min(1).max(5).optional(),
  isActive: Joi.string().valid('true', 'false').optional(),
  status: Joi.string().valid('draft', 'active', 'inactive', 'out_of_stock').optional(),
  isFeatured: Joi.string().valid('true', 'false').optional(),
  search: Joi.string().trim().min(1).max(100).optional(),
  sortBy: Joi.string()
    .valid('name', 'price', 'rating', 'sales', 'createdAt', 'views')
    .optional(),
  sortOrder: Joi.string().valid('asc', 'desc').optional(),
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional()
});

const searchQuery = Joi.object({
  q: Joi.string()
    .trim()
    .min(1)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Từ khóa tìm kiếm không được để trống',
      'string.min': 'Từ khóa tìm kiếm phải có ít nhất 1 ký tự',
      'string.max': 'Từ khóa tìm kiếm không được vượt quá 100 ký tự',
      'any.required': 'Từ khóa tìm kiếm là bắt buộc'
    }),
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional()
});

export const productValidation = {
  createProduct,
  updateProduct,
  createProductReview,
  updateStock,
  bulkUpdate,
  getProductsQuery,
  searchQuery
};