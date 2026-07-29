import React, { useState, useEffect } from 'react';
import { MatchInfo } from './types';
import { PlayerLogo } from './PlayerLogo';
import { AnimatedOdd } from '../AnimatedOdd';
import { LiveTimer } from './MatchCard';
import { ODDS_ENGINE_CONFIG } from '../../utils/oddsEngineConfig';
import { useBetSlip } from '../../contexts/BetSlipContext';
import { generateDetailedMarkets } from '../../utils/oddsGenerator';
import { 
  PlayCircle, Clock, ChevronDown, ChevronUp, Star, Tv, Activity, Flame, 
  MapPin, Trophy, Flag, Pin, BarChart2, Scale
} from 'lucide-react';
import { isEliteTeam } from '../../utils/eliteTeams';

interface LiveMatchInlineProps {
  match: MatchInfo;
  onBack: () => void;
  // This is optional if we want to show a ticker
  allLiveMatches?: MatchInfo[];
  onSelectAnotherMatch?: (m: MatchInfo) => void;
}

const translateMarket = (name: string) => {
  const map: Record<string, string> = {
    'Match_Winner': 'Maç Sonucu',
    '1X2': '1x2',
    'Double_Chance': 'Çifte Şans',
    'Half_Time_Result': 'İlk Yarı Sonucu',
    'Asian_Handicap': 'Handikap (Asya)',
    'Handicap': 'Handikap',
    'Total': 'Toplam',
    'Over_Under': 'Alt/Üst',
    'Both_Teams_To_Score': 'Karşılıklı Gol',
    'Odd_Even': 'Tek / Çift',
    'CS': 'Doğru Skor',
    'Correct_Score': 'Doğru Skor',
    'First_Team_To_Score': 'İlk Golü Atan',
    'Last_Team_To_Score': 'Son Golü Atan',
    'Half_Time_Double_Chance': 'İlk Yarı Çifte Şans',
    'Draw_No_Bet': 'Beraberlikte İade',
    'HT_FT': 'İlk Yarı / Maç Sonucu',
    'Highest_Scoring_Half': 'En Çok Gol Olan Yarı'
  };
  return map[name] || name.replace(/_/g, ' ');
};

const translateSelection = (type: string) => {
  const lower = type.toLowerCase();
  if (lower === 'home' || lower === 'w1' || lower === '1') return '1';
  if (lower === 'away' || lower === 'w2' || lower === '2') return '2';
  if (lower === 'draw' || lower === 'x') return 'beraberlik';
  if (lower === 'over') return 'üstü';
  if (lower === 'under') return 'altı';
  if (lower === 'yes') return 'Evet';
  if (lower === 'no') return 'Hayır';
  if (lower === 'odd') return 'Tek';
  if (lower === 'even') return 'Çift';
  return type;
};

