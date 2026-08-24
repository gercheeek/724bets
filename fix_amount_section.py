import re

with open('components/WalletModal.tsx', 'r') as f:
    content = f.read()

# I will use a clever replacement to target the AMOUNT SECTION.
# Find: {/* 3. AMOUNT SECTION (Clean & Solid) */}
# End: {/* 4. SOLID CTA BUTTON */} or the end of the form.

# Let's write the new block:
new_amount_section = """
                {/* 3. AMOUNT SECTION (Premium 3D Glass) */}
                <div className="mt-2">
                  <div className="flex justify-between items-end mb-2">
                    <h3 className="text-white/50 text-[10px] font-bold tracking-widest uppercase">İşlem Tutarı</h3>
                    {/* Hızlı butonlar buraya (sağ üste) de alınabilir ama şimdilik aşağıda */}
                  </div>
                  
                  {/* Fotogerçekçi Input Yuvası (Carved Screen Effect) */}
                  <div className="relative flex items-center rounded-xl overflow-hidden transition-all focus-within:ring-1"
                       style={{ 
                         background: 'rgba(0,0,0,0.4)', 
                         boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.8), inset -1px -1px 2px rgba(255,255,255,0.05)',
                         borderColor: selectedMethod?.theme?.color + '50'
                       }}>
                    <div className="pl-4 flex items-center justify-center">
                      <span className="text-lg font-black" style={{ color: selectedMethod?.theme?.color, textShadow: `0 0 10px ${selectedMethod?.theme?.color}80` }}>₺</span>
                    </div>
                    <input 
                      type="number" 
                      value={amount} 
                      onChange={e => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-transparent py-3 px-3 text-white text-[22px] font-black outline-none placeholder-white/10 tracking-wider" 
                      style={{ textShadow: '0 2px 5px rgba(0,0,0,0.8)' }}
                    />
                  </div>

                  {/* 3D Hızlı Tutar Hapları (Quick Amounts) */}
                  {activeTab === 'deposit' && (
                    <div className="grid grid-cols-3 gap-2.5 mt-3">
                      {[250, 500, 1000, 2500, 5000, 10000].map(val => (
                        <button
                          key={val}
                          onClick={() => setAmount(val.toString())}
                          className="py-1.5 rounded-lg text-white/70 font-bold text-[11px] transition-all hover:text-white hover:scale-105 active:scale-95"
                          style={{
                            background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
                            boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.05), inset -1px -1px 0 rgba(0,0,0,0.3)',
                            border: '1px solid rgba(255,255,255,0.03)'
                          }}
                          onMouseEnter={e => {
                             e.currentTarget.style.borderColor = selectedMethod?.theme?.color + '50';
                             e.currentTarget.style.boxShadow = `0 0 10px ${selectedMethod?.theme?.color}30, inset 1px 1px 0 rgba(255,255,255,0.1)`;
                             e.currentTarget.style.color = '#ffffff';
                          }}
                          onMouseLeave={e => {
                             e.currentTarget.style.borderColor = 'rgba(255,255,255,0.03)';
                             e.currentTarget.style.boxShadow = 'inset 1px 1px 0 rgba(255,255,255,0.05), inset -1px -1px 0 rgba(0,0,0,0.3)';
                             e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                          }}
                        >
                          +{val >= 1000 ? (val/1000).toFixed(3) : val}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 4. SOLID CTA BUTTON */}
                <div className="pt-4 pb-1">
                  <button 
                    onClick={handleSubmit} 
                    disabled={loading || !isFormValid}
                    className="w-full rounded-xl text-white font-black text-[15px] py-3.5 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110"
                    style={{ 
                      background: `linear-gradient(135deg, ${selectedMethod?.theme?.color}, ${selectedMethod?.theme?.color}dd)`, 
                      boxShadow: `0 10px 25px ${selectedMethod?.theme?.color}60, inset 1px 1px 2px rgba(255,255,255,0.4), inset -1px -1px 2px rgba(0,0,0,0.2)` 
                    }}
                  >
                    <span style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>
                      {loading ? 'İşleniyor...' : (activeTab === 'deposit' ? 'İşlemi Onayla' : 'Talebi Gönder')}
                    </span>
                  </button>
                </div>
"""

# Now we need to carefully replace the old section.
# The old section starts with {/* 3. AMOUNT SECTION (Clean & Solid) */}
# And ends with </button>\n                </div>
# We can use regex to replace it.

pattern = re.compile(r'\{\/\*\s*3\.\s*AMOUNT\s*SECTION.*?</button>\s*</div>', re.DOTALL)
content = pattern.sub(new_amount_section, content)

with open('components/WalletModal.tsx', 'w') as f:
    f.write(content)

