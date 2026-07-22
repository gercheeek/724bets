-- 1. Create Tables (If not exist)
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

-- 2. Instant Game RPC
CREATE OR REPLACE FUNCTION play_instant_game(
    p_bet_id TEXT,
    p_user_id UUID,
    p_bet_amount NUMERIC,
    p_game_name TEXT,
    p_client_seed TEXT,
    p_target NUMERIC,
    p_condition TEXT,
    p_payload JSONB DEFAULT '{}'::JSONB
) RETURNS JSONB AS $$
DECLARE
    v_current_balance NUMERIC;
    v_win_amount NUMERIC := 0;
    v_multiplier NUMERIC := 0;
    v_max_payout NUMERIC;
    v_last_bet TIMESTAMP;
    v_result_data JSONB := '{}'::JSONB;
    
    v_real_uuid UUID := NULL;
    v_is_guest BOOLEAN := FALSE;
    
    -- Plinko vars
    v_plinko_rand INT;
    v_plinko_bucket INT;
    v_plinko_weights INT[] := ARRAY[1, 16, 120, 560, 1820, 4368, 8008, 11440, 12870, 11440, 8008, 4368, 1820, 560, 120, 16, 1];
    v_plinko_multipliers NUMERIC[] := ARRAY[16, 9, 2, 1.4, 1.4, 1.2, 1.1, 1, 0.5, 1, 1.1, 1.2, 1.4, 1.4, 2, 9, 16];
    i INT;
    -- Roulette vars
    v_roulette_num INT;
    v_roulette_bets JSONB;
    v_bet JSONB;
    v_roulette_win NUMERIC := 0;
    v_is_red BOOLEAN;
    -- Limbo vars
    v_limbo_mult NUMERIC;
    -- Keno vars
    v_keno_drawn INT[];
    v_keno_user INT[];
    v_keno_hits INT := 0;
    r INT;
    -- Wheel vars
    v_wheel_spin INT;
    -- War vars
    v_war_p INT;
    v_war_d INT;
