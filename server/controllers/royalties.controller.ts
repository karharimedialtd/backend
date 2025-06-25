import { Request, Response } from 'express';
import { RoyaltiesService } from '../services/royalties.service.js';
import { asyncHandler } from '../middlewares/error.middleware.js';

export class RoyaltiesController {
  // GET /api/royalties/
  static getUserRoyalties = asyncHandler(async (req: Request, res: Response) => {
    const royalties = await RoyaltiesService.getUserRoyalties(req.user!.id);

    res.json({
      success: true,
      data: royalties
    });
  });

  // GET /api/royalties/summary
  static getEarningsSummary = asyncHandler(async (req: Request, res: Response) => {
    const summary = await RoyaltiesService.getEarningsSummary(req.user!.id);

    res.json({
      success: true,
      data: summary
    });
  });

  // GET /api/royalties/balance
  static getAvailableBalance = asyncHandler(async (req: Request, res: Response) => {
    const balance = await RoyaltiesService.getAvailableBalance(req.user!.id);

    res.json({
      success: true,
      data: { available_balance: balance }
    });
  });

  // GET /api/royalties/track/:trackId
  static getTrackRoyalties = asyncHandler(async (req: Request, res: Response) => {
    const { trackId } = req.params;
    const royalties = await RoyaltiesService.getTrackRoyalties(trackId, req.user!.id);

    res.json({
      success: true,
      data: royalties
    });
  });

  // POST /api/royalties/admin/create
  static createRoyalty = asyncHandler(async (req: Request, res: Response) => {
    const royalty = await RoyaltiesService.createRoyalty(req.body);

    res.status(201).json({
      success: true,
      data: royalty,
      message: 'Royalty entry created successfully'
    });
  });

  // GET /api/royalties/admin/all
  static getAllRoyalties = asyncHandler(async (req: Request, res: Response) => {
    const { user_id, dsp, start_date, end_date } = req.query;
    const royalties = await RoyaltiesService.getAllRoyalties({
      user_id: user_id as string,
      dsp: dsp as string,
      start_date: start_date as string,
      end_date: end_date as string
    });

    res.json({
      success: true,
      data: royalties
    });
  });
}
