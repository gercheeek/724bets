import re

with open('contexts/BettingContext.tsx', 'r') as f:
    content = f.read()

# Replace the MOCK_MATCHES
old_mock = """const MOCK_MATCHES = [
  {
    id: 'm1',
    sport: 'Futbol',
    league: 'Trendyol Süper Lig',
    country: 'Türkiye',
    home: 'Fenerbahçe',
    away: 'Galatasaray',
    homeLogo: 'https://assets.football-logos.cc/logos/turkey/700x700/fenerbahce.0df7e3ee.png',
    awayLogo: 'https://assets.football-logos.cc/logos/turkey/700x700/galatasaray.090f837e.png',
    time: '20:00',
    date: 'Bugün',
    isLive: false,
    homeOdd: '2.10',
    drawOdd: '3.40',
    awayOdd: '2.85'
  },
  {
    id: 'm2',
    sport: 'Futbol',
    league: 'UEFA Champions League',
    country: 'Europe',
    home: 'Real Madrid',
    away: 'Manchester City',
    homeLogo: 'https://assets.football-logos.cc/logos/spain/700x700/real-madrid.0b9dfb2e.png',
    awayLogo: 'https://assets.football-logos.cc/logos/england/700x700/manchester-city.4f8101a9.png',
    time: '22:00',
    date: 'Bugün',
    isLive: false,
    homeOdd: '2.40',
    drawOdd: '3.60',
    awayOdd: '2.50'
  },
  {
    id: 'm3',
    sport: 'Futbol',
    league: 'Premier League',
    country: 'England',
    home: 'Arsenal',
    away: 'Liverpool',
    homeLogo: 'https://assets.football-logos.cc/logos/england/700x700/arsenal.56dddf4b.png',
    awayLogo: 'https://assets.football-logos.cc/logos/england/700x700/liverpool.5ca73373.png',
    time: '75\\' (2-1)',
    date: 'Bugün',
    isLive: true,
    homeOdd: '1.95',
    drawOdd: '3.80',
    awayOdd: '3.10'
  }
];"""

new_mock = """const MOCK_MATCHES = [
  {
    id: 'm1',
    sport: 'Futbol',
    league: 'Trendyol Süper Lig',
    country: 'Türkiye',
    home: 'Fenerbahçe',
    away: 'Galatasaray',
    homeLogo: 'https://assets.football-logos.cc/logos/turkey/700x700/fenerbahce.0df7e3ee.png',
    awayLogo: 'https://assets.football-logos.cc/logos/turkey/700x700/galatasaray.090f837e.png',
    time: '20:00',
    date: 'Bugün',
    isLive: false,
    homeOdd: '2.10',
    drawOdd: '3.40',
    awayOdd: '2.85',
    odds: { '1': '2.10', 'X': '3.40', '2': '2.85', 'O': '1.80', 'U': '1.90', 'tP': '2.5' }
  },
  {
    id: 'm2',
    sport: 'Futbol',
    league: 'UEFA Champions League',
    country: 'Europe',
    home: 'Real Madrid',
    away: 'Manchester City',
    homeLogo: 'https://assets.football-logos.cc/logos/spain/700x700/real-madrid.0b9dfb2e.png',
    awayLogo: 'https://assets.football-logos.cc/logos/england/700x700/manchester-city.4f8101a9.png',
    time: '22:00',
    date: 'Bugün',
    isLive: false,
    homeOdd: '2.40',
    drawOdd: '3.60',
    awayOdd: '2.50',
    odds: { '1': '2.40', 'X': '3.60', '2': '2.50', 'O': '1.85', 'U': '1.85', 'tP': '2.5' }
  },
  {
    id: 'm3',
    sport: 'Futbol',
    league: 'Premier League',
    country: 'England',
    home: 'Arsenal',
    away: 'Liverpool',
    homeLogo: 'https://assets.football-logos.cc/logos/england/700x700/arsenal.56dddf4b.png',
    awayLogo: 'https://assets.football-logos.cc/logos/england/700x700/liverpool.5ca73373.png',
    time: "75' (2-1)",
    date: 'Bugün',
    isLive: true,
    homeOdd: '1.95',
    drawOdd: '3.80',
    awayOdd: '3.10',
    odds: { '1': '1.95', 'X': '3.80', '2': '3.10', 'O': '1.70', 'U': '2.00', 'tP': '3.5' }
  }
];"""

if old_mock in content:
    content = content.replace(old_mock, new_mock)
    with open('contexts/BettingContext.tsx', 'w') as f:
        f.write(content)
    print("Fixed MOCK_MATCHES odds!")
else:
    print("Could not find old mock exactly.")
