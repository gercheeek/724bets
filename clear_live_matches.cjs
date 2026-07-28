require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function clearLiveMatches() {
  const { data, error } = await supabase.from('live_matches').delete().neq('id', 'dummy');
  if (error) {
    console.error('Error deleting:', error);
  } else {
    console.log('Cleared live_matches table successfully.');
  }
}

clearLiveMatches();
