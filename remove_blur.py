import re

# 1. GuestLanding.tsx
with open('/Users/alex/Desktop/7_24bets-landing-page/components/GuestLanding.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'opacity-50 group-hover:opacity-80 group-hover:scale-110 transition-all duration-700 blur-[1px] group-hover:blur-none',
    'opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700'
)
content = content.replace(
    'bg-gradient-to-t from-[#000] via-[#000]/80 to-black/20',
    'bg-gradient-to-t from-[#000] via-[#000]/50 to-transparent'
)
with open('/Users/alex/Desktop/7_24bets-landing-page/components/GuestLanding.tsx', 'w') as f:
    f.write(content)

# 2. LiveWinsTicker.tsx
with open('/Users/alex/Desktop/7_24bets-landing-page/components/LiveWinsTicker.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'opacity-60 saturate-50 blur-[0.5px] group-hover:saturate-100 group-hover:blur-none group-hover:opacity-100 shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_20px_rgba(0,230,118,0.4)]',
    'opacity-90 saturate-75 group-hover:saturate-100 group-hover:opacity-100 shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_20px_rgba(0,230,118,0.4)]'
)
with open('/Users/alex/Desktop/7_24bets-landing-page/components/LiveWinsTicker.tsx', 'w') as f:
    f.write(content)

# 3. OriginalsSlider.tsx
with open('/Users/alex/Desktop/7_24bets-landing-page/components/OriginalsSlider.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'opacity-50 saturate-50 blur-[1px] group-hover:saturate-100 group-hover:blur-none group-hover:opacity-100',
    'opacity-90 saturate-75 group-hover:saturate-100 group-hover:opacity-100'
)
with open('/Users/alex/Desktop/7_24bets-landing-page/components/OriginalsSlider.tsx', 'w') as f:
    f.write(content)

