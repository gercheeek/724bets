-- ================================================================
-- 724BAHİS.NET — League Logos Caching Schema
-- Supabase Dashboard > SQL Editor'de çalıştırın
-- ================================================================

CREATE TABLE IF NOT EXISTS league_logos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  league_name TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  priority_tier INTEGER DEFAULT 2, -- 1: Major, 2: Standard, 3: Minor
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Row Level Security (RLS)
ALTER TABLE league_logos ENABLE ROW LEVEL SECURITY;

-- Herkes logoları okuyabilir
CREATE POLICY "Public can read league_logos" ON league_logos FOR SELECT USING (true);

-- Sunucu / Admin logo ekleyebilir veya güncelleyebilir
CREATE POLICY "Public can insert league_logos" ON league_logos FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update league_logos" ON league_logos FOR UPDATE USING (true);

-- Otomatik updated_at tetikleyicisi
CREATE OR REPLACE FUNCTION update_league_logos_modtime()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_league_logos_modtime ON league_logos;

CREATE TRIGGER update_league_logos_modtime
BEFORE UPDATE ON league_logos
FOR EACH ROW
EXECUTE FUNCTION update_league_logos_modtime();
