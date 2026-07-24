import re

with open('/Users/alex/Desktop/7_24bets-landing-page/components/GuestLanding.tsx', 'r') as f:
    content = f.read()

start_marker = "{/* Casino - Extreme Tech */}"
end_marker = "{/* TICKER */}"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

new_cards = """{/* Casino - Extreme Tech Full Image */}
                <div onClick={() => onViewChange('blackjack')} className="group relative w-full h-[320px] md:h-[380px] bg-[#020202] cursor-pointer transition-all duration-[800ms] hover:-translate-y-3 hover:rotate-y-[5deg] clip-tech drop-shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:drop-shadow-[0_0_40px_rgba(6,182,212,0.6)]">
                    <div className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent_0_340deg,#06b6d4_360deg)] opacity-0 group-hover:opacity-100 animate-[spin_3s_linear_infinite] pointer-events-none"></div>
                    
                    <div className="absolute inset-[1px] bg-[#06090e] flex flex-col z-10 clip-tech-inner overflow-hidden">
                        
                        <img src="/images/ai-generated/casino_card.jpg" className="absolute inset-0 w-full h-full object-cover scale-125 group-hover:scale-100 transition-all duration-[1.5s] ease-out opacity-50 group-hover:opacity-90 mix-blend-luminosity group-hover:mix-blend-normal z-0" alt="Casino" />
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-[#06090e] via-[#06090e]/80 to-transparent z-10 pointer-events-none"></div>
                        <div className="absolute inset-0 tech-grid pointer-events-none opacity-30 z-10"></div>
                        
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:animate-holo skew-x-[-20deg] w-1/2 z-20 mix-blend-overlay pointer-events-none"></div>
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-[#06b6d4] shadow-[0_0_15px_#06b6d4] opacity-0 group-hover:opacity-100 animate-scan z-20 pointer-events-none"></div>

                        <div className="absolute top-4 left-4 border border-[#06b6d4]/50 bg-[#06b6d4]/10 backdrop-blur-md px-2.5 py-1 text-[10px] font-mono text-[#06b6d4] tracking-widest flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] z-30">
                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse-fast"></div>
                            SYS.ON <span className="text-white/50">_CASINO</span>
                        </div>
                        <div className="absolute top-2 right-2 w-16 h-1 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSIyIiBoZWlnaHQ9IjQiIGZpbGw9IiM2YjcyODAiLz48L3N2Zz4=')] opacity-50 z-30"></div>
                        <div className="absolute top-6 right-2 text-[6px] font-mono text-[#06b6d4]/80 z-30">v1.4.08</div>
                        
                        <div className="absolute top-1/2 left-2 flex flex-col gap-1 z-30 -translate-y-1/2">
                            <div className="w-1 h-4 bg-[#06b6d4]/30 group-hover:bg-[#06b6d4] transition-colors"></div>
                            <div className="w-1 h-2 bg-[#06b6d4]/30 group-hover:bg-[#06b6d4] transition-colors delay-75"></div>
                            <div className="w-1 h-6 bg-[#06b6d4]/30 group-hover:bg-[#06b6d4] transition-colors delay-150"></div>
                        </div>

                        <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end z-30">
                            <h3 className="text-4xl md:text-5xl font-black text-white font-['Outfit'] uppercase tracking-tighter mb-2 group-hover:text-[#06b6d4] transition-colors duration-500 drop-shadow-[0_0_10px_rgba(6,182,212,0)] group-hover:drop-shadow-[0_0_15px_rgba(6,182,212,0.8)] animate-glitch origin-left">
                                Canlı Masa
                            </h3>
                            
                            <div className="relative h-[3px] w-full bg-white/10 mb-4 overflow-hidden rounded-full">
                                <div className="absolute top-0 left-0 h-full w-12 bg-[#06b6d4] shadow-[0_0_15px_#06b6d4] group-hover:w-full transition-all duration-[1.2s] ease-in-out"></div>
                            </div>
                            
                            <div className="flex items-center justify-between w-full">
                                <div className="text-[10px] text-[#06b6d4]/70 font-mono flex flex-col gap-1">
                                    <span className="group-hover:text-[#06b6d4] transition-colors flex items-center gap-1">
                                        <svg className="w-3 h-3 group-hover:animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                                        SECURE_LINK: <span className="text-green-400 font-bold ml-1 drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]">TRUE</span>
                                    </span>
                                    <span className="hud-brackets text-gray-400">LATENCY: 12ms</span>
                                </div>

                                <div className="relative w-14 h-14 flex items-center justify-center">
                                    <div className="absolute inset-0 border-[2px] border-dashed border-[#06b6d4]/60 rounded-full opacity-0 group-hover:opacity-100 animate-[spin_5s_linear_infinite]"></div>
                                    <div className="absolute inset-0 border-[1px] border-dotted border-white/30 rounded-full opacity-0 group-hover:opacity-100 animate-[spin_3s_linear_infinite_reverse]"></div>
                                    <div className="absolute inset-[4px] border border-[#06b6d4]/40 rounded-full group-hover:scale-90 transition-transform duration-500 bg-black/40 backdrop-blur-sm"></div>
                                    <div className="absolute inset-[8px] bg-[#06b6d4] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.8)] group-hover:scale-110 transition-transform duration-500 cursor-pointer">
                                        <svg className="w-5 h-5 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Spor Bahisleri - Extreme Tech Full Image (#10b981) */}
                <div onClick={() => onViewChange('sports')} className="group relative w-full h-[320px] md:h-[380px] bg-[#020202] cursor-pointer transition-all duration-[800ms] hover:-translate-y-3 hover:rotate-y-[5deg] clip-tech drop-shadow-[0_0_20px_rgba(16,185,129,0.15)] hover:drop-shadow-[0_0_40px_rgba(16,185,129,0.6)]">
                    <div className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent_0_340deg,#10b981_360deg)] opacity-0 group-hover:opacity-100 animate-[spin_3s_linear_infinite] pointer-events-none"></div>
                    
                    <div className="absolute inset-[1px] bg-[#06090e] flex flex-col z-10 clip-tech-inner overflow-hidden">
                        
                        <img src="/images/ai-generated/sports_card.jpg" className="absolute inset-0 w-full h-full object-cover scale-125 group-hover:scale-100 transition-all duration-[1.5s] ease-out opacity-50 group-hover:opacity-90 mix-blend-luminosity group-hover:mix-blend-normal z-0" alt="Sports" />
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-[#06090e] via-[#06090e]/80 to-transparent z-10 pointer-events-none"></div>
                        <div className="absolute inset-0 tech-grid pointer-events-none opacity-30 z-10"></div>
                        
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:animate-holo skew-x-[-20deg] w-1/2 z-20 mix-blend-overlay pointer-events-none"></div>
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-[#10b981] shadow-[0_0_15px_#10b981] opacity-0 group-hover:opacity-100 animate-scan z-20 pointer-events-none"></div>

                        <div className="absolute top-4 left-4 border border-[#10b981]/50 bg-[#10b981]/10 backdrop-blur-md px-2.5 py-1 text-[10px] font-mono text-[#10b981] tracking-widest flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] z-30">
                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse-fast"></div>
                            SYS.ON <span className="text-white/50">_SPORTS</span>
                        </div>
                        <div className="absolute top-2 right-2 w-16 h-1 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSIyIiBoZWlnaHQ9IjQiIGZpbGw9IiM2YjcyODAiLz48L3N2Zz4=')] opacity-50 z-30"></div>
                        <div className="absolute top-6 right-2 text-[6px] font-mono text-[#10b981]/80 z-30">v1.4.08</div>
                        
                        <div className="absolute top-1/2 left-2 flex flex-col gap-1 z-30 -translate-y-1/2">
                            <div className="w-1 h-4 bg-[#10b981]/30 group-hover:bg-[#10b981] transition-colors"></div>
                            <div className="w-1 h-2 bg-[#10b981]/30 group-hover:bg-[#10b981] transition-colors delay-75"></div>
                            <div className="w-1 h-6 bg-[#10b981]/30 group-hover:bg-[#10b981] transition-colors delay-150"></div>
                        </div>

                        <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end z-30">
                            <h3 className="text-4xl md:text-5xl font-black text-white font-['Outfit'] uppercase tracking-tighter mb-2 group-hover:text-[#10b981] transition-colors duration-500 drop-shadow-[0_0_10px_rgba(16,185,129,0)] group-hover:drop-shadow-[0_0_15px_rgba(16,185,129,0.8)] animate-glitch origin-left">
                                Canlı Spor
                            </h3>
                            
                            <div className="relative h-[3px] w-full bg-white/10 mb-4 overflow-hidden rounded-full">
                                <div className="absolute top-0 left-0 h-full w-12 bg-[#10b981] shadow-[0_0_15px_#10b981] group-hover:w-full transition-all duration-[1.2s] ease-in-out"></div>
                            </div>
                            
                            <div className="flex items-center justify-between w-full">
                                <div className="text-[10px] text-[#10b981]/70 font-mono flex flex-col gap-1">
                                    <span className="group-hover:text-[#10b981] transition-colors flex items-center gap-1">
                                        <svg className="w-3 h-3 group-hover:animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                                        ODDS_SYNC: <span className="text-green-400 font-bold ml-1 drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]">STABLE</span>
                                    </span>
                                    <span className="hud-brackets text-gray-400">UPTIME: 99.9%</span>
                                </div>

                                <div className="relative w-14 h-14 flex items-center justify-center">
                                    <div className="absolute inset-0 border-[2px] border-dashed border-[#10b981]/60 rounded-full opacity-0 group-hover:opacity-100 animate-[spin_5s_linear_infinite]"></div>
                                    <div className="absolute inset-0 border-[1px] border-dotted border-white/30 rounded-full opacity-0 group-hover:opacity-100 animate-[spin_3s_linear_infinite_reverse]"></div>
                                    <div className="absolute inset-[4px] border border-[#10b981]/40 rounded-full group-hover:scale-90 transition-transform duration-500 bg-black/40 backdrop-blur-sm"></div>
                                    <div className="absolute inset-[8px] bg-[#10b981] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.8)] group-hover:scale-110 transition-transform duration-500 cursor-pointer">
                                        <svg className="w-5 h-5 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 724 Orijinal - Extreme Tech Full Image (#eab308 yellow) */}
                <div onClick={() => onViewChange('originals')} className="group relative w-full h-[320px] md:h-[380px] bg-[#020202] cursor-pointer transition-all duration-[800ms] hover:-translate-y-3 hover:rotate-y-[5deg] clip-tech drop-shadow-[0_0_20px_rgba(234,179,8,0.15)] hover:drop-shadow-[0_0_40px_rgba(234,179,8,0.6)]">
                    <div className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent_0_340deg,#eab308_360deg)] opacity-0 group-hover:opacity-100 animate-[spin_3s_linear_infinite] pointer-events-none"></div>
                    
                    <div className="absolute inset-[1px] bg-[#06090e] flex flex-col z-10 clip-tech-inner overflow-hidden">
                        
                        <img src="/images/ai-generated/originals_card.jpg" className="absolute inset-0 w-full h-full object-cover scale-125 group-hover:scale-100 transition-all duration-[1.5s] ease-out opacity-50 group-hover:opacity-90 mix-blend-luminosity group-hover:mix-blend-normal z-0" alt="Originals" />
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-[#06090e] via-[#06090e]/80 to-transparent z-10 pointer-events-none"></div>
                        <div className="absolute inset-0 tech-grid pointer-events-none opacity-30 z-10"></div>
                        
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:animate-holo skew-x-[-20deg] w-1/2 z-20 mix-blend-overlay pointer-events-none"></div>
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-yellow-500 shadow-[0_0_15px_#eab308] opacity-0 group-hover:opacity-100 animate-scan z-20 pointer-events-none"></div>

                        <div className="absolute top-4 left-4 border border-yellow-500/50 bg-yellow-500/10 backdrop-blur-md px-2.5 py-1 text-[10px] font-mono text-yellow-500 tracking-widest flex items-center gap-2 shadow-[0_0_20px_rgba(234,179,8,0.3)] z-30">
                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse-fast"></div>
                            SYS.ON <span className="text-white/50">_ORIGINAL</span>
                        </div>
                        <div className="absolute top-2 right-2 w-16 h-1 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSIyIiBoZWlnaHQ9IjQiIGZpbGw9IiM2YjcyODAiLz48L3N2Zz4=')] opacity-50 z-30"></div>
                        <div className="absolute top-6 right-2 text-[6px] font-mono text-yellow-500/80 z-30">v1.4.08</div>
                        
                        <div className="absolute top-1/2 left-2 flex flex-col gap-1 z-30 -translate-y-1/2">
                            <div className="w-1 h-4 bg-yellow-500/30 group-hover:bg-yellow-500 transition-colors"></div>
                            <div className="w-1 h-2 bg-yellow-500/30 group-hover:bg-yellow-500 transition-colors delay-75"></div>
                            <div className="w-1 h-6 bg-yellow-500/30 group-hover:bg-yellow-500 transition-colors delay-150"></div>
                        </div>

                        <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end z-30">
                            <h3 className="text-4xl md:text-5xl font-black text-white font-['Outfit'] uppercase tracking-tighter mb-2 group-hover:text-yellow-500 transition-colors duration-500 drop-shadow-[0_0_10px_rgba(234,179,8,0)] group-hover:drop-shadow-[0_0_15px_rgba(234,179,8,0.8)] animate-glitch origin-left">
                                Özel Üretim
                            </h3>
                            
                            <div className="relative h-[3px] w-full bg-white/10 mb-4 overflow-hidden rounded-full">
                                <div className="absolute top-0 left-0 h-full w-12 bg-yellow-500 shadow-[0_0_15px_#eab308] group-hover:w-full transition-all duration-[1.2s] ease-in-out"></div>
                            </div>
                            
                            <div className="flex items-center justify-between w-full">
                                <div className="text-[10px] text-yellow-500/70 font-mono flex flex-col gap-1">
                                    <span className="group-hover:text-yellow-500 transition-colors flex items-center gap-1">
                                        <svg className="w-3 h-3 group-hover:animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                                        ALGORITHM: <span className="text-green-400 font-bold ml-1 drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]">FAIR</span>
                                    </span>
                                    <span className="hud-brackets text-gray-400">RTP: 99.0%</span>
                                </div>

                                <div className="relative w-14 h-14 flex items-center justify-center">
                                    <div className="absolute inset-0 border-[2px] border-dashed border-yellow-500/60 rounded-full opacity-0 group-hover:opacity-100 animate-[spin_5s_linear_infinite]"></div>
                                    <div className="absolute inset-0 border-[1px] border-dotted border-white/30 rounded-full opacity-0 group-hover:opacity-100 animate-[spin_3s_linear_infinite_reverse]"></div>
                                    <div className="absolute inset-[4px] border border-yellow-500/40 rounded-full group-hover:scale-90 transition-transform duration-500 bg-black/40 backdrop-blur-sm"></div>
                                    <div className="absolute inset-[8px] bg-yellow-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(234,179,8,0.8)] group-hover:scale-110 transition-transform duration-500 cursor-pointer">
                                        <svg className="w-5 h-5 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
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
