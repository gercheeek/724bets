import re

with open('/Users/alex/Desktop/7_24bets-landing-page/components/GuestLanding.tsx', 'r') as f:
    content = f.read()

# 1. Add keyframes to the <style> block
keyframes = """
                @keyframes crt-flicker {
                    0% { opacity: 0.9; }
                    5% { opacity: 0.8; }
                    10% { opacity: 0.9; }
                    15% { opacity: 1; }
                    50% { opacity: 1; }
                    52% { opacity: 0.8; }
                    54% { opacity: 1; transform: scale(1); }
                    55% { transform: scale(1.002) translateY(1px); }
                    56% { transform: scale(1) translateY(0); }
                    95% { opacity: 1; }
                    96% { opacity: 0.8; }
                    97% { opacity: 1; }
                    100% { opacity: 1; }
                }
                @keyframes scanline-scroll {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(100%); }
                }
                @keyframes text-glitch-anim {
                    0% { text-shadow: none; transform: none; }
                    2% { text-shadow: 2px 0 red, -2px 0 cyan; transform: skewX(1deg); }
                    4% { text-shadow: none; transform: none; }
                    45% { text-shadow: none; transform: none; }
                    46% { text-shadow: -1px 0 red, 1px 0 cyan; transform: skewX(-1deg); }
                    48% { text-shadow: none; transform: none; }
                    100% { text-shadow: none; transform: none; }
                }
                .crt-screen {
                    animation: crt-flicker 6s infinite;
                    box-shadow: inset 0 0 100px rgba(0,0,0,0.9);
                }
                .glitch-text {
                    animation: text-glitch-anim 5s infinite;
                }
"""

style_tag = "<style>{`"
if style_tag in content:
    content = content.replace(style_tag, style_tag + keyframes)

# 2. Modify the Hero Banner Container
old_hero = """            {/* HERO BANNER - ULTRA LUXURY */}
            <div className="w-full relative rounded-2xl overflow-hidden bg-[#030303] min-h-[200px] md:min-h-[280px] lg:min-h-[320px] shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-white/5 group flex flex-col items-center justify-center p-8 text-center">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#06b6d4]/10 to-[#10b981]/10 blur-[120px] rounded-full z-0"></div>
                    <div className="absolute inset-0 bg-[#000] opacity-60 z-0"></div>
                </div>"""

new_hero = """            {/* HERO BANNER - ULTRA LUXURY (CRT TV EFFECT) */}
            <div className="w-full relative rounded-2xl overflow-hidden bg-[#030303] min-h-[200px] md:min-h-[280px] lg:min-h-[320px] shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-white/5 group flex flex-col items-center justify-center p-8 text-center crt-screen">
                
                {/* TV Background Layers */}
                <div className="absolute inset-0 pointer-events-none z-0">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#06b6d4]/10 to-[#10b981]/10 blur-[120px] rounded-full"></div>
                    <div className="absolute inset-0 bg-[#000] opacity-60"></div>
                    
                    {/* Scanlines Overlay */}
                    <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 2px, rgba(0,0,0,0.8) 2px, rgba(0,0,0,0.8) 4px)' }}></div>
                    
                    {/* Scrolling thick scanline */}
                    <div className="absolute inset-0 h-[20%] bg-gradient-to-b from-transparent via-white/5 to-transparent opacity-30 mix-blend-overlay animate-[scanline-scroll_8s_linear_infinite]"></div>
                    
                    {/* TV Vignette (Dark Edges) */}
                    <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,1)]"></div>
                </div>"""

content = content.replace(old_hero, new_hero)

# 3. Modify the Text to have glitch class
old_text = """<h1 className="text-[24px] sm:text-[32px] lg:text-[44px] font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 leading-tight tracking-tight font-['Outfit'] drop-shadow-lg">"""
new_text = """<h1 className="text-[24px] sm:text-[32px] lg:text-[44px] font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 leading-tight tracking-tight font-['Outfit'] drop-shadow-lg glitch-text">"""

content = content.replace(old_text, new_text)

with open('/Users/alex/Desktop/7_24bets-landing-page/components/GuestLanding.tsx', 'w') as f:
    f.write(content)
