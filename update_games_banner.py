import re

with open('/Users/alex/Desktop/7_24bets-landing-page/components/GamesHeroBanner.tsx', 'r') as f:
    content = f.read()

# Update signature
content = content.replace("const HeroBanner = () => {", "const HeroBanner = ({ onNavigate }: { onNavigate?: (v: string) => void }) => {")

# Update dispatch
old_dispatch = "window.dispatchEvent(new CustomEvent('internal-navigate', { detail: path }));"
new_dispatch = "if (onNavigate) { onNavigate(path); } else { window.history.pushState(null, '', '/' + path); window.dispatchEvent(new Event('popstate')); }"
content = content.replace(old_dispatch, new_dispatch)

with open('/Users/alex/Desktop/7_24bets-landing-page/components/GamesHeroBanner.tsx', 'w') as f:
    f.write(content)
