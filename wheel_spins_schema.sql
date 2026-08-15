-- Table for recording Lucky Wheel spins
CREATE TABLE IF NOT EXISTS wheel_spins (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id TEXT NOT NULL,
    username TEXT,
    bet_amount NUMERIC NOT NULL,
    win_amount NUMERIC NOT NULL,
    prize_name TEXT,
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE wheel_spins ENABLE ROW LEVEL SECURITY;

-- Allow authenticated and guest users to insert their own spins
DROP POLICY IF EXISTS "Users can insert own wheel spins" ON wheel_spins;
CREATE POLICY "Users can insert own wheel spins" 
ON wheel_spins FOR INSERT 
WITH CHECK (true);

-- Allow public read access for realtime dashboard
DROP POLICY IF EXISTS "Public can read wheel spins" ON wheel_spins;
CREATE POLICY "Public can read wheel spins" 
ON wheel_spins FOR SELECT 
USING (true);

-- Admins can update/delete
DROP POLICY IF EXISTS "Admins can update wheel spins" ON wheel_spins;
DROP POLICY IF EXISTS "Admins can delete wheel spins" ON wheel_spins;
CREATE POLICY "Admins can update wheel spins" ON wheel_spins FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admins can delete wheel spins" ON wheel_spins FOR DELETE USING (is_admin());

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE wheel_spins;
