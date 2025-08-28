/**
 * @swagger
 * components:
 *   schemas:
 *     LoyaltyTransaction:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         type:
 *           type: string
 *           enum: [earn, redeem, expire, adjustment]
 *         points:
 *           type: number
 *         description:
 *           type: string
 *         orderId:
 *           type: string
 *         expiresAt:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *     LoyaltyStats:
 *       type: object
 *       properties:
 *         totalPoints:
 *           type: number
 *         totalEarned:
 *           type: number
 *         totalRedeemed:
 *           type: number
 *         expiringPoints:
 *           type: number
 *         expiringDate:
 *           type: string
 *           format: date-time
 *         tierStatus:
 *           type: string
 *           enum: [Bronze, Silver, Gold, Platinum]
 *         nextTierPoints:
 *           type: number
 *     RedeemPointsRequest:
 *       type: object
 *       required:
 *         - points
 *       properties:
 *         points:
 *           type: integer
 *           minimum: 100
 *         orderId:
 *           type: string
 *         description:
 *           type: string
 *           maxLength: 200
 */

/**
 * @swagger
 * /api/v1/loyalty/stats:
 *   get:
 *     summary: Get user's loyalty stats
 *     tags: [Loyalty]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Loyalty stats retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/LoyaltyStats'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

/**
 * @swagger
 * /api/v1/loyalty/history:
 *   get:
 *     summary: Get user's loyalty transaction history
 *     tags: [Loyalty]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [earn, redeem, expire, adjustment]
 *         description: Filter by transaction type
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
 *           default: 20
 *         description: Number of items per page
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Start date filter
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: End date filter
 *     responses:
 *       200:
 *         description: Loyalty history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         transactions:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/LoyaltyTransaction'
 *                         pagination:
 *                           $ref: '#/components/schemas/Pagination'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

/**
 * @swagger
 * /api/v1/loyalty/expiring:
 *   get:
 *     summary: Get points expiring soon
 *     tags: [Loyalty]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 365
 *           default: 30
 *         description: Number of days to check for expiration
 *     responses:
 *       200:
 *         description: Expiring points retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         points:
 *                           type: number
 *                         transactions:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/LoyaltyTransaction'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

/**
 * @swagger
 * /api/v1/loyalty/earning-rules:
 *   get:
 *     summary: Get points earning rules
 *     tags: [Loyalty]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Earning rules retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         pointsPerVND:
 *                           type: number
 *                         pointsPerDollar:
 *                           type: number
 *                         expiryMonths:
 *                           type: integer
 *                         bonusRules:
 *                           type: array
 *                           items:
 *                             type: object
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

/**
 * @swagger
 * /api/v1/loyalty/redemption-options:
 *   get:
 *     summary: Get points redemption options
 *     tags: [Loyalty]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Redemption options retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

/**
 * @swagger
 * /api/v1/loyalty/redeem:
 *   post:
 *     summary: Redeem loyalty points
 *     tags: [Loyalty]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RedeemPointsRequest'
 *     responses:
 *       200:
 *         description: Points redeemed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Insufficient points or invalid redemption
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

/**
 * @swagger
 * /api/v1/loyalty/admin/award:
 *   post:
 *     summary: Award points to a user (Admin only)
 *     tags: [Loyalty]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - points
 *               - description
 *             properties:
 *               userId:
 *                 type: string
 *               points:
 *                 type: integer
 *                 minimum: 1
 *               description:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 200
 *               expiresAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Points awarded successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/LoyaltyTransaction'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */

/**
 * @swagger
 * /api/v1/loyalty/admin/analytics:
 *   get:
 *     summary: Get loyalty program analytics (Admin only)
 *     tags: [Loyalty]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Start date filter
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: End date filter
 *     responses:
 *       200:
 *         description: Loyalty analytics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
