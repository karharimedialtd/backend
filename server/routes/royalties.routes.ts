import { Router } from 'express';
import { RoyaltiesController } from '../controllers/royalties.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { requireUser, requireAdmin } from '../middlewares/role.middleware.js';
import { validateParams } from '../utils/validator.js';
import { z } from 'zod';

const router = Router();

// All routes require authentication
router.use(authenticate);

// User royalty routes
router.get('/', requireUser, RoyaltiesController.getUserRoyalties);
router.get('/summary', requireUser, RoyaltiesController.getEarningsSummary);
router.get('/balance', requireUser, RoyaltiesController.getAvailableBalance);
router.get('/track/:trackId', requireUser, validateParams(z.object({ trackId: z.string().uuid() })), RoyaltiesController.getTrackRoyalties);

// Admin routes
router.post('/admin/create', requireAdmin, RoyaltiesController.createRoyalty);
router.get('/admin/all', requireAdmin, RoyaltiesController.getAllRoyalties);

export default router;
