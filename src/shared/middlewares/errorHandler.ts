import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { ApiResponse, ErrorMessages, Messages } from '../utils/responseHelper';

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

  const status = err.statusCode || 500;
  let messageEn = err.message;
  let messageVi = err.message;

  // Get bilingual messages for known errors
  if (ErrorMessages[err.message as keyof typeof ErrorMessages]) {
    const errorMsg = ErrorMessages[err.message as keyof typeof ErrorMessages];
    messageEn = errorMsg.en;
    messageVi = errorMsg.vi;
  } else {
    // Handle different error types
    if (err.name === 'ValidationError') {
      messageEn = Messages.COMMON.INPUT_VALIDATION_ERROR.en;
      messageVi = Messages.COMMON.INPUT_VALIDATION_ERROR.vi;
    } else if (err.name === 'MongoServerError' && err.code === 11000) {
      messageEn = Messages.COMMON.DUPLICATE_ENTRY.en;
      messageVi = Messages.COMMON.DUPLICATE_ENTRY.vi;
    } else if (!err.isOperational) {
      messageEn = Messages.COMMON.INTERNAL_ERROR.en;
      messageVi = Messages.COMMON.INTERNAL_ERROR.vi;
    }
  }

  // Create standardized error response
  const errorResponse: ApiResponse = {
    success: false,
    message: messageEn,
    messageVi: messageVi,
    timestamp: new Date().toISOString()
  };

  // Add additional info for development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.error = err.name || 'UnknownError';
    
    // Only add stack trace for internal server errors for security
    if (status === 500 && !err.isOperational) {
      errorResponse.path = req.path;
    }
  }

  res.status(status).json(errorResponse);
};