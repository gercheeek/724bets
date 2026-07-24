import re

with open('/Users/alex/Desktop/7_24bets-landing-page/components/OriginalsHub.tsx', 'r') as f:
    content = f.read()

# Replace hardcoded minHeight with tailwind responsive classes
content = content.replace(
    'style={{ minHeight: \'650px\' }}>', 
    'className="w-full rounded-none overflow-hidden border-4 border-[#00ffff] shadow-[0_0_50px_rgba(0,255,255,0.3),_inset_0_0_20px_rgba(255,0,255,0.2)] relative flex flex-col bg-[#000000] atari-game-mode min-h-[450px] md:min-h-[650px] max-h-[80vh] md:max-h-none overflow-y-auto">'
)
# Note: since I am replacing the end of the div tag, I should be careful. 
# It's better to just replace the whole tag.
content = content.replace(
    '<div className="w-full rounded-none overflow-hidden border-4 border-[#00ffff] shadow-[0_0_50px_rgba(0,255,255,0.3),_inset_0_0_20px_rgba(255,0,255,0.2)] relative flex flex-col bg-[#000000] atari-game-mode" style={{ minHeight: \'650px\' }}>',
    '<div className="w-full rounded-none overflow-hidden border-4 border-[#00ffff] shadow-[0_0_50px_rgba(0,255,255,0.3),_inset_0_0_20px_rgba(255,0,255,0.2)] relative flex flex-col bg-[#000000] atari-game-mode min-h-[400px] md:min-h-[650px] max-h-[75vh] md:max-h-none overflow-y-auto">'
)

with open('/Users/alex/Desktop/7_24bets-landing-page/components/OriginalsHub.tsx', 'w') as f:
    f.write(content)
