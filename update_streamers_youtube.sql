-- ================================================================
-- Run this SQL in your Supabase Dashboard > SQL Editor
-- to allow 'youtube' in the platform_type column constraint.
-- ================================================================

-- 1. Drop existing check constraint if it exists (names vary)
ALTER TABLE streamers DROP CONSTRAINT IF EXISTS streamers_platform_type_check;

-- 2. Add the updated CHECK constraint supporting 'youtube'
ALTER TABLE streamers ADD CONSTRAINT streamers_platform_type_check CHECK (platform_type IN ('kick', 'twitch', 'youtube'));
