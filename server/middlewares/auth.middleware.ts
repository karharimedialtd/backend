import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractTokenFromHeader } from '../utils/jwt.js';
import { supabase } from '../config/supabase.js';
import { User } from '../types/supabase.types.js';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
        message: 'No token provided'
      });
    }

    // Verify JWT token
    const payload = verifyToken(token);
    
    // Get user from database
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', payload.userId)
      .single();

    if (error || !user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication failed',
        message: 'Invalid token or user not found'
      });
    }

    // Check if user is approved
    if (user.status !== 'approved') {
      return res.status(403).json({
        success: false,
        error: 'Account not approved',
        message: 'Your account is pending approval'
      });
    }

    // Attach user to request
    req.user = user as User;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Authentication failed',
      message: error instanceof Error ? error.message : 'Invalid token'
    });
  }
};

// Optional authentication (for endpoints that work with or without auth)
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    
    if (token) {
      const payload = verifyToken(token);
      
      const { data: user } = await supabase
        .from('users')
        .select('*')
        .eq('id', payload.userId)
        .single();

      if (user && user.status === 'approved') {
        req.user = user as User;
      }
    }
    
    next();
  } catch (error) {
    // Silently continue without authentication
    next();
  }
};
