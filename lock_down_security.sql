-- ========================================================================================
-- 724BETS SECURITY LOCKDOWN SCRIPT
-- Bu script'i kopyalayıp Supabase SQL Editor'de çalıştırın.
-- ========================================================================================

-- 1. Bakiye Düşürme (FakeBet) için Güvenli RPC Fonksiyonu
-- Bu fonksiyon SECURITY DEFINER yetkisiyle çalışır (DB admin yetkisiyle)
-- Ancak sadece işlemi yapan kişinin (auth.uid()) kendi bakiyesini düşürmesine izin verir.
CREATE OR REPLACE FUNCTION deduct_balance(amount DECIMAL)
RETURNS void AS $$
DECLARE
  current_balance DECIMAL;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Geçici olarak trigger'ı bypass etmek için session variable ayarla
  PERFORM set_config('myapp.bypass_rls', 'true', true);

  UPDATE public.members 
  SET balance = balance - amount 
  WHERE id = auth.uid() AND balance >= amount;

  -- Değişkeni temizle
  PERFORM set_config('myapp.bypass_rls', '', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Members Tablosunu Güvenli Hale Getirme (Trigger ile Bakiye/Rol Koruması)
-- Frontend üzerinden gelen doğrudan (update) isteklerinde bakiye ve rol değişimini engeller.
-- Sadece admin olanların bu kolonları değiştirmesine izin verir.

CREATE OR REPLACE FUNCTION prevent_unauthorized_member_updates()
RETURNS TRIGGER AS $$
DECLARE
  is_admin BOOLEAN := FALSE;
  bypass_flag TEXT;
BEGIN
  -- RPC'lerden gelen bypass bayrağını kontrol et
  bypass_flag := current_setting('myapp.bypass_rls', true);
  IF bypass_flag = 'true' THEN
    RETURN NEW; -- Güvenli RPC'den geldi, işleme izin ver
  END IF;

  -- İşlemi yapan kişi admin mi kontrol et
  SELECT EXISTS (
    SELECT 1 FROM public.members 
    WHERE id = auth.uid() AND role IN ('admin', 'moderator')
  ) INTO is_admin;

  IF NOT is_admin THEN
    -- Admin değilse ve bakiye veya rol değiştirmeye çalışıyorsa engelle
    IF NEW.balance IS DISTINCT FROM OLD.balance THEN
      RAISE EXCEPTION 'GÜVENLİK İHLALİ: Bakiye doğrudan güncellenemez!';
    END IF;

    IF NEW.role IS DISTINCT FROM OLD.role THEN
      RAISE EXCEPTION 'GÜVENLİK İHLALİ: Rol doğrudan güncellenemez!';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Önce varsa eski trigger'ı sil
DROP TRIGGER IF EXISTS check_unauthorized_updates ON public.members;

-- Trigger'ı oluştur
CREATE TRIGGER check_unauthorized_updates
BEFORE UPDATE ON public.members
FOR EACH ROW
EXECUTE FUNCTION prevent_unauthorized_member_updates();
