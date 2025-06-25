import { CMSModel } from '../models/cms.model.js';
import { YouTubeChannel, ContentIDClaim } from '../types/supabase.types.js';

export class CMSService {
  // YouTube Channel methods
  static async getUserYouTubeChannels(userId: string): Promise<YouTubeChannel[]> {
    return await CMSModel.findChannelsByUser(userId);
  }

  static async addYouTubeChannel(userId: string, channelData: any): Promise<YouTubeChannel | null> {
    return await CMSModel.createYouTubeChannel({
      ...channelData,
      user_id: userId,
      status: 'active'
    });
  }

  static async getYouTubeChannelById(channelId: string, userId: string): Promise<YouTubeChannel | null> {
    const channel = await CMSModel.findChannelById(channelId);
    
    if (!channel || channel.user_id !== userId) {
      return null;
    }

    return channel;
  }

  static async updateYouTubeChannel(
    channelId: string, 
    userId: string, 
    updates: Partial<YouTubeChannel>
  ): Promise<YouTubeChannel | null> {
    const channel = await CMSModel.findChannelById(channelId);
    
    if (!channel || channel.user_id !== userId) {
      return null;
    }

    return await CMSModel.updateChannel(channelId, updates);
  }

  static async deleteYouTubeChannel(channelId: string, userId: string): Promise<boolean> {
    const channel = await CMSModel.findChannelById(channelId);
    
    if (!channel || channel.user_id !== userId) {
      return false;
    }

    return await CMSModel.deleteChannel(channelId);
  }

  // Content ID Claims methods
  static async getUserContentIDClaims(userId: string): Promise<ContentIDClaim[]> {
    return await CMSModel.findClaimsByUser(userId);
  }

  static async createContentIDClaim(userId: string, claimData: any): Promise<ContentIDClaim | null> {
    // Verify channel belongs to user
    const channel = await CMSModel.findChannelById(claimData.channel_id);
    
    if (!channel || channel.user_id !== userId) {
      throw new Error('Channel not found or access denied');
    }

    return await CMSModel.createContentIDClaim({
      ...claimData,
      status: 'active'
    });
  }

  static async updateContentIDClaim(
    claimId: string, 
    userId: string, 
    updates: Partial<ContentIDClaim>
  ): Promise<ContentIDClaim | null> {
    const claims = await CMSModel.findClaimsByUser(userId);
    const claim = claims.find(c => c.id === claimId);
    
    if (!claim) {
      return null;
    }

    return await CMSModel.updateClaim(claimId, updates);
  }

  // Analytics
  static async getCMSAnalytics(userId: string) {
    return await CMSModel.getCMSAnalytics(userId);
  }

  // Admin methods
  static async getAllClaims(filters?: { status?: string; policy?: string }): Promise<ContentIDClaim[]> {
    return await CMSModel.findAllClaims(filters);
  }
}
