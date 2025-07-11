import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public isOperational: boolean = true
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log error với đầy đủ thông tin
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    timestamp: new Date().toISOString(),
    statusCode: err.statusCode || 500
  });

  // Handle different error types
  if (err.name === 'ValidationError') {
    res.status(400).json({
      status: 'error',
      message: 'Validation Error',
      details: err.details
    });
    return;
  }

  if (err.name === 'MongoServerError' && err.code === 11000) {
    res.status(409).json({
      status: 'error',
      message: 'Duplicate entry',
      field: Object.keys(err.keyValue)[0]
    });
    return;
  }

  const status = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Internal Server Error';

  // Response structure
  const errorResponse: any = {
    status: 'error',
    message
  };

  // Chỉ thêm stack trace trong development và chỉ cho internal server errors
  // Không show stack cho authentication/authorization errors vì lý do security
  if (process.env.NODE_ENV === 'development' && 
      status === 500 && 
      !err.isOperational) {
    errorResponse.stack = err.stack;
  }

  // Thêm error code cho development để dễ debug
  if (process.env.NODE_ENV === 'development') {
    errorResponse.errorCode = err.name || 'UnknownError';
  }

  res.status(status).json(errorResponse);
};