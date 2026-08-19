import React, { memo } from 'react';
import { PlayerLogo } from './PlayerLogo';
import { AnimatedOdd } from '../AnimatedOdd';
import { useBetSlip } from '../../contexts/BetSlipContext';
import { Globe, Radio, ChevronDown, Star } from 'lucide-react';

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

  return (
    <div 
      onClick={() => onSelect && onSelect(match)}
      className="group/card bg-gradient-to-b from-[#16181C] to-[#000000] border border-[#2A2D35] border-t-[#3F4350] hover:border-[#00E5FF]/50 rounded-lg p-2.5 flex flex-col relative transition-all duration-300 cursor-pointer w-full shadow-[0_10px_20px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.05)] hover:shadow-[0_10px_30px_rgba(0,229,255,0.15),inset_0_1px_0_rgba(255,255,255,0.1)] overflow-hidden"
    >
      {/* Glossy Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent pointer-events-none z-0"></div>

      {/* Goal Overlay */}
      {isGoal && (
        <div className="absolute inset-0 bg-emerald-500/10 pointer-events-none rounded-lg border border-emerald-500/50 animate-pulse z-0"></div>
      )}

      {/* Header: Live/Time and League */}
      <div className="flex items-center justify-between mb-2.5 border-b border-white/5 pb-2 z-10 relative">
        <div className="flex items-center gap-1.5 text-[10px] font-black tracking-wider uppercase">
          {match.isLive ? (
              <span className="text-[#00E5FF] flex items-center gap-1.5 drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]">
                <span className="w-1.5 h-1.5 bg-[#00E5FF] rounded-full animate-pulse shadow-[0_0_5px_#00E5FF]"></span> 
                {getStatusText()}
              </span>
          ) : (
              <span className="text-zinc-500">{getStatusText()}</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-zinc-500 text-[9px] uppercase tracking-widest truncate max-w-[130px] font-bold">
            {match.league}
          </span>
          {onToggleFavorite && (
            <button 
              onClick={(e) => onToggleFavorite(e, match)}
              className="group/star p-1 hover:bg-white/5 rounded-full transition-colors"
            >
              <Star 
                size={14} 
                className={`${isFavorite ? 'fill-[#f2a900] text-[#f2a900] drop-shadow-[0_0_5px_rgba(242,169,0,0.8)]' : 'text-zinc-500 group-hover/star:text-zinc-300'}`} 
              />
            </button>
          )}
        </div>
      </div>

      {/* Teams & Scores */}
      <div className="flex flex-col gap-2 mb-3 z-10 relative">
         {/* Home Team */}
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden pr-2 group/team">
               <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-white/10 to-transparent rounded-full border border-white/10 shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)]">
                 <PlayerLogo name={match.home} url={match.homeLogo} isFootball={!isTennis} />
               </div>
               <span className="text-white font-bold text-[12px] truncate tracking-tight">{match.home}</span>
               {match.info?.FS?.R1 > 0 && (
                 <span className="w-2.5 h-3.5 bg-red-500 rounded-[2px] shadow-[0_0_5px_rgba(239,68,68,0.5)] flex items-center justify-center text-[8px] font-bold text-white ml-1">{match.info.FS.R1 > 1 ? match.info.FS.R1 : ''}</span>
               )}
            </div>
            {match.isLive && (
               <div className="bg-black border border-white/10 shadow-[inset_0_2px_4px_rgba(0,0,0,1)] rounded-md px-2 py-0.5 flex items-center justify-center min-w-[28px]">
                  <span className="text-[#00E5FF] font-black text-[13px] drop-shadow-[0_0_5px_rgba(0,229,255,0.4)]">{homeScore}</span>
               </div>
            )}
         </div>
         {/* Away Team */}
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden pr-2 group/team">
               <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-white/10 to-transparent rounded-full border border-white/10 shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)]">
                 <PlayerLogo name={match.away} url={match.awayLogo} isFootball={!isTennis} />
               </div>
               <span className="text-white font-bold text-[12px] truncate tracking-tight">{match.away}</span>
               {match.info?.FS?.R2 > 0 && (
                 <span className="w-2.5 h-3.5 bg-red-500 rounded-[2px] shadow-[0_0_5px_rgba(239,68,68,0.5)] flex items-center justify-center text-[8px] font-bold text-white ml-1">{match.info.FS.R2 > 1 ? match.info.FS.R2 : ''}</span>
               )}
            </div>
            {match.isLive && (
               <div className="bg-black border border-white/10 shadow-[inset_0_2px_4px_rgba(0,0,0,1)] rounded-md px-2 py-0.5 flex items-center justify-center min-w-[28px]">
                  <span className="text-[#00E5FF] font-black text-[13px] drop-shadow-[0_0_5px_rgba(0,229,255,0.4)]">{awayScore}</span>
               </div>
            )}
         </div>
      </div>

      {/* Odds Buttons */}
      <div className="mt-auto flex gap-1 w-full z-10 relative">
         {oddsPills.map((btn) => {
           const isDisabled = !btn.odd || btn.odd === '-';
           const selected = isSelected(btn.id);
           
           return (
             <button
               key={btn.id}
               onClick={(e) => handleBetClick(e, btn.id, btn.name, btn.odd, 'Maç Sonucu')}
               className={`flex-1 flex flex-col items-center justify-center py-1.5 rounded-md transition-all relative overflow-hidden group/odd border ${
                 selected
                   ? 'bg-gradient-to-b from-[#00E5FF] to-[#008A99] border-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.5)] text-black'
                   : isDisabled
                     ? 'bg-black/50 border-white/5 opacity-40 cursor-not-allowed'
                     : 'bg-gradient-to-b from-[#1C1E24] to-[#0A0B0E] border-[#2A2D35] border-t-[#3F4350] hover:border-[#00E5FF]/50 hover:shadow-[0_0_10px_rgba(0,229,255,0.2)] text-white shadow-[0_4px_10px_rgba(0,0,0,0.5)]'
               }`}
             >
               {/* Glossy inner top highlight for unselected buttons */}
               {!selected && !isDisabled && <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/10"></div>}
               
               <span className={`text-[9px] font-black tracking-wide mb-0.5 ${selected ? 'text-black/70' : 'text-zinc-500 group-hover/odd:text-[#00E5FF] transition-colors'}`}>
                 {btn.name}
               </span>
               <span className={`text-[12px] font-black tracking-tight drop-shadow-sm ${selected ? 'text-black' : 'text-white'}`}>
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
