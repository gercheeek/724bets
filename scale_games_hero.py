import re

with open('/Users/alex/Desktop/7_24bets-landing-page/components/GamesHeroBanner.tsx', 'r') as f:
    content = f.read()

# Scale down "EN ÇOK KAZANDIRAN"
content = content.replace('text-3xl md:text-4xl lg:text-5xl font-black', 'text-xl md:text-2xl lg:text-3xl font-black')

# Scale down "OYUNLAR"
content = content.replace('text-4xl md:text-5xl lg:text-6xl inline-block', 'text-2xl md:text-3xl lg:text-4xl inline-block')

# Scale down jackpot value
content = content.replace('text-2xl md:text-4xl font-arcade text-transparent', 'text-xl md:text-2xl lg:text-3xl font-arcade text-transparent')

with open('/Users/alex/Desktop/7_24bets-landing-page/components/GamesHeroBanner.tsx', 'w') as f:
    f.write(content)
