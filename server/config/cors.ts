import cors from 'cors';
import { env } from './env.js';

export const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list
    if (env.FRONTEND_URLS.includes(origin)) {
      return callback(null, true);
    }
    
    // For development, allow localhost
    if (env.NODE_ENV === 'development' && origin.includes('localhost')) {
      return callback(null, true);
    }
    
    console.warn(`CORS blocked origin: ${origin}`);
    callback(new Error(`Origin ${origin} not allowed by CORS policy`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'X-Access-Token'
  ],
  optionsSuccessStatus: 200
};
