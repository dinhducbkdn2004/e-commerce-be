import {Request, Response, NextFunction} from 'express';
import Joi from 'joi';

export const validate = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const {error} = schema.validate(req.body);
        if (error) {
            res.status(400).json({
                status: 'error',
                message: error.details[0].message,
            });
            return; // Thêm return để đảm bảo function kết thúc ở đây
        }
        next();
    };
};