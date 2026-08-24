import re

filename = 'components/sports/PlayerLogo.tsx'
with open(filename, 'r') as f:
    content = f.read()

# Replace /api/logo with http://localhost:3001/api/logo
content = content.replace("`/api/logo/${normClean}", "`http://localhost:3001/api/logo/${normClean}")

with open(filename, 'w') as f:
    f.write(content)
print(f"Updated {filename}")
