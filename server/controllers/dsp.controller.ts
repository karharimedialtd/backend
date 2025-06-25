import { Request, Response } from 'express';
import { DSPService } from '../services/dsp.service.js';
import { asyncHandler } from '../middlewares/error.middleware.js';

export class DSPController {
  // GET /api/dsp/status
  static getDSPStatus = asyncHandler(async (req: Request, res: Response) => {
    const status = await DSPService.getDSPStatus();

    res.json({
      success: true,
      data: status
    });
  });

  // GET /api/dsp/available
  static getAvailableDSPs = asyncHandler(async (req: Request, res: Response) => {
    const dsps = await DSPService.getAvailableDSPs();

    res.json({
      success: true,
      data: dsps
    });
  });

  // GET /api/dsp/stats
  static getDSPStats = asyncHandler(async (req: Request, res: Response) => {
    const stats = await DSPService.getDSPDeliveryStats();

    res.json({
      success: true,
      data: stats
    });
  });

  // GET /api/dsp/admin/all
  static getAllDSPs = asyncHandler(async (req: Request, res: Response) => {
    const dsps = await DSPService.getAllDSPs();

    res.json({
      success: true,
      data: dsps
    });
  });

  // POST /api/dsp/admin/create
  static createDSP = asyncHandler(async (req: Request, res: Response) => {
    const dsp = await DSPService.createDSP(req.body);

    res.status(201).json({
      success: true,
      data: dsp,
      message: 'DSP created successfully'
    });
  });

  // PUT /api/dsp/admin/:id/status
  static updateDSPStatus = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const dsp = await DSPService.updateDSPStatus(id, req.body);

    if (!dsp) {
      return res.status(404).json({
        success: false,
        error: 'DSP not found'
      });
    }

    res.json({
      success: true,
      data: dsp,
      message: 'DSP status updated successfully'
    });
  });

  // POST /api/dsp/admin/initialize
  static initializeDSPs = asyncHandler(async (req: Request, res: Response) => {
    await DSPService.initializeDefaultDSPs();

    res.json({
      success: true,
      message: 'Default DSPs initialized successfully'
    });
  });
}
