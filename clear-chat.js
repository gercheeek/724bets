import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://eaxtuvjcanakaqetuqlc.supabase.co', 'sb_publishable_nzbN9-CrSawHUxEZNYZBzg_WOlgQ9X0');
async function clear() {
  const { error } = await supabase.from('tv_chat').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  console.log('Deleted all messages. Error:', error);
}
clear();
