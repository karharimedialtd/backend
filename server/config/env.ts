import { config } from 'dotenv';

// Load environment variables
config();

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  
  // Supabase Configuration
  SUPABASE_URL: process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  
  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  
  // Frontend URLs for CORS
  FRONTEND_URLS: [
    'https://cmssingleaudio.com',
    'https://singleaudiodelivery.com',
    ...(process.env.REPLIT_DOMAINS ? process.env.REPLIT_DOMAINS.split(',') : []),
    ...(process.env.NODE_ENV === 'development' ? ['http://localhost:3000', 'http://localhost:5000'] : [])
  ],
  
  // Email Configuration
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  FROM_EMAIL: process.env.FROM_EMAIL || 'noreply@singleaudio.com',
  
  // File Upload Configuration
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '100000000', 10), // 100MB default
  UPLOAD_DIR: process.env.UPLOAD_DIR || 'uploads',
  
  // AI Services
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  
  // DSP API Keys
  YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY || '',
  SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID || '',
  SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET || '',
  TIKTOK_API_KEY: process.env.TIKTOK_API_KEY || '',
  FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID || '',
  FACEBOOK_APP_SECRET: process.env.FACEBOOK_APP_SECRET || '',
} as const;

// Validation
const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY'];

for (const envVar of requiredEnvVars) {
  if (!env[envVar as keyof typeof env]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}
