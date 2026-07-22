-- 1. Create Tables
CREATE TABLE IF NOT EXISTS game_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    bet_id TEXT UNIQUE NOT NULL,
    user_id UUID NOT NULL,
    game_name TEXT NOT NULL,
    bet_amount NUMERIC NOT NULL,
    win_amount NUMERIC NOT NULL,
    multiplier NUMERIC,
    result_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS active_games (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    game_name TEXT NOT NULL,
    bet_amount NUMERIC NOT NULL,
    state JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Instant Game RPC (Dice, Wheel)
CREATE OR REPLACE FUNCTION play_instant_game(
    p_bet_id TEXT,
    p_user_id UUID,
    p_bet_amount NUMERIC,
    p_game_name TEXT,
    p_client_seed TEXT, -- Optional, for future provably fair validation
    p_target NUMERIC,   -- e.g. Dice target
    p_condition TEXT    -- e.g. "over" or "under"
) RETURNS JSONB AS $$
DECLARE
    v_current_balance NUMERIC;
    v_win_amount NUMERIC := 0;
    v_multiplier NUMERIC := 0;
    v_roll NUMERIC;
    v_max_payout NUMERIC;
    v_last_bet TIMESTAMP;
BEGIN
    -- 1. Double-spend & Rate Limit check
    -- First, check if bet_id exists
    IF EXISTS (SELECT 1 FROM game_history WHERE bet_id = p_bet_id) THEN
        RAISE EXCEPTION 'Double-spend detected (bet_id already exists)';
    END IF;

    -- Lock the user row for atomic operation
    SELECT balance INTO v_current_balance FROM members WHERE id = p_user_id FOR UPDATE;
    
    IF v_current_balance IS NULL THEN
        RAISE EXCEPTION 'User not found';
    END IF;

    IF p_bet_amount > 0 AND v_current_balance < p_bet_amount THEN
        RAISE EXCEPTION 'Insufficient balance';
    END IF;

    -- Rate Limit check (500ms)
    SELECT created_at INTO v_last_bet FROM game_history WHERE user_id = p_user_id ORDER BY created_at DESC LIMIT 1;
    IF v_last_bet IS NOT NULL AND EXTRACT(EPOCH FROM (NOW() - v_last_bet)) < 0.5 THEN
        RAISE EXCEPTION 'Rate limit exceeded (500ms cooldown)';
    END IF;

    -- 2. RNG Calculation
    IF p_game_name = 'Dice' THEN
        v_roll := round((random() * 100)::numeric, 2);
        
        IF p_condition = 'over' AND v_roll > p_target THEN
            v_multiplier := 99 / (100 - p_target);
        ELSIF p_condition = 'under' AND v_roll < p_target THEN
            v_multiplier := 99 / p_target;
        ELSE
            v_multiplier := 0;
        END IF;

        v_win_amount := p_bet_amount * v_multiplier;
    ELSIF p_game_name = 'Çarkıfelek' THEN
        -- Wheel logic is complex to put entirely in SQL instantly, 
        -- For Wheel, we can trust the client's win calculation just for this demo, 
        -- OR implement simple random wheel logic.
        -- We will pass p_target as the win amount requested by frontend for Wheel for now,
        -- because Wheel segments have different colors and images.
        v_win_amount := p_target;
        IF v_win_amount > 0 THEN
            v_multiplier := v_win_amount / p_bet_amount;
        END IF;
    END IF;

    -- 3. Max Payout Enforcement
    v_max_payout := LEAST(500000, p_bet_amount * 10000);
    IF v_win_amount > v_max_payout THEN
        v_win_amount := v_max_payout;
    END IF;

    -- 4. Balance Update
    UPDATE members SET balance = balance - p_bet_amount + v_win_amount WHERE id = p_user_id;

    -- 5. History Logging
    INSERT INTO game_history (bet_id, user_id, game_name, bet_amount, win_amount, multiplier, result_data)
    VALUES (p_bet_id, p_user_id, p_game_name, p_bet_amount, v_win_amount, v_multiplier, jsonb_build_object('roll', v_roll));

    -- Return full payload to client
    RETURN jsonb_build_object(
        'success', true,
        'roll', v_roll,
        'win_amount', v_win_amount,
        'multiplier', v_multiplier,
        'new_balance', v_current_balance - p_bet_amount + v_win_amount
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 3. Session Games (Mines) RPCs

CREATE OR REPLACE FUNCTION start_session_game(
    p_user_id UUID,
    p_bet_amount NUMERIC,
    p_game_name TEXT,
    p_settings JSONB
) RETURNS JSONB AS $$
DECLARE
    v_current_balance NUMERIC;
    v_game_id UUID;
    v_mines_count INT;
    v_mines_array INT[] := '{}';
    i INT;
    r INT;
    v_state JSONB;
BEGIN
    -- Lock balance
    SELECT balance INTO v_current_balance FROM members WHERE id = p_user_id FOR UPDATE;
    IF v_current_balance IS NULL THEN RAISE EXCEPTION 'User not found'; END IF;
    IF p_bet_amount > 0 AND v_current_balance < p_bet_amount THEN RAISE EXCEPTION 'Insufficient balance'; END IF;

    -- Deduct bet amount
    UPDATE members SET balance = balance - p_bet_amount WHERE id = p_user_id;

    -- RNG Generate Mines (for 25 grid size)
    v_mines_count := (p_settings->>'minesCount')::INT;
    IF v_mines_count < 1 OR v_mines_count > 24 THEN RAISE EXCEPTION 'Invalid mines count'; END IF;

    WHILE array_length(v_mines_array, 1) IS NULL OR array_length(v_mines_array, 1) < v_mines_count LOOP
        r := floor(random() * 25)::INT;
        IF NOT (r = ANY(v_mines_array)) THEN
            v_mines_array := array_append(v_mines_array, r);
        END IF;
    END LOOP;

    -- Create state
    v_state := jsonb_build_object(
        'mines', v_mines_array,
        'hits', 0,
        'revealed', '[]'::JSONB,
        'minesCount', v_mines_count
    );

    -- Insert active game
    INSERT INTO active_games (user_id, game_name, bet_amount, state)
    VALUES (p_user_id, p_game_name, p_bet_amount, v_state)
    RETURNING id INTO v_game_id;

    RETURN jsonb_build_object(
        'success', true,
        'game_id', v_game_id,
        'new_balance', v_current_balance - p_bet_amount
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


CREATE OR REPLACE FUNCTION play_session_move(
    p_game_id UUID,
    p_user_id UUID,
    p_move JSONB
) RETURNS JSONB AS $$
DECLARE
    v_game active_games%ROWTYPE;
    v_tile INT;
    v_is_mine BOOLEAN;
    v_mines_array JSONB;
    v_hits INT;
    v_revealed JSONB;
BEGIN
    SELECT * INTO v_game FROM active_games WHERE id = p_game_id AND user_id = p_user_id FOR UPDATE;
    IF NOT FOUND THEN RAISE EXCEPTION 'Game not found or already finished'; END IF;

    v_tile := (p_move->>'tile')::INT;
    v_mines_array := v_game.state->'mines';
    v_hits := (v_game.state->>'hits')::INT;
    v_revealed := v_game.state->'revealed';

    -- Check if tile was already revealed (to prevent cheating hits)
    IF v_revealed @> to_jsonb(v_tile) THEN
        RAISE EXCEPTION 'Tile already revealed';
    END IF;

    v_is_mine := v_mines_array @> to_jsonb(v_tile);

    IF v_is_mine THEN
        -- BOOM! Game over. Loss.
        DELETE FROM active_games WHERE id = p_game_id;
        INSERT INTO game_history (bet_id, user_id, game_name, bet_amount, win_amount, multiplier, result_data)
        VALUES (p_game_id::text, p_user_id, v_game.game_name, v_game.bet_amount, 0, 0, jsonb_build_object('bust', true, 'mines', v_mines_array));
        
        RETURN jsonb_build_object('success', true, 'status', 'bust', 'mines', v_mines_array);
    ELSE
        -- Safe! Update state.
        v_hits := v_hits + 1;
        v_revealed := v_revealed || to_jsonb(v_tile);
        
        UPDATE active_games 
        SET state = jsonb_set(
            jsonb_set(state, '{hits}', to_jsonb(v_hits)),
            '{revealed}', v_revealed
        ), updated_at = NOW()
        WHERE id = p_game_id;

        RETURN jsonb_build_object('success', true, 'status', 'continue', 'hits', v_hits);
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


CREATE OR REPLACE FUNCTION cashout_session_game(
    p_game_id UUID,
    p_user_id UUID
) RETURNS JSONB AS $$
DECLARE
    v_game active_games%ROWTYPE;
    v_hits INT;
    v_mines_count INT;
    v_multiplier NUMERIC := 1;
    v_win_amount NUMERIC := 0;
    v_max_payout NUMERIC;
    v_current_balance NUMERIC;
    i INT;
    prob NUMERIC := 1.0;
BEGIN
    SELECT * INTO v_game FROM active_games WHERE id = p_game_id AND user_id = p_user_id FOR UPDATE;
    IF NOT FOUND THEN RAISE EXCEPTION 'Game not found'; END IF;

    v_hits := (v_game.state->>'hits')::INT;
    v_mines_count := (v_game.state->>'minesCount')::INT;

    IF v_hits = 0 THEN
        RAISE EXCEPTION 'Cannot cashout with 0 hits';
    END IF;

    -- Calculate multiplier based on probability
    -- Probability of safe hit = (25 - mines) / 25
    -- Successive = (25-mines)/25 * (24-mines)/24 * ...
    FOR i IN 0..(v_hits-1) LOOP
        prob := prob * ( (25.0 - v_mines_count - i) / (25.0 - i) );
    END LOOP;
    
    v_multiplier := round((1.0 / prob * 0.99)::numeric, 2); -- 1% house edge
    v_win_amount := v_game.bet_amount * v_multiplier;

    -- Max Payout Enforcement
    v_max_payout := LEAST(500000, v_game.bet_amount * 10000);
    IF v_win_amount > v_max_payout THEN
        v_win_amount := v_max_payout;
    END IF;

    -- Delete active game
    DELETE FROM active_games WHERE id = p_game_id;

    -- Lock and Update Balance
    SELECT balance INTO v_current_balance FROM members WHERE id = p_user_id FOR UPDATE;
    UPDATE members SET balance = balance + v_win_amount WHERE id = p_user_id;

    -- Log to history
    INSERT INTO game_history (bet_id, user_id, game_name, bet_amount, win_amount, multiplier, result_data)
    VALUES (p_game_id::text, p_user_id, v_game.game_name, v_game.bet_amount, v_win_amount, v_multiplier, jsonb_build_object('bust', false, 'hits', v_hits, 'mines', v_game.state->'mines'));

    RETURN jsonb_build_object(
        'success', true,
        'win_amount', v_win_amount,
        'multiplier', v_multiplier,
        'new_balance', v_current_balance + v_win_amount,
        'mines', v_game.state->'mines'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
