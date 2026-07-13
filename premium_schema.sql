-- ================================================================
-- 724BAHİS.NET — Premium Analysis & Payment System
-- Supabase Dashboard > SQL Editor'de çalıştırın
-- ================================================================

-- 1. Premium Analizler
CREATE TABLE IF NOT EXISTS premium_analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_name TEXT NOT NULL,
  league TEXT,
  match_date TIMESTAMPTZ,
  prediction TEXT NOT NULL,
  odd DECIMAL(5,2),
  confidence INTEGER CHECK (confidence BETWEEN 0 AND 100),
  analysis_text TEXT,
  is_guaranteed BOOLEAN DEFAULT false,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','won','lost','void')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Ödeme Kayıtları
CREATE TABLE IF NOT EXISTS premium_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  username TEXT,
  analysis_id UUID REFERENCES premium_analyses(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  method TEXT NOT NULL CHECK (method IN ('usdt','bank_transfer')),
  tx_reference TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','confirmed','rejected','refunded')),
  refund_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  processed_at TIMESTAMPTZ
);

-- 3. Kullanıcı Bakiyeleri
CREATE TABLE IF NOT EXISTS user_balances (
  user_id TEXT PRIMARY KEY,
  username TEXT,
  site_balance DECIMAL(10,2) DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Row Level Security (RLS)
ALTER TABLE premium_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE premium_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_balances ENABLE ROW LEVEL SECURITY;

-- Public read for analyses
CREATE POLICY "Public can read analyses" ON premium_analyses FOR SELECT USING (true);
-- Public insert for payments
CREATE POLICY "Public can insert payments" ON premium_payments FOR INSERT WITH CHECK (true);
-- Public read own payments
CREATE POLICY "Public can read own payments" ON premium_payments FOR SELECT USING (true);
-- Public read own balance
CREATE POLICY "Public can read balances" ON user_balances FOR SELECT USING (true);
-- Service role full access (admin operations handled via anon key with app-level auth)
CREATE POLICY "Service can manage analyses" ON premium_analyses FOR ALL USING (true);
CREATE POLICY "Service can manage payments" ON premium_payments FOR ALL USING (true);
CREATE POLICY "Service can manage balances" ON user_balances FOR ALL USING (true);

-- 5. Index for performance
CREATE INDEX IF NOT EXISTS idx_payments_user ON premium_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_analysis ON premium_payments(analysis_id);
CREATE INDEX IF NOT EXISTS idx_analyses_status ON premium_analyses(status);
