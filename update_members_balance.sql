-- update_members_balance.sql

-- Add balance column to members table for real money (TL/USDT) balance tracking.
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='members' AND column_name='balance') THEN
    ALTER TABLE members ADD COLUMN balance NUMERIC(10,2) DEFAULT 0.00;
  END IF;
END $$;
