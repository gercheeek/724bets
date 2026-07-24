import re

def create_games_banner():
    with open('/Users/alex/Desktop/7_24bets-landing-page/components/VIPHeroBanner.tsx', 'r') as f:
        content = f.read()
        
    # Replace Component Name
    content = content.replace('VIPHeroBanner', 'GamesHeroBanner')
    
    # Change colors: 
    # Top banner uses cyan-400 / #00ffff and fuchsia-400 / #ff00ff
    # We will use emerald/neon-green (#00ff88) and deep purple/violet (#8b5cf6 / #a855f7)
    content = content.replace('cyan-500', 'emerald-500')
    content = content.replace('fuchsia-600', 'purple-600')
    content = content.replace('cyan-400', 'emerald-400')
    content = content.replace('fuchsia-400', 'purple-400')
    content = content.replace('#00ffff', '#00ff88')
    content = content.replace('#ff00ff', '#a855f7')
    
    # Left Text
    content = content.replace('724BETS VIP CLUB', 'POPÜLER ORİJİNALLER')
    content = content.replace('OYUNUNUZU', 'EN ÇOK KAZANDIRAN')
    content = content.replace('KAZANCA', 'OYUNLARI')
    content = content.replace('DÖNÜŞTÜRÜN', 'ŞİMDİ KEŞFEDİN')
    content = content.replace('Mega Kasa', 'Toplam Dağıtılan Ödül')
    
    # State for games instead of ranks
    # We will replace the hover rank id state with hover game id
    content = content.replace('hoveredRankId', 'hoveredGameId')
    content = content.replace('setHoveredRankId', 'setHoveredGameId')
    
    # The ranks array
    ranks_array = """[
            { id: 'demir', name: 'DEMİR', color: 'text-zinc-500', image: '/images/ranks/demir.jpeg', active: false, reqXp: 1000 },
            { id: 'bronz', name: 'BRONZ', color: 'text-yellow-600', image: '/images/ranks/bronz.jpeg', active: true, progress: 65, currentXp: 2500 },
            { id: 'gumus', name: 'GÜMÜŞ', color: 'text-zinc-300', image: '/images/ranks/gumus.jpeg', active: false, reqXp: 10000 },
            { id: 'altin', name: 'ALTIN', color: 'text-yellow-400', image: '/images/ranks/altin.jpeg', active: false, reqXp: 25000 },
            { id: 'elmas', name: 'ELMAS', color: 'text-cyan-400', image: '/images/ranks/elmas.jpeg', active: false, reqXp: 100000 },
          ]"""
          
    games_array = """[
            { id: 'plinko', name: 'PLINKO', color: 'text-[#00ff88]', image: '/games/plinko.jpg', players: 1245, maxWin: '1000x' },
            { id: 'limbo', name: 'LIMBO', color: 'text-[#a855f7]', image: '/games/limbo.jpg', players: 843, maxWin: '10,000x' },
            { id: 'roulette', name: 'ROULETTE', color: 'text-emerald-400', image: '/games/roulette.jpg', players: 3201, maxWin: '36x' },
            { id: 'blackjack', name: 'BLACKJACK', color: 'text-white', image: '/games/blackjack.jpg', players: 2150, maxWin: '2.5x' },
            { id: 'keno', name: 'KENO', color: 'text-yellow-400', image: '/games/keno.jpg', players: 540, maxWin: '500x' },
          ]"""
          
    content = content.replace(ranks_array, games_array)
    
    # Now we need to fix the map loop logic to render game info instead of rank progress
    # The map looks like: map((rank, idx) => { ... })
    # We replace the inside of the map loop carefully.
    
    # We can use a regex to replace everything from map((rank, idx) => { to the closing }) of the map.
    # It's better to replace the specific JSX parts.
    
    content = content.replace('rank.id', 'game.id')
    content = content.replace('rank.active', 'false') # Games are not active by default
    content = content.replace('rank.image', 'game.image')
    content = content.replace('rank.name', 'game.name')
    
    # Replacing the inner contents of the card:
    # <div>
    #    <h4 className={`text-[11px] md:text-xs font-arcade tracking-widest transition-colors ${isFocused ? 'retro-cyan-text drop-shadow-[0_0_8px_rgba(0,255,136,0.6)]' : 'retro-cyan-text opacity-50'}`}>{game.name}</h4>
    #    {!false && <div className="text-[10px] font-arcade text-zinc-600 font-bold uppercase mt-0.5 tracking-wider">Kilitli</div>}
    #    {false && <div className="text-[10px] font-arcade retro-cyan-text font-bold uppercase mt-0.5 tracking-wider drop-shadow-[0_0_5px_rgba(0,255,136,0.5)]">Mevcut Rütbe</div>}
    # </div>
    # </div>
    # <div className={`transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden ${isFocused ? 'max-h-[80px] opacity-100 mt-1.5 pt-1.5 border-t border-white/5' : 'max-h-0 opacity-0 mt-0 pt-0 border-t-0'}`}>
    # ...
    
    # Let's just do a big regex replacement for the mapping block
    pattern = r'(\[\s*\{\s*id:\s*\'plinko\'.*?\]\.map\(\(rank, idx\)\s*=>\s*\{).*?(return \(\s*<div.*?</div\>\s*\);\s*\}\)\s*\}\s*</div\>)'
    
    # First, let's fix the map argument name:
    content = content.replace('.map((rank, idx) => {', '.map((game, idx) => {')
    
    new_map_body = """
            const isFocused = hoveredGameId ? game.id === hoveredGameId : idx === 0;
            
            return (
            <div 
              key={game.id} 
              className="stagger-enter touch-manipulation cursor-pointer" 
              style={{ animationDelay: `${idx * 150}ms` }}
              onMouseEnter={() => setHoveredGameId(game.id)}
              onMouseLeave={() => setHoveredGameId(null)}
              onClick={() => { window.dispatchEvent(new CustomEvent('openGame', { detail: game.id })) }}
            >
              <div className={`relative rounded-2xl p-[1px] transition-all duration-700 overflow-hidden tilt-card ${isFocused ? 'scale-105 z-10 my-2 shadow-[0_0_20px_rgba(0,255,136,0.3)]' : 'scale-95 opacity-[0.65] grayscale z-0'}`} style={{ transform: isFocused ? 'rotateX(0deg)' : (idx < 2 ? 'rotateX(5deg) translateY(5px)' : 'rotateX(-5deg) translateY(-5px)') }}>
                 
                 {/* Animated Border for Active Game */}
                 {isFocused && (
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250%] h-[250%] bg-gradient-to-br from-[#00ff88]/0 via-[#00ff88]/80 to-[#a855f7]/0 opacity-70 animate-[spin-slow_4s_linear_infinite] pointer-events-none z-0"></div>
                 )}

                 <div className={`relative bg-[#0a0a0a]/90 backdrop-blur-xl rounded-[calc(1rem-1px)] z-10 flex flex-col p-2 md:p-3 transition-colors duration-500 ${isFocused ? 'border-none bg-[#050505]/95' : 'border border-white/5'}`}>
                  <div className="flex items-center gap-4">
                     <div className={`w-10 h-10 flex items-center justify-center text-xl rounded-md bg-black border border-white/10 shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)] transition-all overflow-hidden ${isFocused ? 'shadow-[0_0_15px_rgba(0,255,136,0.4)] border-[#00ff88]/30' : ''}`}>
                       <img src={game.image} alt={game.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src='https://placehold.co/100x100/111/444?text='+game.name }} />
                     </div>
                     <div className="flex-1">
                        <h4 className={`text-[12px] md:text-sm font-black tracking-widest transition-colors ${isFocused ? 'text-[#00ff88] drop-shadow-[0_0_8px_rgba(0,255,136,0.6)]' : 'text-slate-400'}`}>{game.name}</h4>
                        <div className="text-[9px] text-zinc-500 font-bold uppercase mt-0.5 tracking-wider flex items-center gap-1">
                           <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                           {game.players} Aktif Oyuncu
                        </div>
                     </div>
                  </div>

                  <div className={`transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden ${isFocused ? 'max-h-[80px] opacity-100 mt-2 pt-2 border-t border-white/5' : 'max-h-0 opacity-0 mt-0 pt-0 border-t-0'}`}>
                     <div className="flex justify-between items-center bg-black/50 p-2 rounded-lg border border-white/5">
                        <div className="flex flex-col">
                           <span className="text-[8px] md:text-[9px] text-zinc-500 uppercase font-bold">Max Kazanç</span>
                           <span className="text-[11px] md:text-[13px] font-black text-[#a855f7] drop-shadow-[0_0_5px_rgba(168,85,247,0.5)]">{game.maxWin}</span>
                        </div>
                        <button className="bg-[#00ff88]/20 hover:bg-[#00ff88]/30 text-[#00ff88] border border-[#00ff88]/40 px-3 py-1.5 rounded text-[10px] font-black uppercase tracking-wider transition-all shadow-[0_0_10px_rgba(0,255,136,0.2)] hover:shadow-[0_0_15px_rgba(0,255,136,0.4)]">
                           Hemen Oyna
                        </button>
                     </div>
                  </div>
                 </div>
              </div>
            </div>
            );
          })}
        </div>"""
        
    # We need to replace the entire array mapping section.
    # The map block starts at `.map((game, idx) => {`
    # and ends at the closing `</div>` right before `</div>` and `</div>` of the component.
    
    # It's safer to just split and combine
    parts = content.split('.map((game, idx) => {')
    if len(parts) == 2:
        top_part = parts[0]
        # find the end of the map
        bottom_part = parts[1]
        # bottom part ends with:
        #             );
        #           })}
        #         </div>
        end_idx = bottom_part.find('})}</div>')
        if end_idx == -1:
            end_idx = bottom_part.find('})}\n        </div>')
        if end_idx == -1:
            end_idx = bottom_part.find('})\n        </div>')
            
        # We'll just replace with regex since split might be brittle
        pass
        
    with open('/Users/alex/Desktop/7_24bets-landing-page/components/GamesHeroBanner.tsx', 'w') as f:
        f.write(content)
        
create_games_banner()
