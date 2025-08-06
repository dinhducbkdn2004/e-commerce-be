/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - price
 *         - category
 *         - images
 *         - stock
 *       properties:
 *         id:
 *           type: string
 *           description: Product ID
 *         name:
 *           type: string
 *           description: Product name
 *           maxLength: 200
 *         description:
 *           type: string
 *           description: Product description
 *           maxLength: 5000
 *         shortDescription:
 *           type: string
 *           description: Short product description
 *           maxLength: 500
 *         price:
 *           type: number
 *           description: Product price
 *           minimum: 0
 *         originalPrice:
 *           type: number
 *           description: Original price before discount
 *           minimum: 0
 *         category:
 *           type: string
 *           description: Category ID
 *         brand:
 *           type: string
 *           description: Product brand
 *         sku:
 *           type: string
 *           description: Stock Keeping Unit
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: Product images URLs
 *         thumbnail:
 *           type: string
 *           description: Main product image
 *         variants:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProductVariant'
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Product tags
 *         specifications:
 *           type: object
 *           additionalProperties:
 *             type: string
 *           description: Product specifications
 *         weight:
 *           type: number
 *           description: Product weight in grams
 *         dimensions:
 *           type: object
 *           properties:
 *             length:
 *               type: number
 *             width:
 *               type: number
 *             height:
 *               type: number
 *         stock:
 *           type: number
 *           description: Available stock quantity
 *           minimum: 0
 *         minStock:
 *           type: number
 *           description: Minimum stock threshold
 *           minimum: 0
 *         maxQuantityPerOrder:
 *           type: number
 *           description: Maximum quantity per order
 *         isActive:
 *           type: boolean
 *           description: Whether product is active
 *         isFeatured:
 *           type: boolean
 *           description: Whether product is featured
 *         status:
 *           type: string
 *           enum: [draft, active, inactive, out_of_stock]
 *           description: Product status
 *         ratings:
 *           type: object
 *           properties:
 *             average:
 *               type: number
 *               minimum: 0
 *               maximum: 5
 *             count:
 *               type: number
 *               minimum: 0
 *         reviews:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProductReview'
 *         salesCount:
 *           type: number
 *           description: Number of times sold
 *         viewCount:
 *           type: number
 *           description: Number of views
 *         seoTitle:
 *           type: string
 *           description: SEO title
 *         seoDescription:
 *           type: string
 *           description: SEO description
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 * 
 *     ProductVariant:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         value:
 *           type: string
 *         price:
 *           type: number
 *         stock:
 *           type: number
 *         sku:
 *           type: string
 *         images:
 *           type: array
 *           items:
 *             type: string
 * 
 *     ProductReview:
 *       type: object
 *       properties:
 *         user:
 *           type: string
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         comment:
 *           type: string
 *         helpful:
 *           type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 * 
 *     ProductResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         messageVi:
 *           type: string
 *         data:
 *           $ref: '#/components/schemas/Product'
 *         timestamp:
 *           type: string
 *           format: date-time
 * 
 *     ProductListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         messageVi:
 *           type: string
 *         products:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Product'
 *         total:
 *           type: integer
 *         page:
 *           type: integer
 *         pages:
 *           type: integer
 *         limit:
 *           type: integer
 *         timestamp:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management API endpoints
 */

/**
 * @swagger
 * /api/v1/products:
 *   get:
 *     summary: Get all products with filtering and pagination
 *     description: Retrieve a paginated list of products with optional filtering and sorting capabilities
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category ID
 *         example: "60d21b4667d0d8992e610c85"
 *       - in: query
 *         name: brand
 *         schema:
 *           type: string
 *         description: Filter by brand name
 *         example: "Apple"
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: Minimum price filter
 *         example: 100
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: Maximum price filter
 *         example: 1000
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search query for product name, description, or tags
 *         example: "iPhone"
 *       - in: query
 *         name: tags
 *         schema:
 *           type: string
 *         description: Filter by tags (comma-separated)
 *         example: "smartphone,apple"
 *       - in: query
 *         name: isFeatured
 *         schema:
 *           type: boolean
 *         description: Filter by featured status
 *         example: true
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *         example: true
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, active, inactive, out_of_stock]
 *         description: Filter by product status
 *         example: "active"
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, price, rating, sales, createdAt, updatedAt]
 *         description: Sort field
 *         example: "price"
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order
 *         example: "asc"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 12
 *         description: Items per page
 *         example: 12
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductListResponse'
 *             example:
 *               success: true
 *               message: "Products retrieved successfully"
 *               messageVi: "Lấy danh sách sản phẩm thành công"
 *               products:
 *                 - id: "60d21b4667d0d8992e610c85"
 *                   name: "iPhone 15 Pro"
 *                   price: 999
 *                   brand: "Apple"
 *                   category: "60d21b4667d0d8992e610c86"
 *                   isFeatured: true
 *               total: 150
 *               page: 1
 *               pages: 13
 *               limit: 12
 *       400:
 *         description: Invalid query parameters
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/products/featured:
 *   get:
 *     summary: Get featured products
 *     description: Retrieve a list of featured products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: Number of featured products to return
 *         example: 10
 *     responses:
 *       200:
 *         description: Featured products retrieved successfully
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
 *                     $ref: '#/components/schemas/Product'
 */

