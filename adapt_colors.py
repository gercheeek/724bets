import re

filename = 'components/ModernChat.tsx'
with open(filename, 'r') as f:
    content = f.read()

# Replace all Cybet greens with the site's Cyan #00E5FF
content = content.replace('text-[#00E701]', 'text-[#00E5FF]')
content = content.replace('fill="#00E701"', 'fill="#00E5FF"')
content = content.replace('bg-[#00E701]', 'bg-[#00E5FF]')
content = content.replace('bg-[#00E701]/10', 'bg-[#00E5FF]/10')
content = content.replace('bg-[#00E701]/30', 'bg-[#00E5FF]/30')
content = content.replace('hover:text-[#00E701]', 'hover:text-[#00E5FF]')
content = content.replace('text-emerald-500', 'text-[#00E5FF]')

# For the send button, text-white on cyan might be hard to read, let's change text-white to text-[#0A0D14] for the send button if needed.
# Actually, the original send button was: 
# className="text-[#0A0D14] bg-[#00E5FF] disabled:bg-white/5 disabled:text-white/20 hover:brightness-110 transition-all p-2 rounded-full"
# In my new code it is:
# className="shrink-0 w-[46px] h-[46px] rounded-xl bg-[#00E701] disabled:bg-[#00E701]/30 text-white flex items-center justify-center transition-colors shadow-sm"
# Let's fix that specifically:
content = content.replace(
    'className="shrink-0 w-[46px] h-[46px] rounded-xl bg-[#00E5FF] disabled:bg-[#00E5FF]/30 text-white flex items-center justify-center transition-colors shadow-sm"',
    'className="shrink-0 w-[46px] h-[46px] rounded-xl bg-[#00E5FF] hover:brightness-110 disabled:bg-white/5 disabled:text-white/20 text-[#0A0D14] flex items-center justify-center transition-all shadow-[0_0_15px_rgba(0,229,255,0.3)]"'
)

with open(filename, 'w') as f:
    f.write(content)
print("Adapted colors to main design")

with open(filename, 'r') as f:
    content = f.read()

# Replace Cybet chat bubble background with site's card background
content = content.replace('bg-[#142333]', 'bg-[#161B26]')
content = content.replace('bg-[#111e29]', 'bg-[#161B26]') # Tipping box and input area bg
content = content.replace('bg-[#0b131a]', 'bg-[#0A0C10]') # Tipping inner box bg
content = content.replace('bg-[#0B121A]', 'bg-[#0A0D14]') # Main wrapper bg and header bg

with open(filename, 'w') as f:
    f.write(content)
print("Adapted background colors")
