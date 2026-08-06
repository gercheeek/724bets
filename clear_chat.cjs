require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY);
async function clear() {
  const { error } = await supabase.from('tv_chat').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (error) console.error(error);
  else console.log('Chat cleared!');
}
clear();
