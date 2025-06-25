import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../types/supabase.types.js';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export const signToken = (user: User): string => {
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    role: user.role
  };
  
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
    issuer: 'single-audio-api',
    audience: 'single-audio-clients'
  });
};

export const verifyToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, env.JWT_SECRET, {
      issuer: 'single-audio-api',
      audience: 'single-audio-clients'
    }) as JWTPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token has expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token');
    } else {
      throw new Error('Token verification failed');
    }
  }
};

export const extractTokenFromHeader = (authHeader?: string): string | null => {
  if (!authHeader) return null;
  
  const [bearer, token] = authHeader.split(' ');
  if (bearer !== 'Bearer' || !token) return null;
  
  return token;
};
