import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://eaxtuvjcanakaqetuqlc.supabase.co', 'sb_publishable_nzbN9-CrSawHUxEZNYZBzg_WOlgQ9X0');

async function testRpc() {
  const { data, error } = await supabase.rpc('process_game_bet', {
    p_user_id: 'e13cf620-bdc8-47ad-ae27-cc21183cf9b3',
    p_bet_amount: 0,
    p_win_amount: 0,
    p_game_name: 'Test'
  });
  
  console.log('Result:', data);
  console.log('Error:', error);
}

testRpc();
