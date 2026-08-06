require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY);
async function get() {
  const { data } = await supabase.from('tv_chat').select('*').order('created_at', { ascending: false }).limit(10);
  console.log(JSON.stringify(data, null, 2));
}
get();
