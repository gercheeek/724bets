import re

filename = 'components/ModernChat.tsx'
with open(filename, 'r') as f:
    content = f.read()

# Fix the over-replaced imports
content = content.replace("import { AlertCircle, useTranslation }", "import { useTranslation }")
content = content.replace("import { AlertCircle, SiteUser }", "import { SiteUser }")
content = content.replace("import { AlertCircle, BetShareModal }", "import { BetShareModal }")
content = content.replace("import { AlertCircle, getGlobalConfig", "import { getGlobalConfig")
content = content.replace("import { AlertCircle, triggerGlobalToast", "import { triggerGlobalToast")

# Any other rogue AlertCircles?
# "import { AlertCircle, ..." where it shouldn't be.
lines = content.split('\n')
new_lines = []
for line in lines:
    if line.startswith('import { AlertCircle, ') and 'lucide-react' not in line:
        line = line.replace('import { AlertCircle, ', 'import { ')
    new_lines.append(line)

content = '\n'.join(new_lines)

with open(filename, 'w') as f:
    f.write(content)
print("Cleaned up rogue AlertCircle imports")
