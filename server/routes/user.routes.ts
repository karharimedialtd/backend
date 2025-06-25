import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../utils/validator.js';
import { z } from 'zod';

const router = Router();

// All user routes require authentication
router.use(authenticate);

// Profile management
router.get('/profile', UserController.getProfile);
router.put('/profile', validate(z.object({
  full_name: z.string().optional(),
  phone: z.string().optional(),
  bio: z.string().optional()
})), UserController.updateProfile);

// Dashboard
router.get('/dashboard', UserController.getDashboard);
router.get('/earnings', UserController.getEarnings);
router.get('/activity', UserController.getActivity);
router.get('/statistics', UserController.getStatistics);

export default router;
