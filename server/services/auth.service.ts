import bcrypt from 'bcryptjs';
import { UserModel } from '../models/user.model.js';
import { signToken } from '../utils/jwt.js';
import { sendEmail, emailTemplates } from '../utils/mailer.js';
import { User, AccessRequest } from '../types/supabase.types.js';

export class AuthService {
  // Login user
  static async login(email: string, password: string): Promise<{
    user: User;
    token: string;
  } | null> {
    // Find user by email
    const user = await UserModel.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check if user is approved
    if (user.status !== 'approved') {
      throw new Error('Account pending approval');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT token
    const token = signToken(user);

    // Return user (without password) and token
    const { password: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword as User,
      token
    };
  }

  // Request access
  static async requestAccess(accessData: {
    email: string;
    full_name: string;
    reason: string;
  }): Promise<AccessRequest> {
    // Check if email already exists
    const existingUser = await UserModel.findByEmail(accessData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Check if there's already a pending request
    const existingRequests = await UserModel.getAccessRequests('pending');
    const existingRequest = existingRequests.find(req => req.email === accessData.email);
    if (existingRequest) {
      throw new Error('Access request already pending for this email');
    }

    // Create access request
    const accessRequest = await UserModel.createAccessRequest({
      ...accessData,
      status: 'pending'
    });

    if (!accessRequest) {
      throw new Error('Failed to create access request');
    }

    // Send confirmation email
    const template = emailTemplates.accessRequestReceived(accessData.full_name);
    await sendEmail({
      to: accessData.email,
      subject: template.subject,
      html: template.html
    });

    return accessRequest;
  }

  // Get current user info
  static async getCurrentUser(userId: string): Promise<User | null> {
    return await UserModel.findById(userId);
  }

  // Verify token (for middleware)
  static async verifyToken(token: string): Promise<User | null> {
    try {
      const { verifyToken } = await import('../utils/jwt.js');
      const payload = verifyToken(token);
      return await UserModel.findById(payload.userId);
    } catch (error) {
      return null;
    }
  }

  // Change password
  static async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await UserModel.update(userId, { password: hashedNewPassword });
  }

  // Request password reset (placeholder for future implementation)
  static async requestPasswordReset(email: string): Promise<void> {
    const user = await UserModel.findByEmail(email);
    if (!user) {
      // Don't reveal if email exists or not
      return;
    }

    // TODO: Implement password reset logic
    // 1. Generate reset token
    // 2. Store token with expiry
    // 3. Send reset email
    
    console.log(`Password reset requested for ${email}`);
  }
}
