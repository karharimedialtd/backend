import { RoyaltiesModel } from '../models/royalties.model.js';
import { mailer } from '../utils/mailer.js';
import { UserModel } from '../models/user.model.js';
import { PayoutRequest } from '../types/supabase.types.js';

export class PayoutService {
  // Get user payouts
  static async getUserPayouts(userId: string): Promise<PayoutRequest[]> {
    return await RoyaltiesModel.findPayoutRequestsByUser(userId);
  }

  // Request payout
  static async requestPayout(userId: string, payoutData: any): Promise<PayoutRequest | null> {
    // Check available balance
    const availableBalance = await RoyaltiesModel.getAvailableBalance(userId);
    
    if (payoutData.amount > availableBalance) {
      throw new Error('Insufficient balance for payout request');
    }

    // Minimum payout amount check
    if (payoutData.amount < 25) {
      throw new Error('Minimum payout amount is $25');
    }

    const payout = await RoyaltiesModel.createPayoutRequest({
      ...payoutData,
      user_id: userId,
      status: 'pending'
    });

    return payout;
  }

  // Get payout by ID (with user check)
  static async getPayoutById(payoutId: string, userId: string): Promise<PayoutRequest | null> {
    const payouts = await RoyaltiesModel.findPayoutRequestsByUser(userId);
    return payouts.find(p => p.id === payoutId) || null;
  }

  // Admin methods
  static async getAllPayouts(filters?: { status?: string }): Promise<PayoutRequest[]> {
    return await RoyaltiesModel.findAllPayoutRequests(filters);
  }

  static async approvePayout(payoutId: string, adminId: string): Promise<PayoutRequest | null> {
    const payout = await RoyaltiesModel.updatePayoutRequest(payoutId, {
      status: 'approved',
      reviewed_by: adminId,
      reviewed_at: new Date().toISOString()
    });

    if (payout) {
      // Get user info for email
      const user = await UserModel.findById(payout.user_id);
      if (user) {
        // Send approval email
        await mailer.sendPayoutApprovedEmail(user.email, payout.amount, payout.currency);
      }
    }

    return payout;
  }

  static async rejectPayout(
    payoutId: string, 
    adminId: string, 
    reason?: string
  ): Promise<PayoutRequest | null> {
    return await RoyaltiesModel.updatePayoutRequest(payoutId, {
      status: 'rejected',
      reviewed_by: adminId,
      reviewed_at: new Date().toISOString()
    });
  }

  static async processPayout(payoutId: string, adminId: string): Promise<PayoutRequest | null> {
    return await RoyaltiesModel.updatePayoutRequest(payoutId, {
      status: 'processed',
      processed_at: new Date().toISOString()
    });
  }
}
