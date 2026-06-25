import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.VITE_SUPABASE_URL || 'https://eaxtuvjcanakaqetuqlc.supabase.co', process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_nzbN9-CrSawHUxEZNYZBzg_WOlgQ9X0');
async function fix() {
  const { data } = await supabase.from('site_configs').select('value').eq('key', 'site_nav_visibility').single();
  const nav = data?.value;
  nav.giveaway = true;
  await supabase.from('site_configs').update({ value: nav }).eq('key', 'site_nav_visibility');
  console.log("Enabled giveaway in DB.");
}
fix();
