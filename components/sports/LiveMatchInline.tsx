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
  MapPin, Trophy, Flag, Pin, BarChart2, Scale, Info
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
    '1x2': '1x2',
    'ou': 'Toplam Alt/Üst',
    'gg': 'Karşılıklı Gol',
    'Double_Chance': 'Çifte Şans',
    'Half_Time_Result': 'İlk Yarı Sonucu',
    'Asian_Handicap': 'Handikap (Asya)',
    'Handicap': 'Handikap',
    'Draw_No_Bet': 'Beraberlikte iade',
    'Corners': 'Kornerler',
    'Cards': 'Kartlar',
    'Total': 'Toplam',
    'Over_Under': 'Alt/Üst',
    'Both_Teams_To_Score': 'Karşılıklı Gol',
    'Odd_Even': 'Tek / Çift',
    'CS': 'Doğru Skor',
    'Correct_Score': 'Doğru Skor',
    'First_Team_To_Score': 'İlk Golü Atan',
    'Last_Team_To_Score': 'Son Golü Atan',
    'Half_Time_Double_Chance': 'İlk Yarı Çifte Şans',
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

export const LiveMatchInline: React.FC<LiveMatchInlineProps> = React.memo(({ 
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
  
  const isFootball = !match.sport || match.sport.toLowerCase().includes('futbol') || match.sport.toLowerCase().includes('soccer');
  const isBasketball = match.sport?.toLowerCase().includes('basketbol') || match.sport?.toLowerCase().includes('basket');
  const isTennis = match.sport?.toLowerCase().includes('tenis') || match.sport?.toLowerCase().includes('tennis');

  // Same mock stats logic as modal. Only trigger if strictly live.
  if (Object.keys(homeStats).length === 0 && match.isLive) {
    let min = parseInt(match.minute) || 45;
    if (min === 0) min = 15; // fallback
    const homeAdv = parseFloat(match.homeOdd) < parseFloat(match.awayOdd) ? 1.2 : 0.8;
    if (isFootball) {
      homeStats = { Corner: Math.floor(min / 15 * homeAdv), totalShots: Math.floor(min / 8 * homeAdv), shotsOnTarget: Math.floor(min / 15 * homeAdv), YellowCard: Math.floor(min / 30), RedCard: 0 };
      awayStats = { Corner: Math.floor(min / 15 * (2 - homeAdv)), totalShots: Math.floor(min / 8 * (2 - homeAdv)), shotsOnTarget: Math.floor(min / 15 * (2 - homeAdv)), YellowCard: Math.floor(min / 35), RedCard: 0 };
    }
  }
  
  const getStat = (key: string) => ({ home: homeStats[key] || 0, away: awayStats[key] || 0 });
  const corners = getStat('Corner');
  const yellowCards = getStat('YellowCard');
  const redCards = getStat('RedCard');
  
  const allMarketsObj = match.rawEvent?.all_markets || {};
  const marketsArray = Object.values(allMarketsObj) as any[];

  const getMarket = (typeNames: string[], names: string[]) => {
    return marketsArray.find(m => 
      (m.type_name && typeNames.includes(m.type_name.toLowerCase())) || 
      (m.name && names.includes(m.name.toLowerCase()))
    );
  };

  const getEventOdd = (market: any, eventNames: string[], fallback: string = '-') => {
    if (!market || !market.event) return fallback;
    const ev: any = Object.values(market.event).find((e: any) => e.name && eventNames.some(n => e.name.toLowerCase().includes(n)));
    return ev && ev.price ? parseFloat(ev.price).toFixed(2) : fallback;
  };

  // Support fallback for static pre-match matches
  const groupMarkets = data.group_markets?.["full_event|0"] || raw.group_markets?.["full_event|0"] || [];

  let dc1x_fallback = '-';
  let dc12_fallback = '-';
  let dcx2_fallback = '-';
  const dcStr = groupMarkets.find((s: string) => s.startsWith('|Double_Chance|'));
  if (dcStr) {
     const match1X = dcStr.match(/~1X~([^!]+)/);
     const match12 = dcStr.match(/~12~([^!]+)/);
     const matchX2 = dcStr.match(/~X2~([^!]+)/);
     if (match1X) dc1x_fallback = parseFloat(match1X[1]).toFixed(2);
     if (match12) dc12_fallback = parseFloat(match12[1]).toFixed(2);
     if (matchX2) dcx2_fallback = parseFloat(matchX2[1]).toFixed(2);
  }

  let ggVar_fallback = '-';
  let ggYok_fallback = '-';
  const ggStr = groupMarkets.find((s: string) => s.startsWith('|gg|'));
  if (ggStr) {
     const matchVar = ggStr.match(/~var~([^!]+)/);
     const matchYok = ggStr.match(/~yok~([^!]+)/);
     if (matchVar) ggVar_fallback = parseFloat(matchVar[1]).toFixed(2);
     if (matchYok) ggYok_fallback = parseFloat(matchYok[1]).toFixed(2);
  }

  const ouLines_fallback: any[] = [];
  groupMarkets.forEach((s: string) => {
     if (s.startsWith('|ou|')) {
        const parts = s.split('|');
        const base = parts[2];
        const rest = parts[3] || '';
        const matchOver = rest.match(/~(?:üstü|üst|over)~([^!]+)/);
        const matchUnder = rest.match(/~(?:altı|alt|under)~([^!]+)/);
        if (base && (matchOver || matchUnder)) {
           ouLines_fallback.push({
              id: `${match.id}_ou_${base}`,
              base: parseFloat(base).toFixed(1),
              over: matchOver ? parseFloat(matchOver[1]).toFixed(2) : '-',
              under: matchUnder ? parseFloat(matchUnder[1]).toFixed(2) : '-'
           });
        }
     }
  });

  // 1. 1x2 Odds
  const m1x2 = getMarket(['p1p2', 'p1x2', 'matchresult', '1x2'], ['match result', 'maç sonucu', 'winner']);
  const hOdd = getEventOdd(m1x2, ['w1', '1', 'p1', 'ev sahibi'], match.homeOdd || '-');
  const xOdd = getEventOdd(m1x2, ['x', 'draw', 'beraberlik'], match.drawOdd || '-');
  const aOdd = getEventOdd(m1x2, ['w2', '2', 'p2', 'deplasman'], match.awayOdd || '-');

  // 2. Double Chance
  const mDC = getMarket(['doublechance'], ['çifte şans']);
  const dc1x = getEventOdd(mDC, ['1x', '1 x'], dc1x_fallback);
  const dc12 = getEventOdd(mDC, ['12', '1 2'], dc12_fallback);
  const dcx2 = getEventOdd(mDC, ['x2', '2x', 'x 2', '2 x'], dcx2_fallback);

  // 3. Over/Under (Toplam)
  const mOU_list = marketsArray.filter(m => 
    (m.type_name && (m.type_name.toLowerCase() === 'totalgoals' || m.type_name.toLowerCase() === 'underover')) ||
    (m.name && (m.name.toLowerCase().includes('toplam gol') || m.name.toLowerCase() === 'toplam'))
  );
  
  const ouLines = mOU_list.length > 0 ? mOU_list.map(m => {
     let base = m.base || '';
     if (!base) {
        const matchLine = (m.name || '').match(/([0-9]+\.5)/);
        if (matchLine) base = matchLine[1];
     }
     if (!base) return null;
     return {
        id: m.id,
        base: parseFloat(base).toFixed(1),
        over: getEventOdd(m, ['üst', 'over']),
        under: getEventOdd(m, ['alt', 'under'])
     };
  }).filter(item => item !== null).sort((a, b) => parseFloat(a!.base) - parseFloat(b!.base)) : ouLines_fallback.sort((a, b) => parseFloat(a.base) - parseFloat(b.base));

  // 4. GG/NG
  const mGG = getMarket(['btts'], ['karşılıklı gol', 'her iki takımda gol atar']);
  const ggVar = getEventOdd(mGG, ['var', 'evet', 'yes'], ggVar_fallback);
  const ggYok = getEventOdd(mGG, ['yok', 'hayır', 'no'], ggYok_fallback);
  
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

  // Procedural generation disabled as we now fetch native markets.
    const isLowTierMatch = () => {
    if (isEliteTeam(match.home) || isEliteTeam(match.away)) return false;
    const l = (match.league || '').toLowerCase();
    const lowTierKeywords = ['u19', 'u20', 'u21', 'u22', 'u23', 'youth', 'genç', 'women', 'kadınlar', 'bayanlar', 'friendly', 'hazırlık', 'amateur', 'amatör', 'reserve', 'rezerv', '2. lig', '3. lig', 'division 2', 'division 3', 'league 2', 'league 3', 'serie b', 'serie c', 'liga 2', 'liga 3', 'championship', 'segunda', 'b ligi', 'masters league', 'liga pro', 'tt cup', 'atp challenger', 'wtt', 'itf'];
    return lowTierKeywords.some(kw => l.includes(kw));
  };
  const isLowTier = isLowTierMatch();

  const categories = isTennis 
    ? (isLowTier ? ['Ana Seçenekler', 'Toplam', 'Setler'] : ['Ana Seçenekler', 'Toplam', 'Setler', 'Oyunlar', 'İstatistikler'])
    : isBasketball 
    ? (isLowTier ? ['Ana Seçenekler', 'Toplam', 'Yarılar'] : ['Ana Seçenekler', 'Toplam', 'Çeyrekler', 'Yarılar', 'İstatistikler', 'Oyuncular'])
    : (isLowTier ? ['Ana Seçenekler', 'Toplam', 'Yarılar'] : ['Ana Seçenekler', 'Sihirbaz', 'Toplam', 'İstatistikler', 'Yarılar', 'Kornerler', 'Oyuncular']);
  const [activeCategory, setActiveCategory] = useState('Ana Seçenekler');
  
  const [activeRightTab, setActiveRightTab] = useState<'video'|'animation'>('animation');
  const [animTab, setAnimTab] = useState<'pitch'|'stats'|'timeline'|'h2h'|'standings'>('pitch');

  // Custom function to format the selections based on screenshots
  // 1X2 -> 1, X, 2
  const formatSelectionLabel = (marketName: string, rawType: string, home: string, away: string) => {
     const t = rawType.toLowerCase();
     
     if (marketName === '1x2' || marketName === 'Maç Sonucu') {
         if (t === '1' || t === 'home') return '1';
         if (t === '2' || t === 'away') return '2';
         if (t === 'x' || t === 'draw') return 'X';
     }

     if (t === '1' || t === 'home') return home;
     if (t === '2' || t === 'away') return away;
     if (t === 'x' || t === 'draw') return 'Beraberlik';
     
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
               {/* Stadium Background Texture */}
               <div className="absolute inset-0 bg-[#0a0c10] opacity-80 z-0">
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent"></div>
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
               </div>
               
               {/* Dynamic Mesh Gradient Background */}
               <div className="absolute inset-0 bg-gradient-to-br from-[#06b6d4]/10 via-transparent to-[#3b82f6]/5 opacity-60 z-0 mix-blend-screen"></div>
               <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#06b6d4]/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-0"></div>
               
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
                       <PlayerLogo name={match.home} fallbackLogo={match.homeLogo} sport={match.sport} />
                    </div>
                     <span className="text-[13px] md:text-[15px] font-bold text-white leading-tight mb-2 line-clamp-2 pr-2 break-words">{match.home}</span>
                     <div className="flex items-center gap-1 h-4">
                        {match.isLive && isFootball && (
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
                     <div className={`flex items-center justify-center gap-2 px-3 py-1 rounded border mb-4 backdrop-blur-sm ${match.isLive ? 'bg-[#ef4444]/10 border-[#ef4444]/30 text-[#ef4444] shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'bg-white/5 border-white/10 text-zinc-400'}`}>
                        {match.isLive ? (
                          <>
                             <div className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ef4444] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ef4444]"></span>
                             </div>
                             <span className="text-[12px] font-mono font-bold tracking-widest uppercase">
                                <LiveTimer minute={match.minute} hidePrefix />
                             </span>
                          </>
                        ) : (
                          <span className="text-[12px] font-bold tracking-wider">{match.startTime || match.minute || 'BAŞLAMADI'}</span>
                        )}
                     </div>
                     <div className="flex items-center gap-2 md:gap-4 text-3xl md:text-5xl font-black text-white tabular-nums drop-shadow-md">
                        {isTennis ? (
                           <div className="flex flex-col items-center">
                              <div className="flex gap-4 items-center">
                                 <div className="w-10 h-12 md:w-14 md:h-16 bg-[#101114] border border-[#222635] rounded-lg flex items-center justify-center shadow-inner text-[#06b6d4]">
                                    {match.info?.score1 || '0'}
                                 </div>
                                 <div className="flex flex-col gap-1 mx-2">
                                    <div className="text-[12px] md:text-[14px] font-bold text-[#06b6d4] bg-[#06b6d4]/10 px-2 py-1 rounded">
                                       {match.info?.current_game_state || '0:0'}
                                    </div>
                                    <div className="text-[10px] text-zinc-500 uppercase tracking-wider text-center">
                                       {match.info?.pass_step ? `${match.info.pass_step}. Set` : 'Puan'}
                                    </div>
                                 </div>
                                 <div className="w-10 h-12 md:w-14 md:h-16 bg-[#101114] border border-[#222635] rounded-lg flex items-center justify-center shadow-inner text-[#06b6d4]">
                                    {match.info?.score2 || '0'}
                                 </div>
                              </div>
                           </div>
                        ) : (
                           <>
                              <div className="w-10 h-12 md:w-14 md:h-16 bg-[#101114] border border-[#222635] rounded-lg flex items-center justify-center shadow-inner">
                                 {String(match.score).split('-')[0]?.trim() || '0'}
                              </div>
                              <span className="text-zinc-600">:</span>
                              <div className="w-10 h-12 md:w-14 md:h-16 bg-[#101114] border border-[#222635] rounded-lg flex items-center justify-center shadow-inner">
                                 {String(match.score).split('-')[1]?.trim() || '0'}
                              </div>
                           </>
                        )}
                     </div>
                  </div>

                  {/* Away */}
                  <div className="flex flex-col items-end text-right flex-1 max-w-[40%]">
                     <div className="w-10 h-10 md:w-14 md:h-14 bg-white/5 rounded-full flex items-center justify-center p-1.5 mb-3 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                       <PlayerLogo name={match.away} fallbackLogo={match.awayLogo} sport={match.sport} />
                    </div>
                     <span className="text-[13px] md:text-[15px] font-bold text-white leading-tight mb-2 line-clamp-2 pl-2 break-words">{match.away}</span>
                     <div className="flex items-center justify-end gap-1 h-4">
                        {match.isLive && isFootball && (
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
                       {cat === 'Sihirbaz' && <Star className={`w-3.5 h-3.5 ${activeCategory === cat ? 'text-[#06b6d4]' : 'text-zinc-500'}`} fill="currentColor" />}
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
               <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 items-start">
                  
                  {/* LEFT COLUMN */}
                  <div className="flex flex-col w-full gap-4">
                     
                     {/* 1x2 Panel */}
                     <div className="bg-[#1C2028] rounded-xl border border-white/5 p-4 flex flex-col w-full hover:border-white/10 transition-colors">
                        <div className="flex items-center gap-2 mb-4">
                           <h3 className="text-zinc-300 font-bold text-[14px]">Maç Sonucu (1x2)</h3>
                           <div className="w-4 h-4 rounded-full bg-white/5 flex items-center justify-center text-zinc-500 cursor-pointer hover:bg-white/10">
                              <Info size={10} strokeWidth={3} />
                           </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <button 
                              onClick={() => addSelection({
                                 id: match.homeId || match.id + '_1',
                                 matchId: match.id,
                                 matchName: `${match.home} vs ${match.away}`,
                                 selectionName: `Maç Sonucu: 1`,
                                 odd: parseFloat(hOdd) || 1.00
                              })}
                              className={`bg-[#232833] hover:bg-[#2A2F3D] border border-white/5 rounded-lg flex flex-col items-center justify-center transition-colors min-h-[64px] ${betSlip.some(s => s.id === (match.homeId || match.id+'_1')) ? 'bg-[#06b6d4]/10 border-[#06b6d4]/40 shadow-[0_0_10px_rgba(6,182,212,0.15)]' : ''}`}
                            >
                               <span className="text-zinc-400 text-xs font-bold mb-1">1</span>
                               <span className="text-[#06b6d4] font-black text-lg">
                                 <AnimatedOdd value={hOdd} />
                               </span>
                            </button>
                            <button 
                              onClick={() => addSelection({
                                 id: match.drawId || match.id + '_x',
                                 matchId: match.id,
                                 matchName: `${match.home} vs ${match.away}`,
                                 selectionName: `Maç Sonucu: X`,
                                 odd: parseFloat(xOdd) || 1.00
                              })}
                              className={`bg-[#232833] hover:bg-[#2A2F3D] border border-white/5 rounded-lg flex flex-col items-center justify-center transition-colors min-h-[64px] ${betSlip.some(s => s.id === (match.drawId || match.id+'_x')) ? 'bg-[#06b6d4]/10 border-[#06b6d4]/40 shadow-[0_0_10px_rgba(6,182,212,0.15)]' : ''}`}
                            >
                               <span className="text-zinc-400 text-xs font-bold mb-1">X</span>
                               <span className="text-[#06b6d4] font-black text-lg">
                                 <AnimatedOdd value={xOdd} />
                               </span>
                            </button>
                            <button 
                              onClick={() => addSelection({
                                 id: match.awayId || match.id + '_2',
                                 matchId: match.id,
                                 matchName: `${match.home} vs ${match.away}`,
                                 selectionName: `Maç Sonucu: 2`,
                                 odd: parseFloat(aOdd) || 1.00
                              })}
                              className={`bg-[#232833] hover:bg-[#2A2F3D] border border-white/5 rounded-lg flex flex-col items-center justify-center transition-colors min-h-[64px] ${betSlip.some(s => s.id === (match.awayId || match.id+'_2')) ? 'bg-[#06b6d4]/10 border-[#06b6d4]/40 shadow-[0_0_10px_rgba(6,182,212,0.15)]' : ''}`}
                            >
                               <span className="text-zinc-400 text-xs font-bold mb-1">2</span>
                               <span className="text-[#06b6d4] font-black text-lg">
                                 <AnimatedOdd value={aOdd} />
                               </span>
                            </button>
                         </div>
                     </div>

                     {/* İki takım da gol atar Panel */}
                     <div className="bg-[#1C2028] rounded-xl border border-white/5 p-4 flex flex-col w-full hover:border-white/10 transition-colors">
                        <div className="flex items-center gap-2 mb-4">
                           <h3 className="text-zinc-300 font-bold text-[14px]">İki takım da gol atar</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                           <button 
                              onClick={() => addSelection({
                                 id: match.id + '_gg_var',
                                 matchId: match.id,
                                 matchName: `${match.home} vs ${match.away}`,
                                 selectionName: 'Karşılıklı Gol: Evet',
                                 odd: parseFloat(ggVar) || 1.00
                              })}
                              className={`bg-[#232833] hover:bg-[#2A2F3D] border border-white/5 rounded-lg flex flex-col items-center justify-center transition-colors min-h-[64px] ${betSlip.some(s => s.id === (match.id + '_gg_var')) ? 'bg-[#06b6d4]/10 border-[#06b6d4]/40 shadow-[0_0_10px_rgba(6,182,212,0.15)]' : ''}`}
                           >
                              <span className="text-zinc-400 text-xs font-bold mb-1">Evet</span>
                              <span className="text-[#06b6d4] font-black text-lg">
                                 <AnimatedOdd value={ggVar} />
                              </span>
                           </button>
                           <button 
                              onClick={() => addSelection({
                                 id: match.id + '_gg_yok',
                                 matchId: match.id,
                                 matchName: `${match.home} vs ${match.away}`,
                                 selectionName: 'Karşılıklı Gol: Hayır',
                                 odd: parseFloat(ggYok) || 1.00
                              })}
                              className={`bg-[#232833] hover:bg-[#2A2F3D] border border-white/5 rounded-lg flex flex-col items-center justify-center transition-colors min-h-[64px] ${betSlip.some(s => s.id === (match.id + '_gg_yok')) ? 'bg-[#06b6d4]/10 border-[#06b6d4]/40 shadow-[0_0_10px_rgba(6,182,212,0.15)]' : ''}`}
                           >
                              <span className="text-zinc-400 text-xs font-bold mb-1">Hayır</span>
                              <span className="text-[#06b6d4] font-black text-lg">
                                 <AnimatedOdd value={ggYok} />
                              </span>
                           </button>
                        </div>
                     </div>
                  </div>

                  {/* RIGHT COLUMN */}
                  <div className="flex flex-col w-full gap-4">
                     
                     {/* Çifte şans Panel */}
                     <div className="bg-[#1C2028] rounded-xl border border-white/5 p-4 flex flex-col w-full hover:border-white/10 transition-colors">
                        <div className="flex items-center gap-2 mb-4">
                           <h3 className="text-zinc-300 font-bold text-[14px]">Çifte şans</h3>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                           <button 
                             onClick={() => addSelection({
                                id: match.id + '_dc_1x',
                                matchId: match.id,
                                matchName: `${match.home} vs ${match.away}`,
                                selectionName: 'Çifte Şans: 1X',
                                odd: parseFloat(dc1x) || 1.00
                             })}
                             className={`bg-[#232833] hover:bg-[#2A2F3D] border border-white/5 rounded-lg flex flex-col items-center justify-center transition-colors min-h-[64px] ${betSlip.some(s => s.id === (match.id + '_dc_1x')) ? 'bg-[#06b6d4]/10 border-[#06b6d4]/40 shadow-[0_0_10px_rgba(6,182,212,0.15)]' : ''}`}
                           >
                             <span className="text-zinc-400 text-xs font-bold mb-1">1X</span>
                             <span className="text-[#06b6d4] font-black text-lg"><AnimatedOdd value={dc1x} /></span>
                           </button>
                           <button 
                             onClick={() => addSelection({
                                id: match.id + '_dc_12',
                                matchId: match.id,
                                matchName: `${match.home} vs ${match.away}`,
                                selectionName: 'Çifte Şans: 12',
                                odd: parseFloat(dc12) || 1.00
                             })}
                             className={`bg-[#232833] hover:bg-[#2A2F3D] border border-white/5 rounded-lg flex flex-col items-center justify-center transition-colors min-h-[64px] ${betSlip.some(s => s.id === (match.id + '_dc_12')) ? 'bg-[#06b6d4]/10 border-[#06b6d4]/40 shadow-[0_0_10px_rgba(6,182,212,0.15)]' : ''}`}
                           >
                             <span className="text-zinc-400 text-xs font-bold mb-1">12</span>
                             <span className="text-[#06b6d4] font-black text-lg"><AnimatedOdd value={dc12} /></span>
                           </button>
                           <button 
                             onClick={() => addSelection({
                                id: match.id + '_dc_x2',
                                matchId: match.id,
                                matchName: `${match.home} vs ${match.away}`,
                                selectionName: 'Çifte Şans: X2',
                                odd: parseFloat(dcx2) || 1.00
                             })}
                             className={`bg-[#232833] hover:bg-[#2A2F3D] border border-white/5 rounded-lg flex flex-col items-center justify-center transition-colors min-h-[64px] ${betSlip.some(s => s.id === (match.id + '_dc_x2')) ? 'bg-[#06b6d4]/10 border-[#06b6d4]/40 shadow-[0_0_10px_rgba(6,182,212,0.15)]' : ''}`}
                           >
                             <span className="text-zinc-400 text-xs font-bold mb-1">X2</span>
                             <span className="text-[#06b6d4] font-black text-lg"><AnimatedOdd value={dcx2} /></span>
                           </button>
                        </div>
                     </div>

                     {/* Toplam Panel */}
                     <div className="bg-[#1C2028] rounded-xl border border-white/5 p-4 flex flex-col w-full hover:border-white/10 transition-colors">
                        <div className="flex items-center gap-2 mb-4">
                           <h3 className="text-zinc-300 font-bold text-[14px]">Toplam Goller</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-2">
                           <span className="text-center text-zinc-500 text-[11px] font-bold uppercase tracking-wider">Üstü</span>
                           <span className="text-center text-zinc-500 text-[11px] font-bold uppercase tracking-wider">Altı</span>
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-3">
                           {ouLines.length > 0 ? ouLines.slice(0, 10).map((line, idx) => (
                              <React.Fragment key={idx}>
                                 <button 
                                   onClick={() => addSelection({
                                      id: `${match.id}_ou_${line?.id}_over`,
                                      matchId: match.id,
                                      matchName: `${match.home} vs ${match.away}`,
                                      selectionName: `Toplam ${line?.base} Üst`,
                                      odd: parseFloat(line?.over || '0')
                                   })}
                                   className={`bg-[#232833] hover:bg-[#2A2F3D] border border-white/5 rounded-lg flex flex-col items-center justify-center transition-colors min-h-[56px] ${betSlip.some(s => s.id === `${match.id}_ou_${line?.id}_over`) ? 'bg-[#06b6d4]/10 border-[#06b6d4]/40 shadow-[0_0_10px_rgba(6,182,212,0.15)]' : ''}`}
                                 >
                                   <span className="text-zinc-400 text-[11px] font-bold mb-0.5">{line?.base}</span>
                                   <span className="text-[#06b6d4] font-black text-[15px] tracking-wide"><AnimatedOdd value={line?.over || '-'} /></span>
                                 </button>
                                 <button 
                                   onClick={() => addSelection({
                                      id: `${match.id}_ou_${line?.id}_under`,
                                      matchId: match.id,
                                      matchName: `${match.home} vs ${match.away}`,
                                      selectionName: `Toplam ${line?.base} Alt`,
                                      odd: parseFloat(line?.under || '0')
                                   })}
                                   className={`bg-[#232833] hover:bg-[#2A2F3D] border border-white/5 rounded-lg flex flex-col items-center justify-center transition-colors min-h-[56px] ${betSlip.some(s => s.id === `${match.id}_ou_${line?.id}_under`) ? 'bg-[#06b6d4]/10 border-[#06b6d4]/40 shadow-[0_0_10px_rgba(6,182,212,0.15)]' : ''}`}
                                 >
                                   <span className="text-zinc-400 text-[11px] font-bold mb-0.5">{line?.base}</span>
                                   <span className="text-[#06b6d4] font-black text-[15px] tracking-wide"><AnimatedOdd value={line?.under || '-'} /></span>
                                 </button>
                              </React.Fragment>
                           )) : (
                              <div className="col-span-2 text-center text-zinc-500 text-[12px] py-4">Şu an için bahis seçeneği bulunmamaktadır.</div>
                           )}
                        </div>
                     </div>
                  </div>
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
                             <PlayerLogo name={match.home} fallbackLogo="" sport={match.sport} />
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
                             <PlayerLogo name={match.away} fallbackLogo="" sport={match.sport} />
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
                       <div className="absolute inset-0 flex flex-col relative overflow-hidden bg-[#0d2a15]">
                         {/* Realistic Football Pitch Background */}
                         <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
                         
                         {/* Pitch Lines (White/Neon) */}
                         <div className="absolute inset-4 border-[1.5px] border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.2)]"></div>
                         <div className="absolute top-4 bottom-4 left-1/2 w-[1.5px] bg-white/40 shadow-[0_0_10px_rgba(255,255,255,0.3)] -translate-x-1/2"></div>
                         <div className="absolute top-1/2 left-1/2 w-16 h-16 border-[1.5px] border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.2)] rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                         <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                         
                         {/* Penalty Boxes */}
                         <div className="absolute top-1/4 bottom-1/4 left-4 w-12 border-y-[1.5px] border-r-[1.5px] border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.2)]"></div>
                         <div className="absolute top-1/4 bottom-1/4 right-4 w-12 border-y-[1.5px] border-l-[1.5px] border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.2)]"></div>
                         
                         <div className="absolute top-1/3 bottom-1/3 left-4 w-6 border-y-[1.5px] border-r-[1.5px] border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.2)]"></div>
                         <div className="absolute top-1/3 bottom-1/3 right-4 w-6 border-y-[1.5px] border-l-[1.5px] border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.2)]"></div>
                         
                         {/* Dynamic Content Overlay */}
                         {(match as any).currentAction ? (
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
                         ) : (
                           <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4">
                             <div className="absolute inset-0 bg-black/50 z-0 rounded-lg"></div>
                             <div className="relative z-10 flex flex-col items-center">
                               <Trophy className="w-10 h-10 text-white mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
                               <div className="text-white font-black text-[12px] uppercase tracking-wider text-center max-w-[220px] text-shadow-md shadow-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                                 Animasyon maç saatinde aktifleşecektir
                               </div>
                             </div>
                           </div>
                         )}
                       </div>
                     )}

                     {animTab === 'stats' && (
                       <div className="absolute inset-0 overflow-y-auto custom-scrollbar p-3 flex flex-col gap-3">
                         {[
                           { label: 'Ataklar', h: stats.attack?.team1_value || homeStats?.attack || (match as any).homeStats?.attack, a: stats.attack?.team2_value || awayStats?.attack || (match as any).awayStats?.attack },
                           { label: 'Tehlikeli Ataklar', h: stats.dangerous_attack?.team1_value || homeStats?.dangerous_attack || (match as any).homeStats?.dangerous_attack, a: stats.dangerous_attack?.team2_value || awayStats?.dangerous_attack || (match as any).awayStats?.dangerous_attack },
                           { label: 'İsabetli Şutlar', h: stats.shot_on_target?.team1_value || homeStats?.ShotOnTarget || (match as any).homeStats?.shotsOnTarget, a: stats.shot_on_target?.team2_value || awayStats?.ShotOnTarget || (match as any).awayStats?.shotsOnTarget },
                           { label: 'Kornerler', h: stats.corner?.team1_value || homeStats?.Corner || (match as any).homeStats?.corners, a: stats.corner?.team2_value || awayStats?.Corner || (match as any).awayStats?.corners },
                           { label: 'Sarı Kartlar', h: stats.yellow_card?.team1_value || homeStats?.YellowCard || (match as any).homeStats?.yellowCards, a: stats.yellow_card?.team2_value || awayStats?.YellowCard || (match as any).awayStats?.yellowCards },
                           { label: 'Kırmızı Kart', h: stats.red_card?.team1_value || homeStats?.RedCard || (match as any).homeStats?.redCards, a: stats.red_card?.team2_value || awayStats?.RedCard || (match as any).awayStats?.redCards },
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
});
