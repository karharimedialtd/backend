import { supabase, supabaseAdmin } from '../config/supabase.js';
import { MusicTrack, Distribution } from '../types/supabase.types.js';

export class MusicModel {
  // Get track by ID
  static async findTrackById(id: string): Promise<MusicTrack | null> {
    const { data, error } = await supabase
      .from('music_tracks')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
  }

  // Get tracks by user
  static async findTracksByUser(userId: string): Promise<MusicTrack[]> {
    const { data, error } = await supabase
      .from('music_tracks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Get all tracks (admin)
  static async findAllTracks(filters?: { status?: string; user_id?: string }): Promise<MusicTrack[]> {
    let query = supabaseAdmin
      .from('music_tracks')
      .select('*');

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.user_id) {
      query = query.eq('user_id', filters.user_id);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Create track
  static async createTrack(trackData: Omit<MusicTrack, 'id' | 'created_at' | 'updated_at'>): Promise<MusicTrack | null> {
    const { data, error } = await supabase
      .from('music_tracks')
      .insert([trackData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Update track
  static async updateTrack(id: string, updates: Partial<MusicTrack>): Promise<MusicTrack | null> {
    const { data, error } = await supabase
      .from('music_tracks')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Delete track
  static async deleteTrack(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('music_tracks')
      .delete()
      .eq('id', id);

    return !error;
  }

  // Distribution methods
  static async createDistribution(distributionData: Omit<Distribution, 'id' | 'created_at' | 'updated_at'>): Promise<Distribution | null> {
    const { data, error } = await supabase
      .from('distributions')
      .insert([distributionData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async findDistributionsByTrack(trackId: string): Promise<Distribution[]> {
    const { data, error } = await supabase
      .from('distributions')
      .select('*')
      .eq('track_id', trackId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async findDistributionsByUser(userId: string): Promise<Distribution[]> {
    const { data, error } = await supabase
      .from('distributions')
      .select(`
        *,
        track:music_tracks(*)
      `)
      .eq('music_tracks.user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async updateDistribution(id: string, updates: Partial<Distribution>): Promise<Distribution | null> {
    const { data, error } = await supabase
      .from('distributions')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async findAllDistributions(filters?: { status?: string }): Promise<Distribution[]> {
    let query = supabaseAdmin
      .from('distributions')
      .select(`
        *,
        track:music_tracks(*)
      `);

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
}
