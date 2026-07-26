const fs = require('fs');

let content = fs.readFileSync('components/sports/GercekView.tsx', 'utf8');

if (!content.includes('Calendar')) {
    content = content.replace('import { \n  Radio,', 'import { \n  Radio,\n  Calendar,\n  Clock,');
}

const featuredDummy = `
const FEATURED_DUMMY = [
  { id: 'f1', league: 'UFC Fight Night', time: '21 dakika içinde başlıyor', team1: 'Zaynukov, Magomed', team2: 'Rzepecki, Damian', date: 'Bugün', hour: '20:05', flag1: 'ru', flag2: 'pl', odds1: '1.40', odds2: '3.20' },
  { id: 'f2', league: 'UFC Fight Night', time: '1 dakika içinde başlıyor', team1: 'Kuniev, Rizvan', team2: 'Fortune, Tyrell', date: 'Bugün', hour: '19:45', flag1: 'ru', flag2: 'us', odds1: '1.32', odds2: '3.65' },
  { id: 'f3', league: 'UFC Fight Night', time: '1 saat içinde başlıyor', team1: 'Erceg, Steve', team2: 'Temirov, Ramazonbek', date: 'Bugün', hour: '20:45', flag1: 'au', flag2: 'uz', odds1: '1.88', odds2: '2.00' },
  { id: 'f4', league: 'International Matchups', time: '4 saat içinde başlıyor', team1: 'Plex', team2: 'Fernanfloo', date: 'Yarın', hour: '00:00', flag1: 'es', flag2: 'mx', odds1: '1.10', odds2: '5.20' },
  { id: 'f5', league: 'UFC Fight Night', time: '1 saat içinde başlıyor', team1: 'Ankalaev, Magomed', team2: 'Guskov, Bogdan', date: 'Bugün', hour: '21:05', flag1: 'ru', flag2: 'uz', odds1: '1.19', odds2: '5.20' },
  { id: 'f6', league: 'International Matchups', time: '3 saat içinde başlıyor', team1: 'Lit Killah', team2: 'Kidd Keo', date: 'Bugün', hour: '23:00', flag1: 'ar', flag2: 'es', odds1: '1.43', odds2: '2.70' },
  { id: 'f7', league: 'International Matchups', time: '2 saat içinde başlıyor', team1: 'Viruzz', team2: 'Arias, Gero', date: 'Bugün', hour: '22:00', flag1: 'es', flag2: 'ar', odds1: '2.22', odds2: '1.61' },
  { id: 'f8', league: 'International Matchups', time: '4 saat içinde başlıyor', team1: 'Illojuan', team2: 'Thegrefg', date: 'Yarın', hour: '00:30', flag1: 'es', flag2: 'es', odds1: '3.85', odds2: '1.20' }
];
`;

if (!content.includes('FEATURED_DUMMY')) {
    content = content.replace('const SPORTS_NAV = [', featuredDummy + '\nconst SPORTS_NAV = [');
}

const replacementStart = `<div className="mb-8">
        <SportsHeroBanner />
      </div>`;

