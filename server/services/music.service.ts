import { MusicModel } from '../models/music.model.js';
import { getFileUrl } from '../utils/uploader.js';
import { MusicTrack, Distribution } from '../types/supabase.types.js';

export class MusicService {
  // Get user tracks
  static async getUserTracks(userId: string): Promise<MusicTrack[]> {
    return await MusicModel.findTracksByUser(userId);
  }

  // Create track
  static async createTrack(
    userId: string, 
    trackData: any, 
    files?: { [fieldname: string]: Express.Multer.File[] }
  ): Promise<MusicTrack | null> {
    const audioFile = files?.audio?.[0];
    const coverFile = files?.cover_art?.[0];

    if (!audioFile) {
      throw new Error('Audio file is required');
    }

    const trackInfo = {
      ...trackData,
      user_id: userId,
      file_url: getFileUrl(audioFile.filename, 'audio'),
      cover_art_url: coverFile ? getFileUrl(coverFile.filename, 'covers') : undefined,
      status: 'draft' as const
    };

    return await MusicModel.createTrack(trackInfo);
  }

  // Get track by ID (with user check)
  static async getTrackById(trackId: string, userId: string): Promise<MusicTrack | null> {
    const track = await MusicModel.findTrackById(trackId);
    
    if (!track || track.user_id !== userId) {
      return null;
    }

    return track;
  }

  // Update track
  static async updateTrack(
    trackId: string, 
    userId: string, 
    updates: Partial<MusicTrack>
  ): Promise<MusicTrack | null> {
    const track = await MusicModel.findTrackById(trackId);
    
    if (!track || track.user_id !== userId) {
      return null;
    }

    return await MusicModel.updateTrack(trackId, updates);
  }

  // Delete track
  static async deleteTrack(trackId: string, userId: string): Promise<boolean> {
    const track = await MusicModel.findTrackById(trackId);
    
    if (!track || track.user_id !== userId) {
      return false;
    }

    return await MusicModel.deleteTrack(trackId);
  }

  // Create distribution
  static async createDistribution(
    userId: string, 
    distributionData: { track_id: string; dsps: string[] }
  ): Promise<Distribution | null> {
    const track = await MusicModel.findTrackById(distributionData.track_id);
    
    if (!track || track.user_id !== userId) {
      throw new Error('Track not found or access denied');
    }

    return await MusicModel.createDistribution({
      ...distributionData,
      status: 'pending'
    });
  }

  // Get user distributions
  static async getUserDistributions(userId: string): Promise<Distribution[]> {
    return await MusicModel.findDistributionsByUser(userId);
  }

  // Get distribution by ID (with user check)
  static async getDistributionById(distributionId: string, userId: string): Promise<Distribution | null> {
    const distributions = await MusicModel.findDistributionsByUser(userId);
    return distributions.find(d => d.id === distributionId) || null;
  }

  // Update distribution status
  static async updateDistributionStatus(
    distributionId: string, 
    userId: string, 
    updates: { status?: string; error_message?: string }
  ): Promise<Distribution | null> {
    const distribution = await this.getDistributionById(distributionId, userId);
    
    if (!distribution) {
      return null;
    }

    return await MusicModel.updateDistribution(distributionId, updates);
  }

  // Admin methods
  static async getAllTracks(filters?: { status?: string; user_id?: string }): Promise<MusicTrack[]> {
    return await MusicModel.findAllTracks(filters);
  }

  static async getAllDistributions(filters?: { status?: string }): Promise<Distribution[]> {
    return await MusicModel.findAllDistributions(filters);
  }
}
