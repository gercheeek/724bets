-- ================================================================
-- 724BAHİS.NET — TV Chat Database Fix
-- Run this script in the Supabase Dashboard > SQL Editor
-- ================================================================

-- 1. Add missing columns to the legacy tv_chat table
ALTER TABLE tv_chat ADD COLUMN IF NOT EXISTS channel_id UUID;
ALTER TABLE tv_chat ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- 2. Ensure Row Level Security (RLS) is enabled and has correct policies
ALTER TABLE tv_chat ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can insert tv_chat" ON tv_chat;
DROP POLICY IF EXISTS "Public can read tv_chat" ON tv_chat;
DROP POLICY IF EXISTS "Service can manage tv_chat" ON tv_chat;

CREATE POLICY "Public can insert tv_chat" ON tv_chat FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can read tv_chat" ON tv_chat FOR SELECT USING (true);
CREATE POLICY "Service can manage tv_chat" ON tv_chat FOR ALL USING (true);

-- 3. Enable Realtime replication so messages sync instantly across PCs & tablets
-- First, try to add to supabase_realtime publication
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'tv_chat'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE tv_chat;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    -- If publication doesn't exist, create it or handle it
    NULL;
END $$;

-- 4. Reload PostgREST schema cache to ensure the API immediately recognizes the new columns
NOTIFY pgrst, 'reload schema';
