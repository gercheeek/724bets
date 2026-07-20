import React, { useState, useEffect, useRef } from 'react';
import { useBetting } from '../contexts/BettingContext';
import { useLanguage } from '../contexts/LanguageContext';
import { SportsHeroBanner } from './SportsHeroBanner';
import { AnimatedOdd } from './AnimatedOdd';
import Footer from './Footer';
import { ArrowRight, Trophy, Star, Bell, Clock, Search, ShieldCheck, Zap, Activity, Target, Gamepad2, Flame } from 'lucide-react';
import { SidebarMenu } from './sports/SidebarMenu';
import { DualRightPanel } from './sports/DualRightPanel';
import { MatchCard } from './sports/MatchCard';
import { useBetSlip } from '../contexts/BetSlipContext';
import { MatchInfo } from './sports/types';
import { MessageCircle } from 'lucide-react';

interface BetSelection {
  id: string;
  matchId: string;
  matchName: string;
  marketName: string;
  selectionName: string;
  odd: number;
}

interface Spor724ViewProps {
  onNavigate: (view: string) => void;
}

const getTeamColor = (teamName: string) => {
  const colors = [
    '#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e', '#10b981', 
    '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', 
    '#a855f7', '#d946ef', '#ec4899', '#f43f5e'
  ];
  let hash = 0;
  for (let i = 0; i < teamName.length; i++) {
    hash = teamName.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

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
  
  // Dual-mode panel toggled by a simple boolean or string on mobile, but since DualRightPanel handles it inside,
  // we just need to know if the sidebar wrapper itself is open on mobile.
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);
  
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1280) {
      setIsSidebarOpenMobile(false); // On desktop it's always open statically
    }

    const handleOpenMobileChat = () => {
      setIsSidebarOpenMobile(true);
      setTimeout(() => {
        window.dispatchEvent(new Event('setRightPanelToChat'));
      }, 50);
    };
    window.addEventListener('openMobileChatPanel', handleOpenMobileChat);
    return () => {
      window.removeEventListener('openMobileChatPanel', handleOpenMobileChat);
    };
  }, []);
  
  const { betSlip } = useBetSlip();
  
  const [matches, setMatches] = useState<MatchInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [goalScoredMatches, setGoalScoredMatches] = useState<string[]>([]);
  const { events } = useBetting();

  // Simulate goals for visual effect
  useEffect(() => {
    if (isLoading || matches.length === 0) return;
    
    const interval = setInterval(() => {
      const liveMatches = matches.filter(m => m.isLive && !m.isFinished);
      if (liveMatches.length > 0) {
        const randomMatch = liveMatches[Math.floor(Math.random() * liveMatches.length)];
        setGoalScoredMatches(prev => [...prev, randomMatch.id]);
        
        setTimeout(() => {
          setGoalScoredMatches(prev => prev.filter(id => id !== randomMatch.id));
        }, 4000);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [matches, isLoading]);

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
          score = String(data.current_score || '').replace(':', ' - ');
        }
      }
      if (isFinished) {
          minute = language === 'tr' ? 'Bitti' : 'FT';
      } else if (data.minute) {
          minute = `${data.minute}'`;
      } else if (data.extended_status) {
          minute = String(data.extended_status || '').replace('s', '. Set');
      }
      
      const homeTeamId = data.participants?.home_id || data.participants?.ByNumber?.['1']?.Id || '';
      const awayTeamId = data.participants?.away_id || data.participants?.ByNumber?.['2']?.Id || '';
      
      let homeLogoUrl = data.participants?.ByNumber?.['1']?.LogoPath || '';
      if (!homeLogoUrl && homeTeamId) {
        homeLogoUrl = `https://stb-images.betconstruct.com/team-logo/${homeTeamId}.png`;
      }
      
      let awayLogoUrl = data.participants?.ByNumber?.['2']?.LogoPath || '';
      if (!awayLogoUrl && awayTeamId) {
        awayLogoUrl = `https://stb-images.betconstruct.com/team-logo/${awayTeamId}.png`;
      }
      
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
      
      const rawGroupMarkets = data.group_markets || ev.group_markets;
      const rawMarkets = rawGroupMarkets?.['full_event|0'] || rawGroupMarkets?.['game_full_event|0'] || rawGroupMarkets?.['set|1'];
      const markets = Array.isArray(rawMarkets) ? rawMarkets : [];
      
      for (const market of markets) {
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
                        if (type === 'home' || type === '1') { homeOdd = oddStr; }
                        if (type === 'draw' || type === 'x') { drawOdd = oddStr; }
                        if (type === 'away' || type === '2') { awayOdd = oddStr; }
                    }
                  }
               });
               if (homeOdd !== '-' || awayOdd !== '-') {
                  break; // Found valid odds
               }
             }
          }
      } // CLOSE FOR LOOP

      if (homeOdd === '-' && awayOdd === '-') {
        return;
      }

      const matchObj: MatchInfo = {
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
      };

      // Filter out Virtual/Cyber/Simulated matches because user considers them fake/non-existent
      const isFakeMatch = 
        league.toLowerCase().includes('cyber') || 
        league.toLowerCase().includes('esoccer') ||
        league.toLowerCase().includes('simulated') ||
        league.toLowerCase().includes('srl') ||
        league.toLowerCase().includes('virtual') ||
        homeTeam.toLowerCase().includes('esports') ||
        sport.toLowerCase().includes('e-sports');
        
      // Also filter out any API matches that duplicate our premium mock matches
      const isDuplicateMock = 
        (homeTeam.toLowerCase().includes('spain') || homeTeam.toLowerCase().includes('ispanya') || homeTeam.toLowerCase().includes('arjantin') || homeTeam.toLowerCase().includes('argentina')) ||
        (homeTeam.toLowerCase().includes('france') || homeTeam.toLowerCase().includes('fransa') || homeTeam.toLowerCase().includes('portekiz') || homeTeam.toLowerCase().includes('portugal')) ||
        (homeTeam.toLowerCase().includes('england') || homeTeam.toLowerCase().includes('ingiltere') || homeTeam.toLowerCase().includes('brezilya') || homeTeam.toLowerCase().includes('brazil'));
        
      if (!isFakeMatch && !isDuplicateMock) {
         parsedMatches.push(matchObj);
      }
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

  const getSportBgImage = (sportName: string) => {
    const name = (sportName || '').toLowerCase();
    if (name.includes('basketbol') || name.includes('basketball')) return 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=800&auto=format&fit=crop';
    if (name.includes('tenis') || name.includes('tennis')) return 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=800&auto=format&fit=crop';
    if (name.includes('voleybol') || name.includes('volleyball')) return 'https://images.unsplash.com/photo-1592656094267-764a45160876?q=80&w=800&auto=format&fit=crop';
    if (name.includes('buz hokeyi') || name.includes('ice hockey')) return 'https://images.unsplash.com/photo-1515703407324-5f753eedf996?q=80&w=800&auto=format&fit=crop';
    if (name.includes('masa tenisi') || name.includes('table tennis')) return 'https://images.unsplash.com/photo-1534158914592-062992fbe900?q=80&w=800&auto=format&fit=crop';
    if (name.includes('e-spor') || name.includes('esports')) return 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop';
    if (name.includes('hentbol') || name.includes('handball')) return 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?q=80&w=800&auto=format&fit=crop';
    return 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=800&auto=format&fit=crop'; // Futbol fallback
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
    .filter(m => m.isLive)
    .sort((a, b) => {
       const pA = getLeaguePriority(a.league);
       const pB = getLeaguePriority(b.league);
       return pA - pB;
    })
    .slice(0, 6);

  return (
    <div className="flex h-full w-full bg-zinc-950 text-zinc-300 font-sans overflow-hidden">
      
      {/* ═══════════ MAIN CONTENT AREA ═══════════ */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10 bg-zinc-950">
        
        {/* Ambient Glow */}
        <div className="absolute top-[-200px] left-1/4 w-[600px] h-[600px] bg-emerald-500/[0.03] rounded-full blur-[120px] pointer-events-none"></div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10" style={{ scrollbarWidth: 'thin', scrollbarColor: '#27272a #09090b' }}>
          
          <SportsHeroBanner />

          {/* ═══════════ CANLI SECTION HEADER ═══════════ */}
          <div className="px-4 pt-4 pb-2">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
              <span className="text-zinc-100 font-bold text-[16px] tracking-wide">{language === 'tr' ? 'Canlı' : 'Live'}</span>
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
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap text-[12.5px] font-bold transition-all ${isActive ? 'bg-zinc-900 text-zinc-100 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]' : 'bg-zinc-900/50 border border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'}`}
                  >
                    <span className={isActive ? 'text-emerald-400' : ''}>{getSportIcon(sport)}</span>
                    <span className="tracking-wide">{sport}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ═══════════ CANLI MATCHES GRID ═══════════ */}
          <div className="px-4 pb-8">
            
            {isLoading && (
               <div className="text-center py-24 text-zinc-500 text-sm animate-pulse font-medium">
                  {language === 'tr' ? 'Canlı veriler yükleniyor...' : 'Loading live data...'}
               </div>
            )}
            {!isLoading && filteredMatches.length === 0 && (
               <div className="text-center py-24 text-zinc-500 text-sm font-medium">
                  {language === 'tr' ? 'Bu branşta aktif canlı maç yok.' : 'No live matches in this sport.'}
               </div>
            )}
            
            {!isLoading && sortedLeagues.map(league => {
              const leagueMatches = groupedByLeague[league] || [];
              const firstMatch = leagueMatches[0];
              const flag = getCountryFlag(firstMatch?.country || '');
              
              return (
                <div key={league} className="mb-5">
                  {/* League Header */}
                  <div className="flex items-center gap-3 py-2.5 px-4 bg-gradient-to-r from-zinc-900 to-zinc-900/40 mb-3 border-l-[3px] border-l-emerald-500 rounded-r-xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <span className="text-[16px] md:text-[18px] drop-shadow-md relative z-10">{flag}</span>
                    <span className="text-[11px] md:text-[12px] text-zinc-300 font-bold truncate flex-1 uppercase tracking-widest relative z-10">{league}</span>
                    <Star className="w-4 h-4 text-zinc-600 hover:text-yellow-500 transition-all cursor-pointer relative z-10 hover:scale-110 drop-shadow-sm" />
                  </div>
                  
                  {/* Match Rows */}
                  <div className="flex flex-col gap-2">
                    {leagueMatches.map((match) => (
                      <MatchCard 
                        key={match.id}
                        match={match}
                        isGoal={goalScoredMatches.includes(match.id)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <Footer />
        </div>
      </div>

      {/* ═══════════ DYNAMIC RIGHT PANEL ═══════════ */}
      <DualRightPanel 
        popularMatches={featuredMatches}
        language={language}
        isOpenMobile={isSidebarOpenMobile}
        onCloseMobile={() => setIsSidebarOpenMobile(false)}
      />
      
      {/* ═══════════ SMART FLOATING ACTION BUTTON (REMOVED) ═══════════ */}
      {/* 
        The floating action button has been removed. 
        Toggle is now managed within the DualRightPanel's sticky bottom bar.
      */}

    </div>
  );
}