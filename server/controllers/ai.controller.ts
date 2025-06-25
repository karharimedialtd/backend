import { Request, Response } from 'express';
import { AIService } from '../services/ai.service.js';
import { asyncHandler } from '../middlewares/error.middleware.js';

export class AIController {
  // POST /api/ai/generate-metadata
  static generateMetadata = asyncHandler(async (req: Request, res: Response) => {
    const audioFile = req.file;
    const { prompt } = req.body;

    if (!audioFile) {
      return res.status(400).json({
        success: false,
        error: 'Audio file is required'
      });
    }

    const metadata = await AIService.generateMetadata(audioFile.buffer, prompt);

    res.json({
      success: true,
      data: metadata,
      message: 'Metadata generated successfully'
    });
  });

  // POST /api/ai/generate-cover-prompt
  static generateCoverArtPrompt = asyncHandler(async (req: Request, res: Response) => {
    const prompt = await AIService.generateCoverArtPrompt(req.body);

    res.json({
      success: true,
      data: { prompt },
      message: 'Cover art prompt generated successfully'
    });
  });

  // POST /api/ai/forecast-revenue
  static forecastRevenue = asyncHandler(async (req: Request, res: Response) => {
    const forecast = await AIService.forecastRevenue(req.body);

    res.json({
      success: true,
      data: forecast,
      message: 'Revenue forecast generated successfully'
    });
  });

  // POST /api/ai/suggest-upload-time
  static suggestUploadTime = asyncHandler(async (req: Request, res: Response) => {
    const suggestion = await AIService.suggestUploadTime(req.body);

    res.json({
      success: true,
      data: suggestion,
      message: 'Upload time suggestion generated successfully'
    });
  });
}
