import re

with open('components/WalletModal.tsx', 'r') as f:
    content = f.read()

# We need to replace the entire 100% HERO WELCOME BONUS block.
pattern = r'\{\/\* 100% HERO WELCOME BONUS \(ULTRA PREMIUM VIP\) \*\/\}.*?(?=\{\/\* OTHER BONUSES \*\/\})'

new_hero = """{/* 100% HERO WELCOME BONUS (3D GLASS PREMIUM) */}
                    <div className="relative w-full rounded-2xl overflow-hidden group cursor-pointer border border-white/5 shadow-[0_15px_40px_rgba(0,0,0,0.5)] transition-all duration-500 mt-2 mb-4 hover:border-[#10B981]/30 hover:shadow-[0_20px_50px_rgba(16,185,129,0.15)]"
                         style={{ 
                             background: 'linear-gradient(145deg, #1A2436 0%, #101623 100%)',
                             boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05), 0 15px 40px rgba(0,0,0,0.5)'
                         }}
                    >
                       {/* Vibrant Accent Glow (Top Left to Bottom Right) */}
                       <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-[#10B981]/10 via-transparent to-transparent pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity"></div>
                       
                       <div className="relative p-5 sm:p-7 flex items-center justify-between z-10">
                          
                          <div className="relative z-20">
                             {/* Badge */}
                             <div className="inline-block px-3 py-1 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] text-[10px] font-black tracking-widest uppercase mb-3 transition-colors group-hover:bg-[#10B981]/20">
                                YENİ ÜYELERE ÖZEL
                             </div>
                             
                             <h4 className="text-white text-[28px] sm:text-[36px] font-black italic drop-shadow-lg mb-1 leading-none tracking-tight">
                                %100 <span className="text-[#10B981]">HOŞ GELDİN</span>
                             </h4>
                             <p className="text-white/50 text-[12px] font-medium tracking-wide mt-2">İlk yatırımını anında ikiye katla, şansa başla.</p>
                          </div>
                          
                          {/* 3D Glowing Gift Box */}
                          <div className="flex-shrink-0 relative z-20 mr-2 sm:mr-4">
                             <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border border-white/10 flex items-center justify-center relative overflow-hidden group-hover:scale-105 group-hover:-rotate-6 transition-all duration-500"
                                  style={{
                                      background: 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(6,78,59,0.4) 100%)',
                                      boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.2), inset 0 -4px 10px rgba(0,0,0,0.5)'
                                  }}
                             >
                                <Gift className="w-8 h-8 sm:w-10 sm:h-10 text-[#34D399] drop-shadow-[0_0_15px_rgba(52,211,153,0.8)]" strokeWidth={1.5} />
                                {/* Diagonal Glass Sheen */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                             </div>
                             {/* Soft drop shadow glow under the box */}
                             <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-4 bg-[#10B981]/40 blur-lg rounded-full"></div>
                          </div>
                       </div>
                    </div>

                    """

match = re.search(pattern, content, flags=re.DOTALL)
if match:
    content = content.replace(match.group(0), new_hero)
    with open('components/WalletModal.tsx', 'w') as f:
        f.write(content)
    print("Replaced with Compatible 3D Glass Design!")
else:
    print("Could not find the target regex block.")
