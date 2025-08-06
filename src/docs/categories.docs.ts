/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: Category ID
 *           example: "60d21b4667d0d8992e610c85"
 *         name:
 *           type: string
 *           description: Category name
 *           maxLength: 100
 *           example: "Electronics"
 *         description:
 *           type: string
 *           description: Category description
 *           maxLength: 1000
 *           example: "Electronic devices and gadgets"
 *         slug:
 *           type: string
 *           description: URL-friendly category slug
 *           maxLength: 100
 *           example: "electronics"
 *         image:
 *           type: string
 *           description: Category image URL
 *           example: "https://example.com/categories/electronics.jpg"
 *         icon:
 *           type: string
 *           description: Category icon (CSS class or emoji)
 *           example: "📱"
 *         parent:
 *           type: string
 *           description: Parent category ID (null for root categories)
 *           example: null
 *         children:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of child category IDs
 *           example: ["60d21b4667d0d8992e610c86", "60d21b4667d0d8992e610c87"]
 *         path:
 *           type: string
 *           description: Category path for hierarchy
 *           example: "electronics"
 *         level:
 *           type: number
 *           description: Category hierarchy level (0 for root)
 *           minimum: 0
 *           example: 0
 *         isActive:
 *           type: boolean
 *           description: Whether category is active
 *           example: true
 *         sortOrder:
 *           type: number
 *           description: Sort order for display
 *           minimum: 0
 *           example: 1
 *         productCount:
 *           type: number
 *           description: Number of products in category
 *           minimum: 0
 *           example: 25
 *         seoTitle:
 *           type: string
 *           description: SEO title
 *           maxLength: 200
 *           example: "Electronics - Latest Gadgets & Devices"
 *         seoDescription:
 *           type: string
 *           description: SEO description
 *           maxLength: 500
 *           example: "Shop the latest electronics, smartphones, laptops, and gadgets"
 *         seoKeywords:
 *           type: array
 *           items:
 *             type: string
 *           description: SEO keywords
 *           example: ["electronics", "gadgets", "technology"]
 *         createdBy:
 *           type: string
 *           description: ID of user who created the category
 *           example: "60d21b4667d0d8992e610c88"
 *         updatedBy:
 *           type: string
 *           description: ID of user who last updated the category
 *           example: "60d21b4667d0d8992e610c88"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *           example: "2023-01-01T00:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *           example: "2023-01-01T00:00:00.000Z"
 * 
 *     CategoryWithChildren:
 *       allOf:
 *         - $ref: '#/components/schemas/Category'
 *         - type: object
 *           properties:
 *             children:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 * 
 *     CategoryResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Category retrieved successfully"
 *         messageVi:
 *           type: string
 *           example: "Lấy danh mục thành công"
 *         data:
 *           $ref: '#/components/schemas/Category'
 *         timestamp:
 *           type: string
 *           format: date-time
 *           example: "2023-01-01T00:00:00.000Z"
 * 
 *     CategoryListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Categories retrieved successfully"
 *         messageVi:
 *           type: string
 *           example: "Lấy danh sách danh mục thành công"
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Category'
 *         timestamp:
 *           type: string
 *           format: date-time
 *           example: "2023-01-01T00:00:00.000Z"
 */

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management API endpoints
 */

// Public endpoints

/**
 * @swagger
 * /api/v1/categories:
 *   get:
 *     summary: Get all categories
 *     description: Retrieve all categories with optional filtering
 *     tags: [Categories]
 *     parameters:
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Filter by active status (admin only can see inactive)
 *         example: "true"
 *       - in: query
 *         name: level
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Filter by category level
 *         example: 0
 *       - in: query
 *         name: parent
 *         schema:
 *           type: string
 *         description: Filter by parent category ID
 *         example: "60d21b4667d0d8992e610c85"
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryListResponse'
 *             example:
 *               success: true
 *               message: "Categories retrieved successfully"
 *               messageVi: "Lấy danh sách danh mục thành công"
 *               data:
 *                 - id: "60d21b4667d0d8992e610c85"
 *                   name: "Electronics"
 *                   slug: "electronics"
 *                   level: 0
 *                   isActive: true
 *                   productCount: 25
 *               timestamp: "2023-01-01T00:00:00.000Z"
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/categories/root:
 *   get:
 *     summary: Get root categories (top-level)
 *     description: Retrieve only root categories (level 0)
 *     tags: [Categories]
 *     parameters:
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Filter by active status
 *         example: "true"
 *       - in: query
 *         name: withProductCount
 *         schema:
 *           type: boolean
 *         description: Include product count in response
 *         example: true
 *     responses:
 *       200:
 *         description: Root categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryListResponse'
 */

/**
 * @swagger
 * /api/v1/categories/tree:
 *   get:
 *     summary: Get category tree (hierarchical structure)
 *     description: Retrieve categories in hierarchical tree structure
 *     tags: [Categories]
 *     parameters:
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Filter by active status
 *         example: "true"
 *       - in: query
 *         name: maxDepth
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Maximum depth of tree to return
 *         example: 3
 *     responses:
 *       200:
 *         description: Category tree retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 messageVi:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CategoryWithChildren'
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */

