import re

def update_guest_landing():
    with open('/Users/alex/Desktop/7_24bets-landing-page/components/GuestLanding.tsx', 'r') as f:
        content = f.read()

    # We need to replace the entire div block that has onClick={() => onViewChange('originals')}
    # We can split the content or use regex. 
    # Let's write a regex that matches from `<div onClick={() => onViewChange('originals')}` until `</div>\n                </div>`
    
    # Block 1 and 2
    # They both have:
    # <div onClick={() => onViewChange('originals')} ... group/orig">
    #   <div className="absolute inset-0 z-0 flex justify-end"> ... </div>
    #   <div className="relative z-20 ..."> ... </div>
    # </div>
    
    def replacer(match):
        return """<div onClick={() => onViewChange('originals')} className="col-span-2 lg:col-span-1 relative flex-1 w-full min-h-[100px] md:min-h-[120px] rounded-none overflow-hidden shadow-[4px_4px_0_#880088] bg-[#050510] cursor-pointer transition-all duration-300 hover:z-10 border-2 border-[#880088] hover:border-[#00ffff] hover:shadow-[4px_4px_0_#00ffff,inset_0_0_20px_rgba(255,0,255,0.2)] group/orig">
                    <div className="absolute inset-0 z-0 flex justify-end">
                      <div className="w-[100%] sm:w-[80%] h-full relative">
                        <img src="/images/ai-generated/originals_card.jpg" alt="Originals" className="w-full h-full object-cover object-[center] transform group-hover/orig:scale-[1.05] transition-all duration-700 ease-out opacity-40 mix-blend-luminosity group-hover/orig:opacity-70 group-hover/orig:mix-blend-normal" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-[#050510] via-[#050510]/90 to-transparent w-full"></div>
                    </div>
                    <div className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,rgba(0,255,255,0.03)_0px,rgba(0,255,255,0.03)_2px,transparent_2px,transparent_4px)] w-full pointer-events-none z-10"></div>
                    <div className="relative z-20 flex flex-col justify-center lg:justify-start items-start pt-0 lg:pt-5 h-full px-4 lg:px-6">
                        <h3 className="text-[14px] sm:text-[18px] lg:text-[22px] font-black text-[#00ffff] tracking-widest leading-none pb-2 transform group-hover/orig:translate-x-1 transition-transform flex flex-wrap items-center gap-2 lg:gap-3 drop-shadow-[2px_2px_0_#880088]" style={{fontFamily: "'Press Start 2P', monospace"}}>
                            <span>724GAMES</span>
                            <span className="bg-[#ff00ff] text-white text-[8px] sm:text-[9px] px-2 py-1 shadow-[2px_2px_0_#880088] animate-pulse shrink-0 tracking-normal uppercase ml-1 mr-auto border border-[#880088]">
                                %99.2 RTP
                            </span>
                        </h3>
                        <div className="block mt-1 font-['Courier_New'] font-bold text-[#ff00ff] text-xs"><ActivePlayersCounter type="casino" /></div>
                    </div>
                </div>"""

    content = re.sub(r'<div onClick=\{\(\) => onViewChange\(\'originals\'\)\}.*?group/orig">.*?<ActivePlayersCounter type="casino" /></div>\s*</div>\s*</div>', replacer, content, flags=re.DOTALL)

    # I must ensure we don't accidentally wipe out the Casino Section that follows it
    with open('/Users/alex/Desktop/7_24bets-landing-page/components/GuestLanding.tsx', 'w') as f:
        f.write(content)

update_guest_landing()
print("GuestLanding updated")

