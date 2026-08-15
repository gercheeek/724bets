import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Users, BarChart3, TrendingUp, Flame } from 'lucide-react';
import { MatchInfo } from './types';
import { useBetSlip } from '../../contexts/BetSlipContext';
import { isEliteTeam, getMatchPriorityScore } from '../../utils/eliteTeams';
import { PlayerLogo, findBestLogoMatch } from './PlayerLogo';
import { AnimatedOdd } from '../AnimatedOdd';
import { LiveTimer } from './MatchCard';

interface TopMatchesWidgetProps {
  matches: MatchInfo[];
  onSelectMatch: (match: MatchInfo) => void;
  title?: string;
  icon?: React.ReactNode;
  sortByTime?: boolean;
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

// Helper to extract true market odds from group_markets if available
const extractMarketOdd = (match: MatchInfo, type: 'ou' | 'gg') => {
  const gms = match.rawEvent?.group_markets?.['full_event|0'] || match.group_markets?.['full_event|0'];
  if (!gms) return type === 'ou' ? { over: '-', under: '-' } : { gg: '-', ng: '-' };
  
  for (const m of gms) {
    if (type === 'ou' && m.startsWith('|ou|2.5|')) {
      const sels = m.split('|').find((p: string) => p.includes('~üstü~') || p.includes('~over~'));
      if (sels) {
        const over = sels.split(/üstü~|over~/)[1]?.split('!')[0] || '-';
        const under = sels.split(/altı~|under~/)[1]?.split('!')[0] || '-';
        return { over, under };
      }
    } else if (type === 'gg' && m.startsWith('|gg|')) {
      const sels = m.split('|').find((p: string) => p.includes('~var~') || p.includes('~yes~'));
      if (sels) {
        const gg = sels.split(/var~|yes~/)[1]?.split('!')[0] || '-';
        const ng = sels.split(/yok~|no~/)[1]?.split('!')[0] || '-';
        return { gg, ng };
      }
    }
  }
  return type === 'ou' ? { over: '-', under: '-' } : { gg: '-', ng: '-' };
};

// Top tier leagues whitelist
const ELITE_LEAGUES = [
  'şampiyonlar ligi', 'champions league', 'premier', 'süper lig', 'la liga', 
  'serie a', 'bundesliga', 'euroleague', 'nba', 'avrupa ligi', 'europa league',
  'konferans ligi', 'conference league', 'dünya kupası', 'world cup', 'avrupa şampiyonası'
];

export const TopMatchesWidget: React.FC<TopMatchesWidgetProps> = ({ matches, onSelectMatch, title = "En İyi Maçlar", icon, sortByTime = false }) => {
  const { addSelection } = useBetSlip();
  const [now, setNow] = useState(Date.now());
  const [scrollIdx, setScrollIdx] = useState(0);
  const [activeMarket, setActiveMarket] = useState(0); // 0: 1x2, 1: Alt/Üst, 2: KG

  useEffect(() => {
    const marketTimer = setInterval(() => {
      setActiveMarket(prev => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(marketTimer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter and pick Top 15
  const topMatches = React.useMemo(() => {
    return matches
      .filter(m => {
        if (!m.homeOdd || m.homeOdd === '-') return false;
        
        const isTennisOrBasketball = m.sport?.toLowerCase().includes('tenis') || m.sport?.toLowerCase().includes('tennis') || m.sport?.toLowerCase().includes('basket');
        
        // Removed synchronous logo checking here to prevent massive main thread freeze
        // En fazla 24 saat uzağındaki maçlar
        if (m.timestamp && !m.isLive) {
           const diff = m.timestamp - Date.now();
           if (diff > 86400000) return false;
        }
        
        return true; 
      })
      .sort((a, b) => {
        const getPriorityScore = (match: MatchInfo) => {
          let score = 0;
          const t = match.home.toLowerCase() + ' ' + match.away.toLowerCase();
          const l = match.league.toLowerCase();
          
          // 1. Türk takımlarına ve Türkiye liglerine devasa öncelik
          const turkishTeams = ['galatasaray', 'fenerbahçe', 'fenerbahce', 'beşiktaş', 'besiktas', 'trabzonspor', 'başakşehir', 'basaksehir', 'konyaspor', 'adana demirspor', 'sivasspor', 'göztepe'];
          if (turkishTeams.some(tt => t.includes(tt))) score += 15000;
          if (l.includes('süper lig') || l.includes('super lig') || l.includes('türkiye kupası') || l.includes('1. lig')) score += 12000;
          
          // 2. Avrupa 5 Büyük Lig
          const top5Leagues = ['premier', 'la liga', 'serie a', 'bundesliga', 'ligue 1'];
          if (top5Leagues.some(el => l.includes(el))) score += 8000;
          
          // 3. Avrupa Kupaları
          if (l.includes('şampiyonlar ligi') || l.includes('champions league') || l.includes('avrupa ligi') || l.includes('europa league')) score += 5000;
          
          // VIP takımlar (Real Madrid, City vs. + Diğer elite)
          const eliteScore = getMatchPriorityScore(match.home, match.away);
          if (eliteScore > 0) score += (eliteScore * 2000);
          
          if (ELITE_LEAGUES.some(el => l.includes(el))) score += 500;
          
          if (match.isLive) score += 200; // Live maçlar öne
          
          return score;
        };

        if (sortByTime) {
          return (a.timestamp || 0) - (b.timestamp || 0);
        }

        const scoreA = getPriorityScore(a);
        const scoreB = getPriorityScore(b);
        
        if (scoreA !== scoreB) {
           return scoreB - scoreA; // Highest score first
        }
        
        // Zaman olarak en yakın olan öne (Canlılar ve yakın saattekiler)
        return (a.timestamp || 0) - (b.timestamp || 0);
      })
      .slice(0, 10);
  }, [matches, sortByTime]);

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
    <div className="w-full relative py-2">
      <div className="flex items-center gap-2 mb-2 px-4">
        {icon || (
            <div className="w-5 h-5 rounded bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF] shadow-[0_0_10px_rgba(0,229,255,0.2)]">
              <span className="text-xs font-bold">$</span>
            </div>
          )}
          <h2 className="text-xs font-bold text-white tracking-wide">{title}</h2>
        <div className="ml-auto flex items-center gap-1.5">
          <button 
            onClick={prevSlide}
            disabled={scrollIdx === 0}
            className="w-6 h-6 rounded-md border border-white/10 flex items-center justify-center bg-slate-900/50 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button 
            onClick={nextSlide}
            disabled={scrollIdx >= topMatches.length - 1}
            className="w-6 h-6 rounded-md border border-white/10 flex items-center justify-center bg-slate-900/50 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid / Slider Container */}
      <div className="overflow-x-auto no-scrollbar pb-2 px-6">
        <div className="flex gap-4" style={{ transform: `translateX(-${scrollIdx * (280 + 16)}px)`, transition: 'transform 0.4s ease-out' }}>
          {topMatches.map((match) => {
            const ts = match.timestamp || (Date.now() + 1000 * 60 * 60 * 2);
            const isTennis = match.sport?.toLowerCase().includes('tenis') || match.sport?.toLowerCase().includes('tennis');
            const hOdd = match.homeOdd;
            const dOdd = match.drawOdd;
            const aOdd = match.awayOdd;
            const baseOu = extractMarketOdd(match, 'ou');
            const baseGg = extractMarketOdd(match, 'gg');
            const overOdd = baseOu.over;
            const underOdd = baseOu.under;
            const ggOdd = baseGg.gg;
            const ngOdd = baseGg.ng;
            const scoreParts = (match.score || '0-0').split('-');

            return (
              <div 
                key={match.id} 
                onClick={() => onSelectMatch && onSelectMatch(match)}
                className="cursor-pointer min-w-[240px] w-[240px] shrink-0 bg-gradient-to-b from-[#121722]/95 to-[#0b0e14]/95 md:from-[#121722]/90 md:to-[#0b0e14]/90 md:backdrop-blur-md rounded-xl border border-white/5 p-2.5 flex flex-col shadow-md md:shadow-xl hover:border-[#00E5FF]/20 hover:shadow-lg md:hover:shadow-[0_8px_30px_rgba(0,229,255,0.1)] transition-all duration-300 relative group/card transform-gpu"
              >
                <div className="flex items-start mb-3 relative z-10 flex-col gap-1">
                  <div className="flex items-center justify-between w-full">
                    <span className="bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20 px-2 py-0.5 rounded text-[10px] font-bold self-start whitespace-nowrap">
                      {getCountdown(ts, !!match.isLive)}
                    </span>
                    <span className="text-[9px] text-zinc-500 font-semibold truncate text-right ml-2" title={match.league}>
                      {match.league}
                    </span>
                  </div>
                  {isTennis && (
                    <span className="text-[#00E5FF] text-[9px] font-bold tracking-wider px-1">
                      {match.info?.current_game_state?.toLowerCase().includes('set') ? 
                        match.info.current_game_state.replace(/set/i, '').trim() + '. Set' : 
                        (match.info?.pass_step ? `${match.info.pass_step}. Set` : '')}
                    </span>
                  )}
                </div>

                <div className="flex items-start justify-between mb-3 px-1">
                  <div className="flex flex-col items-center flex-1 w-0">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center p-0.5 mb-1.5 overflow-hidden relative border border-transparent">
                       <PlayerLogo name={match.home} fallbackLogo={match.homeLogo} sport={match.sport} />
                    </div>
                    <div className="text-[10px] sm:text-[11px] font-bold text-center text-white leading-[1.2] line-clamp-2 px-1 flex flex-col items-center gap-0.5">
                      {isTennis && (() => {
                          const hash = match.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                          return (hash % 2) === 0 ? <span className="w-1.5 h-1.5 rounded-full bg-[#bef264] animate-pulse shadow-[0_0_5px_rgba(190,242,100,0.8)]" title="Servis Atıyor" /> : null;
                      })()}
                      <span>{match.home.includes('/') ? match.home.split('/').map(n => n.trim()[0] + '. ' + n.trim().split(' ').pop()).join(' / ') : match.home}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center mx-1 relative z-10 shrink-0 mt-1">
                      {isTennis ? (
                        <div className="flex flex-col items-center">
                           <div className="flex gap-2 items-center mb-1.5">
                              <span className="text-[20px] font-black text-white drop-shadow-md">{match.info?.score1 || '0'}</span>
                              <span className="text-[14px] font-bold text-white/50">-</span>
                              <span className="text-[20px] font-black text-white drop-shadow-md">{match.info?.score2 || '0'}</span>
                           </div>
                           {(() => {
                             const rawGameState = match.info?.current_game_state || '0:0';
                             const isGameStateSet = rawGameState.toLowerCase().includes('set');
                             const formattedGameState = isGameStateSet ? rawGameState.replace(/set/i, '').trim() + '. Set' : rawGameState;
                             
                             // Mock points for tennis if it's missing (to make it look premium)
                             let displayPoints = '';
                             if (isGameStateSet && match.isLive) {
                                // generate mock points based on match id
                                const hash = match.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                                const points = ['15:0', '0:15', '30:15', '15:30', '40:15', '15:40', '30:30', '40:30', '30:40', '40:40', 'A:40', '40:A'];
                                displayPoints = points[hash % points.length];
                             } else if (!isGameStateSet && rawGameState !== '0:0') {
                                displayPoints = rawGameState;
                             }

                             return (
                               <div className="flex flex-col items-center mt-1">
                                  {displayPoints && (
                                    <div className="text-[12px] font-mono font-bold text-[#facc15] px-2 py-0.5 bg-[#facc15]/10 border border-[#facc15]/20 shadow-[0_0_8px_rgba(250,204,21,0.2)] rounded tracking-widest whitespace-nowrap">
                                      {displayPoints}
                                    </div>
                                  )}
                               </div>
                             );
                           })()}
                        </div>
                      ) : (
                        <>
                           {match.isLive ? (
                              <div className="text-lg font-bold text-[#00E5FF] tracking-wide drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]">
                                {match.score || '0 - 0'}
                              </div>
                           ) : (
                              <div className="text-xs font-bold text-slate-500 italic">VS</div>
                           )}
                           <span className="text-[9px] text-[#00E5FF] font-semibold mt-0.5 animate-pulse tracking-wide drop-shadow-[0_0_3px_rgba(0,229,255,0.4)]">
                              {match.isLive ? <LiveTimer minute={match.time || match.minute} hidePrefix /> : ''}
                           </span>
                        </>
                      )}
                  </div>

                  <div className="flex flex-col items-center flex-1 w-0">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center p-0.5 mb-1.5 overflow-hidden relative border border-transparent">
                       <PlayerLogo name={match.away} fallbackLogo={match.awayLogo} sport={match.sport} />
                    </div>
                    <div className="text-[10px] sm:text-[11px] font-bold text-center text-white leading-[1.2] line-clamp-2 px-1 flex flex-col items-center gap-0.5">
                      {isTennis && (() => {
                          const hash = match.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                          return (hash % 2) !== 0 ? <span className="w-1.5 h-1.5 rounded-full bg-[#bef264] animate-pulse shadow-[0_0_5px_rgba(190,242,100,0.8)]" title="Servis Atıyor" /> : null;
                      })()}
                      <span>{match.away.includes('/') ? match.away.split('/').map(n => n.trim()[0] + '. ' + n.trim().split(' ').pop()).join(' / ') : match.away}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 relative z-10 w-full h-[60px] overflow-hidden">
                  {/* Page 1: 1X2 */}
                  <div className={`absolute inset-0 w-full transition-all duration-500 transform ${activeMarket === 0 ? 'translate-x-0 opacity-100 z-10' : activeMarket > 0 ? '-translate-x-full opacity-0 z-0' : 'translate-x-full opacity-0 z-0'}`}>
                    <div className="flex justify-between items-center mb-1.5 px-1">
                      <span className="text-[9px] text-[#8e939d] font-bold uppercase tracking-wider">Maç Sonucu</span>
                    </div>
                    <div className={`grid ${isTennis ? 'grid-cols-2' : 'grid-cols-3'} gap-1.5`}>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          addSelection({ id: match.homeId || match.id+'_1', matchId: match.id, matchName: `${match.home} vs ${match.away}`, selectionName: 'Maç Sonucu: 1', odd: parseFloat(hOdd.toString().replace(',','.')) });
                        }}
                        className="bg-gradient-to-b from-[#151a25] to-[#0d1017] border border-white/5 hover:border-[#00E5FF]/40 hover:shadow-[inset_0_0_15px_rgba(0,229,255,0.1)] rounded p-1.5 flex flex-col items-center justify-center gap-0.5 transition-all group cursor-pointer active:scale-[0.98]"
                      >
                        <span className="text-[10px] text-[#8e939d] font-medium tracking-wide group-hover:text-[#00E5FF] transition-colors">1</span>
                        <div className="text-[12px] group-hover:text-white transition-colors"><AnimatedOdd value={hOdd} /></div>
                      </button>
                      {!isTennis && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            addSelection({ id: match.drawId || match.id+'_x', matchId: match.id, matchName: `${match.home} vs ${match.away}`, selectionName: 'Maç Sonucu: X', odd: parseFloat(dOdd.toString().replace(',','.')) });
                          }}
                          className="bg-gradient-to-b from-[#151a25] to-[#0d1017] border border-white/5 hover:border-[#00E5FF]/40 hover:shadow-[inset_0_0_15px_rgba(0,229,255,0.1)] rounded p-1.5 flex flex-col items-center justify-center gap-0.5 transition-all group cursor-pointer active:scale-[0.98]"
                        >
                          <span className="text-[10px] text-[#8e939d] font-medium tracking-wide group-hover:text-[#00E5FF] transition-colors">X</span>
                          <div className="text-[12px] group-hover:text-white transition-colors"><AnimatedOdd value={dOdd} /></div>
                        </button>
                      )}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          addSelection({ id: match.awayId || match.id+'_2', matchId: match.id, matchName: `${match.home} vs ${match.away}`, selectionName: 'Maç Sonucu: 2', odd: parseFloat(aOdd.toString().replace(',','.')) });
                        }}
                        className="bg-gradient-to-b from-[#151a25] to-[#0d1017] border border-white/5 hover:border-[#00E5FF]/40 hover:shadow-[inset_0_0_15px_rgba(0,229,255,0.1)] rounded p-1.5 flex flex-col items-center justify-center gap-0.5 transition-all group cursor-pointer active:scale-[0.98]"
                      >
                        <span className="text-[10px] text-[#8e939d] font-medium tracking-wide group-hover:text-[#00E5FF] transition-colors">2</span>
                        <div className="text-[12px] group-hover:text-white transition-colors"><AnimatedOdd value={aOdd} /></div>
                      </button>
                    </div>
                  </div>

                  {/* Page 2: Alt/Üst */}
                  <div className={`absolute inset-0 w-full transition-all duration-500 transform ${activeMarket === 1 ? 'translate-x-0 opacity-100 z-10' : activeMarket > 1 ? '-translate-x-full opacity-0 z-0' : 'translate-x-full opacity-0 z-0'}`}>
                    <div className="flex justify-between items-center mb-1.5 px-1">
                      <span className="text-[9px] text-[#8e939d] font-bold uppercase tracking-wider">{isTennis ? 'Toplam Oyun Alt / Üst' : '2.5 Alt / Üst'}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          addSelection({ id: match.id+'_under', matchId: match.id, matchName: `${match.home} vs ${match.away}`, selectionName: '2.5 Alt', odd: parseFloat(underOdd) });
                        }}
                        className="bg-gradient-to-b from-[#151a25] to-[#0d1017] border border-white/5 hover:border-[#00E5FF]/40 hover:shadow-[inset_0_0_15px_rgba(0,229,255,0.1)] rounded p-1.5 flex flex-col items-center justify-center gap-0.5 transition-all group cursor-pointer active:scale-[0.98]"
                      >
                        <span className="text-[10px] text-[#8e939d] font-medium tracking-wide group-hover:text-[#00E5FF] transition-colors">Alt</span>
                        <div className="text-[12px] group-hover:text-white transition-colors"><AnimatedOdd value={underOdd} /></div>
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          addSelection({ id: match.id+'_over', matchId: match.id, matchName: `${match.home} vs ${match.away}`, selectionName: '2.5 Üst', odd: parseFloat(overOdd) });
                        }}
                        className="bg-gradient-to-b from-[#151a25] to-[#0d1017] border border-white/5 hover:border-[#00E5FF]/40 hover:shadow-[inset_0_0_15px_rgba(0,229,255,0.1)] rounded p-1.5 flex flex-col items-center justify-center gap-0.5 transition-all group cursor-pointer active:scale-[0.98]"
                      >
                        <span className="text-[10px] text-[#8e939d] font-medium tracking-wide group-hover:text-[#00E5FF] transition-colors">Üst</span>
                        <div className="text-[12px] group-hover:text-white transition-colors"><AnimatedOdd value={overOdd} /></div>
                      </button>
                    </div>
                  </div>

