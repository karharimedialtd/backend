import { Request, Response } from 'express';
import { PayoutService } from '../services/payout.service.js';
import { asyncHandler } from '../middlewares/error.middleware.js';

export class PayoutController {
  // GET /api/payouts/
  static getUserPayouts = asyncHandler(async (req: Request, res: Response) => {
    const payouts = await PayoutService.getUserPayouts(req.user!.id);

    res.json({
      success: true,
      data: payouts
    });
  });

  // POST /api/payouts/request
  static requestPayout = asyncHandler(async (req: Request, res: Response) => {
    const payout = await PayoutService.requestPayout(req.user!.id, req.body);

    res.status(201).json({
      success: true,
      data: payout,
      message: 'Payout request submitted successfully'
    });
  });

  // GET /api/payouts/:id
  static getPayoutById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const payout = await PayoutService.getPayoutById(id, req.user!.id);

    if (!payout) {
      return res.status(404).json({
        success: false,
        error: 'Payout request not found'
      });
    }

    res.json({
      success: true,
      data: payout
    });
  });

  // GET /api/payouts/admin/all
  static getAllPayouts = asyncHandler(async (req: Request, res: Response) => {
    const { status } = req.query;
    const payouts = await PayoutService.getAllPayouts({ status: status as string });

    res.json({
      success: true,
      data: payouts
    });
  });

  // POST /api/payouts/admin/:id/approve
  static approvePayout = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const payout = await PayoutService.approvePayout(id, req.user!.id);

    if (!payout) {
      return res.status(404).json({
        success: false,
        error: 'Payout request not found'
      });
    }

    res.json({
      success: true,
      data: payout,
      message: 'Payout approved successfully'
    });
  });

  // POST /api/payouts/admin/:id/reject
  static rejectPayout = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { reason } = req.body;
    
    const payout = await PayoutService.rejectPayout(id, req.user!.id, reason);

    if (!payout) {
      return res.status(404).json({
        success: false,
        error: 'Payout request not found'
      });
    }

    res.json({
      success: true,
      data: payout,
      message: 'Payout rejected'
    });
  });

  // POST /api/payouts/admin/:id/process
  static processPayout = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const payout = await PayoutService.processPayout(id, req.user!.id);

    if (!payout) {
      return res.status(404).json({
        success: false,
        error: 'Payout request not found'
      });
    }

    res.json({
      success: true,
      data: payout,
      message: 'Payout processed successfully'
    });
  });
}
