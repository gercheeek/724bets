const fs = require('fs');
let content = fs.readFileSync('components/sports/GercekView.tsx', 'utf8');

const startMarker = '{/* ── CANLI MAÇLAR (LIVE MATCHES) ── */}';
const endMarker = '        )}';
const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker, startIndex);

if (startIndex !== -1 && endIndex !== -1) {
    const replacement = `{/* ── CANLI MAÇLAR (LIVE MATCHES) ── */}
      <div className="w-full">
        <div className="flex items-center gap-2 mb-4">
          <Play className="w-5 h-5 text-red-500 fill-red-500" />
          <h2 className="text-lg font-bold text-white tracking-wide">Canlı Maçlar</h2>
        </div>

        {isParsing ? (
          <div className="py-24 flex flex-col items-center justify-center text-center bg-[#0b0e11] rounded-xl border border-white/5">
            <div className="relative w-12 h-12 mb-4">
              <span className="animate-ping absolute inset-0 rounded-full bg-[#10b981] opacity-20"></span>
              <div className="w-12 h-12 rounded-full border-2 border-[#10b981]/20 border-t-[#10b981] animate-spin"></div>
            </div>
            <h3 className="text-white text-base font-bold tracking-wide mb-1 animate-pulse">MAÇ BÜLTENİ YÜKLENİYOR...</h3>
          </div>
        ) : filteredMatches.length === 0 ? (
          <div className="py-24 text-center bg-[#0b0e11] rounded-xl border border-white/5">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/10 shadow-lg">
              <Trophy className="w-8 h-8 text-slate-600" />
            </div>
            <p className="text-white font-medium mb-1">Karşılaşma Bulunamadı</p>
            <p className="text-slate-500 text-sm">Bu kategoride şu an aktif veya yaklaşan bir maç yok.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {/* SPORT HEADER (DUMMY FUTBOL) */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between bg-[#11141a] px-4 py-3 rounded-lg border border-white/5">
                <div className="flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4 text-zinc-400" />
                  <span className="text-white font-semibold text-sm">Futbol</span>
                </div>
                <button className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors border border-white/10">
                  <div className="w-2.5 h-0.5 bg-emerald-500 rounded-full"></div>
                </button>
              </div>

            {(() => {
              const liveMatches = filteredMatches.filter(m => m.period === 'Canlı');
              if (liveMatches.length === 0) return null;
              
              const grouped = liveMatches.reduce((acc, match) => {
                const league = match.league || 'Diğer Ligler';
                if (!acc[league]) acc[league] = [];
                acc[league].push(match);
                return acc;
              }, {});

              return Object.entries(grouped).map(([leagueName, leagueMatches]) => {
                const flagCode = ['se','ch','gb','de','es','it','fr','br','ar','pt'][leagueName.length % 10];
                return (
                <div key={leagueName} className="mb-4 bg-[#0b0e11] rounded-lg border border-white/5 overflow-hidden">
                  {/* League Header */}
                  <div className="bg-[#15191f] px-4 py-3 flex items-center justify-between border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <img src={\`https://flagcdn.com/w20/\${flagCode}.png\`} className="w-4 h-3 object-cover rounded-[2px]" />
                      <span className="text-white font-medium text-[13px] tracking-wide">{leagueName}</span>
                      <span className="text-zinc-400 text-[11px] font-bold px-1.5 py-0.5 bg-white/5 rounded ml-1">{leagueMatches.length}</span>
                    </div>
                    <button className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors border border-white/10">
                      <div className="w-2.5 h-0.5 bg-emerald-500 rounded-full"></div>
                    </button>
                  </div>
                  
                  {/* Match Rows */}
                  <div className="flex flex-col">
                    {leagueMatches.map((match, index) => {
                      return (
                      <div key={match.id} className={\`flex flex-col lg:flex-row lg:items-center p-3 gap-4 \${index !== leagueMatches.length - 1 ? 'border-b border-white/5' : ''}\`}>
                        
                        {/* Teams */}
                        <div className="flex-1 flex flex-col gap-2 min-w-0 pr-4">
                           <div className="flex items-center gap-2">
                             <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                               <div className="w-2.5 h-2.5 rounded-full border border-zinc-400/50"></div>
                             </div>
                             <span className="text-zinc-200 font-medium text-[13px] truncate">{match.team1.name}</span>
                           </div>
                           <div className="flex items-center gap-2">
                             <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                               <div className="w-2.5 h-2.5 rounded-full border border-zinc-400/50"></div>
                             </div>
                             <span className="text-zinc-200 font-medium text-[13px] truncate">{match.team2.name}</span>
                           </div>
                        </div>
                        
                        {/* Score & Status */}
                        <div className="flex items-center gap-4 lg:w-[200px] shrink-0 justify-end lg:justify-start">
                          <div className="flex flex-col gap-2 text-right">
                            <span className="text-emerald-500 font-bold text-[13px]">{match.team1.score}</span>
                            <span className="text-emerald-500 font-bold text-[13px]">{match.team2.score}</span>
                          </div>
                          <div className="flex flex-col gap-2 text-right opacity-60">
                            <span className="text-white font-medium text-[13px]">{Math.floor(Math.random() * 3)}</span>
                            <span className="text-white font-medium text-[13px]">{Math.floor(Math.random() * 3)}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 ml-2">
                            <div className="flex flex-col items-center gap-1">
                               <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-[2px] rounded uppercase tracking-wider">CANLI</span>
                               <span className="text-zinc-400 text-[11px] font-medium">{match.minute}'</span>
                            </div>
                            <div className="flex flex-col gap-1.5 opacity-60 ml-2">
                               <BarChart2 className="w-3.5 h-3.5 text-zinc-300" />
                               <Tv className="w-3.5 h-3.5 text-zinc-300" />
                            </div>
                          </div>
                        </div>

                        {/* Odds Actions */}
                        <div className="flex flex-col gap-1 shrink-0 mt-3 lg:mt-0 lg:w-auto w-full">
                          {/* Desktop Headers */}
                          <div className="hidden lg:flex items-center justify-between px-6 text-[10px] text-zinc-500 font-medium mb-1">
                             <span className="w-[70px] text-center">1</span>
                             <span className="w-[70px] text-center">X</span>
                             <span className="w-[70px] text-center">2</span>
                             <span className="w-[45px]"></span>
                          </div>
                          <div className="flex items-center gap-2 justify-between lg:justify-end">
                            <button onClick={() => selectBet(match.id, '1')} className={\`relative w-[70px] h-[36px] flex items-center justify-center rounded bg-[#161920] hover:bg-[#1f242e] transition-all border \${betSlip.some(b => b.id === match.id + '_1') ? 'border-emerald-500/50' : 'border-white/5 hover:border-white/10'}\`}>
                              <span className="text-[13px] text-white font-medium">{match.odds.home}</span>
                              {Math.random() > 0.5 && <div className="absolute top-1 right-1 w-0 h-0 border-l-[3px] border-l-transparent border-b-[4px] border-b-emerald-500 border-r-[3px] border-r-transparent"></div>}
                            </button>
                            <button onClick={() => selectBet(match.id, 'X')} className={\`relative w-[70px] h-[36px] flex items-center justify-center rounded bg-[#161920] hover:bg-[#1f242e] transition-all border \${betSlip.some(b => b.id === match.id + '_X') ? 'border-emerald-500/50' : 'border-white/5 hover:border-white/10'}\`}>
                              <span className="text-[13px] text-white font-medium">{match.odds.draw}</span>
                            </button>
                            <button onClick={() => selectBet(match.id, '2')} className={\`relative w-[70px] h-[36px] flex items-center justify-center rounded bg-[#161920] hover:bg-[#1f242e] transition-all border \${betSlip.some(b => b.id === match.id + '_2') ? 'border-emerald-500/50' : 'border-white/5 hover:border-white/10'}\`}>
                              <span className="text-[13px] text-white font-medium">{match.odds.away}</span>
                              {Math.random() > 0.5 && <div className="absolute bottom-1 right-1 w-0 h-0 border-l-[3px] border-l-transparent border-t-[4px] border-t-red-500 border-r-[3px] border-r-transparent"></div>}
                            </button>
                            <button className="w-[45px] h-[36px] flex items-center justify-center rounded bg-[#161920] hover:bg-[#1f242e] transition-all border border-white/5 text-zinc-300 text-[11px] font-medium ml-1">
                              +{match.totalMarkets}
                            </button>
                          </div>
                        </div>

                      </div>
                    )})}
                  </div>
                </div>
              )});
            })()}
            </div>
          </div>`;

    content = content.slice(0, startIndex) + replacement + '\n' + content.slice(endIndex);
    fs.writeFileSync('components/sports/GercekView.tsx', content);
    console.log("Successfully replaced Live Matches section");
} else {
    console.log("Could not find start/end markers");
}
