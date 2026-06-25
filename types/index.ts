// ================================================================
// types/index.ts — Shared TypeScript Types
// ================================================================

export type RaffleStatus = 'draft' | 'active' | 'completed' | 'cancelled';

export interface User {
  id: string;
  username: string;
  coin_balance: number;
  created_at: string;
}

export interface LiveCode {
  id: string;
  code: string;
  reward_coin: number;
  max_winners: number;
  is_active: boolean;
  created_at: string;
}

export interface CodeClaim {
  id: string;
  user_id: string;
  code_id: string;
  claimed_at: string;
}

export interface Raffle {
  id: string;
  title: string;
  description: string | null;
  ticket_price: number;
  status: RaffleStatus;
  created_at: string;
  // Virtual fields populated by queries
  total_tickets?: number;
  max_tickets?: number;
  image_url?: string;
  end_date?: string;
}

export interface Ticket {
  id: string;
  user_id: string;
  raffle_id: string;
  win_chance_multiplier: number;
  created_at: string;
  // Joined fields
  user?: Pick<User, 'id' | 'username'>;
}

// ── API Request/Response types ─────────────────────────────────

export interface RaffleParticipant {
  user_id: string;
  username: string;
  ticket_count: number;
  total_weight: number; // sum of win_chance_multiplier
}

// POST body for Aksiyon A — update multiplier
export interface UpdateMultiplierBody {
  action: 'update_multiplier';
  raffle_id: string;
  user_id: string;
  multiplier: number;
}

// POST body for Aksiyon B — pick winner
export interface PickWinnerBody {
  action: 'pick_winner';
  raffle_id: string;
  forced_user_id?: string; // optional: admin override
}

export type AdminRafflePostBody = UpdateMultiplierBody | PickWinnerBody;

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
}

// RPC claim_live_code response shape
export interface ClaimCodeResult {
  success: boolean;
  reward_coin?: number;
  new_balance?: number;
  message: string;
  error_code?: 'CODE_NOT_FOUND' | 'ALREADY_CLAIMED' | 'LIMIT_REACHED';
}
