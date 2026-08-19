import React, { useMemo } from 'react';
import { useBetting } from '../contexts/BettingContext';
import { Play, Activity, Clock, Trophy } from 'lucide-react';

const DenemePage: React.FC = () => {
  const context = useBetting();
  const events = context?.events || [];

  // Group events by league
  const groupedEvents = useMemo(() => {
    const groups: Record<string, typeof events> = {};
    events.forEach(e => {
      const lg = e.league || 'Diğer';
      if (!groups[lg]) groups[lg] = [];
      groups[lg].push(e);
    });
    return groups;
  }, [events]);

  const getLogoUrl = (teamName?: string) => {
    if (!teamName) return '';
    const name = encodeURIComponent(teamName.trim().substring(0, 2));
    return `https://ui-avatars.com/api/?name=${name}&background=1a202c&color=fff&rounded=true&size=32&font-size=0.4`;
  };

  return (
    <div className="w-full h-full bg-[#1e2329] text-[#b3b9c1] overflow-y-auto flex flex-col font-sans text-xs">
      
      {/* 1xBet style top bar */}
      <div className="bg-[#14181d] border-b border-[#2a3038] p-3 flex items-center justify-between shadow-sm sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-[#33bbff]" />
          <h1 className="text-white font-bold text-sm tracking-wide uppercase">Canlı Bahisler (1xFrame Deneme)</h1>
        </div>
        <div className="flex gap-4">
          <button className="bg-[#2a3038] hover:bg-[#343b45] text-white px-3 py-1.5 rounded transition-colors flex items-center gap-2">
             <Trophy className="w-3 h-3 text-[#f6c644]" />
             Popüler
          </button>
        </div>
      </div>

      <div className="flex-1 p-2 md:p-4 max-w-[1400px] mx-auto w-full">
        {Object.entries(groupedEvents).map(([league, matches]) => (
          <div key={league} className="mb-4 bg-[#14181d] rounded overflow-hidden shadow-lg border border-[#2a3038]">
            {/* League Header */}
            <div className="bg-[#21262d] p-2 flex items-center gap-2 border-b border-[#2a3038]">
              <div className="w-5 h-5 bg-[#33bbff]/20 rounded flex items-center justify-center">
                <Trophy className="w-3 h-3 text-[#33bbff]" />
              </div>
              <span className="text-white font-semibold uppercase text-[11px] tracking-wider">{league}</span>
            </div>

            {/* Matches List */}
            <div className="flex flex-col">
              {matches.map(match => (
                <div key={match.id} className="group flex flex-col md:flex-row items-stretch border-b border-[#2a3038] last:border-b-0 hover:bg-[#1a1f24] transition-colors cursor-pointer">
                  
                  {/* Left: Info & Teams */}
                  <div className="flex-1 flex flex-col justify-center p-3 border-r border-[#2a3038]">
                    <div className="flex items-center gap-2 mb-2 text-[#647182] text-[10px] font-medium">
                       {match.is_live ? (
                          <span className="flex items-center gap-1 text-[#00E676] bg-[#00E676]/10 px-1.5 py-0.5 rounded">
                            <Clock className="w-3 h-3" />
                            {match.match_minute || '1Y'}
                          </span>
                       ) : (
                          <span className="flex items-center gap-1">
                             <Clock className="w-3 h-3" />
                             Başlamadı
                          </span>
                       )}
                    </div>
                    
                    <div className="flex flex-col gap-2">
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img src={getLogoUrl(match.team_home)} alt={match.team_home} className="w-4 h-4" />
                            <span className="text-[#e1e6eb] font-medium group-hover:text-[#33bbff] transition-colors">{match.team_home}</span>
                          </div>
                          {match.is_live && (
                            <span className="text-[#f6c644] font-bold text-sm w-6 text-center">{match.score_home || 0}</span>
                          )}
                       </div>
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img src={getLogoUrl(match.team_away)} alt={match.team_away} className="w-4 h-4" />
                            <span className="text-[#e1e6eb] font-medium group-hover:text-[#33bbff] transition-colors">{match.team_away}</span>
                          </div>
                          {match.is_live && (
                            <span className="text-[#f6c644] font-bold text-sm w-6 text-center">{match.score_away || 0}</span>
                          )}
                       </div>
                    </div>
                  </div>

                  {/* Right: Odds (Dense Table Style) */}
                  <div className="flex-none flex items-center p-2 gap-1 bg-[#14181d] group-hover:bg-[#1a1f24] transition-colors overflow-x-auto hide-scrollbar">
                    {/* 1X2 Block */}
                    <div className="flex flex-col gap-1 pr-2 border-r border-[#2a3038]">
                       <div className="text-[10px] text-center text-[#647182] font-semibold tracking-wide">1X2</div>
                       <div className="flex gap-1">
                         <button className="bg-[#21262d] hover:bg-[#33bbff] hover:text-white text-white border border-[#2a3038] hover:border-[#33bbff] rounded flex items-center justify-center w-12 h-9 transition-all">
                           {match.odds?.['1'] || '-'}
                         </button>
                         <button className="bg-[#21262d] hover:bg-[#33bbff] hover:text-white text-white border border-[#2a3038] hover:border-[#33bbff] rounded flex items-center justify-center w-12 h-9 transition-all">
                           {match.odds?.['X'] || '-'}
                         </button>
                         <button className="bg-[#21262d] hover:bg-[#33bbff] hover:text-white text-white border border-[#2a3038] hover:border-[#33bbff] rounded flex items-center justify-center w-12 h-9 transition-all">
                           {match.odds?.['2'] || '-'}
                         </button>
                       </div>
                    </div>

                    {/* Double Chance Block */}
                    <div className="flex flex-col gap-1 px-2 border-r border-[#2a3038]">
                       <div className="text-[10px] text-center text-[#647182] font-semibold tracking-wide">ÇİFTE ŞANS</div>
                       <div className="flex gap-1">
                         <button className="bg-[#21262d] hover:bg-[#33bbff] hover:text-white text-white border border-[#2a3038] hover:border-[#33bbff] rounded flex items-center justify-center w-12 h-9 transition-all">
                           {match.odds?.['cs1X'] || '-'}
                         </button>
                         <button className="bg-[#21262d] hover:bg-[#33bbff] hover:text-white text-white border border-[#2a3038] hover:border-[#33bbff] rounded flex items-center justify-center w-12 h-9 transition-all">
                           {match.odds?.['cs12'] || '-'}
                         </button>
                         <button className="bg-[#21262d] hover:bg-[#33bbff] hover:text-white text-white border border-[#2a3038] hover:border-[#33bbff] rounded flex items-center justify-center w-12 h-9 transition-all">
                           {match.odds?.['csX2'] || '-'}
                         </button>
                       </div>
                    </div>

                    {/* Over/Under 2.5 Block */}
                    <div className="flex flex-col gap-1 px-2">
                       <div className="text-[10px] text-center text-[#647182] font-semibold tracking-wide">ALT/ÜST (2.5)</div>
                       <div className="flex gap-1">
                         <button className="bg-[#21262d] hover:bg-[#33bbff] hover:text-white text-white border border-[#2a3038] hover:border-[#33bbff] rounded flex items-center justify-center w-12 h-9 transition-all">
                           {match.odds?.['tA'] || '-'}
                         </button>
                         <button className="bg-[#21262d] hover:bg-[#33bbff] hover:text-white text-white border border-[#2a3038] hover:border-[#33bbff] rounded flex items-center justify-center w-12 h-9 transition-all">
                           {match.odds?.['tU'] || '-'}
                         </button>
                       </div>
                    </div>

                    {/* Extra Markets Link */}
                    <button className="ml-2 bg-[#21262d] hover:bg-[#2a3038] text-[#33bbff] font-medium border border-[#2a3038] rounded flex flex-col items-center justify-center w-10 h-9 transition-all">
                       <span>+90</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {events.length === 0 && (
          <div className="text-center py-20 text-[#647182]">
            <Play className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">Şu an aktif canlı maç bulunmuyor.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DenemePage;
