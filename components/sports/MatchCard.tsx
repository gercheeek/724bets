import React from 'react';
import { PlayerLogo } from './PlayerLogo';
import { AnimatedOdd } from '../AnimatedOdd';
import { MatchInfo } from './types';

import { useBetSlip } from '../../contexts/BetSlipContext';

interface MatchCardProps {
  match: MatchInfo;
  isGoal: boolean;
  onSelect?: (match: MatchInfo) => void;
}

export const MatchCard: React.FC<MatchCardProps> = React.memo(({ match, isGoal, onSelect }) => {
  const { betSlip, addSelection } = useBetSlip();
  return (
    <div 
      onClick={() => {
        if (match.isLive && onSelect) {
          onSelect(match);
        }
      }}
      className={`flex flex-col md:flex-row md:items-center bg-gradient-to-r from-[#0c0d12] via-[#0a0b0f] to-[#050505] p-3 md:px-5 md:py-4 gap-3 md:gap-4 transition-all duration-300 border-b border-[#1f222d]/50 hover:bg-[#12141c] group relative overflow-hidden ${isGoal ? 'animate-goal-card z-20 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.15)]' : 'hover:shadow-[0_4px_25px_rgba(0,0,0,0.5)]'} ${match.isLive ? 'cursor-pointer' : ''}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/0 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      {/* Goal Badge */}
      {isGoal && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[9px] md:text-[10px] font-black px-4 py-1 rounded-full animate-bounce shadow-[0_0_20px_rgba(16,185,129,0.6)] z-50 tracking-[0.2em] uppercase">
          GOAL!
        </div>
      )}

      {/* LEFT SECTION: Status & Start Time */}
      <div className="flex flex-col items-center justify-center shrink-0 w-[50px] md:w-[60px] z-10">
        {match.isFinished ? (
          <span className="text-[11px] text-zinc-500 font-bold tracking-wide uppercase">FT</span>
        ) : match.isLive ? (
          <div className="flex flex-col items-center justify-center gap-1.5 bg-[#12151c]/80 rounded-lg py-1.5 px-2 border border-[#1f222d] w-full text-center relative overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
             <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
             <span className="text-[12.5px] md:text-[13.5px] font-black text-emerald-400 tabular-nums drop-shadow-[0_0_8px_rgba(16,185,129,0.4)] tracking-wider">{match.minute}</span>
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.9)]"></div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center bg-[#12151c]/80 rounded-lg py-1.5 px-1 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.05),inset_0_1px_0_rgba(255,255,255,0.02)] w-full text-center relative overflow-hidden">
             <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent"></div>
             {match.matchDate && (
               <span className="text-[9px] font-black text-amber-500/90 tracking-widest uppercase leading-none mb-1">{match.matchDate}</span>
             )}
             <span className="text-[11.5px] md:text-[12.5px] font-black text-amber-400 tabular-nums tracking-widest leading-none">{match.startTime || match.minute}</span>
          </div>
        )}
      </div>

      {/* MIDDLE SECTION: Teams & Scores */}
      <div className="flex-1 flex flex-col gap-3 min-w-0 pr-0 md:pr-4 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#1a1e29] to-[#0c0e14] border border-white/10 shadow-[0_2px_10px_rgba(0,0,0,0.6)] ring-1 ring-emerald-500/10 shrink-0 p-1 group-hover:border-emerald-500/30 group-hover:shadow-[0_0_12px_rgba(16,185,129,0.2)] transition-all duration-300">
              <PlayerLogo name={match.home} fallbackLogo={match.homeLogo} />
            </div>
            <span className="text-[13.5px] md:text-[15px] font-bold text-zinc-100 truncate tracking-wide">{match.home}</span>
          </div>
          {match.isLive ? (
            <span className={`text-[15.5px] md:text-[17px] font-black tabular-nums tracking-tight ${isGoal ? 'animate-score text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'text-white'}`}>{String(match.score || '-').split(' - ')[0] || '-'}</span>
          ) : (
            <span className="text-[10px] font-black text-amber-400/90 bg-[#1a150b] px-2 py-0.5 rounded border border-amber-500/20 tabular-nums shrink-0 ml-2 tracking-widest">
              {match.matchDate ? `${match.matchDate} ${match.startTime || ''}` : (match.startTime || match.minute)}
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#1a1e29] to-[#0c0e14] border border-white/10 shadow-[0_2px_10px_rgba(0,0,0,0.6)] ring-1 ring-emerald-500/10 shrink-0 p-1 group-hover:border-emerald-500/30 group-hover:shadow-[0_0_12px_rgba(16,185,129,0.2)] transition-all duration-300">
              <PlayerLogo name={match.away} fallbackLogo={match.awayLogo} />
            </div>
            <span className="text-[13.5px] md:text-[15px] font-bold text-zinc-100 truncate tracking-wide">{match.away}</span>
          </div>
          {match.isLive ? (
            <span className={`text-[15.5px] md:text-[17px] font-black tabular-nums tracking-tight ${isGoal ? 'animate-score text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'text-white'}`}>{String(match.score || '-').split(' - ')[1] || '-'}</span>
          ) : (
            <span className="text-[9.5px] font-black text-zinc-600 uppercase tracking-[0.2em] shrink-0 ml-2">VS</span>
          )}
        </div>
      </div>

      {/* RIGHT SECTION: Odds */}
      <div className="flex items-center gap-2.5 shrink-0 mt-3 md:mt-0 pt-3 md:pt-0 border-t border-[#1f222d]/50 md:border-t-0 z-10 w-full md:w-auto">
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
              className={`flex-1 md:flex-none w-auto md:w-[68px] h-[46px] md:h-[52px] rounded-xl flex flex-col items-center justify-center transition-all duration-300 border relative overflow-hidden group/odd hover:-translate-y-1 ${
                isSelected 
                  ? 'bg-emerald-500/10 border-emerald-500/50 shadow-[0_4px_15px_rgba(16,185,129,0.2)]' 
                  : 'bg-[#12141c] border-[#222635] hover:border-emerald-500/40 hover:bg-[#151b24] shadow-[0_2px_8px_rgba(0,0,0,0.2)]'
              }`}
            >
              {isSelected && <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/20 to-transparent pointer-events-none"></div>}
              <span className={`text-[9.5px] md:text-[10px] font-black uppercase mb-0.5 tracking-wider transition-colors z-10 ${isSelected ? 'text-emerald-400' : 'text-zinc-500 group-hover/odd:text-zinc-400'}`}>{oddType}</span>
              <div className="z-10">
                <AnimatedOdd value={oddValue} />
              </div>
            </button>
          );
        })}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            if (match.isLive && onSelect) {
              onSelect(match);
            }
          }}
          className={`h-[46px] md:h-[52px] min-w-[44px] md:min-w-[50px] rounded-xl bg-[#12141c] hover:bg-[#151b24] border border-[#222635] hover:border-emerald-500/40 transition-all duration-300 flex items-center justify-center text-[11px] text-zinc-500 hover:text-zinc-300 font-black ml-1 hover:-translate-y-1 shadow-[0_2px_8px_rgba(0,0,0,0.2)] ${match.isLive ? 'text-emerald-500/70 hover:text-emerald-400' : ''}`}
        >
          +{match.marketsCount}
        </button>
      </div>
    </div>
  );
});
