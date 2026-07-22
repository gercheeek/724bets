import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://eaxtuvjcanakaqetuqlc.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_nzbN9-CrSawHUxEZNYZBzg_WOlgQ9X0';
const supabase = createClient(supabaseUrl, supabaseKey);

async function resetBalances() {
  console.log('🔄 Tüm bakiyeler sıfırlanıyor...');
  
  // Update all
  const { error: errAll, data: dataAll } = await supabase
    .from('members')
    .update({ balance: 0 })
    .not('id', 'eq', '00000000-0000-0000-0000-000000000000'); // Just a dummy condition to update all

  if (errAll) {
    console.error('❌ Hata:', errAll);
  } else {
    console.log('✅ Tüm bakiyeler sıfırlandı.');
  }

  // Update admin
  const { error: errAdmin } = await supabase
    .from('members')
    .update({ balance: 10.00 })
    .ilike('username', '%admin%');
    
  if (errAdmin) console.error('Admin update error:', errAdmin);
  else console.log('✅ Admin bakiyesi 10.00 TL yapıldı.');

  // Update Ecem
  const { error: errEcem } = await supabase
    .from('members')
    .update({ balance: 10000 })
    .ilike('username', '%ecem%');
    
  if (errEcem) console.error('Ecem update error:', errEcem);
  else console.log('✅ Ecem bakiyesi 10,000 TL yapıldı.');
}

resetBalances();
