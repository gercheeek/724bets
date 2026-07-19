import React, { useState, useEffect, useRef } from 'react';
import { useBetting } from '../contexts/BettingContext';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Search, ChevronRight, ChevronDown, X,
  Activity, Star, Flame, Clock, Trophy, Gamepad2, Target, Zap, TrendingUp
} from 'lucide-react';

interface BetSelection {
  id: string;
  matchId: string;
  matchName: string;
  marketName: string;
  selectionName: string;
  odd: number;
}

interface MatchInfo {
  id: string;
  home: string;
  away: string;
  isLive: boolean;
  isFinished: boolean;
  score: string;
  minute: string;
  league: string;
  sport: string;
  country: string;
  homeOdd: string;
  drawOdd: string;
  awayOdd: string;
  homeId: string;
  drawId: string;
  awayId: string;
  homeLogo: string;
  awayLogo: string;
  marketsCount: number;
}

interface Spor724ViewProps {
  onNavigate: (view: string) => void;
}

const mapSportName = (name: string, lang: string) => {
  if (!name) return lang === 'tr' ? 'Futbol' : 'Soccer';
  const norm = name.toLowerCase();
  if (norm.includes('soccer') || norm.includes('futbol')) return lang === 'tr' ? 'Futbol' : 'Soccer';
  if (norm.includes('basketball') || norm.includes('basketbol')) return lang === 'tr' ? 'Basketbol' : 'Basketball';
  if (norm.includes('tennis') || norm.includes('tenis')) return lang === 'tr' ? 'Tenis' : 'Tennis';
  if (norm.includes('volleyball') || norm.includes('voleybol')) return lang === 'tr' ? 'Voleybol' : 'Volleyball';
  if (norm.includes('hockey')) return lang === 'tr' ? 'Buz Hokeyi' : 'Ice Hockey';
  if (norm.includes('handball')) return lang === 'tr' ? 'Hentbol' : 'Handball';
  if (norm.includes('table tennis')) return lang === 'tr' ? 'Masa Tenisi' : 'Table Tennis';
  return name;
};

const mapCountryName = (name: string, lang: string) => {
  if (!name) return lang === 'tr' ? 'Uluslararası' : 'International';
  const norm = name.toLowerCase();
  if (norm.includes('international clubs')) return lang === 'tr' ? 'Uluslararası (Kulüpler)' : 'International Clubs';
  if (norm.includes('international')) return lang === 'tr' ? 'Uluslararası' : 'International';
  if (norm.includes('turkey') || norm.includes('türkiye')) return lang === 'tr' ? 'Türkiye' : 'Turkey';
  if (norm.includes('germany') || norm.includes('almanya')) return lang === 'tr' ? 'Almanya' : 'Germany';
  if (norm.includes('england') || norm.includes('ingiltere')) return lang === 'tr' ? 'İngiltere' : 'England';
  if (norm.includes('spain') || norm.includes('ispanya')) return lang === 'tr' ? 'İspanya' : 'Spain';
  if (norm.includes('italy') || norm.includes('italya')) return lang === 'tr' ? 'İtalya' : 'Italy';
  if (norm.includes('france') || norm.includes('fransa')) return lang === 'tr' ? 'Fransa' : 'France';
  if (norm.includes('russia') || norm.includes('rusya')) return lang === 'tr' ? 'Rusya' : 'Russia';
  if (norm.includes('belarus') || norm.includes('beyaz rusya')) return lang === 'tr' ? 'Beyaz Rusya' : 'Belarus';
  if (norm.includes('china') || norm.includes('çin')) return lang === 'tr' ? 'Çin' : 'China';
  if (norm.includes('brazil') || norm.includes('brezilya')) return lang === 'tr' ? 'Brezilya' : 'Brazil';
  if (norm.includes('sweden') || norm.includes('isveç')) return lang === 'tr' ? 'İsveç' : 'Sweden';
  if (norm.includes('kazakhstan') || norm.includes('kazakistan')) return lang === 'tr' ? 'Kazakistan' : 'Kazakhstan';
  if (norm.includes('paraguay')) return 'Paraguay';
  if (norm.includes('finland') || norm.includes('finlandiya')) return lang === 'tr' ? 'Finlandiya' : 'Finland';
  return name;
};

