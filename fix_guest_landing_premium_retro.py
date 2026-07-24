import re

def update_guest_landing():
    with open('/Users/alex/Desktop/7_24bets-landing-page/components/GuestLanding.tsx', 'r') as f:
        content = f.read()

    def replacer(match):
        return """<div onClick={() => onViewChange('originals')} className="col-span-2 lg:col-span-1 relative flex-1 w-full min-h-[100px] md:min-h-[130px] rounded-none overflow-hidden bg-[#0a0510] cursor-pointer transition-all duration-300 hover:z-10 group/orig" style={{ boxShadow: '0 0 0 2px #330033, 0 0 0 4px #880088, 6px 6px 0 rgba(136,0,136,0.5)' }}>
                    {/* Animated Neon Border & Background Glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#ff00ff]/20 via-[#00ffff]/10 to-[#ff00ff]/20 opacity-0 group-hover/orig:opacity-100 transition-opacity duration-700 pointer-events-none z-10"></div>
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00ffff] to-transparent -translate-x-[100%] group-hover/orig:translate-x-[100%] transition-transform duration-1000 z-10"></div>
                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#ff00ff] to-transparent translate-x-[100%] group-hover/orig:-translate-x-[100%] transition-transform duration-1000 z-10"></div>
                    
                    <div className="absolute inset-0 z-0 flex justify-end">
                      <div className="w-[100%] sm:w-[80%] h-full relative">
                        <img src="/images/ai-generated/originals_card.jpg" alt="Originals" className="w-full h-full object-cover object-[center] transform group-hover/orig:scale-[1.1] transition-all duration-1000 ease-out opacity-30 mix-blend-luminosity group-hover/orig:opacity-60 group-hover/orig:mix-blend-screen grayscale group-hover/orig:grayscale-0" />
                      </div>
                      {/* Deep dark gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-[#05000a] via-[#05000a]/90 to-[#05000a]/40 w-full"></div>
                    </div>

                    {/* Retro Scanlines */}
                    <div className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,rgba(0,255,255,0.05)_0px,rgba(0,255,255,0.05)_2px,transparent_2px,transparent_4px)] w-full pointer-events-none z-10 opacity-70 group-hover/orig:opacity-100 mix-blend-overlay"></div>
                    
                    <div className="relative z-20 flex flex-col justify-center lg:justify-start items-start pt-0 lg:pt-5 h-full px-5 lg:px-6">
                        {/* Header Area */}
                        <div className="flex w-full items-center justify-between mb-1">
                            <span className="text-[#00ffff] font-mono text-[9px] font-bold tracking-widest opacity-70 group-hover/orig:opacity-100 flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 bg-[#00ffff] shadow-[0_0_5px_#00ffff] rounded-full animate-ping"></div>
                                LIVE
                            </span>
                            <span className="bg-black/50 border border-[#ff00ff] text-[#ff00ff] text-[8px] sm:text-[9px] px-2 py-1 shadow-[inset_0_0_5px_#ff00ff] tracking-widest uppercase" style={{fontFamily: "'Press Start 2P', monospace"}}>
                                %99.2 RTP
                            </span>
                        </div>

                        {/* Title text */}
                        <h3 className="text-[16px] sm:text-[20px] lg:text-[26px] font-black tracking-widest leading-none pb-2 transform group-hover/orig:translate-x-1 transition-transform flex flex-wrap items-center gap-2 lg:gap-3 drop-shadow-[3px_3px_0_#880088] group-hover/orig:drop-shadow-[4px_4px_0_#00ffff] text-[#fff] group-hover/orig:text-[#00ffff] mt-1" style={{fontFamily: "'Press Start 2P', monospace"}}>
                            724GAMES
                        </h3>

                        {/* Players count */}
                        <div className="block mt-1 font-mono font-bold text-[#ff00ff] text-[10px] sm:text-xs flex items-center gap-2 bg-black/40 px-2 py-1 border-l-2 border-[#ff00ff]">
                           <span className="animate-pulse">▶</span> 
                           <ActivePlayersCounter type="casino" />
                        </div>
                        
                        {/* Insert Coin Easter Egg - Only visible on hover */}
                        <div className="absolute bottom-3 right-4 opacity-0 group-hover/orig:opacity-100 transition-opacity duration-300">
                            <span className="text-[#00ffff] font-['Press_Start_2P'] text-[8px] animate-[pulse_1s_ease-in-out_infinite] tracking-widest">
                                INSERT COIN
                            </span>
                        </div>
                    </div>
                </div>"""

    content = re.sub(r'<div onClick=\{\(\) => onViewChange\(\'originals\'\)\}.*?group/orig">.*?<ActivePlayersCounter type="casino" /></div>\s*</div>\s*</div>', replacer, content, flags=re.DOTALL)

    with open('/Users/alex/Desktop/7_24bets-landing-page/components/GuestLanding.tsx', 'w') as f:
        f.write(content)

update_guest_landing()
print("GuestLanding updated")

