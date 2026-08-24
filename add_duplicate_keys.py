import re

with open('contexts/BettingContext.tsx', 'r') as f:
    content = f.read()

# Add fallback keys
content = content.replace("homeTeam: 'Fenerbahçe',", "homeTeam: 'Fenerbahçe',\n    home: 'Fenerbahçe',")
content = content.replace("awayTeam: 'Galatasaray',", "awayTeam: 'Galatasaray',\n    away: 'Galatasaray',")

content = content.replace("homeTeam: 'Real Madrid',", "homeTeam: 'Real Madrid',\n    home: 'Real Madrid',")
content = content.replace("awayTeam: 'Manchester City',", "awayTeam: 'Manchester City',\n    away: 'Manchester City',")

content = content.replace("homeTeam: 'Arsenal',", "homeTeam: 'Arsenal',\n    home: 'Arsenal',")
content = content.replace("awayTeam: 'Liverpool',", "awayTeam: 'Liverpool',\n    away: 'Liverpool',")

with open('contexts/BettingContext.tsx', 'w') as f:
    f.write(content)

print("Added backwards compatible keys!")
