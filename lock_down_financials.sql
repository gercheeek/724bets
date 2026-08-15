-- 1. Create a helper function to check if current user is an admin or moderator
CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$
DECLARE
    v_role TEXT;
BEGIN
    SELECT role INTO v_role FROM members WHERE id = auth.uid();
    RETURN v_role IN ('admin', 'moderator');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- DEPOSITS RLS
-- ==========================================
ALTER TABLE deposits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public update on deposits" ON deposits;
DROP POLICY IF EXISTS "Allow public delete on deposits" ON deposits;
-- Prevent public updates and deletes, only admins can update/delete
CREATE POLICY "Admins can update deposits" ON deposits FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admins can delete deposits" ON deposits FOR DELETE USING (is_admin());

-- ==========================================
-- WITHDRAWALS RLS
-- ==========================================
ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can update withdrawals (admin)" ON withdrawals;
DROP POLICY IF EXISTS "Users can read their own withdrawals" ON withdrawals;
DROP POLICY IF EXISTS "Users can insert their own withdrawals" ON withdrawals;

-- Prevent public updates, only admins can update/delete
CREATE POLICY "Admins can update withdrawals" ON withdrawals FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admins can delete withdrawals" ON withdrawals FOR DELETE USING (is_admin());

-- Allow users to read ONLY their own withdrawals OR admins can read all
CREATE POLICY "Users can read their own withdrawals" ON withdrawals FOR SELECT USING (
    auth.uid() = user_id OR is_admin()
);
-- Allow users to insert ONLY for their own user_id
CREATE POLICY "Users can insert their own withdrawals" ON withdrawals FOR INSERT WITH CHECK (
    auth.uid() = user_id OR is_admin()
);

-- ==========================================
-- SPORTS BETS RLS
-- ==========================================
ALTER TABLE sports_bets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can update sports bets (admin/system)" ON sports_bets;
DROP POLICY IF EXISTS "Users can read their own sports bets" ON sports_bets;
DROP POLICY IF EXISTS "Users can insert their own sports bets" ON sports_bets;

-- Prevent public updates, only admins can update/delete
CREATE POLICY "Admins can update sports bets" ON sports_bets FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admins can delete sports bets" ON sports_bets FOR DELETE USING (is_admin());

-- Allow users to read ONLY their own sports bets OR admins can read all
CREATE POLICY "Users can read their own sports bets" ON sports_bets FOR SELECT USING (
    auth.uid() = user_id OR is_admin()
);
-- Allow users to insert ONLY for their own user_id
CREATE POLICY "Users can insert their own sports bets" ON sports_bets FOR INSERT WITH CHECK (
    auth.uid() = user_id OR is_admin()
);
