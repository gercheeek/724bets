import React from 'react';
import { Star, Lock } from 'lucide-react';
import { useBetting } from '../contexts/BettingContext';

export const MatchRow: React.FC<{ event: any }> = ({ event }) => {
  const { betSelections, toggleBetSelection, setSelectedMatch } = useBetting();
  const data = event.data || {};
  const home = data.participants?.home || 'Ev Sahibi';
  const away = data.participants?.away || 'Deplasman';
  const currentScore = data.current_score || '0:0';
  const [homeScore, awayScore] = currentScore.includes(':') ? currentScore.split(':') : [currentScore, ''];
  const time = data.minute ? `${data.minute}'` : (data.start_time ? new Date(data.start_time).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : '');
  const date = data.start_time ? new Date(data.start_time).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '';

  // Parse odds logic (duplicated from SporxBulletin or passed as props. Let's do it here to keep MatchRow encapsulated)
  let odd1 = "-", oddX = "-", odd2 = "-";
  let hasOdds = false;
  let isMatchLocked = false;
  let extraMarkets = 0;

  if (data.group_markets) {
    const group = data.group_markets['full_event|0'] || data.group_markets['current|0'];
    if (group) {
      for (const marketStr of group) {
        if (typeof marketStr === 'string' && (marketStr.includes('|1x2|') || marketStr.includes('|12|') || marketStr.includes('~draw~'))) {
          const homeMatch = marketStr.match(/~home~([\d.]+)~[\d.]+~[\d.]+~[\d.]+~1~/);
          const drawMatch = marketStr.match(/~draw~([\d.]+)~[\d.]+~[\d.]+~[\d.]+~1~/) || marketStr.match(/~x~([\d.]+)~[\d.]+~[\d.]+~[\d.]+~1~/);
          const awayMatch = marketStr.match(/~away~([\d.]+)~[\d.]+~[\d.]+~[\d.]+~1~/);
          
          if (homeMatch) odd1 = parseFloat(homeMatch[1]).toFixed(2);
          if (drawMatch) oddX = parseFloat(drawMatch[1]).toFixed(2);
          if (awayMatch) odd2 = parseFloat(awayMatch[1]).toFixed(2);
          
          if (odd1 !== '-' || odd2 !== '-') hasOdds = true;
          if (hasOdds) break;
        }
      }
    }
    const allGroups = Object.keys(data.group_markets).reduce((acc, k) => acc + data.group_markets[k].length, 0);
    extraMarkets = allGroups > 0 ? allGroups : 0;
  }
  if (!hasOdds && data.status === 'started') {
    isMatchLocked = true;
  }

  return (
    <div className="flex items-center border-b border-white/10 last:border-0 hover:bg-white/5 transition-colors px-4 py-3 group cursor-pointer" onClick={() => setSelectedMatch(event)}>
      
      {/* Time & Teams */}
      <div className="flex-1 flex items-center gap-4">
        <div className="flex flex-col w-20 shrink-0">
          <span className="text-[10px] font-medium text-zinc-500">{date}</span>
          <span className={`text-[14px] font-black ${data.minute ? 'text-[#10B981] animate-pulse' : 'text-zinc-300'}`}>{time || (data.start_time ? new Date(data.start_time).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : 'Belirsiz')}</span>
        </div>
        
        <div className="flex flex-col gap-2 flex-1">
          <div className="flex items-center gap-2">
            <div className={`w-1 h-4 rounded ${data.minute ? 'bg-[#10B981]' : 'bg-white/20'}`}></div>
            <span className="text-[14px] font-semibold text-zinc-200 group-hover:text-white transition-colors">{home}</span>
            {data.minute && <span className="text-sm font-black text-[#10B981] ml-auto bg-[#10B981]/10 px-2 py-0.5 rounded">{homeScore}</span>}
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-1 h-4 rounded ${data.minute ? 'bg-[#10B981]' : 'bg-white/20'}`}></div>
            <span className="text-[14px] font-semibold text-zinc-200 group-hover:text-white transition-colors">{away}</span>
            {data.minute && <span className="text-sm font-black text-[#10B981] ml-auto bg-[#10B981]/10 px-2 py-0.5 rounded">{awayScore}</span>}
          </div>
        </div>
      </div>

      {/* Favorite Icon */}
      <button className="px-4 text-zinc-600 hover:text-[#10B981] transition-colors shrink-0" onClick={(e) => { e.stopPropagation(); }}>
        <Star className="w-4 h-4" />
      </button>

      {/* Odds */}
      <div className="flex gap-2 w-[240px] shrink-0">
        {isMatchLocked ? (
          <>
            <div className="flex-1 h-10 rounded-lg border border-white/5 bg-black/20 flex items-center justify-center"><Lock className="w-3.5 h-3.5 text-zinc-600" /></div>
            <div className="flex-1 h-10 rounded-lg border border-white/5 bg-black/20 flex items-center justify-center"><Lock className="w-3.5 h-3.5 text-zinc-600" /></div>
            <div className="flex-1 h-10 rounded-lg border border-white/5 bg-black/20 flex items-center justify-center"><Lock className="w-3.5 h-3.5 text-zinc-600" /></div>
          </>
        ) : (
          <>
            {[
              { label: '1', odd: odd1, sel: home },
              { label: 'X', odd: oddX, sel: 'Beraberlik' },
              { label: '2', odd: odd2, sel: away }
            ].map((btn, i) => {
              if (btn.odd === '-') return <div key={i} className="flex-1 h-10 rounded-lg border border-white/5 bg-black/20" />;
              
              const isSel = betSelections.some(b => b.matchId === event.id && b.marketName === '1x2' && b.selectionName === btn.sel);
              return (
                <button 
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBetSelection(event, '1x2', btn.sel, parseFloat(btn.odd));
                  }}
                  className={`flex-1 h-10 rounded-lg border flex items-center justify-center text-[13px] font-bold shadow-sm transition-all ${
                    isSel 
                      ? 'bg-[#10B981] border-[#10B981] text-black shadow-[#10B981]/20' 
                      : 'border-white/10 bg-[#161920] hover:border-[#10B981]/50 hover:bg-[#10B981]/10 text-white hover:text-[#10B981]'
                  }`}
                >
                  {btn.odd}
                </button>
              );
            })}
          </>
        )}
        <button 
          onClick={(e) => { e.stopPropagation(); setSelectedMatch(event); }}
          className="w-14 shrink-0 h-10 rounded-lg border border-[#10B981]/20 bg-[#10B981]/5 hover:bg-[#10B981]/20 hover:border-[#10B981]/50 flex items-center justify-center text-[11px] font-black text-[#10B981] transition-all shadow-sm shadow-[#10B981]/5"
        >
          +{extraMarkets}
        </button>
      </div>
    </div>
  );
};
