-- promo_codes_schema.sql

-- 1. Create promo_codes table
CREATE TABLE IF NOT EXISTS public.promo_codes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    reward_type TEXT NOT NULL CHECK (reward_type IN ('balance', 'freespin')),
    reward_amount NUMERIC NOT NULL,
    expires_at TIMESTAMPTZ,
    max_uses INTEGER,
    current_uses INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create promo_code_usages table to track which member used which code
CREATE TABLE IF NOT EXISTS public.promo_code_usages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code_id UUID NOT NULL REFERENCES public.promo_codes(id) ON DELETE CASCADE,
    username TEXT NOT NULL,
    used_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(code_id, username)
);

-- 3. RLS (Row Level Security)
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_code_usages ENABLE ROW LEVEL SECURITY;

-- Allow public to select promo codes (for validation purposes)
CREATE POLICY "Public can read promo codes" ON public.promo_codes FOR SELECT USING (true);
CREATE POLICY "Admins can update promo codes" ON public.promo_codes FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admins can insert promo codes" ON public.promo_codes FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins can delete promo codes" ON public.promo_codes FOR DELETE USING (is_admin());

-- Usage table policies
CREATE POLICY "Public can read usages" ON public.promo_code_usages FOR SELECT USING (true);
CREATE POLICY "Public can insert usages" ON public.promo_code_usages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can delete usages" ON public.promo_code_usages FOR DELETE USING (is_admin());
CREATE POLICY "Admins can update usages" ON public.promo_code_usages FOR UPDATE USING (is_admin());
