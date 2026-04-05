import { createClient } from '@supabase/supabase-js';

// Vite injects VITE_ prefixed env vars into import.meta.env at build time.
// Fallback to hardcoded public (anon) values — these are safe to expose client-side.
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is missing. Please check Vercel environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
