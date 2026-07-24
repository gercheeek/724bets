import re

with open('/Users/alex/Desktop/7_24bets-landing-page/components/GuestLanding.tsx', 'r') as f:
    content = f.read()

# 1. Casino
content = content.replace(
"""<h3 className="text-4xl md:text-5xl font-black text-white font-['Outfit'] uppercase tracking-tighter mb-2 group-hover:text-[#06b6d4] transition-colors duration-500 drop-shadow-[0_0_10px_rgba(6,182,212,0)] group-hover:drop-shadow-[0_0_15px_rgba(6,182,212,0.8)] animate-glitch origin-left">
                                Canlı Masa
                            </h3>""",
"""<h3 className="text-4xl md:text-5xl font-black font-['Outfit'] uppercase tracking-tighter mb-2 animate-glitch origin-left text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-100 to-gray-400 group-hover:from-white group-hover:via-white group-hover:to-[#06b6d4] transition-all duration-[800ms] drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)] group-hover:drop-shadow-[0_0_25px_rgba(6,182,212,1)]">
                                Casino
                            </h3>"""
)

# 2. Spor
content = content.replace(
"""<h3 className="text-4xl md:text-5xl font-black text-white font-['Outfit'] uppercase tracking-tighter mb-2 group-hover:text-[#10b981] transition-colors duration-500 drop-shadow-[0_0_10px_rgba(16,185,129,0)] group-hover:drop-shadow-[0_0_15px_rgba(16,185,129,0.8)] animate-glitch origin-left">
                                Canlı Spor
                            </h3>""",
"""<h3 className="text-4xl md:text-5xl font-black font-['Outfit'] uppercase tracking-tighter mb-2 animate-glitch origin-left text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-100 to-gray-400 group-hover:from-white group-hover:via-white group-hover:to-[#10b981] transition-all duration-[800ms] drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)] group-hover:drop-shadow-[0_0_25px_rgba(16,185,129,1)]">
                                Spor
                            </h3>"""
)

# 3. 724 Orijinal
content = content.replace(
"""<h3 className="text-4xl md:text-5xl font-black text-white font-['Outfit'] uppercase tracking-tighter mb-2 group-hover:text-yellow-500 transition-colors duration-500 drop-shadow-[0_0_10px_rgba(234,179,8,0)] group-hover:drop-shadow-[0_0_15px_rgba(234,179,8,0.8)] animate-glitch origin-left">
                                Özel Üretim
                            </h3>""",
"""<h3 className="text-4xl md:text-5xl font-black font-['Outfit'] uppercase tracking-tighter mb-2 animate-glitch origin-left text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-100 to-gray-400 group-hover:from-white group-hover:via-white group-hover:to-yellow-500 transition-all duration-[800ms] drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)] group-hover:drop-shadow-[0_0_25px_rgba(234,179,8,1)]">
                                724 Orijinal
                            </h3>"""
)

with open('/Users/alex/Desktop/7_24bets-landing-page/components/GuestLanding.tsx', 'w') as f:
    f.write(content)
