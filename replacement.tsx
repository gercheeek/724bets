        {/* Dynamic Featured Matches */}
        {(() => {
          const featuredMatches = filteredMatches.filter(m => m.period === 'Canlı').slice(0, 5);
          if (featuredMatches.length === 0) {
            featuredMatches.push(...filteredMatches.filter(m => m.period !== 'Canlı').slice(0, 5));
          }
          
          return featuredMatches.map((match) => (
            <div key={`featured-${match.id}`} className="min-w-[300px] sm:min-w-[340px] md:min-w-[360px] bg-[#111111] rounded-xl p-4 flex flex-col gap-4 snap-center border border-white/5 shadow-[0_15px_30px_rgba(0,0,0,0.4)] relative overflow-hidden group hover:border-[#00E676]/30 hover:shadow-[0_0_35px_rgba(0,230,118,0.15)] transition-all duration-500">
              <div className="flex items-center justify-between text-xs text-white/50 font-medium gap-2 relative z-10">
                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                  <Flame className="w-3.5 h-3.5 shrink-0 text-amber-500 drop-shadow-[0_0_5px_rgba(245,158,11,0.5)]" />
                  <span className="truncate text-slate-300 font-medium">{match.league}</span>
                </div>
                <span className="shrink-0 text-[#10b981] bg-[#10b981]/10 px-2 py-0.5 rounded-full border border-[#10b981]/20 font-bold">{match.minute}'</span>
              </div>
              <div className="flex items-center justify-between mt-1 relative z-10">
                <div className="flex flex-col items-start gap-2 max-w-[40%]">
                  <div className="w-9 h-9 rounded-full bg-[#1a1a1a] flex items-center justify-center overflow-hidden border border-white/10 shadow-inner">
                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(match.team1.name)}&background=181a24&color=fff&rounded=true`} className="w-full h-full object-contain p-1.5" alt={match.team1.name} />
                  </div>
                  <span className="font-bold text-white text-[15px] tracking-tight truncate w-full">{match.team1.name}</span>
                </div>
                
                <div className="flex flex-col items-center justify-center shrink-0">
                   <div className="bg-black/60 border border-white/10 rounded-lg px-3 py-1 flex items-center justify-center backdrop-blur-sm shadow-inner">
                      <span className="text-white font-black text-lg tracking-widest">{match.team1.score} : {match.team2.score}</span>
                   </div>
                </div>

                <div className="flex flex-col items-end gap-2 text-right max-w-[40%]">
                  <div className="w-9 h-9 rounded-full bg-[#1a1a1a] flex items-center justify-center overflow-hidden border border-white/10 shadow-inner">
                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(match.team2.name)}&background=181a24&color=fff&rounded=true`} className="w-full h-full object-contain p-1.5" alt={match.team2.name} />
                  </div>
                  <span className="font-bold text-white text-[15px] tracking-tight truncate w-full text-right">{match.team2.name}</span>
                </div>
              </div>
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-gradient-radial from-[#00E676]/15 to-transparent blur-2xl rounded-full pointer-events-none group-hover:from-[#00E676]/25 transition-all duration-700"></div>
              <div className="flex flex-col gap-2 mt-auto relative z-10">
                <div className="text-center text-[10px] text-[#8e939d] uppercase tracking-widest font-semibold mb-1">Maç Sonucu</div>
                <div className="flex items-center gap-2">
                  <button onClick={() => selectBet(match.id, '1')} className={`flex-1 ${selectedBets[match.id] === '1' ? 'bg-[#10b981] border-[#10b981]' : 'bg-[#161616] hover:bg-[#222222] border-transparent hover:border-[#00E676]/50'} border hover:shadow-[0_0_15px_rgba(0,230,118,0.2)] transition-all duration-300 rounded-lg p-3 flex justify-between items-center group/btn`}>
                    <span className={`${selectedBets[match.id] === '1' ? 'text-black' : 'text-[#8e939d] group-hover/btn:text-white'} text-xs font-bold transition-colors`}>1</span>
                    <span className={`${selectedBets[match.id] === '1' ? 'text-black' : 'text-white'} font-black text-[15px]`}>{match.odds.home}</span>
                  </button>
                  <button onClick={() => selectBet(match.id, 'X')} className={`flex-1 ${selectedBets[match.id] === 'X' ? 'bg-[#10b981] border-[#10b981]' : 'bg-[#161616] hover:bg-[#222222] border-transparent hover:border-[#00E676]/50'} border hover:shadow-[0_0_15px_rgba(0,230,118,0.2)] transition-all duration-300 rounded-lg p-3 flex justify-between items-center group/btn`}>
                    <span className={`${selectedBets[match.id] === 'X' ? 'text-black' : 'text-[#8e939d] group-hover/btn:text-white'} text-xs font-bold transition-colors`}>X</span>
                    <span className={`${selectedBets[match.id] === 'X' ? 'text-black' : 'text-white'} font-black text-[15px]`}>{match.odds.draw}</span>
                  </button>
                  <button onClick={() => selectBet(match.id, '2')} className={`flex-1 ${selectedBets[match.id] === '2' ? 'bg-[#10b981] border-[#10b981]' : 'bg-[#161616] hover:bg-[#222222] border-transparent hover:border-[#00E676]/50'} border hover:shadow-[0_0_15px_rgba(0,230,118,0.2)] transition-all duration-300 rounded-lg p-3 flex justify-between items-center group/btn`}>
                    <span className={`${selectedBets[match.id] === '2' ? 'text-black' : 'text-[#8e939d] group-hover/btn:text-white'} text-xs font-bold transition-colors`}>2</span>
                    <span className={`${selectedBets[match.id] === '2' ? 'text-black' : 'text-white'} font-black text-[15px]`}>{match.odds.away}</span>
                  </button>
                </div>
              </div>
            </div>
          ));
        })()}
