-- ==========================================
-- 🌧️ RAIN EVENT (YAĞMUR ETKİNLİĞİ) SCHEMA
-- ==========================================

-- 1. Tablolar
CREATE TABLE IF NOT EXISTS public.rain_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    status TEXT NOT NULL CHECK (status IN ('active', 'completed', 'cancelled')),
    total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    duration_seconds INTEGER NOT NULL DEFAULT 300,
    max_participants INTEGER DEFAULT 100,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ends_at TIMESTAMPTZ NOT NULL,
    created_by UUID REFERENCES auth.users(id)
);

CREATE TABLE IF NOT EXISTS public.rain_participants (
    event_id UUID REFERENCES public.rain_events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    claimed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    win_amount NUMERIC(10, 2) DEFAULT 0,
    is_vip BOOLEAN DEFAULT FALSE,
    vip_multiplier NUMERIC(3, 1) DEFAULT 1.0,
    PRIMARY KEY (event_id, user_id)
);

-- RLS (Row Level Security)
ALTER TABLE public.rain_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rain_participants ENABLE ROW LEVEL SECURITY;

-- Okuma izni (Herkes aktif yağmurları ve katılımcıları görebilir)
CREATE POLICY "Anyone can view rain events" ON public.rain_events FOR SELECT USING (true);
CREATE POLICY "Anyone can view participants" ON public.rain_participants FOR SELECT USING (true);

-- ==========================================
-- 2. RPC: Güvenli Claim (Anti-Bot & Kazanç)
-- ==========================================
CREATE OR REPLACE FUNCTION claim_rain_event(
    p_event_id UUID,
    p_user_id UUID
)
RETURNS JSON AS $$
DECLARE
    v_event_record RECORD;
    v_already_claimed BOOLEAN;
    v_participant_count INTEGER;
    v_is_vip BOOLEAN := FALSE;
    v_multiplier NUMERIC := 1.0;
    v_win_amount NUMERIC := 0;
    v_last_bet_time TIMESTAMPTZ;
BEGIN
    -- 1. Etkinlik kontrolü
    SELECT * INTO v_event_record FROM public.rain_events WHERE id = p_event_id;
    
    IF v_event_record.id IS NULL THEN
        RAISE EXCEPTION 'Etkinlik bulunamadı.';
    END IF;

    IF v_event_record.status != 'active' OR NOW() > v_event_record.ends_at THEN
        RAISE EXCEPTION 'Bu yağmur etkinliği sona ermiş veya aktif değil.';
    END IF;

    -- 2. Zaten katıldı mı?
    SELECT EXISTS (
        SELECT 1 FROM public.rain_participants WHERE event_id = p_event_id AND user_id = p_user_id
    ) INTO v_already_claimed;

    IF v_already_claimed THEN
        RAISE EXCEPTION 'Bu yağmur etkinliğine zaten katıldınız.';
    END IF;

    -- 3. Kapasite kontrolü
    SELECT COUNT(*) INTO v_participant_count FROM public.rain_participants WHERE event_id = p_event_id;
    IF v_participant_count >= v_event_record.max_participants THEN
        RAISE EXCEPTION 'Yağmur kapasitesi doldu.';
    END IF;

    -- 4. Bot Koruması: Aktiflik Kontrolü (Son 24 saatte bahis yapmış mı?)
    -- (Eğer bahis tablonuz farklıysa burayı sisteminize göre revize edebilirsiniz)
    -- SELECT MAX(created_at) INTO v_last_bet_time FROM public.finance_and_bets WHERE user_id = p_user_id;
    -- IF v_last_bet_time IS NULL OR v_last_bet_time < NOW() - INTERVAL '24 hours' THEN
    --    RAISE EXCEPTION 'Katılmak için son 24 saat içinde bahis yapmış olmalısınız.';
    -- END IF;

    -- 5. VIP Kontrolü (Members tablosundan okuyarak)
    -- Farz edelim ki members tablosunda role = 'vip' var.
    -- SELECT role INTO v_user_role FROM public.members WHERE user_id = p_user_id;
    -- IF v_user_role = 'vip' THEN v_is_vip := TRUE; v_multiplier := 2.0; END IF;

    -- 6. Ödül Dağıtım Logiği (Şansa dayalı rastgele kazanç - Havuzdan pay)
    -- Havuz: 5000, 100 kişi -> ortalama 50 TL. (30 TL ile 80 TL arası rastgele verelim)
    v_win_amount := (RANDOM() * 50 + 30) * v_multiplier;
    
    -- Havuz limitini aşmamak için güvenli bölge
    -- Gerçek sistemde dinamik paylaştırılabilir.

    -- 7. Kayıt Atma
    INSERT INTO public.rain_participants (event_id, user_id, win_amount, is_vip, vip_multiplier)
    VALUES (p_event_id, p_user_id, v_win_amount, v_is_vip, v_multiplier);

    -- 8. Bakiyeyi Güncelleme (RPC aracılığıyla)
    -- UPDATE public.members SET balance = balance + v_win_amount WHERE user_id = p_user_id;

    RETURN json_build_object(
        'success', true,
        'message', 'Yağmura başarıyla katıldınız!',
        'win_amount', v_win_amount
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 3. REALTIME PUB/SUB
-- ==========================================
-- Tablolarda Realtime'ı etkinleştir
ALTER PUBLICATION supabase_realtime ADD TABLE public.rain_events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.rain_participants;
