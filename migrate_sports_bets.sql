-- 1. Modifying the existing sports_bets table
ALTER TABLE sports_bets ADD COLUMN IF NOT EXISTS selections JSONB;

-- Relax constraints for kombine support
ALTER TABLE sports_bets ALTER COLUMN match_id DROP NOT NULL;
ALTER TABLE sports_bets ALTER COLUMN market_name DROP NOT NULL;
ALTER TABLE sports_bets ALTER COLUMN selection_name DROP NOT NULL;

-- Ensure potential_win is calculated correctly when betting.
-- 2. RPC to place a sports bet
CREATE OR REPLACE FUNCTION place_sports_bet(
  p_user_id UUID,
  p_bet_amount NUMERIC,
  p_potential_win NUMERIC,
  p_total_odds NUMERIC,
  p_selections JSONB
) RETURNS JSONB AS $$
DECLARE
  v_balance NUMERIC;
  v_bet_id UUID;
BEGIN
  -- Lock the member row for update to prevent race conditions
  SELECT balance INTO v_balance FROM members WHERE id = p_user_id FOR UPDATE;

  IF v_balance IS NULL THEN
    RAISE EXCEPTION 'Kullanıcı bulunamadı';
  END IF;

  IF v_balance < p_bet_amount THEN
    RAISE EXCEPTION 'Yetersiz bakiye';
  END IF;

  -- Deduct balance
  UPDATE members SET balance = balance - p_bet_amount WHERE id = p_user_id;

  -- Create the bet record
  INSERT INTO sports_bets (
    user_id,
    odd,
    bet_amount,
    potential_win,
    status,
    selections
  ) VALUES (
    p_user_id,
    p_total_odds,
    p_bet_amount,
    p_potential_win,
    'pending',
    p_selections
  ) RETURNING id INTO v_bet_id;

  -- Return success and new balance
  RETURN jsonb_build_object(
    'success', true,
    'new_balance', v_balance - p_bet_amount,
    'bet_id', v_bet_id
  );
END;
$$ LANGUAGE plpgsql;

-- 3. RPC to settle a sports bet (win/lose/cashout)
CREATE OR REPLACE FUNCTION settle_sports_bet(
  p_bet_id UUID,
  p_status TEXT -- 'won', 'lost', 'cashed_out'
) RETURNS JSONB AS $$
DECLARE
  v_bet RECORD;
  v_new_balance NUMERIC;
  v_payout NUMERIC := 0;
BEGIN
  -- Lock the bet row
  SELECT * INTO v_bet FROM sports_bets WHERE id = p_bet_id FOR UPDATE;

  IF v_bet IS NULL THEN
    RAISE EXCEPTION 'Kupon bulunamadı';
  END IF;

  IF v_bet.status != 'pending' THEN
    RAISE EXCEPTION 'Kupon zaten sonuçlandırılmış';
  END IF;

  IF p_status = 'won' THEN
    v_payout := v_bet.potential_win;
  ELSIF p_status = 'cashed_out' THEN
    v_payout := v_bet.bet_amount * 0.95; -- simple mock cashout value
  ELSIF p_status = 'lost' THEN
    v_payout := 0;
  ELSE
    RAISE EXCEPTION 'Geçersiz sonuçlandırma durumu';
  END IF;

  -- Update bet status and win_amount
  UPDATE sports_bets SET 
    status = p_status, 
    win_amount = v_payout,
    updated_at = now()
  WHERE id = p_bet_id;

  -- Update user balance if payout > 0
  IF v_payout > 0 THEN
    UPDATE members SET balance = balance + v_payout WHERE id = v_bet.user_id RETURNING balance INTO v_new_balance;
  ELSE
    SELECT balance INTO v_new_balance FROM members WHERE id = v_bet.user_id;
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'new_balance', v_new_balance,
    'payout', v_payout
  );
END;
$$ LANGUAGE plpgsql;
