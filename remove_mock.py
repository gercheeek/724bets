import os

file_path = 'components/Spor724View.tsx'
with open(file_path, 'r') as f:
    content = f.read()

# We need to find the INJECT MOCK LIVE MATCHES block and remove it.
import re

pattern = r"if \(viewMode === 'live'\) \{\s*if \(result\.length === 0\) \{\s*// INJECT MOCK LIVE MATCHES FOR DEMO PURPOSES\s*return \[[^\]]*\] as any\[\];\s*\}"

new_content = re.sub(pattern, "if (viewMode === 'live') {", content)

if new_content != content:
    with open(file_path, 'w') as f:
        f.write(new_content)
    print("Removed mock matches from Spor724View.tsx")
else:
    print("Mock matches block not found or already removed.")

