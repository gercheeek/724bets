import { createClient } from '@supabase/supabase-js';

// Vite injects VITE_ prefixed env vars into import.meta.env at build time.
// Fallback to hardcoded public (anon) values — these are safe to expose client-side.
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://eaxtuvjcanakaqetuqlc.supabase.co';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'sb_publishable_nzbN9-CrSawHUxEZNYZBzg_WOlgQ9X0';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is missing. Fallbacks not loaded properly.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- Global Config Helpers ---

export async function getGlobalConfig(key: string) {
  const { data, error } = await supabase
    .from('site_configs')
    .select('value')
    .eq('key', key)
    .limit(1)
    .maybeSingle();
  
  if (error) {
    console.error(`Supabase fetch error for key '${key}':`, error);
    return null;
  }
  return data ? data.value : null;
}

export async function updateGlobalConfig(key: string, value: any) {
  const { error } = await supabase
    .from('site_configs')
    .upsert({ key, value, updated_at: new Date().toISOString() });
  
  return { error };
}
