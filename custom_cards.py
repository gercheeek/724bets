import re

with open('components/WalletModal.tsx', 'r') as f:
    content = f.read()

old_pattern = re.compile(r'\{currentMethods\.map\(m => \{.*?\n\s*\}\)\}', re.DOTALL)

new_block = """{currentMethods.map(m => {
                      const Icon = m.icon;
                      const isSelected = selectedMethod?.id === m.id;
                      const theme = m.theme;

                      // SADECE KARTLARA ÖZEL "ULTRA-PREMIUM" TASARIM
                      return (
                        <button
                          key={m.id}
                          onClick={() => setSelectedMethod(m)}
                          className={`relative flex flex-col p-4 rounded-2xl transition-all duration-300 text-left min-h-[115px] group overflow-hidden ${
                            isSelected ? 'scale-[1.02] shadow-[0_15px_40px_rgba(0,0,0,0.6)] z-20' : 'hover:scale-[1.01] z-10'
                          }`}
                          style={{
                            backgroundColor: isSelected ? `${theme.color}15` : '#131825',
                            border: `1px solid ${isSelected ? theme.color + '70' : 'rgba(255,255,255,0.03)'}`,
                            boxShadow: isSelected ? `0 0 40px ${theme.color}25, inset 0 2px 20px ${theme.color}15` : 'none',
                          }}
                        >
                          {/* İnce Üst LED Çizgisi (Sadece seçiliyken parlar) */}
                          {isSelected && (
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[2px] rounded-b-full z-10"
                                 style={{ background: `linear-gradient(90deg, transparent, ${theme.color}, transparent)`, boxShadow: `0 2px 12px ${theme.color}` }}></div>
                          )}
                          
                          {/* Hover Işık Dalgalanması */}
                          <div className={`absolute inset-0 bg-gradient-to-br from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-0 pointer-events-none`}></div>

                          <div className="relative z-10 flex justify-between items-start w-full mb-auto">
                            
                            {/* PREMIUM İKON KUTUSU */}
                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-300 ${isSelected ? 'shadow-lg' : 'group-hover:scale-105'}`}
                                 style={{ 
                                   background: isSelected ? `linear-gradient(135deg, ${theme.color}, ${theme.color}dd)` : `${theme.color}10`,
                                   boxShadow: isSelected 
                                      ? `inset 0 1px 1px rgba(255,255,255,0.4), 0 8px 25px ${theme.color}70` 
                                      : `inset 0 1px 1px rgba(255,255,255,0.05)`,
                                   border: isSelected ? 'none' : `1px solid ${theme.color}25`
                                 }}>
                              <Icon strokeWidth={isSelected ? 2.5 : 2} className="w-5 h-5 transition-colors" style={{ color: isSelected ? '#ffffff' : theme.color }} />
                            </div>
                            
                            {/* ROZET & ONAY TİKİ (Durum Göstergeli) */}
                            {isSelected ? (
                              <div className="flex items-center justify-center w-6 h-6 rounded-full animate-in zoom-in duration-300"
                                   style={{ backgroundColor: theme.color, boxShadow: `0 0 15px ${theme.color}80, inset 0 1px 2px rgba(255,255,255,0.5)` }}>
                                <CheckCircle2 className="w-4 h-4 text-white" strokeWidth={3.5} />
                              </div>
                            ) : m.badge ? (
                              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md"
                                   style={{ backgroundColor: `${theme.color}08`, border: `1px solid ${theme.color}15` }}>
                                <div className="w-1.5 h-1.5 rounded-full shadow-sm animate-pulse" style={{ backgroundColor: theme.color, boxShadow: `0 0 8px ${theme.color}` }}></div>
                                <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: theme.color }}>
                                  {m.badge}
                                </span>
                              </div>
                            ) : null}
                          </div>
                          
                          {/* METİN VE YAPILANDIRILMIŞ (STRUCTURED) LİMİT BİLGİSİ */}
                          <div className="mt-5 relative z-10 flex flex-col gap-1">
                            <div className="text-[15px] font-bold tracking-wide transition-colors" 
                                 style={{ color: isSelected ? '#ffffff' : '#E2E8F0', textShadow: isSelected ? `0 0 20px ${theme.color}80` : 'none' }}>
                              {m.name}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[9px] font-extrabold uppercase tracking-widest transition-colors" style={{ color: isSelected ? theme.color : '#64748B' }}>LİMİT:</span>
                              <span className="text-[11px] font-bold transition-colors" style={{ color: isSelected ? '#ffffff' : '#94A3B8' }}>
                                {m.min}₺ - {m.max >= 1000000 ? '1M' : m.max/1000 + 'K'}
                              </span>
                            </div>
                          </div>
                        </button>
                      );
                    })}"""

content = old_pattern.sub(new_block, content)

with open('components/WalletModal.tsx', 'w') as f:
    f.write(content)
