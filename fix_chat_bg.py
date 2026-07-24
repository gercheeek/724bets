import re

def fix_chat_bg():
    with open('/Users/alex/Desktop/7_24bets-landing-page/components/ModernChat.tsx', 'r') as f:
        content = f.read()

    # Change all generic #111111 backgrounds to Gamdom #161a22 or #1a1d24
    content = content.replace('bg-[#111111]', 'bg-[#161a22]')
    
    # And replace hover states
    content = content.replace('hover:bg-[#222222]', 'hover:bg-[#1f2530]')
    content = content.replace('hover:bg-[#1a1a1a]', 'hover:bg-[#1c212a]')

    with open('/Users/alex/Desktop/7_24bets-landing-page/components/ModernChat.tsx', 'w') as f:
        f.write(content)

fix_chat_bg()
print("Chat backgrounds fixed")
