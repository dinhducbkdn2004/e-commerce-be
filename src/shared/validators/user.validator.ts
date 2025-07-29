import Joi from 'joi';

// Base user validation
export const createUserSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(100).required(),
    role: Joi.string().valid('user', 'admin').default('user'),
    phoneNumber: Joi.string().pattern(/^[0-9+]+$/).min(10).max(15),
    avatar: Joi.string().uri()
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

export const updateUserSchema = Joi.object({
    name: Joi.string().min(2).max(100),
    email: Joi.string().email(),
    password: Joi.string().min(8).max(100),
    phoneNumber: Joi.string().pattern(/^[0-9+]+$/).min(10).max(15),
    avatar: Joi.string().uri()
}).min(1);

// Address validation
export const addressSchema = Joi.object({
    fullName: Joi.string().min(2).max(100).required(),
    phone: Joi.string().pattern(/^[0-9+]+$/).min(10).max(15).required(),
    street: Joi.string().required(),
    ward: Joi.string().required(),
    district: Joi.string().required(),
    city: Joi.string().required(),
    isDefault: Joi.boolean().default(false)
});

export const updateAddressSchema = Joi.object({
    addressId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
    address: addressSchema.required()
});

// Cart validation
export const cartItemSchema = Joi.object({
    productId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    quantity: Joi.number().integer().min(1).required(),
    selectedSize: Joi.string(),
    selectedColor: Joi.string()
});

export const updateCartSchema = cartItemSchema;

// Password reset validation
export const passwordResetRequestSchema = Joi.object({
    email: Joi.string().email().required()
});

export const passwordResetConfirmSchema = Joi.object({
    email: Joi.string().email().required(),
    token: Joi.string().required(),
    newPassword: Joi.string().min(8).max(100).required()
});

// Email verification
export const emailVerificationSchema = Joi.object({
    token: Joi.string().required()
});

// Token validation
export const refreshTokenSchema = Joi.object({
    refreshToken: Joi.string().required().messages({
        'string.empty': 'Refresh token is required',
        'any.required': 'Refresh token is required'
    })
});

export const revokeTokenSchema = Joi.object({
    refreshToken: Joi.string().required().messages({
        'string.empty': 'Refresh token is required',
        'any.required': 'Refresh token is required'
    })
});

// Google authentication
export const googleAuthSchema = Joi.object({
    idToken: Joi.string().required(),
    user: Joi.object({
        uid: Joi.string().required(),
        email: Joi.string().email().required(),
        displayName: Joi.string().allow(null),
        photoURL: Joi.string().uri().allow(null),
        emailVerified: Joi.boolean().default(false)
    }).required()
});