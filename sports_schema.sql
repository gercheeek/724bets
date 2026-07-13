-- ================================================================
-- 724BAHİS.NET — Sports Matches & Live Betting Schema
-- Supabase Dashboard > SQL Editor'de çalıştırın
-- ================================================================

CREATE TABLE IF NOT EXISTS sports_matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sport_category TEXT NOT NULL DEFAULT 'Futbol',
  league TEXT NOT NULL,
  team_home TEXT NOT NULL,
  team_away TEXT NOT NULL,
  match_date TIMESTAMPTZ NOT NULL,
  is_live BOOLEAN DEFAULT false,
  score_home INTEGER DEFAULT 0,
  score_away INTEGER DEFAULT 0,
  match_minute TEXT DEFAULT '',
  odds JSONB DEFAULT '{"1": 1.5, "X": 3.0, "2": 2.1, "tU": 1.8, "tA": 1.9, "cs1X": 1.1, "cs12": 1.2, "csX2": 1.5}'::jsonb,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'finished')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Row Level Security (RLS)
ALTER TABLE sports_matches ENABLE ROW LEVEL SECURITY;

-- Herkes maçları okuyabilir
CREATE POLICY "Public can read sports_matches" ON sports_matches FOR SELECT USING (true);

-- Admin ekleme/güncelleme/silme yapabilir (Şimdilik basit tutmak için herkese açık bırakıyoruz ki Admin Panelinden yönetilebilsin)
CREATE POLICY "Public can insert sports_matches" ON sports_matches FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update sports_matches" ON sports_matches FOR UPDATE USING (true);
CREATE POLICY "Public can delete sports_matches" ON sports_matches FOR DELETE USING (true);

-- Avatar Sütunu Güncellemesi (Daha önceki istek)
ALTER TABLE members ADD COLUMN IF NOT EXISTS avatarUrl TEXT;
