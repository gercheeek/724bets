import re

with open('components/WalletModal.tsx', 'r') as f:
    content = f.read()

# We need to replace the 100% HERO WELCOME BONUS block.
# Let's target the exact block I added previously.
pattern = r'\{\/\* 100% HERO WELCOME BONUS \*\/\}.*?(?=\{\/\* OTHER BONUSES \*\/\})'

new_hero = """{/* 100% HERO WELCOME BONUS (ULTRA PREMIUM VIP) */}
                    <div className="relative w-full rounded-[20px] p-[1px] group cursor-pointer shadow-[0_15px_40px_rgba(16,185,129,0.25)] hover:shadow-[0_20px_60px_rgba(16,185,129,0.4)] transition-all duration-700 mt-2 mb-4">
                       
                       {/* Animated Glowing Border using arbitrary tailwind */}
                       <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,transparent_270deg,#10B981_360deg)] animate-[spin_3s_linear_infinite] opacity-50 group-hover:opacity-100 transition-opacity rounded-[20px]"></div>
                       <div className="absolute inset-0 bg-[conic-gradient(from_180deg_at_50%_50%,transparent_0deg,transparent_270deg,#3B82F6_360deg)] animate-[spin_3s_linear_infinite] opacity-50 group-hover:opacity-100 transition-opacity rounded-[20px]"></div>
                       
                       <div className="relative w-full h-full bg-gradient-to-br from-[#0B1320] to-[#060A11] rounded-[19px] overflow-hidden p-5 sm:p-7 flex items-center justify-between z-10 border border-white/5">
                          
                          {/* Inner Cyberpunk Grid & Glow */}
                          <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"></div>
                          <div className="absolute -left-20 -top-20 w-64 h-64 bg-[#10B981]/20 rounded-full blur-[80px] pointer-events-none"></div>

                          <div className="relative z-20">
                             {/* Floating Premium Badge */}
                             <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#10B981]/20 to-transparent border border-[#10B981]/30 mb-3 backdrop-blur-sm">
                                <Zap className="w-3 h-3 text-[#34D399] fill-[#34D399]" />
                                <span className="text-[#34D399] text-[10px] font-black tracking-[0.2em] uppercase">724Bets Özel</span>
                             </div>
                             
                             <h4 className="text-white text-[28px] sm:text-[36px] font-black italic drop-shadow-2xl mb-1 leading-none">
                                %100 <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#34D399] via-[#10B981] to-[#047857]">HOŞ GELDİN</span>
                             </h4>
                             <p className="text-white/50 text-[12px] font-medium tracking-wide mt-2">İlk yatırımını anında ikiye katla, efsane başla.</p>
                          </div>
                          
                          {/* Floating 3D Gift Orb */}
                          <div className="flex-shrink-0 relative z-20 mr-2 sm:mr-4">
                             <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-white/10 bg-gradient-to-br from-[#10B981]/10 to-transparent flex items-center justify-center relative overflow-hidden backdrop-blur-xl group-hover:scale-110 group-hover:-rotate-12 transition-all duration-700 shadow-[inset_0_0_20px_rgba(16,185,129,0.3)]">
                                <Gift className="w-8 h-8 sm:w-10 sm:h-10 text-[#34D399] drop-shadow-[0_0_15px_rgba(52,211,153,0.8)]" strokeWidth={1.5} />
                                {/* Glass Reflection */}
                                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-full"></div>
                             </div>
                             {/* Glow under the orb */}
                             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#10B981]/30 rounded-full blur-xl animate-pulse"></div>
                          </div>
                       </div>
                    </div>

                    """

match = re.search(pattern, content, flags=re.DOTALL)
if match:
    content = content.replace(match.group(0), new_hero)
    with open('components/WalletModal.tsx', 'w') as f:
        f.write(content)
    print("Replaced successfully with Expert Design!")
else:
    print("Could not find the target regex block.")
