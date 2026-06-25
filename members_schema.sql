-- ================================================================
-- 724BAHİS.NET — Members & Loyalty System Schema
-- Supabase Dashboard > SQL Editor'de çalıştırın
-- ================================================================

-- 1. Members Table (Üye ve Kullanıcı Bilgileri)
CREATE TABLE IF NOT EXISTS members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  password TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended')),
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'editor', 'author', 'member')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Loyalty Table (Sadakat Puanları ve Jeton Bilgileri)
CREATE TABLE IF NOT EXISTS loyalty (
  user_id UUID PRIMARY KEY REFERENCES members(id) ON DELETE CASCADE,
  coins NUMERIC(10,2) DEFAULT 0,
  tickets INTEGER DEFAULT 0,
  pending_tickets INTEGER DEFAULT 0,
  total_earned NUMERIC(10,2) DEFAULT 0,
  transactions JSONB DEFAULT '[]',
  last_volume_reset_date TEXT DEFAULT '',
  daily_volume_accumulated NUMERIC(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Row Level Security (RLS)
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty ENABLE ROW LEVEL SECURITY;

-- 4. Members RLS Policies
CREATE POLICY "Public can insert members" ON members FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can read members" ON members FOR SELECT USING (true);
CREATE POLICY "Public can update members" ON members FOR UPDATE USING (true);
CREATE POLICY "Public can delete members" ON members FOR DELETE USING (true);

-- 5. Loyalty RLS Policies
CREATE POLICY "Public can insert loyalty" ON loyalty FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can read loyalty" ON loyalty FOR SELECT USING (true);
CREATE POLICY "Public can update loyalty" ON loyalty FOR UPDATE USING (true);
CREATE POLICY "Public can delete loyalty" ON loyalty FOR DELETE USING (true);
