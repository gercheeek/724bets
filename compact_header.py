import re

with open('components/WalletModal.tsx', 'r') as f:
    content = f.read()

# Replace HEADER and TABS sections
old_header_pattern = r'\{\/\* HEADER \*\/\}.*?\{\/\* TABS \*\/\}\s*<div className="flex bg-\[\#161B29\].*?<\/div>'

new_header = """{/* HEADER & TABS INTEGRATION */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-6 pt-4 pb-3 sm:py-3 border-b border-white/5 shrink-0 bg-[#0F1423] relative z-20 gap-3 sm:gap-0">
          
          {/* MOBILE TOP ROW / DESKTOP LEFT */}
          <div className="flex items-center justify-between sm:w-[220px] shrink-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-white text-[18px] sm:text-[20px] font-black tracking-tight">724<span className="text-[#3B82F6]">Bets</span></span>
              <div className="w-px h-4 bg-white/10 mx-1 sm:mx-1"></div>
              <span className="text-white/50 text-[10px] sm:text-[12px] font-bold tracking-widest uppercase">FİNANS</span>
            </div>
            
            {/* Mobile Close Button (Hidden on Desktop) */}
            <button onClick={onClose} className="sm:hidden w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {/* TABS (Centered on Desktop, Full width on Mobile) */}
          <div className="flex bg-[#161B29] p-1 rounded-xl border border-white/5 shadow-inner sm:w-[320px] shrink-0">
            {['deposit', 'withdraw', 'history'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-1.5 sm:py-2 rounded-lg text-[11px] sm:text-[12px] font-bold tracking-wide transition-all ${
                  activeTab === tab 
                    ? 'bg-[#22283A] text-white shadow-md' 
                    : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                }`}
              >
                {tab === 'deposit' ? 'Para Yatır' : tab === 'withdraw' ? 'Para Çek' : 'Geçmiş'}
              </button>
            ))}
          </div>

          {/* DESKTOP RIGHT (Balance & Close) */}
          <div className="hidden sm:flex items-center justify-end gap-4 w-[220px] shrink-0">
            <div className="flex flex-col items-end">
              <span className="text-white/40 text-[9px] font-black tracking-widest uppercase mb-0.5">Bakiye</span>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-md bg-[#3B82F6]/20 flex items-center justify-center">
                  <span className="text-[#3B82F6] font-bold text-[10px]">₺</span>
                </div>
                <span className="text-white text-[15px] font-bold tracking-wide">41.750,00</span>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {/* MOBILE BALANCE (Under Tabs) */}
          <div className="sm:hidden flex items-center justify-between bg-white/5 rounded-lg px-3 py-2 mt-1">
             <span className="text-white/40 text-[10px] font-black tracking-widest uppercase">Kullanılabilir Bakiye</span>
             <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-md bg-[#3B82F6]/20 flex items-center justify-center">
                  <span className="text-[#3B82F6] font-bold text-[10px]">₺</span>
                </div>
                <span className="text-white text-[14px] font-bold tracking-wide">41.750,00</span>
              </div>
          </div>
        </div>"""

content = re.sub(old_header_pattern, new_header, content, flags=re.DOTALL)

# Reduce the inner padding of the content area since the tabs are now in the header
content = content.replace('className="flex-1 min-h-0 p-5 sm:px-8 sm:py-6 flex flex-col relative z-10 overflow-y-auto custom-scrollbar"',
                          'className="flex-1 min-h-0 p-4 sm:px-6 sm:py-5 flex flex-col relative z-10 overflow-y-auto custom-scrollbar"')

# Decrease modal height slightly since we saved ~50px vertically
content = content.replace('sm:h-[760px]', 'sm:h-[720px]')

with open('components/WalletModal.tsx', 'w') as f:
    f.write(content)
