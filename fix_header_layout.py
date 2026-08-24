import re

with open('components/WalletModal.tsx', 'r') as f:
    content = f.read()

# Replace the flex row structure in the header
old_header = r'\{\/\* MOBILE TOP ROW \/ DESKTOP LEFT \*\/\}.*?\{\/\* MOBILE BALANCE \(Under Tabs\) \*\/\}\s*<div className="sm:hidden'

new_header = """{/* MOBILE TOP ROW / DESKTOP LEFT */}
          <div className="flex items-center justify-between sm:flex-1 shrink-0 sm:shrink">
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
          <div className="flex bg-[#161B29] p-1 rounded-xl border border-white/5 shadow-inner w-full sm:w-auto shrink-0 mx-4">
            {['deposit', 'withdraw', 'history'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 sm:w-[100px] py-1.5 sm:py-2 rounded-lg text-[11px] sm:text-[12px] font-bold tracking-wide transition-all ${
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
          <div className="hidden sm:flex items-center justify-end gap-4 sm:flex-1 shrink-0 sm:shrink">
            <div className="flex flex-col items-end">
              <span className="text-white/40 text-[9px] font-black tracking-widest uppercase mb-0.5">Bakiye</span>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-md bg-[#3B82F6]/20 flex items-center justify-center">
                  <span className="text-[#3B82F6] font-bold text-[10px]">₺</span>
                </div>
                <span className="text-white text-[15px] font-bold tracking-wide truncate max-w-[90px]">41.750,00</span>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {/* MOBILE BALANCE (Under Tabs) */}
          <div className="sm:hidden"""

content = re.sub(old_header, new_header, content, flags=re.DOTALL)

with open('components/WalletModal.tsx', 'w') as f:
    f.write(content)
