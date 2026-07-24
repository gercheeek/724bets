import re

with open('/Users/alex/Desktop/7_24bets-landing-page/components/VIPHeroBanner.tsx', 'r') as f:
    content = f.read()

# Remove the thick purple border and shadow from the main container
content = content.replace('border-4 border-[#ff00ff]', 'border-2 border-white/10')
content = content.replace('shadow-[8px_8px_0_rgba(255,0,255,0.4)]', 'shadow-lg')

# Remove the purple border from the Right side
content = content.replace('border-2 border-[#ff00ff]', 'border-2 border-white/10')
content = content.replace('shadow-[inset_0_0_20px_rgba(255,0,255,0.2)]', '')

# Remove purple underline from Right side title
content = content.replace('border-[#ff00ff]/50', 'border-white/20')

# Change "HEMEN KATIL" button from purple to cyan
content = content.replace('border-2 border-[#ff00ff] text-[#ff00ff]', 'border-2 border-[#00ffff] text-[#00ffff]')
content = content.replace('hover:bg-[#ff00ff] hover:text-black', 'hover:bg-[#00ffff] hover:text-black')
content = content.replace('shadow-[4px_4px_0_rgba(255,0,255,0.4)]', 'shadow-[4px_4px_0_rgba(0,255,255,0.4)]')
content = content.replace('hover:shadow-[0_0_0_rgba(255,0,255,0)]', 'hover:shadow-[0_0_0_rgba(0,255,255,0)]')

# Change the `>` symbols from purple to cyan
content = content.replace('<span className="text-[#ff00ff]">{\'>\'}</span>', '<span className="text-[#00ffff]">{\'>\'}</span>')

with open('/Users/alex/Desktop/7_24bets-landing-page/components/VIPHeroBanner.tsx', 'w') as f:
    f.write(content)
