import re

with open('/Users/alex/Desktop/7_24bets-landing-page/components/OriginalsHub.tsx', 'r') as f:
    content = f.read()

content = content.replace("<GamesHeroBanner />", "<GamesHeroBanner onNavigate={onNavigate} />")

with open('/Users/alex/Desktop/7_24bets-landing-page/components/OriginalsHub.tsx', 'w') as f:
    f.write(content)
