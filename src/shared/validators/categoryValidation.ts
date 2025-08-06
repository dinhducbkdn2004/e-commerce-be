import Joi from 'joi';

// Create category validation
const createCategory = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Tên danh mục không được để trống',
      'string.min': 'Tên danh mục phải có ít nhất 2 ký tự',
      'string.max': 'Tên danh mục không được vượt quá 100 ký tự',
      'any.required': 'Tên danh mục là bắt buộc'
    }),

  description: Joi.string()
    .trim()
    .max(1000)
    .optional()
    .messages({
      'string.max': 'Mô tả danh mục không được vượt quá 1000 ký tự'
    }),

  slug: Joi.string()
    .trim()
    .max(100)
    .pattern(/^[a-z0-9-]+$/)
    .optional()
    .messages({
      'string.max': 'Slug không được vượt quá 100 ký tự',
      'string.pattern.base': 'Slug chỉ có thể chứa chữ thường, số và dấu gạch ngang'
    }),

  image: Joi.string()
    .uri()
    .optional()
    .messages({
      'string.uri': 'URL hình ảnh không hợp lệ'
    }),

  icon: Joi.string()
    .trim()
    .max(100)
    .optional()
    .messages({
      'string.max': 'Icon không được vượt quá 100 ký tự'
    }),

  parent: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .messages({
      'string.pattern.base': 'ID danh mục cha không hợp lệ'
    }),

  isActive: Joi.boolean()
    .optional()
    .default(true),

  sortOrder: Joi.number()
    .integer()
    .min(0)
    .optional()
    .default(0)
    .messages({
      'number.min': 'Thứ tự sắp xếp không được âm'
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

// Update category validation (all fields optional except updatedBy)
const updateCategory = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .optional()
    .messages({
      'string.min': 'Tên danh mục phải có ít nhất 2 ký tự',
      'string.max': 'Tên danh mục không được vượt quá 100 ký tự'
    }),

  description: Joi.string()
    .trim()
    .max(1000)
    .optional()
    .messages({
      'string.max': 'Mô tả danh mục không được vượt quá 1000 ký tự'
    }),

  slug: Joi.string()
    .trim()
    .max(100)
    .pattern(/^[a-z0-9-]+$/)
    .optional()
    .messages({
      'string.max': 'Slug không được vượt quá 100 ký tự',
      'string.pattern.base': 'Slug chỉ có thể chứa chữ thường, số và dấu gạch ngang'
    }),

  image: Joi.string()
    .uri()
    .optional()
    .messages({
      'string.uri': 'URL hình ảnh không hợp lệ'
    }),

  icon: Joi.string()
    .trim()
    .max(100)
    .optional()
    .messages({
      'string.max': 'Icon không được vượt quá 100 ký tự'
    }),

  parent: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .allow(null) // Allow removing parent
    .messages({
      'string.pattern.base': 'ID danh mục cha không hợp lệ'
    }),

  isActive: Joi.boolean().optional(),

  sortOrder: Joi.number()
    .integer()
    .min(0)
    .optional()
    .messages({
      'number.min': 'Thứ tự sắp xếp không được âm'
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

// Reorder categories validation
const reorderCategories = Joi.object({
  updates: Joi.array()
    .items(
      Joi.object({
        id: Joi.string()
          .pattern(/^[0-9a-fA-F]{24}$/)
          .required()
          .messages({
            'string.pattern.base': 'ID danh mục không hợp lệ',
            'any.required': 'ID danh mục là bắt buộc'
          }),
        sortOrder: Joi.number()
          .integer()
          .min(0)
          .required()
          .messages({
            'number.min': 'Thứ tự sắp xếp không được âm',
            'any.required': 'Thứ tự sắp xếp là bắt buộc'
          })
      })
    )
    .min(1)
    .required()
    .messages({
      'array.min': 'Phải có ít nhất một danh mục để sắp xếp',
      'any.required': 'Danh sách sắp xếp là bắt buộc'
    })
});

// Bulk create categories validation
const bulkCreateCategories = Joi.object({
  categories: Joi.array()
    .items(createCategory)
    .min(1)
    .max(100) // Limit bulk operations
    .required()
    .messages({
      'array.min': 'Phải có ít nhất một danh mục để tạo',
      'array.max': 'Không thể tạo quá 100 danh mục cùng lúc',
      'any.required': 'Danh sách danh mục là bắt buộc'
    })
});

// Query validation schemas
const getCategoriesQuery = Joi.object({
  isActive: Joi.string()
    .valid('true', 'false')
    .optional()
});

const searchCategoriesQuery = Joi.object({
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
  isActive: Joi.string()
    .valid('true', 'false')
    .optional()
});

// Parameter validation schemas
const categoryIdParam = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'ID danh mục không hợp lệ',
      'any.required': 'ID danh mục là bắt buộc'
    })
});

const categorySlugParam = Joi.object({
  slug: Joi.string()
    .trim()
    .min(1)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Slug danh mục không được để trống',
      'string.min': 'Slug phải có ít nhất 1 ký tự',
      'string.max': 'Slug không được vượt quá 100 ký tự',
      'any.required': 'Slug danh mục là bắt buộc'
    })
});

export const categoryValidation = {
  createCategory,
  updateCategory,
  reorderCategories,
  bulkCreateCategories,
  getCategoriesQuery,
  searchCategoriesQuery,
  categoryIdParam,
  categorySlugParam
};