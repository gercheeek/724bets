import re

with open('components/WalletModal.tsx', 'r') as f:
    content = f.read()

# 1. Replace the Card Container
old_container_start = r'<div className="flex sm:grid gap-3 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 snap-x" style={{ scrollbarWidth: \'none\', msOverflowStyle: \'none\' }}>'
new_container_start = r'<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">'
content = re.sub(re.escape(old_container_start), new_container_start, content)
content = content.replace('style={{ scrollbarWidth: \'none\', msOverflowStyle: \'none\' }}', '') # Ensure it's removed if it lingered somehow, but regex above handles it if matched exactly. Oh wait, my regex used exact string.

# To be safer with container replacement:
container_pattern = r'<div className="flex sm:grid gap-3 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 snap-x"[^>]*>'
new_container = '<div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">'
content = re.sub(container_pattern, new_container, content)

# 2. Rebuild the Card rendering logic
# We need to find the entire map function:
# {currentMethods.map((method) => { ... return ( ... ); })}
# We'll use a very careful regex or string find to replace the inside of the map function.

start_marker = "{currentMethods.map((method) => {"
end_marker = "                {/* 2. DYNAMIC FORM AREA */}"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

new_cards_block = """{currentMethods.map((method) => {
                  const isSelected = selectedMethod?.id === method.id;
                  
                  return (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(method)}
                      className={`relative flex flex-col items-center justify-between p-4 rounded-[16px] transition-all duration-500 w-full group overflow-hidden ${
                        isSelected 
                          ? 'scale-100 sm:scale-[1.03] z-20 shadow-[0_20px_40px_rgba(0,0,0,0.8)]' 
                          : 'scale-100 hover:scale-[1.02] z-10 opacity-70 hover:opacity-100 shadow-[0_10px_20px_rgba(0,0,0,0.4)]'
                      }`}
                      style={{
                        background: isSelected 
                          ? `linear-gradient(145deg, ${method.theme.bg} 0%, #0d111a 100%)` 
                          : '#10141d',
                        borderColor: isSelected ? method.theme.color + '80' : 'rgba(255,255,255,0.05)',
                        borderWidth: '1px',
                        borderStyle: 'solid',
                        boxShadow: isSelected 
                          ? `inset 0 1px 1px rgba(255,255,255,0.15), inset 0 -1px 2px rgba(0,0,0,0.5), 0 15px 35px ${method.theme.color}30` 
                          : 'inset 0 1px 1px rgba(255,255,255,0.02), inset 0 -1px 1px rgba(0,0,0,0.4)',
                        minHeight: '140px'
                      }}
                    >
                      {/* Checkmark for Active State */}
                      {isSelected && (
                        <div className="absolute top-3 right-3 animate-in zoom-in duration-300">
                          <CheckCircle2 className="w-5 h-5" style={{ color: method.theme.color, filter: `drop-shadow(0 0 8px ${method.theme.color})` }} />
                        </div>
                      )}

                      {/* Header Section */}
                      <div className="text-center w-full mt-1">
                        <h3 className={`text-[12px] sm:text-[13px] font-black tracking-widest uppercase transition-colors ${isSelected ? 'text-white' : 'text-white/90'}`}>
                          {method.name}
                        </h3>
                        <p className={`text-[9px] sm:text-[10px] font-bold tracking-widest uppercase mt-1 transition-colors ${isSelected ? 'text-white/70' : 'text-white/60 group-hover:text-white/80'}`}>
                          {method.desc}
                        </p>
                      </div>

                      {/* Fixed Height Visual Wrapper for Alignment */}
                      <div className="h-[50px] w-full flex items-center justify-center my-3 relative z-10">
                        {method.id === 'banktransfer' && (
                          <div className="relative">
                            <Building2 className={`w-8 h-8 transition-colors ${isSelected ? 'text-white' : 'text-white/60'}`} strokeWidth={1.5} />
                            {isSelected && <div className="absolute inset-0 blur-xl opacity-50" style={{ background: method.theme.color }}></div>}
                          </div>
                        )}

                        {method.id === 'crypto' && (
                          <div className="flex items-center justify-center">
                            <div className="relative flex items-center justify-center">
                              {/* Tether */}
                              <div className="w-6 h-6 rounded-full flex items-center justify-center border-2 border-[#86EFAC]/30 shadow-[0_10px_20px_rgba(0,0,0,0.8)] relative z-10 translate-x-2.5 bg-gradient-to-br from-[#BBF7D0] to-[#059669]">
                                <span className="text-white text-[10px] font-bold">₮</span>
                              </div>
                              {/* Bitcoin */}
                              <div className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-[#FDE047]/50 shadow-[0_10px_20px_rgba(0,0,0,0.9)] relative z-20 bg-gradient-to-br from-[#FEF08A] to-[#D97706]">
                                <span className="text-white text-[14px] font-bold">₿</span>
                              </div>
                              {/* Ethereum */}
                              <div className="w-6 h-6 rounded-full flex items-center justify-center border-2 border-[#E2E8F0]/30 shadow-[0_10px_20px_rgba(0,0,0,0.8)] relative z-0 -translate-x-2.5 bg-gradient-to-br from-[#F8FAFC] to-[#94A3B8]">
                                <span className="text-white text-[10px] font-bold">Ξ</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {method.id === 'creditcard' && (
                          <div className="flex flex-col items-center justify-center">
                            <div className="flex items-center gap-3">
                              <span className="font-black italic text-white text-[16px] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">VISA</span>
                              <div className="flex -space-x-2 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
                                <div className="w-4 h-4 rounded-full bg-[#EF4444] mix-blend-screen opacity-90"></div>
                                <div className="w-4 h-4 rounded-full bg-[#F59E0B] mix-blend-screen opacity-90"></div>
                              </div>
                            </div>
                            <div className="text-white/50 font-mono text-[9px] tracking-[0.2em] mt-1.5 font-bold">
                              **** 7890
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Footer Badge (Only for passive or informational, NOT a button) */}
                      <div className="mt-auto pt-2 border-t border-white/5 w-full">
                        <span className={`block text-center text-[9px] font-black tracking-widest uppercase ${isSelected ? 'text-white/90' : 'text-white/50 group-hover:text-white/70'}`}>
                          {method.badge}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

"""
new_content = content[:start_idx] + new_cards_block + content[end_idx:]

with open('components/WalletModal.tsx', 'w') as f:
    f.write(new_content)
