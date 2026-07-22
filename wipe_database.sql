-- ==============================================================
-- 724BAHİS PRO CASINO - VERİTABANI SIFIRLAMA (WIPE) SCRİPTİ
-- ==============================================================
-- Bu script, test sürecinde oluşan tüm oyun geçmişini, 
-- aktif oyun oturumlarını ve bakiye kayıtlarını temizleyerek
-- sistemi canlı ortama (Production) hazır, tertemiz bir hale getirir.

BEGIN;

-- 1. Tüm oyun geçmişini ve istatistikleri sıfırla
TRUNCATE TABLE game_history RESTART IDENTITY CASCADE;

-- 2. Yarıda kalmış tüm aktif oyun (session) oturumlarını sıfırla
TRUNCATE TABLE active_games RESTART IDENTITY CASCADE;

-- 3. Kullanıcıları tamamen silmek (Auth sorunlarına yol açabilir) yerine, 
-- test amaçlı şişen tüm bakiyeleri 0'a eşitliyoruz.
-- Yeni üye olan veya bakiye yükleyen temiz bir sayfadan başlayacak.
UPDATE members 
SET balance = 0;

-- Not: Eğer sisteminizde ek olarak bir 'site_users' tablosu varsa,
-- aşağıdaki satırın başındaki '--' işaretini kaldırabilirsiniz.
-- UPDATE site_users SET balance = 0;

COMMIT;

-- BAŞARIYLA TAMAMLANDI.
