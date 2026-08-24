import re

with open('contexts/BettingContext.tsx', 'r') as f:
    content = f.read()

# Make Arsenal vs Liverpool live
old_arsenal = "home: 'Arsenal',\n    away: 'Liverpool',\n    homeLogo: 'https://assets.football-logos.cc/logos/england/700x700/arsenal.56dddf4b.png',\n    awayLogo: 'https://assets.football-logos.cc/logos/england/700x700/liverpool.5ca73373.png',\n    time: '17:30',\n    date: 'Yarın',\n    isLive: false,"
new_arsenal = "home: 'Arsenal',\n    away: 'Liverpool',\n    homeLogo: 'https://assets.football-logos.cc/logos/england/700x700/arsenal.56dddf4b.png',\n    awayLogo: 'https://assets.football-logos.cc/logos/england/700x700/liverpool.5ca73373.png',\n    time: '75\\' (2-1)',\n    date: 'Bugün',\n    isLive: true,"

if old_arsenal in content:
    content = content.replace(old_arsenal, new_arsenal)
    with open('contexts/BettingContext.tsx', 'w') as f:
        f.write(content)
    print("Made Arsenal match live!")
else:
    print("Could not find Arsenal match to update.")
