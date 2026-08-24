import re

with open('components/WalletModal.tsx', 'r') as f:
    content = f.read()

old_pattern = re.compile(r'\{currentMethods\.map\(m => \{.*?\n\s*\}\)\}', re.DOTALL)

new_block = """{currentMethods.map(m => {
                      const isSelected = selectedMethod?.id === m.id;
                      const theme = m.theme;

                      // FOTOGERÇEKÇİ 3D KALİTE (GÖRSELDEKİ BİREBİR YAPI)
                      return (
                        <button
                          key={m.id}
                          onClick={() => setSelectedMethod(m)}
                          className={`relative flex flex-col items-center p-6 rounded-[24px] transition-all duration-500 min-h-[220px] w-full group overflow-hidden ${
                            isSelected ? 'scale-[1.03] z-20 shadow-[0_30px_60px_rgba(0,0,0,0.9)]' : 'hover:scale-[1.02] z-10 opacity-60 hover:opacity-100 shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
                          }`}
                          style={{
                            // Derin grenli (grain) ve radial parlama efekti
                            backgroundColor: '#050810',
                            backgroundImage: `radial-gradient(120% 120% at 50% -10%, ${theme.color}60 0%, ${theme.color}10 40%, transparent 100%)`,
                            // Yönlü Cam Yansıması (Sol üstten vuran ışık)
                            borderTop: `1px solid ${isSelected ? theme.color : theme.color + '60'}`,
                            borderLeft: `1px solid ${isSelected ? theme.color + '90' : theme.color + '40'}`,
                            borderRight: `1px solid ${isSelected ? theme.color + '30' : theme.color + '10'}`,
                            borderBottom: `1px solid ${isSelected ? theme.color + '10' : 'transparent'}`,
                            boxShadow: isSelected ? `0 0 40px ${theme.color}50, inset 0 0 40px ${theme.color}30` : `inset 0 0 20px ${theme.color}10`,
                          }}
                        >
                          {/* Noise (Kumlama) Dokusu - Premium Mat Hissiyat İçin */}
                          <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" 
                               style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

                          {/* Üst Kısım: Başlık */}
                          <div className="w-full text-center mt-2 relative z-10">
                            <h4 className="text-[16px] font-black tracking-widest uppercase" 
                                style={{ color: '#ffffff', textShadow: `0 0 15px ${theme.color}` }}>
                              {m.name}
                            </h4>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-white/50 block mt-1.5">
                              {m.id === 'banktransfer' ? 'HIZLI & GÜVENLİ' : m.id === 'crypto' ? 'KRİPTO ÖDEMELERİ' : 'KREDİ / BANKA KARTI'}
                            </span>
                          </div>

                          {/* ORTA KISIM: ÖZEL 3D/FOTOGERÇEKÇİ İKONLAR (Resimdeki gibi) */}
                          <div className={`my-auto py-6 relative z-10 flex items-center justify-center transition-transform duration-700 ${isSelected ? 'scale-110' : 'group-hover:scale-110'}`}>
                             
                             {m.id === 'banktransfer' && (
                               <div className="relative">
                                 {/* Glowing Aura */}
                                 <div className="absolute inset-0 bg-[#3B82F6] blur-[20px] opacity-40 rounded-full"></div>
                                 <Building2 className="w-14 h-14 text-white relative z-10" 
                                            style={{ filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.8)) drop-shadow(0 0 10px rgba(59,130,246,0.8))' }} strokeWidth={1.5} />
                               </div>
                             )}

                             {m.id === 'crypto' && (
                               <div className="flex items-center justify-center">
                                 {/* Ethereum (Gümüş) */}
                                 <div className="w-12 h-12 rounded-full flex items-center justify-center border-2 border-[#E2E8F0]/30 shadow-[0_10px_20px_rgba(0,0,0,0.8)] relative z-0 translate-x-3 bg-gradient-to-br from-[#F8FAFC] to-[#94A3B8]">
                                   <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center bg-gradient-to-br from-[#E2E8F0] to-[#64748B]">
                                     <span className="font-black text-[#1E293B] text-xl drop-shadow-md">Ξ</span>
                                   </div>
                                 </div>
                                 {/* Bitcoin (Altın) - Merkezde ve Önde */}
                                 <div className="w-14 h-14 rounded-full flex items-center justify-center border-2 border-[#FDE047]/50 shadow-[0_15px_30px_rgba(0,0,0,0.9)] relative z-20 bg-gradient-to-br from-[#FEF08A] to-[#D97706]">
                                   <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center bg-gradient-to-br from-[#FDE047] to-[#B45309]">
                                     <span className="font-black text-[#78350F] text-3xl drop-shadow-md">₿</span>
                                   </div>
                                 </div>
                                 {/* Tether (Yeşil) */}
                                 <div className="w-12 h-12 rounded-full flex items-center justify-center border-2 border-[#86EFAC]/30 shadow-[0_10px_20px_rgba(0,0,0,0.8)] relative z-10 -translate-x-3 bg-gradient-to-br from-[#BBF7D0] to-[#059669]">
                                   <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center bg-gradient-to-br from-[#86EFAC] to-[#047857]">
                                     <span className="font-black text-[#022C22] text-xl drop-shadow-md">₮</span>
                                   </div>
                                 </div>
                               </div>
                             )}

                             {m.id === 'creditcard' && (
                               <div className="flex flex-col items-center gap-3">
                                 <div className="flex items-center gap-4">
                                   <span className="font-black italic text-white text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">VISA</span>
                                   <div className="flex -space-x-3 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
                                      <div className="w-7 h-7 rounded-full bg-[#EF4444] mix-blend-screen opacity-90"></div>
                                      <div className="w-7 h-7 rounded-full bg-[#F59E0B] mix-blend-screen opacity-90"></div>
                                   </div>
                                 </div>
                                 <div className="text-[12px] font-mono font-bold tracking-[0.2em] text-white/80 drop-shadow-md">
                                   **** 7890
                                 </div>
                               </div>
                             )}

                          </div>

                          {/* Alt Kısım: Aksiyon */}
                          <div className="w-full mt-auto relative z-10">
                            {isSelected ? (
                              <div className="w-full py-2.5 rounded-xl text-white font-black text-[13px] uppercase tracking-widest text-center shadow-lg"
                                   style={{ backgroundColor: theme.color, boxShadow: `0 0 20px ${theme.color}80, inset 0 2px 4px rgba(255,255,255,0.4)` }}>
                                SEÇİLDİ
                              </div>
                            ) : (
                              <div className="w-full py-2.5 rounded-xl border text-[11px] font-black uppercase tracking-widest text-center transition-colors hover:bg-white/[0.05]"
                                   style={{ borderColor: `${theme.color}50`, color: theme.color, backgroundColor: 'rgba(0,0,0,0.3)' }}>
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
