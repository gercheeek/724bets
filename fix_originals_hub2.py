import re

with open('/Users/alex/Desktop/7_24bets-landing-page/components/OriginalsHub.tsx', 'r') as f:
    content = f.read()

# Replace VIP Dashboard section
old_vip = """                {/* Game Container OR VIP Dashboard */}
                {children ? (
                    <div className="w-full flex flex-col my-4">
                        <div className="w-full flex items-center mb-4">
                          <button 
                            onClick={() => onNavigate('originals')}
                            className="flex items-center gap-2 text-[#00ffff] hover:text-white transition-colors bg-[#00ffff]/10 border border-[#00ffff]/30 hover:bg-[#00ffff]/20 px-4 py-2 rounded-lg"
                            style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '10px' }}
                          >
                             <span className="font-black uppercase">{'< GERİ DÖN'}</span>
                          </button>
                        </div>
                        <div className="w-full rounded-2xl overflow-hidden border border-white/10 relative" style={{ minHeight: '600px', backgroundColor: '#0a0a0a' }}>
                           {children}
                        </div>
                    </div>
                ) : (
                    <div className="w-full my-4">
                       <VIPHeroBanner />
                       <div className="mt-8">
                         <GamesHeroBanner onNavigate={onNavigate} />
                       </div>
                    </div>
                )}"""
new_vip = """                {/* VIP Dashboard & Hero Banner */}
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
content = content.replace(old_vip, new_vip)

with open('/Users/alex/Desktop/7_24bets-landing-page/components/OriginalsHub.tsx', 'w') as f:
    f.write(content)

