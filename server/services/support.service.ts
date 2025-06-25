import { SupportModel } from '../models/support.model.js';
import { mailer } from '../utils/mailer.js';
import { UserModel } from '../models/user.model.js';
import { SupportTicket, TicketMessage } from '../types/supabase.types.js';

export class SupportService {
  // User ticket methods
  static async getUserTickets(userId: string): Promise<SupportTicket[]> {
    return await SupportModel.findTicketsByUser(userId);
  }

  static async createTicket(userId: string, ticketData: any): Promise<SupportTicket | null> {
    const ticket = await SupportModel.createTicket({
      ...ticketData,
      user_id: userId,
      status: 'open'
    });

    if (ticket) {
      // Send confirmation email
      const user = await UserModel.findById(userId);
      if (user) {
        // Send confirmation email to user (optional - no template implemented)
      }
    }

    return ticket;
  }

  static async getTicketById(ticketId: string, userId: string): Promise<SupportTicket | null> {
    const ticket = await SupportModel.findTicketById(ticketId);
    
    if (!ticket || ticket.user_id !== userId) {
      return null;
    }

    return ticket;
  }

  static async updateTicket(
    ticketId: string, 
    userId: string, 
    updates: Partial<SupportTicket>
  ): Promise<SupportTicket | null> {
    const ticket = await SupportModel.findTicketById(ticketId);
    
    if (!ticket || ticket.user_id !== userId) {
      return null;
    }

    return await SupportModel.updateTicket(ticketId, updates);
  }

  // Message methods
  static async getTicketMessages(ticketId: string, userId: string): Promise<TicketMessage[]> {
    const ticket = await SupportModel.findTicketById(ticketId);
    
    if (!ticket || ticket.user_id !== userId) {
      throw new Error('Ticket not found or access denied');
    }

    return await SupportModel.findMessagesByTicket(ticketId);
  }

  static async addTicketMessage(
    ticketId: string, 
    userId: string, 
    messageData: any
  ): Promise<TicketMessage | null> {
    const ticket = await SupportModel.findTicketById(ticketId);
    
    if (!ticket || ticket.user_id !== userId) {
      return null;
    }

    return await SupportModel.createMessage({
      ...messageData,
      ticket_id: ticketId,
      user_id: userId
    });
  }

  // Admin methods
  static async getAllTickets(filters?: {
    status?: string;
    priority?: string;
    assigned_to?: string;
  }): Promise<SupportTicket[]> {
    return await SupportModel.findAllTickets(filters);
  }

  static async assignTicket(ticketId: string, assignedTo: string): Promise<SupportTicket | null> {
    return await SupportModel.updateTicket(ticketId, {
      assigned_to: assignedTo,
      status: 'in_progress'
    });
  }

  static async updateTicketStatus(ticketId: string, status: string): Promise<SupportTicket | null> {
    return await SupportModel.updateTicket(ticketId, { status: status as any });
  }

  static async getTicketStats() {
    return await SupportModel.getTicketStats();
  }
}
