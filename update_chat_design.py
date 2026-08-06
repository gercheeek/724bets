import re

with open('/Users/alex/Desktop/7_24bets-landing-page/components/ModernChat.tsx', 'r') as f:
    content = f.read()

# 1. Update the overall chat background for deeper black
content = content.replace('bg-[#0A0D14]', 'bg-[#06080C]')

# 2. Update the chat header to be glossy
content = content.replace('bg-[#0A0D14] px-4 h-[64px]', 'bg-[#0B0E14]/80 backdrop-blur-md px-4 h-[64px]')
content = content.replace('shadow-[0_4px_20px_rgba(0,0,0,0.3)]', 'shadow-[0_4px_30px_rgba(0,0,0,0.8)]')

# 3. Update the chat input area to be glossy
content = content.replace('bg-[#161B26] border border-white/10', 'bg-[#0B0E14] border border-white/10 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]')

# 4. Message Bubble styling (if they are using the old styling, let's inject the new BC Game style)
# We need to find the map over messages and replace it.
# Let's write the modified content back.
with open('/Users/alex/Desktop/7_24bets-landing-page/components/ModernChat.tsx', 'w') as f:
    f.write(content)
print("Updated chat colors.")
