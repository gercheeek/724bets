import re

with open('/Users/alex/Desktop/7_24bets-landing-page/components/GuestLanding.tsx', 'r') as f:
    content = f.read()

# 1. Replace the old style block
old_style_start = "<style>{`"
old_style_end = "`}</style>"

# Find the block
start_idx = content.find(old_style_start)
end_idx = content.find(old_style_end, start_idx)

if start_idx != -1 and end_idx != -1:
    new_style = """<style>{`
                /* Premium CRT & Noise Effects */
                .clip-tech {
                    clip-path: polygon(0 0, 100% 0, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0 100%);
                }
                .clip-tech-inner {
                    clip-path: polygon(0 0, 100% 0, 100% calc(100% - 29px), calc(100% - 29px) 100%, 0 100%);
                }
                
                @keyframes premium-flicker {
                    0%, 100% { opacity: 1; }
                    3% { opacity: 0.95; }
                    6% { opacity: 0.8; }
                    7% { opacity: 1; }
                    8% { opacity: 0.6; }
                    9% { opacity: 1; }
                    11% { opacity: 0.95; }
                    12% { opacity: 1; }
                    89% { opacity: 1; }
                    90% { opacity: 0.9; }
                    91% { opacity: 1; }
                }

                @keyframes rgb-split {
                    0%, 100% { text-shadow: 0 0 10px rgba(255,255,255,0.2); transform: none; }
                    2% { text-shadow: 3px 0 0 rgba(255,0,0,0.8), -3px 0 0 rgba(0,255,255,0.8); transform: skewX(0.5deg) translateX(-1px); }
                    3% { text-shadow: -2px 0 0 rgba(255,0,0,0.8), 2px 0 0 rgba(0,255,255,0.8); transform: skewX(-0.5deg) translateX(1px); }
                    4% { text-shadow: 0 0 10px rgba(255,255,255,0.2); transform: none; }
                }

                .crt-premium-container {
                    animation: premium-flicker 8s infinite;
                }
                
                .text-glitch-premium {
                    animation: rgb-split 6s infinite;
                    position: relative;
                }
                
                .noise-overlay {
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
                    pointer-events: none;
                }
            `}</style>"""
    content = content[:start_idx] + new_style + content[end_idx + len(old_style_end):]

# 2. Replace the Hero Banner Container
old_hero_start = "{/* HERO BANNER - ULTRA LUXURY (CRT TV EFFECT) */}"
old_hero_end = "                    {/* TV Vignette (Dark Edges) */}"

h_start = content.find(old_hero_start)
h_end = content.find("</div>", content.find(old_hero_end))

if h_start != -1 and h_end != -1:
    new_hero = """{/* HERO BANNER - ULTRA LUXURY (PREMIUM CRT EFFECT) */}
            <div className="w-full relative rounded-2xl overflow-hidden bg-[#020202] min-h-[200px] md:min-h-[280px] lg:min-h-[320px] shadow-[0_20px_60px_rgba(0,0,0,0.9)] border border-white/5 group flex flex-col items-center justify-center p-8 text-center crt-premium-container">
                
                {/* TV Background Layers */}
                <div className="absolute inset-0 pointer-events-none z-0">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#06b6d4]/15 to-[#10b981]/15 blur-[100px] rounded-full mix-blend-screen"></div>
                    
                    {/* SVG Noise Overlay (Ultra Realistic Grain) */}
                    <div className="noise-overlay absolute inset-0 opacity-[0.12] mix-blend-overlay"></div>
                    
                    {/* Micro Scanlines Overlay */}
                    <div className="absolute inset-0 opacity-30 mix-blend-overlay" style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 2px, rgba(0,0,0,1) 2px, rgba(0,0,0,1) 3px)' }}></div>
                    
                    {/* Slow scrolling CRT bar */}
                    <div className="absolute inset-0 h-[30%] bg-gradient-to-b from-transparent via-white/[0.03] to-transparent opacity-60 mix-blend-overlay animate-[scanline-scroll_12s_linear_infinite]"></div>
                    
                    {/* Deep CRT Vignette */}
                    <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,1)]"></div>
                </div>"""
    content = content[:h_start] + new_hero + content[h_end + 6:]

# 3. Replace the Text class
old_text = "drop-shadow-lg glitch-text"
new_text = "drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] text-glitch-premium"
content = content.replace(old_text, new_text)

# Also fix the subtitle if we can
old_subtitle = "className=\"text-xs md:text-base font-medium max-w-[600px]\""
new_subtitle = "className=\"text-xs md:text-base font-medium max-w-[600px] text-gray-400 drop-shadow-md text-glitch-premium\" style={{animationDelay: '0.5s'}}"
content = content.replace(old_subtitle, new_subtitle)


with open('/Users/alex/Desktop/7_24bets-landing-page/components/GuestLanding.tsx', 'w') as f:
    f.write(content)
