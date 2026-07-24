import re

def use_games_banner():
    with open('/Users/alex/Desktop/7_24bets-landing-page/components/OriginalsHub.tsx', 'r') as f:
        content = f.read()

    # Import it
    if "import GamesHeroBanner" not in content:
        content = content.replace("import VIPHeroBanner from './VIPHeroBanner';", "import VIPHeroBanner from './VIPHeroBanner';\nimport GamesHeroBanner from './GamesHeroBanner';")

    # Replace the second one
    # Currently it looks like:
    # <VIPHeroBanner />
    # <div className="mt-8">
    #   <VIPHeroBanner />
    # </div>
    
    target_pattern = r'<div className="mt-8">\s*<VIPHeroBanner />\s*</div>'
    replacement = r'<div className="mt-8">\n                     <GamesHeroBanner />\n                   </div>'
    
    content = re.sub(target_pattern, replacement, content)

    with open('/Users/alex/Desktop/7_24bets-landing-page/components/OriginalsHub.tsx', 'w') as f:
        f.write(content)

use_games_banner()
print("OriginalsHub updated to use GamesHeroBanner")
