-- Disable RLS on chat_channels so the client (using anon key) can create channels
ALTER TABLE chat_channels DISABLE ROW LEVEL SECURITY;

-- Enable public access policies for chat_channels as a fallback/alternative
-- CREATE POLICY "Public can insert chat_channels" ON chat_channels FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Public can update chat_channels" ON chat_channels FOR UPDATE USING (true);
-- CREATE POLICY "Public can delete chat_channels" ON chat_channels FOR DELETE USING (true);
