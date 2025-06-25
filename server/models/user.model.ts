import { supabase, supabaseAdmin } from '../config/supabase.js';
import { User, UserProfile, AccessRequest } from '../types/supabase.types.js';

export class UserModel {
  // Get user by ID
  static async findById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        profile:user_profiles(*)
      `)
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
  }

  // Get user by email
  static async findByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        profile:user_profiles(*)
      `)
      .eq('email', email)
      .single();

    if (error) return null;
    return data;
  }

  // Create new user
  static async create(userData: Partial<User>): Promise<User | null> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert([userData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Update user
  static async update(id: string, updates: Partial<User>): Promise<User | null> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get user profile
  static async getProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) return null;
    return data;
  }

  // Update user profile
  static async updateProfile(userId: string, profileData: Partial<UserProfile>): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert([{
        user_id: userId,
        ...profileData,
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get all users (admin only)
  static async findAll(filters?: { status?: string; role?: string }): Promise<User[]> {
    let query = supabaseAdmin
      .from('users')
      .select(`
        *,
        profile:user_profiles(*)
      `);

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.role) {
      query = query.eq('role', filters.role);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Delete user
  static async delete(id: string): Promise<boolean> {
    const { error } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', id);

    return !error;
  }

  // Access request methods
  static async createAccessRequest(requestData: Omit<AccessRequest, 'id' | 'created_at'>): Promise<AccessRequest | null> {
    const { data, error } = await supabase
      .from('access_requests')
      .insert([requestData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getAccessRequests(status?: string): Promise<AccessRequest[]> {
    let query = supabaseAdmin
      .from('access_requests')
      .select('*');

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async updateAccessRequest(id: string, updates: Partial<AccessRequest>): Promise<AccessRequest | null> {
    const { data, error } = await supabaseAdmin
      .from('access_requests')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
