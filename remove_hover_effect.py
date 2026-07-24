import re

with open('/Users/alex/Desktop/7_24bets-landing-page/components/GuestLanding.tsx', 'r') as f:
    content = f.read()

# Remove the spinning conic gradients from all cards
# We can use regex to remove any div that matches this pattern
pattern = r'<div className="absolute inset-\[-50%\] bg-\[conic-gradient\([^\]]+\)\] opacity-0 group-hover:opacity-60 animate-\[spin_[^\]]+\] pointer-events-none"></div>\n*'
content = re.sub(pattern, '', content)

# Remove drop-shadows from the main wrappers of the cards to remove the colored glow on hover
# The wrapper classes look like: clip-tech drop-shadow-[0_0_20px_rgba(6,182,212,0.1)] hover:drop-shadow-[0_0_40px_rgba(6,182,212,0.4)]
shadow_pattern = r' drop-shadow-\[[^\]]+\] hover:drop-shadow-\[[^\]]+\]'
content = re.sub(shadow_pattern, '', content)

with open('/Users/alex/Desktop/7_24bets-landing-page/components/GuestLanding.tsx', 'w') as f:
    f.write(content)
