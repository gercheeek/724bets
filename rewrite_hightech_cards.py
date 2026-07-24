import re

with open('/Users/alex/Desktop/7_24bets-landing-page/components/GuestLanding.tsx', 'r') as f:
    content = f.read()

start_marker = "{/* CATEGORY CARDS */}"
end_marker = "{/* TICKER */}"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

new_cards = """{/* CATEGORY CARDS */}
            <style>{`
                @keyframes scanline {
                    0% { transform: translateY(-10px); opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { transform: translateY(200px); opacity: 0; }
                }
                .animate-scan {
                    animation: scanline 2.5s linear infinite;
                }
                .clip-tech {
                    clip-path: polygon(0 0, 100% 0, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0 100%);
                }
                .clip-tech-inner {
                    clip-path: polygon(0 0, 100% 0, 100% calc(100% - 29px), calc(100% - 29px) 100%, 0 100%);
                }
                .tech-grid {
                    background-image: linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
                    background-size: 20px 20px;
                }
            `}</style>
            
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-10 mb-6">
                
                {/* Casino - High Tech */}
                <div onClick={() => onViewChange('blackjack')} className="group relative w-full h-[320px] md:h-[360px] bg-[#020202] cursor-pointer transition-all duration-700 hover:-translate-y-2 clip-tech drop-shadow-[0_0_20px_rgba(6,182,212,0.1)] hover:drop-shadow-[0_0_30px_rgba(6,182,212,0.4)]">
                    {/* Glowing moving background border trick */}
                    <div className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent_0_340deg,#06b6d4_360deg)] opacity-0 group-hover:opacity-100 animate-[spin_4s_linear_infinite] pointer-events-none"></div>
                    
                    {/* Inner Content Area */}
                    <div className="absolute inset-[1px] bg-[#06090e] flex flex-col z-10 clip-tech-inner">
                        {/* Tech Grid Overlay */}
                        <div className="absolute inset-0 tech-grid pointer-events-none opacity-20"></div>

                        {/* Image Section */}
                        <div className="relative h-[55%] w-full overflow-hidden border-b border-[#06b6d4]/20">
                            <img src="/images/ai-generated/casino_card.jpg" className="w-full h-full object-cover scale-125 group-hover:scale-100 transition-all duration-[1.5s] ease-out opacity-60 group-hover:opacity-90 mix-blend-luminosity group-hover:mix-blend-normal" alt="Casino" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#06090e] to-transparent z-10"></div>
                            
                            {/* Animated Scanline */}
                            <div className="absolute top-0 left-0 w-full h-[2px] bg-[#06b6d4] shadow-[0_0_10px_#06b6d4] opacity-0 group-hover:opacity-100 animate-scan z-20"></div>
                            
                            {/* Tech Badge */}
                            <div className="absolute top-4 left-4 border border-[#06b6d4]/40 bg-[#06b6d4]/10 backdrop-blur-sm px-2.5 py-1 text-[9px] font-mono text-[#06b6d4] uppercase tracking-widest flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                                <div className="w-1.5 h-1.5 bg-[#06b6d4] animate-pulse"></div>
                                SYS.ON // CASINO
                            </div>
                        </div>

                        {/* Tech Footer Section */}
                        <div className="flex-1 flex flex-col justify-end p-6 relative z-20">
                            <h3 className="text-3xl font-black text-white font-['Outfit'] uppercase tracking-tight mb-2 group-hover:text-[#06b6d4] transition-colors duration-500 drop-shadow-[0_0_10px_rgba(6,182,212,0)] group-hover:drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                                Canlı Masa
                            </h3>
                            
                            {/* Loading Bar Effect */}
                            <div className="relative h-[2px] w-full bg-white/10 mb-4 overflow-hidden">
                                <div className="absolute top-0 left-0 h-full w-12 bg-[#06b6d4] shadow-[0_0_10px_#06b6d4] group-hover:w-full transition-all duration-[1s] ease-in-out"></div>
                            </div>
                            
                            <div className="flex items-center justify-between w-full">
                                <div className="text-[9px] text-[#06b6d4]/50 font-mono flex flex-col gap-0.5">
                                    <span className="group-hover:text-[#06b6d4] transition-colors">SECURE_LINK: TRUE</span>
                                    <span>LATENCY: 12ms</span>
                                </div>

                                {/* High Tech Sci-Fi Button */}
                                <div className="relative w-12 h-12 flex items-center justify-center">
                                    {/* Outer dashed ring */}
                                    <div className="absolute inset-0 border-[1.5px] border-dashed border-[#06b6d4]/40 rounded-full opacity-0 group-hover:opacity-100 animate-[spin_6s_linear_infinite]"></div>
                                    {/* Middle solid ring */}
                                    <div className="absolute inset-[3px] border border-[#06b6d4]/20 rounded-full group-hover:scale-90 transition-transform duration-500"></div>
                                    {/* Inner Core */}
                                    <div className="absolute inset-[7px] bg-[#06b6d4] rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.6)] group-hover:scale-110 transition-transform duration-500">
                                        <svg className="w-4 h-4 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Spor Bahisleri - High Tech (#10b981) */}
                <div onClick={() => onViewChange('sports')} className="group relative w-full h-[320px] md:h-[360px] bg-[#020202] cursor-pointer transition-all duration-700 hover:-translate-y-2 clip-tech drop-shadow-[0_0_20px_rgba(16,185,129,0.1)] hover:drop-shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                    <div className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent_0_340deg,#10b981_360deg)] opacity-0 group-hover:opacity-100 animate-[spin_4s_linear_infinite] pointer-events-none"></div>
                    <div className="absolute inset-[1px] bg-[#06090e] flex flex-col z-10 clip-tech-inner">
                        <div className="absolute inset-0 tech-grid pointer-events-none opacity-20"></div>

                        <div className="relative h-[55%] w-full overflow-hidden border-b border-[#10b981]/20">
                            <img src="/images/ai-generated/sports_card.jpg" className="w-full h-full object-cover scale-125 group-hover:scale-100 transition-all duration-[1.5s] ease-out opacity-60 group-hover:opacity-90 mix-blend-luminosity group-hover:mix-blend-normal" alt="Sports" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#06090e] to-transparent z-10"></div>
                            
                            <div className="absolute top-0 left-0 w-full h-[2px] bg-[#10b981] shadow-[0_0_10px_#10b981] opacity-0 group-hover:opacity-100 animate-scan z-20"></div>
                            
                            <div className="absolute top-4 left-4 border border-[#10b981]/40 bg-[#10b981]/10 backdrop-blur-sm px-2.5 py-1 text-[9px] font-mono text-[#10b981] uppercase tracking-widest flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                                <div className="w-1.5 h-1.5 bg-[#10b981] animate-pulse"></div>
                                SYS.ON // SPORTS
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col justify-end p-6 relative z-20">
                            <h3 className="text-3xl font-black text-white font-['Outfit'] uppercase tracking-tight mb-2 group-hover:text-[#10b981] transition-colors duration-500 drop-shadow-[0_0_10px_rgba(16,185,129,0)] group-hover:drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                                Canlı Spor
                            </h3>
                            
                            <div className="relative h-[2px] w-full bg-white/10 mb-4 overflow-hidden">
                                <div className="absolute top-0 left-0 h-full w-12 bg-[#10b981] shadow-[0_0_10px_#10b981] group-hover:w-full transition-all duration-[1s] ease-in-out"></div>
                            </div>
                            
                            <div className="flex items-center justify-between w-full">
                                <div className="text-[9px] text-[#10b981]/50 font-mono flex flex-col gap-0.5">
                                    <span className="group-hover:text-[#10b981] transition-colors">ODDS_SYNC: STABLE</span>
                                    <span>UPTIME: 99.9%</span>
                                </div>

                                <div className="relative w-12 h-12 flex items-center justify-center">
                                    <div className="absolute inset-0 border-[1.5px] border-dashed border-[#10b981]/40 rounded-full opacity-0 group-hover:opacity-100 animate-[spin_6s_linear_infinite]"></div>
                                    <div className="absolute inset-[3px] border border-[#10b981]/20 rounded-full group-hover:scale-90 transition-transform duration-500"></div>
                                    <div className="absolute inset-[7px] bg-[#10b981] rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.6)] group-hover:scale-110 transition-transform duration-500">
                                        <svg className="w-4 h-4 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 724 Orijinal - High Tech (#eab308 yellow) */}
                <div onClick={() => onViewChange('originals')} className="group relative w-full h-[320px] md:h-[360px] bg-[#020202] cursor-pointer transition-all duration-700 hover:-translate-y-2 clip-tech drop-shadow-[0_0_20px_rgba(234,179,8,0.1)] hover:drop-shadow-[0_0_30px_rgba(234,179,8,0.4)]">
                    <div className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent_0_340deg,#eab308_360deg)] opacity-0 group-hover:opacity-100 animate-[spin_4s_linear_infinite] pointer-events-none"></div>
                    <div className="absolute inset-[1px] bg-[#06090e] flex flex-col z-10 clip-tech-inner">
                        <div className="absolute inset-0 tech-grid pointer-events-none opacity-20"></div>

                        <div className="relative h-[55%] w-full overflow-hidden border-b border-yellow-500/20">
                            <img src="/images/ai-generated/originals_card.jpg" className="w-full h-full object-cover scale-125 group-hover:scale-100 transition-all duration-[1.5s] ease-out opacity-60 group-hover:opacity-90 mix-blend-luminosity group-hover:mix-blend-normal" alt="Originals" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#06090e] to-transparent z-10"></div>
                            
                            <div className="absolute top-0 left-0 w-full h-[2px] bg-yellow-500 shadow-[0_0_10px_#eab308] opacity-0 group-hover:opacity-100 animate-scan z-20"></div>
                            
                            <div className="absolute top-4 left-4 border border-yellow-500/40 bg-yellow-500/10 backdrop-blur-sm px-2.5 py-1 text-[9px] font-mono text-yellow-500 uppercase tracking-widest flex items-center gap-2 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                                <div className="w-1.5 h-1.5 bg-yellow-500 animate-pulse"></div>
                                SYS.ON // ORIGINALS
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col justify-end p-6 relative z-20">
                            <h3 className="text-3xl font-black text-white font-['Outfit'] uppercase tracking-tight mb-2 group-hover:text-yellow-500 transition-colors duration-500 drop-shadow-[0_0_10px_rgba(234,179,8,0)] group-hover:drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]">
                                Orijinal Üretim
                            </h3>
                            
                            <div className="relative h-[2px] w-full bg-white/10 mb-4 overflow-hidden">
                                <div className="absolute top-0 left-0 h-full w-12 bg-yellow-500 shadow-[0_0_10px_#eab308] group-hover:w-full transition-all duration-[1s] ease-in-out"></div>
                            </div>
                            
                            <div className="flex items-center justify-between w-full">
                                <div className="text-[9px] text-yellow-500/50 font-mono flex flex-col gap-0.5">
                                    <span className="group-hover:text-yellow-500 transition-colors">ALGORITHM: FAIR</span>
                                    <span>RTP: 99.0%</span>
                                </div>

                                <div className="relative w-12 h-12 flex items-center justify-center">
                                    <div className="absolute inset-0 border-[1.5px] border-dashed border-yellow-500/40 rounded-full opacity-0 group-hover:opacity-100 animate-[spin_6s_linear_infinite]"></div>
                                    <div className="absolute inset-[3px] border border-yellow-500/20 rounded-full group-hover:scale-90 transition-transform duration-500"></div>
                                    <div className="absolute inset-[7px] bg-yellow-500 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(234,179,8,0.6)] group-hover:scale-110 transition-transform duration-500">
                                        <svg className="w-4 h-4 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
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
