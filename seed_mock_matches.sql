-- 10 CANLI MAÇ (Live Matches)
INSERT INTO public.sports_matches (sport_category, league, team_home, team_away, match_date, is_live, score_home, score_away, match_minute, odds)
VALUES 
('Futbol', 'Şampiyonlar Ligi', 'Real Madrid', 'Manchester City', now() - interval '25 minutes', true, 1, 0, '25''', '{"1": 1.80, "X": 3.40, "2": 2.80, "tU": 1.95, "tA": 1.85, "cs1X": 1.2, "cs12": 1.3, "csX2": 1.5}'),
('Futbol', 'Süper Lig', 'Galatasaray', 'Fenerbahçe', now() - interval '45 minutes', true, 0, 0, 'İY', '{"1": 2.10, "X": 3.10, "2": 2.60, "tU": 1.75, "tA": 1.95, "cs1X": 1.3, "cs12": 1.4, "csX2": 1.4}'),
('Futbol', 'Premier Lig', 'Arsenal', 'Chelsea', now() - interval '70 minutes', true, 2, 1, '70''', '{"1": 1.40, "X": 4.50, "2": 5.20, "tU": 2.10, "tA": 1.70, "cs1X": 1.1, "cs12": 1.1, "csX2": 2.5}'),
('Futbol', 'La Liga', 'Barcelona', 'Atletico Madrid', now() - interval '10 minutes', true, 0, 1, '10''', '{"1": 2.80, "X": 3.20, "2": 2.10, "tU": 1.65, "tA": 2.15, "cs1X": 1.5, "cs12": 1.3, "csX2": 1.2}'),
('Basketbol', 'EuroLeague', 'Anadolu Efes', 'Panathinaikos', now() - interval '60 minutes', true, 45, 42, '3. Çeyrek', '{"1": 1.65, "X": 12.00, "2": 2.45, "tU": 1.85, "tA": 1.85, "cs1X": 1.0, "cs12": 1.0, "csX2": 1.0}'),
('Basketbol', 'NBA', 'Los Angeles Lakers', 'Golden State Warriors', now() - interval '90 minutes', true, 102, 98, '4. Çeyrek', '{"1": 1.45, "X": 15.00, "2": 3.10, "tU": 1.90, "tA": 1.90, "cs1X": 1.0, "cs12": 1.0, "csX2": 1.0}'),
('Tenis', 'Wimbledon', 'Alcaraz C.', 'Djokovic N.', now() - interval '120 minutes', true, 2, 2, '5. Set', '{"1": 1.85, "X": 0, "2": 1.85, "tU": 1.85, "tA": 1.85, "cs1X": 1.0, "cs12": 1.0, "csX2": 1.0}'),
('Futbol', 'Serie A', 'Juventus', 'Milan', now() - interval '85 minutes', true, 1, 1, '85''', '{"1": 3.50, "X": 1.80, "2": 4.20, "tU": 1.50, "tA": 2.50, "cs1X": 1.2, "cs12": 1.3, "csX2": 1.4}'),
('Futbol', 'Bundesliga', 'Bayern Münih', 'Borussia Dortmund', now() - interval '35 minutes', true, 3, 0, '35''', '{"1": 1.15, "X": 6.50, "2": 12.00, "tU": 2.50, "tA": 1.50, "cs1X": 1.05, "cs12": 1.1, "csX2": 4.5}'),
('Futbol', 'Ligue 1', 'PSG', 'Marsilya', now() - interval '15 minutes', true, 0, 0, '15''', '{"1": 1.55, "X": 3.80, "2": 4.50, "tU": 2.05, "tA": 1.75, "cs1X": 1.1, "cs12": 1.2, "csX2": 2.1}');

-- 10 GELECEK MAÇ (Upcoming Matches)
INSERT INTO public.sports_matches (sport_category, league, team_home, team_away, match_date, is_live, score_home, score_away, match_minute, odds)
VALUES 
('Futbol', 'Süper Lig', 'Beşiktaş', 'Trabzonspor', now() + interval '5 hours', false, 0, 0, '', '{"1": 2.15, "X": 3.20, "2": 2.75, "tU": 1.85, "tA": 1.85, "cs1X": 1.3, "cs12": 1.3, "csX2": 1.5}'),
('Futbol', 'Şampiyonlar Ligi', 'Inter', 'Liverpool', now() + interval '1 days', false, 0, 0, '', '{"1": 2.90, "X": 3.30, "2": 2.10, "tU": 1.95, "tA": 1.75, "cs1X": 1.5, "cs12": 1.3, "csX2": 1.2}'),
('Basketbol', 'EuroLeague', 'Fenerbahçe Beko', 'Real Madrid', now() + interval '8 hours', false, 0, 0, '', '{"1": 1.95, "X": 14.00, "2": 2.05, "tU": 1.85, "tA": 1.85, "cs1X": 1.0, "cs12": 1.0, "csX2": 1.0}'),
('Futbol', 'Premier Lig', 'Manchester Utd', 'Tottenham', now() + interval '2 days', false, 0, 0, '', '{"1": 2.45, "X": 3.40, "2": 2.50, "tU": 2.10, "tA": 1.65, "cs1X": 1.4, "cs12": 1.3, "csX2": 1.4}'),
('Tenis', 'US Open', 'Sinner J.', 'Medvedev D.', now() + interval '3 hours', false, 0, 0, '', '{"1": 1.65, "X": 0, "2": 2.10, "tU": 1.85, "tA": 1.85, "cs1X": 1.0, "cs12": 1.0, "csX2": 1.0}'),
('Futbol', 'La Liga', 'Sevilla', 'Valencia', now() + interval '6 hours', false, 0, 0, '', '{"1": 2.00, "X": 3.10, "2": 3.20, "tU": 1.65, "tA": 2.10, "cs1X": 1.2, "cs12": 1.3, "csX2": 1.6}'),
('Basketbol', 'NBA', 'Boston Celtics', 'Miami Heat', now() + interval '12 hours', false, 0, 0, '', '{"1": 1.40, "X": 16.00, "2": 3.20, "tU": 1.85, "tA": 1.85, "cs1X": 1.0, "cs12": 1.0, "csX2": 1.0}'),
('Futbol', 'Serie A', 'Napoli', 'Roma', now() + interval '4 hours', false, 0, 0, '', '{"1": 1.85, "X": 3.40, "2": 3.80, "tU": 1.80, "tA": 1.90, "cs1X": 1.15, "cs12": 1.25, "csX2": 1.8}'),
('Voleybol', 'Milletler Ligi', 'Türkiye', 'İtalya', now() + interval '24 hours', false, 0, 0, '', '{"1": 1.70, "X": 0, "2": 2.00, "tU": 1.85, "tA": 1.85, "cs1X": 1.0, "cs12": 1.0, "csX2": 1.0}'),
('Futbol', 'Bundesliga', 'Bayer Leverkusen', 'RB Leipzig', now() + interval '48 hours', false, 0, 0, '', '{"1": 2.20, "X": 3.50, "2": 2.60, "tU": 2.20, "tA": 1.60, "cs1X": 1.35, "cs12": 1.2, "csX2": 1.45}');
