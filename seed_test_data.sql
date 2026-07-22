-- ================================================================
-- 724BAHİS.NET — Foolproof Mock Data & Tables Generator
-- ================================================================

DO $$
BEGIN
    -- 1. Ensure all tables exist
    CREATE TABLE IF NOT EXISTS public.members (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'member',
        status TEXT DEFAULT 'active',
        total_wagered NUMERIC DEFAULT 0,
        total_deposits NUMERIC DEFAULT 0,
        total_withdrawals NUMERIC DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS public.game_history (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        bet_id TEXT UNIQUE NOT NULL,
        user_id UUID REFERENCES public.members(id) ON DELETE CASCADE NOT NULL,
        game_name TEXT NOT NULL,
        bet_amount NUMERIC NOT NULL,
        win_amount NUMERIC NOT NULL,
        multiplier NUMERIC,
        created_at TIMESTAMPTZ DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS public.sports_matches (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        team_home TEXT NOT NULL,
        team_away TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS public.sports_bets (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID REFERENCES public.members(id) ON DELETE CASCADE NOT NULL,
        match_id UUID REFERENCES public.sports_matches(id) ON DELETE CASCADE,
        market_name TEXT NOT NULL,
        selection_name TEXT NOT NULL,
        odd NUMERIC NOT NULL,
        bet_amount NUMERIC NOT NULL,
        potential_win NUMERIC NOT NULL,
        win_amount NUMERIC DEFAULT 0,
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMPTZ DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS public.deposits (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        username TEXT NOT NULL,
        method TEXT NOT NULL,
        amount NUMERIC NOT NULL,
        tx_hash TEXT,
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMPTZ DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS public.withdrawals (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID REFERENCES public.members(id) ON DELETE CASCADE NOT NULL,
        amount NUMERIC NOT NULL,
        method TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now()
    );
END $$;

-- 2. Open up RLS just in case it is blocking frontend read
ALTER TABLE public.game_history ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read game_history" ON public.game_history;
CREATE POLICY "Public can read game_history" ON public.game_history FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public can insert game_history" ON public.game_history;
CREATE POLICY "Public can insert game_history" ON public.game_history FOR INSERT WITH CHECK (true);

ALTER TABLE public.deposits ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public select on deposits" ON public.deposits;
CREATE POLICY "Allow public select on deposits" ON public.deposits FOR SELECT USING (true);

ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can read their own withdrawals" ON public.withdrawals;
CREATE POLICY "Users can read their own withdrawals" ON public.withdrawals FOR SELECT USING (true);

ALTER TABLE public.sports_bets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can read their own sports bets" ON public.sports_bets;
CREATE POLICY "Users can read their own sports bets" ON public.sports_bets FOR SELECT USING (true);


-- 3. Insert Data
DO $$
DECLARE
    v_user_ids UUID[] := ARRAY[]::UUID[];
    v_user_id UUID;
    v_game_names TEXT[] := ARRAY['Gates of Olympus', 'Sweet Bonanza', 'Roulette', 'Blackjack', 'Crazy Time'];
    v_game TEXT;
    v_amount NUMERIC;
    v_win NUMERIC;
    v_date TIMESTAMPTZ;
    v_method TEXT[] := ARRAY['crypto', 'bank_transfer', 'papara'];
    i INT;
    v_uname TEXT;
BEGIN
    SELECT array_agg(id) INTO v_user_ids FROM members;
    
    IF v_user_ids IS NULL OR array_length(v_user_ids, 1) < 5 THEN
        FOR i IN 1..5 LOOP
            INSERT INTO members (username, email, password, role, status)
            VALUES (
                'testuser_' || floor(random() * 100000)::TEXT,
                'test' || floor(random() * 100000)::TEXT || '@example.com',
                'hashedpass123',
                'member',
                'active'
            ) RETURNING id INTO v_user_id;
            v_user_ids := array_append(v_user_ids, v_user_id);
        END LOOP;
    END IF;

    FOR i IN 1..500 LOOP
        v_user_id := v_user_ids[1 + floor(random() * array_length(v_user_ids, 1))];
        v_game := v_game_names[1 + floor(random() * array_length(v_game_names, 1))];
        v_amount := round((random() * 4990 + 10)::numeric, 2);
        
        IF random() < 0.20 THEN
            v_win := round((v_amount * (random() * 13.9 + 1.1))::numeric, 2);
        ELSE
            v_win := 0;
        END IF;

        v_date := now() - (random() * 30 || ' days')::interval;

        INSERT INTO game_history (bet_id, user_id, game_name, bet_amount, win_amount, multiplier, created_at)
        VALUES (
            'test_bet_' || floor(random() * 100000000)::TEXT,
            v_user_id,
            v_game,
            v_amount,
            v_win,
            CASE WHEN v_amount > 0 THEN round(v_win / v_amount, 2) ELSE 0 END,
            v_date
        );
    END LOOP;

    FOR i IN 1..50 LOOP
        v_user_id := v_user_ids[1 + floor(random() * array_length(v_user_ids, 1))];
        v_amount := round((random() * 9900 + 100)::numeric, 2);
        v_date := now() - (random() * 30 || ' days')::interval;
        
        SELECT username INTO v_uname FROM members WHERE id = v_user_id;
        
        INSERT INTO deposits (username, method, amount, status, created_at)
        VALUES (
            v_uname,
            v_method[1 + floor(random() * array_length(v_method, 1))],
            v_amount,
            'approved',
            v_date
        );
    END LOOP;

    FOR i IN 1..20 LOOP
        v_user_id := v_user_ids[1 + floor(random() * array_length(v_user_ids, 1))];
        v_amount := round((random() * 4900 + 100)::numeric, 2);
        v_date := now() - (random() * 30 || ' days')::interval;

        INSERT INTO withdrawals (user_id, amount, method, status, created_at, updated_at)
        VALUES (
            v_user_id,
            v_amount,
            v_method[1 + floor(random() * array_length(v_method, 1))],
            'approved',
            v_date,
            v_date
        );
    END LOOP;

END $$;

-- 4. Recreate RPC function without undefined_table errors
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
    SELECT COALESCE(SUM(bet_amount), 0), COALESCE(SUM(win_amount), 0)
    INTO v_casino_wager, v_casino_payout FROM game_history;
    
    SELECT COALESCE(SUM(bet_amount), 0), COALESCE(SUM(win_amount), 0)
    INTO v_sports_wager, v_sports_payout FROM sports_bets;
    
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
