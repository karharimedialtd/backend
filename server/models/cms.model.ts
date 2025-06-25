import { supabase, supabaseAdmin } from '../config/supabase.js';
import { YouTubeChannel, ContentIDClaim } from '../types/supabase.types.js';

export class CMSModel {
  // YouTube Channel methods
  static async createYouTubeChannel(channelData: Omit<YouTubeChannel, 'id' | 'created_at'>): Promise<YouTubeChannel | null> {
    const { data, error } = await supabase
      .from('youtube_channels')
      .insert([channelData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async findChannelsByUser(userId: string): Promise<YouTubeChannel[]> {
    const { data, error } = await supabase
      .from('youtube_channels')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async findChannelById(id: string): Promise<YouTubeChannel | null> {
    const { data, error } = await supabase
      .from('youtube_channels')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
  }

  static async updateChannel(id: string, updates: Partial<YouTubeChannel>): Promise<YouTubeChannel | null> {
    const { data, error } = await supabase
      .from('youtube_channels')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteChannel(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('youtube_channels')
      .delete()
      .eq('id', id);

    return !error;
  }

  // Content ID Claim methods
  static async createContentIDClaim(claimData: Omit<ContentIDClaim, 'id' | 'created_at'>): Promise<ContentIDClaim | null> {
    const { data, error } = await supabase
      .from('content_id_claims')
      .insert([claimData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async findClaimsByChannel(channelId: string): Promise<ContentIDClaim[]> {
    const { data, error } = await supabase
      .from('content_id_claims')
      .select('*')
      .eq('channel_id', channelId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async findClaimsByUser(userId: string): Promise<ContentIDClaim[]> {
    const { data, error } = await supabase
      .from('content_id_claims')
      .select(`
        *,
        channel:youtube_channels(channel_name)
      `)
      .eq('youtube_channels.user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async updateClaim(id: string, updates: Partial<ContentIDClaim>): Promise<ContentIDClaim | null> {
    const { data, error } = await supabase
      .from('content_id_claims')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async findAllClaims(filters?: { status?: string; policy?: string }): Promise<ContentIDClaim[]> {
    let query = supabaseAdmin
      .from('content_id_claims')
      .select(`
        *,
        channel:youtube_channels(channel_name, user:users(email))
      `);

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.policy) {
      query = query.eq('policy', filters.policy);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Get CMS analytics
  static async getCMSAnalytics(userId?: string): Promise<{
    total_channels: number;
    active_channels: number;
    total_claims: number;
    active_claims: number;
    disputed_claims: number;
    monetized_claims: number;
  }> {
    let channelQuery = supabaseAdmin.from('youtube_channels').select('status');
    let claimQuery = supabaseAdmin.from('content_id_claims').select('status, policy');

    if (userId) {
      channelQuery = channelQuery.eq('user_id', userId);
      claimQuery = claimQuery.eq('youtube_channels.user_id', userId);
    }

    const [{ data: channels }, { data: claims }] = await Promise.all([
      channelQuery,
      claimQuery
    ]);

    const analytics = {
      total_channels: channels?.length || 0,
      active_channels: channels?.filter(c => c.status === 'active').length || 0,
      total_claims: claims?.length || 0,
      active_claims: claims?.filter(c => c.status === 'active').length || 0,
      disputed_claims: claims?.filter(c => c.status === 'disputed').length || 0,
      monetized_claims: claims?.filter(c => c.policy === 'monetize').length || 0
    };

    return analytics;
  }
}
