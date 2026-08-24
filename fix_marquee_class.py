import re

filename = 'components/LiveWinsMarquee.tsx'
with open(filename, 'r') as f:
    content = f.read()

content = content.replace(
    'className="flex hover:[animation-play-state:paused]" style={{ animation: \'marquee 80s linear infinite\' }}',
    'className="animate-marquee-scroll"'
)

with open(filename, 'w') as f:
    f.write(content)
print("Updated class")