/**
 * @swagger
 * /api/v1/categories/search:
 *   get:
 *     summary: Search categories
 *     description: Search categories by name or description
 *     tags: [Categories]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 1
 *         description: Search query
 *         example: "electronics"
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Filter by active status
 *         example: "true"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Maximum number of results
 *         example: 20
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryListResponse'
 *       400:
 *         description: Search query is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Search query is required"
 *                 messageVi:
 *                   type: string
 *                   example: "Từ khóa tìm kiếm là bắt buộc"
 */

/**
 * @swagger
 * /api/v1/categories/slug/{slug}:
 *   get:
 *     summary: Get category by slug
 *     description: Retrieve a category by its URL slug
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Category slug
 *         example: "electronics"
 *     responses:
 *       200:
 *         description: Category retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryResponse'
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Category not found"
 *                 messageVi:
 *                   type: string
 *                   example: "Không tìm thấy danh mục"
 */

/**
 * @swagger
 * /api/v1/categories/{id}:
 *   get:
 *     summary: Get category by ID
 *     description: Retrieve a specific category by its ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *         example: "60d21b4667d0d8992e610c85"
 *       - in: query
 *         name: includeProducts
 *         schema:
 *           type: boolean
 *         description: Include products in this category
 *         example: false
 *     responses:
 *       200:
 *         description: Category retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryResponse'
 *       400:
 *         description: Invalid category ID format
 *       404:
 *         description: Category not found
 */

/**
 * @swagger
 * /api/v1/categories/{id}/children:
 *   get:
 *     summary: Get category children
 *     description: Retrieve all direct children of a category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *         example: "60d21b4667d0d8992e610c85"
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Filter by active status
 *         example: "true"
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [sortOrder, name, createdAt]
 *           default: sortOrder
 *         description: Sort field
 *         example: "sortOrder"
 *     responses:
 *       200:
 *         description: Category children retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryListResponse'
 *       404:
 *         description: Category not found
 */

/**
 * @swagger
 * /api/v1/categories/{id}/path:
 *   get:
 *     summary: Get category path (breadcrumb)
 *     description: Retrieve the full path from root to this category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *         example: "60d21b4667d0d8992e610c85"
 *     responses:
 *       200:
 *         description: Category path retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 messageVi:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     path:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Category'
 *                       description: Array of categories from root to current
 *                     breadcrumb:
 *                       type: string
 *                       example: "Electronics > Smartphones"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Category not found
 */

// Admin-only endpoints

/**
 * @swagger
 * /api/v1/categories:
 *   post:
 *     summary: Create new category
 *     description: Create a new category (Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 100
 *                 example: "Smartphones"
 *               description:
 *                 type: string
 *                 maxLength: 1000
 *                 example: "Mobile phones and accessories"
 *               slug:
 *                 type: string
 *                 maxLength: 100
 *                 example: "smartphones"
 *               image:
 *                 type: string
 *                 example: "https://example.com/categories/smartphones.jpg"
 *               icon:
 *                 type: string
 *                 example: "📱"
 *               parent:
 *                 type: string
 *                 example: "60d21b4667d0d8992e610c85"
 *               isActive:
 *                 type: boolean
 *                 example: true
 *               sortOrder:
 *                 type: number
 *                 minimum: 0
 *                 example: 1
 *               seoTitle:
 *                 type: string
 *                 maxLength: 200
 *                 example: "Smartphones - Latest Mobile Phones"
 *               seoDescription:
 *                 type: string
 *                 maxLength: 500
 *                 example: "Shop the latest smartphones with best prices"
 *               seoKeywords:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["smartphones", "mobile", "phones"]
 *           example:
 *             name: "Smartphones"
 *             description: "Mobile phones and accessories"
 *             parent: "60d21b4667d0d8992e610c85"
 *             isActive: true
 *             sortOrder: 1
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryResponse'
 *       400:
 *         description: Invalid input data or category name already exists
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       409:
 *         description: Category with same name or slug already exists
 */

/**
 * @swagger
 * /api/v1/categories/bulk-create:
 *   post:
 *     summary: Bulk create categories
 *     description: Create multiple categories at once (Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - categories
 *             properties:
 *               categories:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - name
 *                   properties:
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     parent:
 *                       type: string
 *                     isActive:
 *                       type: boolean
 *                     sortOrder:
 *                       type: number
 *           example:
 *             categories:
 *               - name: "Laptops"
 *                 description: "Portable computers"
 *                 parent: "60d21b4667d0d8992e610c85"
 *               - name: "Tablets"
 *                 description: "Tablet computers"
 *                 parent: "60d21b4667d0d8992e610c85"
 *     responses:
 *       201:
 *         description: Categories created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 messageVi:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     created:
 *                       type: number
 *                     failed:
 *                       type: number
 *                     results:
 *                       type: array
 *                       items:
 *                         oneOf:
 *                           - $ref: '#/components/schemas/Category'
 *                           - type: object
 *                             properties:
 *                               error:
 *                                 type: string
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */

