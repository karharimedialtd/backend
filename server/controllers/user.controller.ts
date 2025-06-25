import { Request, Response } from 'express';
import { UserService } from '../services/user.service.js';
import { asyncHandler } from '../middlewares/error.middleware.js';

export class UserController {
  // GET /api/user/profile
  static getProfile = asyncHandler(async (req: Request, res: Response) => {
    const profile = await UserService.getProfile(req.user!.id);

    res.json({
      success: true,
      data: profile
    });
  });

  // PUT /api/user/profile
  static updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const profile = await UserService.updateProfile(req.user!.id, req.body);

    res.json({
      success: true,
      data: profile,
      message: 'Profile updated successfully'
    });
  });

  // GET /api/user/dashboard
  static getDashboard = asyncHandler(async (req: Request, res: Response) => {
    const dashboardData = await UserService.getDashboardData(req.user!.id);

    res.json({
      success: true,
      data: dashboardData
    });
  });

  // GET /api/user/earnings
  static getEarnings = asyncHandler(async (req: Request, res: Response) => {
    const earnings = await UserService.getEarnings(req.user!.id);

    res.json({
      success: true,
      data: earnings
    });
  });

  // GET /api/user/activity
  static getActivity = asyncHandler(async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 20;
    const activity = await UserService.getActivity(req.user!.id, limit);

    res.json({
      success: true,
      data: activity
    });
  });

  // GET /api/user/statistics
  static getStatistics = asyncHandler(async (req: Request, res: Response) => {
    const statistics = await UserService.getStatistics(req.user!.id);

    res.json({
      success: true,
      data: statistics
    });
  });
}
