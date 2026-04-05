import { createClient } from '@supabase/supabase-js';

// Vite injects VITE_ prefixed env vars into import.meta.env at build time.
// Fallback to hardcoded public (anon) values — these are safe to expose client-side.
const supabaseUrl =
  (import.meta as any).env?.VITE_SUPABASE_URL ||
  'https://eaxtuvjcanakaqetuqlc.supabase.co';

const supabaseAnonKey =
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_nzbN9-CrSawHUxEZNYZBzg_WOlgQ9X0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
