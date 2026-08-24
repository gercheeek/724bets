import re

filename = 'hooks/useRainEvent.ts'
with open(filename, 'r') as f:
    content = f.read()

old_guest = "if (currentUserId) {"
new_guest = "if (currentUserId && currentUserId !== 'guest') {"
content = content.replace(old_guest, new_guest)

with open(filename, 'w') as f:
    f.write(content)
print("Updated guest check")
