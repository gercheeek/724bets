import re

filename = 'components/AdminPanel.tsx'
with open(filename, 'r') as f:
    content = f.read()

# Change main container background
content = content.replace("bg-[#0B0E14]", "bg-gradient-to-b from-[#1A2436] to-[#101623]")
content = content.replace("bg-[#13161f]", "bg-[#1A2436]/50 backdrop-blur-xl border-r border-white/5")

# Change accent color for active items to emerald green
content = content.replace("bg-[color:var(--theme-accent)]", "bg-[#10B981]")
content = content.replace("text-[color:var(--theme-accent)]", "text-[#10B981]")
content = content.replace("border-[color:var(--theme-accent)]", "border-[#10B981]")

# Make headers darker glass
content = content.replace("bg-[#13161f] border-b border-white/5", "bg-[#1A2436]/80 backdrop-blur-md border-b border-white/5 shadow-[inset_0_-1px_0_rgba(255,255,255,0.05)]")

# Buttons
content = content.replace("bg-gradient-to-r from-[color:var(--theme-accent)] to-[#00b3e6]", "bg-gradient-to-r from-[#10B981] to-[#059669]")

with open(filename, 'w') as f:
    f.write(content)
print(f"Updated styles in {filename}")
