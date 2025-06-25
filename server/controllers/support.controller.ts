import { Request, Response } from 'express';
import { SupportService } from '../services/support.service.js';
import { asyncHandler } from '../middlewares/error.middleware.js';

export class SupportController {
  // GET /api/support/tickets
  static getUserTickets = asyncHandler(async (req: Request, res: Response) => {
    const tickets = await SupportService.getUserTickets(req.user!.id);

    res.json({
      success: true,
      data: tickets
    });
  });

  // POST /api/support/tickets
  static createTicket = asyncHandler(async (req: Request, res: Response) => {
    const ticket = await SupportService.createTicket(req.user!.id, req.body);

    res.status(201).json({
      success: true,
      data: ticket,
      message: 'Support ticket created successfully'
    });
  });

  // GET /api/support/tickets/:id
  static getTicketById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const ticket = await SupportService.getTicketById(id, req.user!.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        error: 'Support ticket not found'
      });
    }

    res.json({
      success: true,
      data: ticket
    });
  });

  // PUT /api/support/tickets/:id
  static updateTicket = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const ticket = await SupportService.updateTicket(id, req.user!.id, req.body);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        error: 'Support ticket not found'
      });
    }

    res.json({
      success: true,
      data: ticket,
      message: 'Support ticket updated successfully'
    });
  });

  // GET /api/support/tickets/:id/messages
  static getTicketMessages = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const messages = await SupportService.getTicketMessages(id, req.user!.id);

    res.json({
      success: true,
      data: messages
    });
  });

  // POST /api/support/tickets/:id/messages
  static addTicketMessage = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const message = await SupportService.addTicketMessage(id, req.user!.id, req.body);

    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Support ticket not found'
      });
    }

    res.status(201).json({
      success: true,
      data: message,
      message: 'Message added successfully'
    });
  });

  // GET /api/support/admin/tickets
  static getAllTickets = asyncHandler(async (req: Request, res: Response) => {
    const { status, priority, assigned_to } = req.query;
    const tickets = await SupportService.getAllTickets({
      status: status as string,
      priority: priority as string,
      assigned_to: assigned_to as string
    });

    res.json({
      success: true,
      data: tickets
    });
  });

  // POST /api/support/admin/tickets/:id/assign
  static assignTicket = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { assigned_to } = req.body;
    
    const ticket = await SupportService.assignTicket(id, assigned_to);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        error: 'Support ticket not found'
      });
    }

    res.json({
      success: true,
      data: ticket,
      message: 'Ticket assigned successfully'
    });
  });

  // PUT /api/support/admin/tickets/:id/status
  static updateTicketStatus = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    
    const ticket = await SupportService.updateTicketStatus(id, status);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        error: 'Support ticket not found'
      });
    }

    res.json({
      success: true,
      data: ticket,
      message: 'Ticket status updated successfully'
    });
  });

  // GET /api/support/admin/stats
  static getTicketStats = asyncHandler(async (req: Request, res: Response) => {
    const stats = await SupportService.getTicketStats();

    res.json({
      success: true,
      data: stats
    });
  });
}
