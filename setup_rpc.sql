-- Create a secure RPC function to process game bets and wins
CREATE OR REPLACE FUNCTION process_game_bet(
  p_user_id UUID,
  p_bet_amount NUMERIC,
  p_win_amount NUMERIC,
  p_game_name TEXT
) RETURNS NUMERIC AS $$
DECLARE
  v_current_balance NUMERIC;
  v_new_balance NUMERIC;
BEGIN
  -- Get current balance and lock the row to prevent race conditions
  SELECT balance INTO v_current_balance FROM members WHERE id = p_user_id FOR UPDATE;
  
  IF v_current_balance IS NULL THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  -- Ensure they have enough balance (if they are betting something)
  IF p_bet_amount > 0 AND v_current_balance < p_bet_amount THEN
    RAISE EXCEPTION 'Insufficient balance';
  END IF;

  -- Calculate new balance
  v_new_balance := v_current_balance - p_bet_amount + p_win_amount;

  -- Update balance
  UPDATE members SET balance = v_new_balance WHERE id = p_user_id;

  -- Return the new balance so the client can update its local state instantly
  RETURN v_new_balance;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
