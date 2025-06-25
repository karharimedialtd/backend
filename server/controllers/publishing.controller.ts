import { Request, Response } from 'express';
import { PublishingService } from '../services/publishing.service.js';
import { asyncHandler } from '../middlewares/error.middleware.js';

export class PublishingController {
  // GET /api/publishing/identities
  static getPublishingIdentities = asyncHandler(async (req: Request, res: Response) => {
    const identities = await PublishingService.getUserPublishingIdentities(req.user!.id);

    res.json({
      success: true,
      data: identities
    });
  });

  // POST /api/publishing/identities
  static createPublishingIdentity = asyncHandler(async (req: Request, res: Response) => {
    const identity = await PublishingService.createPublishingIdentity(req.user!.id, req.body);

    res.status(201).json({
      success: true,
      data: identity,
      message: 'Publishing identity created successfully'
    });
  });

  // GET /api/publishing/identities/:id
  static getPublishingIdentityById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const identity = await PublishingService.getPublishingIdentityById(id, req.user!.id);

    if (!identity) {
      return res.status(404).json({
        success: false,
        error: 'Publishing identity not found'
      });
    }

    res.json({
      success: true,
      data: identity
    });
  });

  // PUT /api/publishing/identities/:id
  static updatePublishingIdentity = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const identity = await PublishingService.updatePublishingIdentity(id, req.user!.id, req.body);

    if (!identity) {
      return res.status(404).json({
        success: false,
        error: 'Publishing identity not found'
      });
    }

    res.json({
      success: true,
      data: identity,
      message: 'Publishing identity updated successfully'
    });
  });

  // GET /api/publishing/compositions
  static getCompositions = asyncHandler(async (req: Request, res: Response) => {
    const compositions = await PublishingService.getUserCompositions(req.user!.id);

    res.json({
      success: true,
      data: compositions
    });
  });

  // POST /api/publishing/compositions
  static createComposition = asyncHandler(async (req: Request, res: Response) => {
    const composition = await PublishingService.createComposition(req.user!.id, req.body);

    res.status(201).json({
      success: true,
      data: composition,
      message: 'Composition created successfully'
    });
  });

  // PUT /api/publishing/compositions/:id
  static updateComposition = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const composition = await PublishingService.updateComposition(id, req.user!.id, req.body);

    if (!composition) {
      return res.status(404).json({
        success: false,
        error: 'Composition not found'
      });
    }

    res.json({
      success: true,
      data: composition,
      message: 'Composition updated successfully'
    });
  });

  // DELETE /api/publishing/compositions/:id
  static deleteComposition = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const success = await PublishingService.deleteComposition(id, req.user!.id);

    if (!success) {
      return res.status(404).json({
        success: false,
        error: 'Composition not found'
      });
    }

    res.json({
      success: true,
      message: 'Composition deleted successfully'
    });
  });

  // GET /api/publishing/stats
  static getPublishingStats = asyncHandler(async (req: Request, res: Response) => {
    const stats = await PublishingService.getPublishingStats(req.user!.id);

    res.json({
      success: true,
      data: stats
    });
  });

  // GET /api/publishing/admin/identities
  static getAllIdentities = asyncHandler(async (req: Request, res: Response) => {
    const { status } = req.query;
    const identities = await PublishingService.getAllIdentities({ status: status as string });

    res.json({
      success: true,
      data: identities
    });
  });

  // POST /api/publishing/admin/identities/:id/approve
  static approveIdentity = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const identity = await PublishingService.approveIdentity(id, req.user!.id);

    if (!identity) {
      return res.status(404).json({
        success: false,
        error: 'Publishing identity not found'
      });
    }

    res.json({
      success: true,
      data: identity,
      message: 'Publishing identity approved successfully'
    });
  });

  // POST /api/publishing/admin/identities/:id/reject
  static rejectIdentity = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { reason } = req.body;
    
    const identity = await PublishingService.rejectIdentity(id, req.user!.id, reason);

    if (!identity) {
      return res.status(404).json({
        success: false,
        error: 'Publishing identity not found'
      });
    }

    res.json({
      success: true,
      data: identity,
      message: 'Publishing identity rejected'
    });
  });
}
