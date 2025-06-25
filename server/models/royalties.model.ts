import { supabase, supabaseAdmin } from '../config/supabase.js';
import { Royalty, PayoutRequest } from '../types/supabase.types.js';

export class RoyaltiesModel {
  // Get royalties by user
  static async findRoyaltiesByUser(userId: string): Promise<Royalty[]> {
    const { data, error } = await supabase
      .from('royalties')
      .select(`
        *,
        track:music_tracks(title, artist)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Get royalties by track
  static async findRoyaltiesByTrack(trackId: string): Promise<Royalty[]> {
    const { data, error } = await supabase
      .from('royalties')
      .select('*')
      .eq('track_id', trackId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Create royalty entry
  static async createRoyalty(royaltyData: Omit<Royalty, 'id' | 'created_at'>): Promise<Royalty | null> {
    const { data, error } = await supabaseAdmin
      .from('royalties')
      .insert([royaltyData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get user earnings summary
  static async getUserEarningsSummary(userId: string): Promise<{
    total: number;
    this_month: number;
    last_month: number;
    by_dsp: Record<string, number>;
  }> {
    const { data: royalties, error } = await supabase
      .from('royalties')
      .select('amount, dsp, created_at')
      .eq('user_id', userId);

    if (error) throw error;

    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    let total = 0;
    let thisMonthTotal = 0;
    let lastMonthTotal = 0;
    const byDsp: Record<string, number> = {};

    royalties?.forEach(royalty => {
      const createdAt = new Date(royalty.created_at);
      total += royalty.amount;

      if (createdAt >= thisMonth) {
        thisMonthTotal += royalty.amount;
      } else if (createdAt >= lastMonth && createdAt <= endLastMonth) {
        lastMonthTotal += royalty.amount;
      }

      byDsp[royalty.dsp] = (byDsp[royalty.dsp] || 0) + royalty.amount;
    });

    return {
      total,
      this_month: thisMonthTotal,
      last_month: lastMonthTotal,
      by_dsp: byDsp
    };
  }

  // Payout request methods
  static async createPayoutRequest(requestData: Omit<PayoutRequest, 'id' | 'created_at'>): Promise<PayoutRequest | null> {
    const { data, error } = await supabase
      .from('payout_requests')
      .insert([requestData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async findPayoutRequestsByUser(userId: string): Promise<PayoutRequest[]> {
    const { data, error } = await supabase
      .from('payout_requests')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

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

  // Get available balance for user
  static async getAvailableBalance(userId: string): Promise<number> {
    // Get total royalties
    const { data: royalties } = await supabase
      .from('royalties')
      .select('amount')
      .eq('user_id', userId);

    // Get total processed payouts
    const { data: payouts } = await supabase
      .from('payout_requests')
      .select('amount')
      .eq('user_id', userId)
      .in('status', ['approved', 'processed']);

    const totalRoyalties = royalties?.reduce((sum, r) => sum + r.amount, 0) || 0;
    const totalPayouts = payouts?.reduce((sum, p) => sum + p.amount, 0) || 0;

    return Math.max(0, totalRoyalties - totalPayouts);
  }
}
