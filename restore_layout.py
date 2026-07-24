import re

with open('/Users/alex/Desktop/7_24bets-landing-page/components/GuestLanding.tsx', 'r') as f:
    content = f.read()

new_hero = """{/* HERO BANNER - ULTRA LUXURY (PREMIUM CRT EFFECT) */}
            <div className="w-full relative rounded-2xl overflow-hidden bg-[#020202] min-h-[200px] md:min-h-[280px] lg:min-h-[320px] shadow-[0_20px_60px_rgba(0,0,0,0.9)] border border-white/5 group flex flex-col items-center justify-center p-8 text-center crt-premium-container">
                
                {/* TV Background Layers */}
                <div className="absolute inset-0 pointer-events-none z-0">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#06b6d4]/15 to-[#10b981]/15 blur-[100px] rounded-full mix-blend-screen"></div>
                    
                    {/* SVG Noise Overlay (Ultra Realistic Grain) */}
                    <div className="noise-overlay absolute inset-0 opacity-[0.12] mix-blend-overlay"></div>
                    
                    {/* Micro Scanlines Overlay */}
                    <div className="absolute inset-0 opacity-30 mix-blend-overlay" style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 2px, rgba(0,0,0,1) 2px, rgba(0,0,0,1) 3px)' }}></div>
                    
                    {/* Slow scrolling CRT bar */}
                    <div className="absolute inset-0 h-[30%] bg-gradient-to-b from-transparent via-white/[0.03] to-transparent opacity-60 mix-blend-overlay animate-[scanline-scroll_12s_linear_infinite]"></div>
                    
                    {/* Deep CRT Vignette */}
                    <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,1)]"></div>
                </div>

                <div className="relative z-10">
                    <h1 className="text-[24px] sm:text-[32px] lg:text-[44px] font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 leading-tight tracking-tight font-['Outfit'] drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] text-glitch-premium">
                        Premium Casino Deneyimine Hoş Geldiniz
                    </h1>
                    <p className="text-xs md:text-base font-medium max-w-[600px] text-gray-400 drop-shadow-md text-glitch-premium mt-4" style={{animationDelay: '0.5s'}}>
                        Ayrıcalıklı bahis seçenekleri, devasa ödüller ve kesintisiz canlı heyecan 724Bets'te sizi bekliyor.
                    </p>
                    <div className="mt-8">
                        <button onClick={() => onViewChange('sports')} className="group/btn relative overflow-hidden bg-[#10b981] hover:bg-[#059669] text-black font-bold text-sm md:text-base px-8 py-3.5 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.6)] transition-all duration-300">
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out"></div>
                            <span className="relative z-10">Avantajları Keşfet</span>
                        </button>
                    </div>
                </div>
            </div>"""

