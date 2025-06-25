import { Request, Response } from 'express';
import { AdminService } from '../services/admin.service.js';
import { asyncHandler } from '../middlewares/error.middleware.js';

export class AdminController {
  // GET /api/admin/dashboard
  static getDashboard = asyncHandler(async (req: Request, res: Response) => {
    const stats = await AdminService.getDashboardStats();

    res.json({
      success: true,
      data: stats
    });
  });

  // GET /api/admin/stats
  static getStats = asyncHandler(async (req: Request, res: Response) => {
    const stats = await AdminService.getSystemStats();

    res.json({
      success: true,
      data: stats
    });
  });

  // GET /api/admin/analytics
  static getAnalytics = asyncHandler(async (req: Request, res: Response) => {
    const days = parseInt(req.query.days as string) || 30;
    const analytics = await AdminService.getRevenueAnalytics(days);

    res.json({
      success: true,
      data: analytics
    });
  });

  // GET /api/admin/recent-activity
  static getRecentActivity = asyncHandler(async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 10;
    const activity = await AdminService.getRecentActivity(limit);

    res.json({
      success: true,
      data: activity
    });
  });

  // GET /api/admin/users
  static getUsers = asyncHandler(async (req: Request, res: Response) => {
    const { status, role } = req.query;
    const users = await AdminService.getAllUsers({ 
      status: status as string, 
      role: role as string 
    });

    res.json({
      success: true,
      data: users
    });
  });

  // GET /api/admin/users/:id
  static getUserById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await AdminService.getUserById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  });

  // PUT /api/admin/users/:id
  static updateUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await AdminService.updateUser(id, req.body);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user,
      message: 'User updated successfully'
    });
  });

  // DELETE /api/admin/users/:id
  static deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const success = await AdminService.deleteUser(id);

    if (!success) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  });

  // POST /api/admin/users/:id/assign-role
  static assignRole = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { role } = req.body;

    const user = await AdminService.assignRole(id, role);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user,
      message: `Role assigned to ${role} successfully`
    });
  });

  // GET /api/admin/access-requests
  static getAccessRequests = asyncHandler(async (req: Request, res: Response) => {
    const { status } = req.query;
    const requests = await AdminService.getAccessRequests(status as string);

    res.json({
      success: true,
      data: requests
    });
  });

  // POST /api/admin/access-requests/:id/approve
  static approveAccessRequest = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await AdminService.approveAccessRequest(id, req.user!.id);

    res.json({
      success: true,
      data: user,
      message: 'Access request approved successfully'
    });
  });

  // POST /api/admin/access-requests/:id/reject
  static rejectAccessRequest = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { reason } = req.body;

    await AdminService.rejectAccessRequest(id, req.user!.id, reason);

    res.json({
      success: true,
      message: 'Access request rejected'
    });
  });
}
