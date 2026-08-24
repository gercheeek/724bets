import re

filename = 'components/AdminSportsTab.tsx'
with open(filename, 'r') as f:
    content = f.read()

# Fix socket connection
content = content.replace("io('', { transports: ['websocket'] });", "io('http://localhost:3001', { transports: ['websocket'] });")

# Change backgrounds to Emerald/Glassmorphism theme
content = content.replace("bg-[#0B0E14]", "bg-transparent")
content = content.replace("bg-[#13161f]", "bg-[#1A2436]/40 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]")
content = content.replace("bg-[#1A1D26]", "bg-[#131b2b]/60")

# Update colors
content = content.replace("border-[#00E5FF]/30", "border-[#10B981]/30")
content = content.replace("text-[#00E5FF]", "text-[#10B981]")
content = content.replace("bg-[#00E5FF]/10", "bg-[#10B981]/10")
content = content.replace("bg-gradient-to-r from-[#00E5FF] to-[#0099CC]", "bg-gradient-to-r from-[#10B981] to-[#059669]")

with open(filename, 'w') as f:
    f.write(content)
print(f"Updated Sports Tab in {filename}")
