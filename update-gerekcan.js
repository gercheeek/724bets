import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://eaxtuvjcanakaqetuqlc.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_nzbN9-CrSawHUxEZNYZBzg_WOlgQ9X0';
const supabase = createClient(supabaseUrl, supabaseKey);

async function updateUser() {
  const { error, data } = await supabase
    .from('members')
    .update({ balance: 25000.00, role: 'admin' })
    .eq('email', 'mrgercheeek@gmail.com');
    
  if (error) {
    console.error('❌ Hata:', error);
  } else {
    console.log('✅ mrgercheeek@gmail.com kullanıcısına 25.000 TL verildi ve Admin yetkisi eklendi.');
  }
}

updateUser();
