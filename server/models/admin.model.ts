import { supabase, supabaseAdmin } from '../config/supabase.js';

export class AdminModel {
  // Dashboard statistics
  static async getDashboardStats(): Promise<{
    users: { total: number; pending: number; approved: number; };
    tracks: { total: number; processing: number; distributed: number; };
    distributions: { total: number; pending: number; delivered: number; failed: number; };
    royalties: { total_amount: number; this_month: number; };
    payouts: { pending: number; total_amount: number; };
    support_tickets: { open: number; urgent: number; };
  }> {
    const [
      { data: users },
      { data: tracks },
      { data: distributions },
      { data: royalties },
      { data: payouts },
      { data: tickets }
    ] = await Promise.all([
      supabaseAdmin.from('users').select('status'),
      supabaseAdmin.from('music_tracks').select('status'),
      supabaseAdmin.from('distributions').select('status'),
      supabaseAdmin.from('royalties').select('amount, created_at'),
      supabaseAdmin.from('payout_requests').select('status, amount'),
      supabaseAdmin.from('support_tickets').select('status, priority')
    ]);

    // Calculate statistics
    const userStats = {
      total: users?.length || 0,
      pending: users?.filter(u => u.status === 'pending').length || 0,
      approved: users?.filter(u => u.status === 'approved').length || 0
    };

    const trackStats = {
      total: tracks?.length || 0,
      processing: tracks?.filter(t => t.status === 'processing').length || 0,
      distributed: tracks?.filter(t => t.status === 'distributed').length || 0
    };

    const distributionStats = {
      total: distributions?.length || 0,
      pending: distributions?.filter(d => d.status === 'pending').length || 0,
      delivered: distributions?.filter(d => d.status === 'delivered').length || 0,
      failed: distributions?.filter(d => d.status === 'failed').length || 0
    };

    const totalRoyalties = royalties?.reduce((sum, r) => sum + r.amount, 0) || 0;
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    
    const thisMonthRoyalties = royalties?.filter(r => new Date(r.created_at) >= thisMonth)
      .reduce((sum, r) => sum + r.amount, 0) || 0;

    const royaltyStats = {
      total_amount: totalRoyalties,
      this_month: thisMonthRoyalties
    };

    const payoutStats = {
      pending: payouts?.filter(p => p.status === 'pending').length || 0,
      total_amount: payouts?.reduce((sum, p) => sum + p.amount, 0) || 0
    };

    const ticketStats = {
      open: tickets?.filter(t => t.status === 'open').length || 0,
      urgent: tickets?.filter(t => t.priority === 'urgent').length || 0
    };

    return {
      users: userStats,
      tracks: trackStats,
      distributions: distributionStats,
      royalties: royaltyStats,
      payouts: payoutStats,
      support_tickets: ticketStats
    };
  }

  // Recent activity
  static async getRecentActivity(limit: number = 10): Promise<{
    recent_distributions: any[];
    recent_users: any[];
    recent_tickets: any[];
  }> {
    const [
      { data: recentDistributions },
      { data: recentUsers },
      { data: recentTickets }
    ] = await Promise.all([
      supabaseAdmin
        .from('distributions')
        .select(`
          *,
          track:music_tracks(title, artist)
        `)
        .order('created_at', { ascending: false })
        .limit(limit),
      
      supabaseAdmin
        .from('users')
        .select(`
          *,
          profile:user_profiles(full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(limit),
      
      supabaseAdmin
        .from('support_tickets')
        .select(`
          *,
          user:users(email, profile:user_profiles(full_name))
        `)
        .order('created_at', { ascending: false })
        .limit(limit)
    ]);

    return {
      recent_distributions: recentDistributions || [],
      recent_users: recentUsers || [],
      recent_tickets: recentTickets || []
    };
  }

  // Revenue analytics
  static async getRevenueAnalytics(days: number = 30): Promise<{
    daily_revenue: Array<{ date: string; amount: number; }>;
    revenue_by_dsp: Record<string, number>;
    top_earning_tracks: Array<{ track_id: string; title: string; artist: string; total_revenue: number; }>;
  }> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data: royalties } = await supabaseAdmin
      .from('royalties')
      .select(`
        amount,
        dsp,
        created_at,
        track:music_tracks(id, title, artist)
      `)
      .gte('created_at', startDate.toISOString());

    // Daily revenue
    const dailyRevenue: Record<string, number> = {};
    const revenueByDSP: Record<string, number> = {};
    const trackRevenue: Record<string, { title: string; artist: string; total: number; }> = {};

    royalties?.forEach(royalty => {
      const date = new Date(royalty.created_at).toISOString().split('T')[0];
      dailyRevenue[date] = (dailyRevenue[date] || 0) + royalty.amount;
      
      revenueByDSP[royalty.dsp] = (revenueByDSP[royalty.dsp] || 0) + royalty.amount;
      
      if (royalty.track) {
        const trackId = royalty.track.id;
        if (!trackRevenue[trackId]) {
          trackRevenue[trackId] = {
            title: royalty.track.title,
            artist: royalty.track.artist,
            total: 0
          };
        }
        trackRevenue[trackId].total += royalty.amount;
      }
    });

    // Convert to arrays and sort
    const dailyRevenueArray = Object.entries(dailyRevenue)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const topEarningTracks = Object.entries(trackRevenue)
      .map(([track_id, data]) => ({
        track_id,
        title: data.title,
        artist: data.artist,
        total_revenue: data.total
      }))
      .sort((a, b) => b.total_revenue - a.total_revenue)
      .slice(0, 10);

    return {
      daily_revenue: dailyRevenueArray,
      revenue_by_dsp: revenueByDSP,
      top_earning_tracks: topEarningTracks
    };
  }
}
