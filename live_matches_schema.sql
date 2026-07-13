-- ==========================================
-- Live Matches Schema for 724BAHİS Bulletin
-- ==========================================

-- 1. Create the table
CREATE TABLE IF NOT EXISTS public.live_matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    home_team TEXT NOT NULL,
    away_team TEXT NOT NULL,
    match_time TEXT NOT NULL,
    home_odd NUMERIC(10, 2),
    draw_odd NUMERIC(10, 2),
    away_odd NUMERIC(10, 2),
    status TEXT DEFAULT 'Live', -- e.g., 'Live', '1. Set', 'Halftime'
    is_active BOOLEAN DEFAULT true,
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    
    -- Unique constraint so we can upsert based on home and away team
    UNIQUE(home_team, away_team)
);

-- 2. Enable RLS but allow public read
ALTER TABLE public.live_matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on live_matches"
    ON public.live_matches
    FOR SELECT
    TO public
    USING (true);

-- Allow service role to do everything (the bot will use service role key or a secured endpoint)
CREATE POLICY "Allow service role all on live_matches"
    ON public.live_matches
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 3. Create a trigger to automatically update last_updated timestamp
CREATE OR REPLACE FUNCTION update_live_matches_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_updated = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_live_matches_updated ON public.live_matches;

CREATE TRIGGER trg_live_matches_updated
BEFORE UPDATE ON public.live_matches
FOR EACH ROW
EXECUTE FUNCTION update_live_matches_timestamp();

-- 4. Enable Realtime for the table
-- Go to Database -> Replication in Supabase Dashboard and toggle 'live_matches' if it's not automatically enabled by the generic publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.live_matches;
