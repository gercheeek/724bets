import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eaxtuvjcanakaqetuqlc.supabase.co';
const supabaseAnonKey = 'sb_publishable_nzbN9-CrSawHUxEZNYZBzg_WOlgQ9X0';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  const { data, error } = await supabase.from('site_configs').select('*').eq('key', 'site_hero_slider').single();
  if (error) {
    console.error("Error fetching config:", error);
    return;
  }
  
  let config = data.value;
  // Let's add the new slide to the beginning or update the existing one.
  const newSlide = {
    id: "tipo-slide-new-" + Date.now(),
    link: "https://tipobet7178.com/bonuses",
    order: -1, // To be first
    title: "Kombine Koruması - Tek Maçtan Yatmaya Son (Yeni)",
    imageUrl: "/banners/yeni-slider.jpg",
    isActive: true
  };
  
  config.slides.unshift(newSlide);
  
  // Reorder
  config.slides.forEach((s, idx) => {
    s.order = idx;
  });

  const { error: updateError } = await supabase.from('site_configs').update({ value: config }).eq('key', 'site_hero_slider');
  
  if (updateError) {
    console.error("Error updating config:", updateError);
  } else {
    console.log("Slider config updated successfully with new slide!");
  }
}

run();
