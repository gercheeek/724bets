import React from 'react';
import { PlayerLogo } from './PlayerLogo';
import { AnimatedOdd } from '../AnimatedOdd';
import { MatchInfo } from './types';

import { useBetSlip } from '../../contexts/BetSlipContext';

interface MatchCardProps {
  match: MatchInfo;
  isGoal: boolean;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, isGoal }) => {
  const { betSlip, addSelection } = useBetSlip();
  return (
    <div className={`flex flex-col md:flex-row md:items-center bg-[#050505] p-3 md:px-5 md:py-3.5 gap-3 md:gap-4 transition-all duration-300 border border-white/[0.02] hover:border-white/10 rounded-xl hover:shadow-lg group relative overflow-hidden ${isGoal ? 'animate-goal-card z-20 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : ''}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/0 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      {/* Goal Badge */}
      {isGoal && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[9px] md:text-[10px] font-black px-3 py-1 rounded-full animate-bounce shadow-[0_0_15px_rgba(16,185,129,0.8)] z-50 tracking-widest uppercase">
          GOAL!
        </div>
      )}

      {/* LEFT SECTION: Status & Start Time */}
      <div className="flex flex-col items-center justify-center shrink-0 w-[48px] md:w-[56px] z-10">
        {match.isFinished ? (
          <span className="text-[11px] text-zinc-500 font-bold tracking-wide uppercase">FT</span>
        ) : match.isLive ? (
          <div className="flex flex-col items-center justify-center gap-1 bg-[#000000]/50 rounded-lg py-1 px-2 border border-white/[0.02] w-full text-center">
             <span className="text-[12px] md:text-[13px] font-black text-emerald-400 tabular-nums drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]">{match.minute}</span>
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center bg-zinc-900/90 rounded-lg py-1 px-1 border border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.05)] w-full text-center">
             {match.matchDate && (
               <span className="text-[9px] font-bold text-amber-500/90 tracking-tight uppercase leading-none mb-0.5">{match.matchDate}</span>
             )}
             <span className="text-[11px] md:text-[12px] font-black text-amber-400 tabular-nums tracking-tight leading-none">{match.startTime || match.minute}</span>
          </div>
        )}
      </div>

      {/* MIDDLE SECTION: Teams & Scores */}
      <div className="flex-1 flex flex-col gap-2.5 min-w-0 pr-0 md:pr-4 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center overflow-hidden bg-[#000000] shadow-inner shrink-0">
              <PlayerLogo name={match.home} fallbackLogo={match.homeLogo} />
            </div>
            <span className="text-[13px] md:text-[15px] font-bold text-zinc-100 truncate tracking-tight">{match.home}</span>
          </div>
          {match.isLive ? (
            <span className={`text-[15px] md:text-[16px] font-black tabular-nums ${isGoal ? 'animate-score text-emerald-400' : 'text-zinc-200'}`}>{String(match.score || '-').split(' - ')[0] || '-'}</span>
          ) : (
            <span className="text-[10.5px] font-bold text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 tabular-nums shrink-0 ml-2">
              {match.matchDate ? `${match.matchDate} ${match.startTime || ''}` : (match.startTime || match.minute)}
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center overflow-hidden bg-[#000000] shadow-inner shrink-0">
              <PlayerLogo name={match.away} fallbackLogo={match.awayLogo} />
            </div>
            <span className="text-[13px] md:text-[15px] font-bold text-zinc-100 truncate tracking-tight">{match.away}</span>
          </div>
          {match.isLive ? (
            <span className={`text-[15px] md:text-[16px] font-black tabular-nums ${isGoal ? 'animate-score text-emerald-400' : 'text-zinc-200'}`}>{String(match.score || '-').split(' - ')[1] || '-'}</span>
          ) : (
            <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest shrink-0 ml-2">VS</span>
          )}
        </div>
      </div>

      {/* RIGHT SECTION: Odds */}
      <div className="flex items-center gap-2 shrink-0 mt-3 md:mt-0 pt-3 md:pt-0 border-t border-white/[0.02] md:border-t-0 z-10 w-full md:w-auto">
        {['1', 'X', '2'].map((oddType, idx) => {
          const oddValue = oddType === '1' ? match.homeOdd : oddType === 'X' ? match.drawOdd : match.awayOdd;
          const oddId = oddType === '1' ? match.homeId : oddType === 'X' ? match.drawId : match.awayId;
          const isSelected = betSlip.some(s => s.id === (oddId || ''));
          
          return (
            <button 
              key={idx}
              onClick={(e) => { 
                e.stopPropagation(); 
                addSelection({
                  id: oddId,
                  matchId: match.id,
                  matchName: `${match.home} vs ${match.away}`,
                  selectionName: `Maç Sonucu : ${oddType}`,
                  odd: parseFloat(oddValue) || 1
                });
              }}
              className={`flex-1 md:flex-none w-auto md:w-[64px] h-[44px] md:h-[50px] rounded-lg flex flex-col items-center justify-center transition-all duration-300 border hover:-translate-y-0.5 ${isSelected ? 'bg-emerald-500/10 border-emerald-500/60 shadow-[0_4px_12px_rgba(16,185,129,0.15)]' : 'bg-transparent border-transparent hover:border-emerald-500/40 hover:bg-emerald-500/5'}`}
            >
              <span className={`text-[10px] md:text-[11px] font-semibold capitalize mb-0.5 transition-colors ${isSelected ? 'text-emerald-400' : 'text-zinc-500 group-hover:text-zinc-400'}`}>{oddType}</span>
              <AnimatedOdd value={oddValue} />
            </button>
          );
        })}
        <button className="h-[44px] md:h-[50px] min-w-[44px] md:min-w-[50px] rounded-lg bg-transparent hover:bg-emerald-500/5 border border-transparent hover:border-emerald-500/40 transition-all duration-300 flex items-center justify-center text-[11px] text-zinc-500 hover:text-zinc-300 font-bold ml-1 hover:-translate-y-0.5">
          +{match.marketsCount}
        </button>
      </div>
    </div>
  );
};
