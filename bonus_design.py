import re

with open('components/WalletModal.tsx', 'r') as f:
    content = f.read()

old_bonus_html = """            ) : activeTab === 'bonus' ? (
              <div className="h-full flex flex-col items-center justify-center animate-in fade-in">
                 <Gift className="w-20 h-20 text-[#F59E0B] mb-6 opacity-80 filter drop-shadow-[0_0_30px_rgba(245,158,11,0.5)]" />
                 <h3 className="text-white text-[22px] font-black mb-3 text-center">Yatırım Bonusu Satın Al</h3>
                 <p className="text-white/60 text-center text-[13px] max-w-sm mb-8">Bir sonraki para yatırma işleminizde ekstra değerin kilidini açın!</p>
                 <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                    {['%30', '%50', '%70', '%100'].map(b => (
                       <div key={b} className="bg-[#131927] border border-white/5 p-4 rounded-2xl flex flex-col items-center hover:border-[#10B981] transition-colors cursor-pointer group">
                          <span className="text-[#10B981] text-[24px] font-black group-hover:scale-110 transition-transform">{b}</span>
                          <span className="text-white/40 text-[10px] mt-1 font-bold">Bonusu Etkinleştir</span>
                       </div>
                    ))}
                 </div>
              </div>"""

new_bonus_html = """            ) : activeTab === 'bonus' ? (
              <div className="h-full flex flex-col items-center animate-in fade-in pt-4 pb-10">
                 <Gift className="w-16 h-16 text-[#F59E0B] mb-4 opacity-90 filter drop-shadow-[0_0_30px_rgba(245,158,11,0.6)]" />
                 <h3 className="text-white text-[22px] font-black mb-2 text-center">Yatırım Bonusları</h3>
                 <p className="text-white/60 text-center text-[13px] max-w-sm mb-6">Bir sonraki para yatırma işleminizde ekstra değerin kilidini açın!</p>
                 
                 <div className="w-full flex flex-col gap-4 max-w-lg mx-auto">
                    {/* 100% HERO WELCOME BONUS */}
                    <div className="relative w-full rounded-2xl overflow-hidden group cursor-pointer border border-[#10B981]/50 shadow-[0_10px_40px_rgba(16,185,129,0.2)] hover:shadow-[0_15px_50px_rgba(16,185,129,0.4)] transition-all duration-500">
                       <div className="absolute inset-0 bg-gradient-to-br from-[#10B981]/20 via-[#064E3B] to-[#022C22]"></div>
                       <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] animate-pulse"></div>
                       
                       <div className="relative z-10 p-5 sm:p-6 flex items-center justify-between">
                          <div>
                             <div className="inline-block px-2.5 py-1 rounded-full bg-[#10B981]/20 border border-[#10B981]/30 text-[#34D399] text-[9px] font-black tracking-widest uppercase mb-2 shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                                Yeni Üyelere Özel
                             </div>
                             <h4 className="text-white text-[24px] sm:text-[28px] font-black italic drop-shadow-md mb-1">
                                %100 <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#34D399] to-[#10B981]">HOŞ GELDİN</span>
                             </h4>
                             <p className="text-white/60 text-[11px] font-medium">İlk yatırımınızı anında ikiye katlayın.</p>
                          </div>
                          
                          <div className="flex-shrink-0 relative">
                             <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-[#10B981] bg-[#064E3B] flex items-center justify-center relative overflow-hidden group-hover:scale-110 transition-transform duration-500 z-10">
                                <Gift className="w-7 h-7 sm:w-8 sm:h-8 text-[#34D399]" />
                                <div className="absolute inset-0 bg-[#10B981]/20 blur-xl"></div>
                             </div>
                             {/* Ping effect behind the circle */}
                             <div className="absolute inset-0 rounded-full border-2 border-[#10B981]/50 animate-ping z-0"></div>
                          </div>
                       </div>
                    </div>

                    {/* OTHER BONUSES */}
                    <div className="grid grid-cols-3 gap-3 mt-2">
                        {['%30', '%50', '%70'].map(b => (
                           <div key={b} className="bg-[#131A26] border border-white/5 p-4 rounded-xl flex flex-col items-center justify-center hover:border-white/20 transition-all cursor-pointer group hover:bg-[#182030]">
                              <span className="text-[#34D399] text-[20px] font-black group-hover:scale-110 transition-transform drop-shadow-[0_0_10px_rgba(52,211,153,0.2)] mb-1">{b}</span>
                              <span className="text-white/40 text-[9px] font-bold uppercase tracking-widest text-center">Etkinleştir</span>
                           </div>
                        ))}
                    </div>
                 </div>
              </div>"""

if old_bonus_html in content:
    content = content.replace(old_bonus_html, new_bonus_html)
    with open('components/WalletModal.tsx', 'w') as f:
        f.write(content)
    print("Replaced Bonus UI perfectly!")
else:
    print("Old bonus html string not found! Let's try with regex just in case spacing changed.")
    # Fallback to regex
    pattern = r"\) : activeTab === 'bonus' \? \(\s*<div className=\"h-full flex flex-col items-center justify-center animate-in fade-in\">.*?<\/div>\s*\)\s*:\s*\(\s*<div className=\"flex flex-col h-full animate-in fade-in\">"
    match = re.search(pattern, content, flags=re.DOTALL)
    if match:
       print("Found with regex!")
    else:
       print("Not found with regex either. We need to check exact content.")
