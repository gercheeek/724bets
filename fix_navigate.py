import re

with open('/Users/alex/Desktop/7_24bets-landing-page/components/GamesHeroBanner.tsx', 'r') as f:
    content = f.read()

content = content.replace("new CustomEvent('navigate'", "new CustomEvent('internal-navigate'")
content = content.replace("animationName: 'scaleX'", "animationName: 'shimmer'")

with open('/Users/alex/Desktop/7_24bets-landing-page/components/GamesHeroBanner.tsx', 'w') as f:
    f.write(content)

