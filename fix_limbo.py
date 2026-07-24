import re

with open('/Users/alex/Desktop/7_24bets-landing-page/components/GamesHeroBanner.tsx', 'r') as f:
    content = f.read()

# Replace: const path = gameId === 'plinko' ? 'plinko' : gameId === 'limbo' ? 'mission' : gameId;
# With: const path = gameId;

content = content.replace("const path = gameId === 'plinko' ? 'plinko' : gameId === 'limbo' ? 'mission' : gameId;", "const path = gameId;")

with open('/Users/alex/Desktop/7_24bets-landing-page/components/GamesHeroBanner.tsx', 'w') as f:
    f.write(content)
