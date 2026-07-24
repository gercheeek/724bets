import re

def fix_map():
    with open('/Users/alex/Desktop/7_24bets-landing-page/components/GamesHeroBanner.tsx', 'r') as f:
        content = f.read()

    # The array is:
    #           ].map((game, idx) => {
    #             const isFocused = hoveredGameId ? game.id === hoveredGameId : false;
    #             
    #             return (
    #             <div 
    #               key={game.id} 
    # ... down to the end of the map.
    
    # Let's find exactly the pattern to replace
    start_str = '          ].map((game, idx) => {'
    end_str = '          })}\n        </div>'
    
    parts = content.split(start_str)
    if len(parts) == 2:
        top_part = parts[0]
        bottom_part = parts[1]
        
        # find the end of the map
        end_idx = bottom_part.rfind('          })}')
        if end_idx != -1:
            rest_of_file = bottom_part[end_idx + len('          })}'):]
            
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
          })}"""
            
            new_content = top_part + start_str + new_map_body + rest_of_file
            
            with open('/Users/alex/Desktop/7_24bets-landing-page/components/GamesHeroBanner.tsx', 'w') as f:
                f.write(new_content)

fix_map()
print("Map logic fixed")
