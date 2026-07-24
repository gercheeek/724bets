import re

with open('/Users/alex/Desktop/7_24bets-landing-page/components/OriginalsHub.tsx', 'r') as f:
    content = f.read()

# Replace the VIP and children section
old_vip = """                {/* VIP Dashboard & Hero Banner */}
                <div className="w-full my-4">
                   <VIPHeroBanner />
                   
                   {children ? (
                       <div className="w-full flex flex-col mt-8 animate-fade-in relative z-[100]">
                           <div className="w-full flex items-center mb-4">
                             <button 
                               onClick={() => onNavigate('originals')}
                               className="flex items-center gap-2 text-[#00ffff] hover:text-white transition-colors bg-[#00ffff]/10 border border-[#00ffff]/30 hover:bg-[#00ffff]/20 px-4 py-2 rounded-lg shadow-[0_0_15px_rgba(0,255,255,0.2)]"
                               style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '10px' }}
                             >
                                <span className="font-black uppercase">{'< GERİ DÖN'}</span>
                             </button>
                           </div>
                           <div className="w-full rounded-2xl overflow-hidden border-2 border-[#00ffff]/30 relative shadow-[0_0_30px_rgba(0,255,255,0.1)]" style={{ minHeight: '600px', backgroundColor: '#0a0a0a' }}>
                              {children}
                           </div>
                       </div>
                   ) : (
                       <div className="mt-8">
                         <GamesHeroBanner onNavigate={onNavigate} />
                       </div>
                   )}
                </div>"""

new_vip = """                {/* VIP Dashboard & Hero Banner */}
                <div className="w-full my-4">
                   <VIPHeroBanner />
                   <div className="mt-8">
                     <GamesHeroBanner onNavigate={onNavigate} />
                   </div>
                </div>

                {/* Cinematic Game Overlay Modal */}
                {children && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8 animate-fade-in">
                        {/* Backdrop - Click to close */}
                        <div 
                          className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer" 
                          onClick={() => onNavigate('originals')}
                        />
                        
                        {/* Cinematic Container */}
                        <div className="relative w-full max-w-[1400px] h-[90vh] bg-[#050505] rounded-xl border border-[#00ffff]/30 shadow-[0_0_80px_rgba(0,255,255,0.15)] flex flex-col overflow-hidden animate-scale-up">
                            
                            {/* Cinematic Header */}
                            <div className="w-full h-14 bg-[#080808] border-b border-[#00ffff]/20 flex items-center justify-between px-6 shrink-0 z-10 shadow-md">
                                <div className="flex items-center gap-3">
                                   <div className="w-2 h-2 bg-[#00ffff] rounded-full animate-pulse shadow-[0_0_10px_#00ffff]" />
                                   <span className="text-[#00ffff] font-mono text-sm uppercase tracking-widest font-bold">724BETS OYUN MOTORU</span>
                                </div>
                                <button 
                                  onClick={() => onNavigate('originals')}
                                  className="text-zinc-400 hover:text-white transition-all bg-white/5 hover:bg-white/10 hover:rotate-90 w-8 h-8 flex items-center justify-center rounded-lg"
                                >
                                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            
                            {/* Game Content */}
                            <div className="flex-1 w-full relative bg-black">
                               {children}
                            </div>
                        </div>
                    </div>
                )}"""

content = content.replace(old_vip, new_vip)

with open('/Users/alex/Desktop/7_24bets-landing-page/components/OriginalsHub.tsx', 'w') as f:
    f.write(content)

