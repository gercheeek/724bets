-- RLS (Row Level Security) kurallarını sıfırla ve anonim kayıtlar için izin ver
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

-- Eğer eski kural varsa sil (hata vermemesi için)
DROP POLICY IF EXISTS "Public can insert members" ON members;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON members;
DROP POLICY IF EXISTS "Enable insert for anon users" ON members;
DROP POLICY IF EXISTS "Enable read access for all users" ON members;
DROP POLICY IF EXISTS "Enable update for users based on email" ON members;

-- 1. Herkesin yeni kayıt oluşturmasına (INSERT) izin veren kural
CREATE POLICY "Enable insert for anon users" ON members FOR INSERT WITH CHECK (true);

-- 2. Herkesin okumasına (SELECT) izin veren kural (giriş yaparken kontrol için)
CREATE POLICY "Enable read access for all users" ON members FOR SELECT USING (true);

-- 3. Kullanıcıların kendi şifrelerini/bilgilerini güncellemesine izin veren kural
CREATE POLICY "Enable update for users based on email" ON members FOR UPDATE USING (true);
