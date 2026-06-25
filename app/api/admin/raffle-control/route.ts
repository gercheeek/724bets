// ================================================================
// app/api/admin/raffle-control/route.ts
// Admin Route Handler — GET (participants) & POST (mutate raffle)
//
// DB NOTE: Add winner_id column to raffles table if not already present:
//   ALTER TABLE raffles ADD COLUMN winner_id UUID REFERENCES users(id);
// ================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import type {
  AdminRafflePostBody,
  RaffleParticipant,
  ApiResponse,
} from '@/types';

// ── Auth Guard ────────────────────────────────────────────────────
function checkAdminKey(req: NextRequest): NextResponse | null {
  const secret = process.env.ADMIN_SECRET_KEY;
  if (!secret) {
    return NextResponse.json<ApiResponse>(
      { error: 'Server misconfiguration: ADMIN_SECRET_KEY is not set.' },
      { status: 500 }
    );
  }
  const provided = req.headers.get('x-admin-key');
  if (provided !== secret) {
    return NextResponse.json<ApiResponse>(
      { error: 'Unauthorized: invalid or missing x-admin-key header.' },
      { status: 401 }
    );
  }
  return null; // OK
}

// ================================================================
// GET /api/admin/raffle-control?raffle_id=<uuid>
//
// Returns all participants for a raffle with:
//   user_id, username, ticket_count, total_weight
// ================================================================
export async function GET(request: NextRequest): Promise<NextResponse> {
  // Auth
  const authError = checkAdminKey(request);
  if (authError) return authError;

  const raffle_id = request.nextUrl.searchParams.get('raffle_id');
  if (!raffle_id) {
    return NextResponse.json<ApiResponse>(
      { error: 'Missing required query parameter: raffle_id' },
      { status: 400 }
    );
  }

  try {
    const supabase = createServerClient();

    // 1. Fetch all tickets for the raffle
    const { data: tickets, error: ticketErr } = await supabase
      .from('tickets')
      .select('user_id, win_chance_multiplier')
      .eq('raffle_id', raffle_id);

    if (ticketErr) throw ticketErr;
    if (!tickets || tickets.length === 0) {
      return NextResponse.json<ApiResponse<RaffleParticipant[]>>({ data: [] });
    }

    // 2. Aggregate in JS: ticket_count + total_weight per user
    const map = new Map<string, { ticket_count: number; total_weight: number }>();
    for (const t of tickets) {
      const prev = map.get(t.user_id) ?? { ticket_count: 0, total_weight: 0 };
      map.set(t.user_id, {
        ticket_count: prev.ticket_count + 1,
        total_weight: prev.total_weight + Number(t.win_chance_multiplier),
      });
    }

    const userIds = Array.from(map.keys());

    // 3. Batch-fetch usernames in a single query
    const { data: users, error: userErr } = await supabase
      .from('users')
      .select('id, username')
      .in('id', userIds);

    if (userErr) throw userErr;

    const usernameMap = new Map((users ?? []).map((u) => [u.id, u.username]));

    // 4. Build response array
    const participants: RaffleParticipant[] = Array.from(map.entries()).map(
      ([user_id, agg]) => ({
        user_id,
        username: usernameMap.get(user_id) ?? 'Unknown',
        ticket_count: agg.ticket_count,
        total_weight: Math.round(agg.total_weight * 100) / 100,
      })
    );

    // Sort by total_weight descending
    participants.sort((a, b) => b.total_weight - a.total_weight);

    return NextResponse.json<ApiResponse<RaffleParticipant[]>>({ data: participants });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json<ApiResponse>({ error: message }, { status: 500 });
  }
}

// ================================================================
// POST /api/admin/raffle-control
//
// Body: AdminRafflePostBody (update_multiplier | pick_winner)
// ================================================================
export async function POST(request: NextRequest): Promise<NextResponse> {
  // Auth
  const authError = checkAdminKey(request);
  if (authError) return authError;

  let body: AdminRafflePostBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json<ApiResponse>(
      { error: 'Invalid JSON body.' },
      { status: 400 }
    );
  }

  const supabase = createServerClient();

  // ── AKSIYON A: update_multiplier ───────────────────────────────
  if (body.action === 'update_multiplier') {
    const { raffle_id, user_id, multiplier } = body;

    if (!raffle_id || !user_id || typeof multiplier !== 'number' || multiplier <= 0) {
      return NextResponse.json<ApiResponse>(
        { error: 'update_multiplier requires: raffle_id, user_id, multiplier (> 0).' },
        { status: 400 }
      );
    }

    try {
      const { error } = await supabase
        .from('tickets')
        .update({ win_chance_multiplier: multiplier })
        .eq('raffle_id', raffle_id)
        .eq('user_id', user_id);

      if (error) throw error;

      return NextResponse.json<ApiResponse<{ message: string }>>({
        data: {
          message: `win_chance_multiplier updated to ${multiplier}x for user ${user_id}.`,
        },
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'DB error';
      return NextResponse.json<ApiResponse>({ error: message }, { status: 500 });
    }
  }

  // ── AKSIYON B: pick_winner ─────────────────────────────────────
  if (body.action === 'pick_winner') {
    const { raffle_id, forced_user_id } = body;

    if (!raffle_id) {
      return NextResponse.json<ApiResponse>(
        { error: 'pick_winner requires: raffle_id.' },
        { status: 400 }
      );
    }

    try {
      // Fetch all tickets for this raffle
      const { data: tickets, error: ticketErr } = await supabase
        .from('tickets')
        .select('user_id, win_chance_multiplier')
        .eq('raffle_id', raffle_id);

      if (ticketErr) throw ticketErr;
      if (!tickets || tickets.length === 0) {
        return NextResponse.json<ApiResponse>(
          { error: 'No tickets found for this raffle.' },
          { status: 400 }
        );
      }

      let winner_id: string;

      if (forced_user_id) {
        // Validate forced_user_id is a real participant
        const participantIds = new Set(tickets.map((t) => t.user_id));
        if (!participantIds.has(forced_user_id)) {
          return NextResponse.json<ApiResponse>(
            { error: 'forced_user_id is not a participant in this raffle.' },
            { status: 400 }
          );
        }
        winner_id = forced_user_id;
      } else {
        // Build weighted pool: push user_id Math.round(multiplier) times (min 1)
        const pool: string[] = [];
        for (const ticket of tickets) {
          const weight = Math.max(1, Math.round(Number(ticket.win_chance_multiplier)));
          for (let i = 0; i < weight; i++) {
            pool.push(ticket.user_id);
          }
        }
        winner_id = pool[Math.floor(Math.random() * pool.length)];
      }

      // Resolve winner username
      const { data: winnerUser, error: userErr } = await supabase
        .from('users')
        .select('id, username')
        .eq('id', winner_id)
        .single();

      if (userErr) throw userErr;

      // Update raffle: set status = completed and winner_id
      const { error: updateErr } = await supabase
        .from('raffles')
        .update({ status: 'completed', winner_id })
        .eq('id', raffle_id);

      if (updateErr) throw updateErr;

      return NextResponse.json<ApiResponse<{ winner_id: string; winner_username: string; message: string }>>({
        data: {
          winner_id,
          winner_username: winnerUser.username,
          message: `🎉 Kazanan belirlendi: @${winnerUser.username}`,
        },
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'DB error';
      return NextResponse.json<ApiResponse>({ error: message }, { status: 500 });
    }
  }

  // Unknown action
  return NextResponse.json<ApiResponse>(
    { error: `Unknown action: "${(body as { action?: string }).action}". Use 'update_multiplier' or 'pick_winner'.` },
    { status: 400 }
  );
}
