import re

with open('components/WalletModal.tsx', 'r') as f:
    content = f.read()

old_pattern = re.compile(r'\{currentMethods\.map\(m => \{.*?\n\s*\}\)\}', re.DOTALL)

new_block = """{currentMethods.map(m => {
                      const Icon = m.icon;
                      const isSelected = selectedMethod?.id === m.id;
                      const theme = m.theme;

                      // GÖSTERİLEN RESİM İLE BİREBİR AYNI (1-to-1) DİKEY KONSEPT
                      return (
                        <button
                          key={m.id}
                          onClick={() => setSelectedMethod(m)}
                          className={`relative flex flex-col items-center justify-between p-5 rounded-[20px] transition-all duration-300 min-h-[190px] w-full group overflow-hidden ${
                            isSelected ? 'scale-[1.02] z-20' : 'hover:scale-[1.02] z-10 opacity-70 hover:opacity-100'
                          }`}
                          style={{
                            backgroundColor: '#0A0F1A', // Derin uzay siyahı
                            backgroundImage: `linear-gradient(180deg, ${theme.color}20 0%, transparent 100%)`, // Üstten inen renkli ışık
                            border: isSelected ? `2px solid ${theme.color}` : `1px solid ${theme.color}40`,
                            boxShadow: isSelected ? `0 0 35px ${theme.color}60, inset 0 0 25px ${theme.color}20` : `0 0 15px rgba(0,0,0,0.5)`,
                          }}
                        >
                          {/* Üst Kısım: Başlık */}
                          <div className="w-full text-center mt-1">
                            <h4 className="text-[14px] font-black tracking-widest uppercase transition-colors" 
                                style={{ color: isSelected ? '#ffffff' : theme.color, textShadow: isSelected ? `0 0 15px ${theme.color}` : 'none' }}>
                              {m.name}
                            </h4>
                            <span className="text-[9px] font-bold uppercase tracking-widest text-white/40 block mt-1.5">
                              LİMİT: {m.min}₺ - {m.max >= 1000000 ? '1M' : m.max/1000 + 'K'}
                            </span>
                          </div>

                          {/* Orta Kısım: Devasa Yüzen İkon (Kutusuz) */}
                          <div className={`my-auto py-4 transition-transform duration-500 ${isSelected ? 'scale-110' : 'group-hover:scale-110'}`}>
                             <Icon strokeWidth={isSelected ? 2 : 1.5} className="w-12 h-12 transition-all" 
                                   style={{ 
                                     color: isSelected ? '#ffffff' : theme.color,
                                     filter: isSelected ? `drop-shadow(0 0 20px ${theme.color})` : 'none'
                                   }} />
                          </div>

                          {/* Alt Kısım: Aksiyon / Durum */}
                          <div className="w-full mt-auto">
                            {isSelected ? (
                              <div className="flex items-center justify-center gap-2 text-white font-black text-[12px] uppercase tracking-widest">
                                <CheckCircle2 className="w-4 h-4" style={{ color: theme.color, filter: `drop-shadow(0 0 8px ${theme.color})` }} />
                                <span>SEÇİLDİ</span>
                              </div>
                            ) : (
                              <div className="w-full py-2 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-colors group-hover:bg-white/[0.05]"
                                   style={{ borderColor: `${theme.color}40`, color: theme.color }}>
                                {m.badge || 'SEÇ'}
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}"""

content = old_pattern.sub(new_block, content)

with open('components/WalletModal.tsx', 'w') as f:
    f.write(content)
