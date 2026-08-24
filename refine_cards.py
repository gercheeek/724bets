import re

with open('components/WalletModal.tsx', 'r') as f:
    content = f.read()

old_pattern = re.compile(r'\{currentMethods\.map\(m => \{.*?\n\s*\}\)\}', re.DOTALL)

new_block = """{currentMethods.map(m => {
                      const Icon = m.icon;
                      const isSelected = selectedMethod?.id === m.id;
                      const theme = m.theme;

                      // KART ALANI İÇİN KUSURSUZLAŞTIRILMIŞ (REFINED) TASARIM
                      return (
                        <button
                          key={m.id}
                          onClick={() => setSelectedMethod(m)}
                          className={`relative flex flex-col p-4 rounded-[16px] transition-all duration-300 text-left group min-h-[100px] ${
                            isSelected ? 'scale-[1.02] z-20' : 'hover:scale-[1.02] z-10'
                          }`}
                          // NOT: overflow-hidden kasıtlı olarak kaldırıldı. Işıkların bıçak gibi kesilmemesi için!
                        >
                          {/* ZEMİN VE İÇ GÖLGELER (Glass Base) */}
                          <div className="absolute inset-0 rounded-[16px] transition-all duration-300 z-0"
                               style={{
                                 background: isSelected 
                                   ? `linear-gradient(180deg, ${theme.color}1A 0%, transparent 100%)` 
                                   : 'rgba(255,255,255,0.02)',
                                 boxShadow: isSelected
                                   ? `0 15px 40px -10px ${theme.glow}, inset 0 1px 0 rgba(255,255,255,0.15)`
                                   : `inset 0 1px 0 rgba(255,255,255,0.03)`
                               }}>
                          </div>
                          
                          {/* YUMUŞAK AMBİYANS IŞIĞI (Artık kesilmiyor) */}
                          {isSelected && (
                            <div className="absolute -bottom-4 right-0 w-full h-2/3 rounded-full z-0 pointer-events-none transition-all duration-700" 
                                 style={{ background: theme.color, filter: 'blur(35px)', opacity: 0.15 }}></div>
                          )}

                          <div className="relative z-20 flex flex-col h-full w-full">
                            <div className="flex justify-between items-start w-full mb-3">
                              
                              {/* İKON KUTUSU (Mat ve derin) */}
                              <div className={`w-8 h-8 rounded-[10px] flex items-center justify-center shadow-lg transition-transform duration-300 ${isSelected ? 'scale-110' : 'group-hover:scale-110'}`}
                                   style={{ 
                                     background: isSelected ? `linear-gradient(135deg, ${theme.color}, ${theme.color}dd)` : `${theme.color}15`,
                                     boxShadow: isSelected 
                                        ? `inset 0 1px 1px rgba(255,255,255,0.25), 0 6px 15px ${theme.glow}` 
                                        : `inset 0 1px 1px rgba(255,255,255,0.05)`,
                                   }}>
                                <Icon strokeWidth={2.5} className="w-4 h-4" style={{ color: isSelected ? '#ffffff' : theme.color }} />
                              </div>
                              
                              {/* ROZET (Jöle efekti kaldırıldı, saf ve net) */}
                              {isSelected ? (
                                <div className="flex items-center justify-center w-5 h-5 rounded-full shadow-md animate-in zoom-in duration-300"
                                     style={{ backgroundColor: theme.color, boxShadow: `0 4px 12px ${theme.glow}` }}>
                                  <CheckCircle2 className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                                </div>
                              ) : m.badge ? (
                                <span className="text-[9px] font-bold uppercase px-2 py-1 rounded-[6px] tracking-widest shadow-sm"
                                      style={{ backgroundColor: `${theme.color}10`, color: theme.color }}>
                                  {m.badge}
                                </span>
                              ) : null}
                            </div>
                            
                            {/* METİNLER */}
                            <div className="mt-auto">
                              <div className="text-[14px] font-bold mb-1 tracking-wide transition-colors"
                                   style={{ color: isSelected ? '#ffffff' : 'rgba(255,255,255,0.7)' }}>
                                {m.name}
                              </div>
                              <div className="text-[9.5px] font-bold uppercase tracking-wider transition-colors"
                                   style={{ color: isSelected ? theme.color : `${theme.color}90` }}>
                                LİMİT: {m.min}₺ - {m.max >= 1000000 ? '1M' : m.max/1000 + 'K'}
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}"""

content = old_pattern.sub(new_block, content)

with open('components/WalletModal.tsx', 'w') as f:
    f.write(content)
