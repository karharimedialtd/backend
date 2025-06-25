import { DSPModel } from '../models/dsp.model.js';
import { DSPStatus } from '../types/supabase.types.js';

export class DSPService {
  // Get DSP status
  static async getDSPStatus(): Promise<DSPStatus[]> {
    return await DSPModel.findAllDSPs();
  }

  // Get available DSPs (active only)
  static async getAvailableDSPs(): Promise<DSPStatus[]> {
    const allDSPs = await DSPModel.findAllDSPs();
    return allDSPs.filter(dsp => dsp.status === 'active');
  }

  // Get DSP delivery statistics
  static async getDSPDeliveryStats() {
    return await DSPModel.getDSPDeliveryStats();
  }

  // Admin methods
  static async getAllDSPs(): Promise<DSPStatus[]> {
    return await DSPModel.findAllDSPs();
  }

  static async createDSP(dspData: Omit<DSPStatus, 'id' | 'last_check'>): Promise<DSPStatus | null> {
    return await DSPModel.createDSP({
      ...dspData,
      last_check: new Date().toISOString()
    });
  }

  static async updateDSPStatus(
    dspId: string, 
    updates: { status: 'active' | 'maintenance' | 'disabled'; error_message?: string }
  ): Promise<DSPStatus | null> {
    return await DSPModel.updateDSPStatus(dspId, updates);
  }

  static async initializeDefaultDSPs(): Promise<void> {
    return await DSPModel.initializeDefaultDSPs();
  }
}