/**
 * @swagger
 * /api/v1/categories/{id}:
 *   put:
 *     summary: Update category
 *     description: Update an existing category (Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *         example: "60d21b4667d0d8992e610c85"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 100
 *               description:
 *                 type: string
 *                 maxLength: 1000
 *               slug:
 *                 type: string
 *                 maxLength: 100
 *               image:
 *                 type: string
 *               icon:
 *                 type: string
 *               parent:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *               sortOrder:
 *                 type: number
 *               seoTitle:
 *                 type: string
 *               seoDescription:
 *                 type: string
 *               seoKeywords:
 *                 type: array
 *                 items:
 *                   type: string
 *           example:
 *             name: "Updated Category Name"
 *             description: "Updated description"
 *             isActive: true
 *     responses:
 *       200:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryResponse'
 *       400:
 *         description: Invalid input data or circular reference detected
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Category not found
 *       409:
 *         description: Category name or slug conflict
 * 
 *   delete:
 *     summary: Delete category
 *     description: Delete a category (Admin only). Cannot delete if it has children or products.
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *         example: "60d21b4667d0d8992e610c85"
 *       - in: query
 *         name: force
 *         schema:
 *           type: boolean
 *         description: Force delete (moves products to parent category)
 *         example: false
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 messageVi:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     deletedCategory:
 *                       $ref: '#/components/schemas/Category'
 *                     movedProducts:
 *                       type: number
 *       400:
 *         description: Cannot delete category with children or products
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Category not found
 */

/**
 * @swagger
 * /api/v1/categories/reorder:
 *   patch:
 *     summary: Reorder categories
 *     description: Update sort order for multiple categories (Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - updates
 *             properties:
 *               updates:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - id
 *                     - sortOrder
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: Category ID
 *                     sortOrder:
 *                       type: number
 *                       minimum: 0
 *                       description: New sort order
 *           example:
 *             updates:
 *               - id: "60d21b4667d0d8992e610c85"
 *                 sortOrder: 1
 *               - id: "60d21b4667d0d8992e610c86"
 *                 sortOrder: 2
 *     responses:
 *       200:
 *         description: Categories reordered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 messageVi:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     updated:
 *                       type: number
 *                     failed:
 *                       type: number
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */

// Analytics endpoints

/**
 * @swagger
 * /api/v1/categories/with-product-count:
 *   get:
 *     summary: Get categories with product count
 *     description: Retrieve categories with their product counts (Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *         example: true
 *       - in: query
 *         name: includeEmpty
 *         schema:
 *           type: boolean
 *           default: true
 *         description: Include categories with zero products
 *         example: false
 *     responses:
 *       200:
 *         description: Categories with product count retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 messageVi:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     allOf:
 *                       - $ref: '#/components/schemas/Category'
 *                       - type: object
 *                         properties:
 *                           productCount:
 *                             type: number
 *                           activeProductCount:
 *                             type: number
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */

/**
 * @swagger
 * /api/v1/categories/validate-hierarchy:
 *   get:
 *     summary: Validate category hierarchy
 *     description: Check for hierarchy issues like circular references (Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Hierarchy validation completed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 messageVi:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     isValid:
 *                       type: boolean
 *                     issues:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           type:
 *                             type: string
 *                             enum: [circular_reference, orphaned_category, invalid_parent]
 *                           categoryId:
 *                             type: string
 *                           description:
 *                             type: string
 *                     stats:
 *                       type: object
 *                       properties:
 *                         totalCategories:
 *                           type: number
 *                         rootCategories:
 *                           type: number
 *                         maxDepth:
 *                           type: number
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */

/**
 * @swagger
 * /api/v1/categories/{id}/analytics:
 *   get:
 *     summary: Get category analytics
 *     description: Get detailed analytics for a specific category (Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *         example: "60d21b4667d0d8992e610c85"
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [week, month, quarter, year]
 *           default: month
 *         description: Analysis period
 *         example: "month"
 *       - in: query
 *         name: includeSubcategories
 *         schema:
 *           type: boolean
 *           default: true
 *         description: Include subcategories in analytics
 *         example: true
 *     responses:
 *       200:
 *         description: Category analytics retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 messageVi:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     category:
 *                       $ref: '#/components/schemas/Category'
 *                     analytics:
 *                       type: object
 *                       properties:
 *                         productCount:
 *                           type: number
 *                         activeProductCount:
 *                           type: number
 *                         totalSales:
 *                           type: number
 *                         totalRevenue:
 *                           type: number
 *                         averageProductPrice:
 *                           type: number
 *                         topSellingProducts:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               productId:
 *                                 type: string
 *                               name:
 *                                 type: string
 *                               sales:
 *                                 type: number
 *                         subcategories:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               categoryId:
 *                                 type: string
 *                               name:
 *                                 type: string
 *                               productCount:
 *                                 type: number
 *                               sales:
 *                                 type: number
 *                         performance:
 *                           type: object
 *                           properties:
 *                             rank:
 *                               type: number
 *                             percentile:
 *                               type: number
 *                             trend:
 *                               type: string
 *                               enum: [increasing, stable, decreasing]
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Category not found
 */