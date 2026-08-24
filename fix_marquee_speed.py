import re

filename = 'components/LiveWinsMarquee.tsx'
with open(filename, 'r') as f:
    content = f.read()

content = content.replace(
    "animation: 'marquee 80s linear infinite'",
    "animation: 'marquee 250s linear infinite'"
)

with open(filename, 'w') as f:
    f.write(content)
print("Updated speed")