new_cards = """            {/* CATEGORY CARDS */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-10 mb-6 perspective-[1000px]">
                
                {/* Casino - Minimal Premium (#06b6d4) */}
                <div onClick={() => onViewChange('blackjack')} className="group relative w-full h-[320px] md:h-[380px] bg-[#020202] cursor-pointer transition-all duration-[800ms] hover:-translate-y-3 hover:rotate-y-[5deg] clip-tech drop-shadow-[0_0_20px_rgba(6,182,212,0.1)] hover:drop-shadow-[0_0_40px_rgba(6,182,212,0.4)]">
                    <div className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent_0_340deg,#06b6d4_360deg)] opacity-0 group-hover:opacity-60 animate-[spin_4s_linear_infinite] pointer-events-none"></div>
                    <div className="absolute inset-[1px] bg-[#05070a] flex flex-col z-10 clip-tech-inner overflow-hidden">
                        
                        <img src="/images/ai-generated/casino_card.jpg" className="absolute inset-0 w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-[1.5s] ease-out opacity-40 group-hover:opacity-80 mix-blend-luminosity group-hover:mix-blend-normal z-0" alt="Casino" />
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-[#05070a] via-[#05070a]/60 to-transparent z-10 pointer-events-none"></div>
                        
                        <div className="absolute inset-x-0 bottom-0 p-6 xl:p-8 flex flex-col justify-end z-30">
                            <h3 className="text-3xl md:text-4xl lg:text-5xl font-extrabold font-['Outfit'] uppercase tracking-[0.1em] mb-1 text-transparent bg-clip-text bg-[linear-gradient(to_bottom,#ffffff_0%,#e5e7eb_40%,#9ca3af_50%,#e5e7eb_60%,#ffffff_100%)] group-hover:bg-[linear-gradient(to_bottom,#ffffff_0%,#67e8f9_40%,#06b6d4_50%,#67e8f9_60%,#ffffff_100%)] transition-all duration-[800ms] drop-shadow-[0_4px_4px_rgba(0,0,0,1)] group-hover:drop-shadow-[0_0_30px_rgba(6,182,212,0.8)]">
                                CASINO
                            </h3>
                            
                            <div className="flex items-center justify-between w-full mt-4">
                                <div className="text-xs lg:text-sm font-medium text-gray-400 group-hover:text-gray-200 transition-colors">
                                    Klasik Masa Oyunları
                                </div>

                                <div className="relative w-12 h-12 lg:w-14 lg:h-14 flex items-center justify-center shrink-0">
                                    <div className="absolute inset-0 border border-white/10 rounded-full group-hover:border-[#06b6d4]/40 transition-colors duration-500"></div>
                                    <div className="absolute inset-[6px] bg-white/5 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-[#06b6d4] shadow-lg group-hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] transition-all duration-500 cursor-pointer group-hover:scale-110">
                                        <svg className="w-4 h-4 lg:w-5 lg:h-5 text-white group-hover:text-black ml-0.5 transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Slot Oyunları - Minimal Premium (#d946ef) */}
                <div onClick={() => onViewChange('slots')} className="group relative w-full h-[320px] md:h-[380px] bg-[#020202] cursor-pointer transition-all duration-[800ms] hover:-translate-y-3 hover:rotate-y-[5deg] clip-tech drop-shadow-[0_0_20px_rgba(217,70,239,0.1)] hover:drop-shadow-[0_0_40px_rgba(217,70,239,0.4)]">
                    <div className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent_0_340deg,#d946ef_360deg)] opacity-0 group-hover:opacity-60 animate-[spin_4s_linear_infinite] pointer-events-none"></div>
                    <div className="absolute inset-[1px] bg-[#05070a] flex flex-col z-10 clip-tech-inner overflow-hidden">
                        
                        <img src="/images/ai-generated/slot_card.jpg" className="absolute inset-0 w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-[1.5s] ease-out opacity-40 group-hover:opacity-80 mix-blend-luminosity group-hover:mix-blend-normal z-0" alt="Slotlar" />
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-[#05070a] via-[#05070a]/60 to-transparent z-10 pointer-events-none"></div>
                        
                        <div className="absolute inset-x-0 bottom-0 p-6 xl:p-8 flex flex-col justify-end z-30">
                            <h3 className="text-3xl md:text-4xl lg:text-5xl font-extrabold font-['Outfit'] uppercase tracking-[0.1em] mb-1 text-transparent bg-clip-text bg-[linear-gradient(to_bottom,#ffffff_0%,#e5e7eb_40%,#9ca3af_50%,#e5e7eb_60%,#ffffff_100%)] group-hover:bg-[linear-gradient(to_bottom,#ffffff_0%,#e879f9_40%,#d946ef_50%,#e879f9_60%,#ffffff_100%)] transition-all duration-[800ms] drop-shadow-[0_4px_4px_rgba(0,0,0,1)] group-hover:drop-shadow-[0_0_30px_rgba(217,70,239,0.8)]">
                                SLOTLAR
                            </h3>
                            
                            <div className="flex items-center justify-between w-full mt-4">
                                <div className="text-xs lg:text-sm font-medium text-gray-400 group-hover:text-gray-200 transition-colors">
                                    Binlerce Oyun
                                </div>

                                <div className="relative w-12 h-12 lg:w-14 lg:h-14 flex items-center justify-center shrink-0">
                                    <div className="absolute inset-0 border border-white/10 rounded-full group-hover:border-[#d946ef]/40 transition-colors duration-500"></div>
                                    <div className="absolute inset-[6px] bg-white/5 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-[#d946ef] shadow-lg group-hover:shadow-[0_0_20px_rgba(217,70,239,0.6)] transition-all duration-500 cursor-pointer group-hover:scale-110">
                                        <svg className="w-4 h-4 lg:w-5 lg:h-5 text-white group-hover:text-black ml-0.5 transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
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

                        <div className="absolute inset-x-0 bottom-0 p-6 xl:p-8 flex flex-col justify-end z-30">
                            <h3 className="text-3xl md:text-4xl lg:text-5xl font-extrabold font-['Outfit'] uppercase tracking-[0.1em] mb-1 text-transparent bg-clip-text bg-[linear-gradient(to_bottom,#ffffff_0%,#e5e7eb_40%,#9ca3af_50%,#e5e7eb_60%,#ffffff_100%)] group-hover:bg-[linear-gradient(to_bottom,#ffffff_0%,#6ee7b7_40%,#10b981_50%,#6ee7b7_60%,#ffffff_100%)] transition-all duration-[800ms] drop-shadow-[0_4px_4px_rgba(0,0,0,1)] group-hover:drop-shadow-[0_0_30px_rgba(16,185,129,0.8)]">
                                SPOR
                            </h3>
                            
                            <div className="flex items-center justify-between w-full mt-4">
                                <div className="text-xs lg:text-sm font-medium text-gray-400 group-hover:text-gray-200 transition-colors">
                                    Canlı Bahisler
                                </div>

                                <div className="relative w-12 h-12 lg:w-14 lg:h-14 flex items-center justify-center shrink-0">
                                    <div className="absolute inset-0 border border-white/10 rounded-full group-hover:border-[#10b981]/40 transition-colors duration-500"></div>
                                    <div className="absolute inset-[6px] bg-white/5 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-[#10b981] shadow-lg group-hover:shadow-[0_0_20px_rgba(16,185,129,0.6)] transition-all duration-500 cursor-pointer group-hover:scale-110">
                                        <svg className="w-4 h-4 lg:w-5 lg:h-5 text-white group-hover:text-black ml-0.5 transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 724Orijinal - Minimal Premium (#eab308) */}
                <div onClick={() => onViewChange('originals')} className="group relative w-full h-[320px] md:h-[380px] bg-[#020202] cursor-pointer transition-all duration-[800ms] hover:-translate-y-3 hover:rotate-y-[5deg] clip-tech drop-shadow-[0_0_20px_rgba(234,179,8,0.1)] hover:drop-shadow-[0_0_40px_rgba(234,179,8,0.4)]">
                    <div className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent_0_340deg,#eab308_360deg)] opacity-0 group-hover:opacity-60 animate-[spin_4s_linear_infinite] pointer-events-none"></div>
                    <div className="absolute inset-[1px] bg-[#05070a] flex flex-col z-10 clip-tech-inner overflow-hidden">
                        
                        <img src="/images/ai-generated/originals_card.jpg" className="absolute inset-0 w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-[1.5s] ease-out opacity-40 group-hover:opacity-80 mix-blend-luminosity group-hover:mix-blend-normal z-0" alt="724Orijinal" />
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-[#05070a] via-[#05070a]/60 to-transparent z-10 pointer-events-none"></div>

                        <div className="absolute inset-x-0 bottom-0 p-6 xl:p-8 flex flex-col justify-end z-30">
                            <h3 className="text-3xl md:text-4xl lg:text-5xl font-extrabold font-['Outfit'] uppercase tracking-[0.1em] mb-1 text-transparent bg-clip-text bg-[linear-gradient(to_bottom,#ffffff_0%,#e5e7eb_40%,#9ca3af_50%,#e5e7eb_60%,#ffffff_100%)] group-hover:bg-[linear-gradient(to_bottom,#ffffff_0%,#fde047_40%,#eab308_50%,#fde047_60%,#ffffff_100%)] transition-all duration-[800ms] drop-shadow-[0_4px_4px_rgba(0,0,0,1)] group-hover:drop-shadow-[0_0_30px_rgba(234,179,8,0.8)]">
                                724ORİJİNAL
                            </h3>
                            
                            <div className="flex items-center justify-between w-full mt-4">
                                <div className="text-xs lg:text-sm font-medium text-gray-400 group-hover:text-gray-200 transition-colors">
                                    %99.2 RTP Özel
                                </div>

                                <div className="relative w-12 h-12 lg:w-14 lg:h-14 flex items-center justify-center shrink-0">
                                    <div className="absolute inset-0 border border-white/10 rounded-full group-hover:border-[#eab308]/40 transition-colors duration-500"></div>
                                    <div className="absolute inset-[6px] bg-white/5 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-[#eab308] shadow-lg group-hover:shadow-[0_0_20px_rgba(234,179,8,0.6)] transition-all duration-500 cursor-pointer group-hover:scale-110">
                                        <svg className="w-4 h-4 lg:w-5 lg:h-5 text-white group-hover:text-black ml-0.5 transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>"""

