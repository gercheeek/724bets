import re

with open('/Users/alex/Desktop/7_24bets-landing-page/App.tsx', 'r') as f:
    content = f.read()

# Replace the block that renders original games
old_block = """        {/* ORIGINALS SECTION & GAMES */}
        {(() => {
          const originalGameViews = ['limbo', 'chicken-run', 'plinko', 'dice', 'mines', 'keno', 'war', 'hilo', 'roulette', 'crash-turbo', 'turbo-mines'];
          const isOriginalGame = originalGameViews.includes(view);
          
          if (view === 'originals' || isOriginalGame) {
            return (
              <div className="animate-fade-in w-full h-full relative z-[50] flex flex-col bg-[#050505]">
                {isOriginalGame ? (
                  <div className="w-full flex-1 flex flex-col min-h-[calc(100vh-60px)] relative overflow-hidden">
                    <div className="w-full flex flex-wrap items-center justify-between p-3 md:p-4 border-b border-white/5 bg-[#0a0a0a] gap-4 shrink-0">
                      <button 
                        onClick={() => handleViewChange('originals')}
                        className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 md:py-2.5 rounded-lg shrink-0"
                      >
                         <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                         <span className="font-black text-xs md:text-sm tracking-wider uppercase whitespace-nowrap">ORİJİNALLERE DÖN</span>
                      </button>
                      <div className="flex items-center gap-2 shrink-0 hidden sm:flex">
                         <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                         <span className="text-emerald-500 font-bold text-xs uppercase tracking-widest">{view.replace('-', ' ')} OYUNU AKTİF</span>
                      </div>
                    </div>
                    <div className="flex-1 w-full h-full relative overflow-y-auto overflow-x-hidden" style={{ minHeight: '800px' }}>
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
                    </div>
                  </div>
                ) : (
                  <OriginalsHub onNavigate={handleViewChange} isLoggedIn={!!(siteUser || userRole)} />
                )}
              </div>
            );
          }
          return null;
        })()}"""

new_block = """        {/* ORIGINALS SECTION & GAMES */}
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

content = content.replace(old_block, new_block)

with open('/Users/alex/Desktop/7_24bets-landing-page/App.tsx', 'w') as f:
    f.write(content)

