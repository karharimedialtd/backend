import { supabase, supabaseAdmin } from '../config/supabase.js';
import { PayoutRequest } from '../types/supabase.types.js';

export class PayoutModel {
  // Create payout request
  static async createPayoutRequest(requestData: Omit<PayoutRequest, 'id' | 'created_at'>): Promise<PayoutRequest | null> {
    const { data, error } = await supabase
      .from('payout_requests')
      .insert([requestData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Find payout requests by user
  static async findPayoutRequestsByUser(userId: string): Promise<PayoutRequest[]> {
    const { data, error } = await supabase
      .from('payout_requests')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Find all payout requests (admin)
  static async findAllPayoutRequests(filters?: { status?: string }): Promise<PayoutRequest[]> {
    let query = supabaseAdmin
      .from('payout_requests')
      .select(`
        *,
        user:users(email, profile:user_profiles(full_name))
      `);

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Update payout request
  static async updatePayoutRequest(id: string, updates: Partial<PayoutRequest>): Promise<PayoutRequest | null> {
    const { data, error } = await supabaseAdmin
      .from('payout_requests')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get payout by ID
  static async findPayoutRequestById(id: string): Promise<PayoutRequest | null> {
    const { data, error } = await supabase
      .from('payout_requests')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
  }
}
