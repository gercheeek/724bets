import re

with open('/Users/alex/Desktop/7_24bets-landing-page/components/ModernChat.tsx', 'r') as f:
    content = f.read()

# Replace main backgrounds with black
content = content.replace('bg-[#0a0e17]', 'bg-black')

# Replace secondary backgrounds (inputs, bubbles, announcement) with very dark gray
content = content.replace('bg-[#131926]', 'bg-[#0f0f0f]')
content = content.replace('bg-[#0e1320]', 'bg-[#111111]')

# Replace borders
content = content.replace('border-[#1b2335]', 'border-white/5')

with open('/Users/alex/Desktop/7_24bets-landing-page/components/ModernChat.tsx', 'w') as f:
    f.write(content)
