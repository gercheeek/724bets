import re

with open('components/WalletModal.tsx', 'r') as f:
    content = f.read()

# We need to find the block from `{currentMethods.map(m => {` to the end of the `})}`
# I will use a regex to replace it perfectly.

old_pattern = re.compile(r'\{currentMethods\.map\(m => \{.*?\n\s*\}\)\}', re.DOTALL)

new_block = """{currentMethods.map(m => {
                      const Icon = m.icon;
                      const isSelected = selectedMethod?.id === m.id;
                      const theme = m.theme;

                      // KART ALANI İÇİN ÖZEL GELİŞTİRİLMİŞ (VIBRANT & SHARP) TASARIM
                      return (
                        <button
                          key={m.id}
                          onClick={() => setSelectedMethod(m)}
                          className={`relative flex flex-col p-4 rounded-[16px] transition-all duration-300 text-left overflow-hidden group min-h-[100px] ${
                            isSelected 
                              ? `scale-[1.02] shadow-[0_10px_30px_${theme.glow}] z-20` 
                              : 'hover:scale-[1.02] hover:shadow-[0_10px_25px_rgba(0,0,0,0.4)] z-10'
                          }`}
                          style={{
                            border: `1px solid ${isSelected ? theme.color : theme.color + '30'}`,
                            background: isSelected 
                                ? `linear-gradient(145deg, ${theme.color}15 0%, ${theme.color}05 100%)` 
                                : `linear-gradient(145deg, ${theme.color}0A 0%, transparent 100%)`
                          }}
                        >
                          {/* Keskin Cam Yansıması (Top Edge) */}
                          <div className="absolute top-0 left-0 w-full h-[1px] z-10" 
                               style={{ background: isSelected ? `linear-gradient(90deg, transparent, ${theme.color}80, transparent)` : 'rgba(255,255,255,0.05)' }}></div>
                          
                          {/* Seçili Durum İçin Alttan Vuran Renk Parlaması */}
                          {isSelected && (
                            <div className="absolute -bottom-8 -right-8 w-32 h-32 blur-[45px] rounded-full z-0 pointer-events-none" 
                                 style={{ backgroundColor: theme.color, opacity: 0.4 }}></div>
                          )}

                          <div className="relative z-20 flex flex-col h-full w-full">
                            <div className="flex justify-between items-start w-full mb-3">
                              
                              {/* İKON YUVASI (Mücevher gibi keskin) */}
                              <div className={`w-8 h-8 rounded-[10px] flex items-center justify-center shadow-lg transition-transform duration-300 ${isSelected ? 'scale-110' : 'group-hover:scale-110'}`}
                                   style={{ 
                                     background: isSelected ? theme.color : `${theme.color}15`,
                                     boxShadow: isSelected 
                                        ? `inset 0 1.5px 1px rgba(255,255,255,0.4), 0 5px 15px ${theme.glow}` 
                                        : `inset 0 1px 1px rgba(255,255,255,0.1)`,
                                     border: isSelected ? 'none' : `1px solid ${theme.color}40`
                                   }}>
                                <Icon strokeWidth={2.5} className="w-4 h-4" style={{ color: isSelected ? '#ffffff' : theme.color }} />
                              </div>
                              
                              {/* ROZET (Keskin, net ve canlı) */}
                              {isSelected ? (
                                <div className="flex items-center justify-center w-5 h-5 rounded-full shadow-md animate-in zoom-in duration-300"
                                     style={{ backgroundColor: theme.color, boxShadow: `0 0 12px ${theme.color}90, inset 0 1px 2px rgba(255,255,255,0.6)` }}>
                                  <CheckCircle2 className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                                </div>
                              ) : m.badge ? (
                                <span className="text-[9px] font-bold uppercase px-2 py-1 rounded-[6px] tracking-widest shadow-sm"
                                      style={{ backgroundColor: `${theme.color}15`, color: theme.color, border: `1px solid ${theme.color}40` }}>
                                  {m.badge}
                                </span>
                              ) : null}
                            </div>
                            
                            {/* METİNLER */}
                            <div className="mt-auto">
                              <div className="text-[14px] font-bold mb-1 tracking-wide drop-shadow-sm transition-colors"
                                   style={{ color: isSelected ? '#ffffff' : '#f8fafc' }}>
                                {m.name}
                              </div>
                              <div className="text-[9.5px] font-bold uppercase tracking-wider transition-colors"
                                   style={{ color: isSelected ? theme.color : `${theme.color}b3` }}>
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
