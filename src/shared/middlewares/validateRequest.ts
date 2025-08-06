import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { AppError } from './errorHandler';
import { logger } from '../utils/logger';

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error, value } = schema.validate(req.body, {
        abortEarly: false, // Include all errors
        allowUnknown: false, // Don't allow unknown fields
        stripUnknown: true // Remove unknown fields
      });

      if (error) {
        const errorMessage = error.details
          .map(detail => detail.message)
          .join('; ');

        const validationErrors = error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message,
          value: detail.context?.value
        }));

        logger.warn('Request validation failed', {
          route: req.originalUrl,
          method: req.method,
          errors: validationErrors,
          body: req.body
        });

        throw new AppError(errorMessage, 400, validationErrors);
      }

      // Replace req.body with validated and sanitized data
      req.body = value;
      next();
    } catch (error) {
      next(error);
    }
  };
};

// Validate query parameters
export const validateQuery = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error, value } = schema.validate(req.query, {
        abortEarly: false,
        allowUnknown: false,
        stripUnknown: true
      });

      if (error) {
        const errorMessage = error.details
          .map(detail => detail.message)
          .join('; ');

        const validationErrors = error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message,
          value: detail.context?.value
        }));

        logger.warn('Query validation failed', {
          route: req.originalUrl,
          method: req.method,
          errors: validationErrors,
          query: req.query
        });

        throw new AppError(errorMessage, 400, validationErrors);
      }

      req.query = value;
      next();
    } catch (error) {
      next(error);
    }
  };
};

// Validate URL parameters
export const validateParams = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error, value } = schema.validate(req.params, {
        abortEarly: false,
        allowUnknown: false,
        stripUnknown: true
      });

      if (error) {
        const errorMessage = error.details
          .map(detail => detail.message)
          .join('; ');

        const validationErrors = error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message,
          value: detail.context?.value
        }));

        logger.warn('Params validation failed', {
          route: req.originalUrl,
          method: req.method,
          errors: validationErrors,
          params: req.params
        });

        throw new AppError(errorMessage, 400, validationErrors);
      }

      req.params = value;
      next();
    } catch (error) {
      next(error);
    }
  };
};

// Validate multiple parts of request
export const validateAll = (schemas: {
  body?: Joi.ObjectSchema;
  query?: Joi.ObjectSchema;
  params?: Joi.ObjectSchema;
}) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors: any[] = [];

      // Validate body
      if (schemas.body) {
        const { error, value } = schemas.body.validate(req.body, {
          abortEarly: false,
          allowUnknown: false,
          stripUnknown: true
        });

        if (error) {
          errors.push(...error.details.map(detail => ({
            type: 'body',
            field: detail.path.join('.'),
            message: detail.message,
            value: detail.context?.value
          })));
        } else {
          req.body = value;
        }
      }

      // Validate query
      if (schemas.query) {
        const { error, value } = schemas.query.validate(req.query, {
          abortEarly: false,
          allowUnknown: false,
          stripUnknown: true
        });

        if (error) {
          errors.push(...error.details.map(detail => ({
            type: 'query',
            field: detail.path.join('.'),
            message: detail.message,
            value: detail.context?.value
          })));
        } else {
          req.query = value;
        }
      }

      // Validate params
      if (schemas.params) {
        const { error, value } = schemas.params.validate(req.params, {
          abortEarly: false,
          allowUnknown: false,
          stripUnknown: true
        });

        if (error) {
          errors.push(...error.details.map(detail => ({
            type: 'params',
            field: detail.path.join('.'),
            message: detail.message,
            value: detail.context?.value
          })));
        } else {
          req.params = value;
        }
      }

      if (errors.length > 0) {
        const errorMessage = errors
          .map(err => `${err.type}.${err.field}: ${err.message}`)
          .join('; ');

        logger.warn('Request validation failed', {
          route: req.originalUrl,
          method: req.method,
          errors
        });

        throw new AppError(errorMessage, 400, errors);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};