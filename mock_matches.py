import re

with open('contexts/BettingContext.tsx', 'r') as f:
    content = f.read()

mock_matches = """const MOCK_MATCHES = [
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
    time: '17:30',
    date: 'Yarın',
    isLive: false,
    homeOdd: '1.95',
    drawOdd: '3.80',
    awayOdd: '3.10'
  }
];
"""

# Replace the empty array initialization
old_state = "const [global1xBetMatches, setGlobal1xBetMatches] = useState<any[]>([]);"
new_state = mock_matches + "\n  const [global1xBetMatches, setGlobal1xBetMatches] = useState<any[]>(MOCK_MATCHES);"
content = content.replace(old_state, new_state)

with open('contexts/BettingContext.tsx', 'w') as f:
    f.write(content)

print("Injected MOCK_MATCHES!")
