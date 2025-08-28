import { body, param } from 'express-validator';

export const addressValidation = {
  addAddress: [
    body('fullName')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Full name must be between 2 and 50 characters')
      .matches(/^[a-zA-ZÀ-ỹ\s]+$/)
      .withMessage('Full name must contain only letters and spaces'),
    
    body('phone')
      .trim()
      .matches(/^(\+84|0)[0-9]{9,10}$/)
      .withMessage('Phone number must be a valid Vietnamese phone number'),
    
    body('street')
      .trim()
      .isLength({ min: 5, max: 200 })
      .withMessage('Street address must be between 5 and 200 characters'),
    
    body('ward')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Ward must be between 2 and 50 characters'),
    
    body('district')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('District must be between 2 and 50 characters'),
    
    body('city')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('City must be between 2 and 50 characters'),
    
    body('isDefault')
      .optional()
      .isBoolean()
      .withMessage('isDefault must be a boolean value')
  ],

  updateAddress: [
    param('addressId')
      .isMongoId()
      .withMessage('Address ID must be a valid MongoDB ObjectId'),
    
    body('fullName')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Full name must be between 2 and 50 characters')
      .matches(/^[a-zA-ZÀ-ỹ\s]+$/)
      .withMessage('Full name must contain only letters and spaces'),
    
    body('phone')
      .optional()
      .trim()
      .matches(/^(\+84|0)[0-9]{9,10}$/)
      .withMessage('Phone number must be a valid Vietnamese phone number'),
    
    body('street')
      .optional()
      .trim()
      .isLength({ min: 5, max: 200 })
      .withMessage('Street address must be between 5 and 200 characters'),
    
    body('ward')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Ward must be between 2 and 50 characters'),
    
    body('district')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('District must be between 2 and 50 characters'),
    
    body('city')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('City must be between 2 and 50 characters'),
    
    body('isDefault')
      .optional()
      .isBoolean()
      .withMessage('isDefault must be a boolean value')
  ],

  deleteAddress: [
    param('addressId')
      .isMongoId()
      .withMessage('Address ID must be a valid MongoDB ObjectId')
  ]
};