/**
 * @swagger
 * /api/v1/products/search:
 *   get:
 *     summary: Search products
 *     description: Search products by name, description, brand, or tags
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 1
 *         description: Search query
 *         example: "iPhone 15"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 12
 *         description: Items per page
 *         example: 12
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductListResponse'
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
 * /api/v1/products/category/{categoryId}:
 *   get:
 *     summary: Get products by category
 *     description: Retrieve products belonging to a specific category
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *         example: "60d21b4667d0d8992e610c85"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 12
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductListResponse'
 *       404:
 *         description: Category not found
 */

/**
 * @swagger
 * /api/v1/products/sku/{sku}:
 *   get:
 *     summary: Get product by SKU
 *     description: Retrieve a product by its SKU (Stock Keeping Unit)
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: sku
 *         required: true
 *         schema:
 *           type: string
 *         description: Product SKU
 *         example: "IPHONE15-PRO-128GB"
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *       404:
 *         description: Product not found
 */

/**
 * @swagger
 * /api/v1/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     description: Retrieve a specific product by its ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *         example: "60d21b4667d0d8992e610c85"
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *       400:
 *         description: Invalid product ID format
 *       404:
 *         description: Product not found
 */

/**
 * @swagger
 * /api/v1/products/{id}/reviews:
 *   post:
 *     summary: Add product review
 *     description: Add a review and rating for a product (requires authentication)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *         example: "60d21b4667d0d8992e610c85"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *               - comment
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Product rating (1-5 stars)
 *                 example: 5
 *               comment:
 *                 type: string
 *                 maxLength: 1000
 *                 description: Review comment
 *                 example: "Great product! Really impressed with the quality and features."
 *           example:
 *             rating: 5
 *             comment: "Great product! Really impressed with the quality and features."
 *     responses:
 *       201:
 *         description: Review added successfully
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
 *                   $ref: '#/components/schemas/ProductReview'
 *       400:
 *         description: Invalid input or user already reviewed this product
 *       401:
 *         description: Unauthorized - Login required
 *       404:
 *         description: Product not found
 */

// Admin-only endpoints

/**
 * @swagger
 * /api/v1/products:
 *   post:
 *     summary: Create new product
 *     description: Create a new product (Admin only)
 *     tags: [Products]
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
 *               - description
 *               - price
 *               - category
 *               - images
 *               - stock
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 200
 *                 example: "iPhone 15 Pro"
 *               description:
 *                 type: string
 *                 maxLength: 5000
 *                 example: "Latest iPhone with advanced features"
 *               shortDescription:
 *                 type: string
 *                 maxLength: 500
 *                 example: "Premium smartphone with titanium design"
 *               price:
 *                 type: number
 *                 minimum: 0
 *                 example: 999
 *               originalPrice:
 *                 type: number
 *                 minimum: 0
 *                 example: 1199
 *               category:
 *                 type: string
 *                 example: "60d21b4667d0d8992e610c85"
 *               brand:
 *                 type: string
 *                 example: "Apple"
 *               sku:
 *                 type: string
 *                 example: "IPHONE15-PRO-128GB"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["https://example.com/iphone1.jpg", "https://example.com/iphone2.jpg"]
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["smartphone", "apple", "premium"]
 *               specifications:
 *                 type: object
 *                 additionalProperties:
 *                   type: string
 *                 example: {"Screen Size": "6.1 inches", "Storage": "128GB"}
 *               stock:
 *                 type: integer
 *                 minimum: 0
 *                 example: 50
 *               minStock:
 *                 type: integer
 *                 minimum: 0
 *                 example: 10
 *               isActive:
 *                 type: boolean
 *                 example: true
 *               isFeatured:
 *                 type: boolean
 *                 example: true
 *               status:
 *                 type: string
 *                 enum: [draft, active, inactive]
 *                 example: "active"
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       409:
 *         description: Product with SKU already exists
 */

