import { User } from './supabase.types.js';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export {};
