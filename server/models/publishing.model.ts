import { supabase, supabaseAdmin } from '../config/supabase.js';
import { PublishingIdentity, Composition } from '../types/supabase.types.js';

export class PublishingModel {
  // Publishing Identity methods
  static async createPublishingIdentity(identityData: Omit<PublishingIdentity, 'id' | 'created_at'>): Promise<PublishingIdentity | null> {
    const { data, error } = await supabase
      .from('publishing_identities')
      .insert([identityData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async findIdentitiesByUser(userId: string): Promise<PublishingIdentity[]> {
    const { data, error } = await supabase
      .from('publishing_identities')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async findIdentityById(id: string): Promise<PublishingIdentity | null> {
    const { data, error } = await supabase
      .from('publishing_identities')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
  }

  static async updateIdentity(id: string, updates: Partial<PublishingIdentity>): Promise<PublishingIdentity | null> {
    const { data, error } = await supabase
      .from('publishing_identities')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async findAllIdentities(filters?: { status?: string }): Promise<PublishingIdentity[]> {
    let query = supabaseAdmin
      .from('publishing_identities')
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

  // Composition methods
  static async createComposition(compositionData: Omit<Composition, 'id' | 'created_at'>): Promise<Composition | null> {
    const { data, error } = await supabase
      .from('compositions')
      .insert([compositionData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async findCompositionsByIdentity(identityId: string): Promise<Composition[]> {
    const { data, error } = await supabase
      .from('compositions')
      .select('*')
      .eq('publishing_identity_id', identityId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async findCompositionsByUser(userId: string): Promise<Composition[]> {
    const { data, error } = await supabase
      .from('compositions')
      .select(`
        *,
        identity:publishing_identities(name)
      `)
      .eq('publishing_identities.user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async updateComposition(id: string, updates: Partial<Composition>): Promise<Composition | null> {
    const { data, error } = await supabase
      .from('compositions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteComposition(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('compositions')
      .delete()
      .eq('id', id);

    return !error;
  }

  // Get publishing statistics
  static async getPublishingStats(userId?: string): Promise<{
    total_identities: number;
    approved_identities: number;
    pending_identities: number;
    total_compositions: number;
    registered_compositions: number;
  }> {
    let identityQuery = supabaseAdmin.from('publishing_identities').select('status');
    let compositionQuery = supabaseAdmin.from('compositions').select('iswc');

    if (userId) {
      identityQuery = identityQuery.eq('user_id', userId);
      compositionQuery = compositionQuery.eq('publishing_identities.user_id', userId);
    }

    const [{ data: identities }, { data: compositions }] = await Promise.all([
      identityQuery,
      compositionQuery
    ]);

    return {
      total_identities: identities?.length || 0,
      approved_identities: identities?.filter(i => i.status === 'approved').length || 0,
      pending_identities: identities?.filter(i => i.status === 'pending').length || 0,
      total_compositions: compositions?.length || 0,
      registered_compositions: compositions?.filter(c => c.iswc).length || 0
    };
  }
}
