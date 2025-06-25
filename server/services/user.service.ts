import { UserModel } from '../models/user.model.js';
import { MusicModel } from '../models/music.model.js';
import { RoyaltiesModel } from '../models/royalties.model.js';
import { SupportModel } from '../models/support.model.js';
import { User, UserProfile } from '../types/supabase.types.js';

export class UserService {
  // Get user profile
  static async getProfile(userId: string): Promise<UserProfile | null> {
    return await UserModel.getProfile(userId);
  }

  // Update user profile
  static async updateProfile(userId: string, profileData: Partial<UserProfile>): Promise<UserProfile | null> {
    return await UserModel.updateProfile(userId, profileData);
  }

  // Get user dashboard data
  static async getDashboardData(userId: string) {
    const [
      profile,
      tracks,
      distributions,
      earnings,
      tickets
    ] = await Promise.all([
      UserModel.getProfile(userId),
      MusicModel.findTracksByUser(userId),
      MusicModel.findDistributionsByUser(userId),
      RoyaltiesModel.getUserEarningsSummary(userId),
      SupportModel.findTicketsByUser(userId)
    ]);

    return {
      profile,
      stats: {
        total_tracks: tracks.length,
        active_distributions: distributions.filter(d => d.status === 'delivered').length,
        total_earnings: earnings.total,
        open_tickets: tickets.filter(t => t.status === 'open').length
      },
      recent_tracks: tracks.slice(0, 5),
      recent_distributions: distributions.slice(0, 5),
      earnings_summary: earnings
    };
  }

  // Get user earnings
  static async getEarnings(userId: string) {
    const [summary, royalties, availableBalance] = await Promise.all([
      RoyaltiesModel.getUserEarningsSummary(userId),
      RoyaltiesModel.findRoyaltiesByUser(userId),
      RoyaltiesModel.getAvailableBalance(userId)
    ]);

    return {
      summary,
      available_balance: availableBalance,
      recent_royalties: royalties.slice(0, 20),
      earnings_by_month: this.groupRoyaltiesByMonth(royalties)
    };
  }

  // Get user activity
  static async getActivity(userId: string, limit: number = 20) {
    const [tracks, distributions, tickets] = await Promise.all([
      MusicModel.findTracksByUser(userId),
      MusicModel.findDistributionsByUser(userId),
      SupportModel.findTicketsByUser(userId)
    ]);

    // Combine and sort by date
    const activities = [
      ...tracks.map(track => ({
        type: 'track_created',
        data: track,
        date: track.created_at
      })),
      ...distributions.map(dist => ({
        type: 'distribution_created',
        data: dist,
        date: dist.created_at
      })),
      ...tickets.map(ticket => ({
        type: 'ticket_created',
        data: ticket,
        date: ticket.created_at
      }))
    ];

    return activities
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  }

  // Get user statistics
  static async getStatistics(userId: string) {
    const [
      tracks,
      distributions,
      earnings,
      tickets,
      payouts
    ] = await Promise.all([
      MusicModel.findTracksByUser(userId),
      MusicModel.findDistributionsByUser(userId),
      RoyaltiesModel.getUserEarningsSummary(userId),
      SupportModel.findTicketsByUser(userId),
      RoyaltiesModel.findPayoutRequestsByUser(userId)
    ]);

    return {
      tracks: {
        total: tracks.length,
        by_status: this.groupByField(tracks, 'status')
      },
      distributions: {
        total: distributions.length,
        by_status: this.groupByField(distributions, 'status')
      },
      earnings: earnings,
      support: {
        total_tickets: tickets.length,
        by_status: this.groupByField(tickets, 'status'),
        by_priority: this.groupByField(tickets, 'priority')
      },
      payouts: {
        total_requests: payouts.length,
        by_status: this.groupByField(payouts, 'status'),
        total_amount: payouts.reduce((sum, p) => sum + p.amount, 0)
      }
    };
  }

  // Helper methods
  private static groupRoyaltiesByMonth(royalties: any[]) {
    const monthlyEarnings: Record<string, number> = {};
    
    royalties.forEach(royalty => {
      const month = new Date(royalty.created_at).toISOString().slice(0, 7); // YYYY-MM
      monthlyEarnings[month] = (monthlyEarnings[month] || 0) + royalty.amount;
    });

    return Object.entries(monthlyEarnings)
      .map(([month, amount]) => ({ month, amount }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  private static groupByField(items: any[], field: string): Record<string, number> {
    const grouped: Record<string, number> = {};
    
    items.forEach(item => {
      const value = item[field] || 'unknown';
      grouped[value] = (grouped[value] || 0) + 1;
    });

    return grouped;
  }
}
