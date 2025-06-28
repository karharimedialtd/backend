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
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let status = err.status || 'error';

  // Handle known error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation error';
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

  // Log the error
  logger.error(`${req.method} ${req.originalUrl} - ${statusCode}`, {
    message,
    stack: err.stack,
    user: req.user?.id || 'Unauthenticated',
    body: req.body,
    query: req.query,
    params: req.params
  });

  const errorResponse: any = {
    success: false,
    error: status,
    message
  };

  // Include stack in development
  if (env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }

  if (req.headers['x-request-id']) {
    errorResponse.requestId = req.headers['x-request-id'];
  }

  res.status(statusCode).json(errorResponse);
};

// Async error wrapper
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// 404 handler
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${req.originalUrl}`) as AppError;
  error.statusCode = 404;
  next(error);
};
