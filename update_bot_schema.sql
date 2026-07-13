-- Add is_bot column to members table if it does not exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='members' AND column_name='is_bot') THEN
    ALTER TABLE members ADD COLUMN is_bot BOOLEAN DEFAULT false;
  END IF;
END $$;
