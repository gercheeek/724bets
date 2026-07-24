import re

file_path = '/Users/alex/Desktop/7_24bets-landing-page/components/GuestLanding.tsx'

with open(file_path, 'r') as f:
    content = f.read()

# Replace the classes on the img tags inside those promo cards to remove the darkness and grayscale effect
# The old class string: opacity-40 group-hover:opacity-80 mix-blend-luminosity group-hover:mix-blend-normal
# New class string: opacity-80 group-hover:opacity-100
content = content.replace('opacity-40 group-hover:opacity-80 mix-blend-luminosity group-hover:mix-blend-normal', 'opacity-80 group-hover:opacity-100')

# Also fix the initial motion.div filter so it's not so dark initially if it is stuck
content = content.replace("filter: 'grayscale(50%) brightness(0.5)'", "filter: 'brightness(0.8)'")
content = content.replace("filter: 'grayscale(0%) brightness(1)'", "filter: 'brightness(1)'")

# Let's also check if there are other similar classes
content = content.replace('mix-blend-luminosity', '')

with open(file_path, 'w') as f:
    f.write(content)
