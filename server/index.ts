import app from './app.js';
import { env } from './config/env.js';
import { testConnection } from './config/supabase.js';
import { logger } from './utils/logger.js';

async function startServer() {
  try {
    // Test Supabase connection
    await testConnection();
    
    // Start server
    app.listen(env.PORT, '0.0.0.0', () => {
      logger.info(`🚀 Server running on port ${env.PORT}`);
      logger.info(`📡 Environment: ${env.NODE_ENV}`);
      logger.info(`🔗 Frontend URLs: https://cmssingleaudio.com, https://singleaudiodelivery.com`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

startServer();
