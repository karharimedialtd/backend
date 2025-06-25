import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

// Common validation schemas
export const schemas = {
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  uuid: z.string().uuid('Invalid UUID format'),
  positiveNumber: z.number().positive('Must be a positive number'),
  nonEmptyString: z.string().min(1, 'This field is required'),
  
  // Auth schemas
  login: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required')
  }),
  
  accessRequest: z.object({
    email: z.string().email('Invalid email format'),
    full_name: z.string().min(1, 'Full name is required'),
    reason: z.string().min(10, 'Please provide a detailed reason (minimum 10 characters)')
  }),
  
  // Music schemas
  musicTrack: z.object({
    title: z.string().min(1, 'Title is required'),
    artist: z.string().min(1, 'Artist is required'),
    album: z.string().optional(),
    genre: z.string().optional(),
    release_date: z.string().optional(),
    duration: z.number().positive().optional()
  }),
  
  distribution: z.object({
    track_id: z.string().uuid('Invalid track ID'),
    dsps: z.array(z.string()).min(1, 'At least one DSP must be selected')
  }),
  
  // Payout schemas
  payoutRequest: z.object({
    amount: z.number().positive('Amount must be positive'),
    currency: z.enum(['USD', 'EUR', 'GBP'], { message: 'Invalid currency' }),
    method: z.enum(['paypal', 'wise', 'bank'], { message: 'Invalid payout method' }),
    payment_details: z.record(z.any())
  }),
  
  // Support schemas
  supportTicket: z.object({
    subject: z.string().min(1, 'Subject is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium')
  }),
  
  ticketMessage: z.object({
    message: z.string().min(1, 'Message is required'),
    is_internal: z.boolean().default(false)
  }),
  
  // Publishing schemas
  publishingIdentity: z.object({
    name: z.string().min(1, 'Name is required'),
    ipi_number: z.string().optional(),
    isni_number: z.string().optional()
  }),
  
  composition: z.object({
    title: z.string().min(1, 'Title is required'),
    iswc: z.string().optional(),
    writers: z.record(z.number().min(0).max(100))
  })
};

// Validation middleware factory
export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse(req.body);
      req.body = validated;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));
        
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors
        });
      }
      next(error);
    }
  };
};

// Query parameter validation
export const validateQuery = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse(req.query);
      req.query = validated;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));
        
        return res.status(400).json({
          success: false,
          error: 'Query validation failed',
          details: errors
        });
      }
      next(error);
    }
  };
};

// Parameter validation
export const validateParams = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse(req.params);
      req.params = validated;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));
        
        return res.status(400).json({
          success: false,
          error: 'Parameter validation failed',
          details: errors
        });
      }
      next(error);
    }
  };
};
