import { PublishingModel } from '../models/publishing.model.js';
import { PublishingIdentity, Composition } from '../types/supabase.types.js';

export class PublishingService {
  // Publishing Identity methods
  static async getUserPublishingIdentities(userId: string): Promise<PublishingIdentity[]> {
    return await PublishingModel.findIdentitiesByUser(userId);
  }

  static async createPublishingIdentity(
    userId: string, 
    identityData: any
  ): Promise<PublishingIdentity | null> {
    return await PublishingModel.createPublishingIdentity({
      ...identityData,
      user_id: userId,
      status: 'pending'
    });
  }

  static async getPublishingIdentityById(
    identityId: string, 
    userId: string
  ): Promise<PublishingIdentity | null> {
    const identity = await PublishingModel.findIdentityById(identityId);
    
    if (!identity || identity.user_id !== userId) {
      return null;
    }

    return identity;
  }

  static async updatePublishingIdentity(
    identityId: string, 
    userId: string, 
    updates: Partial<PublishingIdentity>
  ): Promise<PublishingIdentity | null> {
    const identity = await PublishingModel.findIdentityById(identityId);
    
    if (!identity || identity.user_id !== userId) {
      return null;
    }

    return await PublishingModel.updateIdentity(identityId, updates);
  }

  // Composition methods
  static async getUserCompositions(userId: string): Promise<Composition[]> {
    return await PublishingModel.findCompositionsByUser(userId);
  }

  static async createComposition(userId: string, compositionData: any): Promise<Composition | null> {
    // Verify the publishing identity belongs to the user
    const identity = await PublishingModel.findIdentityById(compositionData.publishing_identity_id);
    
    if (!identity || identity.user_id !== userId) {
      throw new Error('Publishing identity not found or access denied');
    }

    return await PublishingModel.createComposition(compositionData);
  }

  static async updateComposition(
    compositionId: string, 
    userId: string, 
    updates: Partial<Composition>
  ): Promise<Composition | null> {
    const compositions = await PublishingModel.findCompositionsByUser(userId);
    const composition = compositions.find(c => c.id === compositionId);
    
    if (!composition) {
      return null;
    }

    return await PublishingModel.updateComposition(compositionId, updates);
  }

  static async deleteComposition(compositionId: string, userId: string): Promise<boolean> {
    const compositions = await PublishingModel.findCompositionsByUser(userId);
    const composition = compositions.find(c => c.id === compositionId);
    
    if (!composition) {
      return false;
    }

    return await PublishingModel.deleteComposition(compositionId);
  }

  // Statistics
  static async getPublishingStats(userId: string) {
    return await PublishingModel.getPublishingStats(userId);
  }

  // Admin methods
  static async getAllIdentities(filters?: { status?: string }): Promise<PublishingIdentity[]> {
    return await PublishingModel.findAllIdentities(filters);
  }

  static async approveIdentity(
    identityId: string, 
    adminId: string
  ): Promise<PublishingIdentity | null> {
    return await PublishingModel.updateIdentity(identityId, {
      status: 'approved'
    });
  }

  static async rejectIdentity(
    identityId: string, 
    adminId: string, 
    reason?: string
  ): Promise<PublishingIdentity | null> {
    return await PublishingModel.updateIdentity(identityId, {
      status: 'rejected'
    });
  }
}
