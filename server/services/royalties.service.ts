import { RoyaltiesModel } from '../models/royalties.model.js';
import { MusicModel } from '../models/music.model.js';
import { Royalty } from '../types/supabase.types.js';

export class RoyaltiesService {
  // Get user royalties
  static async getUserRoyalties(userId: string): Promise<Royalty[]> {
    return await RoyaltiesModel.findRoyaltiesByUser(userId);
  }

  // Get earnings summary
  static async getEarningsSummary(userId: string) {
    return await RoyaltiesModel.getUserEarningsSummary(userId);
  }

  // Get available balance
  static async getAvailableBalance(userId: string): Promise<number> {
    return await RoyaltiesModel.getAvailableBalance(userId);
  }

  // Get track royalties (with user verification)
  static async getTrackRoyalties(trackId: string, userId: string): Promise<Royalty[]> {
    const track = await MusicModel.findTrackById(trackId);
    
    if (!track || track.user_id !== userId) {
      throw new Error('Track not found or access denied');
    }

    return await RoyaltiesModel.findRoyaltiesByTrack(trackId);
  }

  // Create royalty (admin only)
  static async createRoyalty(royaltyData: Omit<Royalty, 'id' | 'created_at'>): Promise<Royalty | null> {
    return await RoyaltiesModel.createRoyalty(royaltyData);
  }

  // Get all royalties (admin only)
  static async getAllRoyalties(filters?: {
    user_id?: string;
    dsp?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<Royalty[]> {
    // This would include filtering logic in a real implementation
    // For now, return basic user royalties if user_id is specified
    if (filters?.user_id) {
      return await RoyaltiesModel.findRoyaltiesByUser(filters.user_id);
    }

    // In a real implementation, you'd query all royalties with filters
    // This is a simplified version
    return [];
  }
}
