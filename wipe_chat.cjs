const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function wipe() {
  console.log("Wiping tv_chat...");
  const { data, error } = await supabase.from('tv_chat').delete().not('id', 'is', null);
  if (error) console.error("Error wiping chat:", error);
  else console.log("Chat wiped successfully.");
}

wipe();
