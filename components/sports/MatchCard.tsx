import React, { memo } from 'react';
import { PlayerLogo } from './PlayerLogo';
import { AnimatedOdd } from '../AnimatedOdd';
import { useBetSlip } from '../../contexts/BetSlipContext';
import { Globe, Radio, ChevronDown, Star, Sparkles } from 'lucide-react';
import { getMatchPriorityScore } from '../../utils/eliteTeams';

export const LiveTimer: React.FC<{ minute: string; hidePrefix?: boolean; lastUpdateTs?: number }> = ({ minute, hidePrefix = false }) => {
  const [seconds, setSeconds] = React.useState(() => new Date().getSeconds());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(new Date().getSeconds());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const prefix = hidePrefix ? '' : 'CANLI ';

  if (!minute) return <span>{hidePrefix ? '' : 'CANLI'}</span>;
  const cleanMinute = String(minute).replace(/['"]/g, '').trim();

  if (['ht', 'devre arası', 'devre', 'yarı', 'half time'].includes(cleanMinute.toLowerCase())) {
    return <span>DEVRE ARASI</span>;
  }
  if (['ft', 'bitti', 'ms'].includes(cleanMinute.toLowerCase())) {
    return <span>BİTTİ</span>;
  }

  if (!isNaN(Number(cleanMinute))) {
    const num = Number(cleanMinute);
    if (num === 0) {
      return <span>{`${prefix}`}</span>;
    }
    const s = seconds.toString().padStart(2, '0');
    return <span>{`${prefix}${cleanMinute}:${s}`}</span>;
  }

  return <span>{`${prefix}${minute}`}</span>;
};

export interface MatchCardProps {
  match: any;
  isGoal?: boolean;
  isFavorite?: boolean;
  onSelect?: (match: any) => void;
  onToggleFavorite?: (e: React.MouseEvent, match: any) => void;
}

export const MatchCard: React.FC<MatchCardProps> = memo(({ match, isGoal, isFavorite, onSelect, onToggleFavorite }) => {
  const { betSlip, addSelection } = useBetSlip();
  const isTennis = match.sport?.toLowerCase().includes('tenis') || match.sport?.toLowerCase().includes('tennis');

  const homeScore = isTennis ? (match.info?.score1 || '0') : (String(match.score || '-').split(' - ')[0] || '0');
  const awayScore = isTennis ? (match.info?.score2 || '0') : (String(match.score || '-').split(' - ')[1] || '0');

  const getStatusText = () => {
    if (match.isLive && match.minute) return match.minute;
    if (match.isLive) return "Live";
    if (match.matchDate) return `${match.matchDate}, ${match.startTime}`;
    return match.startTime;
  };

  const handleBetClick = (e: React.MouseEvent, id: string, name: string, odd: string, marketName: string) => {
    e.stopPropagation();
    if (!odd || odd === '-') return;
    addSelection({
      id: `${match.id}_${id}`,
      matchId: match.id,
      matchName: `${match.home} - ${match.away}`,
      marketName: marketName,
      selectionName: name,
      odd: parseFloat(odd)
    });
  };

  const isSelected = (id: string) => betSlip.some(s => s.id === `${match.id}_${id}`);

  // Create an array for 1X2 odds, filtering out X if it's tennis or if odd is missing/'-' and not needed
  const oddsPills = [
    { id: match.homeId, name: '1', odd: match.homeOdd },
    ...(!isTennis && match.drawOdd && match.drawOdd !== '-' ? [{ id: match.drawId, name: 'X', odd: match.drawOdd }] : []),
    { id: match.awayId, name: '2', odd: match.awayOdd }
  ];

  const priorityScore = getMatchPriorityScore(match.home, match.away);
  const isPremium = priorityScore > 0;

  return (
    <div 
      onClick={() => onSelect && onSelect(match)}
      className={`group/card bg-[#030303] hover:bg-[#0a0a0a] rounded-xl p-3 flex flex-col relative transition-all duration-500 cursor-pointer w-full overflow-hidden ${
        isPremium ? 'shadow-[0_4px_30px_rgba(245,166,35,0.1)] hover:shadow-[0_8px_40px_rgba(245,166,35,0.2)]' : 'shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.8)]'
      }`}
    >
      {/* Shiny Glass Overlay (Parlak Siyah) */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent pointer-events-none z-0 rounded-xl"></div>
      
      {/* Border-free glow for Premium */}
      {isPremium && (
        <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-[#F5A623] to-transparent opacity-50 z-0"></div>
      )}

      {/* Goal Overlay */}
      {isGoal && (
        <div className="absolute inset-0 bg-emerald-500/10 pointer-events-none rounded-xl border border-emerald-500/30 animate-pulse z-0"></div>
      )}

      {/* Header: Live/Time and League */}
      <div className="flex items-center justify-between mb-3 border-b border-white/[0.03] pb-2 z-10 relative">
        <div className="flex items-center gap-2 text-[10px] font-black tracking-wider uppercase">
          {match.isLive ? (
              <span className="text-emerald-400 flex items-center gap-1.5 drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_5px_#10B981]"></span> 
                {getStatusText()}
              </span>
          ) : (
              <span className="text-zinc-500">{getStatusText()}</span>
          )}
          {isPremium && (
             <span className="flex items-center gap-1 px-1.5 py-0.5 bg-[#F5A623]/10 text-[#F5A623] rounded text-[8px] border border-[#F5A623]/20">
               <Sparkles size={8} /> PREMIUM
             </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-zinc-500 text-[10px] uppercase tracking-widest truncate max-w-[130px] font-bold">
            {match.league}
          </span>
          {onToggleFavorite && (
            <button 
              onClick={(e) => onToggleFavorite(e, match)}
              className="group/star p-1 hover:bg-white/5 rounded-full transition-colors"
            >
              <Star 
                size={14} 
                className={`${isFavorite ? 'fill-[#F5A623] text-[#F5A623] drop-shadow-[0_0_8px_rgba(245,166,35,0.6)]' : 'text-zinc-600 group-hover/star:text-zinc-400'}`} 
              />
            </button>
          )}
        </div>
      </div>

      {/* Teams & Scores */}
      <div className="flex flex-col gap-2.5 mb-4 z-10 relative px-1">
         {/* Home Team */}
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden pr-2 group/team">
               <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-white/[0.08] to-transparent rounded-full border border-white/[0.05]">
                 <PlayerLogo name={match.home} url={match.homeLogo} isFootball={!isTennis} />
               </div>
               <span className={`font-bold text-[13px] truncate tracking-tight transition-colors ${isPremium ? 'text-white' : 'text-zinc-200'} group-hover/card:text-white`}>{match.home}</span>
               {match.info?.FS?.R1 > 0 && (
                 <span className="w-2.5 h-3.5 bg-red-500 rounded-[2px] shadow-[0_0_5px_rgba(239,68,68,0.5)] flex items-center justify-center text-[8px] font-bold text-white ml-1">{match.info.FS.R1 > 1 ? match.info.FS.R1 : ''}</span>
               )}
            </div>
            {match.isLive && (
               <div className="flex items-center justify-center min-w-[28px]">
                  <span className="text-emerald-400 font-black text-[15px] drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]">{homeScore}</span>
               </div>
            )}
         </div>
         {/* Away Team */}
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden pr-2 group/team">
               <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-white/[0.08] to-transparent rounded-full border border-white/[0.05]">
                 <PlayerLogo name={match.away} url={match.awayLogo} isFootball={!isTennis} />
               </div>
               <span className={`font-bold text-[13px] truncate tracking-tight transition-colors ${isPremium ? 'text-white' : 'text-zinc-200'} group-hover/card:text-white`}>{match.away}</span>
               {match.info?.FS?.R2 > 0 && (
                 <span className="w-2.5 h-3.5 bg-red-500 rounded-[2px] shadow-[0_0_5px_rgba(239,68,68,0.5)] flex items-center justify-center text-[8px] font-bold text-white ml-1">{match.info.FS.R2 > 1 ? match.info.FS.R2 : ''}</span>
               )}
            </div>
            {match.isLive && (
               <div className="flex items-center justify-center min-w-[28px]">
                  <span className="text-emerald-400 font-black text-[15px] drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]">{awayScore}</span>
               </div>
            )}
         </div>
      </div>

      {/* Odds Buttons */}
      <div className="mt-auto flex gap-1.5 w-full z-10 relative">
         {oddsPills.map((btn) => {
           const isDisabled = !btn.odd || btn.odd === '-';
           const selected = isSelected(btn.id);
           
           return (
             <button
               key={btn.id}
               onClick={(e) => handleBetClick(e, btn.id, btn.name, btn.odd, 'Maç Sonucu')}
               className={`flex-1 flex flex-col items-center justify-center py-2 rounded-lg transition-all duration-300 relative overflow-hidden group/odd ${
                 selected
                   ? 'bg-gradient-to-b from-[#F5A623] to-[#d48806] shadow-[0_0_20px_rgba(245,166,35,0.4)] text-black'
                   : isDisabled
                     ? 'bg-white/[0.02] opacity-40 cursor-not-allowed'
                     : 'bg-white/[0.03] hover:bg-white/[0.08] text-white shadow-inner'
               }`}
             >
               <span className={`text-[9px] font-bold tracking-wider mb-0.5 ${selected ? 'text-black/70' : 'text-zinc-500 group-hover/odd:text-[#F5A623] transition-colors'}`}>
                 {btn.name}
               </span>
               <span className={`text-[13px] font-black tracking-tight drop-shadow-sm ${selected ? 'text-black' : 'text-white'}`}>
                 {isDisabled ? '-' : <AnimatedOdd value={btn.odd} />}
               </span>
             </button>
           );
         })}
      </div>
    </div>
  );
});


MatchCard.displayName = 'MatchCard';
