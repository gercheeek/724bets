import re

with open('/Users/alex/Desktop/7_24bets-landing-page/components/GuestLanding.tsx', 'r') as f:
    content = f.read()

# 1. Casino
content = content.replace(
"""<h3 className="text-4xl md:text-5xl font-black font-['Outfit'] uppercase tracking-tighter mb-2 animate-glitch origin-left text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-100 to-gray-400 group-hover:from-white group-hover:via-white group-hover:to-[#06b6d4] transition-all duration-[800ms] drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)] group-hover:drop-shadow-[0_0_25px_rgba(6,182,212,1)]">
                                Casino
                            </h3>""",
"""<h3 className="text-4xl md:text-5xl font-extrabold font-['Outfit'] uppercase tracking-[0.15em] mb-2 text-transparent bg-clip-text bg-[linear-gradient(to_bottom,#ffffff_0%,#e5e7eb_40%,#9ca3af_50%,#e5e7eb_60%,#ffffff_100%)] group-hover:bg-[linear-gradient(to_bottom,#ffffff_0%,#67e8f9_40%,#06b6d4_50%,#67e8f9_60%,#ffffff_100%)] transition-all duration-[800ms] drop-shadow-[0_4px_4px_rgba(0,0,0,1)] group-hover:drop-shadow-[0_0_30px_rgba(6,182,212,0.8)]">
                                CASINO
                            </h3>"""
)

# 2. Spor
content = content.replace(
"""<h3 className="text-4xl md:text-5xl font-black font-['Outfit'] uppercase tracking-tighter mb-2 animate-glitch origin-left text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-100 to-gray-400 group-hover:from-white group-hover:via-white group-hover:to-[#10b981] transition-all duration-[800ms] drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)] group-hover:drop-shadow-[0_0_25px_rgba(16,185,129,1)]">
                                Spor
                            </h3>""",
"""<h3 className="text-4xl md:text-5xl font-extrabold font-['Outfit'] uppercase tracking-[0.15em] mb-2 text-transparent bg-clip-text bg-[linear-gradient(to_bottom,#ffffff_0%,#e5e7eb_40%,#9ca3af_50%,#e5e7eb_60%,#ffffff_100%)] group-hover:bg-[linear-gradient(to_bottom,#ffffff_0%,#34d399_40%,#10b981_50%,#34d399_60%,#ffffff_100%)] transition-all duration-[800ms] drop-shadow-[0_4px_4px_rgba(0,0,0,1)] group-hover:drop-shadow-[0_0_30px_rgba(16,185,129,0.8)]">
                                SPOR
                            </h3>"""
)

# 3. 724 Orijinal
content = content.replace(
"""<h3 className="text-4xl md:text-5xl font-black font-['Outfit'] uppercase tracking-tighter mb-2 animate-glitch origin-left text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-100 to-gray-400 group-hover:from-white group-hover:via-white group-hover:to-yellow-500 transition-all duration-[800ms] drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)] group-hover:drop-shadow-[0_0_25px_rgba(234,179,8,1)]">
                                724 Orijinal
                            </h3>""",
"""<h3 className="text-4xl md:text-5xl font-extrabold font-['Outfit'] uppercase tracking-[0.15em] mb-2 text-transparent bg-clip-text bg-[linear-gradient(to_bottom,#ffffff_0%,#e5e7eb_40%,#9ca3af_50%,#e5e7eb_60%,#ffffff_100%)] group-hover:bg-[linear-gradient(to_bottom,#ffffff_0%,#fde047_40%,#eab308_50%,#fde047_60%,#ffffff_100%)] transition-all duration-[800ms] drop-shadow-[0_4px_4px_rgba(0,0,0,1)] group-hover:drop-shadow-[0_0_30px_rgba(234,179,8,0.8)]">
                                724 ORİJİNAL
                            </h3>"""
)

with open('/Users/alex/Desktop/7_24bets-landing-page/components/GuestLanding.tsx', 'w') as f:
    f.write(content)
