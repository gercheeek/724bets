import re

# 1. GuestLanding.tsx
with open('/Users/alex/Desktop/7_24bets-landing-page/components/GuestLanding.tsx', 'r') as f:
    content = f.read()

# Replace the overly dark grayscale images
content = content.replace(
    'opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700 mix-blend-luminosity grayscale group-hover:grayscale-0',
    'opacity-50 group-hover:opacity-80 group-hover:scale-110 transition-all duration-700 blur-[1px] group-hover:blur-none'
)
# Reduce the heavy black gradient slightly
content = content.replace(
    'bg-gradient-to-t from-[#000] via-[#000]/60 to-transparent',
    'bg-gradient-to-t from-[#000] via-[#000]/80 to-black/20'
)

with open('/Users/alex/Desktop/7_24bets-landing-page/components/GuestLanding.tsx', 'w') as f:
    f.write(content)


# 2. LiveWinsTicker.tsx
with open('/Users/alex/Desktop/7_24bets-landing-page/components/LiveWinsTicker.tsx', 'r') as f:
    content = f.read()

# Remove the grayscale on luxury mode and add a subtle glowing border/shadow instead
content = content.replace(
    'grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100',
    'opacity-60 saturate-50 blur-[0.5px] group-hover:saturate-100 group-hover:blur-none group-hover:opacity-100 shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_20px_rgba(0,230,118,0.4)]'
)

with open('/Users/alex/Desktop/7_24bets-landing-page/components/LiveWinsTicker.tsx', 'w') as f:
    f.write(content)


# 3. OriginalsSlider.tsx
with open('/Users/alex/Desktop/7_24bets-landing-page/components/OriginalsSlider.tsx', 'r') as f:
    content = f.read()

# Remove the grayscale on luxury mode
content = content.replace(
    'grayscale opacity-50 mix-blend-luminosity group-hover:grayscale-0 group-hover:opacity-100 group-hover:mix-blend-normal',
    'opacity-50 saturate-50 blur-[1px] group-hover:saturate-100 group-hover:blur-none group-hover:opacity-100'
)

with open('/Users/alex/Desktop/7_24bets-landing-page/components/OriginalsSlider.tsx', 'w') as f:
    f.write(content)