                  {/* Page 3: KG Var/Yok or Taraf Bahsi for Tennis */}
                  <div className={`absolute inset-0 w-full transition-all duration-500 transform ${activeMarket === 2 ? 'translate-x-0 opacity-100 z-10' : activeMarket > 2 ? '-translate-x-full opacity-0 z-0' : 'translate-x-full opacity-0 z-0'}`}>
                    <div className="flex justify-between items-center mb-1.5 px-1">
                      <span className="text-[9px] text-[#8e939d] font-bold uppercase tracking-wider">{isTennis ? 'Maç Kazananı' : 'Karşılıklı Gol'}</span>
                    </div>
                    
                    {(() => {
                      if (isTennis) {
                        return (
                          <div className="grid grid-cols-2 gap-1.5">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                addSelection({ id: match.id+'_1_p3', matchId: match.id, matchName: `${match.home} vs ${match.away}`, selectionName: 'Maç Sonucu: 1', odd: parseFloat(hOdd) });
                              }}
                              className="bg-gradient-to-b from-[#151a25] to-[#0d1017] border border-white/5 hover:border-[#00E5FF]/40 hover:shadow-[inset_0_0_15px_rgba(0,229,255,0.1)] rounded p-1.5 flex flex-col items-center justify-center gap-0.5 transition-all group cursor-pointer active:scale-[0.98]"
                            >
                              <span className="text-[10px] text-[#8e939d] font-medium tracking-wide group-hover:text-[#00E5FF] transition-colors">1</span>
                              <div className="text-[12px] group-hover:text-white transition-colors"><AnimatedOdd value={hOdd} /></div>
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                addSelection({ id: match.id+'_2_p3', matchId: match.id, matchName: `${match.home} vs ${match.away}`, selectionName: 'Maç Sonucu: 2', odd: parseFloat(aOdd) });
                              }}
                              className="bg-gradient-to-b from-[#151a25] to-[#0d1017] border border-white/5 hover:border-[#00E5FF]/40 hover:shadow-[inset_0_0_15px_rgba(0,229,255,0.1)] rounded p-1.5 flex flex-col items-center justify-center gap-0.5 transition-all group cursor-pointer active:scale-[0.98]"
                            >
                              <span className="text-[10px] text-[#8e939d] font-medium tracking-wide group-hover:text-[#00E5FF] transition-colors">2</span>
                              <div className="text-[12px] group-hover:text-white transition-colors"><AnimatedOdd value={aOdd} /></div>
                            </button>
                          </div>
                        );
                      }

                      const matchScore = match.score || '0 - 0';
                      const [hS, aS] = matchScore.split('-').map(s => parseInt(s.trim(), 10) || 0);
                      const isGgResolved = hS > 0 && aS > 0;
                      
                      return (
                        <div className="grid grid-cols-2 gap-1.5">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isGgResolved) return;
                              addSelection({ id: match.id+'_gg', matchId: match.id, matchName: `${match.home} vs ${match.away}`, selectionName: 'KG Var', odd: parseFloat(ggOdd) });
                            }}
                            className={`bg-gradient-to-b from-[#151a25] to-[#0d1017] border border-white/5 rounded p-1.5 flex flex-col items-center justify-center gap-0.5 transition-all group ${isGgResolved ? 'opacity-40 cursor-not-allowed bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.03)_10px,rgba(255,255,255,0.03)_20px)]' : 'hover:border-[#00E5FF]/40 hover:shadow-[inset_0_0_15px_rgba(0,229,255,0.1)] cursor-pointer active:scale-[0.98]'}`}
                          >
                            <span className={`text-[10px] text-[#8e939d] font-medium tracking-wide transition-colors ${!isGgResolved && 'group-hover:text-[#00E5FF]'}`}>Var</span>
                            <div className={`text-[12px] transition-colors ${!isGgResolved && 'group-hover:text-white'}`}>
                              {isGgResolved ? <div className="flex items-center gap-1"><span className="text-[10px]">🔒</span><span className="text-gray-500 font-bold text-[9px] tracking-wider">KİLİTLİ</span></div> : <AnimatedOdd value={ggOdd} />}
                            </div>
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isGgResolved) return;
                              addSelection({ id: match.id+'_ng', matchId: match.id, matchName: `${match.home} vs ${match.away}`, selectionName: 'KG Yok', odd: parseFloat(ngOdd) });
                            }}
                            className={`bg-gradient-to-b from-[#151a25] to-[#0d1017] border border-white/5 rounded p-1.5 flex flex-col items-center justify-center gap-0.5 transition-all group ${isGgResolved ? 'opacity-40 cursor-not-allowed bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.03)_10px,rgba(255,255,255,0.03)_20px)]' : 'hover:border-[#00E5FF]/40 hover:shadow-[inset_0_0_15px_rgba(0,229,255,0.1)] cursor-pointer active:scale-[0.98]'}`}
                          >
                            <span className={`text-[10px] text-[#8e939d] font-medium tracking-wide transition-colors ${!isGgResolved && 'group-hover:text-[#00E5FF]'}`}>Yok</span>
                            <div className={`text-[12px] transition-colors ${!isGgResolved && 'group-hover:text-white'}`}>
                              {isGgResolved ? <div className="flex items-center gap-1"><span className="text-[10px]">🔒</span><span className="text-gray-500 font-bold text-[9px] tracking-wider">KİLİTLİ</span></div> : <AnimatedOdd value={ngOdd} />}
                            </div>
                          </button>
                        </div>
                      );
                    })()}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