BEGIN
    -- Guest Check
    IF p_user_id LIKE 'guest_%' OR p_user_id = 'admin-session' THEN
        v_is_guest := TRUE;
    ELSE
        v_real_uuid := p_user_id::UUID;
    END IF;

    -- Double-spend & Rate Limit check
    IF EXISTS (SELECT 1 FROM game_history WHERE bet_id = p_bet_id) THEN
        RAISE EXCEPTION 'Double-spend detected';
    END IF;

    -- Lock and check balance
    IF NOT v_is_guest THEN
        SELECT balance INTO v_current_balance FROM members WHERE id = v_real_uuid FOR UPDATE;
        IF v_current_balance IS NULL THEN RAISE EXCEPTION 'User not found'; END IF;
        IF v_current_balance < p_bet_amount THEN RAISE EXCEPTION 'Insufficient balance'; END IF;
    ELSE
        v_current_balance := 999999999;
    END IF;

    SELECT created_at INTO v_last_bet FROM game_history WHERE user_id = v_real_uuid ORDER BY created_at DESC LIMIT 1;
    IF v_last_bet IS NOT NULL AND EXTRACT(EPOCH FROM (NOW() - v_last_bet)) < 0.3 THEN
        RAISE EXCEPTION 'Rate limit exceeded (300ms cooldown)';
    END IF;

    -- GAME LOGIC
    IF p_game_name = 'Dice' THEN
        v_plinko_rand := floor(random() * 10000)::INT;
        v_multiplier := v_plinko_rand / 100.0; 
        IF p_condition = 'over' AND v_multiplier > p_target THEN
            v_multiplier := 99 / (100 - p_target);
            v_win_amount := p_bet_amount * v_multiplier;
        ELSIF p_condition = 'under' AND v_multiplier < p_target THEN
            v_multiplier := 99 / p_target;
            v_win_amount := p_bet_amount * v_multiplier;
        ELSE
            v_win_amount := 0;
            v_multiplier := 0;
        END IF;
        v_result_data := jsonb_build_object('roll', v_plinko_rand / 100.0);

    ELSIF p_game_name = 'Plinko' THEN
        v_plinko_rand := floor(random() * 65536)::INT;
        v_plinko_bucket := 0;
        FOR i IN 1..17 LOOP
            IF v_plinko_rand < v_plinko_weights[i] THEN
                v_plinko_bucket := i - 1;
                EXIT;
            END IF;
            v_plinko_rand := v_plinko_rand - v_plinko_weights[i];
        END LOOP;
        v_multiplier := v_plinko_multipliers[v_plinko_bucket + 1];
        v_win_amount := p_bet_amount * v_multiplier;
        v_result_data := jsonb_build_object('bucket', v_plinko_bucket);

    ELSIF p_game_name = 'Limbo' THEN
        v_limbo_mult := 0.99 / random();
        IF v_limbo_mult > 10000 THEN v_limbo_mult := 10000; END IF;
        IF v_limbo_mult >= p_target THEN
            v_multiplier := p_target;
            v_win_amount := p_bet_amount * v_multiplier;
        END IF;
        v_result_data := jsonb_build_object('crash', v_limbo_mult);

    ELSIF p_game_name = 'Roulette' THEN
        v_roulette_num := floor(random() * 37)::INT;
        v_is_red := v_roulette_num IN (1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36);
        v_roulette_bets := p_payload->'bets';
        
        IF v_roulette_bets IS NOT NULL THEN
            FOR i IN 0..jsonb_array_length(v_roulette_bets)-1 LOOP
                v_bet := v_roulette_bets->i;
                IF v_bet->>'type' = 'number' AND (v_bet->>'value')::INT = v_roulette_num THEN
                    v_roulette_win := v_roulette_win + (v_bet->>'amount')::NUMERIC * 36;
                ELSIF v_bet->>'type' = 'color' AND v_bet->>'value' = 'red' AND v_is_red THEN
                    v_roulette_win := v_roulette_win + (v_bet->>'amount')::NUMERIC * 2;
                ELSIF v_bet->>'type' = 'color' AND v_bet->>'value' = 'black' AND NOT v_is_red AND v_roulette_num != 0 THEN
                    v_roulette_win := v_roulette_win + (v_bet->>'amount')::NUMERIC * 2;
                END IF;
            END LOOP;
        END IF;
        v_win_amount := v_roulette_win;
        IF p_bet_amount > 0 THEN v_multiplier := v_win_amount / p_bet_amount; END IF;
        v_result_data := jsonb_build_object('number', v_roulette_num);

    ELSIF p_game_name = 'Keno' THEN
        v_keno_drawn := '{}';
        WHILE array_length(v_keno_drawn, 1) IS NULL OR array_length(v_keno_drawn, 1) < 10 LOOP
            r := floor(random() * 40 + 1)::INT;
            IF NOT (r = ANY(v_keno_drawn)) THEN
                v_keno_drawn := array_append(v_keno_drawn, r);
            END IF;
        END LOOP;
        v_keno_user := ARRAY(SELECT jsonb_array_elements_text(p_payload->'numbers')::INT);
        FOR i IN 1..array_length(v_keno_user, 1) LOOP
            IF v_keno_user[i] = ANY(v_keno_drawn) THEN
                v_keno_hits := v_keno_hits + 1;
            END IF;
        END LOOP;
        IF v_keno_hits = 0 THEN v_multiplier := 0;
        ELSIF v_keno_hits = 1 THEN v_multiplier := 1;
        ELSIF v_keno_hits = 2 THEN v_multiplier := 2;
        ELSIF v_keno_hits >= 3 THEN v_multiplier := 10;
        END IF;
        v_win_amount := p_bet_amount * v_multiplier;
        v_result_data := jsonb_build_object('drawn', v_keno_drawn, 'hits', v_keno_hits);

    ELSIF p_game_name = 'Çarkıfelek' THEN
        v_wheel_spin := floor(random() * 15)::INT;
        v_win_amount := p_target;
        IF p_bet_amount > 0 THEN v_multiplier := v_win_amount / p_bet_amount; END IF;
        v_result_data := jsonb_build_object('segment', v_wheel_spin);
        
    ELSIF p_game_name = 'War' THEN
        v_war_p := floor(random() * 13 + 2)::INT;
        v_war_d := floor(random() * 13 + 2)::INT;
        IF v_war_p > v_war_d THEN
            v_multiplier := 2;
        ELSIF v_war_p = v_war_d THEN
            v_multiplier := 0.5; 
        ELSE
            v_multiplier := 0;
        END IF;
        v_win_amount := p_bet_amount * v_multiplier;
        v_result_data := jsonb_build_object('player', v_war_p, 'dealer', v_war_d);
    END IF;

    -- Max Payout Enforcement
    v_max_payout := LEAST(500000, p_bet_amount * 10000);
    IF v_win_amount > v_max_payout THEN v_win_amount := v_max_payout; END IF;

    -- Balance Update
    IF NOT v_is_guest THEN
        UPDATE members SET balance = balance - p_bet_amount + v_win_amount WHERE id = v_real_uuid;
    END IF;

    -- History Logging
    INSERT INTO game_history (bet_id, user_id, game_name, bet_amount, win_amount, multiplier, result_data)
    VALUES (p_bet_id, COALESCE(v_real_uuid, '00000000-0000-0000-0000-000000000000'::UUID), p_game_name, p_bet_amount, v_win_amount, v_multiplier, v_result_data);

    RETURN jsonb_build_object(
        'success', true,
        'win_amount', v_win_amount,
        'multiplier', v_multiplier,
        'new_balance', v_current_balance - p_bet_amount + v_win_amount,
        'result', v_result_data
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Session Games (Blackjack, HiLo, Mines) RPCs

CREATE OR REPLACE FUNCTION generate_deck() RETURNS JSONB AS $$
DECLARE
    deck JSONB := '[]'::JSONB;
    suits TEXT[] := ARRAY['hearts', 'diamonds', 'clubs', 'spades'];
    ranks TEXT[] := ARRAY['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
    i INT;
    j INT;
    k INT;
    temp JSONB;
BEGIN
    FOR i IN 1..4 LOOP
        FOR j IN 1..13 LOOP
            deck := deck || jsonb_build_object('suit', suits[i], 'rank', ranks[j], 'value', CASE WHEN j<9 THEN j+1 WHEN j<13 THEN 10 ELSE 11 END);
        END LOOP;
    END LOOP;
    -- Shuffle
    FOR i IN REVERSE 52..2 LOOP
        k := floor(random() * i)::INT;
        temp := deck->k;
        deck := jsonb_set(deck, ARRAY[k::text], deck->(i-1));
        deck := jsonb_set(deck, ARRAY[(i-1)::text], temp);
    END LOOP;
    RETURN deck;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION start_session_game(
    p_user_id TEXT,
    p_bet_amount NUMERIC,
    p_game_name TEXT,
    p_settings JSONB
) RETURNS JSONB AS $$
DECLARE
    v_current_balance NUMERIC;
    v_game_id UUID;
    v_state JSONB;
    v_deck JSONB;
    v_player_card JSONB;
    v_real_uuid UUID := NULL;
    v_is_guest BOOLEAN := FALSE;
BEGIN
    IF p_user_id LIKE 'guest_%' OR p_user_id = 'admin-session' THEN
        v_is_guest := TRUE;
    ELSE
        v_real_uuid := p_user_id::UUID;
    END IF;

    IF NOT v_is_guest THEN
        SELECT balance INTO v_current_balance FROM members WHERE id = v_real_uuid FOR UPDATE;
        IF v_current_balance IS NULL THEN RAISE EXCEPTION 'User not found'; END IF;
        IF v_current_balance < p_bet_amount THEN RAISE EXCEPTION 'Insufficient balance'; END IF;
        UPDATE members SET balance = balance - p_bet_amount WHERE id = v_real_uuid;
    ELSE
        v_current_balance := 999999999;
    END IF;

    IF p_game_name = 'HiLo' THEN
        v_deck := generate_deck();
        v_player_card := v_deck->0;
        v_deck := v_deck - 0;
        v_state := jsonb_build_object('deck', v_deck, 'currentCard', v_player_card, 'multiplier', 1.0);
    ELSIF p_game_name = 'Blackjack' THEN
        v_deck := generate_deck();
        v_state := jsonb_build_object('deck', v_deck - 0 - 1 - 2, 'playerHand', jsonb_build_array(v_deck->0, v_deck->1), 'dealerHand', jsonb_build_array(v_deck->2));
    ELSE
        v_state := p_settings; 
    END IF;

    INSERT INTO active_games (user_id, game_name, bet_amount, state)
    VALUES (p_user_id, p_game_name, p_bet_amount, v_state)
    RETURNING id INTO v_game_id;

    RETURN jsonb_build_object('success', true, 'game_id', v_game_id, 'new_balance', v_current_balance - p_bet_amount, 'state', v_state);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


CREATE OR REPLACE FUNCTION play_session_move(
    p_game_id UUID,
    p_user_id TEXT,
    p_move JSONB
) RETURNS JSONB AS $$
DECLARE
    v_game active_games%ROWTYPE;
    v_action TEXT;
    v_state JSONB;
    v_next_card JSONB;
    v_curr_val INT;
    v_next_val INT;
BEGIN
    SELECT * INTO v_game FROM active_games WHERE id = p_game_id AND user_id = p_user_id FOR UPDATE;
    IF NOT FOUND THEN RAISE EXCEPTION 'Game not found'; END IF;
    v_state := v_game.state;
    v_action := p_move->>'action';

    IF v_game.game_name = 'HiLo' THEN
        v_next_card := v_state->'deck'->0;
        v_state := jsonb_set(v_state, '{deck}', (v_state->'deck') - 0);
        v_curr_val := (v_state->'currentCard'->>'value')::INT;
        v_next_val := (v_next_card->>'value')::INT;
        
        IF (v_action = 'higher' AND v_next_val >= v_curr_val) OR (v_action = 'lower' AND v_next_val <= v_curr_val) THEN
            v_state := jsonb_set(v_state, '{currentCard}', v_next_card);
            v_state := jsonb_set(v_state, '{multiplier}', to_jsonb((v_state->>'multiplier')::NUMERIC * 1.5));
            UPDATE active_games SET state = v_state WHERE id = p_game_id;
            RETURN jsonb_build_object('success', true, 'status', 'continue', 'state', v_state);
        ELSE
            DELETE FROM active_games WHERE id = p_game_id;
            INSERT INTO game_history (bet_id, user_id, game_name, bet_amount, win_amount, multiplier) VALUES (p_game_id::text, COALESCE(NULLIF(regexp_replace(p_user_id, 'guest_.*', ''), ''), '00000000-0000-0000-0000-000000000000')::UUID, 'HiLo', v_game.bet_amount, 0, 0);
            RETURN jsonb_build_object('success', true, 'status', 'bust', 'card', v_next_card);
        END IF;
    END IF;

    RETURN jsonb_build_object('success', false, 'error', 'Action not supported');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


CREATE OR REPLACE FUNCTION cashout_session_game(
    p_game_id UUID,
    p_user_id TEXT
) RETURNS JSONB AS $$
DECLARE
    v_game active_games%ROWTYPE;
    v_win NUMERIC;
    v_mult NUMERIC;
    v_bal NUMERIC;
    v_real_uuid UUID := NULL;
BEGIN
    SELECT * INTO v_game FROM active_games WHERE id = p_game_id AND user_id = p_user_id FOR UPDATE;
    IF NOT FOUND THEN RAISE EXCEPTION 'Game not found'; END IF;

    IF v_game.game_name = 'HiLo' THEN
        v_mult := (v_game.state->>'multiplier')::NUMERIC;
        v_win := v_game.bet_amount * v_mult;
    END IF;

    DELETE FROM active_games WHERE id = p_game_id;
    
    IF p_user_id NOT LIKE 'guest_%' AND p_user_id != 'admin-session' THEN
        v_real_uuid := p_user_id::UUID;
        SELECT balance INTO v_bal FROM members WHERE id = v_real_uuid FOR UPDATE;
        UPDATE members SET balance = balance + v_win WHERE id = v_real_uuid;
    ELSE
        v_bal := 999999999;
    END IF;

    INSERT INTO game_history (bet_id, user_id, game_name, bet_amount, win_amount, multiplier) VALUES (p_game_id::text, COALESCE(v_real_uuid, '00000000-0000-0000-0000-000000000000'::UUID), v_game.game_name, v_game.bet_amount, v_win, v_mult);

    RETURN jsonb_build_object('success', true, 'win_amount', v_win, 'new_balance', v_bal + v_win);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
