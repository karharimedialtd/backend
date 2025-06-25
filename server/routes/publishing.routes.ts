import { Router } from 'express';
import { PublishingController } from '../controllers/publishing.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { requireUser, requireAdmin } from '../middlewares/role.middleware.js';
import { validate, validateParams } from '../utils/validator.js';
import { schemas } from '../utils/validator.js';
import { z } from 'zod';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Publishing identity management
router.get('/identities', requireUser, PublishingController.getPublishingIdentities);
router.post('/identities', requireUser, validate(schemas.publishingIdentity), PublishingController.createPublishingIdentity);
router.get('/identities/:id', requireUser, validateParams(z.object({ id: z.string().uuid() })), PublishingController.getPublishingIdentityById);
router.put('/identities/:id', requireUser, validateParams(z.object({ id: z.string().uuid() })), PublishingController.updatePublishingIdentity);

// Composition management
router.get('/compositions', requireUser, PublishingController.getCompositions);
router.post('/compositions', requireUser, validate(schemas.composition), PublishingController.createComposition);
router.put('/compositions/:id', requireUser, validateParams(z.object({ id: z.string().uuid() })), PublishingController.updateComposition);
router.delete('/compositions/:id', requireUser, validateParams(z.object({ id: z.string().uuid() })), PublishingController.deleteComposition);

// Statistics
router.get('/stats', requireUser, PublishingController.getPublishingStats);

// Admin routes
router.get('/admin/identities', requireAdmin, PublishingController.getAllIdentities);
router.post('/admin/identities/:id/approve', requireAdmin, validateParams(z.object({ id: z.string().uuid() })), PublishingController.approveIdentity);
router.post('/admin/identities/:id/reject', requireAdmin, validateParams(z.object({ id: z.string().uuid() })), validate(z.object({
  reason: z.string().optional()
})), PublishingController.rejectIdentity);

export default router;
