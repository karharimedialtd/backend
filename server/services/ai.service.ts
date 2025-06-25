import { AIModel } from '../models/ai.model.js';

export class AIService {
  // Generate metadata from audio and prompt
  static async generateMetadata(audioBuffer: Buffer, prompt: string) {
    return await AIModel.generateMetadata(audioBuffer, prompt);
  }

  // Generate cover art prompt
  static async generateCoverArtPrompt(metadata: {
    title?: string;
    artist?: string;
    genre?: string;
    mood?: string;
  }): Promise<string> {
    return await AIModel.generateCoverArtPrompt(metadata);
  }

  // Forecast revenue
  static async forecastRevenue(trackMetadata: {
    genre?: string;
    duration?: number;
    mood?: string;
    tags?: string[];
  }) {
    return await AIModel.forecastRevenue(trackMetadata);
  }

  // Suggest upload time
  static async suggestUploadTime(trackMetadata: {
    genre?: string;
    target_audience?: string;
  }) {
    return await AIModel.suggestUploadTime(trackMetadata);
  }
}
