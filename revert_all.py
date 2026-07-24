import re

# 1. REVERT OriginalsHub.tsx
with open('/Users/alex/Desktop/7_24bets-landing-page/components/OriginalsHub.tsx', 'r') as f:
    content = f.read()

old_sig = "export default function OriginalsHub({ onNavigate, isLoggedIn, children, activeGameView }: { onNavigate: (v: string) => void, isLoggedIn?: boolean, children?: React.ReactNode, activeGameView?: string | null }) {"
new_sig = "export default function OriginalsHub({ onNavigate, isLoggedIn }: { onNavigate: (v: string) => void, isLoggedIn?: boolean }) {"
content = content.replace(old_sig, new_sig)

modal_block = """                {/* VIP Dashboard & Hero Banner */}
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

original_vip = """                {/* VIP Dashboard & Hero Banner */}
                <div className="w-full my-4">
                   <VIPHeroBanner />
                   <div className="mt-8">
                     <GamesHeroBanner onNavigate={onNavigate} />
                   </div>
                </div>"""

content = content.replace(modal_block, original_vip)

with open('/Users/alex/Desktop/7_24bets-landing-page/components/OriginalsHub.tsx', 'w') as f:
    f.write(content)

# 2. REVERT App.tsx
with open('/Users/alex/Desktop/7_24bets-landing-page/App.tsx', 'r') as f:
    app_content = f.read()

# Restore InGameLayout
new_ingame = """{(['blackjack-pro', 'hacksaw', 'redtiger'].includes(view)) ? ("""
old_ingame = """{(['blackjack-pro', 'limbo', 'chicken-run', 'plinko', 'dice', 'mines', 'keno', 'war', 'hilo', 'roulette', 'crash-turbo', 'turbo-mines', 'hacksaw', 'redtiger'].includes(view)) ? ("""
app_content = app_content.replace(new_ingame, old_ingame)

new_title = """          gameTitle={
              view === 'hacksaw' ? 'Hacksaw Slot' :
              view === 'redtiger' ? 'Red Tiger Slot' :
              'Blackjack Pro'
          }"""
old_title = """          gameTitle={
              view === 'limbo' ? 'Limbo' : 
              view === 'chicken-run' ? 'Chicken Run' : 
              view === 'plinko' ? 'Plinko' :
              view === 'dice' ? 'Dice' :
              view === 'mines' ? 'Mines' :
              view === 'keno' ? 'Keno' :
              view === 'war' ? 'Casino War' :
              view === 'hilo' ? 'HiLo' :
              view === 'roulette' ? 'Roulette' :
              view === 'crash-turbo' ? 'Crash' :
              view === 'turbo-mines' ? 'Turbo Mines' :
              view === 'hacksaw' ? 'Hacksaw Slot' :
              view === 'redtiger' ? 'Red Tiger Slot' :
              'Blackjack Pro'
          }"""
app_content = app_content.replace(new_title, old_title)

# Restore the components inside InGameLayout
missing_games = """           {view === 'blackjack-pro' && (
             <BlackjackProView siteUser={siteUser} setSiteUser={setSiteUser} onAuthRequired={() => setAuthModalMode('member')} />
           )}
           {view === 'limbo' && (
             <LimboView siteUser={siteUser} setSiteUser={setSiteUser} onAuthRequired={() => setAuthModalMode('member')} />
           )}
           {view === 'chicken-run' && (
             <ChickenRunView siteUser={siteUser} setSiteUser={setSiteUser} onAuthRequired={() => setAuthModalMode('member')} />
           )}
           {view === 'plinko' && (
             <PlinkoView siteUser={siteUser} setSiteUser={setSiteUser} onAuthRequired={() => setAuthModalMode('member')} />
           )}
           {view === 'dice' && (
             <DiceView siteUser={siteUser} setSiteUser={setSiteUser} onAuthRequired={() => setAuthModalMode('member')} />
           )}
           {view === 'mines' && (
             <MinesView siteUser={siteUser} setSiteUser={setSiteUser} onAuthRequired={() => setAuthModalMode('member')} />
           )}
           {view === 'keno' && (
             <KenoView siteUser={siteUser} setSiteUser={setSiteUser} onAuthRequired={() => setAuthModalMode('member')} />
           )}
           {view === 'war' && (
             <WarView siteUser={siteUser} setSiteUser={setSiteUser} onAuthRequired={() => setAuthModalMode('member')} />
           )}
           {view === 'hilo' && (
             <HiLoView siteUser={siteUser} setSiteUser={setSiteUser} onAuthRequired={() => setAuthModalMode('member')} />
           )}
           {view === 'roulette' && (
             <RouletteView siteUser={siteUser} setSiteUser={setSiteUser} onAuthRequired={() => setAuthModalMode('member')} />
           )}
           {view === 'crash-turbo' && (
             <CrashTurboView siteUser={siteUser} setSiteUser={setSiteUser} onAuthRequired={() => setAuthModalMode('member')} />
           )}
           {view === 'turbo-mines' && (
             <TurboMinesView siteUser={siteUser} setSiteUser={setSiteUser} onAuthRequired={() => setAuthModalMode('member')} />
           )}"""
app_content = app_content.replace("""           {view === 'blackjack-pro' && (
             <BlackjackProView siteUser={siteUser} setSiteUser={setSiteUser} onAuthRequired={() => setAuthModalMode('member')} />
           )}""", missing_games)

# Revert the Originals block
new_originals = """        {/* ORIGINALS SECTION & GAMES */}
        {(() => {
          const originalGameViews = ['limbo', 'chicken-run', 'plinko', 'dice', 'mines', 'keno', 'war', 'hilo', 'roulette', 'crash-turbo', 'turbo-mines'];
          const isOriginalGame = originalGameViews.includes(view);
          
          if (view === 'originals' || isOriginalGame) {
            return (
              <div className="animate-fade-in w-full h-full relative z-[50]">
                  <OriginalsHub 
                      onNavigate={handleViewChange} 
                      isLoggedIn={!!(siteUser || userRole)}
                      activeGameView={isOriginalGame ? view : null}
                  >
                       {view === 'limbo' && <LimboView siteUser={siteUser} setSiteUser={setSiteUser} onAuthRequired={() => setAuthModalMode('member')} />}
                       {view === 'chicken-run' && <ChickenRunView siteUser={siteUser} setSiteUser={setSiteUser} onAuthRequired={() => setAuthModalMode('member')} />}
                       {view === 'plinko' && <PlinkoView siteUser={siteUser} setSiteUser={setSiteUser} onAuthRequired={() => setAuthModalMode('member')} />}
                       {view === 'dice' && <DiceView siteUser={siteUser} setSiteUser={setSiteUser} onAuthRequired={() => setAuthModalMode('member')} />}
                       {view === 'mines' && <MinesView siteUser={siteUser} setSiteUser={setSiteUser} onAuthRequired={() => setAuthModalMode('member')} />}
                       {view === 'keno' && <KenoView siteUser={siteUser} setSiteUser={setSiteUser} onAuthRequired={() => setAuthModalMode('member')} />}
                       {view === 'war' && <WarView siteUser={siteUser} setSiteUser={setSiteUser} onAuthRequired={() => setAuthModalMode('member')} />}
                       {view === 'hilo' && <HiLoView siteUser={siteUser} setSiteUser={setSiteUser} onAuthRequired={() => setAuthModalMode('member')} />}
                       {view === 'roulette' && <RouletteView siteUser={siteUser} setSiteUser={setSiteUser} onAuthRequired={() => setAuthModalMode('member')} />}
                       {view === 'crash-turbo' && <CrashTurboView siteUser={siteUser} setSiteUser={setSiteUser} onAuthRequired={() => setAuthModalMode('member')} />}
                       {view === 'turbo-mines' && <TurboMinesView siteUser={siteUser} setSiteUser={setSiteUser} onAuthRequired={() => setAuthModalMode('member')} />}
                  </OriginalsHub>
              </div>
            );
          }
          return null;
        })()}"""

old_originals = """        {view === 'originals' && (
          <div className="animate-fade-in w-full h-full relative z-[50]">
            <OriginalsHub onNavigate={handleViewChange} isLoggedIn={!!(siteUser || userRole)} />
          </div>
        )}"""
app_content = app_content.replace(new_originals, old_originals)

with open('/Users/alex/Desktop/7_24bets-landing-page/App.tsx', 'w') as f:
    f.write(app_content)