const getCountryFlag = (country: string) => {
  const flags: Record<string, string> = {
    'Türkiye': '🇹🇷', 'Turkey': '🇹🇷',
    'Almanya': '🇩🇪', 'Germany': '🇩🇪',
    'İngiltere': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    'İspanya': '🇪🇸', 'Spain': '🇪🇸',
    'İtalya': '🇮🇹', 'Italy': '🇮🇹',
    'Fransa': '🇫🇷', 'France': '🇫🇷',
    'Rusya': '🇷🇺', 'Russia': '🇷🇺',
    'Beyaz Rusya': '🇧🇾', 'Belarus': '🇧🇾',
    'Çin': '🇨🇳', 'China': '🇨🇳',
    'Brezilya': '🇧🇷', 'Brazil': '🇧🇷',
    'İsveç': '🇸🇪', 'Sweden': '🇸🇪',
    'Kazakistan': '🇰🇿', 'Kazakhstan': '🇰🇿',
    'Paraguay': '🇵🇾',
    'Finlandiya': '🇫🇮', 'Finland': '🇫🇮',
    'Uluslararası': '🌍', 'International': '🌍',
    'Uluslararası (Kulüpler)': '🏆', 'International Clubs': '🏆',
  };
  return flags[country] || '🏳️';
};

