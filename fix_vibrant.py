import re

with open('components/WalletModal.tsx', 'r') as f:
    content = f.read()

old_block = """                    {currentMethods.map(m => {
                      const Icon = m.icon;
                      const isSelected = selectedMethod?.id === m.id;
                      const theme = m.theme;
                      const isPremium = m.isPremium;
                      const isPlatinum = m.isPlatinum;
                      const isCorporate = m.isCorporate;

                      // Fine-crafted individual card logic
                      return (
                        <button
                          key={m.id}
                          onClick={() => setSelectedMethod(m)}
                          className={`relative flex flex-col p-3.5 rounded-[14px] transition-all duration-500 text-left overflow-hidden group min-h-[90px] ${
                            isSelected 
                              ? `scale-[1.02] shadow-[0_15px_40px_${theme.glow}] z-20 border border-[${theme.color}]/60` 
                              : 'hover:scale-[1.01] hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] z-10 border border-white/[0.08]'
                          }`}
                        >
                          {/* BASE GLASS BG - Much richer unselected state */}
                          <div className={`absolute inset-0 z-0 transition-colors duration-500 ${
                            isSelected ? `bg-[${theme.color}]/10` : 'bg-white/[0.03] hover:bg-white/[0.06]'
                          }`}></div>
                          
                          {/* DYNAMIC AURA & SHEEN */}
                          <div className={`absolute inset-0 bg-gradient-to-br from-[${theme.color}]/20 via-transparent to-transparent z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 mix-blend-screen`}></div>
                          {isSelected && <div className={`absolute -top-1/2 -right-1/2 w-full h-full bg-[${theme.color}]/20 blur-[50px] rounded-full z-0 pointer-events-none`}></div>}
                          
                          {/* TOP HIGHLIGHT (Glass Edge) */}
                          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/[0.15] to-transparent z-10"></div>

                          {/* CONTENT */}
                          <div className="relative z-20 flex flex-col h-full w-full">
                            <div className="flex justify-between items-start w-full mb-auto">
                              
                              {/* CRAFTED EMBOSSED ICON */}
                              <div className={`w-7 h-7 rounded-[10px] flex items-center justify-center shadow-lg transition-transform duration-500 ${isSelected ? 'scale-110' : ''}`}
                                   style={{ 
                                     background: isSelected ? `linear-gradient(135deg, ${theme.color} 0%, rgba(255,255,255,0.2) 100%)` : 'rgba(255,255,255,0.08)',
                                     boxShadow: isSelected ? `inset 0 1px 0 rgba(255,255,255,0.4), 0 4px 15px ${theme.glow}` : 'inset 0 1px 0 rgba(255,255,255,0.08)'
                                   }}>
                                <Icon strokeWidth={2.5} className={`w-3.5 h-3.5 transition-colors ${isSelected ? 'text-white' : 'text-white/90 group-hover:text-white'}`} />
                              </div>
                              
                              {/* ELITE PILL BADGE / CHECKMARK */}
                              {isSelected ? (
                                <div className="flex items-center justify-center w-6 h-6 rounded-full shadow-lg animate-in zoom-in duration-300"
                                     style={{ background: `linear-gradient(135deg, ${theme.color} 0%, rgba(0,0,0,0.2) 100%)`, boxShadow: `0 0 15px ${theme.glow}` }}>
                                  <CheckCircle2 className="w-4 h-4 text-white" strokeWidth={3} />
                                </div>
                              ) : m.badge ? (
                                <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded tracking-widest border border-white/[0.05] bg-white/[0.05] text-white/70 shadow-sm border-white/[0.1] backdrop-blur-md transition-colors group-hover:text-white/60`}>
                                  {m.badge}
                                </span>
                              ) : null}
                            </div>
                            
                            <div className="mt-2.5">
                              <div className={`text-[13px] font-bold mb-1 tracking-wide drop-shadow-sm transition-colors ${
                                isSelected ? 'text-white' : 'text-white/90 group-hover:text-white'
                              }`}>
                                {m.name}
                              </div>
                              <div className={`text-[9.5px] font-semibold uppercase tracking-wider transition-colors ${
                                isSelected ? `text-[${theme.color}]` : 'text-white/50 group-hover:text-white/70'
                              }`}>
                                LİMİT: {m.min}₺ - {m.max >= 1000000 ? '1M' : m.max/1000 + 'K'}
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}"""

