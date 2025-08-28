import { body, param, query } from 'express-validator';

export const orderValidation = {
  createOrder: [
    body('items')
      .isArray({ min: 1 })
      .withMessage('Order must contain at least one item'),
    
    body('items.*.productId')
      .isMongoId()
      .withMessage('Product ID must be a valid MongoDB ObjectId'),
    
    body('items.*.name')
      .isString()
      .isLength({ min: 1, max: 200 })
      .withMessage('Product name is required and must be less than 200 characters'),
    
    body('items.*.price')
      .isFloat({ min: 0 })
      .withMessage('Product price must be a positive number'),
    
    body('items.*.quantity')
      .isInt({ min: 1, max: 99 })
      .withMessage('Product quantity must be between 1 and 99'),
    
    body('items.*.selectedSize')
      .optional()
      .isString()
      .isLength({ max: 20 })
      .withMessage('Selected size must be a string with max 20 characters'),
    
    body('items.*.selectedColor')
      .optional()
      .isString()
      .isLength({ max: 20 })
      .withMessage('Selected color must be a string with max 20 characters'),
    
    body('shippingAddress.fullName')
      .isString()
      .isLength({ min: 2, max: 50 })
      .withMessage('Full name is required and must be between 2 and 50 characters'),
    
    body('shippingAddress.phone')
      .matches(/^(\+84|0)[0-9]{9,10}$/)
      .withMessage('Phone number must be a valid Vietnamese phone number'),
    
    body('shippingAddress.street')
      .isString()
      .isLength({ min: 5, max: 200 })
      .withMessage('Street address is required and must be between 5 and 200 characters'),
    
    body('shippingAddress.ward')
      .isString()
      .isLength({ min: 2, max: 50 })
      .withMessage('Ward is required'),
    
    body('shippingAddress.district')
      .isString()
      .isLength({ min: 2, max: 50 })
      .withMessage('District is required'),
    
    body('shippingAddress.city')
      .isString()
      .isLength({ min: 2, max: 50 })
      .withMessage('City is required'),
    
    body('paymentMethod')
      .isIn(['cod', 'card', 'bank_transfer', 'momo', 'zalopay'])
      .withMessage('Payment method must be one of: cod, card, bank_transfer, momo, zalopay'),
    
    body('notes')
      .optional()
      .isString()
      .isLength({ max: 500 })
      .withMessage('Notes must be less than 500 characters')
  ],

  createOrderFromCart: [
    body('shippingAddress')
      .if(body('useDefaultAddress').not().equals(true))
      .notEmpty()
      .withMessage('Shipping address is required when not using default address'),
    
    body('shippingAddress.fullName')
      .if(body('useDefaultAddress').not().equals(true))
      .isString()
      .isLength({ min: 2, max: 50 })
      .withMessage('Full name is required'),
    
    body('shippingAddress.phone')
      .if(body('useDefaultAddress').not().equals(true))
      .matches(/^(\+84|0)[0-9]{9,10}$/)
      .withMessage('Valid phone number is required'),
    
    body('shippingAddress.street')
      .if(body('useDefaultAddress').not().equals(true))
      .isString()
      .isLength({ min: 5, max: 200 })
      .withMessage('Street address is required'),
    
    body('shippingAddress.ward')
      .if(body('useDefaultAddress').not().equals(true))
      .isString()
      .isLength({ min: 2, max: 50 })
      .withMessage('Ward is required'),
    
    body('shippingAddress.district')
      .if(body('useDefaultAddress').not().equals(true))
      .isString()
      .isLength({ min: 2, max: 50 })
      .withMessage('District is required'),
    
    body('shippingAddress.city')
      .if(body('useDefaultAddress').not().equals(true))
      .isString()
      .isLength({ min: 2, max: 50 })
      .withMessage('City is required'),
    
    body('paymentMethod')
      .isIn(['cod', 'card', 'bank_transfer', 'momo', 'zalopay'])
      .withMessage('Payment method must be one of: cod, card, bank_transfer, momo, zalopay'),
    
    body('useDefaultAddress')
      .optional()
      .isBoolean()
      .withMessage('useDefaultAddress must be a boolean'),
    
    body('notes')
      .optional()
      .isString()
      .isLength({ max: 500 })
      .withMessage('Notes must be less than 500 characters')
  ],

  updateOrderStatus: [
    param('orderId')
      .isMongoId()
      .withMessage('Order ID must be a valid MongoDB ObjectId'),
    
    body('orderStatus')
      .optional()
      .isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'])
      .withMessage('Invalid order status'),
    
    body('paymentStatus')
      .optional()
      .isIn(['pending', 'paid', 'failed', 'refunded'])
      .withMessage('Invalid payment status'),
    
    body('trackingNumber')
      .optional()
      .isString()
      .isLength({ min: 5, max: 50 })
      .withMessage('Tracking number must be between 5 and 50 characters'),
    
    body('estimatedDelivery')
      .optional()
      .isISO8601()
      .withMessage('Estimated delivery must be a valid date'),
    
    body('cancelReason')
      .optional()
      .isString()
      .isLength({ max: 200 })
      .withMessage('Cancel reason must be less than 200 characters'),
    
    body('refundAmount')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Refund amount must be a positive number')
  ],

  cancelOrder: [
    param('orderId')
      .isMongoId()
      .withMessage('Order ID must be a valid MongoDB ObjectId'),
    
    body('cancelReason')
      .optional()
      .isString()
      .isLength({ max: 200 })
      .withMessage('Cancel reason must be less than 200 characters')
  ],

  getOrders: [
    query('status')
      .optional()
      .isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'])
      .withMessage('Invalid order status filter'),
    
    query('paymentStatus')
      .optional()
      .isIn(['pending', 'paid', 'failed', 'refunded'])
      .withMessage('Invalid payment status filter'),
    
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    
    query('limit')
      .optional()
      .isInt({ min: 1, max: 50 })
      .withMessage('Limit must be between 1 and 50'),
    
    query('startDate')
      .optional()
      .isISO8601()
      .withMessage('Start date must be a valid date'),
    
    query('endDate')
      .optional()
      .isISO8601()
      .withMessage('End date must be a valid date')
  ]
};
