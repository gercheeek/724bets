import React, { useState, useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useBetting } from '../contexts/BettingContext';
import { 
  Activity, Target, Trophy, Clock, Gamepad2, Flame, Zap,
  ChevronLeft, ChevronRight, Star
} from 'lucide-react';
import { MatchInfo } from './sports/types';
import { calculateMarketCount } from '../utils/marketUtils';

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
  if (norm.includes('usa') || norm.includes('abd') || norm.includes('united states')) return lang === 'tr' ? 'ABD' : 'USA';
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
    'ABD': '🇺🇸', 'USA': '🇺🇸',
    'Uluslararası': '🌍', 'International': '🌍',
    'Uluslararası (Kulüpler)': '🌍', 'International Clubs': '🌍'
  };
  return flags[country] || '🌍';
};

export const UpcomingMatchesView: React.FC = () => {
  const { language } = useLanguage();
  const { events, betSelections, toggleBetSelection } = useBetting();
  
  const [activeSport, setActiveSport] = useState('Futbol');
  const [currentDate, setCurrentDate] = useState(new Date('2026-07-20T12:00:00'));

  // Parse all matches
  const matches = useMemo(() => {
    const parsedMatches: MatchInfo[] = [];
    events.forEach((ev: any) => {
      // Check if it's already a formatted pre-live match from BettingContext
      if (ev.isScraped && ev.league && ev.home) {
        parsedMatches.push(ev);
        return;
      }

      const data = ev.data;
      if (!data || !data.participants) return;
      
      const homeTeam = data.participants.home || 'Ev Sahibi';
      const awayTeam = data.participants.away || 'Deplasman';
      
      let isLive = data.status === 'in_progress' || data.is_live_betting === true;
      let minute = 'Yakında';
      
      let startTimestamp = 0;
      if (data.start_time && !isLive) {
          const date = new Date(data.start_time);
          startTimestamp = date.getTime();
          const day = date.getDate().toString().padStart(2, '0');
          const month = (date.getMonth() + 1).toString().padStart(2, '0');
          const year = date.getFullYear();
          const hours = date.getHours().toString().padStart(2, '0');
          const mins = date.getMinutes().toString().padStart(2, '0');
          minute = `${day}.${month}.${year} ${hours}:${mins}`;
      }

      const countryName = mapCountryName(data.country?.name, language);
      const tournamentName = data.tournament?.name || 'Turnuva';
      const league = countryName ? `${countryName} - ${tournamentName}` : tournamentName;
      const sport = mapSportName(data.sport?.name, language);
      
      let homeOdd = '-';
      let drawOdd = '-';
      let awayOdd = '-';
      
      const rawGroupMarkets = data.group_markets || ev.group_markets;
      const rawMarkets = rawGroupMarkets?.['full_event|0'] || rawGroupMarkets?.['game_full_event|0'];
      const markets = Array.isArray(rawMarkets) ? rawMarkets : [];
      
      for (const market of markets) {
         if (!market || typeof market !== 'string') continue;
         const is1x2 = market.includes('|12|') || market.includes('|1x2|') || market.includes('|match_winner|');
         if (is1x2 && (market.includes('~home~') || market.includes('~away~'))) {
            const parts = market.split('|');
            const selectionsPart = parts.find((p: string) => p.includes('~home~') || p.includes('~away~'));
            
            if (selectionsPart) {
               const selections = selectionsPart.split('!');
               selections.forEach((sel: string) => {
                  const sParts = sel.split('~');
                  if (sParts.length > 2) {
                    const type = sParts[1].toLowerCase();
                    const odd = parseFloat(sParts[2]);
                    if (!isNaN(odd)) {
                        const oddStr = odd.toFixed(2);
                        if (type === 'home' || type === '1') homeOdd = oddStr;
                        if (type === 'draw' || type === 'x') drawOdd = oddStr;
                        if (type === 'away' || type === '2') awayOdd = oddStr;
                    }
                  }
               });
               if (homeOdd !== '-' || awayOdd !== '-') break;
             }
          }
      }

      if (homeOdd === '-' && awayOdd === '-') return;

      const homeLogoUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${homeTeam}&backgroundColor=0f1422&textColor=e5e2e1`;
      const awayLogoUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${awayTeam}&backgroundColor=0f1422&textColor=e5e2e1`;

      parsedMatches.push({
        id: ev.id,
        home: homeTeam,
        away: awayTeam,
        isLive,
        isFinished: false,
        score: '-',
        minute,
        league,
        sport,
        country: countryName || '',
        homeOdd,
        drawOdd,
        awayOdd,
        homeId: `h_${ev.id}`,
        drawId: `d_${ev.id}`,
        awayId: `a_${ev.id}`,
        homeLogo: homeLogoUrl,
        awayLogo: awayLogoUrl,
        marketsCount: calculateMarketCount(ev),
        timestamp: startTimestamp || undefined
      });
    });
    // Return parsed matches loaded dynamically from contexts
    return parsedMatches;
  }, [events, language]);

  const sportsList = Array.from(new Set(matches.map(m => m.sport)));

  // Filter out already started matches and apply time filter
  const now = new Date().getTime();
  const [timeFilter, setTimeFilter] = useState<number | null>(null); // hours

  const upcomingMatches = matches.filter(m => {
    if (m.isLive || m.isFinished) return false;
    if (m.timestamp) {
       // Filter out if it has already started
       if (m.timestamp <= now) return false;
       
       // Apply time filter
       if (timeFilter !== null) {
          const maxTime = now + (timeFilter * 60 * 60 * 1000);
          if (m.timestamp > maxTime) return false;
       }
    }
    return true;
  });

  const filteredMatches = upcomingMatches
    .filter(m => m.sport === activeSport)
    .sort((a, b) => (a.timestamp || Number.MAX_SAFE_INTEGER) - (b.timestamp || Number.MAX_SAFE_INTEGER));

  const getSportIcon = (sportName: string) => {
    const name = sportName.toLowerCase();
    if (name.includes('futbol') || name.includes('soccer')) return <Activity className="w-5 h-5" />;
    if (name.includes('basketbol') || name.includes('basketball')) return <Target className="w-5 h-5" />;
    if (name.includes('tenis') || name.includes('tennis')) return <Trophy className="w-5 h-5" />;
    if (name.includes('voleybol') || name.includes('volleyball')) return <Clock className="w-5 h-5" />;
    if (name.includes('buz hokeyi') || name.includes('ice hockey')) return <Zap className="w-5 h-5" />;
    if (name.includes('e-spor') || name.includes('esports')) return <Gamepad2 className="w-5 h-5" />;
    if (name.includes('boks') || name.includes('boxing')) return <Flame className="w-5 h-5" />;
    return <Activity className="w-5 h-5" />;
  };

  const changeDate = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', options);
  };

  const timeFilters = [
    { label: '15 Dk', value: 0.25 },
    { label: '1 Saat', value: 1 },
    { label: '3 Saat', value: 3 },
    { label: '6 Saat', value: 6 },
    { label: '24 Saat', value: 24 },
    { label: '48 Saat', value: 48 },
    { label: '72 Saat', value: 72 },
    { label: 'Tümü', value: null }
  ];

  return (
    <div className="flex h-full w-full bg-transparent text-slate-400 font-sans overflow-hidden">
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto custom-scrollbar relative z-10" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>
        
        {/* Top Navbar */}
        <div className="sticky top-0 z-50 bg-[#18191c] border-b border-white/5 px-4 py-3 flex flex-col sm:flex-row items-center justify-between shadow-sm gap-3">
          <div className="flex items-center justify-between w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-sm bg-[#10b981]"></div>
              <h1 className="text-white font-bold text-[15px] tracking-wide">
                {language === 'tr' ? 'Yaklaşan Maçlar' : 'Upcoming Matches'}
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none pb-1 sm:pb-0">
            {timeFilters.map(tf => (
              <button 
                key={tf.label}
                onClick={() => setTimeFilter(tf.value)}
                className={`px-3 py-1.5 rounded-md text-[11px] font-bold tracking-wide whitespace-nowrap transition-colors ${timeFilter === tf.value ? 'bg-[#10b981] text-black shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}
              >
                {tf.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sports Navigation Tabs (Square design) */}
        <div className="px-4 py-4 border-b border-white/5 bg-transparent">
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
            {sportsList.map((sport) => {
               const isActive = activeSport === sport;
               return (
                 <button 
                   key={sport}
                   onClick={() => setActiveSport(sport)}
                   className={`flex flex-col items-center justify-center gap-1.5 min-w-[70px] h-[70px] rounded-lg transition-all ${
                     isActive 
                     ? 'bg-[#10b981] text-black shadow-md font-bold border-none' 
                     : 'bg-[#18191c] text-slate-400 hover:bg-white/[0.05] hover:text-gray-200 border border-white/5'
                   }`}
                 >
                   {getSportIcon(sport)}
                   <span className="text-[10px] font-bold tracking-wide uppercase">{sport}</span>
                 </button>
               )
            })}
          </div>
        </div>

        {/* Matches Flat List */}
        <div className="px-4 py-4 pb-12">
          
          {filteredMatches.length > 0 && (
             <div className="flex items-center justify-between px-2 mb-4">
               <div className="flex items-center gap-2">
                 <div className="text-[#10b981]">{getSportIcon(activeSport)}</div>
                 <span className="text-white font-bold text-[15px]">{activeSport}</span>
               </div>
               <span className="text-white font-bold text-[14px]">{filteredMatches.length} Maç</span>
             </div>
          )}

          {filteredMatches.length > 0 && (
              <div className="flex flex-col border border-white/5 rounded-xl overflow-hidden bg-[#18191c] shadow-xl">
                {filteredMatches.map((match, idx) => {
                  const isLast = idx === filteredMatches.length - 1;
                  const flag = getCountryFlag(match.country || '');
                  
                  const handleBetClick = (oddId: string, oddValue: string, selectionName: string) => {
                    if (!oddId || oddValue === '-') return;
                    // Pass to global context
                    toggleBetSelection({ id: match.id }, 'Maç Sonucu 1X2', selectionName, parseFloat(oddValue));
                  };

                  const isSelected = (id: string) => betSelections.some(s => s.id === id);

                  return (
                    <div 
                      key={match.id} 
                      className={`flex flex-col sm:flex-row sm:items-center px-3 py-3 hover:bg-[#10b981]/5 hover:shadow-[inset_2px_0_0_#10b981] transition-all duration-300 cursor-pointer ${!isLast ? 'border-b border-white/5' : ''}`}
                    >
                      {/* Left: Time and League info */}
                      <div className="flex items-center sm:w-[220px] shrink-0 mb-2 sm:mb-0">
                         <div className="flex flex-col w-[60px] shrink-0">
                            <span className="text-[10px] text-slate-500 font-medium tracking-wider">{match.minute.split(' ')[0]}</span>
                            <span className="text-[12px] text-[#10b981] font-bold tabular-nums">{match.minute.split(' ')[1] || match.minute}</span>
                         </div>
                         <div className="flex flex-col flex-1 pl-2 border-l border-white/5 min-w-0">
                            <div className="flex items-center gap-1.5">
                               <span className="text-[12px]">{flag}</span>
                               <span className="text-[10px] font-bold text-slate-400 truncate uppercase" title={match.league}>{match.league}</span>
                            </div>
                         </div>
                      </div>
                      
                      {/* Teams */}
                      <div className="flex-1 flex flex-col gap-1.5 min-w-0 pr-4 mt-1 sm:mt-0">
                         {match.away === '' ? (
                           <div className="flex items-center gap-2">
                             <span className="text-[13px] font-semibold text-white truncate">{match.home}</span>
                           </div>
                         ) : (
                           <>
                             <div className="flex items-center gap-2">
                               <img src={`/takimlogo/${match.home?.replace(/ /g, '_')}.png`} alt="" className="w-4 h-4 object-contain" onError={(e) => { e.currentTarget.src = match.homeLogo; }} />
                               <span className="text-[13px] font-semibold text-white truncate">{match.home}</span>
                             </div>
                             <div className="flex items-center gap-2">
                               <img src={`/takimlogo/${match.away?.replace(/ /g, '_')}.png`} alt="" className="w-4 h-4 object-contain" onError={(e) => { e.currentTarget.src = match.awayLogo; }} />
                               <span className="text-[13px] font-semibold text-white truncate">{match.away}</span>
                             </div>
                           </>
                         )}
                      </div>

                      {/* Star */}
                      <div className="w-[30px] flex justify-center shrink-0 hidden sm:flex">
                         <Star size={14} className="text-slate-600 hover:text-[#e3b341] cursor-pointer transition-colors" />
                      </div>

                      {/* Odds */}
                      <div className="flex gap-2 shrink-0 mt-3 sm:mt-0 justify-between sm:justify-start">
                        {match.away !== '' ? (
                          <>
                            {['1', 'X', '2'].map((oddType) => {
                              const oddValue = oddType === '1' ? match.homeOdd : oddType === 'X' ? match.drawOdd : match.awayOdd;
                              const oddId = oddType === '1' ? match.homeId : oddType === 'X' ? match.drawId : match.awayId;
                              
                              return (
                                <button 
                                  key={oddType}
                                  onClick={() => handleBetClick(oddId || '', oddValue, oddType)}
                                  className={`flex-1 sm:flex-none sm:w-[45px] h-[36px] sm:h-[32px] rounded border flex flex-col sm:flex-row items-center justify-center transition-colors ${isSelected(oddId || '') ? 'bg-[#10b981] text-black font-bold shadow-md border-none' : 'border-white/5 bg-[#25262b] text-white hover:bg-[#10b981]/10 hover:border-[#10b981]/50 hover:text-[#10b981] group/odd transition-all duration-300'}`}
                                >
                                  <span className="text-[11px] font-bold tabular-nums">{oddValue}</span>
                                </button>
                              );
                            })}
                          </>
                        ) : (
                          <div className="flex gap-2 opacity-0 select-none hidden sm:flex">
                            <div className="w-[45px] h-[32px]" />
                            <div className="w-[45px] h-[32px]" />
                            <div className="w-[45px] h-[32px]" />
                          </div>
                        )}

                        {/* More */}
                        <button className="w-[50px] h-[36px] sm:h-[32px] rounded border border-purple-500/30 bg-purple-500/10 flex items-center justify-center hover:bg-purple-500/20 hover:border-purple-500/50 transition-colors">
                          <span className="text-[10px] font-bold text-purple-400 tabular-nums">+{match.marketsCount}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
          )}
          
          {filteredMatches.length === 0 && (
             <div className="text-center py-20 text-slate-500 font-medium text-sm bg-[#18191c] rounded-xl border border-white/5">
                {language === 'tr' ? 'Seçilen zaman diliminde maç bulunmamaktadır.' : 'No upcoming matches found for this timeframe.'}
             </div>
          )}
        </div>
      </div>
    </div>
  );
};
