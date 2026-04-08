import { createClient } from '@supabase/supabase-js';

// Vite injects VITE_ prefixed env vars into import.meta.env at build time.
// Fallback to hardcoded public (anon) values — these are safe to expose client-side.
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is missing. Please check Vercel environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- Global Config Helpers ---

export async function getGlobalConfig(key: string) {
  const { data, error } = await supabase
    .from('site_configs')
    .select('value')
    .eq('key', key)
    .single();
  
  if (error) return null;
  return data.value;
}

export async function updateGlobalConfig(key: string, value: any) {
  const { error } = await supabase
    .from('site_configs')
    .upsert({ key, value, updated_at: new Date().toISOString() });
  
  return { error };
}
