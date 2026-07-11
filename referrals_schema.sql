-- referrals_schema.sql

-- 1. Add new columns to members table
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='members' AND column_name='tc_no') THEN
    ALTER TABLE members ADD COLUMN tc_no TEXT UNIQUE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='members' AND column_name='referral_code') THEN
    ALTER TABLE members ADD COLUMN referral_code TEXT UNIQUE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='members' AND column_name='referred_by') THEN
    ALTER TABLE members ADD COLUMN referred_by TEXT;
  END IF;
END $$;

-- 2. Create referral_history table
CREATE TABLE IF NOT EXISTS public.referral_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    referrer_username TEXT NOT NULL,
    referred_username TEXT NOT NULL UNIQUE, -- Bir kişi sadece 1 kişinin referansıyla üye olabilir
    deposit_status TEXT DEFAULT 'pending' CHECK (deposit_status IN ('pending', 'completed')),
    bonus_amount NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. RLS
ALTER TABLE public.referral_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read referral history" ON public.referral_history FOR SELECT USING (true);
CREATE POLICY "Public can insert referral history" ON public.referral_history FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update referral history" ON public.referral_history FOR UPDATE USING (true);
CREATE POLICY "Public can delete referral history" ON public.referral_history FOR DELETE USING (true);
