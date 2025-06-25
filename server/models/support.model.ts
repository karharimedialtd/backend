import { supabase, supabaseAdmin } from '../config/supabase.js';
import { SupportTicket, TicketMessage } from '../types/supabase.types.js';

export class SupportModel {
  // Create support ticket
  static async createTicket(ticketData: Omit<SupportTicket, 'id' | 'created_at' | 'updated_at'>): Promise<SupportTicket | null> {
    const { data, error } = await supabase
      .from('support_tickets')
      .insert([ticketData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get tickets by user
  static async findTicketsByUser(userId: string): Promise<SupportTicket[]> {
    const { data, error } = await supabase
      .from('support_tickets')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Get all tickets (admin)
  static async findAllTickets(filters?: { 
    status?: string; 
    priority?: string; 
    assigned_to?: string;
  }): Promise<SupportTicket[]> {
    let query = supabaseAdmin
      .from('support_tickets')
      .select(`
        *,
        user:users(email, profile:user_profiles(full_name))
      `);

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.priority) {
      query = query.eq('priority', filters.priority);
    }
    if (filters?.assigned_to) {
      query = query.eq('assigned_to', filters.assigned_to);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Get ticket by ID
  static async findTicketById(id: string): Promise<SupportTicket | null> {
    const { data, error } = await supabase
      .from('support_tickets')
      .select(`
        *,
        user:users(email, profile:user_profiles(full_name))
      `)
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
  }

  // Update ticket
  static async updateTicket(id: string, updates: Partial<SupportTicket>): Promise<SupportTicket | null> {
    const { data, error } = await supabase
      .from('support_tickets')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Message methods
  static async createMessage(messageData: Omit<TicketMessage, 'id' | 'created_at'>): Promise<TicketMessage | null> {
    const { data, error } = await supabase
      .from('ticket_messages')
      .insert([messageData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async findMessagesByTicket(ticketId: string): Promise<TicketMessage[]> {
    const { data, error } = await supabase
      .from('ticket_messages')
      .select(`
        *,
        user:users(email, profile:user_profiles(full_name))
      `)
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  // Get ticket statistics
  static async getTicketStats(): Promise<{
    total: number;
    open: number;
    in_progress: number;
    resolved: number;
    by_priority: Record<string, number>;
  }> {
    const { data: tickets, error } = await supabaseAdmin
      .from('support_tickets')
      .select('status, priority');

    if (error) throw error;

    const stats = {
      total: tickets?.length || 0,
      open: 0,
      in_progress: 0,
      resolved: 0,
      by_priority: {
        low: 0,
        medium: 0,
        high: 0,
        urgent: 0
      }
    };

    tickets?.forEach(ticket => {
      if (ticket.status === 'open') stats.open++;
      else if (ticket.status === 'in_progress') stats.in_progress++;
      else if (ticket.status === 'resolved') stats.resolved++;

      if (ticket.priority in stats.by_priority) {
        stats.by_priority[ticket.priority as keyof typeof stats.by_priority]++;
      }
    });

    return stats;
  }
}
