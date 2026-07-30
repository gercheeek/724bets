import React, { useState, useEffect } from 'react';
import { MatchInfo } from './types';
import { MatchCard } from './MatchCard';
import { TrendingUp, ChevronDown, ChevronUp, Monitor, Filter } from 'lucide-react';

interface PopularEventsAccordionProps {
  matches: MatchInfo[];
  onSelectMatch?: (match: MatchInfo) => void;
}

const LOCAL_LEAGUE_LOGOS: Record<string, string> = {
  'şampiyonlar ligi': '/assets/leagues/champions-league.png',
  'champions league': '/assets/leagues/champions-league.png',
  'avrupa ligi': '/assets/leagues/europa-league.png',
  'europa league': '/assets/leagues/europa-league.png',
  'konferans ligi': '/assets/leagues/conference-league.png',
  'conference league': '/assets/leagues/conference-league.png',
  'italya - serie a': '/assets/leagues/serie-a-italy.png',
  'almanya - bundesliga': '/assets/leagues/bundesliga.png',
  'ingiltere - premier lig': '/assets/leagues/premier-league.png',
  'premier league': '/assets/leagues/premier-league.png',
  'ispanya - la liga': '/assets/leagues/la-liga.png',
  'la liga': '/assets/leagues/la-liga.png',
  'fransa - ligue 1': '/assets/leagues/ligue-1.webp',
  'lig 1': '/assets/leagues/ligue-1.webp',
  'türkiye - süper lig': '/assets/leagues/super-lig.webp',
  'ekvador - serie a': '/assets/leagues/serie-a-ecuador.png',
  'avusturya - bundesliga': '/assets/leagues/bundesliga-austria.png',
  'brezilya - serie a': '/assets/leagues/serie-a-brazil.png',
  'çin - süper lig': '/assets/leagues/csl-china.webp',
  'copa sudamericana': '/assets/leagues/copa-sudamericana.png',
  'copa libertadores': '/assets/leagues/copa-libertadores.png',
  'liga profesional': '/assets/leagues/liga-profesional-argentina.png',
  'arjantin - primera nacional': '/assets/leagues/primera-nacional-argentina.webp',
  'şili - primera division': '/assets/leagues/primera-chile.png',
  'primera a': '/assets/leagues/primera-a-colombia.png',
  'çek cumh. - 1. liga': '/assets/leagues/czech-liga.webp',
  'danimarka - superliga': '/assets/leagues/denmark-superliga.png',
  'finlandiya - veikkausliiga': '/assets/leagues/finland-veikkausliiga.webp',
  'irlanda - 1. division': '/assets/leagues/ireland-1st-div.webp',
  '1. division': '/assets/leagues/ireland-1st-div.webp',
  'rugby ligi': '/assets/leagues/nrl.png',
  'nrl': '/assets/leagues/nrl.png',
  'altyapı ligi': '/assets/leagues/argentina-reserves.webp',
  'pro ligi': '/assets/leagues/belgium-pro.png',
  'hnl': '/assets/leagues/croatia-hnl.png',
  '1win essence': '/assets/leagues/club-friendlies.png',
  'dostluk maçları': '/assets/leagues/club-friendlies.png'
};

