import { Request, Response } from 'express';
import { MusicService } from '../services/music.service.js';
import { asyncHandler } from '../middlewares/error.middleware.js';
import path from 'path';
import fs from 'fs';

export class MusicController {
  // GET /api/music/tracks
  static getTracks = asyncHandler(async (req: Request, res: Response) => {
    const tracks = await MusicService.getUserTracks(req.user!.id);

    res.json({
      success: true,
      data: tracks
    });
  });

  // POST /api/music/tracks
  static createTrack = asyncHandler(async (req: Request, res: Response) => {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const track = await MusicService.createTrack(req.user!.id, req.body, files);

    res.status(201).json({
      success: true,
      data: track,
      message: 'Track created successfully'
    });
  });

  // GET /api/music/tracks/:id
  static getTrackById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const track = await MusicService.getTrackById(id, req.user!.id);

    if (!track) {
      return res.status(404).json({
        success: false,
        error: 'Track not found'
      });
    }

    res.json({
      success: true,
      data: track
    });
  });

  // PUT /api/music/tracks/:id
  static updateTrack = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const track = await MusicService.updateTrack(id, req.user!.id, req.body);

    if (!track) {
      return res.status(404).json({
        success: false,
        error: 'Track not found'
      });
    }

    res.json({
      success: true,
      data: track,
      message: 'Track updated successfully'
    });
  });

  // DELETE /api/music/tracks/:id
  static deleteTrack = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const success = await MusicService.deleteTrack(id, req.user!.id);

    if (!success) {
      return res.status(404).json({
        success: false,
        error: 'Track not found'
      });
    }

    res.json({
      success: true,
      message: 'Track deleted successfully'
    });
  });

  // POST /api/music/distribute
  static createDistribution = asyncHandler(async (req: Request, res: Response) => {
    const distribution = await MusicService.createDistribution(req.user!.id, req.body);

    res.status(201).json({
      success: true,
      data: distribution,
      message: 'Distribution created successfully'
    });
  });

  // GET /api/music/distributions
  static getDistributions = asyncHandler(async (req: Request, res: Response) => {
    const distributions = await MusicService.getUserDistributions(req.user!.id);

    res.json({
      success: true,
      data: distributions
    });
  });

  // GET /api/music/distributions/:id
  static getDistributionById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const distribution = await MusicService.getDistributionById(id, req.user!.id);

    if (!distribution) {
      return res.status(404).json({
        success: false,
        error: 'Distribution not found'
      });
    }

    res.json({
      success: true,
      data: distribution
    });
  });

  // PUT /api/music/distributions/:id/status
  static updateDistributionStatus = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const distribution = await MusicService.updateDistributionStatus(id, req.user!.id, req.body);

    if (!distribution) {
      return res.status(404).json({
        success: false,
        error: 'Distribution not found'
      });
    }

    res.json({
      success: true,
      data: distribution,
      message: 'Distribution status updated'
    });
  });

  // GET /api/music/admin/tracks
  static getAllTracks = asyncHandler(async (req: Request, res: Response) => {
    const { status, user_id } = req.query;
    const tracks = await MusicService.getAllTracks({ 
      status: status as string, 
      user_id: user_id as string 
    });

    res.json({
      success: true,
      data: tracks
    });
  });

  // GET /api/music/admin/distributions
  static getAllDistributions = asyncHandler(async (req: Request, res: Response) => {
    const { status } = req.query;
    const distributions = await MusicService.getAllDistributions({ 
      status: status as string 
    });

    res.json({
      success: true,
      data: distributions
    });
  });

  // GET /api/music/files/audio/:filename
  static serveAudioFile = asyncHandler(async (req: Request, res: Response) => {
    const { filename } = req.params;
    const filePath = path.join(process.cwd(), 'uploads', 'audio', filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        error: 'File not found'
      });
    }

    res.sendFile(filePath);
  });

  // GET /api/music/files/covers/:filename
  static serveCoverFile = asyncHandler(async (req: Request, res: Response) => {
    const { filename } = req.params;
    const filePath = path.join(process.cwd(), 'uploads', 'covers', filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        error: 'File not found'
      });
    }

    res.sendFile(filePath);
  });
}
