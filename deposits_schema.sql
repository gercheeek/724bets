-- deposits_schema.sql

-- 1. Create the deposits table
CREATE TABLE IF NOT EXISTS public.deposits (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    username TEXT NOT NULL,
    method TEXT NOT NULL, -- 'bank' or 'crypto'
    amount NUMERIC NOT NULL,
    tx_hash TEXT, -- İşlem ID, İsim Soyisim veya Cüzdan Adresi
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Add RLS Policies (Row Level Security)
ALTER TABLE public.deposits ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (since we might not have a strict auth session for the landing page yet)
CREATE POLICY "Allow public insert on deposits" ON public.deposits FOR INSERT WITH CHECK (true);

-- Allow public to select their own deposits if needed (for now, allow all to read or restrict to authenticated)
CREATE POLICY "Allow public select on deposits" ON public.deposits FOR SELECT USING (true);

-- Allow public update (for admin panel, in a real scenario this should check for admin role)
CREATE POLICY "Allow public update on deposits" ON public.deposits FOR UPDATE USING (true) WITH CHECK (true);

-- Allow public delete (for admin panel)
CREATE POLICY "Allow public delete on deposits" ON public.deposits FOR DELETE USING (true);
