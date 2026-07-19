import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://eaxtuvjcanakaqetuqlc.supabase.co', 'sb_publishable_nzbN9-CrSawHUxEZNYZBzg_WOlgQ9X0');
async function test() {
  const { data, error } = await supabase.from('tv_chat').select('*').limit(5);
  console.log('Data:', data);
  console.log('Error:', error);
}
test();
