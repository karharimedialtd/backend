import { Router } from 'express';
import { SupportController } from '../controllers/support.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { requireUser, requireAdmin } from '../middlewares/role.middleware.js';
import { validate, validateParams } from '../utils/validator.js';
import { schemas } from '../utils/validator.js';
import { z } from 'zod';

const router = Router();

// All routes require authentication
router.use(authenticate);

// User ticket management
router.get('/tickets', requireUser, SupportController.getUserTickets);
router.post('/tickets', requireUser, validate(schemas.supportTicket), SupportController.createTicket);
router.get('/tickets/:id', requireUser, validateParams(z.object({ id: z.string().uuid() })), SupportController.getTicketById);
router.put('/tickets/:id', requireUser, validateParams(z.object({ id: z.string().uuid() })), SupportController.updateTicket);

// Ticket messages
router.get('/tickets/:id/messages', requireUser, validateParams(z.object({ id: z.string().uuid() })), SupportController.getTicketMessages);
router.post('/tickets/:id/messages', requireUser, validateParams(z.object({ id: z.string().uuid() })), validate(schemas.ticketMessage), SupportController.addTicketMessage);

// Admin ticket management
router.get('/admin/tickets', requireAdmin, SupportController.getAllTickets);
router.post('/admin/tickets/:id/assign', requireAdmin, validateParams(z.object({ id: z.string().uuid() })), validate(z.object({
  assigned_to: z.string().uuid()
})), SupportController.assignTicket);
router.put('/admin/tickets/:id/status', requireAdmin, validateParams(z.object({ id: z.string().uuid() })), validate(z.object({
  status: z.enum(['open', 'in_progress', 'resolved', 'closed'])
})), SupportController.updateTicketStatus);
router.get('/admin/stats', requireAdmin, SupportController.getTicketStats);

export default router;