export default function Spor724View({ onNavigate }: Spor724ViewProps) {
  const { language } = useLanguage();
  const [activeSport, setActiveSport] = useState(language === 'tr' ? 'Futbol' : 'Soccer');
  const [activeCountry, setActiveCountry] = useState<string | null>(null);
  const [isBetSlipOpen, setIsBetSlipOpen] = useState(false);
  const [betSlip, setBetSlip] = useState<BetSelection[]>([]);
  const [betAmount, setBetAmount] = useState<string>('');
  
  const [matches, setMatches] = useState<MatchInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { events } = useBetting();

  useEffect(() => {
    if (!events || events.length === 0) {
      if (matches.length === 0) setIsLoading(true);
      return;
    }
    
    const parsedMatches: MatchInfo[] = [];
    events.forEach((ev: any) => {
      const data = ev.data;
      if (!data || !data.participants) return;
      
      const homeTeam = data.participants.home || 'Ev Sahibi';
      const awayTeam = data.participants.away || 'Deplasman';
      
      let score = '-';
      let minute = 'Yakında';
      let isFinished = data.status === 'finished' || data.status === 'ended' || data.status === 'closed';
      let isLive = data.status === 'in_progress' || data.is_live_betting === true || isFinished;
      
      if (data.scores && Array.isArray(data.scores)) {
        const currentScore = data.scores.find((s: string) => s.startsWith('current|'));
        if (currentScore) {
          const parts = currentScore.split('|');
          if (parts.length >= 4) {
             score = `${parts[2]} - ${parts[3]}`;
          }
        } else if (data.current_score) {
          score = data.current_score.replace(':', ' - ');
        }
      }
      if (isFinished) {
          minute = language === 'tr' ? 'Bitti' : 'FT';
      } else if (data.minute) {
          minute = `${data.minute}'`;
      } else if (data.extended_status && data.extended_status.includes('s')) {
          minute = data.extended_status.replace('s', '. Set');
      }
      
      const homeTeamId = data.participants?.home_id || data.participants?.ByNumber?.['1']?.Id;
      const awayTeamId = data.participants?.away_id || data.participants?.ByNumber?.['2']?.Id;
      
      const homeLogoUrl = data.participants?.ByNumber?.['1']?.LogoPath || (homeTeamId ? `https://opt.betconstruct.com/api/team/image/${homeTeamId}` : `https://api.dicebear.com/7.x/initials/svg?seed=${homeTeam}&backgroundColor=0f1422&textColor=e5e2e1`);
      const awayLogoUrl = data.participants?.ByNumber?.['2']?.LogoPath || (awayTeamId ? `https://opt.betconstruct.com/api/team/image/${awayTeamId}` : `https://api.dicebear.com/7.x/initials/svg?seed=${awayTeam}&backgroundColor=0f1422&textColor=e5e2e1`);
      
      const countryName = mapCountryName(data.country?.name, language);
      const tournamentName = data.tournament?.name || 'Uluslararası Turnuva';
      const league = countryName ? `${countryName} - ${tournamentName}` : tournamentName;
      const sport = mapSportName(data.sport?.name, language);
      const country = countryName;
      
      let homeOdd = '-';
      let drawOdd = '-';
      let awayOdd = '-';
      let homeId = `h_${ev.id}`;
      let drawId = `d_${ev.id}`;
      let awayId = `a_${ev.id}`;
      
      const markets = data.group_markets?.['full_event|0'] || data.group_markets?.['game_full_event|0'] || data.group_markets?.['set|1'] || [];
      const market1x2 = markets.find((m: string) => m.includes('|12||') || m.includes('|1x2||') || m.includes('|oe||'));
      if (market1x2) {
         const parts = market1x2.split('|');
         if (parts.length > 7) {
            const selections = parts[7].split('!');
            selections.forEach((sel: string) => {
               const sParts = sel.split('~');
               if (sParts.length >= 3) {
                 const id = sParts[0];
                 const type = sParts[1].toLowerCase();
                 const odd = parseFloat(sParts[2]).toFixed(2);
                 if (type === 'home' || type === '1') { homeOdd = odd; homeId = id; }
                 if (type === 'draw' || type === 'x') { drawOdd = odd; drawId = id; }
                 if (type === 'away' || type === '2') { awayOdd = odd; awayId = id; }
               }
            });
         }
      }
      
      parsedMatches.push({
        id: ev.id,
        home: homeTeam,
        away: awayTeam,
        isLive,
        isFinished,
        score,
        minute,
        league,
        sport,
        country,
        homeOdd,
        drawOdd,
        awayOdd,
        homeId,
        drawId,
        awayId,
        homeLogo: homeLogoUrl,
        awayLogo: awayLogoUrl,
        marketsCount: Object.keys(data.group_markets || {}).length || 1
      });
    });
    
    setMatches(parsedMatches);
    setIsLoading(false);
  }, [events, language]);

  const sportsList = Array.from(new Set(matches.map(m => m.sport)));
  const getSportCount = (sport: string) => matches.filter(m => m.sport === sport && m.isLive).length;

  const filteredMatches = matches.filter(m => {
    if (!m.isLive) return false;
    if (m.sport !== activeSport) return false;
    if (activeCountry && m.country !== activeCountry) return false;
    return true;
  });

  // Group by league
  const groupedByLeague: Record<string, MatchInfo[]> = {};
  filteredMatches.forEach(match => {
    if (!groupedByLeague[match.league]) {
      groupedByLeague[match.league] = [];
    }
    groupedByLeague[match.league].push(match);
  });

  // Sort league groups by priority tiers
  const getLeaguePriority = (leagueName: string) => {
    const name = leagueName.toLowerCase();
    
    // Tier 1: Top Major Leagues and Competitions (Score: 1)
    const tier1Keywords = [
      'şampiyonlar ligi', 'champions league', 'avrupa ligi', 'europa league', 
      'conference league', 'konferans ligi', 'süper lig', 'premier league', 
      'la liga', 'serie a', 'bundesliga', 'ligue 1', 'nba', 'euroleague',
      'dünya kupası', 'world cup', 'euro 20', 'copa america', 'grand slam', 'masters 1000',
      'club friendly games', 'uluslararası (kulüpler)'
    ];
    if (tier1Keywords.some(kw => name.includes(kw))) return 1;

    // Tier 3: Youth, Women, Friendlies (except club friendlies), Amateurs, Lower Leagues (Score: 3)
    const tier3Keywords = [
      'u19', 'u20', 'u21', 'u23', 'youth', 'genç', 'women', 'kadınlar', 'bayanlar',
      'friendly', 'hazırlık', 'amateur', 'amatör', 'reserve', 'rezerv',
      '2. lig', '3. lig', 'division 2', 'division 3', 'league 2', 'league 3',
      'serie b', 'serie c', 'liga 2', 'liga 3', 'championship', 'segunda', 'b ligi'
    ];
    if (tier3Keywords.some(kw => name.includes(kw) && !name.includes('club friendly games') && !name.includes('uluslararası (kulüpler)'))) return 3;

    // Tier 2: Everything else (Other 1st Leagues, Standard Tournaments) (Score: 2)
    return 2;
  };

  const sortedLeagues = Object.keys(groupedByLeague).sort((a, b) => {
    const priorityA = getLeaguePriority(a);
    const priorityB = getLeaguePriority(b);
    
    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }
    // If same tier, sort alphabetically
    return a.localeCompare(b);
  });

  const toggleSelection = (match: MatchInfo, oddId: string, oddValue: string, selectionName: string) => {
    if (!oddId || oddValue === '-') return;

    setBetSlip(prev => {
      const exists = prev.find(s => s.id === oddId);
      if (exists) {
        return prev.filter(s => s.id !== oddId);
      }
      const filtered = prev.filter(s => s.matchId !== match.id);
      return [...filtered, {
        id: oddId,
        matchId: match.id,
        matchName: `${match.home} - ${match.away}`,
        marketName: 'Maç Sonucu 1X2',
        selectionName,
        odd: parseFloat(oddValue)
      }];
    });
    if (!isBetSlipOpen) setIsBetSlipOpen(true);
  };

  const getSportIcon = (sportName: string) => {
    const name = sportName.toLowerCase();
    if (name.includes('futbol') || name.includes('soccer')) return <Activity className="w-4 h-4" />;
    if (name.includes('basketbol') || name.includes('basketball')) return <Target className="w-4 h-4" />;
    if (name.includes('tenis') || name.includes('tennis')) return <Trophy className="w-4 h-4" />;
    if (name.includes('voleybol') || name.includes('volleyball')) return <Clock className="w-4 h-4" />;
    if (name.includes('e-spor') || name.includes('esports') || name.includes('counter') || name.includes('valorant')) return <Gamepad2 className="w-4 h-4" />;
    if (name.includes('boks') || name.includes('boxing') || name.includes('martial')) return <Flame className="w-4 h-4" />;
    if (name.includes('hokey') || name.includes('hockey')) return <Zap className="w-4 h-4" />;
    return <Activity className="w-4 h-4" />;
  };

  // Featured matches for Popüler grid (top 6 highest priority matches)
  const featuredMatches = [...matches]
    .sort((a, b) => {
       const pA = getLeaguePriority(a.league);
       const pB = getLeaguePriority(b.league);
       if (pA !== pB) return pA - pB;
       // if same tier, live matches first
       if (a.isLive && !b.isLive) return -1;
       if (!a.isLive && b.isLive) return 1;
       return 0;
    })
    .slice(0, 6);

  return (
    <div className="flex h-full w-full bg-[#0B0F19] text-[#e5e2e1] font-sans overflow-hidden">
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        
        {/* Ambient Glow */}
        <div className="absolute top-[-200px] left-1/4 w-[600px] h-[600px] bg-[#36ffc4]/[0.02] rounded-full blur-[120px] pointer-events-none"></div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10" style={{ scrollbarWidth: 'thin', scrollbarColor: '#182030 #0A0A0A' }}>
          
          {/* ═══════════ POPÜLER SECTION ═══════════ */}
          {featuredMatches.length > 0 && (
            <div className="px-4 pt-4 pb-2">
              <div className="flex items-center gap-2 mb-4">
                <Flame className="w-5 h-5 text-[#3ab4f2] drop-shadow-[0_0_8px_rgba(58,180,242,0.5)]" />
                <span className="text-white font-bold text-[16px] tracking-wide">{language === 'tr' ? 'Popüler' : 'Popular'}</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-3">
                {featuredMatches.map(match => (
                  <div key={`pop-${match.id}`} className="bg-[#161e31] rounded-xl p-3.5 flex flex-col gap-2.5 border border-white/[0.03] hover:border-white/10 transition-all cursor-pointer relative overflow-hidden shadow-sm">
                    
                    {/* Top Bar: League & Star */}
                    <div className="flex items-center justify-between z-10">
                      <div className="flex items-center gap-1.5 text-[11px] text-[#99907c] font-medium tracking-wide">
                        <span className="opacity-80 grayscale">{getCountryFlag(match.country)}</span>
                        <span className="truncate max-w-[200px]">{match.league}</span>
                      </div>
                      <Star className="w-3.5 h-3.5 text-[#99907c] hover:text-[#e9c349] transition-colors cursor-pointer shrink-0" />
                    </div>
                    
                    {/* Status & Icons */}
                    <div className="flex items-center justify-between z-10">
                      <div className="flex items-center gap-2">
                        <span className={`text-[12px] font-bold ${match.isFinished ? 'text-[#99907c]' : (!match.isLive ? 'text-[#99907c]' : 'text-[#3ab4f2]')}`}>
                          {match.isFinished ? (language === 'tr' ? 'Bitti' : 'FT') : (match.minute === 'Yakında' ? 'Bugün, 22:00' : match.minute)}
                        </span>
                        {!match.isFinished && match.minute !== 'Yakında' && match.isLive && (
                           <div className="flex items-center gap-1.5">
                             <div className="w-4 h-3 bg-red-600 rounded-[3px] flex items-center justify-center shadow-sm">
                                <div className="w-0 h-0 border-t-[3px] border-t-transparent border-l-[4px] border-l-white border-b-[3px] border-b-transparent ml-0.5"></div>
                             </div>
                             <span className="text-[10px] bg-[#3ab4f2]/20 text-[#3ab4f2] px-1 rounded font-bold">P</span>
                             <Activity className="w-3.5 h-3.5 text-[#3ab4f2]" />
                           </div>
                        )}
                      </div>
                      {!match.isFinished && match.minute !== 'Yakında' && match.isLive && (
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_5px_rgba(239,68,68,0.8)]"></div>
                      )}
                    </div>
                    
                    {/* Teams & Scores */}
                    <div className="flex flex-col gap-2 mt-0.5 z-10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5 min-w-0 pr-3">
                          <img src={match.homeLogo} alt={match.home} className="w-5 h-5 rounded-full object-cover bg-white/[0.05] shrink-0" onError={(e) => { e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${match.home}&backgroundColor=161e31&textColor=e5e2e1`; }} />
                          <span className="text-[13px] text-white font-bold tracking-wide truncate">{match.home}</span>
                        </div>
                        {match.score !== '-' && (
                          <div className="w-6 h-6 rounded-md bg-[#1f2937] flex items-center justify-center text-[13px] text-white font-bold border border-white/[0.03] shrink-0">
                            {match.score.split(' - ')[0] || '0'}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5 min-w-0 pr-3">
                          <img src={match.awayLogo} alt={match.away} className="w-5 h-5 rounded-full object-cover bg-white/[0.05] shrink-0" onError={(e) => { e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${match.away}&backgroundColor=161e31&textColor=e5e2e1`; }} />
                          <span className="text-[13px] text-white font-bold tracking-wide truncate">{match.away}</span>
                        </div>
                        {match.score !== '-' && (
                          <div className="w-6 h-6 rounded-md bg-[#1f2937] flex items-center justify-center text-[13px] text-white font-bold border border-white/[0.03] shrink-0">
                            {match.score.split(' - ')[1] || '0'}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Odds Section */}
                    <div className="mt-1 flex flex-col gap-1.5 z-10">
                      <span className="text-[9px] text-[#99907c] font-medium tracking-wide">1x2</span>
                      <div className="flex items-center gap-1.5">
                        <button 
                          onClick={(e) => { e.stopPropagation(); toggleSelection(match, match.homeId, match.homeOdd, '1'); }}
                          className={`flex-1 flex items-center justify-between px-2.5 py-2 rounded-md transition-all group ${betSlip.some(s => s.id === match.homeId) ? 'bg-[#3ab4f2]/10 border border-[#3ab4f2]/30' : 'bg-[#1f2937] hover:bg-[#374151] border border-transparent'}`}
                        >
                          <span className="text-[10px] text-[#99907c] font-medium group-hover:text-white transition-colors">1</span>
                          <span className="text-[11.5px] text-white font-bold">{match.homeOdd}</span>
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); toggleSelection(match, match.drawId, match.drawOdd, 'X'); }}
                          className={`flex-1 flex items-center justify-between px-2.5 py-2 rounded-md transition-all group ${betSlip.some(s => s.id === match.drawId) ? 'bg-[#3ab4f2]/10 border border-[#3ab4f2]/30' : 'bg-[#1f2937] hover:bg-[#374151] border border-transparent'}`}
                        >
                          <span className="text-[10px] text-[#99907c] font-medium group-hover:text-white transition-colors">{language === 'tr' ? 'beraberlik' : 'draw'}</span>
                          <span className="text-[11.5px] text-white font-bold">{match.drawOdd}</span>
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); toggleSelection(match, match.awayId, match.awayOdd, '2'); }}
                          className={`flex-1 flex items-center justify-between px-2.5 py-2 rounded-md transition-all group ${betSlip.some(s => s.id === match.awayId) ? 'bg-[#3ab4f2]/10 border border-[#3ab4f2]/30' : 'bg-[#1f2937] hover:bg-[#374151] border border-transparent'}`}
                        >
                          <span className="text-[10px] text-[#99907c] font-medium group-hover:text-white transition-colors">2</span>
                          <span className="text-[11.5px] text-white font-bold">{match.awayOdd}</span>
                        </button>
                        <button className="w-8 h-[34px] shrink-0 bg-[#1f2937] hover:bg-[#374151] rounded-md flex items-center justify-center transition-colors">
                          <ChevronDown className="w-3.5 h-3.5 text-[#99907c]" />
                        </button>
                      </div>
                    </div>
                    
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══════════ CANLI SECTION HEADER ═══════════ */}
          <div className="px-4 pt-4 pb-2">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
              <span className="text-white font-bold text-[16px] tracking-wide">{language === 'tr' ? 'Canlı' : 'Live'}</span>
            </div>

            {/* Sport Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
              {sportsList.map(sport => {
                const count = getSportCount(sport);
                if (count === 0) return null;
                const isActive = activeSport === sport;
                return (
                  <button 
                    key={sport}
                    onClick={() => { setActiveSport(sport); setActiveCountry(null); }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap text-[12.5px] font-bold transition-all ${isActive ? 'bg-[#182030] text-white border border-[#36ffc4]/30 shadow-[0_0_15px_rgba(54,255,196,0.15)]' : 'bg-white/[0.02] border border-white/[0.05] text-[#99907c] hover:bg-white/[0.05] hover:text-white'}`}
                  >
                    <span className={isActive ? 'text-[#36ffc4]' : ''}>{getSportIcon(sport)}</span>
                    <span className="tracking-wide">{sport}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ═══════════ MATCHES LIST GROUPED BY LEAGUE ═══════════ */}
          <div className="px-4 pb-8">
            
            {isLoading && (
               <div className="text-center py-24 text-[#99907c] text-sm animate-pulse font-medium">
                  {language === 'tr' ? 'Canlı veriler yükleniyor...' : 'Loading live data...'}
               </div>
            )}
            {!isLoading && filteredMatches.length === 0 && (
               <div className="text-center py-24 text-[#99907c] text-sm font-medium">
                  {language === 'tr' ? 'Bu branşta aktif canlı maç yok.' : 'No live matches in this sport.'}
               </div>
            )}
            
            {!isLoading && sortedLeagues.map(league => {
              const leagueMatches = groupedByLeague[league];
              const firstMatch = leagueMatches[0];
              const flag = getCountryFlag(firstMatch.country);
              
              return (
                <div key={league} className="mb-6">
                  {/* League Header */}
                  <div className="flex items-center gap-3 py-3 px-4 bg-[#0B0F19] rounded-t-xl sticky top-0 z-20 backdrop-blur-md mb-2">
                    <span className="text-[18px] drop-shadow-md">{flag}</span>
                    <span className="text-[14px] text-slate-300 font-bold truncate flex-1 uppercase tracking-wide">{league}</span>
                    <Star className="w-4 h-4 text-slate-500 hover:text-[#e9c349] transition-colors cursor-pointer" />
                  </div>
                  
                  {/* Match Rows */}
                  <div className="flex flex-col gap-3">
                    {leagueMatches.map((match, idx) => (
                      <div 
                        key={match.id} 
                        className="flex flex-col md:flex-row md:items-center bg-[#151C2C] rounded-xl p-3 md:p-4 gap-3 md:gap-4 transition-all duration-300 border border-transparent md:hover:border-[#10b981]/50 md:hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] group relative"
                      >
                        {/* LEFT SECTION: Status */}
                        <div className="flex items-center md:flex-col md:justify-center gap-2 md:gap-1 shrink-0 md:w-[70px] border-b border-white/5 md:border-b-0 pb-2 md:pb-0 mb-1 md:mb-0">
                          <span className={`text-[12px] md:text-[11px] font-black tracking-wide ${match.isFinished ? 'text-slate-400' : 'text-[#36ffc4] drop-shadow-[0_0_5px_rgba(54,255,196,0.3)]'}`}>{match.minute}</span>
                          {!match.isFinished && (
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_5px_rgba(239,68,68,0.8)]"></div>
                          )}
                        </div>

                        {/* MIDDLE SECTION: Teams */}
                        <div className="flex-1 flex flex-col gap-2.5 min-w-0 pr-0 md:pr-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <img src={match.homeLogo} alt={match.home} className="w-5 h-5 md:w-6 md:h-6 rounded-full object-cover bg-white/5 shadow-sm" onError={(e) => { e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${match.home}&backgroundColor=0B0F19&textColor=ffffff`; }} />
                              <span className="text-[14px] md:text-[15px] font-semibold text-white truncate">{match.home}</span>
                            </div>
                            <span className="text-[14px] md:text-[15px] text-[#36ffc4] font-bold tabular-nums ml-2">{match.score.split(' - ')[0] || '-'}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <img src={match.awayLogo} alt={match.away} className="w-5 h-5 md:w-6 md:h-6 rounded-full object-cover bg-white/5 shadow-sm" onError={(e) => { e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${match.away}&backgroundColor=0B0F19&textColor=ffffff`; }} />
                              <span className="text-[14px] md:text-[15px] font-semibold text-white truncate">{match.away}</span>
                            </div>
                            <span className="text-[14px] md:text-[15px] text-[#36ffc4] font-bold tabular-nums ml-2">{match.score.split(' - ')[1] || '-'}</span>
                          </div>
                        </div>

                        {/* RIGHT SECTION: Odds */}
                        <div className="flex items-center justify-between md:justify-end gap-1.5 shrink-0 mt-2 md:mt-0 pt-3 md:pt-0 border-t border-white/5 md:border-t-0">
                          {['1', 'X', '2'].map((oddType) => {
                            const oddValue = oddType === '1' ? match.homeOdd : oddType === 'X' ? match.drawOdd : match.awayOdd;
                            const oddId = oddType === '1' ? match.homeId : oddType === 'X' ? match.drawId : match.awayId;
                            const isSelected = betSlip.some(s => s.id === oddId);
                            
                            return (
                              <button 
                                key={oddType}
                                onClick={(e) => { e.stopPropagation(); toggleSelection(match, oddId, oddValue, oddType); }}
                                className={`flex-1 md:flex-none md:w-[65px] min-h-[44px] rounded-lg flex flex-col items-center justify-center transition-all ${isSelected ? 'bg-[#10b981]/20 text-[#10b981] border border-[#10b981] shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-[#1e293b] hover:bg-[#334155] text-slate-300 hover:text-white border border-transparent md:hover:border-[#10b981]/30'}`}
                              >
                                <span className="text-[10px] text-slate-400 font-bold mb-0.5">{oddType}</span>
                                <span className="text-[13px] font-bold">{oddValue}</span>
                              </button>
                            );
                          })}
                          <button className="min-h-[44px] min-w-[44px] md:w-[44px] rounded-lg bg-[#1e293b] hover:bg-[#334155] transition-colors flex items-center justify-center text-[12px] text-slate-400 hover:text-white font-bold ml-1">
                            +{match.marketsCount}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>



        </div>
      </div>

      {/* ═══════════ RIGHT SIDEBAR - BET SLIP ═══════════ */}
      <div className={`bg-black/60 backdrop-blur-2xl flex flex-col flex-shrink-0 z-40 transition-all duration-300 border-l border-white/[0.05] ${isBetSlipOpen ? 'w-[320px]' : 'w-0 overflow-hidden'}`}>
        <div className="h-[70px] px-6 flex items-center justify-between bg-white/[0.02] border-b border-white/[0.05] min-w-[320px]">
          <div className="flex items-center gap-2.5">
            <Trophy className="w-4 h-4 text-[#e9c349]" />
            <span className="font-bold text-white text-[14px] tracking-widest uppercase">{language === 'tr' ? 'KUPON' : 'BET SLIP'}</span>
          </div>
          <button 
            onClick={() => setIsBetSlipOpen(false)}
            className="w-8 h-8 rounded-full bg-white/[0.05] border border-white/10 hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-[#99907c]" />
          </button>
        </div>
        
        <div className="flex-1 flex flex-col min-w-[320px]">
          {betSlip.length === 0 ? (
            <div className="flex-1 p-8 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-white/[0.02] border border-white/[0.05] flex items-center justify-center mb-5">
                <Trophy className="w-6 h-6 text-[#99907c] opacity-50" />
              </div>
              <h3 className="text-white/80 font-medium text-sm mb-2">{language === 'tr' ? 'Kuponunuz Boş' : 'Bet Slip is Empty'}</h3>
              <p className="text-[12px] text-[#99907c] leading-relaxed max-w-[200px]">
                {language === 'tr' ? 'Bahis yapmak için listeden dilediğiniz oranlara tıklayın.' : 'Click on odds to add selections.'}
              </p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {betSlip.map(selection => (
                  <div key={selection.id} className="bg-white/[0.02] rounded-xl p-4 border border-white/[0.05] relative group transition-colors hover:bg-white/[0.04]">
                    <button 
                      onClick={() => setBetSlip(prev => prev.filter(s => s.id !== selection.id))}
                      className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-[#99907c] hover:text-[#ffb4ab]"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <div className="text-[10px] text-[#99907c] mb-2 font-bold tracking-wider uppercase">{selection.marketName}</div>
                    <div className="flex justify-between items-center mb-1.5">
                      <div className="font-bold text-white text-[14px]">{selection.selectionName}</div>
                      <div className="font-black text-[#36ffc4] text-[15px]">{selection.odd.toFixed(2)}</div>
                    </div>
                    <div className="text-[12px] text-[#e5e2e1] opacity-70 font-medium truncate pr-4">{selection.matchName}</div>
                  </div>
                ))}
              </div>
              
              <div className="p-5 bg-black/40 border-t border-white/[0.05] shadow-[0_-20px_40px_rgba(0,0,0,0.3)] backdrop-blur-md">
                 <div className="flex justify-between items-center mb-5">
                    <span className="text-[11px] font-bold text-[#99907c] uppercase tracking-widest">{language === 'tr' ? 'Toplam Oran' : 'Total Odds'}</span>
                    <span className="font-black text-[#e9c349] text-2xl drop-shadow-[0_0_10px_rgba(233,195,73,0.3)]">
                      {betSlip.reduce((acc, curr) => acc * curr.odd, 1).toFixed(2)}
                    </span>
                 </div>
                 
                 <div className="relative mb-5">
                   <input 
                      type="number" 
                      value={betAmount}
                      onChange={(e) => setBetAmount(e.target.value)}
                      placeholder={language === 'tr' ? 'Miktar Giriniz' : 'Enter Amount'}
                      className="w-full bg-black/60 border border-white/10 rounded-lg py-3.5 px-4 text-white text-sm font-bold outline-none focus:border-[#e9c349]/50 focus:bg-black/80 transition-all placeholder:text-zinc-600"
                   />
                   <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 text-xs font-bold">TL</span>
                 </div>
                 
                 <div className="flex justify-between items-center mb-5 px-1">
                     <span className="text-[11px] font-bold text-[#99907c] uppercase tracking-widest">{language === 'tr' ? 'Olası Kazanç' : 'Potential Win'}</span>
                     <span className="font-bold text-white text-[15px]">
                       {betAmount ? (parseFloat(betAmount) * betSlip.reduce((acc, curr) => acc * curr.odd, 1)).toFixed(2) : '0.00'} TL
                     </span>
                 </div>

                 <button className="w-full bg-[#36ffc4] hover:bg-[#00e1ab] text-black font-black py-4 rounded-lg transition-transform active:scale-95 text-[13px] uppercase tracking-widest shadow-[0_0_20px_rgba(54,255,196,0.3)]">
                    {language === 'tr' ? 'BAHİS YAP' : 'PLACE BET'}
                 </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toggle Button for Bet Slip (Visible when closed) */}
      {!isBetSlipOpen && (
        <button 
          onClick={() => setIsBetSlipOpen(true)}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 border-white/[0.1] border border-r-0 p-3 rounded-l-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-all z-50 group hover:pr-4"
        >
          <div className="flex flex-col items-center gap-4">
            <Trophy className="w-5 h-5 text-[#e9c349] group-hover:scale-110 transition-transform drop-shadow-[0_0_5px_rgba(233,195,73,0.5)]" />
            <span className="text-[12px] font-bold text-[#e5e2e1] tracking-widest rotate-180 [writing-mode:vertical-rl]">{language === 'tr' ? 'KUPON' : 'SLIP'}</span>
            {betSlip.length > 0 && (
              <div className="w-5 h-5 rounded-full bg-[#36ffc4] text-black text-[10px] flex items-center justify-center font-black shadow-[0_0_10px_rgba(54,255,196,0.5)]">
                {betSlip.length}
              </div>
            )}
          </div>
        </button>
      )}

    </div>
  );
}