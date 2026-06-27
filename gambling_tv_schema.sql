-- ================================================================
-- 724BAHİS.NET — 7/24 Gambling TV System Schema
-- Supabase Dashboard > SQL Editor'de çalıştırın
-- ================================================================

-- 1. Streamers (Yayıncılar Vitrini)
CREATE TABLE IF NOT EXISTS streamers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  kick_username TEXT,
  avatar_url TEXT,
  tags JSONB DEFAULT '[]', -- e.g. ["Slot", "Rulet"]
  is_live BOOLEAN DEFAULT false,
  is_vip BOOLEAN DEFAULT false, -- Kurucu kanalı ayırmak için
  source_type TEXT DEFAULT 'platform' CHECK (source_type IN ('platform','video','iframe')),
  platform_type TEXT DEFAULT 'kick' CHECK (platform_type IN ('kick','twitch','youtube')),
  video_url TEXT,
  iframe_url TEXT,
  fallback_type TEXT DEFAULT 'none' CHECK (fallback_type IN ('none','video','iframe')),
  fallback_video_url TEXT,
  fallback_iframe_url TEXT,
  viewer_count INTEGER DEFAULT 0,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. VODs (Geçmiş Yayınlar Arşivi)
CREATE TABLE IF NOT EXISTS vods (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  streamer_id UUID REFERENCES streamers(id) ON DELETE SET NULL,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Gifts (Satın Alınabilir Etkileşim Hediyeleri)
CREATE TABLE IF NOT EXISTS gifts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  emoji TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Users (Mevcut user_balances tablosuna wallet_balance ekle)
-- Eğer tablo yoksa oluştur, varsa kolon ekle (ALTER)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_balances') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_balances' AND column_name='wallet_balance') THEN
      ALTER TABLE user_balances ADD COLUMN wallet_balance DECIMAL(10,2) DEFAULT 0;
    END IF;
  ELSE
    CREATE TABLE user_balances (
      user_id TEXT PRIMARY KEY,
      username TEXT,
      site_balance DECIMAL(10,2) DEFAULT 0,
      wallet_balance DECIMAL(10,2) DEFAULT 0,
      updated_at TIMESTAMPTZ DEFAULT now()
    );
  END IF;
END $$;


-- Default 10 Gifts
INSERT INTO gifts (name, emoji, price, order_index) VALUES
('Bozuk Para', '🪙', 1, 1),
('Kalp', '❤️', 5, 2),
('Gül', '🌹', 10, 3),
('Ateş', '🔥', 25, 4),
('Zar', '🎲', 50, 5),
('Şampanya', '🍾', 100, 6),
('Para Yağmuru', '💸', 250, 7),
('Slot Makinesi', '🎰', 500, 8),
('Pırlanta', '💎', 1000, 9),
('Taç', '👑', 5000, 10)
ON CONFLICT DO NOTHING;

-- RLS Policies
ALTER TABLE streamers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vods ENABLE ROW LEVEL SECURITY;
ALTER TABLE gifts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read streamers" ON streamers FOR SELECT USING (true);
CREATE POLICY "Public can read vods" ON vods FOR SELECT USING (true);
CREATE POLICY "Public can read gifts" ON gifts FOR SELECT USING (true);

CREATE POLICY "Service can manage streamers" ON streamers FOR ALL USING (true);
CREATE POLICY "Service can manage vods" ON vods FOR ALL USING (true);
CREATE POLICY "Service can manage gifts" ON gifts FOR ALL USING (true);

-- 5. TV Chat Table
CREATE TABLE IF NOT EXISTS tv_chat (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  channel_id UUID,
  user_id TEXT,
  username TEXT,
  message TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE tv_chat ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can insert tv_chat" ON tv_chat FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can read tv_chat" ON tv_chat FOR SELECT USING (true);
CREATE POLICY "Service can manage tv_chat" ON tv_chat FOR ALL USING (true);

