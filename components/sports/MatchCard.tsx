import React, { memo } from 'react';
import { PlayerLogo } from './PlayerLogo';
import { AnimatedOdd } from '../AnimatedOdd';
import { MatchInfo } from './types';
import { useBetSlip } from '../../contexts/BetSlipContext';
import { ChevronDown } from 'lucide-react';

interface MatchCardProps {
  match: MatchInfo;
  isGoal: boolean;
  onSelect?: (match: MatchInfo) => void;
}

export const LiveTimer: React.FC<{ minute: string; hidePrefix?: boolean }> = ({ minute, hidePrefix = false }) => {
  const [seconds, setSeconds] = React.useState(() => new Date().getSeconds());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(new Date().getSeconds());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const prefix = hidePrefix ? '' : 'CANLI ';

  if (!minute) return <span>{hidePrefix ? '' : 'CANLI'}</span>;
  const cleanMinute = minute.replace(/['"]/g, '').trim();

  if (['ht', 'devre arası', 'devre', 'yarı', 'half time'].includes(cleanMinute.toLowerCase())) {
    return <span>DEVRE ARASI</span>;
  }
  if (['ft', 'bitti', 'ms'].includes(cleanMinute.toLowerCase())) {
    return <span>BİTTİ</span>;
  }

  if (!isNaN(Number(cleanMinute))) {
    const s = seconds.toString().padStart(2, '0');
    return <span>{`${prefix}${cleanMinute}:${s}`}</span>;
  }

  return <span>{`${prefix}${minute}`}</span>;
};

export const MatchCard: React.FC<MatchCardProps> = memo(({ match, isGoal, onSelect }) => {
  const { betSlip, addSelection } = useBetSlip();
  const isTennis = match.sport?.toLowerCase().includes('tenis') || match.sport?.toLowerCase().includes('tennis');

  return (
    <div 
      onClick={() => {
        if (onSelect) {
          onSelect(match);
        }
      }}
      className={`bg-[#171b26] py-2.5 px-3 rounded-lg flex flex-col gap-2 group relative transition-colors border border-transparent hover:bg-[#1c2230] cursor-pointer mb-1.5 shadow-sm`}
    >
      {/* Goal Overlay */}
      {isGoal && (
        <div className="absolute inset-0 bg-emerald-500/10 pointer-events-none rounded-lg border border-emerald-500/50 animate-pulse"></div>
      )}

      {/* Header: League & Time */}
      <div className="flex flex-col gap-0.5 z-10">
        <div className="flex items-center gap-1.5 text-[12px] font-medium text-slate-400">
           <span className="opacity-80">⚽</span>
           <span>{match.league}</span>
        </div>
        <div className="flex items-center gap-2 text-[13px] font-bold text-slate-300">
          {match.isLive ? (
            <span className="text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <LiveTimer minute={match.minute} />
            </span>
          ) : (
            <span>{match.matchDate ? `${match.matchDate}, ${match.startTime}` : match.startTime}</span>
          )}
        </div>
      </div>

      {/* Teams Section */}
      <div className="flex flex-col gap-2 mt-1 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 flex items-center justify-center p-0.5">
              <PlayerLogo name={match.home} fallbackLogo={match.homeLogo} sport={match.sport} />
            </div>
            <span className="text-[13px] font-semibold text-white tracking-wide">{match.home}</span>
          </div>
          {match.isLive && (
            <div className={`text-[14px] font-black tabular-nums flex items-center gap-2 ${isGoal ? 'text-emerald-400' : 'text-white'}`}>
              {isTennis && match.info?.current_game_state && (
                <span className="text-zinc-500 text-[11px] bg-zinc-800/50 px-1 rounded">{match.info.current_game_state.split(':')[0] || '0'}</span>
              )}
              <span className={isTennis ? 'text-[#00E5FF]' : ''}>
                {isTennis ? (match.info?.score1 || '0') : (String(match.score || '-').split(' - ')[0] || '0')}
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 flex items-center justify-center p-0.5">
              <PlayerLogo name={match.away} fallbackLogo={match.awayLogo} sport={match.sport} />
            </div>
            <span className="text-[13px] font-semibold text-white tracking-wide">{match.away}</span>
          </div>
          {match.isLive && (
            <div className={`text-[14px] font-black tabular-nums flex items-center gap-2 ${isGoal ? 'text-emerald-400' : 'text-white'}`}>
              {isTennis && match.info?.current_game_state && (
                <span className="text-zinc-500 text-[11px] bg-zinc-800/50 px-1 rounded">{match.info.current_game_state.split(':')[1] || '0'}</span>
              )}
              <span className={isTennis ? 'text-[#00E5FF]' : ''}>
                {isTennis ? (match.info?.score2 || '0') : (String(match.score || '-').split(' - ')[1] || '0')}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Odds Section */}
      <div className="flex flex-col mt-1.5 z-10">
        <div className="flex gap-1.5">
          {/* 1 */}
          <button 
            onClick={(e) => { 
              e.stopPropagation(); 
              addSelection({
                id: match.homeId || match.id+'_1',
                matchId: match.id,
                matchName: `${match.home} vs ${match.away}`,
                selectionName: `Maç Sonucu: 1`,
                odd: parseFloat(match.homeOdd.replace(',', '.')) || 1
              });
            }}
            className={`flex-1 rounded py-1.5 px-2.5 flex items-center justify-between transition-colors border relative overflow-hidden group/btn ${betSlip.some(s => s.id === (match.homeId || match.id+'_1')) ? 'bg-emerald-500/10 border-emerald-500/40' : 'bg-[#1a1f2c] hover:bg-[#252b3b] border-transparent hover:border-white/5'}`}
          >
            <span className="text-[11px] text-[#8e939d] font-medium">1</span>
            <span className={`text-[13px] font-bold ${betSlip.some(s => s.id === (match.homeId || match.id+'_1')) ? 'text-emerald-400' : 'text-white'}`}><AnimatedOdd value={match.homeOdd} /></span>
          </button>
          
          {/* X */}
          <button 
            onClick={(e) => { 
              e.stopPropagation(); 
              addSelection({
                id: match.drawId || match.id+'_x',
                matchId: match.id,
                matchName: `${match.home} vs ${match.away}`,
                selectionName: `Maç Sonucu: X`,
                odd: parseFloat(match.drawOdd.replace(',', '.')) || 1
              });
            }}
            className={`flex-1 rounded py-1.5 px-2.5 flex items-center justify-between transition-colors border relative overflow-hidden group/btn ${betSlip.some(s => s.id === (match.drawId || match.id+'_x')) ? 'bg-emerald-500/10 border-emerald-500/40' : 'bg-[#1a1f2c] hover:bg-[#252b3b] border-transparent hover:border-white/5'}`}
          >
            <span className="text-[11px] text-[#8e939d] font-medium truncate px-1">X</span>
            <span className={`text-[13px] font-bold ${betSlip.some(s => s.id === (match.drawId || match.id+'_x')) ? 'text-emerald-400' : 'text-white'}`}><AnimatedOdd value={match.drawOdd} /></span>
          </button>

          {/* 2 */}
          <button 
            onClick={(e) => { 
              e.stopPropagation(); 
              addSelection({
                id: match.awayId || match.id+'_2',
                matchId: match.id,
                matchName: `${match.home} vs ${match.away}`,
                selectionName: `Maç Sonucu: 2`,
                odd: parseFloat(match.awayOdd.replace(',', '.')) || 1
              });
            }}
            className={`flex-1 rounded py-1.5 px-2.5 flex items-center justify-between transition-colors border relative overflow-hidden group/btn ${betSlip.some(s => s.id === (match.awayId || match.id+'_2')) ? 'bg-emerald-500/10 border-emerald-500/40' : 'bg-[#1a1f2c] hover:bg-[#252b3b] border-transparent hover:border-white/5'}`}
          >
            <span className="text-[11px] text-[#8e939d] font-medium">2</span>
            <span className={`text-[13px] font-bold ${betSlip.some(s => s.id === (match.awayId || match.id+'_2')) ? 'text-emerald-400' : 'text-white'}`}><AnimatedOdd value={match.awayOdd} /></span>
          </button>

          {/* More markets */}
          <button 
            onClick={(e) => { 
              e.stopPropagation(); 
              if(onSelect) onSelect(match); 
            }}
            className="w-10 bg-[#1a1f2c] hover:bg-[#252b3b] rounded flex items-center justify-center transition-colors border border-transparent hover:border-white/5 text-slate-400"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
});
