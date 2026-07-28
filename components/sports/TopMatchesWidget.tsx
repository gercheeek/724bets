import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Users, BarChart3, TrendingUp, Flame } from 'lucide-react';
import { MatchInfo } from './types';
import { useBetSlip } from '../../contexts/BetSlipContext';
import { PlayerLogo } from './PlayerLogo';

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

// Top tier leagues whitelist
const ELITE_LEAGUES = [
  'şampiyonlar ligi', 'champions league', 'premier', 'süper lig', 'la liga', 
  'serie a', 'bundesliga', 'euroleague', 'nba', 'avrupa ligi', 'europa league',
  'konferans ligi', 'conference league', 'dünya kupası', 'world cup', 'avrupa şampiyonası'
];

export const TopMatchesWidget: React.FC<TopMatchesWidgetProps> = ({ matches }) => {
  const { addSelection } = useBetSlip();
  const [now, setNow] = useState(Date.now());
  const [scrollIdx, setScrollIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter and pick Top 6
  const topMatches = React.useMemo(() => {
    return matches
      .filter(m => {
        // Must have odds
        if (!m.homeOdd || m.homeOdd === '-') return false;
        // Must be in elite leagues
        const lg = m.league.toLowerCase();
        return ELITE_LEAGUES.some(elite => lg.includes(elite));
      })
      .sort((a, b) => {
        // Prioritize live matches, then sort by timestamp (closest first)
        if (a.isLive !== b.isLive) return a.isLive ? -1 : 1;
        return (a.timestamp || 0) - (b.timestamp || 0);
      })
      .slice(0, 6);
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
          <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center text-emerald-400">
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
            
            return (
              <div key={match.id} className="min-w-[260px] w-[280px] shrink-0 bg-[#161b24] rounded-xl border border-white/[0.04] flex flex-col p-3 shadow-md hover:border-white/10 transition-colors">
                
                {/* Top badges */}
                <div className="flex items-center mb-3">
                  <span className="bg-[#1e2532] text-white px-2 py-0.5 rounded text-[11px] font-bold shadow-sm">
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
                        <div className="text-lg font-bold text-[#facc15] tracking-wide drop-shadow-[0_0_5px_rgba(250,204,21,0.3)]">
                          {match.score || '0 - 0'}
                        </div>
                     ) : (
                        <div className="text-xs font-bold text-slate-500 italic">VS</div>
                     )}
                     <span className="text-[9px] text-[#ef4444] font-semibold mt-0.5 animate-pulse tracking-wide">
                        {match.isLive ? match.liveTime || 'CANLI' : ''}
                     </span>
                  </div>

                  <div className="flex flex-col items-center w-[35%]">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center p-0.5 mb-1.5 overflow-hidden relative">
                       <PlayerLogo name={match.away} fallbackLogo={match.awayLogo} />
                    </div>
                    <span className="text-[11px] font-semibold text-center text-white leading-tight line-clamp-2">{match.away}</span>
                  </div>
                </div>

                {/* Odds Buttons */}
                <div className="grid grid-cols-3 gap-1.5 mt-auto">
                  <button 
                    onClick={() => addSelection({ id: match.homeId || match.id+'_1', matchId: match.id, matchName: `${match.home} vs ${match.away}`, selectionName: 'Maç Sonucu: 1', odd: parseFloat(match.homeOdd.replace(',','.')) })}
                    className="bg-[#1a1f2c] hover:bg-[#252b3b] rounded p-1.5 flex flex-col items-center justify-center gap-0.5 transition-colors group cursor-pointer border border-transparent hover:border-white/5 shadow-sm"
                  >
                    <span className="text-[10px] text-[#8e939d] font-medium tracking-wide">1</span>
                    <span className="text-[12px] font-bold text-[#e2e8f0] group-hover:text-white transition-colors">{match.homeOdd}</span>
                  </button>
                  <button 
                    onClick={() => addSelection({ id: match.drawId || match.id+'_x', matchId: match.id, matchName: `${match.home} vs ${match.away}`, selectionName: 'Maç Sonucu: X', odd: parseFloat(match.drawOdd.replace(',','.')) })}
                    className="bg-[#1a1f2c] hover:bg-[#252b3b] rounded p-1.5 flex flex-col items-center justify-center gap-0.5 transition-colors group cursor-pointer border border-transparent hover:border-white/5 shadow-sm"
                  >
                    <span className="text-[10px] text-[#8e939d] font-medium tracking-wide">X</span>
                    <span className="text-[12px] font-bold text-[#e2e8f0] group-hover:text-white transition-colors">{match.drawOdd}</span>
                  </button>
                  <button 
                    onClick={() => addSelection({ id: match.awayId || match.id+'_2', matchId: match.id, matchName: `${match.home} vs ${match.away}`, selectionName: 'Maç Sonucu: 2', odd: parseFloat(match.awayOdd.replace(',','.')) })}
                    className="bg-[#1a1f2c] hover:bg-[#252b3b] rounded p-1.5 flex flex-col items-center justify-center gap-0.5 transition-colors group cursor-pointer border border-transparent hover:border-white/5 shadow-sm"
                  >
                    <span className="text-[10px] text-[#8e939d] font-medium tracking-wide">2</span>
                    <span className="text-[12px] font-bold text-[#e2e8f0] group-hover:text-white transition-colors">{match.awayOdd}</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