const LeagueLogo: React.FC<{ league: string; className?: string }> = ({ league, className }) => {
  const [imgUrl, setImgUrl] = useState<string>('');

  // Synchronously compute static/local logos to prevent layout shift/flashing
  const getInitialLogo = () => {
    if (league.includes('TÜRK TAKIMLARI')) {
      return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><rect width="1200" height="800" fill="%23E30A17" rx="100"/><circle cx="425" cy="400" r="200" fill="%23FFFFFF"/><circle cx="475" cy="400" r="160" fill="%23E30A17"/><polygon points="760,400 642,438 678,323 583,406 700,466" fill="%23FFFFFF"/></svg>';
    }
    if (league.includes('DÜNYA KULÜPLER')) {
      return '/assets/leagues/club-friendlies.png';
    }
    const normalizedName = league.toLocaleLowerCase('tr-TR').trim();
    for (const [key, path] of Object.entries(LOCAL_LEAGUE_LOGOS)) {
       if (normalizedName.includes(key.toLocaleLowerCase('tr-TR'))) {
           return path;
       }
    }
    return null;
  };

  const initialLogo = getInitialLogo();

  useEffect(() => {
    let mounted = true;
    
    if (initialLogo) {
        setImgUrl(initialLogo);
        return;
    }

    // Fallback to backend API
    const fetchLogo = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/league-logo?league=${encodeURIComponent(league)}`);
        const data = await res.json();
        if (mounted && data.success && data.url) {
          let finalUrl = data.url;
          if (finalUrl.startsWith('/uploads/')) {
            finalUrl = `http://localhost:4000${finalUrl}`;
          }
          setImgUrl(finalUrl);
        } else if (mounted) {
          setImgUrl('/default-league.svg');
        }
      } catch (err) {
        if (mounted) setImgUrl('/default-league.svg');
      }
    };
    fetchLogo();
    return () => { mounted = false; };
  }, [league, initialLogo]);

  const displayUrl = imgUrl || initialLogo;

  if (!displayUrl) return <div className={`${className || 'w-8 h-8'} rounded-full bg-white/5 animate-pulse shrink-0`} />;
  return (
    <img 
      src={displayUrl} 
      alt={league} 
      className={className || "w-8 h-8 object-contain shrink-0"} 
      style={{ filter: 'drop-shadow(0 0 1px rgba(255,255,255,0.8)) drop-shadow(0 0 3px rgba(255,255,255,0.4))' }}
      onError={(e) => {
        (e.target as HTMLImageElement).src = '/default-league.svg';
      }} 
    />
  );
};

