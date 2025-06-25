import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { requireAdmin } from '../middlewares/role.middleware.js';
import { validate, validateParams } from '../utils/validator.js';
import { z } from 'zod';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticate, requireAdmin);

// Dashboard and analytics
router.get('/dashboard', AdminController.getDashboard);
router.get('/stats', AdminController.getStats);
router.get('/analytics', AdminController.getAnalytics);
router.get('/recent-activity', AdminController.getRecentActivity);

// User management
router.get('/users', AdminController.getUsers);
router.get('/users/:id', validateParams(z.object({ id: z.string().uuid() })), AdminController.getUserById);
router.put('/users/:id', validateParams(z.object({ id: z.string().uuid() })), AdminController.updateUser);
router.delete('/users/:id', validateParams(z.object({ id: z.string().uuid() })), AdminController.deleteUser);
router.post('/users/:id/assign-role', validateParams(z.object({ id: z.string().uuid() })), validate(z.object({
  role: z.enum(['admin', 'user'])
})), AdminController.assignRole);

// Access request management
router.get('/access-requests', AdminController.getAccessRequests);
router.post('/access-requests/:id/approve', validateParams(z.object({ id: z.string().uuid() })), AdminController.approveAccessRequest);
router.post('/access-requests/:id/reject', validateParams(z.object({ id: z.string().uuid() })), validate(z.object({
  reason: z.string().optional()
})), AdminController.rejectAccessRequest);

export default router;
