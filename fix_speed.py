import re

filename = 'components/LiveWinsMarquee.tsx'
with open(filename, 'r') as f:
    content = f.read()

content = content.replace("duration: 120", "duration: 400")

with open(filename, 'w') as f:
    f.write(content)
print("Updated duration")
