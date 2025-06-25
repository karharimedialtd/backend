import { supabase, supabaseAdmin } from '../config/supabase.js';
import { DSPStatus } from '../types/supabase.types.js';

export class DSPModel {
  // DSP Status methods
  static async findAllDSPs(): Promise<DSPStatus[]> {
    const { data, error } = await supabase
      .from('dsp_statuses')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  }

  static async findDSPById(id: string): Promise<DSPStatus | null> {
    const { data, error } = await supabase
      .from('dsp_statuses')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
  }

  static async findDSPByName(name: string): Promise<DSPStatus | null> {
    const { data, error } = await supabase
      .from('dsp_statuses')
      .select('*')
      .eq('name', name)
      .single();

    if (error) return null;
    return data;
  }

  static async updateDSPStatus(id: string, updates: Partial<DSPStatus>): Promise<DSPStatus | null> {
    const { data, error } = await supabaseAdmin
      .from('dsp_statuses')
      .update({ ...updates, last_check: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async createDSP(dspData: Omit<DSPStatus, 'id'>): Promise<DSPStatus | null> {
    const { data, error } = await supabaseAdmin
      .from('dsp_statuses')
      .insert([dspData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Initialize default DSPs
  static async initializeDefaultDSPs(): Promise<void> {
    const defaultDSPs = [
      { name: 'YouTube Music', status: 'active' as const },
      { name: 'YouTube Content ID', status: 'active' as const },
      { name: 'Facebook Rights Manager', status: 'active' as const },
      { name: 'Facebook Audio Library', status: 'active' as const },
      { name: 'TikTok', status: 'active' as const },
      { name: 'Audius', status: 'active' as const },
      { name: 'SoundCloud', status: 'active' as const },
      { name: 'Bandcamp', status: 'active' as const },
      { name: 'Spotify', status: 'active' as const }
    ];

    for (const dsp of defaultDSPs) {
      const existing = await this.findDSPByName(dsp.name);
      if (!existing) {
        await this.createDSP({
          ...dsp,
          last_check: new Date().toISOString()
        });
      }
    }
  }

  // Get DSP delivery statistics
  static async getDSPDeliveryStats(): Promise<{
    total_deliveries: number;
    successful_deliveries: number;
    failed_deliveries: number;
    pending_deliveries: number;
    by_dsp: Record<string, { total: number; successful: number; failed: number; pending: number }>;
  }> {
    const { data: distributions, error } = await supabaseAdmin
      .from('distributions')
      .select('status, dsps');

    if (error) throw error;

    const stats = {
      total_deliveries: 0,
      successful_deliveries: 0,
      failed_deliveries: 0,
      pending_deliveries: 0,
      by_dsp: {} as Record<string, { total: number; successful: number; failed: number; pending: number }>
    };

    distributions?.forEach(distribution => {
      const dspCount = distribution.dsps?.length || 0;
      stats.total_deliveries += dspCount;

      if (distribution.status === 'delivered') {
        stats.successful_deliveries += dspCount;
      } else if (distribution.status === 'failed') {
        stats.failed_deliveries += dspCount;
      } else if (distribution.status === 'pending' || distribution.status === 'processing') {
        stats.pending_deliveries += dspCount;
      }

      // Count by individual DSP
      distribution.dsps?.forEach((dsp: string) => {
        if (!stats.by_dsp[dsp]) {
          stats.by_dsp[dsp] = { total: 0, successful: 0, failed: 0, pending: 0 };
        }
        
        stats.by_dsp[dsp].total++;
        
        if (distribution.status === 'delivered') {
          stats.by_dsp[dsp].successful++;
        } else if (distribution.status === 'failed') {
          stats.by_dsp[dsp].failed++;
        } else if (distribution.status === 'pending' || distribution.status === 'processing') {
          stats.by_dsp[dsp].pending++;
        }
      });
    });

    return stats;
  }
}
