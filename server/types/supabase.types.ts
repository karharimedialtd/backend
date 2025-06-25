export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  status: 'pending' | 'approved' | 'rejected';
  profile?: UserProfile;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  full_name?: string;
  avatar_url?: string;
  phone?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export interface AccessRequest {
  id: string;
  email: string;
  full_name: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
}

export interface MusicTrack {
  id: string;
  user_id: string;
  title: string;
  artist: string;
  album?: string;
  genre?: string;
  release_date?: string;
  duration?: number;
  file_url: string;
  cover_art_url?: string;
  metadata?: Record<string, any>;
  status: 'draft' | 'processing' | 'distributed' | 'failed';
  created_at: string;
  updated_at: string;
}

export interface Distribution {
  id: string;
  track_id: string;
  dsps: string[];
  status: 'pending' | 'processing' | 'delivered' | 'failed';
  delivery_date?: string;
  error_message?: string;
  created_at: string;
  updated_at: string;
}

export interface DSPStatus {
  id: string;
  name: string;
  status: 'active' | 'maintenance' | 'disabled';
  last_check: string;
  error_message?: string;
}

export interface Royalty {
  id: string;
  track_id: string;
  user_id: string;
  dsp: string;
  amount: number;
  currency: string;
  period_start: string;
  period_end: string;
  created_at: string;
}

export interface PayoutRequest {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  method: 'paypal' | 'wise' | 'bank';
  payment_details: Record<string, any>;
  status: 'pending' | 'approved' | 'processed' | 'rejected';
  reviewed_by?: string;
  reviewed_at?: string;
  processed_at?: string;
  created_at: string;
}

export interface SupportTicket {
  id: string;
  user_id: string;
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  assigned_to?: string;
  created_at: string;
  updated_at: string;
}

export interface TicketMessage {
  id: string;
  ticket_id: string;
  user_id: string;
  message: string;
  is_internal: boolean;
  created_at: string;
}

export interface YouTubeChannel {
  id: string;
  user_id: string;
  channel_id: string;
  channel_name: string;
  access_token: string;
  refresh_token: string;
  expires_at: string;
  status: 'active' | 'expired' | 'revoked';
  created_at: string;
}

export interface ContentIDClaim {
  id: string;
  channel_id: string;
  video_id: string;
  claim_id: string;
  asset_id: string;
  status: 'active' | 'disputed' | 'resolved';
  policy: 'monetize' | 'track' | 'block';
  created_at: string;
}

export interface PublishingIdentity {
  id: string;
  user_id: string;
  name: string;
  ipi_number?: string;
  isni_number?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface Composition {
  id: string;
  publishing_identity_id: string;
  title: string;
  iswc?: string;
  writers: Record<string, number>; // writer_id -> percentage
  created_at: string;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