new_block = """                    {currentMethods.map(m => {
                      const Icon = m.icon;
                      const isSelected = selectedMethod?.id === m.id;
                      const theme = m.theme;
                      const isPremium = m.isPremium;
                      const isPlatinum = m.isPlatinum;
                      const isCorporate = m.isCorporate;

                      // Fine-crafted individual card logic (VIBRANT)
                      return (
                        <button
                          key={m.id}
                          onClick={() => setSelectedMethod(m)}
                          className={`relative flex flex-col p-3.5 rounded-[14px] transition-all duration-500 text-left overflow-hidden group min-h-[90px] ${
                            isSelected 
                              ? `scale-[1.02] shadow-[0_15px_40px_${theme.glow}] z-20` 
                              : 'hover:scale-[1.01] hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] z-10'
                          }`}
                          style={{
                            border: `1px solid ${isSelected ? theme.color : theme.color + '30'}`
                          }}
                        >
                          {/* BASE GLASS BG - Vibrant state */}
                          <div className={`absolute inset-0 z-0 transition-colors duration-500`}
                               style={{ backgroundColor: isSelected ? `${theme.color}20` : `${theme.color}0D` }}></div>
                          
                          {/* DYNAMIC AURA & SHEEN */}
                          <div className={`absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 mix-blend-screen pointer-events-none`}
                               style={{ backgroundImage: `linear-gradient(to bottom right, ${theme.color}30, transparent)` }}></div>
                          {isSelected && <div className={`absolute -top-1/2 -right-1/2 w-full h-full blur-[50px] rounded-full z-0 pointer-events-none`}
                                              style={{ backgroundColor: `${theme.color}20` }}></div>}
                          
                          {/* TOP HIGHLIGHT (Glass Edge) */}
                          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/[0.15] to-transparent z-10"></div>

                          {/* CONTENT */}
                          <div className="relative z-20 flex flex-col h-full w-full">
                            <div className="flex justify-between items-start w-full mb-auto">
                              
                              {/* CRAFTED EMBOSSED ICON */}
                              <div className={`w-7 h-7 rounded-[10px] flex items-center justify-center shadow-lg transition-transform duration-500 ${isSelected ? 'scale-110' : ''}`}
                                   style={{ 
                                     background: isSelected ? `linear-gradient(135deg, ${theme.color} 0%, rgba(255,255,255,0.2) 100%)` : `${theme.color}20`,
                                     boxShadow: isSelected ? `inset 0 1px 0 rgba(255,255,255,0.4), 0 4px 15px ${theme.glow}` : `inset 0 1px 0 rgba(255,255,255,0.1)`
                                   }}>
                                <Icon strokeWidth={2.5} className={`w-3.5 h-3.5 transition-colors`} style={{ color: isSelected ? '#fff' : theme.color }} />
                              </div>
                              
                              {/* ELITE PILL BADGE / CHECKMARK */}
                              {isSelected ? (
                                <div className="flex items-center justify-center w-6 h-6 rounded-full shadow-lg animate-in zoom-in duration-300"
                                     style={{ background: `linear-gradient(135deg, ${theme.color} 0%, rgba(0,0,0,0.2) 100%)`, boxShadow: `0 0 15px ${theme.glow}` }}>
                                  <CheckCircle2 className="w-4 h-4 text-white" strokeWidth={3} />
                                </div>
                              ) : m.badge ? (
                                <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded tracking-widest shadow-sm backdrop-blur-md transition-colors`}
                                      style={{ backgroundColor: `${theme.color}15`, color: theme.color, border: `1px solid ${theme.color}30` }}>
                                  {m.badge}
                                </span>
                              ) : null}
                            </div>
                            
                            <div className="mt-2.5">
                              <div className={`text-[13px] font-bold mb-1 tracking-wide drop-shadow-sm transition-colors ${
                                isSelected ? 'text-white' : 'text-white/90 group-hover:text-white'
                              }`}>
                                {m.name}
                              </div>
                              <div className={`text-[9.5px] font-semibold uppercase tracking-wider transition-colors`}
                                   style={{ color: isSelected ? theme.color : `${theme.color}A0` }}>
                                LİMİT: {m.min}₺ - {m.max >= 1000000 ? '1M' : m.max/1000 + 'K'}
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}"""

content = content.replace(old_block, new_block)

with open('components/WalletModal.tsx', 'w') as f:
    f.write(content)