const replacementCode = `
      {/* ── ÖNE ÇIKANLAR (FEATURED) ── */}
      <div className="w-full mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Flame className="w-5 h-5 text-orange-400" />
          <h2 className="text-lg font-bold text-white tracking-wide">Öne Çıkanlar</h2>
        </div>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {FEATURED_DUMMY.map((match) => (
            <div key={match.id} className="bg-[#1e232b] rounded-xl p-3 flex flex-col gap-3 border border-white/5 relative overflow-hidden transition-all hover:bg-[#252b36] cursor-pointer shadow-lg hover:border-white/10">
              <div className="flex items-center justify-between text-[11px] text-zinc-400 border-b border-white/5 pb-2">
                <div className="flex items-center gap-1.5 truncate">
                  <Gamepad2 className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{match.league}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{match.time}</span>
                  <BarChart2 className="w-3.5 h-3.5 ml-1" />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex flex-col gap-2 flex-1 min-w-0 pr-2">
                  <div className="flex items-center gap-2">
                    <img src={\`https://flagcdn.com/w20/\${match.flag1}.png\`} className="w-4 h-4 rounded-full object-cover shrink-0" />
                    <span className="text-white font-medium text-xs truncate">{match.team1}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <img src={\`https://flagcdn.com/w20/\${match.flag2}.png\`} className="w-4 h-4 rounded-full object-cover shrink-0" />
                    <span className="text-white font-medium text-xs truncate">{match.team2}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0 text-[11px] text-zinc-400">
                  <div className="flex items-center gap-1">
                     <span>{match.date}</span>
                     <Calendar className="w-3 h-3" />
                  </div>
                  <div className="flex items-center gap-1">
                     <span>{match.hour}</span>
                     <Clock className="w-3 h-3" />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-auto">
                <button 
                  onClick={(e) => { e.stopPropagation(); selectBet(match.id, '1'); }}
                  className={\`flex-1 flex justify-between items-center rounded-lg px-3 py-2 text-xs font-medium transition-all \${
                    betSlip.some(b => b.id === \`\${match.id}_1\`) ? 'bg-[#00ff88] text-black shadow-[0_0_10px_rgba(0,255,136,0.2)]' : 'bg-[#15191f] text-zinc-300 hover:bg-[#2c3340]'
                  }\`}
                >
                  <span className="opacity-60">1</span>
                  <span>{match.odds1}</span>
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); selectBet(match.id, '2'); }}
                  className={\`flex-1 flex justify-between items-center rounded-lg px-3 py-2 text-xs font-medium transition-all \${
                    betSlip.some(b => b.id === \`\${match.id}_2\`) ? 'bg-[#00ff88] text-black shadow-[0_0_10px_rgba(0,255,136,0.2)]' : 'bg-[#15191f] text-zinc-300 hover:bg-[#2c3340]'
                  }\`}
                >
                  <span className="opacity-60">2</span>
                  <span>{match.odds2}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CANLI MAÇLAR (LIVE MATCHES) ── */}
      <div className="w-full">
        <div className="flex items-center gap-2 mb-4">
          <Play className="w-5 h-5 text-red-500 fill-red-500" />
          <h2 className="text-lg font-bold text-white tracking-wide">Canlı Maçlar</h2>
        </div>

        {isParsing ? (
          <div className="py-24 flex flex-col items-center justify-center text-center bg-[#1e232b] rounded-2xl border border-white/5 shadow-inner">
            <div className="relative w-12 h-12 mb-4">
              <span className="animate-ping absolute inset-0 rounded-full bg-[#10b981] opacity-20"></span>
              <div className="w-12 h-12 rounded-full border-2 border-[#10b981]/20 border-t-[#10b981] animate-spin"></div>
            </div>
            <h3 className="text-white text-base font-bold tracking-wide mb-1 animate-pulse">MAÇ BÜLTENİ YÜKLENİYOR...</h3>
          </div>
        ) : filteredMatches.length === 0 ? (
          <div className="py-24 text-center bg-[#1e232b] rounded-2xl border border-white/5 shadow-[inset_0_4px_20px_rgba(0,0,0,0.5)]">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/10 shadow-lg">
              <Trophy className="w-8 h-8 text-slate-600" />
            </div>
            <p className="text-white font-medium mb-1">Karşılaşma Bulunamadı</p>
            <p className="text-slate-500 text-sm">Bu kategoride şu an aktif veya yaklaşan bir maç yok.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
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
                // generate a stable flag based on league name length
                const flagCode = ['se','ch','gb','de','es','it','fr','br','ar','pt'][leagueName.length % 10];
                return (
                <div key={leagueName} className="mb-4">
                  {/* League Header */}
                  <div className="bg-[#1e232b] px-4 py-3 flex items-center justify-between border-b border-white/5 rounded-t-xl hover:bg-[#252b36] cursor-pointer transition-colors">
                    <div className="flex items-center gap-2">
                      <img src={\`https://flagcdn.com/w20/\${flagCode}.png\`} className="w-4 h-4 rounded-full object-cover border border-white/10 shadow-sm" />
                      <span className="text-white font-semibold text-[13px] tracking-wide">{leagueName}</span>
                      <span className="text-zinc-500 text-[11px] font-bold px-1.5 py-0.5 bg-black/20 rounded ml-2">{leagueMatches.length}</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-zinc-500" />
                  </div>
                  
                  {/* Match Rows */}
                  <div className="flex flex-col rounded-b-xl overflow-hidden shadow-lg border border-white/5 border-t-0">
                    {leagueMatches.map((match, index) => {
                      const flag1 = ['se','ch','gb','de','es','it','fr','br','ar','pt'][(match.team1.name.length * 3) % 10];
                      const flag2 = ['se','ch','gb','de','es','it','fr','br','ar','pt'][(match.team2.name.length * 7) % 10];
                      return (
                      <div key={match.id} className={\`flex flex-col lg:flex-row lg:items-center bg-[#161920] hover:bg-[#1a1e25] transition-all p-3 gap-4 \${index !== leagueMatches.length - 1 ? 'border-b border-white/[0.03]' : ''}\`}>
                        
                        {/* Teams & Scores */}
                        <div className="flex-1 flex flex-row items-center gap-4 min-w-0">
                           <div className="flex-1 flex flex-col gap-2 min-w-0">
                             <div className="flex items-center gap-3">
                               <img src={\`https://flagcdn.com/w20/\${flag1}.png\`} className="w-4 h-4 rounded-full object-cover shrink-0" />
                               <span className="text-white font-medium text-[13px] truncate">{match.team1.name}</span>
                             </div>
                             <div className="flex items-center gap-3">
                               <img src={\`https://flagcdn.com/w20/\${flag2}.png\`} className="w-4 h-4 rounded-full object-cover shrink-0" />
                               <span className="text-white font-medium text-[13px] truncate">{match.team2.name}</span>
                             </div>
                           </div>
                           
                           {/* Score / Status */}
                           <div className="flex items-center gap-4 pl-4 border-l border-white/5 shrink-0">
                             <div className="flex flex-col gap-2 text-center text-white font-bold text-[14px]">
                               <span>{match.team1.score}</span>
                               <span>{match.team2.score}</span>
                             </div>
                             <div className="flex flex-col items-center justify-center gap-1 min-w-[50px]">
                               <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]">CANLI</span>
                               <span className="text-zinc-400 text-[11px] font-medium">{match.minute}'</span>
                             </div>
                             <div className="flex flex-col sm:flex-row gap-2 shrink-0 opacity-70">
                               <BarChart2 className="w-4 h-4 text-zinc-500 hover:text-white cursor-pointer transition-colors" />
                               <Tv className="w-4 h-4 text-zinc-500 hover:text-white cursor-pointer transition-colors" />
                             </div>
                           </div>
                        </div>

                        {/* Odds Actions */}
                        <div className="flex items-center gap-1 shrink-0 mt-3 lg:mt-0 justify-between lg:justify-end">
                          <button onClick={() => selectBet(match.id, '1')} className={\`flex-1 lg:w-[65px] h-[45px] flex flex-col items-center justify-center rounded bg-[#111419] hover:bg-[#252b36] transition-all border border-transparent hover:border-white/10 \${betSlip.some(b => b.id === match.id + '_1') ? '!bg-[#00ff88] text-black shadow-[0_0_15px_rgba(0,255,136,0.15)] scale-[1.02] z-10' : 'text-zinc-300'}\`}>
                            <span className="text-[10px] opacity-60 mb-0.5 font-bold">1</span>
                            <span className="text-[13px] font-black">{match.odds.home}</span>
                          </button>
                          <button onClick={() => selectBet(match.id, 'X')} className={\`flex-1 lg:w-[65px] h-[45px] flex flex-col items-center justify-center rounded bg-[#111419] hover:bg-[#252b36] transition-all border border-transparent hover:border-white/10 \${betSlip.some(b => b.id === match.id + '_X') ? '!bg-[#00ff88] text-black shadow-[0_0_15px_rgba(0,255,136,0.15)] scale-[1.02] z-10' : 'text-zinc-300'}\`}>
                            <span className="text-[10px] opacity-60 mb-0.5 font-bold">X</span>
                            <span className="text-[13px] font-black">{match.odds.draw}</span>
                          </button>
                          <button onClick={() => selectBet(match.id, '2')} className={\`flex-1 lg:w-[65px] h-[45px] flex flex-col items-center justify-center rounded bg-[#111419] hover:bg-[#252b36] transition-all border border-transparent hover:border-white/10 \${betSlip.some(b => b.id === match.id + '_2') ? '!bg-[#00ff88] text-black shadow-[0_0_15px_rgba(0,255,136,0.15)] scale-[1.02] z-10' : 'text-zinc-300'}\`}>
                            <span className="text-[10px] opacity-60 mb-0.5 font-bold">2</span>
                            <span className="text-[13px] font-black">{match.odds.away}</span>
                          </button>
                          <button className="w-[45px] h-[45px] flex items-center justify-center rounded bg-transparent hover:bg-white/5 text-zinc-400 hover:text-white text-[11px] font-bold ml-1 transition-colors border border-transparent hover:border-white/10">
                            +{match.totalMarkets}
                          </button>
                        </div>

                      </div>
                    )})}
                  </div>
                </div>
              )});
            })()}
          </div>
        )}
      </div>

    </div>
  );
};

export default GercekView;
`;

const startIndex = content.indexOf(replacementStart);
if (startIndex !== -1) {
    content = content.slice(0, startIndex) + replacementCode;
    fs.writeFileSync('components/sports/GercekView.tsx', content);
    console.log("Successfully replaced layout");
} else {
    console.log("Could not find replacement start marker");
}
