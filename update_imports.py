import re
import os

filename = 'components/ModernChat.tsx'
with open(filename, 'r') as f:
    content = f.read()

content = content.replace("import AdminRainControl from './AdminRainControl';", "import AdminChatControl from './AdminChatControl';")
content = content.replace("<AdminRainControl", "<AdminChatControl")

with open(filename, 'w') as f:
    f.write(content)
print("Updated ModernChat imports")
