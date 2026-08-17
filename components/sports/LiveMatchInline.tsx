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
import { LiveMatchRadar } from './LiveMatchRadar';
import { MatchAnimationPlayer } from './MatchAnimationPlayer';

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

const MarketAccordion = React.memo(({ 
  title, 
  children, 
  rightInfo, 
  isOpen, 
  onToggle 
}: { 
  title: string, 
  children: React.ReactNode, 
  rightInfo?: React.ReactNode, 
  isOpen: boolean, 
  onToggle: (title: string) => void 
}) => {
  return (
    <div className="bg-sports-card rounded-sports-card flex flex-col w-full overflow-hidden transition-all duration-300 relative group/accordion border border-sports-subtle">
      <button 
        onClick={() => onToggle(title)}
        className="w-full flex items-center justify-between p-4 transition-all relative z-10 bg-sports-card hover:bg-sports-hover"
        style={{ borderBottom: isOpen ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
      >
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-sports-accent shadow-[0_0_10px_rgba(var(--theme-accent-rgb),0.5)] opacity-0 group-hover/accordion:opacity-100 transition-opacity"></div>
        <div className="flex items-center gap-3 pl-2">
           <h3 className="text-white font-bold text-[14px] tracking-wide">{title}</h3>
           {rightInfo}
        </div>
        <div className="w-7 h-7 rounded-full bg-white/5 group-hover/accordion:bg-white/10 flex items-center justify-center text-zinc-400 transition-colors">
          {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
      </button>
      {isOpen && (
        <div className="p-4 bg-transparent relative z-10">
           {children}
        </div>
      )}
    </div>
  );
});

const BetButton = React.memo(({ 
  id, 
  selectionName, 
  odd, 
  label, 
  labelClass = "", 
  isSelected, 
  onAddSelection,
  matchId,
  matchHome,
  matchAway
}: any) => {
  return (
    <button 
      onClick={() => { if (odd !== '-') onAddSelection(id, matchId, `${matchHome} vs ${matchAway}`, selectionName, odd) }}
      disabled={odd === '-'}
      className={`relative group bg-[#131517] hover:bg-[#222428] border ${isSelected ? 'border-sports-accent shadow-[0_0_15px_rgba(0,242,166,0.1)] bg-sports-accent' : 'border-sports-subtle'} rounded-sports-pill flex items-center justify-between px-4 py-2.5 transition-colors min-h-[44px] ${odd === '-' ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <span className={`text-[12px] font-medium ${isSelected ? 'text-black font-bold' : 'text-zinc-400 group-hover:text-zinc-200'} ${labelClass} relative z-10 transition-colors`}>{label}</span>
      <span className={`font-bold text-[13px] ${isSelected ? 'text-black font-black' : 'text-sports-accent group-hover:brightness-125'} relative z-10 transition-all`}>
        <AnimatedOdd value={odd} />
      </span>
    </button>
  );
});

export const LiveMatchInline: React.FC<LiveMatchInlineProps> = React.memo(({ 
  match, 
  onBack, 
  allLiveMatches = [],
  onSelectAnotherMatch 
}) => {
  const { betSlip, addSelection } = useBetSlip();
  const handleSelection = React.useCallback((id: string, matchId: string, matchName: string, selectionName: string, odd: string | number) => {
    addSelection({ id, matchId, matchName, selectionName, odd: parseFloat(odd as string) || 1.00 });
  }, [addSelection]);

  const raw = match.rawEvent || {};
  const data = raw.data || raw; 
  const stats = data.stats || {};
  

  
  let homeStats = stats.team1_value || {};
  let awayStats = stats.team2_value || {};
  
  const rawSportId = raw?.sport_id?.toString();
  const rawSportName = (match.sport || raw?.sport_name || '').toLowerCase();
  
  const isBasketball = rawSportName.includes('basket') || rawSportId === '18';
  const isTennis = rawSportName.includes('tenis') || rawSportName.includes('tennis') || rawSportId === '13';
  const isFootball = !isBasketball && !isTennis && (!rawSportName || rawSportName.includes('futbol') || rawSportName.includes('soccer') || rawSportId === '1');

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
     if (match1X && match1X[1] !== '-') dc1x_fallback = parseFloat(match1X[1]).toFixed(2);
     if (match12 && match12[1] !== '-') dc12_fallback = parseFloat(match12[1]).toFixed(2);
     if (matchX2 && matchX2[1] !== '-') dcx2_fallback = parseFloat(matchX2[1]).toFixed(2);
  }

  let ggVar_fallback = '-';
  let ggYok_fallback = '-';
  const ggStr = groupMarkets.find((s: string) => s.startsWith('|gg|'));
  if (ggStr) {
     const matchVar = ggStr.match(/~var~([^!]+)/);
     const matchYok = ggStr.match(/~yok~([^!]+)/);
     if (matchVar && matchVar[1] !== '-') ggVar_fallback = parseFloat(matchVar[1]).toFixed(2);
     if (matchYok && matchYok[1] !== '-') ggYok_fallback = parseFloat(matchYok[1]).toFixed(2);
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
              over: matchOver && matchOver[1] !== '-' ? parseFloat(matchOver[1]).toFixed(2) : '-',
              under: matchUnder && matchUnder[1] !== '-' ? parseFloat(matchUnder[1]).toFixed(2) : '-'
           });
        }
     }
  });

  // Extract Halves & Corners Fallbacks
  const ht1x2 = { home: '-', draw: '-', away: '-' };
  const htStr = groupMarkets.find((s: string) => s.startsWith('|ht1x2|'));
  if (htStr) {
     const match1 = htStr.match(/~home~([^!]+)/);
     const matchX = htStr.match(/~draw~([^!]+)/);
     const match2 = htStr.match(/~away~([^!]+)/);
     if (match1 && match1[1] !== '-') ht1x2.home = parseFloat(match1[1]).toFixed(2);
     if (matchX && matchX[1] !== '-') ht1x2.draw = parseFloat(matchX[1]).toFixed(2);
     if (match2 && match2[1] !== '-') ht1x2.away = parseFloat(match2[1]).toFixed(2);
  }

  const htou = { over05: '-', under05: '-', over15: '-', under15: '-' };
  const htouStr = groupMarkets.find((s: string) => s.startsWith('|htou|'));
  if (htouStr) {
     const mO05 = htouStr.match(/~over0\.5~([^!]+)/);
     const mU05 = htouStr.match(/~under0\.5~([^!]+)/);
     const mO15 = htouStr.match(/~over1\.5~([^!]+)/);
     const mU15 = htouStr.match(/~under1\.5~([^!]+)/);
     if (mO05 && mO05[1] !== '-') htou.over05 = parseFloat(mO05[1]).toFixed(2);
     if (mU05 && mU05[1] !== '-') htou.under05 = parseFloat(mU05[1]).toFixed(2);
     if (mO15 && mO15[1] !== '-') htou.over15 = parseFloat(mO15[1]).toFixed(2);
     if (mU15 && mU15[1] !== '-') htou.under15 = parseFloat(mU15[1]).toFixed(2);
  }

  const cr1x2 = { home: '-', draw: '-', away: '-' };
  const crStr = groupMarkets.find((s: string) => s.startsWith('|cr1x2|'));
  if (crStr) {
     const match1 = crStr.match(/~home~([^!]+)/);
     const matchX = crStr.match(/~draw~([^!]+)/);
     const match2 = crStr.match(/~away~([^!]+)/);
     if (match1 && match1[1] !== '-') cr1x2.home = parseFloat(match1[1]).toFixed(2);
     if (matchX && matchX[1] !== '-') cr1x2.draw = parseFloat(matchX[1]).toFixed(2);
     if (match2 && match2[1] !== '-') cr1x2.away = parseFloat(match2[1]).toFixed(2);
  }

  const crou = { over75: '-', under75: '-', over85: '-', under85: '-' };
  const crouStr = groupMarkets.find((s: string) => s.startsWith('|crou|'));
  if (crouStr) {
     const mO75 = crouStr.match(/~over7\.5~([^!]+)/);
     const mU75 = crouStr.match(/~under7\.5~([^!]+)/);
     const mO85 = crouStr.match(/~over8\.5~([^!]+)/);
     const mU85 = crouStr.match(/~under8\.5~([^!]+)/);
     if (mO75 && mO75[1] !== '-') crou.over75 = parseFloat(mO75[1]).toFixed(2);
     if (mU75 && mU75[1] !== '-') crou.under75 = parseFloat(mU75[1]).toFixed(2);
     if (mO85 && mO85[1] !== '-') crou.over85 = parseFloat(mO85[1]).toFixed(2);
     if (mU85 && mU85[1] !== '-') crou.under85 = parseFloat(mU85[1]).toFixed(2);
  }


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

  const [activeCategory, setActiveCategory] = useState('Ana Seçenekler');

  const categories = isTennis 
    ? (isLowTier ? ['Ana Seçenekler', 'Toplam', 'Setler'] : ['Ana Seçenekler', 'Toplam', 'Setler', 'Oyunlar', 'İstatistikler'])
    : isBasketball 
    ? (isLowTier ? ['Ana Seçenekler', 'Toplam', 'Yarılar'] : ['Ana Seçenekler', 'Toplam', 'Çeyrekler', 'Yarılar', 'İstatistikler', 'Oyuncular'])
    : (isLowTier ? ['Ana Seçenekler', 'Goller', 'İlk Yarı'] : ['Ana Seçenekler', 'Goller', 'İlk Yarı', 'Asya', 'Korner & Kart', 'Oyuncular']);

  useEffect(() => {
    if (!categories.includes(activeCategory)) {
      setActiveCategory('Ana Seçenekler');
    }
  }, [categories, activeCategory]);

  const [openMarkets, setOpenMarkets] = useState<Record<string, boolean>>({
    'Maç Sonucu': true,
    'Çifte Şans': true,
    'Karşılıklı Gol': true,
    'Toplam Goller': true,
    'İlk Yarı Sonucu': true,
    'İlk Yarı Toplam Gol': true,
    'Asya Handikap': true,
    'Beraberlikte İade': true,
    'Korner Alt/Üst': true,
    'Kart Alt/Üst': true,
    'Ev Sahibi Toplam Gol': true,
    'Deplasman Toplam Gol': true,
    'Gol Atacak Oyuncu': true,
    '1. Çeyrek Sonucu': true,
    '1. Çeyrek Toplam': true,
    'İlk Yarı Sonucu (Basketbol)': true,
    'İlk Yarı Toplam (Basketbol)': true,
    '1. Set Kazananı': true,
    'Sıradaki Oyun': true,
    'Toplam Set Sayısı': true,
    'Oyuncu Özel (Sayı)': true,
    'İstatistikler': true,
    'Oyuncu Kart Görür mü?': true,
    'Oyuncu İsabetli Şut Sayısı': true,
    'Oyuncu Asist Yapar mı?': true,
    'Kırmızı Kart Görür mü?': true,
    'Gol Atar ve Takımı Kazanır': true
  });
  
  const toggleMarket = (marketName: string) => {
    setOpenMarkets(prev => ({ ...prev, [marketName]: !prev[marketName] }));
  };

  const RenderAccordion = React.useCallback(({ title, children, rightInfo }: { title: string, children: React.ReactNode, rightInfo?: React.ReactNode }) => (
    <MarketAccordion 
      title={title} 
      isOpen={!!openMarkets[title]} 
      onToggle={toggleMarket} 
      rightInfo={rightInfo}
    >
      {children}
    </MarketAccordion>
  ), [openMarkets, toggleMarket]);

  const RenderBetButton = React.useCallback(({ id, selectionName, odd, label, labelClass = "" }: { id: string, selectionName: string, odd: any, label: string, labelClass?: string }) => (
    <BetButton 
      key={id}
      id={id} 
      selectionName={selectionName} 
      odd={odd} 
      label={label} 
      labelClass={labelClass}
      isSelected={betSlip.some((s: any) => s.id === id)}
      onAddSelection={handleSelection}
      matchId={match.id}
      matchHome={match.home}
      matchAway={match.away}
    />
  ), [betSlip, handleSelection, match]);
  
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
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-2 mb-4 px-1 border-b border-white/5">
           <button 
             onClick={onBack}
             className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors border border-white/10"
           >
             <ChevronDown className="w-4 h-4 rotate-90" />
           </button>
           
           {allLiveMatches.map((m, idx) => (
             <button 
               key={m.id || idx}
               onClick={() => onSelectAnotherMatch && onSelectAnotherMatch(m)}
               className={`shrink-0 flex flex-col justify-center px-4 py-2 rounded-lg border transition-all duration-200 min-w-[160px] md:min-w-[180px] ${
                 m.id === match.id 
                 ? 'bg-sports-card border-sports-accent shadow-[0_0_15px_rgba(0,242,166,0.15)]' 
                 : 'bg-transparent border-sports-subtle hover:bg-sports-hover'
               }`}
             >
                <div className="flex items-center gap-2 text-[11px] font-bold tracking-wider text-zinc-400 mb-2 uppercase">
                   <div className="w-1.5 h-1.5 rounded-full bg-[#ef4444]"></div>
                   {m.minute}
                </div>
                <div className="flex items-center justify-between text-[12px] font-semibold text-zinc-100 mb-1.5 w-full gap-2">
                   <span className="truncate flex-1 text-left">{m.home}</span>
                   <span className="text-[color:var(--theme-accent)] font-black shrink-0 w-4 text-right">{String(m.score).split('-')[0] || 0}</span>
                </div>
                <div className="flex items-center justify-between text-[12px] font-semibold text-zinc-100 w-full gap-2">
                   <span className="truncate flex-1 text-left">{m.away}</span>
                   <span className="text-[color:var(--theme-accent)] font-black shrink-0 w-4 text-right">{String(m.score).split('-')[1] || 0}</span>
                </div>
             </button>
           ))}
        </div>
      )}

      {/* Main Grid */}
      <div className="flex flex-col gap-6 w-full">
         
         {/* TOP ROW: Scoreboard + Player */}
         <div className="flex flex-col xl:flex-row gap-4 w-full items-start">
            
            {/* MATCH INFO & SCOREBOARD */}
            <div className="flex-1 flex flex-col relative z-10 min-w-0 shrink-0">
            
            {/* SCOREBOARD BLOCK */}
            <div className="bg-transparent flex flex-col relative overflow-hidden group py-6 rounded-3xl mb-6 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
               {/* Pure Dark Background Texture with Glow */}
               <div className="absolute inset-0 z-0 bg-sports-main rounded-3xl overflow-hidden pointer-events-none border border-sports-subtle">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100%] h-[100%] bg-[radial-gradient(ellipse_at_top,rgba(var(--theme-accent-rgb),0.1),transparent_60%)] opacity-70"></div>
               </div>
               
               {/* Breadcrumb / League Name */}
               <div className="flex items-center justify-center gap-2 text-[11px] font-bold text-zinc-400 mb-6 z-10">
                 <Flag className="w-3.5 h-3.5 text-zinc-500" />
                 <span className="tracking-widest uppercase">{match.league || 'Uluslararası • Kulüp Hazırlık Maçları'}</span>
               </div>
               
               {/* Match Info Area */}
               <div className="flex items-center justify-between z-10 w-full max-w-4xl mx-auto px-4">
                  {/* Home */}
                  <div className="flex flex-col items-center flex-1">
                     <div className="relative w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mb-3 transition-transform duration-500 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                       <PlayerLogo name={match.home} fallbackLogo={match.homeLogo} sport={match.sport} />
                     </div>
                     <span className="text-[14px] md:text-[16px] font-black text-white text-center tracking-wide leading-tight max-w-[140px] md:max-w-[200px] line-clamp-2 drop-shadow-md">{match.home}</span>
                  </div>

                  {/* Score & Time */}
                  <div className="flex flex-col items-center justify-center flex-1 shrink-0">
                     <div className="flex items-center justify-center gap-3 md:gap-6 text-5xl md:text-6xl font-black text-white tabular-nums tracking-tighter mb-4 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                        <span className="">{String(match.score).split('-')[0]?.trim() || '0'}</span>
                        <span className="text-white/20 font-light pb-2">:</span>
                        <span className="">{String(match.score).split('-')[1]?.trim() || '0'}</span>
                     </div>
                     
                     <div className={`flex items-center justify-center gap-2.5 px-5 py-2 rounded-full backdrop-blur-md border shadow-lg ${match.isLive ? 'bg-[#ef4444]/10 border-[#ef4444]/40 text-[#ef4444] shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'bg-sports-card border-sports-subtle text-zinc-400'}`}>
                        {match.isLive ? (
                          <>
                             <div className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ef4444] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#ef4444] shadow-[0_0_8px_#ef4444]"></span>
                             </div>
                             <span className="text-[13px] font-black tracking-widest uppercase">
                                <LiveTimer minute={match.minute} lastUpdateTs={match.last_update_ts} hidePrefix />
                             </span>
                          </>
                        ) : (
                          <span className="text-[13px] font-bold tracking-widest">{match.startTime || match.minute || 'BAŞLAMADI'}</span>
                        )}
                     </div>
                  </div>

                  {/* Away */}
                  <div className="flex flex-col items-center flex-1">
                     <div className="relative w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mb-3 transition-transform duration-500 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                       <PlayerLogo name={match.away} fallbackLogo={match.awayLogo} sport={match.sport} />
                     </div>
                     <span className="text-[14px] md:text-[16px] font-black text-white text-center tracking-wide leading-tight max-w-[140px] md:max-w-[200px] line-clamp-2 drop-shadow-md">{match.away}</span>
                  </div>
               </div>

               {/* Live HUD Stats (Cards & Corners) */}
               {match.isLive && isFootball && (
                  <div className="flex items-center justify-center gap-6 mt-6 z-10 w-full relative">
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                     <div className="flex items-center gap-5 bg-sports-card px-6 py-2 rounded-full border border-sports-subtle shadow-md relative z-10">
                        <div className="flex items-center gap-2.5">
                           <div className="w-2.5 h-3.5 bg-red-500 rounded-[2px] shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                           <span className="text-white font-black text-sm">{redCards.home} - {redCards.away}</span>
                        </div>
                        <div className="w-[2px] h-4 bg-white/10"></div>
                        <div className="flex items-center gap-2.5">
                           <div className="w-2.5 h-3.5 bg-yellow-500 rounded-[2px] shadow-[0_0_8px_rgba(234,179,8,0.5)]"></div>
                           <span className="text-white font-black text-sm">{yellowCards.home} - {yellowCards.away}</span>
                        </div>
                        <div className="w-[2px] h-4 bg-white/10"></div>
                        <div className="flex items-center gap-2.5">
                           <Flag className="w-4 h-4 text-blue-400 drop-shadow-[0_0_5px_rgba(96,165,250,0.5)]" />
                           <span className="text-white font-black text-sm">{corners.home} - {corners.away}</span>
                        </div>
                     </div>
                  </div>
               )}
            </div>

            {/* Mobile Player (Hidden on desktop, shown on mobile below scoreboard) */}
            <div className="w-full shrink-0 xl:hidden mb-4">
               <MatchAnimationPlayer match={match} stats={stats} homeStats={homeStats} awayStats={awayStats} />
            </div>

            {/* CATEGORY TABS (Pill Design) */}
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar mb-6 px-4 py-2 bg-sports-main rounded-2xl border border-sports-subtle">
               {categories.map((cat, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveCategory(cat)}
                    className={`relative whitespace-nowrap px-5 py-2.5 rounded-xl text-[13px] font-bold transition-all flex items-center gap-2 group ${
                       activeCategory === cat 
                        ? 'bg-sports-accent text-black font-black' 
                        : 'bg-sports-card border border-sports-subtle text-zinc-400 hover:text-white hover:bg-sports-hover'
                    }`}
                  >
                     {cat === 'Sihirbaz' && <Star className={`w-4 h-4 ${activeCategory === cat ? 'text-black' : 'text-zinc-500'}`} fill="currentColor" />}
                     {cat}
                  </button>
               ))}
            </div>
            
            {/* MATCH FINISHED / LOCKED STATE */}
            {(match.isFinished || ODDS_ENGINE_CONFIG.rules.lockKeywords.includes(match.minute || '')) ? (
               <div className="flex flex-col items-center justify-center py-12 px-4 bg-sports-card rounded-sports-card border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
                  <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                     <span className="text-3xl">🔒</span>
                  </div>
                  <h3 className="text-xl font-black text-white mb-2 tracking-wide uppercase">Bahisler Kapandı</h3>
                  <p className="text-zinc-500 text-sm text-center max-w-sm">
                     Bu karşılaşma sona ermiş veya askıya alınmıştır. Şu an için yeni bahis alımı kapalıdır.
                  </p>
               </div>
            ) : (
               <div className="w-full">
                  {/* CATEGORY CONTENT */}
                  {activeCategory === 'Ana Seçenekler' && (
                     <>
                        {isBasketball ? (
                           <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                              {/* BASKETBALL LEFT COLUMN */}
                              <div className="flex flex-col w-full gap-4">
                                 <RenderAccordion title="Maç Kazananı (Uzatma Dahil)">
                                   <div className="grid grid-cols-2 gap-2">
                                      <RenderBetButton id={match.id + '_bb_winner_1'} selectionName="Maç Kazananı: 1" odd="1.45" label={match.home} labelClass="text-center w-full block" />
                                      <RenderBetButton id={match.id + '_bb_winner_2'} selectionName="Maç Kazananı: 2" odd="2.55" label={match.away} labelClass="text-center w-full block" />
                                   </div>
                                 </RenderAccordion>
                                 <RenderAccordion title="Handikap">
                                   <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                                      <div className="text-[10px] text-zinc-500 font-bold uppercase px-2 mb-1">Ev Sahibi</div>
                                      <div className="text-[10px] text-zinc-500 font-bold uppercase px-2 mb-1">Deplasman</div>
                                      <RenderBetButton id={match.id + '_bb_hc_1'} selectionName="Handikap: Ev (-5.5)" odd="1.85" label="-5.5" />
                                      <RenderBetButton id={match.id + '_bb_hc_2'} selectionName="Handikap: Dep (+5.5)" odd="1.95" label="+5.5" />
                                      <RenderBetButton id={match.id + '_bb_hc_3'} selectionName="Handikap: Ev (-6.5)" odd="2.10" label="-6.5" />
                                      <RenderBetButton id={match.id + '_bb_hc_4'} selectionName="Handikap: Dep (+6.5)" odd="1.70" label="+6.5" />
                                   </div>
                                 </RenderAccordion>
                                 <RenderAccordion title="İlk Yarı Sonucu">
                                   <div className="grid grid-cols-3 gap-2">
                                      <RenderBetButton id={match.id + '_bb_ht_1'} selectionName="İlk Yarı Sonucu: 1" odd="1.55" label="1" labelClass="text-center w-full block" />
                                      <RenderBetButton id={match.id + '_bb_ht_x'} selectionName="İlk Yarı Sonucu: X" odd="14.00" label="X" labelClass="text-center w-full block" />
                                      <RenderBetButton id={match.id + '_bb_ht_2'} selectionName="İlk Yarı Sonucu: 2" odd="2.65" label="2" labelClass="text-center w-full block" />
                                   </div>
                                 </RenderAccordion>
                              </div>
                              {/* BASKETBALL RIGHT COLUMN */}
                              <div className="flex flex-col w-full gap-4">
                                 <RenderAccordion title="Toplam Sayı Alt/Üst">
                                   <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                                      <div className="text-[10px] text-zinc-500 font-bold uppercase px-2 mb-1">Üstü</div>
                                      <div className="text-[10px] text-zinc-500 font-bold uppercase px-2 mb-1">Altı</div>
                                      <RenderBetButton id={match.id + '_bb_tot_o155'} selectionName="Toplam Sayı: 155.5 Üst" odd="1.85" label="155.5" />
                                      <RenderBetButton id={match.id + '_bb_tot_u155'} selectionName="Toplam Sayı: 155.5 Alt" odd="1.95" label="155.5" />
                                      <RenderBetButton id={match.id + '_bb_tot_o160'} selectionName="Toplam Sayı: 160.5 Üst" odd="2.30" label="160.5" />
                                      <RenderBetButton id={match.id + '_bb_tot_u160'} selectionName="Toplam Sayı: 160.5 Alt" odd="1.55" label="160.5" />
                                   </div>
                                 </RenderAccordion>
                                 <RenderAccordion title="Ev Sahibi Toplam Sayı">
                                   <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                                      <div className="text-[10px] text-zinc-500 font-bold uppercase px-2 mb-1">Üstü</div>
                                      <div className="text-[10px] text-zinc-500 font-bold uppercase px-2 mb-1">Altı</div>
                                      <RenderBetButton id={match.id + '_bb_home_o80'} selectionName="Ev Sahibi Toplam: 80.5 Üst" odd="1.90" label="80.5" />
                                      <RenderBetButton id={match.id + '_bb_home_u80'} selectionName="Ev Sahibi Toplam: 80.5 Alt" odd="1.90" label="80.5" />
                                   </div>
                                 </RenderAccordion>
                                 <RenderAccordion title="1. Çeyrek Sonucu">
                                   <div className="grid grid-cols-3 gap-2">
                                      <RenderBetButton id={match.id + '_bb_q1_1'} selectionName="1. Çeyrek Sonucu: 1" odd="1.70" label="1" labelClass="text-center w-full block" />
                                      <RenderBetButton id={match.id + '_bb_q1_x'} selectionName="1. Çeyrek Sonucu: X" odd="9.00" label="X" labelClass="text-center w-full block" />
                                      <RenderBetButton id={match.id + '_bb_q1_2'} selectionName="1. Çeyrek Sonucu: 2" odd="2.30" label="2" labelClass="text-center w-full block" />
                                   </div>
                                 </RenderAccordion>
                              </div>
                           </div>
                        ) : isTennis ? (
                           <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                              {/* TENNIS LEFT COLUMN */}
                              <div className="flex flex-col w-full gap-4">
                                 <RenderAccordion title="Maç Kazananı">
                                   <div className="grid grid-cols-2 gap-2">
                                      <RenderBetButton id={match.id + '_tn_winner_1'} selectionName="Maç Kazananı: 1" odd={hOdd || '1.65'} label={match.home} labelClass="text-center w-full block" />
                                      <RenderBetButton id={match.id + '_tn_winner_2'} selectionName="Maç Kazananı: 2" odd={aOdd || '2.15'} label={match.away} labelClass="text-center w-full block" />
                                   </div>
                                 </RenderAccordion>
                                 <RenderAccordion title="1. Set Kazananı">
                                   <div className="grid grid-cols-2 gap-2">
                                      <RenderBetButton id={match.id + '_tn_set1_1'} selectionName="1. Set Kazananı: 1" odd="1.75" label={match.home} labelClass="text-center w-full block" />
                                      <RenderBetButton id={match.id + '_tn_set1_2'} selectionName="1. Set Kazananı: 2" odd="2.00" label={match.away} labelClass="text-center w-full block" />
                                   </div>
                                 </RenderAccordion>
                                 <RenderAccordion title="Oyun Handikapı">
                                   <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                                      <div className="text-[10px] text-zinc-500 font-bold uppercase px-2 mb-1">Ev Sahibi</div>
                                      <div className="text-[10px] text-zinc-500 font-bold uppercase px-2 mb-1">Deplasman</div>
                                      <RenderBetButton id={match.id + '_tn_hc_1'} selectionName="Oyun Handikapı: Ev (-2.5)" odd="1.85" label="-2.5" />
                                      <RenderBetButton id={match.id + '_tn_hc_2'} selectionName="Oyun Handikapı: Dep (+2.5)" odd="1.95" label="+2.5" />
                                   </div>
                                 </RenderAccordion>
                              </div>
                              {/* TENNIS RIGHT COLUMN */}
                              <div className="flex flex-col w-full gap-4">
                                 <RenderAccordion title="Toplam Oyun Alt/Üst">
                                   <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                                      <div className="text-[10px] text-zinc-500 font-bold uppercase px-2 mb-1">Üstü</div>
                                      <div className="text-[10px] text-zinc-500 font-bold uppercase px-2 mb-1">Altı</div>
                                      <RenderBetButton id={match.id + '_tn_tot_o21'} selectionName="Toplam Oyun: 21.5 Üst" odd="1.85" label="21.5" />
                                      <RenderBetButton id={match.id + '_tn_tot_u21'} selectionName="Toplam Oyun: 21.5 Alt" odd="1.95" label="21.5" />
                                      <RenderBetButton id={match.id + '_tn_tot_o22'} selectionName="Toplam Oyun: 22.5 Üst" odd="2.20" label="22.5" />
                                      <RenderBetButton id={match.id + '_tn_tot_u22'} selectionName="Toplam Oyun: 22.5 Alt" odd="1.60" label="22.5" />
                                   </div>
                                 </RenderAccordion>
                                 <RenderAccordion title="Sıradaki Oyunu Kim Kazanır">
                                   <div className="grid grid-cols-2 gap-2">
                                      <RenderBetButton id={match.id + '_tn_nextg_1'} selectionName="Sıradaki Oyun: 1" odd="1.30" label={match.home} labelClass="text-center w-full block" />
                                      <RenderBetButton id={match.id + '_tn_nextg_2'} selectionName="Sıradaki Oyun: 2" odd="3.20" label={match.away} labelClass="text-center w-full block" />
                                   </div>
                                 </RenderAccordion>
                              </div>
                           </div>
                        ) : (
                           <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                              {/* FOOTBALL LEFT COLUMN */}
                              <div className="flex flex-col w-full gap-4">
                                 <RenderAccordion title="Maç Sonucu" rightInfo={<Info size={14} className="text-zinc-500" />}>
                                   <div className="grid grid-cols-3 gap-2">
                                      <RenderBetButton id={match.homeId || match.id + '_1'} selectionName="Maç Sonucu: 1" odd={hOdd} label="1" labelClass="text-center w-full block" />
                                      <RenderBetButton id={match.drawId || match.id + '_x'} selectionName="Maç Sonucu: X" odd={xOdd} label="X" labelClass="text-center w-full block" />
                                      <RenderBetButton id={match.awayId || match.id + '_2'} selectionName="Maç Sonucu: 2" odd={aOdd} label="2" labelClass="text-center w-full block" />
                                   </div>
                                 </RenderAccordion>
      
                                 <RenderAccordion title="Karşılıklı Gol">
                                   <div className="grid grid-cols-2 gap-2">
                                      <RenderBetButton id={match.id + '_gg_var'} selectionName="Karşılıklı Gol: Evet" odd={ggVar} label="Evet" />
                                      <RenderBetButton id={match.id + '_gg_yok'} selectionName="Karşılıklı Gol: Hayır" odd={ggYok} label="Hayır" />
                                   </div>
                                 </RenderAccordion>
      
                                 <RenderAccordion title="Asya Handikap">
                                   <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                                      <div className="text-[10px] text-zinc-500 font-bold uppercase px-2 mb-1">Ev Sahibi</div>
                                      <div className="text-[10px] text-zinc-500 font-bold uppercase px-2 mb-1">Deplasman</div>
                                      <RenderBetButton id={match.id + '_ah_h_1'} selectionName="Asya Handikap: Ev (-0.5)" odd="1.85" label="-0.5" />
                                      <RenderBetButton id={match.id + '_ah_a_1'} selectionName="Asya Handikap: Dep (+0.5)" odd="1.95" label="+0.5" />
                                      <RenderBetButton id={match.id + '_ah_h_2'} selectionName="Asya Handikap: Ev (-1.5)" odd="3.20" label="-1.5" />
                                      <RenderBetButton id={match.id + '_ah_a_2'} selectionName="Asya Handikap: Dep (+1.5)" odd="1.35" label="+1.5" />
                                   </div>
                                 </RenderAccordion>

                                 <RenderAccordion title="Sıradaki Golü Kim Atar">
                                   <div className="grid grid-cols-3 gap-2">
                                      <RenderBetButton id={match.id + '_ng_1'} selectionName="Sıradaki Gol: 1" odd="1.95" label="1" labelClass="text-center w-full block" />
                                      <RenderBetButton id={match.id + '_ng_x'} selectionName="Sıradaki Gol: Yok" odd="12.0" label="Yok" labelClass="text-center w-full block" />
                                      <RenderBetButton id={match.id + '_ng_2'} selectionName="Sıradaki Gol: 2" odd="2.40" label="2" labelClass="text-center w-full block" />
                                   </div>
                                 </RenderAccordion>
                              </div>
      
                              {/* FOOTBALL RIGHT COLUMN */}
                              <div className="flex flex-col w-full gap-4">
                                 <RenderAccordion title="Çifte Şans">
                                   <div className="grid grid-cols-3 gap-2">
                                      <RenderBetButton id={match.id + '_dc_1x'} selectionName="Çifte Şans: 1X" odd={dc1x} label="1X" labelClass="text-center w-full block" />
                                      <RenderBetButton id={match.id + '_dc_12'} selectionName="Çifte Şans: 12" odd={dc12} label="12" labelClass="text-center w-full block" />
                                      <RenderBetButton id={match.id + '_dc_x2'} selectionName="Çifte Şans: X2" odd={dcx2} label="X2" labelClass="text-center w-full block" />
                                   </div>
                                 </RenderAccordion>
      
                                 <RenderAccordion title="Toplam Goller">
                                   <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                                      <div className="text-[10px] text-zinc-500 font-bold uppercase px-2 mb-1">Üstü</div>
                                      <div className="text-[10px] text-zinc-500 font-bold uppercase px-2 mb-1">Altı</div>
                                      {ouLines.slice(0, 3).map((line, idx) => (
                                         <React.Fragment key={idx}>
                                            <RenderBetButton id={`${match.id}_ou_${line?.id}_over`} selectionName={`Toplam ${line?.base} Üst`} odd={line?.over} label={line?.base} />
                                            <RenderBetButton id={`${match.id}_ou_${line?.id}_under`} selectionName={`Toplam ${line?.base} Alt`} odd={line?.under} label={line?.base} />
                                         </React.Fragment>
                                      ))}
                                   </div>
                                 </RenderAccordion>
      
                                 <RenderAccordion title="Beraberlikte İade">
                                   <div className="grid grid-cols-2 gap-2">
                                      <RenderBetButton id={match.id + '_dnb_1'} selectionName="Beraberlikte İade: 1" odd="1.45" label="1" labelClass="text-center w-full block" />
                                      <RenderBetButton id={match.id + '_dnb_2'} selectionName="Beraberlikte İade: 2" odd="2.55" label="2" labelClass="text-center w-full block" />
                                   </div>
                                 </RenderAccordion>

                                 <RenderAccordion title="İlk Yarı Sonucu">
                                   <div className="grid grid-cols-3 gap-2">
                                      <RenderBetButton id={match.id + '_ht_1'} selectionName="İlk Yarı Sonucu: 1" odd="2.40" label="1" labelClass="text-center w-full block" />
                                      <RenderBetButton id={match.id + '_ht_x'} selectionName="İlk Yarı Sonucu: X" odd="2.10" label="X" labelClass="text-center w-full block" />
                                      <RenderBetButton id={match.id + '_ht_2'} selectionName="İlk Yarı Sonucu: 2" odd="3.50" label="2" labelClass="text-center w-full block" />
                                   </div>
                                 </RenderAccordion>
                              </div>
                           </div>
                        )}
                     </>
                  )}
                  
                  {activeCategory === 'Goller' && (
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                        {/* LEFT COLUMN */}
                        <div className="flex flex-col w-full gap-4">
                           <RenderAccordion title="Toplam Goller">
                             <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                                <div className="text-[10px] text-zinc-500 font-bold uppercase px-2 mb-1">Üstü</div>
                                <div className="text-[10px] text-zinc-500 font-bold uppercase px-2 mb-1">Altı</div>
                                {ouLines.slice(0, 5).map((line, idx) => (
                                   <React.Fragment key={idx}>
                                      <RenderBetButton id={`${match.id}_ou_${line?.id}_over`} selectionName={`Toplam ${line?.base} Üst`} odd={line?.over} label={line?.base} />
                                      <RenderBetButton id={`${match.id}_ou_${line?.id}_under`} selectionName={`Toplam ${line?.base} Alt`} odd={line?.under} label={line?.base} />
                                   </React.Fragment>
                                ))}
                             </div>
                           </RenderAccordion>

                           <RenderAccordion title="İlk Yarı Toplam Gol">
                             <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                                <div className="text-[10px] text-zinc-500 font-bold uppercase px-2 mb-1">Üstü</div>
                                <div className="text-[10px] text-zinc-500 font-bold uppercase px-2 mb-1">Altı</div>
                                <RenderBetButton id={`${match.id}_htO05`} selectionName="1. Yarı Toplam 0.5 Üst" odd={htou.over05 !== '-' ? htou.over05 : '1.40'} label="0.5" />
                                <RenderBetButton id={`${match.id}_htU05`} selectionName="1. Yarı Toplam 0.5 Alt" odd={htou.under05 !== '-' ? htou.under05 : '2.70'} label="0.5" />
                                <RenderBetButton id={`${match.id}_htO15`} selectionName="1. Yarı Toplam 1.5 Üst" odd={htou.over15 !== '-' ? htou.over15 : '2.85'} label="1.5" />
                                <RenderBetButton id={`${match.id}_htU15`} selectionName="1. Yarı Toplam 1.5 Alt" odd={htou.under15 !== '-' ? htou.under15 : '1.38'} label="1.5" />
                             </div>
                           </RenderAccordion>
                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="flex flex-col w-full gap-4">
                           <RenderAccordion title="Ev Sahibi Toplam Gol">
                             <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                                <div className="text-[10px] text-zinc-500 font-bold uppercase px-2 mb-1">Üstü</div>
                                <div className="text-[10px] text-zinc-500 font-bold uppercase px-2 mb-1">Altı</div>
                                <RenderBetButton id={`${match.id}_home_ou05_o`} selectionName="Ev Sahibi 0.5 Üst" odd="1.18" label="0.5" />
                                <RenderBetButton id={`${match.id}_home_ou05_u`} selectionName="Ev Sahibi 0.5 Alt" odd="4.20" label="0.5" />
                                <RenderBetButton id={`${match.id}_home_ou15_o`} selectionName="Ev Sahibi 1.5 Üst" odd="2.05" label="1.5" />
                                <RenderBetButton id={`${match.id}_home_ou15_u`} selectionName="Ev Sahibi 1.5 Alt" odd="1.65" label="1.5" />
                             </div>
                           </RenderAccordion>
                           
                           <RenderAccordion title="Deplasman Toplam Gol">
                             <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                                <div className="text-[10px] text-zinc-500 font-bold uppercase px-2 mb-1">Üstü</div>
                                <div className="text-[10px] text-zinc-500 font-bold uppercase px-2 mb-1">Altı</div>
                                <RenderBetButton id={`${match.id}_away_ou05_o`} selectionName="Deplasman 0.5 Üst" odd="1.35" label="0.5" />
                                <RenderBetButton id={`${match.id}_away_ou05_u`} selectionName="Deplasman 0.5 Alt" odd="2.95" label="0.5" />
                                <RenderBetButton id={`${match.id}_away_ou15_o`} selectionName="Deplasman 1.5 Üst" odd="2.65" label="1.5" />
                                <RenderBetButton id={`${match.id}_away_ou15_u`} selectionName="Deplasman 1.5 Alt" odd="1.42" label="1.5" />
                             </div>
                           </RenderAccordion>
                        </div>
                     </div>
                  )}

                  {activeCategory === 'İlk Yarı' && (
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                        {/* LEFT COLUMN */}
                        <div className="flex flex-col w-full gap-4">
                           <RenderAccordion title="İlk Yarı Sonucu">
                             <div className="grid grid-cols-3 gap-2">
                                <RenderBetButton id={`${match.id}_ht1`} selectionName="1. Yarı Sonucu: 1" odd={ht1x2.home !== '-' ? ht1x2.home : '2.10'} label="1" labelClass="text-center w-full block" />
                                <RenderBetButton id={`${match.id}_htX`} selectionName="1. Yarı Sonucu: X" odd={ht1x2.draw !== '-' ? ht1x2.draw : '2.05'} label="X" labelClass="text-center w-full block" />
                                <RenderBetButton id={`${match.id}_ht2`} selectionName="1. Yarı Sonucu: 2" odd={ht1x2.away !== '-' ? ht1x2.away : '3.65'} label="2" labelClass="text-center w-full block" />
                             </div>
                           </RenderAccordion>

                           <RenderAccordion title="İlk Yarı Toplam Gol">
                             <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                                <div className="text-[10px] text-zinc-500 font-bold uppercase px-2 mb-1">Üstü</div>
                                <div className="text-[10px] text-zinc-500 font-bold uppercase px-2 mb-1">Altı</div>
                                <RenderBetButton id={`${match.id}_ht_o05`} selectionName="1. Yarı Toplam 0.5 Üst" odd={htou.over05 !== '-' ? htou.over05 : '1.40'} label="0.5" />
                                <RenderBetButton id={`${match.id}_ht_u05`} selectionName="1. Yarı Toplam 0.5 Alt" odd={htou.under05 !== '-' ? htou.under05 : '2.70'} label="0.5" />
                                <RenderBetButton id={`${match.id}_ht_o15`} selectionName="1. Yarı Toplam 1.5 Üst" odd={htou.over15 !== '-' ? htou.over15 : '2.85'} label="1.5" />
                                <RenderBetButton id={`${match.id}_ht_u15`} selectionName="1. Yarı Toplam 1.5 Alt" odd={htou.under15 !== '-' ? htou.under15 : '1.38'} label="1.5" />
                             </div>
                           </RenderAccordion>
                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="flex flex-col w-full gap-4">
                           <RenderAccordion title="İlk Yarı Çifte Şans">
                             <div className="grid grid-cols-3 gap-2">
                                <RenderBetButton id={`${match.id}_ht_dc1x`} selectionName="1. Yarı Çifte Şans: 1X" odd="1.25" label="1X" labelClass="text-center w-full block" />
                                <RenderBetButton id={`${match.id}_ht_dc12`} selectionName="1. Yarı Çifte Şans: 12" odd="1.60" label="12" labelClass="text-center w-full block" />
                                <RenderBetButton id={`${match.id}_ht_dcx2`} selectionName="1. Yarı Çifte Şans: X2" odd="1.45" label="X2" labelClass="text-center w-full block" />
                             </div>
                           </RenderAccordion>
                           
                           <RenderAccordion title="İlk Yarı Karşılıklı Gol">
                             <div className="grid grid-cols-2 gap-2">
                                <RenderBetButton id={`${match.id}_ht_gg_var`} selectionName="1. Yarı Karşılıklı Gol: Evet" odd="4.50" label="Evet" />
                                <RenderBetButton id={`${match.id}_ht_gg_yok`} selectionName="1. Yarı Karşılıklı Gol: Hayır" odd="1.15" label="Hayır" />
                             </div>
                           </RenderAccordion>
                        </div>
                     </div>
                  )}

                  {activeCategory === 'Korner & Kart' && (
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                        {/* LEFT COLUMN */}
                        <div className="flex flex-col w-full gap-4">
                           <RenderAccordion title="Maç Sonucu (Kornerler)">
                             <div className="grid grid-cols-3 gap-2">
                                <RenderBetButton id={`${match.id}_cr1`} selectionName="Korner Sonucu: 1" odd={cr1x2.home !== '-' ? cr1x2.home : '1.85'} label="1" labelClass="text-center w-full block" />
                                <RenderBetButton id={`${match.id}_crX`} selectionName="Korner Sonucu: X" odd={cr1x2.draw !== '-' ? cr1x2.draw : '5.50'} label="X" labelClass="text-center w-full block" />
                                <RenderBetButton id={`${match.id}_cr2`} selectionName="Korner Sonucu: 2" odd={cr1x2.away !== '-' ? cr1x2.away : '2.15'} label="2" labelClass="text-center w-full block" />
                             </div>
                           </RenderAccordion>
                           
                           <RenderAccordion title="İlk Yarı (Kornerler)">
                             <div className="grid grid-cols-3 gap-2">
                                <RenderBetButton id={`${match.id}_cr1_ht`} selectionName="1. Yarı Korner: 1" odd="2.10" label="1" labelClass="text-center w-full block" />
                                <RenderBetButton id={`${match.id}_crX_ht`} selectionName="1. Yarı Korner: X" odd="3.40" label="X" labelClass="text-center w-full block" />
                                <RenderBetButton id={`${match.id}_cr2_ht`} selectionName="1. Yarı Korner: 2" odd="2.80" label="2" labelClass="text-center w-full block" />
                             </div>
                           </RenderAccordion>
                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="flex flex-col w-full gap-4">
                           <RenderAccordion title="Toplam Korner">
                             <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                                <div className="text-[10px] text-zinc-500 font-bold uppercase px-2 mb-1">Üstü</div>
                                <div className="text-[10px] text-zinc-500 font-bold uppercase px-2 mb-1">Altı</div>
                                <RenderBetButton id={`${match.id}_cr_o75`} selectionName="Korner 7.5 Üst" odd={crou.over75 !== '-' ? crou.over75 : '1.35'} label="7.5" />
                                <RenderBetButton id={`${match.id}_cr_u75`} selectionName="Korner 7.5 Alt" odd={crou.under75 !== '-' ? crou.under75 : '2.85'} label="7.5" />
                                <RenderBetButton id={`${match.id}_cr_o85`} selectionName="Korner 8.5 Üst" odd={crou.over85 !== '-' ? crou.over85 : '1.75'} label="8.5" />
                                <RenderBetButton id={`${match.id}_cr_u85`} selectionName="Korner 8.5 Alt" odd={crou.under85 !== '-' ? crou.under85 : '1.95'} label="8.5" />
                                <RenderBetButton id={`${match.id}_cr_o95`} selectionName="Korner 9.5 Üst" odd="2.30" label="9.5" />
                                <RenderBetButton id={`${match.id}_cr_u95`} selectionName="Korner 9.5 Alt" odd="1.55" label="9.5" />
                             </div>
                           </RenderAccordion>
                           
                           <RenderAccordion title="Toplam Kartlar">
                             <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                                <div className="text-[10px] text-zinc-500 font-bold uppercase px-2 mb-1">Üstü</div>
                                <div className="text-[10px] text-zinc-500 font-bold uppercase px-2 mb-1">Altı</div>
                                <RenderBetButton id={`${match.id}_card_o35`} selectionName="Kart 3.5 Üst" odd="1.50" label="3.5" />
                                <RenderBetButton id={`${match.id}_card_u35`} selectionName="Kart 3.5 Alt" odd="2.40" label="3.5" />
                                <RenderBetButton id={`${match.id}_card_o45`} selectionName="Kart 4.5 Üst" odd="2.05" label="4.5" />
                                <RenderBetButton id={`${match.id}_card_u45`} selectionName="Kart 4.5 Alt" odd="1.70" label="4.5" />
                             </div>
                           </RenderAccordion>
                        </div>
                     </div>
                  )}

                  {activeCategory === 'Asya' && (
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                        {/* LEFT COLUMN */}
                        <div className="flex flex-col w-full gap-4">
                           <RenderAccordion title="Asya Handikap">
                             <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                                <div className="text-[10px] text-zinc-500 font-bold uppercase px-2 mb-1">Ev Sahibi</div>
                                <div className="text-[10px] text-zinc-500 font-bold uppercase px-2 mb-1">Deplasman</div>
                                <RenderBetButton id={`${match.id}_ah_1_m05`} selectionName="Asya Handikap: 1 (-0.5)" odd="2.10" label="-0.5" />
                                <RenderBetButton id={`${match.id}_ah_2_p05`} selectionName="Asya Handikap: 2 (+0.5)" odd="1.70" label="+0.5" />
                                <RenderBetButton id={`${match.id}_ah_1_m10`} selectionName="Asya Handikap: 1 (-1.0)" odd="3.20" label="-1.0" />
                                <RenderBetButton id={`${match.id}_ah_2_p10`} selectionName="Asya Handikap: 2 (+1.0)" odd="1.35" label="+1.0" />
                             </div>
                           </RenderAccordion>
                           <RenderAccordion title="İlk Yarı Asya Handikap">
                             <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                                <div className="text-[10px] text-zinc-500 font-bold uppercase px-2 mb-1">Ev Sahibi</div>
                                <div className="text-[10px] text-zinc-500 font-bold uppercase px-2 mb-1">Deplasman</div>
                                <RenderBetButton id={`${match.id}_ht_ah_1_m05`} selectionName="1. Yarı Asya Handikap: 1 (-0.5)" odd="2.65" label="-0.5" />
                                <RenderBetButton id={`${match.id}_ht_ah_2_p05`} selectionName="1. Yarı Asya Handikap: 2 (+0.5)" odd="1.45" label="+0.5" />
                             </div>
                           </RenderAccordion>
                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="flex flex-col w-full gap-4">
                           <RenderAccordion title="Asya Toplam Gol">
                             <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                                <div className="text-[10px] text-zinc-500 font-bold uppercase px-2 mb-1">Üstü</div>
                                <div className="text-[10px] text-zinc-500 font-bold uppercase px-2 mb-1">Altı</div>
                                <RenderBetButton id={`${match.id}_ah_ou_175_o`} selectionName="Asya Toplam 1.75 Üst" odd="1.65" label="1.75" />
                                <RenderBetButton id={`${match.id}_ah_ou_175_u`} selectionName="Asya Toplam 1.75 Alt" odd="2.15" label="1.75" />
                                <RenderBetButton id={`${match.id}_ah_ou_225_o`} selectionName="Asya Toplam 2.25 Üst" odd="1.90" label="2.25" />
                                <RenderBetButton id={`${match.id}_ah_ou_225_u`} selectionName="Asya Toplam 2.25 Alt" odd="1.85" label="2.25" />
                                <RenderBetButton id={`${match.id}_ah_ou_275_o`} selectionName="Asya Toplam 2.75 Üst" odd="2.40" label="2.75" />
                                <RenderBetButton id={`${match.id}_ah_ou_275_u`} selectionName="Asya Toplam 2.75 Alt" odd="1.50" label="2.75" />
                             </div>
                           </RenderAccordion>
                        </div>
                     </div>
                  )}

                  {activeCategory === 'Oyuncular' && (
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                        <div className="flex flex-col w-full gap-4">
                           <RenderAccordion title="Gol Atacak Oyuncu">
                             <div className="grid grid-cols-2 gap-2">
                                <RenderBetButton id={`${match.id}_player_1`} selectionName="İlk Golü Atar: L. Messi" odd="4.50" label="L. Messi" />
                                <RenderBetButton id={`${match.id}_player_2`} selectionName="İlk Golü Atar: K. Mbappe" odd="5.00" label="K. Mbappe" />
                                <RenderBetButton id={`${match.id}_player_3`} selectionName="Herhangi Bir Zamanda Atar: L. Messi" odd="2.10" label="L. Messi (Anytime)" />
                                <RenderBetButton id={`${match.id}_player_4`} selectionName="Herhangi Bir Zamanda Atar: K. Mbappe" odd="2.40" label="K. Mbappe (Anytime)" />
                             </div>
                           </RenderAccordion>
                           <RenderAccordion title="Oyuncu İsabetli Şut Sayısı">
                             <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                                <div className="text-[10px] text-zinc-500 font-bold uppercase px-2 mb-1">Üstü</div>
                                <div className="text-[10px] text-zinc-500 font-bold uppercase px-2 mb-1">Altı</div>
                                <RenderBetButton id={`${match.id}_shot_1_o`} selectionName="L. Messi: 1.5 İsabetli Şut Üst" odd="1.85" label="1.5 (L. Messi)" />
                                <RenderBetButton id={`${match.id}_shot_1_u`} selectionName="L. Messi: 1.5 İsabetli Şut Alt" odd="1.85" label="1.5 (L. Messi)" />
                                <RenderBetButton id={`${match.id}_shot_2_o`} selectionName="K. Mbappe: 2.5 İsabetli Şut Üst" odd="2.10" label="2.5 (K. Mbappe)" />
                                <RenderBetButton id={`${match.id}_shot_2_u`} selectionName="K. Mbappe: 2.5 İsabetli Şut Alt" odd="1.65" label="2.5 (K. Mbappe)" />
                             </div>
                           </RenderAccordion>
                           <RenderAccordion title="Gol Atar ve Takımı Kazanır">
                             <div className="grid grid-cols-1 gap-2">
                                <RenderBetButton id={`${match.id}_win_score_1`} selectionName="L. Messi Gol Atar ve Takımı Kazanır" odd="3.20" label="L. Messi & Ev Sahibi Kazanır" />
                                <RenderBetButton id={`${match.id}_win_score_2`} selectionName="K. Mbappe Gol Atar ve Takımı Kazanır" odd="4.10" label="K. Mbappe & Deplasman Kazanır" />
                             </div>
                           </RenderAccordion>
                        </div>
                        <div className="flex flex-col w-full gap-4">
                           <RenderAccordion title="Oyuncu Kart Görür mü?">
                             <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                                <div className="text-[10px] text-zinc-500 font-bold uppercase px-2 mb-1">Evet</div>
                                <div className="text-[10px] text-zinc-500 font-bold uppercase px-2 mb-1">Hayır</div>
                                <RenderBetButton id={`${match.id}_card_1_y`} selectionName="Kart Görür: S. Ramos" odd="2.20" label="S. Ramos" />
                                <RenderBetButton id={`${match.id}_card_1_n`} selectionName="Kart Görmez: S. Ramos" odd="1.60" label="S. Ramos" />
                                <RenderBetButton id={`${match.id}_card_2_y`} selectionName="Kart Görür: Pepe" odd="1.95" label="Pepe" />
                                <RenderBetButton id={`${match.id}_card_2_n`} selectionName="Kart Görmez: Pepe" odd="1.75" label="Pepe" />
                             </div>
                           </RenderAccordion>
                           <RenderAccordion title="Kırmızı Kart Görür mü?">
                             <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                                <div className="text-[10px] text-zinc-500 font-bold uppercase px-2 mb-1">Evet</div>
                                <div className="text-[10px] text-zinc-500 font-bold uppercase px-2 mb-1">Hayır</div>
                                <RenderBetButton id={`${match.id}_rcard_1_y`} selectionName="Kırmızı Kart Görür: S. Ramos" odd="12.0" label="S. Ramos" />
                                <RenderBetButton id={`${match.id}_rcard_1_n`} selectionName="Kırmızı Kart Görmez: S. Ramos" odd="1.02" label="S. Ramos" />
                             </div>
                           </RenderAccordion>
                           <RenderAccordion title="Oyuncu Asist Yapar mı?">
                             <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                                <div className="text-[10px] text-zinc-500 font-bold uppercase px-2 mb-1">Evet</div>
                                <div className="text-[10px] text-zinc-500 font-bold uppercase px-2 mb-1">Hayır</div>
                                <RenderBetButton id={`${match.id}_ast_1_y`} selectionName="Asist Yapar: K. De Bruyne" odd="2.50" label="K. De Bruyne" />
                                <RenderBetButton id={`${match.id}_ast_1_n`} selectionName="Asist Yapmaz: K. De Bruyne" odd="1.45" label="K. De Bruyne" />
                                <RenderBetButton id={`${match.id}_ast_2_y`} selectionName="Asist Yapar: Neymar" odd="3.10" label="Neymar" />
                                <RenderBetButton id={`${match.id}_ast_2_n`} selectionName="Asist Yapmaz: Neymar" odd="1.30" label="Neymar" />
                             </div>
                           </RenderAccordion>
                        </div>
                     </div>
                  )}

                  {activeCategory === 'Çeyrekler' && (
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                        <div className="flex flex-col w-full gap-4">
                           <RenderAccordion title="1. Çeyrek Sonucu">
                             <div className="grid grid-cols-3 gap-2">
                                <RenderBetButton id={`${match.id}_q1_1`} selectionName="1. Çeyrek: 1" odd="1.85" label="1" labelClass="text-center w-full block" />
                                <RenderBetButton id={`${match.id}_q1_x`} selectionName="1. Çeyrek: X" odd="15.0" label="X" labelClass="text-center w-full block" />
                                <RenderBetButton id={`${match.id}_q1_2`} selectionName="1. Çeyrek: 2" odd="1.95" label="2" labelClass="text-center w-full block" />
                             </div>
                           </RenderAccordion>
                        </div>
                        <div className="flex flex-col w-full gap-4">
                           <RenderAccordion title="1. Çeyrek Toplam">
                             <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                                <div className="text-[10px] text-zinc-500 font-bold uppercase px-2 mb-1">Üstü</div>
                                <div className="text-[10px] text-zinc-500 font-bold uppercase px-2 mb-1">Altı</div>
                                <RenderBetButton id={`${match.id}_q1_o45`} selectionName="1. Çeyrek 45.5 Üst" odd="1.85" label="45.5" />
                                <RenderBetButton id={`${match.id}_q1_u45`} selectionName="1. Çeyrek 45.5 Alt" odd="1.85" label="45.5" />
                             </div>
                           </RenderAccordion>
                        </div>
                     </div>
                  )}

                  {activeCategory === 'Yarılar' && (
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                        <div className="flex flex-col w-full gap-4">
                           <RenderAccordion title="İlk Yarı Sonucu (Basketbol)">
                             <div className="grid grid-cols-3 gap-2">
                                <RenderBetButton id={`${match.id}_h1_1`} selectionName="İlk Yarı: 1" odd="1.70" label="1" labelClass="text-center w-full block" />
                                <RenderBetButton id={`${match.id}_h1_x`} selectionName="İlk Yarı: X" odd="20.0" label="X" labelClass="text-center w-full block" />
                                <RenderBetButton id={`${match.id}_h1_2`} selectionName="İlk Yarı: 2" odd="2.10" label="2" labelClass="text-center w-full block" />
                             </div>
                           </RenderAccordion>
                        </div>
                        <div className="flex flex-col w-full gap-4">
                           <RenderAccordion title="İlk Yarı Toplam (Basketbol)">
                             <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                                <div className="text-[10px] text-zinc-500 font-bold uppercase px-2 mb-1">Üstü</div>
                                <div className="text-[10px] text-zinc-500 font-bold uppercase px-2 mb-1">Altı</div>
                                <RenderBetButton id={`${match.id}_h1_o85`} selectionName="İlk Yarı 85.5 Üst" odd="1.90" label="85.5" />
                                <RenderBetButton id={`${match.id}_h1_u85`} selectionName="İlk Yarı 85.5 Alt" odd="1.90" label="85.5" />
                             </div>
                           </RenderAccordion>
                        </div>
                     </div>
                  )}

                  {activeCategory === 'Toplam' && (
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                        <div className="flex flex-col w-full gap-4">
                           <RenderAccordion title="Maç Toplamı (Alternatifler)">
                             <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                                <div className="text-[10px] text-zinc-500 font-bold uppercase px-2 mb-1">Üstü</div>
                                <div className="text-[10px] text-zinc-500 font-bold uppercase px-2 mb-1">Altı</div>
                                <RenderBetButton id={`${match.id}_tot_o155`} selectionName="Toplam 155.5 Üst" odd="1.50" label="155.5" />
                                <RenderBetButton id={`${match.id}_tot_u155`} selectionName="Toplam 155.5 Alt" odd="2.40" label="155.5" />
                                <RenderBetButton id={`${match.id}_tot_o165`} selectionName="Toplam 165.5 Üst" odd="1.85" label="165.5" />
                                <RenderBetButton id={`${match.id}_tot_u165`} selectionName="Toplam 165.5 Alt" odd="1.85" label="165.5" />
                                <RenderBetButton id={`${match.id}_tot_o175`} selectionName="Toplam 175.5 Üst" odd="2.30" label="175.5" />
                                <RenderBetButton id={`${match.id}_tot_u175`} selectionName="Toplam 175.5 Alt" odd="1.55" label="175.5" />
                             </div>
                           </RenderAccordion>
                        </div>
                     </div>
                  )}

                  {activeCategory === 'Setler' && (
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                        <div className="flex flex-col w-full gap-4">
                           <RenderAccordion title="1. Set Kazananı">
                             <div className="grid grid-cols-2 gap-2">
                                <RenderBetButton id={`${match.id}_set1_1`} selectionName="1. Set Kazananı: 1" odd="1.65" label={match.home} />
                                <RenderBetButton id={`${match.id}_set1_2`} selectionName="1. Set Kazananı: 2" odd="2.15" label={match.away} />
                             </div>
                           </RenderAccordion>
                        </div>
                        <div className="flex flex-col w-full gap-4">
                           <RenderAccordion title="Toplam Set Sayısı">
                             <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                                <div className="text-[10px] text-zinc-500 font-bold uppercase px-2 mb-1">Üstü</div>
                                <div className="text-[10px] text-zinc-500 font-bold uppercase px-2 mb-1">Altı</div>
                                <RenderBetButton id={`${match.id}_sets_o25`} selectionName="Setler 2.5 Üst" odd="2.20" label="2.5" />
                                <RenderBetButton id={`${match.id}_sets_u25`} selectionName="Setler 2.5 Alt" odd="1.60" label="2.5" />
                             </div>
                           </RenderAccordion>
                        </div>
                     </div>
                  )}

                  {activeCategory === 'Oyunlar' && (
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                        <div className="flex flex-col w-full gap-4">
                           <RenderAccordion title="Sıradaki Oyun">
                             <div className="grid grid-cols-2 gap-2">
                                <RenderBetButton id={`${match.id}_ng_1`} selectionName="Sıradaki Oyun: 1" odd="1.45" label={match.home} />
                                <RenderBetButton id={`${match.id}_ng_2`} selectionName="Sıradaki Oyun: 2" odd="2.65" label={match.away} />
                             </div>
                           </RenderAccordion>
                        </div>
                     </div>
                  )}

                  {activeCategory === 'İstatistikler' && (
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                        <div className="flex flex-col w-full gap-4">
                           <RenderAccordion title="Oyuncu Özel (Sayı)">
                             <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                                <div className="text-[10px] text-zinc-500 font-bold uppercase px-2 mb-1">Üstü</div>
                                <div className="text-[10px] text-zinc-500 font-bold uppercase px-2 mb-1">Altı</div>
                                <RenderBetButton id={`${match.id}_stat_p1_o`} selectionName="Oyuncu 1 Sayı: 20.5 Üst" odd="1.85" label="20.5" />
                                <RenderBetButton id={`${match.id}_stat_p1_u`} selectionName="Oyuncu 1 Sayı: 20.5 Alt" odd="1.85" label="20.5" />
                             </div>
                           </RenderAccordion>
                        </div>
                     </div>
                  )}

                  {!['Ana Seçenekler', 'Goller', 'İlk Yarı', 'Asya', 'Korner & Kart', 'Oyuncular', 'Çeyrekler', 'Yarılar', 'Toplam', 'Setler', 'Oyunlar', 'İstatistikler'].includes(activeCategory) && (
                     <div className="flex flex-col items-center justify-center py-16 px-4 bg-sports-card rounded-sports-card border border-sports-subtle w-full shadow-lg">
                        <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
                           <span className="text-3xl">⌛</span>
                        </div>
                        <h3 className="text-white font-black text-[18px] mb-2 tracking-wide uppercase">Piyasalar Yükleniyor</h3>
                        <p className="text-zinc-500 text-[14px] text-center max-w-sm">
                           "{activeCategory}" bahisleri şu anda güncelleniyor veya bu karşılaşma için anlık olarak kapalı durumda. Lütfen Ana Seçeneklere dönün.
                        </p>
                     </div>
                  )}
               </div>
            )}

         </div>

         {/* Right Column (Video / Animation Player) */}
         <div className="w-full xl:w-[320px] 2xl:w-[360px] shrink-0 sticky top-4 self-start hidden xl:block">
            <MatchAnimationPlayer match={match} stats={stats} homeStats={homeStats} awayStats={awayStats} />
         </div>

      </div>
    </div>
    </div>
  );
});