export const LiveMatchInline: React.FC<LiveMatchInlineProps> = ({ 
  match, 
  onBack, 
  allLiveMatches = [],
  onSelectAnotherMatch 
}) => {
  const { betSlip, addSelection } = useBetSlip();
  const raw = match.rawEvent || {};
  const data = raw.data || raw; 
  const stats = data.stats || {};
  
  let homeStats = stats.team1_value || {};
  let awayStats = stats.team2_value || {};
  
  const isFootball = match.sport?.toLowerCase().includes('futbol') || match.sport?.toLowerCase().includes('soccer');
  const isBasketball = match.sport?.toLowerCase().includes('basketbol') || match.sport?.toLowerCase().includes('basketball');
  const isTennis = match.sport?.toLowerCase().includes('tenis') || match.sport?.toLowerCase().includes('tennis');

  // Same mock stats logic as modal
  if (Object.keys(homeStats).length === 0 && match.minute !== 'Yakında') {
    const min = parseInt(match.minute) || 45;
    const homeAdv = parseFloat(match.homeOdd) < parseFloat(match.awayOdd) ? 1.2 : 0.8;
    if (isFootball) {
      homeStats = { Corner: Math.floor(min / 15 * homeAdv), YellowCard: Math.floor(min / 30), RedCard: 0 };
      awayStats = { Corner: Math.floor(min / 15 * (2 - homeAdv)), YellowCard: Math.floor(min / 35), RedCard: 0 };
    }
  }
  
  const getStat = (key: string) => ({ home: homeStats[key] || 0, away: awayStats[key] || 0 });
  const corners = getStat('Corner');
  const yellowCards = getStat('YellowCard');
  const redCards = getStat('RedCard');
  
  const groupMarkets = data.group_markets || raw.group_markets || {};
  let allMarkets: string[] = [];
  if (groupMarkets && typeof groupMarkets === 'object') {
    Object.values(groupMarkets).forEach((group) => {
      if (Array.isArray(group)) allMarkets = [...allMarkets, ...group];
    });
  }
  
  let markets = Array.from(new Set(allMarkets)).filter(m => m && typeof m === 'string' && m.includes('|'));
  
  // Calculate current total goals for dynamic odds generation
  let currentTotalGoals = 0;
  if (match.score) {
     const cleanScore = match.score.replace(/[^0-9:-]/g, '');
     if (cleanScore.includes(':')) {
        const p = cleanScore.split(':');
        currentTotalGoals = (parseInt(p[0]) || 0) + (parseInt(p[1]) || 0);
     } else if (cleanScore.includes('-')) {
        const p = cleanScore.split('-');
        currentTotalGoals = (parseInt(p[0]) || 0) + (parseInt(p[1]) || 0);
     }
  }
  
  const parsedMinute = parseInt(match.minute?.replace(/[^0-9]/g, '') || '0');
  const totalCorners = (parseInt(corners.home) || 0) + (parseInt(corners.away) || 0);

  // Procedurally generate markets for lower-tier / mock matches if data is missing or it's an elite match
  if ((markets.length < 5 || isEliteTeam(match.home) || isEliteTeam(match.away)) && match.homeOdd && match.drawOdd && match.awayOdd) {
    const generated = generateDetailedMarkets(
      parseFloat(match.homeOdd.toString()), 
      parseFloat(match.drawOdd.toString()), 
      parseFloat(match.awayOdd.toString()), 
      match.home, 
      match.away,
      currentTotalGoals,
      parsedMinute,
      totalCorners
    );
    
    const existingNames = new Set(markets.map(m => (m.split('|')[1] || '').toLowerCase().trim()));
    generated.forEach(g => {
       const gName = (g.split('|')[1] || '').toLowerCase().trim();
       if (!existingNames.has(gName)) {
           markets.push(g);
       }
    });
  }
  


  // State for expanded accordions
  const [expandedMarkets, setExpandedMarkets] = useState<Record<number, boolean>>({});
  
  useEffect(() => {
    // Expand top 5 by default
    const initialExpanded: Record<number, boolean> = {};
    markets.forEach((_, idx) => {
        initialExpanded[idx] = idx < 5;
    });
    setExpandedMarkets(initialExpanded);
  }, [match.id]);

  const toggleMarket = (idx: number) => {
    setExpandedMarkets(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const categories = ['Ana Seçenekler', 'Bahis sihirbazı', 'Toplam', 'İstatistikler', 'Yarılar', 'Kornerler', 'Oyuncular'];
  const [activeCategory, setActiveCategory] = useState('Ana Seçenekler');
  
  const [activeRightTab, setActiveRightTab] = useState<'video'|'animation'>('animation');
  const [animTab, setAnimTab] = useState<'pitch'|'stats'|'timeline'|'h2h'|'standings'>('pitch');

  // Custom function to format the selections based on screenshots
  // 1X2 -> Chelsea, beraberlik, Western...
  const formatSelectionLabel = (marketName: string, rawType: string, home: string, away: string) => {
     const t = rawType.toLowerCase();
     if (t === '1' || t === 'home') return home;
     if (t === '2' || t === 'away') return away;
     if (t === 'x' || t === 'draw') return 'beraberlik';
     
     if (marketName === 'Çifte Şans') {
        if (t === '1x') return `${home} veya beraberlik`;
        if (t === '12') return `${home} veya ${away}`;
        if (t === 'x2') return `beraberlik veya ${away}`;
     }
     
     if (marketName.includes('Handikap')) {
        // usually rawType looks like "(-1) 1"
        if (rawType.includes('1')) return rawType.replace('1', home);
        if (rawType.includes('2')) return rawType.replace('2', away);
     }
     
     if (marketName === 'Toplam' || marketName === 'Toplam (Asya)') {
        // '2.5 üstü'
        return rawType;
     }

     return translateSelection(rawType);
  };

  return (
    <div className="flex flex-col w-full h-full pb-10">
      
      {/* Ticker for other live matches */}
      {allLiveMatches.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 mb-2 px-1">
           <button 
             onClick={onBack}
             className="shrink-0 flex items-center justify-center w-8 h-8 rounded bg-[#1a1d29] hover:bg-white/10 text-white/50 hover:text-white transition-colors"
           >
             <ChevronDown className="w-5 h-5 rotate-90" />
           </button>
           
           {allLiveMatches.map((m, idx) => (
             <button 
               key={m.id || idx}
               onClick={() => onSelectAnotherMatch && onSelectAnotherMatch(m)}
               className={`shrink-0 flex flex-col justify-center px-4 py-2.5 rounded-lg border transition-all duration-200 min-w-[180px] md:min-w-[200px] ${
                 m.id === match.id 
                 ? 'bg-[#1a1d29] border-[#06b6d4]/40 shadow-[0_0_15px_rgba(6,182,212,0.15)]' 
                 : 'bg-[#101114] border-[#1f222d] hover:border-[#06b6d4]/30 hover:bg-[#1a1d29]/50'
               }`}
             >
                <div className="flex items-center gap-2 text-[11px] font-bold tracking-wider text-[#ef4444] mb-2 uppercase">
                   <div className="w-1.5 h-1.5 rounded-full bg-[#ef4444] animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
                   {m.minute}
                </div>
                <div className="flex items-center justify-between text-[13px] font-semibold text-zinc-100 mb-1.5">
                   <span className="truncate max-w-[120px] md:max-w-[140px]">{m.home}</span>
                   <span className="text-[#06b6d4] font-black">{String(m.score).split('-')[0] || 0}</span>
                </div>
                <div className="flex items-center justify-between text-[13px] font-semibold text-zinc-100">
                   <span className="truncate max-w-[120px] md:max-w-[140px]">{m.away}</span>
                   <span className="text-[#06b6d4] font-black">{String(m.score).split('-')[1] || 0}</span>
                </div>
             </button>
           ))}
        </div>
      )}

      {/* Main Grid: Left (Score & Markets) + Right (Video) */}
      <div className="flex flex-col xl:flex-row gap-4">
         
         {/* Left Column */}
         <div className="flex-1 flex flex-col min-w-0">
            
            {/* SCOREBOARD BLOCK */}
            <div className="bg-[#1a1d29] border border-[#222635] rounded-xl p-4 md:p-5 flex flex-col relative overflow-hidden shadow-lg mb-4 group">
               {/* Dynamic Mesh Gradient Background */}
               <div className="absolute inset-0 bg-gradient-to-br from-[#06b6d4]/5 via-transparent to-[#3b82f6]/5 opacity-50"></div>
               <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#06b6d4]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
               
               {/* Breadcrumb / League Name */}
               <div className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-400 mb-6 z-10">
                 <Flag className="w-3.5 h-3.5" />
                 <span>{match.league || 'Uluslararası • Seçkin Kulüp Hazırlık Maçları'}</span>
               </div>
               
               {/* Match Info Area */}
               <div className="flex items-center justify-between z-10 px-2 md:px-6">
                  {/* Home */}
                  <div className="flex flex-col flex-1 max-w-[40%]">
                     <div className="w-10 h-10 md:w-14 md:h-14 bg-white/5 rounded-full flex items-center justify-center p-1.5 mb-3 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                       <PlayerLogo name={match.home} fallbackLogo={match.homeLogo} />
                     </div>
                     <span className="text-[13px] md:text-[15px] font-bold text-white leading-tight mb-2 line-clamp-2 pr-2 break-words">{match.home}</span>
                     <div className="flex items-center gap-1 h-4">
                        {match.isLive && (
                           <>
                              <div className="w-2.5 h-3.5 bg-[#ef4444] rounded-[1px]"></div>
                              <span className="text-white text-[10px] font-bold mx-1">{redCards.home}</span>
                              <div className="w-2.5 h-3.5 bg-yellow-500 rounded-[1px]"></div>
                              <span className="text-white text-[10px] font-bold mx-1">{yellowCards.home}</span>
                              <Flag className="w-3 h-3 text-zinc-400 ml-1" />
                              <span className="text-white text-[10px] font-bold ml-0.5">{corners.home}</span>
                           </>
                        )}
                     </div>
                  </div>

                  {/* Score & Time */}
                  <div className="flex flex-col items-center justify-start flex-1 shrink-0 mt-[-30px]">
                     <div className={`flex items-center justify-center gap-1.5 text-[11px] font-black tracking-widest uppercase mb-3 ${match.isLive ? 'text-[#ef4444] drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'text-zinc-400'}`}>
                        {match.isLive ? (
                          <>
                             <div className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ef4444] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#ef4444]"></span>
                             </div>
                             <LiveTimer minute={match.minute} hidePrefix />
                          </>
                        ) : (
                          <span>{match.startTime || match.minute || 'BAŞLAMADI'}</span>
                        )}
                     </div>
                     <div className="flex items-center gap-2 md:gap-4 text-3xl md:text-5xl font-black text-white tabular-nums drop-shadow-md">
                        <div className="w-10 h-12 md:w-14 md:h-16 bg-[#101114] border border-[#222635] rounded-lg flex items-center justify-center shadow-inner">
                           {String(match.score).split('-')[0]?.trim() || '0'}
                        </div>
                        <span className="text-zinc-600">:</span>
                        <div className="w-10 h-12 md:w-14 md:h-16 bg-[#101114] border border-[#222635] rounded-lg flex items-center justify-center shadow-inner">
                           {String(match.score).split('-')[1]?.trim() || '0'}
                        </div>
                     </div>

                  </div>

                  {/* Away */}
                  <div className="flex flex-col items-end text-right flex-1 max-w-[40%]">
                     <div className="w-10 h-10 md:w-14 md:h-14 bg-white/5 rounded-full flex items-center justify-center p-1.5 mb-3 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                       <PlayerLogo name={match.away} fallbackLogo={match.awayLogo} />
                     </div>
                     <span className="text-[13px] md:text-[15px] font-bold text-white leading-tight mb-2 line-clamp-2 pl-2 break-words">{match.away}</span>
                     <div className="flex items-center justify-end gap-1 h-4">
                        {match.isLive && (
                           <>
                              <div className="w-2.5 h-3.5 bg-[#ef4444] rounded-[1px]"></div>
                              <span className="text-white text-[10px] font-bold mx-1">{redCards.away}</span>
                              <div className="w-2.5 h-3.5 bg-yellow-500 rounded-[1px]"></div>
                              <span className="text-white text-[10px] font-bold mx-1">{yellowCards.away}</span>
                              <Flag className="w-3 h-3 text-zinc-400 ml-1" />
                              <span className="text-white text-[10px] font-bold ml-0.5">{corners.away}</span>
                           </>
                        )}
                     </div>
                  </div>
               </div>
            </div>

            {/* CATEGORY TABS (GLOW TAB V2) */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-[#222635] mb-4 px-1">
               {categories.map((cat, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveCategory(cat)}
                    className={`whitespace-nowrap px-4 py-3 text-[13px] font-black transition-all relative rounded-t-lg overflow-hidden ${
                       activeCategory === cat ? 'text-[#06b6d4] bg-[#06b6d4]/10' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                    }`}
                  >
                     <div className="relative z-10 flex items-center gap-1.5">
                       {cat === 'Bahis sihirbazı' && <Star className={`w-3.5 h-3.5 ${activeCategory === cat ? 'text-[#06b6d4]' : 'text-zinc-500'}`} fill="currentColor" />}
                       {cat}
                       {idx === 0 && <span className={`text-[10px] px-1.5 py-0.5 rounded ml-1 ${activeCategory === cat ? 'bg-[#06b6d4]/20 text-[#06b6d4]' : 'bg-white/10 text-white'}`}>15</span>}
                     </div>
                     {activeCategory === cat && (
                       <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#06b6d4] shadow-[0_0_15px_rgba(6,182,212,0.8)]"></div>
                     )}
                  </button>
               ))}
            </div>
            
            {/* MATCH FINISHED / LOCKED STATE */}
            {(match.isFinished || ODDS_ENGINE_CONFIG.rules.lockKeywords.includes(match.minute || '')) ? (
               <div className="flex flex-col items-center justify-center py-12 px-4 bg-[#12141c] rounded-xl border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
                  <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                     <span className="text-3xl">🔒</span>
                  </div>
                  <h3 className="text-xl font-black text-white mb-2 tracking-wide uppercase">Bahisler Kapandı</h3>
                  <p className="text-zinc-500 text-sm text-center max-w-sm">
                     Bu karşılaşma sona ermiş veya askıya alınmıştır. Şu an için yeni bahis alımı kapalıdır.
                  </p>
               </div>
            ) : (
               <div className="flex flex-col gap-3">
               {markets.filter(market => {
                  const parts = market.split('|');
                  const marketName = translateMarket(parts[1] || '');
                  if (activeCategory === 'Ana Seçenekler') return ['1x2', 'Çifte Şans', 'Beraberlikte iade', 'Handikap', 'Karşılıklı Gol'].includes(marketName);
                  if (activeCategory === 'Toplam') return marketName.includes('Toplam');
                  if (activeCategory === 'Yarılar') return marketName.includes('Yarı');
                  if (activeCategory === 'Kornerler') return marketName.includes('Korner');
                  return true; // Default fallback for other tabs
               }).map((market: string, idx: number) => {
                  const parts = market.split('|');
                  const rawMarketName = parts[1] || 'Bahis Türü';
                  const marketName = translateMarket(rawMarketName);
                  const isExpanded = expandedMarkets[idx] !== false;
                  
                  const selectionsPart = parts.find((p: string) => p.includes('~'));
                  if (!selectionsPart) return null;
                  
                  const selections = selectionsPart.split('!');
                  
                  // determine layout cols
                  let colsClass = "grid-cols-2";
                  if (marketName === '1x2' || selections.length === 3) colsClass = "grid-cols-3";
                  if (selections.length > 4) colsClass = "grid-cols-2 md:grid-cols-2"; // 1x2 uses 3 but others can use 2

                  return (
                    <div key={idx} className="bg-[#12141c] rounded-xl overflow-hidden shadow-md">
                       {/* Accordion Header */}
                       <button 
                         onClick={() => toggleMarket(idx)}
                         className="w-full flex items-center justify-between p-4 bg-[#1a1d29] hover:bg-[#1f2230] transition-colors group border-b border-[#222635]/50"
                       >
                          <div className="flex items-center gap-2">
                             <Pin className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 -rotate-45" />
                             <span className="font-bold text-[13px] md:text-[14px] text-white">{marketName}</span>
                          </div>
                          <div className="w-6 h-6 rounded bg-white/5 flex items-center justify-center">
                             {isExpanded ? <ChevronUp className="w-4 h-4 text-white" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
                          </div>
                       </button>

                       {/* Accordion Body */}
                       <div className={`transition-all duration-300 ease-in-out origin-top ${isExpanded ? 'max-h-[1000px] opacity-100 p-4' : 'max-h-0 opacity-0 overflow-hidden py-0 px-4'}`}>
                          <div className={`grid ${colsClass} gap-2`}>
                             {selections.map((sel: string, sIdx: number) => {
                               const sParts = sel.split('~');
                               if (sParts.length < 3) return null;
                               
                               let rawType = sParts[1];
                               let oddValue = parseFloat(sParts[2]);
                               let typeLabel = formatSelectionLabel(marketName, rawType, match.home, match.away);
                               
                               // Append extra dynamic string if it's there (like score "1-0" in CS)
                               if (sParts.length > 3 && sParts[3]) {
                                  typeLabel = `${typeLabel} ${sParts[3]}`.trim();
                               }
                               
                               const selId = sParts[0]; 
                               const isSelected = betSlip.some(s => s.id === selId);
                               
                               return (
                                 <button
                                   key={sIdx}
                                   onClick={() => {
                                     addSelection({
                                       id: selId,
                                       matchId: match.id,
                                       matchName: `${match.home} vs ${match.away}`,
                                       selectionName: `${marketName}: ${typeLabel}`,
                                       odd: oddValue
                                     });
                                   }}
                                   className={`min-h-[46px] rounded-md flex items-center justify-between px-3 md:px-4 transition-all duration-300 border-b-2 border-t border-x border-t-transparent border-x-transparent ${
                                     isSelected 
                                       ? 'bg-[#06b6d4]/20 border-b-[#06b6d4] shadow-[0_4px_15px_rgba(6,182,212,0.25)] -translate-y-0.5' 
                                       : 'bg-[#1f222d] border-b-[#1f222d] hover:bg-[#06b6d4]/10 hover:border-[#06b6d4] hover:shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:-translate-y-0.5'
                                   }`}
                                 >
                                   <span className={`text-[11px] md:text-[12px] font-bold leading-tight text-left pr-2 transition-colors ${isSelected ? 'text-[#06b6d4]' : 'text-zinc-300'}`}>
                                     {typeLabel}
                                   </span>
                                   <span className={`text-[13px] md:text-[14px] font-black tabular-nums shrink-0 transition-colors ${isSelected ? 'text-[#06b6d4] drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]' : 'text-white'}`}>
                                     <AnimatedOdd value={oddValue.toFixed(2)} />
                                   </span>
                                 </button>
                               );
                             })}
                          </div>
                       </div>
                    </div>
                  );
               })}
            </div>
            )}

         </div>

         {/* Right Column (Video / Animation Player) */}
         <div className="w-full xl:w-[320px] 2xl:w-[360px] shrink-0">
            <div className="bg-[#1a1d29] rounded-xl overflow-hidden border border-[#222635] sticky top-4">
               {/* Player Tabs */}
               <div className="flex items-center justify-between p-2 border-b border-[#222635] bg-[#12141c]">
                  <div className="flex items-center gap-1 bg-[#1a1d29] p-1 rounded-lg w-full">
                     <button 
                        onClick={() => setActiveRightTab('video')}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[11px] font-bold transition-all ${
                          activeRightTab === 'video' 
                            ? 'bg-[#3b82f6] text-white shadow-md' 
                            : 'text-zinc-400 hover:text-white'
                        }`}
                     >
                        <Tv className="w-3.5 h-3.5" />
                        Video
                     </button>
                     <button 
                        onClick={() => setActiveRightTab('animation')}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[11px] font-bold transition-all ${
                          activeRightTab === 'animation' 
                            ? 'bg-[#3b82f6] text-white shadow-md' 
                            : 'text-zinc-400 hover:text-white'
                        }`}
                     >
                        <Activity className="w-3.5 h-3.5" />
                        Animasyon
                     </button>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                     <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-white/5 text-zinc-400 transition-colors">
                        <Pin className="w-4 h-4" />
                     </button>
                  </div>
               </div>

               {/* Player Content */}
               {activeRightTab === 'video' ? (
                 <div className="aspect-video bg-[#0c0d12] flex flex-col items-center justify-center p-6 text-center relative">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.1)_0%,transparent_70%)]"></div>
                    
                    <div className="w-12 h-12 rounded-full bg-[#1a1d29] border border-[#222635] flex items-center justify-center mb-4 relative z-10 shadow-lg">
                       <div className="w-6 h-6 rounded-full bg-[#3b82f6]/20 flex items-center justify-center">
                          <div className="w-3 h-3 rounded-full bg-[#3b82f6]"></div>
                       </div>
                    </div>
                    
                    <h4 className="text-white font-bold text-[13px] mb-4 relative z-10">
                       Lütfen izlemek için oturum aç
                    </h4>
                    
                    <button className="w-full bg-[#3b82f6] hover:bg-blue-500 text-white font-bold py-2.5 rounded-lg text-sm shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all relative z-10">
                       GİRİŞ
                    </button>
                    
                    <div className="text-[10px] text-zinc-400 mt-4 relative z-10">
                       Herhangi bir hesabınız yok mu? <span className="text-[#3b82f6] underline cursor-pointer hover:text-white">Hemen Üye Ol!</span>
                    </div>
                 </div>
               ) : (
                 <div className="flex flex-col h-[320px] bg-[#0c0d12]">
                   
                   {/* Tracker Header */}
                   <div className="flex items-center justify-between px-3 py-2 border-b border-[#222635] bg-[#12141c]">
                     <div className="flex items-center gap-1.5">
                       <Activity className="w-3 h-3 text-[#3b82f6]" />
                       <span className="text-[11px] font-bold text-white uppercase tracking-wider">Canlı Bilgi</span>
                     </div>
                     <button className="text-zinc-500 hover:text-white transition-colors">
                       <Pin className="w-3 h-3" />
                     </button>
                   </div>
                   
                   <div className="flex items-center justify-between px-3 py-2 bg-[#1a1d29]/50 border-b border-[#222635] text-[10px] md:text-[11px] font-bold">
                     <div className="flex flex-col gap-1 w-full">
                       <div className="flex justify-between w-full text-zinc-300">
                         <div className="flex items-center gap-1.5">
                           <div className="w-3.5 h-3.5">
                             <PlayerLogo name={match.home} fallbackLogo="" />
                           </div>
                           <span className="truncate max-w-[120px]">{match.home}</span>
                         </div>
                         <div className="flex items-center gap-2">
                           <span>{(match as any).homeStats?.corners !== undefined ? (match as any).homeStats.corners : '-'}</span>
                           <span>{(match as any).homeStats?.redCards !== undefined ? (match as any).homeStats.redCards : '-'}</span>
                           <span className="text-white bg-[#222635] px-1.5 rounded">{match.score.split('-')[0] || '-'}</span>
                         </div>
                       </div>
                       <div className="flex justify-between w-full text-zinc-300">
                         <div className="flex items-center gap-1.5">
                           <div className="w-3.5 h-3.5">
                             <PlayerLogo name={match.away} fallbackLogo="" />
                           </div>
                           <span className="truncate max-w-[120px]">{match.away}</span>
                         </div>
                         <div className="flex items-center gap-2">
                           <span>{(match as any).awayStats?.corners !== undefined ? (match as any).awayStats.corners : '-'}</span>
                           <span>{(match as any).awayStats?.redCards !== undefined ? (match as any).awayStats.redCards : '-'}</span>
                           <span className="text-white bg-[#222635] px-1.5 rounded">{match.score.split('-')[1] || '-'}</span>
                         </div>
                       </div>
                     </div>
                   </div>

                   {/* Tracker Body */}
                   <div className="flex-1 relative overflow-hidden bg-[#0a0c10]">
                     
                     {animTab === 'pitch' && (
                       <div className="absolute inset-0 bg-[#050608] flex flex-col relative overflow-hidden">
                         {/* Cyber Grid Background */}
                         <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                         
                         {/* Pitch Lines (Cyber Neon) */}
                         <div className="absolute inset-4 border-2 border-[#06b6d4]/40 shadow-[0_0_15px_rgba(6,182,212,0.2)] rounded-lg"></div>
                         <div className="absolute top-4 bottom-4 left-1/2 w-0.5 bg-[#06b6d4]/40 shadow-[0_0_10px_rgba(6,182,212,0.3)] -translate-x-1/2"></div>
                         <div className="absolute top-1/2 left-1/2 w-16 h-16 border-2 border-[#06b6d4]/40 shadow-[0_0_15px_rgba(6,182,212,0.2)] rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                         <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-[#06b6d4] shadow-[0_0_10px_rgba(6,182,212,0.8)] rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                         
                         {/* Penalty Boxes */}
                         <div className="absolute top-1/4 bottom-1/4 left-4 w-12 border-y-2 border-r-2 border-[#06b6d4]/40 shadow-[0_0_15px_rgba(6,182,212,0.2)]"></div>
                         <div className="absolute top-1/4 bottom-1/4 right-4 w-12 border-y-2 border-l-2 border-[#06b6d4]/40 shadow-[0_0_15px_rgba(6,182,212,0.2)]"></div>
                         
                         <div className="absolute top-1/3 bottom-1/3 left-4 w-6 border-y-2 border-r-2 border-[#06b6d4]/40 shadow-[0_0_15px_rgba(6,182,212,0.2)]"></div>
                         <div className="absolute top-1/3 bottom-1/3 right-4 w-6 border-y-2 border-l-2 border-[#06b6d4]/40 shadow-[0_0_15px_rgba(6,182,212,0.2)]"></div>
                         
                         {/* Dynamic Content Overlay */}
                         {(match as any).currentAction && (
                           <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4">
                             <div className="bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10 text-center animate-pulse">
                               <div className="text-white font-black text-sm uppercase tracking-wider mb-0.5 text-shadow-sm shadow-black">
                                 {(match as any).currentAction.team || '-'}
                               </div>
                               <div className="text-[#eab308] font-black text-lg uppercase tracking-widest text-shadow-sm shadow-black">
                                 {(match as any).currentAction.type || '-'}
                               </div>
                             </div>
                           </div>
                         )}
                       </div>
                     )}

                     {animTab === 'stats' && (
                       <div className="absolute inset-0 overflow-y-auto custom-scrollbar p-3 flex flex-col gap-3">
                         {[
                           { label: 'Toplam Şutlar', h: homeStats?.Shot || homeStats?.totalShots, a: awayStats?.Shot || awayStats?.totalShots },
                           { label: 'İsabetli Şutlar', h: homeStats?.ShotOnTarget || homeStats?.shotsOnTarget, a: awayStats?.ShotOnTarget || awayStats?.shotsOnTarget },
                           { label: 'İsabetsiz Şutlar', h: homeStats?.ShotOffTarget || homeStats?.shotsOffTarget, a: awayStats?.ShotOffTarget || awayStats?.shotsOffTarget },
                           { label: 'Kornerler', h: homeStats?.Corner || homeStats?.corners, a: awayStats?.Corner || awayStats?.corners },
                           { label: 'Sarı Kartlar', h: homeStats?.YellowCard || homeStats?.yellowCards, a: awayStats?.YellowCard || awayStats?.yellowCards },
                           { label: 'Kırmızı Kart', h: homeStats?.RedCard || homeStats?.redCards, a: awayStats?.RedCard || awayStats?.redCards },
                         ].map((stat, i) => {
                           const hVal = stat.h !== undefined ? stat.h : '-';
                           const aVal = stat.a !== undefined ? stat.a : '-';
                           const hNum = typeof stat.h === 'number' ? stat.h : 0;
                           const aNum = typeof stat.a === 'number' ? stat.a : 0;
                           
                           const total = hNum + aNum;
                           const hp = total > 0 ? (hNum / total) * 100 : 0;
                           const ap = total > 0 ? (aNum / total) * 100 : 0;
                           
                           return (
                             <div key={i} className="flex flex-col gap-1">
                               <div className="flex justify-between items-center text-[10px] font-bold text-white px-1">
                                 <span>{hVal}</span>
                                 <span className="text-zinc-400">{stat.label}</span>
                                 <span>{aVal}</span>
                               </div>
                               <div className="flex h-1.5 w-full bg-[#1a1d29] rounded-full overflow-hidden">
                                 <div className="h-full bg-[#ef4444]" style={{ width: `${hp}%` }}></div>
                                 <div className="h-full bg-[#10b981]" style={{ width: `${ap}%` }}></div>
                               </div>
                             </div>
                           );
                         })}
                       </div>
                     )}
                     
                     {(animTab === 'timeline' || animTab === 'h2h' || animTab === 'standings') && (
                       <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                         <Activity className="w-8 h-8 text-zinc-600 mb-2" />
                         <div className="text-zinc-400 text-xs font-bold mb-1">
                           {animTab === 'timeline' ? 'Maç Özeti' : animTab === 'h2h' ? 'Karşılaşma Geçmişi' : 'Puan Durumu'}
                         </div>
                         <div className="text-zinc-500 text-[10px]">
                           Bu veriler şu an için güncelleniyor...
                         </div>
                       </div>
                     )}

                   </div>

                   {/* Tracker Nav */}
                   <div className="flex items-center bg-[#12141c] border-t border-[#222635]">
                     {[
                       { id: 'pitch', icon: PlayCircle },
                       { id: 'stats', icon: BarChart2 },
                       { id: 'timeline', icon: Clock },
                       { id: 'h2h', icon: Scale },
                       { id: 'standings', icon: Star },
                     ].map(tab => {
                       const Icon = tab.icon;
                       const isActive = animTab === tab.id;
                       return (
                         <button 
                           key={tab.id}
                           onClick={() => setAnimTab(tab.id as any)}
                           className={`flex-1 flex items-center justify-center py-3 border-r border-[#222635] last:border-0 transition-all ${
                             isActive ? 'bg-[#06b6d4]/10 text-[#06b6d4] shadow-[inset_0_-2px_0_#06b6d4]' : 'text-zinc-500 hover:text-[#06b6d4]/70 hover:bg-[#1a1d29]/50'
                           }`}
                         >
                           <Icon className="w-4 h-4" />
                         </button>
                       );
                     })}
                   </div>
                   
                 </div>
               )}
            </div>
         </div>

      </div>
    </div>
  );
};