new_styles = """<style>{`
                /* Premium CRT & Noise Effects */
                .clip-tech {
                    clip-path: polygon(0 0, 100% 0, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0 100%);
                }
                .clip-tech-inner {
                    clip-path: polygon(0 0, 100% 0, 100% calc(100% - 29px), calc(100% - 29px) 100%, 0 100%);
                }
                
                @keyframes premium-flicker {
                    0%, 100% { opacity: 1; }
                    3% { opacity: 0.95; }
                    6% { opacity: 0.8; }
                    7% { opacity: 1; }
                    8% { opacity: 0.6; }
                    9% { opacity: 1; }
                    11% { opacity: 0.95; }
                    12% { opacity: 1; }
                    89% { opacity: 1; }
                    90% { opacity: 0.9; }
                    91% { opacity: 1; }
                }

                @keyframes rgb-split {
                    0%, 100% { text-shadow: 0 0 10px rgba(255,255,255,0.2); transform: none; }
                    2% { text-shadow: 3px 0 0 rgba(255,0,0,0.8), -3px 0 0 rgba(0,255,255,0.8); transform: skewX(0.5deg) translateX(-1px); }
                    3% { text-shadow: -2px 0 0 rgba(255,0,0,0.8), 2px 0 0 rgba(0,255,255,0.8); transform: skewX(-0.5deg) translateX(1px); }
                    4% { text-shadow: 0 0 10px rgba(255,255,255,0.2); transform: none; }
                }
                
                @keyframes scanline-scroll {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(100%); }
                }

                .crt-premium-container {
                    animation: premium-flicker 8s infinite;
                }
                
                .text-glitch-premium {
                    animation: rgb-split 6s infinite;
                    position: relative;
                }
                
                .noise-overlay {
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
                    pointer-events: none;
                }
            `}</style>"""

h_start = content.find('{/* HERO BANNER - ULTRA LUXURY */}')
if h_start == -1:
    h_start = content.find('{/* HERO BANNER -')

c_start = content.find('{/* Category Navigation Cards (Web: 3 cols, Mobile: grid) */}')
if c_start == -1:
    c_start = content.find('<div className="w-full grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mt-6">')

c_end = content.find('</div>', content.find('</div>', content.find('group/sports') + 12) + 6) + 6

content = content[:h_start] + new_styles + "\n\n" + new_hero + "\n\n" + new_cards + content[c_end:]

with open('/Users/alex/Desktop/7_24bets-landing-page/components/GuestLanding.tsx', 'w') as f:
    f.write(content)