/**
 * @swagger
 * /api/v1/products/{id}:
 *   put:
 *     summary: Update product
 *     description: Update an existing product (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *         example: "60d21b4667d0d8992e610c85"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Product not found
 * 
 *   delete:
 *     summary: Delete product
 *     description: Delete a product (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *         example: "60d21b4667d0d8992e610c85"
 *     responses:
 *       200:
 *         description: Product deleted successfully
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
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Product not found
 */

/**
 * @swagger
 * /api/v1/products/{id}/stock:
 *   patch:
 *     summary: Update product stock
 *     description: Update product stock quantity (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *         example: "60d21b4667d0d8992e610c85"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 description: Stock change amount (can be negative for reducing stock)
 *                 example: -5
 *           example:
 *             quantity: -5
 *     responses:
 *       200:
 *         description: Stock updated successfully
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
 *                     previousStock:
 *                       type: number
 *                     newStock:
 *                       type: number
 *                     change:
 *                       type: number
 *       400:
 *         description: Invalid input or insufficient stock
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Product not found
 */

/**
 * @swagger
 * /api/v1/products/bulk-update:
 *   patch:
 *     summary: Bulk update products
 *     description: Update multiple products at once (Admin only)
 *     tags: [Products]
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
 *                     - data
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: Product ID
 *                     data:
 *                       type: object
 *                       description: Fields to update
 *           example:
 *             updates:
 *               - id: "60d21b4667d0d8992e610c85"
 *                 data:
 *                   price: 799
 *                   isFeatured: true
 *               - id: "60d21b4667d0d8992e610c86"
 *                 data:
 *                   stock: 25
 *     responses:
 *       200:
 *         description: Bulk update completed
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
 *                     results:
 *                       type: array
 *                       items:
 *                         type: object
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
 * /api/v1/products/analytics/top-selling:
 *   get:
 *     summary: Get top selling products
 *     description: Retrieve products sorted by sales count (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: Number of products to return
 *         example: 10
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [week, month, quarter, year, all]
 *           default: month
 *         description: Time period for sales analysis
 *         example: "month"
 *     responses:
 *       200:
 *         description: Top selling products retrieved
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
 *                       - $ref: '#/components/schemas/Product'
 *                       - type: object
 *                         properties:
 *                           salesCount:
 *                             type: number
 *                           revenue:
 *                             type: number
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */

/**
 * @swagger
 * /api/v1/products/analytics/low-stock:
 *   get:
 *     summary: Get low stock products
 *     description: Retrieve products with low stock levels (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: threshold
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Stock threshold (uses minStock if not provided)
 *         example: 10
 *     responses:
 *       200:
 *         description: Low stock products retrieved
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
 *                       - $ref: '#/components/schemas/Product'
 *                       - type: object
 *                         properties:
 *                           stockStatus:
 *                             type: string
 *                             enum: [low, critical, out_of_stock]
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */

/**
 * @swagger
 * /api/v1/products/{id}/analytics:
 *   get:
 *     summary: Get product analytics
 *     description: Get detailed analytics for a specific product (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *         example: "60d21b4667d0d8992e610c85"
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [week, month, quarter, year]
 *           default: month
 *         description: Analysis period
 *         example: "month"
 *     responses:
 *       200:
 *         description: Product analytics retrieved
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
 *                     product:
 *                       $ref: '#/components/schemas/Product'
 *                     analytics:
 *                       type: object
 *                       properties:
 *                         views:
 *                           type: number
 *                         sales:
 *                           type: number
 *                         revenue:
 *                           type: number
 *                         averageRating:
 *                           type: number
 *                         reviewCount:
 *                           type: number
 *                         conversionRate:
 *                           type: number
 *                         performance:
 *                           type: string
 *                           enum: [excellent, good, average, poor]
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Product not found
 */