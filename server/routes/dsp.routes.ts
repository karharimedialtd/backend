import { Router } from 'express';
import { DSPController } from '../controllers/dsp.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { requireUser, requireAdmin } from '../middlewares/role.middleware.js';
import { validate, validateParams } from '../utils/validator.js';
import { z } from 'zod';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Public DSP information
router.get('/status', requireUser, DSPController.getDSPStatus);
router.get('/available', requireUser, DSPController.getAvailableDSPs);
router.get('/stats', requireUser, DSPController.getDSPStats);

// Admin DSP management
router.get('/admin/all', requireAdmin, DSPController.getAllDSPs);
router.post('/admin/create', requireAdmin, validate(z.object({
  name: z.string().min(1),
  status: z.enum(['active', 'maintenance', 'disabled'])
})), DSPController.createDSP);
router.put('/admin/:id/status', requireAdmin, validateParams(z.object({ id: z.string().uuid() })), validate(z.object({
  status: z.enum(['active', 'maintenance', 'disabled']),
  error_message: z.string().optional()
})), DSPController.updateDSPStatus);
router.post('/admin/initialize', requireAdmin, DSPController.initializeDSPs);

export default router;
