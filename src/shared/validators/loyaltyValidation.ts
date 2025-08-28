import { body, query } from 'express-validator';

export const loyaltyValidation = {
  redeemPoints: [
    body('points')
      .isInt({ min: 1 })
      .withMessage('Points must be a positive integer'),
    
    body('orderId')
      .optional()
      .isMongoId()
      .withMessage('Order ID must be a valid MongoDB ObjectId'),
    
    body('description')
      .optional()
      .isString()
      .isLength({ max: 200 })
      .withMessage('Description must be less than 200 characters')
  ],

  awardPoints: [
    body('userId')
      .isMongoId()
      .withMessage('User ID must be a valid MongoDB ObjectId'),
    
    body('points')
      .isInt({ min: 1 })
      .withMessage('Points must be a positive integer'),
    
    body('description')
      .isString()
      .isLength({ min: 5, max: 200 })
      .withMessage('Description must be between 5 and 200 characters'),
    
    body('expiresAt')
      .optional()
      .isISO8601()
      .withMessage('Expiry date must be a valid date')
  ],

  getLoyaltyHistory: [
    query('type')
      .optional()
      .isIn(['earn', 'redeem', 'expire', 'adjustment'])
      .withMessage('Invalid transaction type'),
    
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    
    query('startDate')
      .optional()
      .isISO8601()
      .withMessage('Start date must be a valid date'),
    
    query('endDate')
      .optional()
      .isISO8601()
      .withMessage('End date must be a valid date')
  ],

  getExpiringPoints: [
    query('days')
      .optional()
      .isInt({ min: 1, max: 365 })
      .withMessage('Days must be between 1 and 365')
  ]
};
