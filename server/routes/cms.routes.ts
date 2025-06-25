import { Router } from 'express';
import { CMSController } from '../controllers/cms.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { requireUser, requireAdmin } from '../middlewares/role.middleware.js';
import { validate, validateParams } from '../utils/validator.js';
import { z } from 'zod';

const router = Router();

// All routes require authentication
router.use(authenticate);

// YouTube channel management
router.get('/youtube/channels', requireUser, CMSController.getYouTubeChannels);
router.post('/youtube/channels', requireUser, validate(z.object({
  channel_id: z.string().min(1),
  channel_name: z.string().min(1),
  access_token: z.string().min(1),
  refresh_token: z.string().min(1),
  expires_at: z.string()
})), CMSController.addYouTubeChannel);
router.get('/youtube/channels/:id', requireUser, validateParams(z.object({ id: z.string().uuid() })), CMSController.getYouTubeChannelById);
router.put('/youtube/channels/:id', requireUser, validateParams(z.object({ id: z.string().uuid() })), CMSController.updateYouTubeChannel);
router.delete('/youtube/channels/:id', requireUser, validateParams(z.object({ id: z.string().uuid() })), CMSController.deleteYouTubeChannel);

// Content ID claims
router.get('/content-id/claims', requireUser, CMSController.getContentIDClaims);
router.post('/content-id/claims', requireUser, validate(z.object({
  channel_id: z.string().uuid(),
  video_id: z.string().min(1),
  claim_id: z.string().min(1),
  asset_id: z.string().min(1),
  policy: z.enum(['monetize', 'track', 'block'])
})), CMSController.createContentIDClaim);
router.put('/content-id/claims/:id', requireUser, validateParams(z.object({ id: z.string().uuid() })), CMSController.updateContentIDClaim);

// Analytics
router.get('/analytics', requireUser, CMSController.getCMSAnalytics);

// Admin routes
router.get('/admin/claims', requireAdmin, CMSController.getAllClaims);

export default router;
