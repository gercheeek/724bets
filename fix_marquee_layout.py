import re

filename = 'components/LiveWinsMarquee.tsx'
with open(filename, 'r') as f:
    content = f.read()

content = content.replace(
    'className="animate-marquee-scroll"',
    'className="flex flex-row w-max hover:[animation-play-state:paused]" style={{ animation: \'marquee 80s linear infinite\' }}'
)

with open(filename, 'w') as f:
    f.write(content)
print("Updated to inline Tailwind flex w-max")
