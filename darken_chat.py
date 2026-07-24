import re

with open('/Users/alex/Desktop/7_24bets-landing-page/components/ModernChat.tsx', 'r') as f:
    content = f.read()

# Make backgrounds darker
content = content.replace('bg-[#14171d]', 'bg-[#050505]')
content = content.replace('bg-[#161a22]', 'bg-[#111111]')
content = content.replace('bg-[#1a1e28]', 'bg-[#151515]')
content = content.replace('bg-[#1c212a]', 'bg-[#111111]')
content = content.replace('bg-[#1f2530]', 'bg-[#1a1a1a]')
content = content.replace('bg-[#222222]', 'bg-[#1f1f1f]')
content = content.replace('bg-[#1c222c]', 'bg-[#111111]')

# Change Guest Promo Banner to darker theme
content = content.replace(
    'bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700', 
    'bg-gradient-to-r from-[#000000] via-[#050505] to-[#111111]'
)
content = content.replace('bg-blue-400/30', 'bg-[#06b6d4]/20')

with open('/Users/alex/Desktop/7_24bets-landing-page/components/ModernChat.tsx', 'w') as f:
    f.write(content)
