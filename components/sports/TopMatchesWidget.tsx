import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Users, BarChart3, TrendingUp, Flame } from 'lucide-react';
import { MatchInfo } from './types';
import { useBetSlip } from '../../contexts/BetSlipContext';
import { PlayerLogo } from './PlayerLogo';
import { AnimatedOdd } from '../AnimatedOdd';

interface TopMatchesWidgetProps {
  matches: MatchInfo[];
}

// Helper to get dummy viewers based on match ID for consistency
const getDummyViewers = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return (Math.abs(hash) % 8000 + 1500).toLocaleString('tr-TR');
};

// Helper to get dummy "fire" percentage
const getDummyFireStats = (match: MatchInfo) => {
  let hash = 0;
  const str = match.id + match.home;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const pct = Math.abs(hash) % 40 + 55; // 55% to 95%
  const team = pct % 2 === 0 ? match.home : (match.away || match.home);
  return { pct, team };
};

// Helper to generate mock odds for Over/Under and GG/NG based on match ID
const getMockOdds = (match: MatchInfo, type: 'ou' | 'gg') => {
  let hash = 0;
  for (let i = 0; i < match.id.length; i++) {
    hash = match.id.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  if (type === 'ou') {
    const baseOver = 1.40 + (Math.abs(hash) % 100) / 100;
    const baseUnder = 3.50 - (Math.abs(hash) % 100) / 100;
    return {
      over: baseOver.toFixed(2),
      under: baseUnder.toFixed(2)
    };
  } else {
    const baseGg = 1.60 + (Math.abs(hash) % 80) / 100;
    const baseNg = 2.80 - (Math.abs(hash) % 80) / 100;
    return {
      gg: baseGg.toFixed(2),
      ng: baseNg.toFixed(2)
    };
  }
};

// Top tier leagues whitelist
const ELITE_LEAGUES = [
  'şampiyonlar ligi', 'champions league', 'premier', 'süper lig', 'la liga', 
  'serie a', 'bundesliga', 'euroleague', 'nba', 'avrupa ligi', 'europa league',
  'konferans ligi', 'conference league', 'dünya kupası', 'world cup', 'avrupa şampiyonası'
];

const POPULAR_TEAMS = ['galatasaray', 'fenerbahçe', 'beşiktaş', 'trabzonspor', 'real madrid', 'barcelona', 'manchester', 'bayern', 'arsenal', 'liverpool', 'psg', 'juventus', 'inter', 'milan', 'chelsea'];

export const TopMatchesWidget: React.FC<TopMatchesWidgetProps> = ({ matches }) => {
  const { addSelection } = useBetSlip();
  const [now, setNow] = useState(Date.now());
  const [scrollIdx, setScrollIdx] = useState(0);
  const [oddsOverride, setOddsOverride] = useState<Record<string, any>>({});

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    
    // Simulate live odds changing
    const oddsTimer = setInterval(() => {
      setOddsOverride(prev => {
        const next = { ...prev };
        topMatches.filter(m => m.isLive).forEach(m => {
          // 30% chance to change odds every 4 seconds for a live match
          if (Math.random() < 0.3) {
             const baseH = parseFloat(next[m.id]?.home || m.homeOdd);
             const baseD = parseFloat(next[m.id]?.draw || m.drawOdd);
             const baseA = parseFloat(next[m.id]?.away || m.awayOdd);
             const baseOu = getMockOdds(m, 'ou');
             const baseGg = getMockOdds(m, 'gg');
             const baseOver = parseFloat(next[m.id]?.over || baseOu.over);
             const baseUnder = parseFloat(next[m.id]?.under || baseOu.under);
             const baseGgVal = parseFloat(next[m.id]?.gg || baseGg.gg);
             const baseNgVal = parseFloat(next[m.id]?.ng || baseGg.ng);

             const bump = (val: number) => (val + (Math.random() > 0.5 ? 0.04 : -0.04)).toFixed(2);
             
             next[m.id] = {
               home: bump(baseH),
               draw: bump(baseD),
               away: bump(baseA),
               over: bump(baseOver),
               under: bump(baseUnder),
               gg: bump(baseGgVal),
               ng: bump(baseNgVal),
             };
          }
        });
        return next;
      });
    }, 4000);
    
    return () => {
      clearInterval(timer);
      clearInterval(oddsTimer);
    };
  }, [matches]); // re-bind when matches change

  // Filter and pick Top 15
  const topMatches = React.useMemo(() => {
    return matches
      .filter(m => {
        if (!m.homeOdd || m.homeOdd === '-') return false;
        return true; // allow all matches to have a bigger pool, we'll sort by popular
      })
      .sort((a, b) => {
        const aPop = POPULAR_TEAMS.some(t => a.home.toLowerCase().includes(t) || a.away.toLowerCase().includes(t));
        const bPop = POPULAR_TEAMS.some(t => b.home.toLowerCase().includes(t) || b.away.toLowerCase().includes(t));
        
        // 1. Live Popular
        if (a.isLive && aPop && !(b.isLive && bPop)) return -1;
        if (!(a.isLive && aPop) && b.isLive && bPop) return 1;
        
        // 2. Any Live
        if (a.isLive && !b.isLive) return -1;
        if (!a.isLive && b.isLive) return 1;
        
        // 3. Pre-match Popular
        if (aPop && !bPop) return -1;
        if (!aPop && bPop) return 1;
        
        // 4. Time
        return (a.timestamp || 0) - (b.timestamp || 0);
      })
      .slice(0, 15);
  }, [matches]);

  if (topMatches.length === 0) return null;

  const nextSlide = () => {
    if (scrollIdx < topMatches.length - 3) setScrollIdx(s => s + 1);
  };

  const prevSlide = () => {
    if (scrollIdx > 0) setScrollIdx(s => s - 1);
  };

  // Format time countdown
  const getCountdown = (startTs: number, isLive: boolean) => {
    if (isLive) return "CANLI";
    const diff = startTs - now;
    if (diff <= 0) return "BAŞLIYOR";
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    const hours = Math.floor(minutes / 60);
    if (hours > 24) return `${Math.floor(hours/24)}g`;
    if (hours > 0) return `${hours}s ${minutes % 60}dk`;
    if (minutes > 0) return `${minutes}dk`;
    return `${seconds}s`;
  };

  return (
    <div className="w-full mb-6 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF] shadow-[0_0_10px_rgba(0,229,255,0.2)]">
            <span className="text-sm font-bold">$</span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-wide">En İyi Maçlar</h2>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={prevSlide}
            disabled={scrollIdx === 0}
            className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center bg-slate-900/50 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={nextSlide}
            disabled={scrollIdx >= topMatches.length - 1} // simplified for responsive design
            className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center bg-slate-900/50 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Grid / Slider Container */}
      <div className="overflow-x-auto no-scrollbar pb-2">
        <div className="flex gap-4" style={{ transform: `translateX(-${scrollIdx * (340 + 16)}px)`, transition: 'transform 0.4s ease-out' }}>
          {topMatches.map((match) => {
            const fire = getDummyFireStats(match);
            const ts = match.timestamp || (Date.now() + 1000 * 60 * 60 * 2); // default +2 hours if no ts
            
            // Get override or base odds
            const ov = oddsOverride[match.id];
            const hOdd = ov?.home || match.homeOdd;
            const dOdd = ov?.draw || match.drawOdd;
            const aOdd = ov?.away || match.awayOdd;
            const baseOu = getMockOdds(match, 'ou');
            const baseGg = getMockOdds(match, 'gg');
            const overOdd = ov?.over || baseOu.over;
            const underOdd = ov?.under || baseOu.under;
            const ggOdd = ov?.gg || baseGg.gg;
            const ngOdd = ov?.ng || baseGg.ng;

            return (
              <div key={match.id} className="min-w-[260px] w-[280px] shrink-0 bg-[#0b0e14]/80 backdrop-blur-md rounded-xl border border-white/[0.04] border-l-[3px] border-l-transparent hover:border-l-[#00E5FF] flex flex-col p-3 shadow-xl hover:shadow-[0_8px_30px_rgba(0,229,255,0.05)] transition-all duration-300 relative group/card overflow-hidden">
                
                {/* Ambient Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#00E5FF]/[0.02] to-transparent pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"></div>

                {/* Top badges */}
                <div className="flex items-center mb-3 relative z-10">
                  <span className="bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20 px-2 py-0.5 rounded text-[11px] font-bold shadow-[0_0_8px_rgba(0,229,255,0.2)]">
                    {getCountdown(ts, !!match.isLive)}
                  </span>
                </div>

                {/* Teams Area */}
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex flex-col items-center w-[35%]">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center p-0.5 mb-1.5 overflow-hidden relative">
                       <PlayerLogo name={match.home} fallbackLogo={match.homeLogo} />
                    </div>
                    <span className="text-[11px] font-semibold text-center text-white leading-tight line-clamp-2">{match.home}</span>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center w-[30%]">
                     {match.isLive ? (
                        <div className="text-lg font-bold text-[#00E5FF] tracking-wide drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]">
                          {match.score || '0 - 0'}
                        </div>
                     ) : (
                        <div className="text-xs font-bold text-slate-500 italic">VS</div>
                     )}
                     <span className="text-[9px] text-[#00E5FF] font-semibold mt-0.5 animate-pulse tracking-wide drop-shadow-[0_0_3px_rgba(0,229,255,0.4)]">
                        {match.isLive ? (match.minute ? (match.minute.includes("'") ? match.minute : `${match.minute}'`) : 'CANLI') : ''}
                     </span>
                  </div>

                  <div className="flex flex-col items-center w-[35%]">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center p-0.5 mb-1.5 overflow-hidden relative">
                       <PlayerLogo name={match.away} fallbackLogo={match.awayLogo} />
                    </div>
                    <span className="text-[11px] font-semibold text-center text-white leading-tight line-clamp-2">{match.away}</span>
                  </div>
                </div>

                {/* Scrollable Odds Container */}
                <div className="mt-auto relative z-10 w-full group/odds">
                  
                  {/* Swipe Hint Indicator (Always visible, bouncing) */}
                  <div className="absolute -top-3 right-1 text-[9px] text-[#00E5FF]/90 font-bold uppercase tracking-wider flex items-center gap-1 z-20 pointer-events-none">
                     <span className="animate-pulse">Kaydır</span>
                     <ChevronRight className="w-3 h-3 animate-bounce-x text-[#00E5FF]" />
                  </div>

                  <div className="flex w-full overflow-x-auto snap-x snap-mandatory no-scrollbar hide-scrollbar gap-3 pb-2 pt-1 pr-4">
                    
                    {/* Page 1: 1X2 */}
                    <div className="w-[88%] shrink-0 snap-start snap-always">
                      <div className="flex justify-between items-center mb-1.5 px-1">
                        <span className="text-[9px] text-[#8e939d] font-bold uppercase tracking-wider">Maç Sonucu</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1.5">
                        <button 
                          onClick={() => addSelection({ id: match.homeId || match.id+'_1', matchId: match.id, matchName: `${match.home} vs ${match.away}`, selectionName: 'Maç Sonucu: 1', odd: parseFloat(hOdd.replace(',','.')) })}
                          className="bg-gradient-to-b from-[#151a25] to-[#0d1017] border border-white/5 hover:border-[#00E5FF]/40 hover:shadow-[inset_0_0_15px_rgba(0,229,255,0.1)] rounded p-1.5 flex flex-col items-center justify-center gap-0.5 transition-all group cursor-pointer active:scale-[0.98]"
                        >
                          <span className="text-[10px] text-[#8e939d] font-medium tracking-wide group-hover:text-[#00E5FF] transition-colors">1</span>
                          <div className="text-[12px] group-hover:text-white transition-colors"><AnimatedOdd value={hOdd} /></div>
                        </button>
                        <button 
                          onClick={() => addSelection({ id: match.drawId || match.id+'_x', matchId: match.id, matchName: `${match.home} vs ${match.away}`, selectionName: 'Maç Sonucu: X', odd: parseFloat(dOdd.replace(',','.')) })}
                          className="bg-gradient-to-b from-[#151a25] to-[#0d1017] border border-white/5 hover:border-[#00E5FF]/40 hover:shadow-[inset_0_0_15px_rgba(0,229,255,0.1)] rounded p-1.5 flex flex-col items-center justify-center gap-0.5 transition-all group cursor-pointer active:scale-[0.98]"
                        >
                          <span className="text-[10px] text-[#8e939d] font-medium tracking-wide group-hover:text-[#00E5FF] transition-colors">X</span>
                          <div className="text-[12px] group-hover:text-white transition-colors"><AnimatedOdd value={dOdd} /></div>
                        </button>
                        <button 
                          onClick={() => addSelection({ id: match.awayId || match.id+'_2', matchId: match.id, matchName: `${match.home} vs ${match.away}`, selectionName: 'Maç Sonucu: 2', odd: parseFloat(aOdd.replace(',','.')) })}
                          className="bg-gradient-to-b from-[#151a25] to-[#0d1017] border border-white/5 hover:border-[#00E5FF]/40 hover:shadow-[inset_0_0_15px_rgba(0,229,255,0.1)] rounded p-1.5 flex flex-col items-center justify-center gap-0.5 transition-all group cursor-pointer active:scale-[0.98]"
                        >
                          <span className="text-[10px] text-[#8e939d] font-medium tracking-wide group-hover:text-[#00E5FF] transition-colors">2</span>
                          <div className="text-[12px] group-hover:text-white transition-colors"><AnimatedOdd value={aOdd} /></div>
                        </button>
                      </div>
                    </div>

                    {/* Page 2: Alt/Üst 2.5 */}
                    <div className="w-[88%] shrink-0 snap-start snap-always">
                      <div className="flex justify-between items-center mb-1.5 px-1">
                        <span className="text-[9px] text-[#8e939d] font-bold uppercase tracking-wider">2.5 Alt / Üst</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button 
                          onClick={() => addSelection({ id: match.id+'_under', matchId: match.id, matchName: `${match.home} vs ${match.away}`, selectionName: '2.5 Alt', odd: parseFloat(underOdd) })}
                          className="bg-gradient-to-b from-[#151a25] to-[#0d1017] border border-white/5 hover:border-[#00E5FF]/40 hover:shadow-[inset_0_0_15px_rgba(0,229,255,0.1)] rounded p-1.5 flex flex-col items-center justify-center gap-0.5 transition-all group cursor-pointer active:scale-[0.98]"
                        >
                          <span className="text-[10px] text-[#8e939d] font-medium tracking-wide group-hover:text-[#00E5FF] transition-colors">Alt</span>
                          <div className="text-[12px] group-hover:text-white transition-colors"><AnimatedOdd value={underOdd} /></div>
                        </button>
                        <button 
                          onClick={() => addSelection({ id: match.id+'_over', matchId: match.id, matchName: `${match.home} vs ${match.away}`, selectionName: '2.5 Üst', odd: parseFloat(overOdd) })}
                          className="bg-gradient-to-b from-[#151a25] to-[#0d1017] border border-white/5 hover:border-[#00E5FF]/40 hover:shadow-[inset_0_0_15px_rgba(0,229,255,0.1)] rounded p-1.5 flex flex-col items-center justify-center gap-0.5 transition-all group cursor-pointer active:scale-[0.98]"
                        >
                          <span className="text-[10px] text-[#8e939d] font-medium tracking-wide group-hover:text-[#00E5FF] transition-colors">Üst</span>
                          <div className="text-[12px] group-hover:text-white transition-colors"><AnimatedOdd value={overOdd} /></div>
                        </button>
                      </div>
                    </div>

                    {/* Page 3: KG Var/Yok */}
                    <div className="w-[88%] shrink-0 snap-start snap-always">
                      <div className="flex justify-between items-center mb-1.5 px-1">
                        <span className="text-[9px] text-[#8e939d] font-bold uppercase tracking-wider">Karşılıklı Gol</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button 
                          onClick={() => addSelection({ id: match.id+'_gg', matchId: match.id, matchName: `${match.home} vs ${match.away}`, selectionName: 'KG Var', odd: parseFloat(ggOdd) })}
                          className="bg-gradient-to-b from-[#151a25] to-[#0d1017] border border-white/5 hover:border-[#00E5FF]/40 hover:shadow-[inset_0_0_15px_rgba(0,229,255,0.1)] rounded p-1.5 flex flex-col items-center justify-center gap-0.5 transition-all group cursor-pointer active:scale-[0.98]"
                        >
                          <span className="text-[10px] text-[#8e939d] font-medium tracking-wide group-hover:text-[#00E5FF] transition-colors">Var</span>
                          <div className="text-[12px] group-hover:text-white transition-colors"><AnimatedOdd value={ggOdd} /></div>
                        </button>
                        <button 
                          onClick={() => addSelection({ id: match.id+'_ng', matchId: match.id, matchName: `${match.home} vs ${match.away}`, selectionName: 'KG Yok', odd: parseFloat(ngOdd) })}
                          className="bg-gradient-to-b from-[#151a25] to-[#0d1017] border border-white/5 hover:border-[#00E5FF]/40 hover:shadow-[inset_0_0_15px_rgba(0,229,255,0.1)] rounded p-1.5 flex flex-col items-center justify-center gap-0.5 transition-all group cursor-pointer active:scale-[0.98]"
                        >
                          <span className="text-[10px] text-[#8e939d] font-medium tracking-wide group-hover:text-[#00E5FF] transition-colors">Yok</span>
                          <div className="text-[12px] group-hover:text-white transition-colors"><AnimatedOdd value={ngOdd} /></div>
                        </button>
                      </div>
                    </div>
                    
                  </div>
                  
                  {/* Fade Edge for Scroll Indication */}
                  <div className="absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-[#0b0e14] to-transparent pointer-events-none opacity-80 z-10"></div>
                  
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
