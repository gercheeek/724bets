import re

with open('/Users/alex/Desktop/7_24bets-landing-page/components/GuestLanding.tsx', 'r') as f:
    content = f.read()

# Add import if not exists
if 'import VIPHeroBanner' not in content:
    content = content.replace("import LiveWinsTicker from './LiveWinsTicker';", "import LiveWinsTicker from './LiveWinsTicker';\nimport VIPHeroBanner from './VIPHeroBanner';")

# Insert VIPHeroBanner after the 4 cards. The 4 cards div ends before the LiveWinsTicker div.
# Looking for:
#             <div className="w-full mt-8 mb-8">
#               <LiveWinsTicker />

insert_str = """
            {/* VIP SYSTEM BANNER */}
            <div className="w-full mt-4 mb-4">
                <VIPHeroBanner />
            </div>
"""

content = content.replace('<div className="w-full mt-8 mb-8">\n              <LiveWinsTicker />', insert_str + '\n            <div className="w-full mt-8 mb-8">\n              <LiveWinsTicker />')

with open('/Users/alex/Desktop/7_24bets-landing-page/components/GuestLanding.tsx', 'w') as f:
    f.write(content)
