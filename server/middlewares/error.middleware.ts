import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';
import { env } from '../config/env.js';

export interface AppError extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
}

export const errorMiddleware = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Default error values
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let status = err.status || 'error';

  // Log error
  logger.error(`${req.method} ${req.path} - ${statusCode}`, {
    error: message,
    stack: err.stack,
    user: req.user?.id,
    body: req.body,
    query: req.query,
    params: req.params
  });

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid data format';
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  } else if (err.message?.includes('duplicate key')) {
    statusCode = 409;
    message = 'Resource already exists';
  } else if (err.message?.includes('foreign key')) {
    statusCode = 400;
    message = 'Invalid reference to related resource';
  }

  // Send error response
  const errorResponse: any = {
    success: false,
    error: status,
    message
  };

  // Include stack trace in development
  if (env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }

  // Include request ID if available
  if (req.headers['x-request-id']) {
    errorResponse.requestId = req.headers['x-request-id'];
  }

  res.status(statusCode).json(errorResponse);
};

// Async error handler wrapper
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Not found middleware
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not found - ${req.originalUrl}`) as AppError;
  error.statusCode = 404;
  next(error);
};
