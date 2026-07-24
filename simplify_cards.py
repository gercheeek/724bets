import re

with open('/Users/alex/Desktop/7_24bets-landing-page/components/GuestLanding.tsx', 'r') as f:
    content = f.read()

start_marker = "{/* CATEGORY CARDS */}"
end_marker = "{/* TICKER */}"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

new_cards = """{/* CATEGORY CARDS */}
            <style>{`
                .clip-tech {
                    clip-path: polygon(0 0, 100% 0, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0 100%);
                }
                .clip-tech-inner {
                    clip-path: polygon(0 0, 100% 0, 100% calc(100% - 29px), calc(100% - 29px) 100%, 0 100%);
                }
            `}</style>
            
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-10 mb-6 perspective-[1000px]">
                
                {/* Casino - Minimal Premium */}
                <div onClick={() => onViewChange('blackjack')} className="group relative w-full h-[320px] md:h-[380px] bg-[#020202] cursor-pointer transition-all duration-[800ms] hover:-translate-y-3 hover:rotate-y-[5deg] clip-tech drop-shadow-[0_0_20px_rgba(6,182,212,0.1)] hover:drop-shadow-[0_0_40px_rgba(6,182,212,0.4)]">
                    
                    <div className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent_0_340deg,#06b6d4_360deg)] opacity-0 group-hover:opacity-60 animate-[spin_4s_linear_infinite] pointer-events-none"></div>
                    
                    <div className="absolute inset-[1px] bg-[#05070a] flex flex-col z-10 clip-tech-inner overflow-hidden">
                        
                        <img src="/images/ai-generated/casino_card.jpg" className="absolute inset-0 w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-[1.5s] ease-out opacity-40 group-hover:opacity-80 mix-blend-luminosity group-hover:mix-blend-normal z-0" alt="Casino" />
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-[#05070a] via-[#05070a]/60 to-transparent z-10 pointer-events-none"></div>
                        
                        <div className="absolute top-5 left-5 bg-black/40 backdrop-blur-md border border-white/5 rounded-full px-4 py-2 flex items-center gap-2 z-30">
                            <div className="w-2 h-2 bg-[#06b6d4] rounded-full shadow-[0_0_8px_#06b6d4]"></div>
                            <span className="text-[10px] font-bold text-white uppercase tracking-widest">Canlı Masalar</span>
                        </div>

                        <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col justify-end z-30">
                            <h3 className="text-4xl md:text-5xl font-extrabold font-['Outfit'] uppercase tracking-[0.1em] mb-1 text-white group-hover:text-[#06b6d4] transition-colors duration-500 drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]">
                                CASINO
                            </h3>
                            
                            <div className="flex items-center justify-between w-full mt-4">
                                <div className="text-sm font-medium text-gray-400 group-hover:text-gray-200 transition-colors">
                                    Gerçek Krupiyeler
                                </div>

                                <div className="relative w-14 h-14 flex items-center justify-center">
                                    <div className="absolute inset-0 border border-white/10 rounded-full group-hover:border-[#06b6d4]/40 transition-colors duration-500"></div>
                                    <div className="absolute inset-[6px] bg-white/5 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-[#06b6d4] shadow-lg group-hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] transition-all duration-500 cursor-pointer group-hover:scale-110">
                                        <svg className="w-5 h-5 text-white group-hover:text-black ml-0.5 transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Spor - Minimal Premium (#10b981) */}
                <div onClick={() => onViewChange('sports')} className="group relative w-full h-[320px] md:h-[380px] bg-[#020202] cursor-pointer transition-all duration-[800ms] hover:-translate-y-3 hover:rotate-y-[5deg] clip-tech drop-shadow-[0_0_20px_rgba(16,185,129,0.1)] hover:drop-shadow-[0_0_40px_rgba(16,185,129,0.4)]">
                    
                    <div className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent_0_340deg,#10b981_360deg)] opacity-0 group-hover:opacity-60 animate-[spin_4s_linear_infinite] pointer-events-none"></div>
                    
                    <div className="absolute inset-[1px] bg-[#05070a] flex flex-col z-10 clip-tech-inner overflow-hidden">
                        
                        <img src="/images/ai-generated/sports_card.jpg" className="absolute inset-0 w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-[1.5s] ease-out opacity-40 group-hover:opacity-80 mix-blend-luminosity group-hover:mix-blend-normal z-0" alt="Spor" />
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-[#05070a] via-[#05070a]/60 to-transparent z-10 pointer-events-none"></div>
                        
                        <div className="absolute top-5 left-5 bg-black/40 backdrop-blur-md border border-white/5 rounded-full px-4 py-2 flex items-center gap-2 z-30">
                            <div className="w-2 h-2 bg-[#10b981] rounded-full shadow-[0_0_8px_#10b981]"></div>
                            <span className="text-[10px] font-bold text-white uppercase tracking-widest">Yüksek Oranlar</span>
                        </div>

                        <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col justify-end z-30">
                            <h3 className="text-4xl md:text-5xl font-extrabold font-['Outfit'] uppercase tracking-[0.1em] mb-1 text-white group-hover:text-[#10b981] transition-colors duration-500 drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]">
                                SPOR
                            </h3>
                            
                            <div className="flex items-center justify-between w-full mt-4">
                                <div className="text-sm font-medium text-gray-400 group-hover:text-gray-200 transition-colors">
                                    Canlı Bahisler
                                </div>

                                <div className="relative w-14 h-14 flex items-center justify-center">
                                    <div className="absolute inset-0 border border-white/10 rounded-full group-hover:border-[#10b981]/40 transition-colors duration-500"></div>
                                    <div className="absolute inset-[6px] bg-white/5 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-[#10b981] shadow-lg group-hover:shadow-[0_0_20px_rgba(16,185,129,0.6)] transition-all duration-500 cursor-pointer group-hover:scale-110">
                                        <svg className="w-5 h-5 text-white group-hover:text-black ml-0.5 transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 724 Orijinal - Minimal Premium (#eab308) */}
                <div onClick={() => onViewChange('originals')} className="group relative w-full h-[320px] md:h-[380px] bg-[#020202] cursor-pointer transition-all duration-[800ms] hover:-translate-y-3 hover:rotate-y-[5deg] clip-tech drop-shadow-[0_0_20px_rgba(234,179,8,0.1)] hover:drop-shadow-[0_0_40px_rgba(234,179,8,0.4)]">
                    
                    <div className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent_0_340deg,#eab308_360deg)] opacity-0 group-hover:opacity-60 animate-[spin_4s_linear_infinite] pointer-events-none"></div>
                    
                    <div className="absolute inset-[1px] bg-[#05070a] flex flex-col z-10 clip-tech-inner overflow-hidden">
                        
                        <img src="/images/ai-generated/originals_card.jpg" className="absolute inset-0 w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-[1.5s] ease-out opacity-40 group-hover:opacity-80 mix-blend-luminosity group-hover:mix-blend-normal z-0" alt="Orijinal" />
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-[#05070a] via-[#05070a]/60 to-transparent z-10 pointer-events-none"></div>
                        
                        <div className="absolute top-5 left-5 bg-black/40 backdrop-blur-md border border-white/5 rounded-full px-4 py-2 flex items-center gap-2 z-30">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full shadow-[0_0_8px_#eab308]"></div>
                            <span className="text-[10px] font-bold text-white uppercase tracking-widest">Özel Üretim</span>
                        </div>

                        <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col justify-end z-30">
                            <h3 className="text-4xl md:text-5xl font-extrabold font-['Outfit'] uppercase tracking-[0.1em] mb-1 text-white group-hover:text-yellow-500 transition-colors duration-500 drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]">
                                724 ORİJİNAL
                            </h3>
                            
                            <div className="flex items-center justify-between w-full mt-4">
                                <div className="text-sm font-medium text-gray-400 group-hover:text-gray-200 transition-colors">
                                    Özel Algoritmalar
                                </div>

                                <div className="relative w-14 h-14 flex items-center justify-center">
                                    <div className="absolute inset-0 border border-white/10 rounded-full group-hover:border-yellow-500/40 transition-colors duration-500"></div>
                                    <div className="absolute inset-[6px] bg-white/5 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-yellow-500 shadow-lg group-hover:shadow-[0_0_20px_rgba(234,179,8,0.6)] transition-all duration-500 cursor-pointer group-hover:scale-110">
                                        <svg className="w-5 h-5 text-white group-hover:text-black ml-0.5 transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
"""

if start_idx != -1 and end_idx != -1:
    content = content[:start_idx] + new_cards + content[end_idx:]
    with open('/Users/alex/Desktop/7_24bets-landing-page/components/GuestLanding.tsx', 'w') as f:
        f.write(content)
