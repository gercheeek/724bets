import re

with open('contexts/BettingContext.tsx', 'r') as f:
    content = f.read()

# 1. Fix home -> homeTeam and away -> awayTeam in MOCK_MATCHES
content = content.replace("home: 'Fenerbahçe',", "homeTeam: 'Fenerbahçe',")
content = content.replace("away: 'Galatasaray',", "awayTeam: 'Galatasaray',")
content = content.replace("home: 'Real Madrid',", "homeTeam: 'Real Madrid',")
content = content.replace("away: 'Manchester City',", "awayTeam: 'Manchester City',")
content = content.replace("home: 'Arsenal',", "homeTeam: 'Arsenal',")
content = content.replace("away: 'Liverpool',", "awayTeam: 'Liverpool',")

# 2. Fix the initial state of global1xBetMatches and global1xBetPreMatches
old_1xbet_matches = "const [global1xBetMatches, setGlobal1xBetMatches] = useState<any[]>(MOCK_MATCHES);"
new_1xbet_matches = "const [global1xBetMatches, setGlobal1xBetMatches] = useState<any[]>(MOCK_MATCHES.filter(m => m.isLive));"
content = content.replace(old_1xbet_matches, new_1xbet_matches)

old_pre_matches = "const [global1xBetPreMatches, setGlobal1xBetPreMatches] = useState<any[]>([]);"
new_pre_matches = "const [global1xBetPreMatches, setGlobal1xBetPreMatches] = useState<any[]>(MOCK_MATCHES.filter(m => !m.isLive));"
content = content.replace(old_pre_matches, new_pre_matches)

with open('contexts/BettingContext.tsx', 'w') as f:
    f.write(content)

print("Fixed mock teams and filtered states properly!")
