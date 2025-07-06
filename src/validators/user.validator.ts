import Joi from 'joi';

export const createUserSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(6).max(100).required(),
    role: Joi.string().valid('user', 'admin').default('user')
});

export const loginSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
});