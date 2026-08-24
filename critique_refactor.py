import re

with open('components/WalletModal.tsx', 'r') as f:
    content = f.read()

# 1. Colors & Contrast: Sidebar vs Content Area
# Container background
content = content.replace('bg-[#0F1423]', 'bg-[#151D2D]')
# Sidebar background (make it slightly darker)
content = content.replace('bg-[#161B29]', 'bg-[#101623]')
# Right Content background (make it slightly lighter/bluish)
content = content.replace('bg-[#0F1423]', 'bg-[#151D2D]') # Did this above, but need to check specific instances
content = content.replace('className="flex-1 flex flex-col relative bg-[#0F1423]"', 'className="flex-1 flex flex-col relative bg-[#151D2D]"')
content = content.replace('bg-[#0F1423]', 'bg-[#151D2D]') # Catch any remaining

# Fix Active Nav Item to look more like Cybet (subtle highlight, no box)
old_nav_item = r'className={`w-full flex items-center gap-3 px-4 py-3\.5 rounded-xl transition-all duration-200 group \$\{isActive \? \'bg-\[\#0F1423\] shadow-inner border border-white\/5 relative\' : \'hover:bg-white\/5 border border-transparent\'\}`}'
new_nav_item = r'className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive ? \'bg-[#1F2A3F] relative\' : \'hover:bg-white/5\'}`}'
content = re.sub(old_nav_item, new_nav_item, content)

# 2. Fix Logo Padding
content = content.replace('className="flex items-center gap-2 mb-8 px-2 mt-2"', 'className="flex items-center gap-2 mb-8 px-4 mt-2"')

# 3. 3D Cards Restoration
old_cards = r'\{\/\* 3D PAYMENT METHOD CARDS \*\/\}.*?\{\/\* DYNAMIC FORMS \*\/\}'
new_cards = """{/* 3D PAYMENT METHOD CARDS */}
                <div className="grid grid-cols-3 gap-3 mb-6 shrink-0">
                  {DEPOSIT_METHODS.map((method) => {
                    const isSelected = selectedMethod?.id === method.id;
                    return (
                      <button
                        key={method.id}
                        onClick={() => setSelectedMethod(method)}
                        className={`relative flex flex-col items-center justify-between p-3.5 rounded-xl transition-all duration-300 overflow-hidden ${
                          isSelected ? 'scale-100 z-20 shadow-[0_10px_20px_rgba(0,0,0,0.4)]' : 'scale-100 z-10 opacity-70 hover:opacity-100 hover:bg-[#1C263A]'
                        }`}
                        style={{
                          background: isSelected ? `linear-gradient(135deg, ${method.theme.bg} 0%, #151D2D 100%)` : '#1A2436',
                          borderColor: isSelected ? method.theme.color + '80' : 'rgba(255,255,255,0.03)',
                          borderWidth: '1px', borderStyle: 'solid',
                          boxShadow: isSelected ? `inset 0 1px 1px rgba(255,255,255,0.1), 0 5px 15px ${method.theme.color}20` : 'inset 0 1px 1px rgba(255,255,255,0.02)',
                          minHeight: '125px'
                        }}
                      >
                        {isSelected && (
                          <div className="absolute top-2 right-2">
                            <CheckCircle2 className="w-4 h-4" style={{ color: method.theme.color, filter: `drop-shadow(0 0 5px ${method.theme.color})` }} />
                          </div>
                        )}
                        <div className="text-center w-full mt-0.5">
                          <h3 className={`text-[11px] font-black tracking-widest uppercase ${isSelected ? 'text-white' : 'text-white/80'}`}>{method.name}</h3>
                        </div>
                        <div className="h-[36px] w-full flex items-center justify-center my-2">
                          {method.id === 'banktransfer' && <Building2 className={`w-7 h-7 ${isSelected ? 'text-white' : 'text-white/40'}`} />}
                          {method.id === 'crypto' && (
                            <div className="flex items-center">
                              <div className="w-6 h-6 rounded-full flex items-center justify-center border border-[#86EFAC]/30 relative z-10 translate-x-2 bg-gradient-to-br from-[#BBF7D0] to-[#059669] shadow-lg"><span className="text-white text-[10px] font-bold">₮</span></div>
                              <div className="w-7 h-7 rounded-full flex items-center justify-center border border-[#FDE047]/50 relative z-20 bg-gradient-to-br from-[#FEF08A] to-[#D97706] shadow-xl"><span className="text-white text-[12px] font-bold">₿</span></div>
                              <div className="w-6 h-6 rounded-full flex items-center justify-center border border-[#E2E8F0]/30 relative z-0 -translate-x-2 bg-gradient-to-br from-[#F8FAFC] to-[#94A3B8] shadow-lg"><span className="text-white text-[10px] font-bold">Ξ</span></div>
                            </div>
                          )}
                          {method.id === 'creditcard' && <span className="font-black italic text-white text-[16px]">VISA</span>}
                        </div>
                        <div className="mt-auto w-full text-center">
                          <span className={`text-[8px] font-black tracking-widest uppercase ${isSelected ? 'text-white/90' : 'text-white/40'}`}>{method.badge}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* DYNAMIC FORMS */}"""
