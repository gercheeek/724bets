import re

# 1. Update index.css
css_file = '/Users/alex/Desktop/7_24bets-landing-page/index.css'
with open(css_file, 'r') as f:
    css_content = f.read()

# Make it spin 4 times (-1440deg)
css_content = css_content.replace('transform: rotateX(-360deg)', 'transform: rotateX(-1440deg)')
with open(css_file, 'w') as f:
    f.write(css_content)

# 2. Update Header.tsx
header_file = '/Users/alex/Desktop/7_24bets-landing-page/components/Header.tsx'
with open(header_file, 'r') as f:
    header_content = f.read()

# Change hover animation parameters to 2.5s with strong deceleration
# old: group-hover:animate-[slotReel_0.6s_cubic-bezier(0.4,0,0.2,1)_1]
# new: group-hover:animate-[slotReel_2.5s_cubic-bezier(0.1,0.9,0.2,1)_1]
header_content = header_content.replace('slotReel_0.6s_cubic-bezier(0.4,0,0.2,1)_1', 'slotReel_2.5s_cubic-bezier(0.1,0.9,0.2,1)_1')

# Move the clover closer: ml-1.5 -> ml-0.5
header_content = header_content.replace('w-5 h-5 md:w-6 md:h-6 ml-1.5 -mt-3', 'w-5 h-5 md:w-6 md:h-6 ml-0 -mt-3')

with open(header_file, 'w') as f:
    f.write(header_content)
