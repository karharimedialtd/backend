import { Router } from 'express';
import { AIController } from '../controllers/ai.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { requireUser } from '../middlewares/role.middleware.js';
import { validate } from '../utils/validator.js';
import { uploadConfigs } from '../utils/uploader.js';
import { z } from 'zod';

const router = Router();

// All routes require authentication and user role
router.use(authenticate, requireUser);

// AI metadata generation
router.post('/generate-metadata', uploadConfigs.audio, validate(z.object({
  prompt: z.string().min(10, 'Prompt must be at least 10 characters')
})), AIController.generateMetadata);

// Cover art prompt generation
router.post('/generate-cover-prompt', validate(z.object({
  title: z.string().optional(),
  artist: z.string().optional(),
  genre: z.string().optional(),
  mood: z.string().optional()
})), AIController.generateCoverArtPrompt);

// Revenue forecasting
router.post('/forecast-revenue', validate(z.object({
  genre: z.string().optional(),
  duration: z.number().optional(),
  mood: z.string().optional(),
  tags: z.array(z.string()).optional()
})), AIController.forecastRevenue);

// Upload timing suggestions
router.post('/suggest-upload-time', validate(z.object({
  genre: z.string().optional(),
  target_audience: z.string().optional()
})), AIController.suggestUploadTime);

export default router;
