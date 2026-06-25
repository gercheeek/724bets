import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Parse .env.local manually
const envPath = '/Users/alex/Desktop/7_24bets-landing-page/.env.local';
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    env[match[1]] = match[2].replace(/^["']|["']$/g, '');
  }
});

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or Key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

const analyses = [
  {
    match_name: 'Real Madrid vs Barcelona',
    league: 'La Liga',
    match_date: today.toISOString(),
    prediction: 'MS 1 & 2.5 ÜST',
    odd: 2.15,
    confidence: 90,
    analysis_text: 'El Clasico\'da Real Madrid ev sahibi avantajıyla favori. Son maçlardaki hücum performansı güven veriyor. Yüksek skorlu bir maç bekliyoruz.',
    is_guaranteed: true,
    price: 150,
    status: 'pending'
  },
  {
    match_name: 'Manchester City vs Arsenal',
    league: 'Premier League',
    match_date: today.toISOString(),
    prediction: 'KG VAR',
    odd: 1.65,
    confidence: 85,
    analysis_text: 'İki takım da şampiyonluk yarışında. Hücum güçleri yüksek, karşılıklı goller izleriz.',
    is_guaranteed: false,
    price: 100,
    status: 'pending'
  },
  {
    match_name: 'Galatasaray vs Beşiktaş',
    league: 'Süper Lig',
    match_date: tomorrow.toISOString(),
    prediction: 'MS 1',
    odd: 1.85,
    confidence: 80,
    analysis_text: 'Derbide ev sahibi saha avantajını kullanarak kazanmaya yakın. Taraftar desteği belirleyici olacak.',
    is_guaranteed: true,
    price: 200,
    status: 'pending'
  },
  {
    match_name: 'Bayern Munich vs B. Dortmund',
    league: 'Bundesliga',
    match_date: tomorrow.toISOString(),
    prediction: '3.5 ÜST',
    odd: 2.40,
    confidence: 75,
    analysis_text: 'Der Klassiker her zaman gollü geçer. İki takımın da savunma zaafları var.',
    is_guaranteed: false,
    price: 120,
    status: 'pending'
  }
];

async function seed() {
  console.log('Inserting dummy data...');
  const { data, error } = await supabase
    .from('premium_analyses')
    .insert(analyses);

  if (error) {
    console.error('Error inserting data:', error);
  } else {
    console.log('Successfully inserted data:', analyses.length, 'records.');
  }
}

seed();
