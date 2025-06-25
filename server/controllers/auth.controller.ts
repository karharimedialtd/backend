import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service.js';
import { asyncHandler } from '../middlewares/error.middleware.js';

export class AuthController {
  // POST /api/auth/login
  static login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const result = await AuthService.login(email, password);
    
    if (!result) {
      return res.status(401).json({
        success: false,
        error: 'Authentication failed',
        message: 'Invalid email or password'
      });
    }

    res.json({
      success: true,
      data: {
        user: result.user,
        token: result.token
      },
      message: 'Login successful'
    });
  });

  // POST /api/auth/request-access
  static requestAccess = asyncHandler(async (req: Request, res: Response) => {
    const { email, full_name, reason } = req.body;

    const accessRequest = await AuthService.requestAccess({
      email,
      full_name,
      reason
    });

    res.status(201).json({
      success: true,
      data: accessRequest,
      message: 'Access request submitted successfully'
    });
  });

  // GET /api/auth/me
  static getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated',
        message: 'User not found in request'
      });
    }

    const user = await AuthService.getCurrentUser(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        message: 'User account no longer exists'
      });
    }

    res.json({
      success: true,
      data: user
    });
  });

  // POST /api/auth/verify-token
  static verifyToken = asyncHandler(async (req: Request, res: Response) => {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        error: 'Token required',
        message: 'Token is required for verification'
      });
    }

    const user = await AuthService.verifyToken(token);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
        message: 'Token is invalid or expired'
      });
    }

    res.json({
      success: true,
      data: { user },
      message: 'Token is valid'
    });
  });

  // POST /api/auth/change-password
  static changePassword = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated'
      });
    }

    const { currentPassword, newPassword } = req.body;

    await AuthService.changePassword(req.user.id, currentPassword, newPassword);

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  });

  // POST /api/auth/request-password-reset
  static requestPasswordReset = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;

    await AuthService.requestPasswordReset(email);

    res.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent'
    });
  });

  // POST /api/auth/logout
  static logout = asyncHandler(async (req: Request, res: Response) => {
    // Since we're using stateless JWT, logout is handled client-side
    // Server just acknowledges the logout request
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  });
}
