import re

with open('components/WalletModal.tsx', 'r') as f:
    content = f.read()

old_pattern = re.compile(r'\{currentMethods\.map\(m => \{.*?\n\s*\}\)\}', re.DOTALL)

new_block = """{currentMethods.map(m => {
                      const Icon = m.icon;
                      const isSelected = selectedMethod?.id === m.id;
                      const theme = m.theme;

                      // PHOTOREALISTIC GLASSMORPHISM (RESİM GİBİ TASARIM)
                      return (
                        <button
                          key={m.id}
                          onClick={() => setSelectedMethod(m)}
                          className={`relative flex flex-col p-4.5 rounded-[20px] transition-all duration-500 text-left min-h-[110px] group overflow-hidden ${
                            isSelected ? 'scale-[1.03] z-20 shadow-[0_25px_50px_rgba(0,0,0,0.8)]' : 'hover:scale-[1.02] z-10 shadow-[0_10px_30px_rgba(0,0,0,0.4)]'
                          }`}
                          style={{
                            backgroundColor: isSelected ? `${theme.color}20` : 'rgba(30, 35, 50, 0.4)',
                            backdropFilter: 'blur(16px)',
                            border: `1px solid ${isSelected ? theme.color + '80' : 'rgba(255,255,255,0.05)'}`,
                            boxShadow: isSelected 
                              ? `inset 1.5px 1.5px 0px rgba(255,255,255,0.3), inset -1px -1px 0px rgba(0,0,0,0.5), 0 0 40px ${theme.color}30` 
                              : `inset 1px 1px 0px rgba(255,255,255,0.08), inset -1px -1px 0px rgba(0,0,0,0.6)`,
                          }}
                        >
                          {/* İÇ CAM YANSIMASI (Işık Süzmesi) */}
                          <div className="absolute top-0 left-0 w-full h-[40%] bg-gradient-to-b from-white/[0.08] to-transparent z-0 pointer-events-none rounded-t-[20px]"></div>

                          {/* NEON IŞIK DALGASI (Sadece seçiliyken) */}
                          {isSelected && (
                            <div className="absolute -inset-10 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-[spin_4s_linear_infinite] z-0 pointer-events-none mix-blend-overlay"></div>
                          )}

                          <div className="relative z-10 flex justify-between items-start w-full mb-auto">
                            
                            {/* FOTOGERÇEKÇİ İKON KUTUSU */}
                            <div className={`w-12 h-12 rounded-[14px] flex items-center justify-center transition-all duration-500 ${isSelected ? 'shadow-[0_10px_20px_rgba(0,0,0,0.5)]' : 'group-hover:shadow-[0_5px_15px_rgba(0,0,0,0.3)] group-hover:-translate-y-0.5'}`}
                                 style={{ 
                                   background: isSelected ? `linear-gradient(135deg, ${theme.color}, ${theme.color}90)` : `linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))`,
                                   boxShadow: isSelected 
                                      ? `inset 1px 1px 2px rgba(255,255,255,0.5), inset -1px -1px 2px rgba(0,0,0,0.3), 0 0 25px ${theme.color}60` 
                                      : `inset 1px 1px 1px rgba(255,255,255,0.1), inset -1px -1px 1px rgba(0,0,0,0.4)`,
                                   border: isSelected ? 'none' : `1px solid rgba(255,255,255,0.05)`
                                 }}>
                              <Icon strokeWidth={isSelected ? 2.5 : 2} className="w-5 h-5 transition-all duration-500" 
                                    style={{ 
                                      color: isSelected ? '#ffffff' : theme.color,
                                      filter: isSelected ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))' : 'drop-shadow(0 0 10px rgba(255,255,255,0.1))'
                                    }} />
                            </div>
                            
                            {/* ROZET (Cam Hap) */}
                            {isSelected ? (
                              <div className="flex items-center justify-center w-6 h-6 rounded-full"
                                   style={{ 
                                     background: `linear-gradient(135deg, ${theme.color}, ${theme.color}80)`, 
                                     boxShadow: `0 0 20px ${theme.color}, inset 1px 1px 2px rgba(255,255,255,0.6), inset -1px -1px 2px rgba(0,0,0,0.3)` 
                                   }}>
                                <CheckCircle2 className="w-4 h-4 text-white" strokeWidth={4} style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.5))' }} />
                              </div>
                            ) : m.badge ? (
                              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
                                   style={{ 
                                     background: 'rgba(0,0,0,0.3)', 
                                     boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.05), inset -1px -1px 0 rgba(0,0,0,0.5)',
                                     border: '1px solid rgba(255,255,255,0.03)'
                                   }}>
                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.color, boxShadow: `0 0 10px ${theme.color}` }}></div>
                                <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: theme.color, filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.2))' }}>
                                  {m.badge}
                                </span>
                              </div>
                            ) : null}
                          </div>
                          
                          {/* METİN (Derinlikli) */}
                          <div className="mt-5 relative z-10 flex flex-col gap-1">
                            <div className="text-[16px] font-black tracking-wide transition-colors" 
                                 style={{ 
                                   color: isSelected ? '#ffffff' : '#E2E8F0', 
                                   textShadow: isSelected ? `0 2px 10px ${theme.color}, 0 4px 20px rgba(0,0,0,0.8)` : '0 2px 5px rgba(0,0,0,0.5)' 
                                 }}>
                              {m.name}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-black uppercase tracking-widest opacity-80" style={{ color: isSelected ? '#ffffff' : theme.color }}>LİMİT:</span>
                              <span className="text-[12px] font-bold" style={{ color: isSelected ? '#ffffff' : '#94A3B8', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
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
