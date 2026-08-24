import re

filename = 'components/ModernChat.tsx'
with open(filename, 'r') as f:
    content = f.read()

# 1. Update general background
content = content.replace("bg-[#0B0E14]/90", "bg-[#0f1923]")

# 2. Update Header
# Find <div className="p-3 border-b border-white/5 bg-[#0A0D14]/80
header_pattern = r'<div className="p-3 border-b border-white/5 bg-\[#0A0D14\]/80 backdrop-blur-md flex items-center justify-between shadow-sm relative z-20 shrink-0">.*?</div>'
# wait, it spans multiple lines. Let's just find and replace the header explicitly.
# Instead of regex, let's use a simpler approach. I'll provide a patch file or Python script that uses `str.replace` with exact matches.