export const PopularEventsAccordion: React.FC<PopularEventsAccordionProps> = ({ matches, onSelectMatch }) => {
  const [expandedLeagues, setExpandedLeagues] = useState<Record<string, boolean>>({});
  const [visibleLeagues, setVisibleLeagues] = useState(5);

  const toggleLeague = (league: string) => {
    setExpandedLeagues(prev => ({
      ...prev,
      [league]: !prev[league]
    }));
  };

  const groupedByLeague: Record<string, MatchInfo[]> = {};
  const turkishTeams = [
    'fenerbahçe', 'galatasaray', 'beşiktaş', 'trabzonspor', 'bursaspor', 'mke ankaragücü', 'gençlerbirliği', 'altay', 'samsunspor', 'gaziantepspor', 'eskişehirspor', 'göztepe', 'antalyaspor', 'konyaspor', 'istanbul başakşehir', 'başakşehir', 'istanbulspor', 'çaykur rizespor', 'rizespor', 'kasımpaşa', 'sivasspor', 'kayserispor', 'kocaelispor', 'denizlispor', 'adanaspor', 'boluspor', 'adana demirspor', 'karşıyaka', 'vefa', 'sarıyer', 'zonguldak kömürspor', 'mersin idman yurdu', 'malatyaspor', 'ankara demirspor', 'giresunspor', 'orduspor', 'izmirspor', 'diyarbakırspor', 'altınordu', 'kardemir karabükspor', 'feriköy', 'alanyaspor', 'alanya', 'beykoz', 'akhisarspor', 'ankaraspor', 'fatih karagümrük', 'karagümrük', 'türk telekomspor', 'hatayspor', 'yeni malatyaspor', 'zeytinburnuspor', 'kayseri erciyesspor', 'vanspor', 'sakaryaspor', 'şekerspor', 'hacettepe', 'pendikspor', 'bandırmaspor', 'kırıkkalespor', 'bucaspor', 'erzurumspor', 'yozgatspor', 'manisaspor', 'aydınspor', 'bakırköyspor', 'balıkesirspor', 'ümraniyespor', 'elazığspor', 'çanakkale dardanelspor', 'şanlıurfaspor', 'büyükşehir belediye erzurumspor', 'çorum fk', 'çorum', 'eyüpspor', 'ankara keçiörengücü', 'keçiörengücü', 'manisa fk', 'tuzlaspor', 'bodrum fk', 'bodrum', 'menemen fk', 'tarsus idman yurdu', 'iskenderunspor', 'kastamonuspor', '24 erzincanspor', 'amed sportif faaliyetler', 'amed', 'batman petrolspor', 'ispartaspor', 'afyonspor', 'uşakspor', 'fethiyespor', 'inegölspor', 'karaman fk', 'somaspor', 'kırklarelispor', 'kahramanmaraşspor', 'gümüşhanespor', 'turgutluspor', 'darıca gençlerbirliği', 'pazarspor', 'kırşehir belediyespor', 'gaziosmanpaşaspor', 'kartalspor', 'etimesgut belediyespor', 'serik belediyespor', '1461 trabzon', 'milli takım', 'turkey', 'türkiye'
  ];
  
  matches.forEach(match => {
    const t1 = (match.home || '').toLocaleLowerCase('tr-TR');
    const t2 = (match.away || '').toLocaleLowerCase('tr-TR');
    
    // Check if it's a Turkish team match
    const isTurkishTeam = turkishTeams.some(team => t1.includes(team) || t2.includes(team));
    
    let targetLeague = match.league;
    
    if (isTurkishTeam) {
       targetLeague = '🇹🇷 TÜRK TAKIMLARI ÖZEL';
    } else {
       const lName = match.league.toLocaleLowerCase('tr-TR');
       if (lName.includes('dostluk') || lName.includes('friendly') || lName.includes('hazırlık') || lName.includes('1win')) {
           targetLeague = '🌍 DÜNYA KULÜPLER DOSTLUK MAÇLARI';
       }
    }
    
    if (!groupedByLeague[targetLeague]) {
      groupedByLeague[targetLeague] = [];
    }
    groupedByLeague[targetLeague].push(match);
  });

  // Sort leagues by priority
  const getLeaguePriority = (name: string) => {
    const l = name.toLocaleLowerCase('tr-TR');
    
    // First, immediately demote lower divisions, youth, and women's leagues
    const lowPriorities = [
      '2. lig', '3. lig', 'division 2', 'division 3', 'league 2', 'league 3',
      'kadınlar', 'women', 'rezerv', 'reserves', 'u21', 'u19', 'u20'
    ];
    
    for (let i = 0; i < lowPriorities.length; i++) {
      if (l.includes(lowPriorities[i])) return 100 + i;
    }
    
    const priorities = [
      'şampiyonlar ligi', 'champions league', 
      'avrupa ligi', 'europa league', 
      'konferans ligi', 'conference league', 
      'dünya kulüpler dostluk', 'dostluk maçları', 'club friendlies', 'friendlies', 'hazırlık', 'club friendly games',
      'süper lig', 'super lig',
      'premier league', 'premier lig', 'la liga', 'serie a', 'bundesliga', 'ligue 1', 
      'nba', 'euroleague', 'nfl', 'nhl', 'mlb', 'atp', 'wta'
    ];
    
    for (let i = 0; i < priorities.length; i++) {
      if (l.includes(priorities[i])) {
        // Strict Turkish Super Lig matching
        if (priorities[i] === 'süper lig' || priorities[i] === 'super lig') {
          if (!l.includes('türkiye') && !l.includes('turkey')) {
            continue; // Not Turkish Super Lig (e.g. Uzbekistan Super Lig), skip this high priority
          }
        }
        return i;
      }
    }
    
    return 50;
  };

  const getLeagueTheme = (name: string, isTennis?: boolean) => {
    const l = name.toLocaleLowerCase('tr-TR');
    
    if (isTennis) {
      return {
          bgGlow: 'bg-[#10b981]/10',
          radialGlow: 'from-[#10b981]/20',
          accentBorder: 'border-l-[#10b981]',
          accentShadow: 'shadow-[0_0_20px_rgba(16,185,129,0.3)]',
          textColor: 'text-white', 
          statColor: 'text-[#10b981]',
          iconBg: 'bg-[#10b981]/10 border-[#10b981]/20',
          isTurkish: false,
          bgImage: ''
      };
    }
    
    // Default Theme (Standard Leagues)
    const baseTheme = { 
        bgGlow: 'bg-[#00E5FF]/5',
        radialGlow: 'from-[#00E5FF]/20',
        accentBorder: 'border-l-[#00E5FF]',
        accentShadow: 'shadow-[0_0_20px_rgba(0,229,255,0.2)]',
        textColor: 'text-white', 
        statColor: 'text-[#00E5FF]',
        iconBg: 'bg-[#00E5FF]/10 border-[#00E5FF]/20',
        hexColor: '#00E5FF',
        isTurkish: false,
        bgImage: ''
    };
    
    if (l.includes('türk takımları')) {
      return { 
          bgGlow: 'bg-red-900/10',
          radialGlow: 'from-red-600/30',
          accentBorder: 'border-l-red-500',
          accentShadow: 'shadow-[0_0_25px_rgba(239,68,68,0.4)]',
          textColor: 'text-white', 
          statColor: 'text-red-400',
          iconBg: 'bg-red-500/10 border-red-500/20',
          hexColor: '#EF4444',
          isTurkish: true,
          bgImage: ''
      };
    }
    if (l.includes('şampiyonlar ligi') || l.includes('champions league')) {
      return { 
          bgGlow: 'bg-blue-900/10',
          radialGlow: 'from-blue-500/30',
          accentBorder: 'border-l-blue-400',
          accentShadow: 'shadow-[0_0_25px_rgba(96,165,250,0.4)]',
          textColor: 'text-white', 
          statColor: 'text-blue-300',
          iconBg: 'bg-blue-500/10 border-blue-500/20',
          hexColor: '#60A5FA',
          isTurkish: false,
          bgImage: '/assets/leagues/champions-league-bg.jpg'
      };
    }
    if (l.includes('avrupa ligi') || l.includes('europa league')) {
      return { 
          bgGlow: 'bg-orange-900/10',
          radialGlow: 'from-orange-500/30',
          accentBorder: 'border-l-orange-500',
          accentShadow: 'shadow-[0_0_25px_rgba(249,115,22,0.4)]',
          textColor: 'text-white', 
          statColor: 'text-orange-400',
          iconBg: 'bg-orange-500/10 border-orange-500/20',
          hexColor: '#F97316',
          isTurkish: false,
          bgImage: '/assets/leagues/europa-league-bg.jpg'
      };
    }
    if (l.includes('konferans ligi') || l.includes('conference league')) {
      return { 
          bgGlow: 'bg-green-900/10',
          radialGlow: 'from-green-500/30',
          accentBorder: 'border-l-green-500',
          accentShadow: 'shadow-[0_0_25px_rgba(34,197,94,0.4)]',
          textColor: 'text-white', 
          statColor: 'text-green-400',
          iconBg: 'bg-green-500/10 border-green-500/20',
          hexColor: '#22C55E',
          isTurkish: false,
          bgImage: '/assets/leagues/conference-league-bg.jpg'
      };
    }
    if (l.includes('dostluk maçları') || l.includes('friendlies') || l.includes('friendly')) {
      return { 
          bgGlow: 'bg-indigo-900/10',
          radialGlow: 'from-indigo-500/30',
          accentBorder: 'border-l-indigo-400',
          accentShadow: 'shadow-[0_0_25px_rgba(129,140,248,0.4)]',
          textColor: 'text-white', 
          statColor: 'text-indigo-300',
          iconBg: 'bg-indigo-500/10 border-indigo-500/20',
          hexColor: '#818CF8',
          isTurkish: false,
          bgImage: ''
      };
    }
    
    return baseTheme;
  };

  const sortedLeagues = Object.keys(groupedByLeague).sort((a, b) => {
    const pA = getLeaguePriority(a);
    const pB = getLeaguePriority(b);
    if (pA !== pB) return pA - pB;
    // Secondary sort by number of matches
    return groupedByLeague[b].length - groupedByLeague[a].length;
  });

  if (matches.length === 0) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="w-full h-[64px] rounded-xl bg-[#0b0e14]/60 border border-white/[0.04] animate-pulse flex items-center px-4 gap-4">
            <div className="w-12 h-12 rounded-full bg-white/5 shrink-0"></div>
            <div className="flex flex-col gap-2 flex-1">
              <div className="w-32 h-4 bg-white/5 rounded"></div>
              <div className="w-24 h-3 bg-white/5 rounded"></div>
            </div>
            <div className="w-16 h-6 bg-white/5 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Header Controls */}
      <div className="flex flex-row items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-300" />
          <h2 className="text-white font-bold text-base sm:text-lg whitespace-nowrap">Popüler Etkinlikler</h2>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4 text-sm ml-auto">
          <div className="hidden sm:flex items-center gap-2">
            <Monitor className="w-4 h-4 text-zinc-400" />
            <span className="text-zinc-300 font-semibold">Görüntüle</span>
            <div className="bg-[#1e2330] border border-white/5 text-zinc-400 rounded px-2 py-1 flex items-center gap-1 text-xs font-semibold cursor-pointer">
              Standart
              <ChevronDown className="w-3 h-3" />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-zinc-400" />
            <span className="text-zinc-300 font-semibold hidden sm:inline">Bahis Seçenekleri</span>
            <div className="bg-[#1e2330] border border-white/5 text-zinc-400 rounded px-2 py-1 flex items-center gap-1 text-xs font-semibold cursor-pointer">
              Kazanan
              <ChevronDown className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>

      {/* League Accordion List */}
      <div className="flex flex-col gap-2">
        {sortedLeagues.slice(0, visibleLeagues).map((league) => {
          const leagueMatches = groupedByLeague[league];
          const firstMatch = leagueMatches[0];
          const isTennis = firstMatch?.sport?.toLowerCase().includes('tenis') || firstMatch?.sport?.toLowerCase().includes('tennis');
          const isExpanded = !!expandedLeagues[league];
          const theme = getLeagueTheme(league, isTennis);
          
          return (
            <div key={league} className={`group bg-gradient-to-r from-[#181a25] to-[#12141d] hover:from-[#1d202e] hover:to-[#151824] rounded-xl overflow-hidden border border-white/5 border-l-[4px] ${theme.accentBorder} relative mt-3 shadow-lg`}>
              <button 
                onClick={() => toggleLeague(league)}
                className={`w-full flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 relative text-left bg-transparent group`}
              >
                {/* Custom Cinematic Background Image */}
                {(theme as any).bgImage && (
                  <div 
                    className="absolute inset-0 pointer-events-none opacity-80 group-hover:opacity-100 transition-all duration-700 z-0 bg-cover bg-right bg-no-repeat"
                    style={{ 
                      backgroundImage: `url(${(theme as any).bgImage})`,
                      maskImage: 'linear-gradient(to right, transparent 0%, transparent 60%, black 100%)',
                      WebkitMaskImage: 'linear-gradient(to right, transparent 0%, transparent 60%, black 100%)'
                    }} 
                  />
                )}
                
                {/* Content */}
                <div className="flex items-center gap-4 sm:gap-5 relative z-10 pl-1 flex-1 min-w-0">
                  {/* Clean League Logo - White Background for High Contrast */}
                  <div className="relative flex h-14 w-14 sm:h-[60px] sm:w-[60px] items-center justify-center rounded-2xl shrink-0 z-10 bg-white/95 border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                    {isTennis ? (
                       <span className="text-3xl relative z-10">🎾</span>
                    ) : (
                       <LeagueLogo league={league} className="w-10 h-10 sm:w-11 sm:h-11 object-contain relative z-10" />
                    )}
                  </div>
                  
                  <div className="flex flex-col items-start text-left min-w-0 flex-1 pr-4">
                    <span className="text-white font-extrabold text-[15px] sm:text-[17px] tracking-wide uppercase truncate w-full drop-shadow-sm" title={league}>
                      {league}
                    </span>
                    <span className="text-[#a1a1aa] text-[11px] sm:text-[12px] font-semibold tracking-widest uppercase mt-1">
                      Öne Çıkan Turnuva
                    </span>
                  </div>
                </div>
                
                {/* Right controls */}
                <div className="flex items-center gap-3 sm:gap-5 relative z-10">
                  <div className="hidden sm:flex flex-col items-end mr-2">
                     <span className="text-zinc-500 text-[10px] font-bold tracking-widest uppercase">Aktif</span>
                     <span className="text-white text-[13px] font-black tracking-wide">{leagueMatches.length} MAÇ</span>
                  </div>
                  <span className="sm:hidden bg-[#222736] border border-white/10 text-white text-[11px] font-black px-3 py-1.5 rounded-lg tracking-widest shadow-sm">
                    {leagueMatches.length} MAÇ
                  </span>
                  
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors backdrop-blur-sm shadow-sm">
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-white" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-white" />
                    )}
                  </div>
                </div>
              </button>
              
              {isExpanded && (
                <div className="px-3 pb-3 pt-1 grid grid-cols-1 lg:grid-cols-2 gap-3 bg-[#0A0D14]">
                  {[...leagueMatches].sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0)).map(match => (
                    <MatchCard 
                      key={match.id} 
                      match={match} 
                      isGoal={false} 
                      onSelect={onSelectMatch}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {visibleLeagues < sortedLeagues.length && (
        <button 
            onClick={() => setVisibleLeagues(prev => prev + 10)}
            className="w-full py-4 mt-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-bold transition-colors"
        >
            Daha Fazla Göster
        </button>
      )}
    </div>
  );
};
