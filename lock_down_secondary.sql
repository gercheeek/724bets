-- =========================================================================
-- 724BAHİS.NET — Secondary Security Lockdown
-- Run this script in the Supabase Dashboard > SQL Editor
-- =========================================================================

-- 1. Ensure the is_admin helper function exists
CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$
DECLARE
    v_role TEXT;
BEGIN
    SELECT role INTO v_role FROM members WHERE id = auth.uid();
    RETURN v_role IN ('admin', 'moderator');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =========================================================================
-- PROMO CODES RLS
-- =========================================================================
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can update promo codes" ON public.promo_codes;
DROP POLICY IF EXISTS "Public can insert promo codes" ON public.promo_codes;
DROP POLICY IF EXISTS "Public can delete promo codes" ON public.promo_codes;

CREATE POLICY "Admins can update promo codes" ON public.promo_codes FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admins can insert promo codes" ON public.promo_codes FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins can delete promo codes" ON public.promo_codes FOR DELETE USING (is_admin());

-- Usage table policies
ALTER TABLE public.promo_code_usages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can delete usages" ON public.promo_code_usages;
DROP POLICY IF EXISTS "Public can update usages" ON public.promo_code_usages;

CREATE POLICY "Admins can delete usages" ON public.promo_code_usages FOR DELETE USING (is_admin());
CREATE POLICY "Admins can update usages" ON public.promo_code_usages FOR UPDATE USING (is_admin());

-- =========================================================================
-- TV CHAT RLS
-- =========================================================================
ALTER TABLE public.tv_chat ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service can manage tv_chat" ON public.tv_chat;
DROP POLICY IF EXISTS "Admins can update tv_chat" ON public.tv_chat;
DROP POLICY IF EXISTS "Admins can delete tv_chat" ON public.tv_chat;

CREATE POLICY "Admins can update tv_chat" ON public.tv_chat FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admins can delete tv_chat" ON public.tv_chat FOR DELETE USING (is_admin());

-- =========================================================================
-- WHEEL SPINS RLS
-- =========================================================================
ALTER TABLE public.wheel_spins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can update wheel spins" ON public.wheel_spins;
DROP POLICY IF EXISTS "Admins can delete wheel spins" ON public.wheel_spins;

CREATE POLICY "Admins can update wheel spins" ON public.wheel_spins FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admins can delete wheel spins" ON public.wheel_spins FOR DELETE USING (is_admin());
