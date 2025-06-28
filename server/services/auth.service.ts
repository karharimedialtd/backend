import bcrypt from 'bcryptjs';
import { UserModel } from '../models/user.model.js';
import { signToken } from '../utils/jwt.js';
import { mailer } from '../utils/mailer.js';
import { User, AccessRequest } from '../types/supabase.types.js';

export class AuthService {
  // 🔐 Login user (any role)
  static async login(email: string, password: string): Promise<{
    user: User;
    token: string;
  } | null> {
    const user = await UserModel.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (user.status !== 'approved') {
      throw new Error('Account pending approval');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const token = signToken({ userId: user.id, email: user.email, role: user.role });

    const { password: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword as User,
      token
    };
  }

  // ✍️ Submit access request
  static async requestAccess(accessData: {
    email: string;
    full_name: string;
    reason: string;
  }): Promise<AccessRequest> {
    const existingUser = await UserModel.findByEmail(accessData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const pendingRequests = await UserModel.getAccessRequests('pending');
    const alreadyPending = pendingRequests.find(req => req.email === accessData.email);
    if (alreadyPending) {
      throw new Error('Access request already pending for this email');
    }

    const accessRequest = await UserModel.createAccessRequest({
      ...accessData,
      status: 'pending'
    });

    if (!accessRequest) {
      throw new Error('Failed to create access request');
    }

    // Optional email notification
    return accessRequest;
  }

  // 👤 Fetch authenticated user
  static async getCurrentUser(userId: string): Promise<User | null> {
    return await UserModel.findById(userId);
  }

  // 🔍 Validate token and return user
  static async verifyToken(token: string): Promise<User | null> {
    try {
      const { verifyToken } = await import('../utils/jwt.js');
      const payload = verifyToken(token);
      return await UserModel.findById(payload.userId);
    } catch (err) {
      return null;
    }
  }

  // 🔑 Change account password
  static async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      throw new Error('Current password is incorrect');
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await UserModel.update(userId, { password: hashed });
  }

  // 🔐 Password reset request (future use)
  static async requestPasswordReset(email: string): Promise<void> {
    const user = await UserModel.findByEmail(email);
    if (!user) return;

    // Future implementation: send email + store reset token
    console.log(`Password reset requested for ${email}`);
  }
}
