require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY);
async function clear() {
  const { data: before } = await supabase.from('tv_chat').select('id, message, username');
  console.log(`Rows before: ${before ? before.length : 0}`);
  
  if (before && before.length > 0) {
    const { error } = await supabase.from('tv_chat').delete().not('id', 'is', null);
    if (error) console.error('Delete error:', error);
    else console.log('Chat cleared!');
  }
  
  const { data: after } = await supabase.from('tv_chat').select('id');
  console.log(`Rows after: ${after ? after.length : 0}`);
}
clear();
