import re

with open('/Users/alex/Desktop/7_24bets-landing-page/components/GuestLanding.tsx', 'r') as f:
    content = f.read()

# Define the start and end of the GUEST VIEW block
start_marker = "// GUEST VIEW"
end_marker = "      <div className=\"w-full mt-8\">\n        <GameLobbyGrid customGames={[]} />"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

new_guest_view = """// GUEST VIEW
        <div className="w-full max-w-[1400px] mx-auto px-4 lg:px-6 pt-4 pb-8 flex flex-col gap-6 items-center">
            
            {/* HERO BANNER - ULTRA LUXURY */}
            <div className="w-full relative rounded-2xl overflow-hidden bg-[#030303] min-h-[300px] md:min-h-[400px] shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-white/5 group flex flex-col items-center justify-center p-8 text-center">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#06b6d4]/10 to-[#10b981]/10 blur-[120px] rounded-full z-0"></div>
                    <div className="absolute inset-0 bg-[#000] opacity-60 z-0"></div>
                </div>
                
                <div className="relative z-10 flex flex-col items-center max-w-[800px] mx-auto gap-6">
                    <h1 className="text-[32px] sm:text-[40px] lg:text-[56px] font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 leading-tight tracking-tight font-['Outfit'] drop-shadow-lg">
                      Premium Casino Deneyimine Hoş Geldiniz
                    </h1>
                    <p className="text-gray-400 text-sm md:text-lg font-medium max-w-[600px]">
                      Ayrıcalıklı bahis seçenekleri, devasa ödüller ve kesintisiz canlı heyecan 724Bets'te sizi bekliyor.
                    </p>
                    
                    <button onClick={() => window.dispatchEvent(new Event('openRegisterModal'))} className="mt-4 px-10 py-4 bg-gradient-to-r from-[#06b6d4] to-[#10b981] hover:from-[#0891b2] hover:to-[#059669] text-black font-bold text-lg rounded-full shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:shadow-[0_0_40px_rgba(6,182,212,0.5)] transition-all duration-300 hover:scale-105">
                      Avantajları Keşfet
                    </button>
                    
                    <div className="flex items-center gap-4 mt-6 opacity-60 hover:opacity-100 transition-opacity">
                      <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold mr-2">Veya İle Giriş Yap:</span>
                      <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#fff"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#fff"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#fff"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#fff"/>
                        </svg>
                      </button>
                      <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                        <svg className="w-4 h-4" fill="#fff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.5h-2.8V24C19.62 23.1 24 18.1 24 12.07z"/></svg>
                      </button>
                    </div>
                </div>
            </div>

            {/* CATEGORY CARDS */}
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-2">
                <div onClick={() => onViewChange('blackjack')} className="relative group rounded-2xl overflow-hidden bg-[#050505] border border-white/5 hover:border-[#06b6d4]/40 h-[180px] md:h-[220px] cursor-pointer transition-all duration-500 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
                    <img src="/images/ai-generated/casino_card.jpg" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700 mix-blend-luminosity grayscale group-hover:grayscale-0" alt="Casino" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#000] via-[#000]/60 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 z-10">
                        <div className="text-[#06b6d4] text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#06b6d4] animate-pulse"></span>
                            CANLI MASALAR
                        </div>
                        <h3 className="text-2xl md:text-3xl font-black text-white font-['Outfit']">Casino</h3>
                    </div>
                </div>

                <div onClick={() => onViewChange('sports')} className="relative group rounded-2xl overflow-hidden bg-[#050505] border border-white/5 hover:border-[#10b981]/40 h-[180px] md:h-[220px] cursor-pointer transition-all duration-500 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
                    <img src="/images/ai-generated/sports_card.jpg" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700 mix-blend-luminosity grayscale group-hover:grayscale-0" alt="Spor" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#000] via-[#000]/60 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 z-10">
                        <div className="text-[#10b981] text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse"></span>
                            YÜKSEK ORANLAR
                        </div>
                        <h3 className="text-2xl md:text-3xl font-black text-white font-['Outfit']">Spor Bahisleri</h3>
                    </div>
                </div>

                <div onClick={() => onViewChange('originals')} className="relative group rounded-2xl overflow-hidden bg-[#050505] border border-white/5 hover:border-yellow-500/40 h-[180px] md:h-[220px] cursor-pointer transition-all duration-500 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
                    <img src="/images/ai-generated/originals_card.jpg" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700 mix-blend-luminosity grayscale group-hover:grayscale-0" alt="Originals" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#000] via-[#000]/60 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 z-10">
                        <div className="text-yellow-500 text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                            <Star className="w-3 h-3 fill-yellow-500" />
                            ÖZEL ÜRETİM
                        </div>
                        <h3 className="text-2xl md:text-3xl font-black text-white font-['Outfit']">724 Orijinal</h3>
                    </div>
                </div>
            </div>

            {/* TICKER */}
            <div className="w-full mt-10 relative z-20">
              <LiveWinsTicker guestTheme="luxury" />
            </div>

            {/* ORIGINALS SLIDER */}
            <div className="w-full mt-6">
              <OriginalsSlider onNavigate={onViewChange} guestTheme="luxury" />
            </div>

            {/* NEW GAMES SLIDER */}
            <div className="w-full mt-6">
                <NewGamesSlider2 onPlayGame={(game) => setDetailModalGame({
                    id: game.id,
                    name: game.name,
                    provider: game.provider,
                    img: game.img,
                    demoUrl: getDemoUrl(game),
                    fullDesc: `${game.name}, ${game.provider} tarafından sunulan popüler ve kazançlı bir slottur.`
                })} />
            </div>
        </div>
      )}
"""

if start_idx != -1 and end_idx != -1:
    content = content[:start_idx] + new_guest_view + content[end_idx:]
    with open('/Users/alex/Desktop/7_24bets-landing-page/components/GuestLanding.tsx', 'w') as f:
        f.write(content)
