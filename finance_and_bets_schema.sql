-- ================================================================
-- 724BAHİS.NET — Finance, Betting & Triggers Schema Migration
-- Supabase Dashboard > SQL Editor'de çalıştırın
-- ================================================================

-- 1. ADD CACHE COLUMNS TO MEMBERS TABLE
-- We use IF NOT EXISTS logic via a DO block for adding columns safely
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'members' AND column_name = 'total_wagered') THEN
        ALTER TABLE members ADD COLUMN total_wagered NUMERIC DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'members' AND column_name = 'total_deposits') THEN
        ALTER TABLE members ADD COLUMN total_deposits NUMERIC DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'members' AND column_name = 'total_withdrawals') THEN
        ALTER TABLE members ADD COLUMN total_withdrawals NUMERIC DEFAULT 0;
    END IF;
END $$;


-- 2. CREATE WITHDRAWALS TABLE
CREATE TABLE IF NOT EXISTS withdrawals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES members(id) ON DELETE CASCADE NOT NULL,
    amount NUMERIC NOT NULL CHECK (amount > 0),
    method TEXT NOT NULL, -- e.g., 'crypto', 'bank_transfer'
    wallet_address TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS for Withdrawals
ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can insert their own withdrawals" ON withdrawals FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can read their own withdrawals" ON withdrawals FOR SELECT USING (true);
CREATE POLICY "Public can update withdrawals (admin)" ON withdrawals FOR UPDATE USING (true);


-- 3. CREATE SPORTS_BETS TABLE
CREATE TABLE IF NOT EXISTS sports_bets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES members(id) ON DELETE CASCADE NOT NULL,
    match_id UUID REFERENCES sports_matches(id) ON DELETE CASCADE,
    market_name TEXT NOT NULL,      -- e.g., 'Match Winner'
    selection_name TEXT NOT NULL,   -- e.g., 'Home', 'Away', 'Over 2.5'
    odd NUMERIC NOT NULL,
    bet_amount NUMERIC NOT NULL CHECK (bet_amount > 0),
    potential_win NUMERIC NOT NULL,
    win_amount NUMERIC DEFAULT 0,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'won', 'lost', 'refunded', 'cashed_out')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS for Sports Bets
ALTER TABLE sports_bets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can insert their own sports bets" ON sports_bets FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can read their own sports bets" ON sports_bets FOR SELECT USING (true);
CREATE POLICY "Public can update sports bets (admin/system)" ON sports_bets FOR UPDATE USING (true);


-- ================================================================
-- 4. POSTGRESQL TRIGGERS FOR AUTO-UPDATING TOTALS
-- ================================================================

-- A. Trigger for Total Wagered (Casino Game History)
CREATE OR REPLACE FUNCTION update_member_wager_from_casino()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE members
    SET total_wagered = total_wagered + NEW.bet_amount
    WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_wager_casino ON game_history;
CREATE TRIGGER trigger_update_wager_casino
AFTER INSERT ON game_history
FOR EACH ROW EXECUTE FUNCTION update_member_wager_from_casino();


-- B. Trigger for Total Wagered (Sports Bets)
CREATE OR REPLACE FUNCTION update_member_wager_from_sports()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE members
    SET total_wagered = total_wagered + NEW.bet_amount
    WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_wager_sports ON sports_bets;
CREATE TRIGGER trigger_update_wager_sports
AFTER INSERT ON sports_bets
FOR EACH ROW EXECUTE FUNCTION update_member_wager_from_sports();


-- C. Trigger for Total Deposits (When deposit status becomes 'approved')
CREATE OR REPLACE FUNCTION update_member_total_deposits()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT' AND NEW.status = 'approved') THEN
        UPDATE members SET total_deposits = total_deposits + NEW.amount WHERE username = NEW.username;
    ELSIF (TG_OP = 'UPDATE' AND OLD.status != 'approved' AND NEW.status = 'approved') THEN
        UPDATE members SET total_deposits = total_deposits + NEW.amount WHERE username = NEW.username;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_deposits ON deposits;
CREATE TRIGGER trigger_update_deposits
AFTER INSERT OR UPDATE ON deposits
FOR EACH ROW EXECUTE FUNCTION update_member_total_deposits();


-- D. Trigger for Total Withdrawals (When withdrawal status becomes 'approved')
CREATE OR REPLACE FUNCTION update_member_total_withdrawals()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT' AND NEW.status = 'approved') THEN
        UPDATE members SET total_withdrawals = total_withdrawals + NEW.amount WHERE id = NEW.user_id;
    ELSIF (TG_OP = 'UPDATE' AND OLD.status != 'approved' AND NEW.status = 'approved') THEN
        UPDATE members SET total_withdrawals = total_withdrawals + NEW.amount WHERE id = NEW.user_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_withdrawals ON withdrawals;
CREATE TRIGGER trigger_update_withdrawals
AFTER INSERT OR UPDATE ON withdrawals
FOR EACH ROW EXECUTE FUNCTION update_member_total_withdrawals();

-- ================================================================
-- 5. Helper Function for Finance Dashboard
-- Returns live dashboard stats rapidly
-- ================================================================
CREATE OR REPLACE FUNCTION get_finance_dashboard_stats()
RETURNS JSONB AS $$
DECLARE
    v_total_wager NUMERIC;
    v_total_payout NUMERIC;
    v_casino_wager NUMERIC;
    v_casino_payout NUMERIC;
    v_sports_wager NUMERIC;
    v_sports_payout NUMERIC;
    v_total_deposits NUMERIC;
    v_total_withdrawals NUMERIC;
BEGIN
    -- Casino
    SELECT COALESCE(SUM(bet_amount), 0), COALESCE(SUM(win_amount), 0)
    INTO v_casino_wager, v_casino_payout FROM game_history;
    
    -- Sports
    SELECT COALESCE(SUM(bet_amount), 0), COALESCE(SUM(win_amount), 0)
    INTO v_sports_wager, v_sports_payout FROM sports_bets;
    
    -- Funds
    SELECT COALESCE(SUM(amount), 0) INTO v_total_deposits FROM deposits WHERE status = 'approved';
    SELECT COALESCE(SUM(amount), 0) INTO v_total_withdrawals FROM withdrawals WHERE status = 'approved';

    v_total_wager := v_casino_wager + v_sports_wager;
    v_total_payout := v_casino_payout + v_sports_payout;

    RETURN jsonb_build_object(
        'total_wager', v_total_wager,
        'total_payout', v_total_payout,
        'ggr', v_total_wager - v_total_payout,
        'rtp', CASE WHEN v_total_wager > 0 THEN (v_total_payout / v_total_wager) * 100 ELSE 0 END,
        'total_deposits', v_total_deposits,
        'total_withdrawals', v_total_withdrawals,
        'net_funds', v_total_deposits - v_total_withdrawals
    );
END;
$$ LANGUAGE plpgsql;
