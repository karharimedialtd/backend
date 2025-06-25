import OpenAI from 'openai';
import { env } from '../config/env.js';

// Initialize OpenAI client if API key is available
const openai = env.OPENAI_API_KEY ? new OpenAI({
  apiKey: env.OPENAI_API_KEY
}) : null;

export class AIModel {
  // Generate metadata from audio and prompt
  static async generateMetadata(audioBuffer: Buffer, prompt: string): Promise<{
    title?: string;
    artist?: string;
    genre?: string;
    mood?: string;
    description?: string;
    tags?: string[];
  }> {
    if (!openai) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      // For now, we'll simulate audio analysis and use the prompt
      // In a real implementation, you'd analyze the audio file
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are a music metadata expert. Based on the user's description of their music track, generate appropriate metadata. Return a JSON object with the following fields: title, artist, genre, mood, description, and tags (array). Be creative but professional.`
          },
          {
            role: "user",
            content: `Please generate metadata for this music track: ${prompt}`
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No response from AI service');
      }

      try {
        return JSON.parse(response);
      } catch {
        // If JSON parsing fails, extract information manually
        return {
          title: this.extractField(response, 'title'),
          artist: this.extractField(response, 'artist'),
          genre: this.extractField(response, 'genre'),
          mood: this.extractField(response, 'mood'),
          description: this.extractField(response, 'description'),
          tags: this.extractTags(response)
        };
      }
    } catch (error) {
      console.error('AI metadata generation failed:', error);
      throw new Error('Failed to generate metadata with AI');
    }
  }

  // Generate cover art prompt
  static async generateCoverArtPrompt(metadata: {
    title?: string;
    artist?: string;
    genre?: string;
    mood?: string;
  }): Promise<string> {
    if (!openai) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a creative director specializing in music album artwork. Generate detailed, artistic prompts for cover art that would work well with AI image generators like DALL-E or Midjourney."
          },
          {
            role: "user",
            content: `Create a cover art prompt for a music track with these details:
            Title: ${metadata.title || 'Unknown'}
            Artist: ${metadata.artist || 'Unknown'}
            Genre: ${metadata.genre || 'Unknown'}
            Mood: ${metadata.mood || 'Unknown'}
            
            The prompt should be detailed, artistic, and suitable for music album cover generation.`
          }
        ],
        temperature: 0.8,
        max_tokens: 200
      });

      return completion.choices[0]?.message?.content || 'Abstract musical artwork with vibrant colors and dynamic composition';
    } catch (error) {
      console.error('Cover art prompt generation failed:', error);
      throw new Error('Failed to generate cover art prompt');
    }
  }

  // Predictive revenue forecasting
  static async forecastRevenue(trackMetadata: {
    genre?: string;
    duration?: number;
    mood?: string;
    tags?: string[];
  }, historicalData?: any[]): Promise<{
    estimated_monthly_revenue: number;
    confidence_level: number;
    factors: string[];
    best_release_time?: string;
  }> {
    if (!openai) {
      // Fallback simple calculation without AI
      return this.simpleForecast(trackMetadata);
    }

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are a music industry analyst with expertise in revenue forecasting. Based on track metadata, provide realistic revenue estimates and insights. Return a JSON object with: estimated_monthly_revenue (number), confidence_level (0-100), factors (array of strings), and best_release_time (string).`
          },
          {
            role: "user",
            content: `Analyze this track for revenue potential:
            Genre: ${trackMetadata.genre || 'Unknown'}
            Duration: ${trackMetadata.duration || 'Unknown'} seconds
            Mood: ${trackMetadata.mood || 'Unknown'}
            Tags: ${trackMetadata.tags?.join(', ') || 'None'}
            
            Consider current market trends, genre popularity, and optimal release timing.`
          }
        ],
        temperature: 0.3,
        max_tokens: 400
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        return this.simpleForecast(trackMetadata);
      }

      try {
        const parsed = JSON.parse(response);
        return {
          estimated_monthly_revenue: parsed.estimated_monthly_revenue || 0,
          confidence_level: parsed.confidence_level || 50,
          factors: parsed.factors || ['AI analysis unavailable'],
          best_release_time: parsed.best_release_time
        };
      } catch {
        return this.simpleForecast(trackMetadata);
      }
    } catch (error) {
      console.error('Revenue forecasting failed:', error);
      return this.simpleForecast(trackMetadata);
    }
  }

  // Suggest optimal upload time
  static async suggestUploadTime(trackMetadata: {
    genre?: string;
    target_audience?: string;
  }): Promise<{
    recommended_date: string;
    recommended_time: string;
    reasoning: string;
    timezone: string;
  }> {
    // Simple logic for demo - in production this would be more sophisticated
    const now = new Date();
    const nextFriday = new Date(now);
    nextFriday.setDate(now.getDate() + (5 - now.getDay() + 7) % 7);

    return {
      recommended_date: nextFriday.toISOString().split('T')[0],
      recommended_time: '09:00',
      reasoning: 'Friday releases typically perform better for streaming platforms',
      timezone: 'UTC'
    };
  }

  // Helper methods
  private static extractField(text: string, field: string): string | undefined {
    const regex = new RegExp(`"${field}":\\s*"([^"]*)"`, 'i');
    const match = text.match(regex);
    return match?.[1];
  }

  private static extractTags(text: string): string[] {
    const tagsMatch = text.match(/"tags":\s*\[([^\]]*)\]/i);
    if (!tagsMatch) return [];
    
    return tagsMatch[1]
      .split(',')
      .map(tag => tag.trim().replace(/"/g, ''))
      .filter(tag => tag.length > 0);
  }

  private static simpleForecast(metadata: { genre?: string; duration?: number }): {
    estimated_monthly_revenue: number;
    confidence_level: number;
    factors: string[];
  } {
    // Simple genre-based estimates (in USD)
    const genreMultipliers: Record<string, number> = {
      'pop': 50,
      'rock': 40,
      'hip-hop': 60,
      'electronic': 45,
      'country': 35,
      'jazz': 25,
      'classical': 20,
      'indie': 30
    };

    const genre = metadata.genre?.toLowerCase() || 'unknown';
    const baseRevenue = genreMultipliers[genre] || 25;
    
    // Duration factor (3-4 minutes is optimal)
    const duration = metadata.duration || 180;
    const durationFactor = duration >= 150 && duration <= 240 ? 1.2 : 1.0;

    const estimatedRevenue = baseRevenue * durationFactor;

    return {
      estimated_monthly_revenue: Math.round(estimatedRevenue),
      confidence_level: 65,
      factors: [
        `Genre: ${genre}`,
        `Duration: ${duration}s`,
        'Based on industry averages'
      ]
    };
  }
}