content = re.sub(old_cards, new_cards, content, flags=re.DOTALL)

# 4. Amount Section & CTA Refactor (Removing huge empty space, adding quick amounts back)
old_amount = r'\{\/\* AMOUNT INPUT \*\/\}.*?\{\/\* CTA BUTTON \*\/\}.*?<\/div>\s*<\/div>'
new_amount = """{/* AMOUNT & QUICK AMOUNTS */}
                  <div className="mt-2 bg-[#1A2436] p-4 rounded-2xl border border-white/5">
                    <div className="flex justify-between items-end mb-2">
                       <h3 className="text-white/60 text-[11px] font-bold tracking-widest uppercase">Tutar Belirleyin</h3>
                    </div>
                    
                    <div className="relative flex items-center rounded-xl overflow-hidden bg-[#101623] border border-white/10 focus-within:border-[#10B981]/50 transition-colors mb-3">
                      <div className="pl-4 pr-2 flex items-center justify-center shrink-0">
                        <span className="text-[#10B981] font-black text-[18px]">₺</span>
                      </div>
                      <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className="w-full bg-transparent py-3 px-2 text-white text-[18px] font-black outline-none" />
                      <button onClick={() => setAmount('41750')} className="mr-2 bg-[#1F2A3F] hover:bg-[#2A3752] text-white/80 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors border border-white/5">
                        Maks.
                      </button>
                    </div>

                    {/* Quick Amounts */}
                    {activeTab === 'deposit' && (
                      <div className="grid grid-cols-4 sm:grid-cols-4 gap-2">
                        {[250, 500, 1000, 2500, 5000, 10000, 25000, 50000].map(val => (
                          <button
                            key={val}
                            onClick={() => setAmount(val.toString())}
                            className="py-2 rounded-lg text-[11px] font-bold transition-all text-white/50 hover:text-white hover:bg-[#1F2A3F] bg-[#151D2D] border border-white/5"
                          >
                            +{val >= 1000 ? (val/1000).toFixed(0) + 'k' : val}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* CTA BUTTON */}
                  <div className="mt-4">
                    <button 
                      onClick={handleSubmit} disabled={loading || !isFormValid()}
                      className="w-full rounded-xl text-white font-black text-[15px] tracking-wide py-3.5 transition-all hover:bg-[#0EA5E9] disabled:opacity-50 shadow-[0_5px_20px_rgba(16,185,129,0.3)] hover:shadow-[0_5px_25px_rgba(14,165,233,0.4)]"
                      style={{ background: '#10B981' }}
                    >
                      {loading ? 'İşleniyor...' : (activeTab === 'deposit' ? 'Para Yatır' : 'Çekim Yap')}
                    </button>
                  </div>
                </div>
              </div>"""
content = re.sub(old_amount, new_amount, content, flags=re.DOTALL)

with open('components/WalletModal.tsx', 'w') as f:
    f.write(content)
