import { Router } from 'express';
import { PayoutController } from '../controllers/payout.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { requireUser, requireAdmin } from '../middlewares/role.middleware.js';
import { validate, validateParams } from '../utils/validator.js';
import { schemas } from '../utils/validator.js';
import { z } from 'zod';

const router = Router();

// All routes require authentication
router.use(authenticate);

// User payout routes
router.get('/', requireUser, PayoutController.getUserPayouts);
router.post('/request', requireUser, validate(schemas.payoutRequest), PayoutController.requestPayout);
router.get('/:id', requireUser, validateParams(z.object({ id: z.string().uuid() })), PayoutController.getPayoutById);

// Admin payout management
router.get('/admin/all', requireAdmin, PayoutController.getAllPayouts);
router.post('/admin/:id/approve', requireAdmin, validateParams(z.object({ id: z.string().uuid() })), PayoutController.approvePayout);
router.post('/admin/:id/reject', requireAdmin, validateParams(z.object({ id: z.string().uuid() })), validate(z.object({
  reason: z.string().optional()
})), PayoutController.rejectPayout);
router.post('/admin/:id/process', requireAdmin, validateParams(z.object({ id: z.string().uuid() })), PayoutController.processPayout);

export default router;
