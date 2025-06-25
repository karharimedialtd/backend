import bcrypt from 'bcryptjs';
import { UserModel } from '../models/user.model.js';
import { AdminModel } from '../models/admin.model.js';
import { sendEmail, emailTemplates } from '../utils/mailer.js';
import { User, AccessRequest } from '../types/supabase.types.js';

export class AdminService {
  // Get dashboard statistics
  static async getDashboardStats() {
    return await AdminModel.getDashboardStats();
  }

  // Get recent activity
  static async getRecentActivity(limit?: number) {
    return await AdminModel.getRecentActivity(limit);
  }

  // Get revenue analytics
  static async getRevenueAnalytics(days?: number) {
    return await AdminModel.getRevenueAnalytics(days);
  }

  // User management
  static async getAllUsers(filters?: { status?: string; role?: string }) {
    return await UserModel.findAll(filters);
  }

  static async getUserById(id: string): Promise<User | null> {
    return await UserModel.findById(id);
  }

  static async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    return await UserModel.update(id, updates);
  }

  static async deleteUser(id: string): Promise<boolean> {
    return await UserModel.delete(id);
  }

  // Access request management
  static async getAccessRequests(status?: string): Promise<AccessRequest[]> {
    return await UserModel.getAccessRequests(status);
  }

  static async approveAccessRequest(requestId: string, adminId: string): Promise<User> {
    // Get the access request
    const requests = await UserModel.getAccessRequests();
    const request = requests.find(r => r.id === requestId);
    
    if (!request) {
      throw new Error('Access request not found');
    }

    if (request.status !== 'pending') {
      throw new Error('Access request is not pending');
    }

    // Create user account
    const hashedPassword = await bcrypt.hash('TempPassword123!', 10);
    const user = await UserModel.create({
      email: request.email,
      password: hashedPassword,
      role: 'user',
      status: 'approved'
    });

    if (!user) {
      throw new Error('Failed to create user account');
    }

    // Create user profile
    await UserModel.updateProfile(user.id, {
      full_name: request.full_name
    });

    // Update access request
    await UserModel.updateAccessRequest(requestId, {
      status: 'approved',
      reviewed_by: adminId,
      reviewed_at: new Date().toISOString()
    });

    // Send approval email
    const template = emailTemplates.accessRequestApproved(
      request.full_name,
      'https://cmssingleaudio.com/login'
    );
    await sendEmail({
      to: request.email,
      subject: template.subject,
      html: template.html
    });

    return user;
  }

  static async rejectAccessRequest(
    requestId: string, 
    adminId: string, 
    reason?: string
  ): Promise<void> {
    // Get the access request
    const requests = await UserModel.getAccessRequests();
    const request = requests.find(r => r.id === requestId);
    
    if (!request) {
      throw new Error('Access request not found');
    }

    if (request.status !== 'pending') {
      throw new Error('Access request is not pending');
    }

    // Update access request
    await UserModel.updateAccessRequest(requestId, {
      status: 'rejected',
      reviewed_by: adminId,
      reviewed_at: new Date().toISOString()
    });

    // Send rejection email
    const template = emailTemplates.accessRequestRejected(request.full_name, reason);
    await sendEmail({
      to: request.email,
      subject: template.subject,
      html: template.html
    });
  }

  // Role management
  static async assignRole(userId: string, role: 'admin' | 'user'): Promise<User | null> {
    return await UserModel.update(userId, { role });
  }

  // System statistics
  static async getSystemStats() {
    const stats = await AdminModel.getDashboardStats();
    
    return {
      ...stats,
      system_health: {
        uptime: process.uptime(),
        memory_usage: process.memoryUsage(),
        node_version: process.version
      }
    };
  }
}
