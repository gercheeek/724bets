import re

filename = 'components/ModernChat.tsx'
with open(filename, 'r') as f:
    content = f.read()

content = content.replace("                    )})\\n                )}", "                    );\\n                })}")

with open(filename, 'w') as f:
    f.write(content)
print("Fixed syntax")
