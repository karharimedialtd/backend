import { Request, Response } from 'express';
import { CMSService } from '../services/cms.service.js';
import { asyncHandler } from '../middlewares/error.middleware.js';

export class CMSController {
  // GET /api/cms/youtube/channels
  static getYouTubeChannels = asyncHandler(async (req: Request, res: Response) => {
    const channels = await CMSService.getUserYouTubeChannels(req.user!.id);

    res.json({
      success: true,
      data: channels
    });
  });

  // POST /api/cms/youtube/channels
  static addYouTubeChannel = asyncHandler(async (req: Request, res: Response) => {
    const channel = await CMSService.addYouTubeChannel(req.user!.id, req.body);

    res.status(201).json({
      success: true,
      data: channel,
      message: 'YouTube channel added successfully'
    });
  });

  // GET /api/cms/youtube/channels/:id
  static getYouTubeChannelById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const channel = await CMSService.getYouTubeChannelById(id, req.user!.id);

    if (!channel) {
      return res.status(404).json({
        success: false,
        error: 'YouTube channel not found'
      });
    }

    res.json({
      success: true,
      data: channel
    });
  });

  // PUT /api/cms/youtube/channels/:id
  static updateYouTubeChannel = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const channel = await CMSService.updateYouTubeChannel(id, req.user!.id, req.body);

    if (!channel) {
      return res.status(404).json({
        success: false,
        error: 'YouTube channel not found'
      });
    }

    res.json({
      success: true,
      data: channel,
      message: 'YouTube channel updated successfully'
    });
  });

  // DELETE /api/cms/youtube/channels/:id
  static deleteYouTubeChannel = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const success = await CMSService.deleteYouTubeChannel(id, req.user!.id);

    if (!success) {
      return res.status(404).json({
        success: false,
        error: 'YouTube channel not found'
      });
    }

    res.json({
      success: true,
      message: 'YouTube channel deleted successfully'
    });
  });

  // GET /api/cms/content-id/claims
  static getContentIDClaims = asyncHandler(async (req: Request, res: Response) => {
    const claims = await CMSService.getUserContentIDClaims(req.user!.id);

    res.json({
      success: true,
      data: claims
    });
  });

  // POST /api/cms/content-id/claims
  static createContentIDClaim = asyncHandler(async (req: Request, res: Response) => {
    const claim = await CMSService.createContentIDClaim(req.user!.id, req.body);

    res.status(201).json({
      success: true,
      data: claim,
      message: 'Content ID claim created successfully'
    });
  });

  // PUT /api/cms/content-id/claims/:id
  static updateContentIDClaim = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const claim = await CMSService.updateContentIDClaim(id, req.user!.id, req.body);

    if (!claim) {
      return res.status(404).json({
        success: false,
        error: 'Content ID claim not found'
      });
    }

    res.json({
      success: true,
      data: claim,
      message: 'Content ID claim updated successfully'
    });
  });

  // GET /api/cms/analytics
  static getCMSAnalytics = asyncHandler(async (req: Request, res: Response) => {
    const analytics = await CMSService.getCMSAnalytics(req.user!.id);

    res.json({
      success: true,
      data: analytics
    });
  });

  // GET /api/cms/admin/claims
  static getAllClaims = asyncHandler(async (req: Request, res: Response) => {
    const { status, policy } = req.query;
    const claims = await CMSService.getAllClaims({ 
      status: status as string, 
      policy: policy as string 
    });

    res.json({
      success: true,
      data: claims
    });
  });
}
