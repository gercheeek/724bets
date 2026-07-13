// ================================================================
// lib/supabase.ts — Supabase Client Factory
// ================================================================
// Two exported functions:
//   createServerClient()  → Service Role client (bypasses RLS, server-only)
//   createBrowserClient() → Anon client singleton (for client components)
// ================================================================

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// ── Server client (no singleton — safe for edge/serverless) ───────
export function createServerClient(): SupabaseClient {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      '[Supabase] SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in environment variables.'
    );
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

// ── Browser client (module-level singleton) ───────────────────────
let browserClientInstance: SupabaseClient | null = null;

export function createBrowserClient(): SupabaseClient {
  if (browserClientInstance) return browserClientInstance;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || (import.meta as any).env?.VITE_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      '[Supabase] SUPABASE_URL and SUPABASE_ANON_KEY must be set in environment variables.'
    );
  }

  browserClientInstance = createClient(url, key);
  return browserClientInstance;
}
