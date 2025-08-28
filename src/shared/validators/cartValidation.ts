import { body, param } from 'express-validator';

export const cartValidation = {
  addToCart: [
    body('productId')
      .isMongoId()
      .withMessage('Product ID must be a valid MongoDB ObjectId'),
    body('quantity')
      .isInt({ min: 1, max: 99 })
      .withMessage('Quantity must be a number between 1 and 99'),
    body('selectedSize')
      .optional()
      .isString()
      .isLength({ min: 1, max: 20 })
      .withMessage('Selected size must be a string with max 20 characters'),
    body('selectedColor')
      .optional()
      .isString()
      .isLength({ min: 1, max: 20 })
      .withMessage('Selected color must be a string with max 20 characters')
  ],

  updateCartItem: [
    param('itemId')
      .isMongoId()
      .withMessage('Item ID must be a valid MongoDB ObjectId'),
    body('quantity')
      .optional()
      .isInt({ min: 1, max: 99 })
      .withMessage('Quantity must be a number between 1 and 99'),
    body('selectedSize')
      .optional()
      .isString()
      .isLength({ min: 1, max: 20 })
      .withMessage('Selected size must be a string with max 20 characters'),
    body('selectedColor')
      .optional()
      .isString()
      .isLength({ min: 1, max: 20 })
      .withMessage('Selected color must be a string with max 20 characters')
  ],

  removeFromCart: [
    param('itemId')
      .isMongoId()
      .withMessage('Item ID must be a valid MongoDB ObjectId')
  ]
};
