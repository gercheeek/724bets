import re

with open('components/WalletModal.tsx', 'r') as f:
    content = f.read()

# Define the new, ultra-premium cards block
new_cards_html = """{/* ULTRA PREMIUM PAYMENT CARDS */}
                <div className="grid grid-cols-3 gap-3 mb-6 shrink-0">
                  
                  {/* 1. BANKA HAVALESİ (Trust & Classic Premium) */}
                  <button
                    onClick={() => setSelectedMethod(DEPOSIT_METHODS[0])}
                    className={`relative flex flex-col items-center justify-between p-3 sm:p-4 rounded-2xl transition-all duration-500 overflow-hidden group ${
                      selectedMethod?.id === 'banktransfer' 
                        ? 'scale-100 sm:scale-105 z-20 shadow-[0_15px_30px_rgba(59,130,246,0.3)] ring-1 ring-[#3B82F6]/50' 
                        : 'scale-100 z-10 opacity-60 hover:opacity-100'
                    }`}
                    style={{
                      background: selectedMethod?.id === 'banktransfer' 
                        ? 'radial-gradient(120% 120% at 50% -10%, #1e3a8a 0%, #090e1a 100%)' 
                        : 'linear-gradient(145deg, #131927 0%, #0d121c 100%)',
                      border: selectedMethod?.id === 'banktransfer' ? 'none' : '1px solid rgba(255,255,255,0.03)',
                      boxShadow: selectedMethod?.id === 'banktransfer' 
                        ? 'inset 0 2px 4px rgba(255,255,255,0.1), inset 0 -4px 10px rgba(0,0,0,0.6)' 
                        : 'inset 0 1px 1px rgba(255,255,255,0.02)',
                      minHeight: '130px'
                    }}
                  >
                    {/* Glowing Grid Background Effect */}
                    {selectedMethod?.id === 'banktransfer' && (
                      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:10px_10px]"></div>
                    )}
                    
                    {selectedMethod?.id === 'banktransfer' && (
                      <div className="absolute top-2.5 right-2.5 z-30">
                        <CheckCircle2 className="w-4 h-4 text-[#60A5FA] drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
                      </div>
                    )}
                    
                    <div className="text-center w-full relative z-20 mt-1">
                      <h3 className={`text-[10px] sm:text-[11px] font-black tracking-widest uppercase transition-colors ${selectedMethod?.id === 'banktransfer' ? 'text-white drop-shadow-md' : 'text-white/70'}`}>
                        Banka Havalesi
                      </h3>
                    </div>
                    
                    <div className="h-[45px] w-full flex items-center justify-center my-2 relative z-20">
                      <div className="relative">
                        <Building2 className={`w-8 h-8 transition-all duration-500 ${selectedMethod?.id === 'banktransfer' ? 'text-[#93C5FD] drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]' : 'text-white/30'}`} strokeWidth={1.5} />
                      </div>
                    </div>
                    
                    <div className="mt-auto w-full text-center relative z-20">
                      <div className={`text-[8px] font-black tracking-widest uppercase inline-block px-2 py-0.5 rounded-full border ${
                        selectedMethod?.id === 'banktransfer' 
                          ? 'border-[#3B82F6]/30 bg-[#3B82F6]/10 text-[#93C5FD]' 
                          : 'border-white/5 bg-white/5 text-white/30'
                      }`}>
                        7/24 Aktif
                      </div>
                    </div>
                  </button>

                  {/* 2. KRİPTO PARA (Web3 & Cyberpunk Neon) */}
                  <button
                    onClick={() => setSelectedMethod(DEPOSIT_METHODS[1])}
                    className={`relative flex flex-col items-center justify-between p-3 sm:p-4 rounded-2xl transition-all duration-500 overflow-hidden group ${
                      selectedMethod?.id === 'crypto' 
                        ? 'scale-100 sm:scale-105 z-20 shadow-[0_15px_30px_rgba(16,185,129,0.2)] ring-1 ring-[#10B981]/50' 
                        : 'scale-100 z-10 opacity-60 hover:opacity-100'
                    }`}
                    style={{
                      background: selectedMethod?.id === 'crypto' 
                        ? 'radial-gradient(130% 130% at 50% 100%, #064e3b 0%, #090e1a 100%)' 
                        : 'linear-gradient(145deg, #131927 0%, #0d121c 100%)',
                      border: selectedMethod?.id === 'crypto' ? 'none' : '1px solid rgba(255,255,255,0.03)',
                      boxShadow: selectedMethod?.id === 'crypto' 
                        ? 'inset 0 2px 4px rgba(255,255,255,0.1), inset 0 -4px 10px rgba(0,0,0,0.6)' 
                        : 'inset 0 1px 1px rgba(255,255,255,0.02)',
                      minHeight: '130px'
                    }}
                  >
                    {/* Hexagon/Tech Pattern Effect */}
                    {selectedMethod?.id === 'crypto' && (
                      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#10B981 1px, transparent 1px)', backgroundSize: '8px 8px' }}></div>
                    )}

                    {selectedMethod?.id === 'crypto' && (
                      <div className="absolute top-2.5 right-2.5 z-30">
                        <CheckCircle2 className="w-4 h-4 text-[#34D399] drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                      </div>
                    )}
                    
                    <div className="text-center w-full relative z-20 mt-1">
                      <h3 className={`text-[10px] sm:text-[11px] font-black tracking-widest uppercase transition-colors ${selectedMethod?.id === 'crypto' ? 'text-white drop-shadow-md' : 'text-white/70'}`}>
                        Kripto Para
                      </h3>
                    </div>
                    
                    <div className="h-[45px] w-full flex items-center justify-center my-2 relative z-20">
                      <div className="flex items-center">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-500 relative z-10 translate-x-3 ${selectedMethod?.id === 'crypto' ? 'border-[#34D399]/50 bg-gradient-to-br from-[#10B981] to-[#047857] shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'border-white/10 bg-[#1A2436] grayscale opacity-50'}`}>
                          <span className="text-white text-[10px] font-bold">₮</span>
                        </div>
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-500 relative z-20 ${selectedMethod?.id === 'crypto' ? 'border-[#FCD34D]/50 bg-gradient-to-br from-[#F59E0B] to-[#B45309] shadow-[0_0_20px_rgba(245,158,11,0.6)] scale-110' : 'border-white/10 bg-[#1A2436] grayscale opacity-50'}`}>
                          <span className="text-white text-[14px] font-bold">₿</span>
                        </div>
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-500 relative z-0 -translate-x-3 ${selectedMethod?.id === 'crypto' ? 'border-[#94A3B8]/50 bg-gradient-to-br from-[#64748B] to-[#334155] shadow-[0_0_15px_rgba(100,116,139,0.5)]' : 'border-white/10 bg-[#1A2436] grayscale opacity-50'}`}>
                          <span className="text-white text-[10px] font-bold">Ξ</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-auto w-full text-center relative z-20">
                      <div className={`text-[8px] font-black tracking-widest uppercase inline-block px-2 py-0.5 rounded-full border ${
                        selectedMethod?.id === 'crypto' 
                          ? 'border-[#10B981]/30 bg-[#10B981]/10 text-[#6EE7B7]' 
                          : 'border-white/5 bg-white/5 text-white/30'
                      }`}>
                        Anında
                      </div>
                    </div>
                  </button>

                  {/* 3. KREDİ KARTI (Physical Titanium Card) */}
                  <button
                    onClick={() => setSelectedMethod(DEPOSIT_METHODS[2])}
                    className={`relative flex flex-col items-center justify-between p-3 sm:p-4 rounded-2xl transition-all duration-500 overflow-hidden group ${
                      selectedMethod?.id === 'creditcard' 
                        ? 'scale-100 sm:scale-105 z-20 shadow-[0_15px_30px_rgba(139,92,246,0.2)] ring-1 ring-[#8B5CF6]/50' 
                        : 'scale-100 z-10 opacity-60 hover:opacity-100'
                    }`}
                    style={{
                      background: selectedMethod?.id === 'creditcard' 
                        ? 'linear-gradient(135deg, #2e1065 0%, #0f0728 50%, #1e1b4b 100%)' 
                        : 'linear-gradient(145deg, #131927 0%, #0d121c 100%)',
                      border: selectedMethod?.id === 'creditcard' ? 'none' : '1px solid rgba(255,255,255,0.03)',
                      boxShadow: selectedMethod?.id === 'creditcard' 
                        ? 'inset 0 2px 4px rgba(255,255,255,0.2), inset -2px -2px 10px rgba(0,0,0,0.8), inset 2px 0 10px rgba(139,92,246,0.3)' 
                        : 'inset 0 1px 1px rgba(255,255,255,0.02)',
                      minHeight: '130px'
                    }}
                  >
                    {/* Metal Sheen Effect */}
                    {selectedMethod?.id === 'creditcard' && (
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    )}

                    {selectedMethod?.id === 'creditcard' && (
                      <div className="absolute top-2.5 right-2.5 z-30">
                        <CheckCircle2 className="w-4 h-4 text-[#A78BFA] drop-shadow-[0_0_8px_rgba(167,139,250,0.8)]" />
                      </div>
                    )}
                    
                    <div className="text-center w-full relative z-20 mt-1">
                      <h3 className={`text-[10px] sm:text-[11px] font-black tracking-widest uppercase transition-colors ${selectedMethod?.id === 'creditcard' ? 'text-white drop-shadow-md' : 'text-white/70'}`}>
                        Kredi Kartı
                      </h3>
                    </div>
                    
                    <div className="h-[45px] w-full flex flex-col items-center justify-center my-2 relative z-20">
                       {/* EMV Chip Simulation */}
                       {selectedMethod?.id === 'creditcard' && (
                         <div className="w-6 h-4 mb-2 rounded-sm bg-gradient-to-br from-[#FCD34D] to-[#B45309] opacity-80 border border-[#FDE68A]/30 flex flex-col justify-evenly px-0.5 overflow-hidden">
                            <div className="w-full h-[1px] bg-black/20"></div>
                            <div className="w-full h-[1px] bg-black/20"></div>
                         </div>
                       )}
                       <span className={`font-black italic text-[16px] transition-all duration-500 ${selectedMethod?.id === 'creditcard' ? 'text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]' : 'text-white/30'}`}>VISA</span>
                    </div>
                    
                    <div className="mt-auto w-full text-center relative z-20">
                      <div className={`text-[8px] font-black tracking-widest uppercase inline-block px-2 py-0.5 rounded-full border ${
                        selectedMethod?.id === 'creditcard' 
                          ? 'border-[#8B5CF6]/30 bg-[#8B5CF6]/10 text-[#C4B5FD]' 
                          : 'border-white/5 bg-white/5 text-white/30'
                      }`}>
                        3D Güvenli
                      </div>
                    </div>
                  </button>

                </div>"""

# Extract everything before 3D cards, and everything after
pattern = r'\{\/\* 3D PAYMENT METHOD CARDS \*\/\}.*?<\/div>\s*\{\/\* DYNAMIC FORMS \*\/\}'
match = re.search(pattern, content, flags=re.DOTALL)

if match:
    new_content = content[:match.start()] + new_cards_html + '\n\n                {/* DYNAMIC FORMS */}' + content[match.end():]
    with open('components/WalletModal.tsx', 'w') as f:
        f.write(new_content)
    print("Replaced ultra premium cards!")
else:
    print("Could not find the target regex.")
