import re

def add_duplicate_banner():
    with open('/Users/alex/Desktop/7_24bets-landing-page/components/OriginalsHub.tsx', 'r') as f:
        content = f.read()

    # The line is `<VIPHeroBanner />`
    # Let's replace it with two of them, perhaps wrapped in a flex column if necessary, or just one after another with spacing.
    # I'll just add `<div className="mt-8"><VIPHeroBanner /></div>` right after it.
    
    target_pattern = r'(<VIPHeroBanner\s*/>)'
    replacement = r'\1\n                   <div className="mt-8">\n                     <VIPHeroBanner />\n                   </div>'
    
    content = re.sub(target_pattern, replacement, content, count=1)

    with open('/Users/alex/Desktop/7_24bets-landing-page/components/OriginalsHub.tsx', 'w') as f:
        f.write(content)

add_duplicate_banner()
print("Banner duplicated")
