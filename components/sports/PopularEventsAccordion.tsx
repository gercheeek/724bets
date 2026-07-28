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
  'fransa - ligue 1': '/assets/leagues/ligue-1.png',
  'lig 1': '/assets/leagues/ligue-1.png',
  'türkiye - süper lig': '/assets/leagues/super-lig.png',
  'ekvador - serie a': '/assets/leagues/serie-a-ecuador.png',
  'avusturya - bundesliga': '/assets/leagues/bundesliga-austria.png',
  'brezilya - serie a': '/assets/leagues/serie-a-brazil.png',
  'çin - süper lig': '/assets/leagues/csl-china.png',
  'copa sudamericana': '/assets/leagues/copa-sudamericana.png',
  'copa libertadores': '/assets/leagues/copa-libertadores.png',
  'liga profesional': '/assets/leagues/liga-profesional-argentina.png',
  'arjantin - primera nacional': '/assets/leagues/primera-nacional-argentina.png',
  'şili - primera division': '/assets/leagues/primera-chile.png',
  'primera a': '/assets/leagues/primera-a-colombia.png',
  'çek cumh. - 1. liga': '/assets/leagues/czech-liga.png',
  'danimarka - superliga': '/assets/leagues/denmark-superliga.png',
  'finlandiya - veikkausliiga': '/assets/leagues/finland-veikkausliiga.png',
  'irlanda - 1. division': '/assets/leagues/ireland-1st-div.png',
  '1. division': '/assets/leagues/ireland-1st-div.png',
  'rugby ligi': '/assets/leagues/nrl.png',
  'nrl': '/assets/leagues/nrl.png',
  'altyapı ligi': '/assets/leagues/argentina-reserves.png',
  'pro ligi': '/assets/leagues/belgium-pro.png',
  'hnl': '/assets/leagues/croatia-hnl.png',
  '1win essence': '/assets/leagues/club-friendlies.png',
  'dostluk maçları': '/assets/leagues/club-friendlies.png'
};

const LeagueLogo: React.FC<{ league: string; className?: string }> = ({ league, className }) => {
  const [imgUrl, setImgUrl] = useState<string>('');

  useEffect(() => {
    let mounted = true;
    
    if (league.includes('TÜRK TAKIMLARI')) {
      setImgUrl('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><rect width="1200" height="800" fill="%23E30A17" rx="100"/><circle cx="425" cy="400" r="200" fill="%23FFFFFF"/><circle cx="475" cy="400" r="160" fill="%23E30A17"/><polygon points="760,400 642,438 678,323 583,406 700,466" fill="%23FFFFFF"/></svg>');
      return;
    }
    
    if (league.includes('DÜNYA KULÜPLER')) {
      setImgUrl('/assets/leagues/club-friendlies.png');
      return;
    }

    const normalizedName = league.toLocaleLowerCase('tr-TR').trim();
    let matchedLogo = null;
    
    // First try exact or partial match from our local HD list
    for (const [key, path] of Object.entries(LOCAL_LEAGUE_LOGOS)) {
       if (normalizedName.includes(key.toLocaleLowerCase('tr-TR'))) {
           matchedLogo = path;
           break;
       }
    }
    
    if (matchedLogo) {
        setImgUrl(matchedLogo);
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
  }, [league]);

  if (!imgUrl) return <div className={`${className || 'w-8 h-8'} rounded-full bg-white/5 animate-pulse shrink-0`} />;
  return (
    <img 
      src={imgUrl} 
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
    const t1 = (match.home || match.team1_name || '').toLocaleLowerCase('tr-TR');
    const t2 = (match.away || match.team2_name || '').toLocaleLowerCase('tr-TR');
    
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
      'türk takımları özel', // Virtual top priority league
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

  const getLeagueTheme = (name: string) => {
    const l = name.toLocaleLowerCase('tr-TR');
    const baseTheme = { gradient: 'from-white/60 via-[#00E5FF]/30 to-transparent', accent: 'bg-[#00E5FF]', textColor: 'text-white' };
    
    if (l.includes('türk takımları')) {
      return { ...baseTheme, isTurkish: true, gradient: 'from-white/60 via-red-500/30 to-transparent', accent: 'bg-red-500' };
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

  if (matches.length === 0) return null;

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
          const isExpanded = !!expandedLeagues[league];
          const theme = getLeagueTheme(league);
          
          return (
            <div key={league} className="group bg-[#0b0e14]/80 backdrop-blur-md rounded-xl rounded-bl-sm overflow-hidden transition-all duration-500 shadow-xl hover:shadow-[0_8px_30px_rgba(0,0,0,0.6)] border border-white/[0.04] border-l-[3px] border-l-transparent hover:border-l-[#00E5FF] relative mt-2">
              <button 
                onClick={() => toggleLeague(league)}
                className={`w-full flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 relative overflow-hidden transition-all text-left bg-transparent group`}
              >
                {/* Advanced Ambient Radial Glow & Background Texture (Toned Down) */}
                <div className={`absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-700 bg-[radial-gradient(ellipse_at_left,_var(--tw-gradient-stops))] from-white/10 via-[#0d1017] to-[#0d1017] pointer-events-none`} />
                
                {/* White to Blue (Cyan) Gradient behind the Logo */}
                <div className={`absolute left-0 top-0 bottom-0 w-[300px] opacity-40 group-hover:opacity-60 transition-opacity duration-700 bg-gradient-to-r ${theme.gradient} pointer-events-none`} style={{ maskImage: 'linear-gradient(to right, black 20%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to right, black 20%, transparent 100%)' }} />
                
                {/* Secondary Blend Layer for Color Vibrancy */}
                <div className={`absolute left-0 top-0 bottom-0 w-[200px] opacity-30 group-hover:opacity-50 transition-opacity duration-700 bg-gradient-to-r ${theme.gradient} pointer-events-none mix-blend-overlay`} />
                
                {/* Turkish Flag Watermark (Only for Turkish Teams) */}
                {(theme as any).isTurkish && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-72 h-72 opacity-[0.07] group-hover:opacity-[0.15] group-hover:scale-105 transition-all duration-700 pointer-events-none overflow-hidden flex items-center justify-end pr-8">
                    <svg viewBox="0 0 1200 800" className="w-full h-full fill-white mix-blend-overlay">
                      <circle cx="425" cy="400" r="200" fill="white"/>
                      <circle cx="475" cy="400" r="160" fill="black" style={{ mixBlendMode: 'destination-out' }}/>
                      <polygon points="760,400 642,438 678,323 583,406 700,466" fill="white"/>
                    </svg>
                  </div>
                )}
                
                {/* Scattered Watermark Logos (Brand Color Tinted & Toned Down) */}
                {!(theme as any).isTurkish && (
                  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-700 mix-blend-screen" style={{ filter: 'grayscale(100%) sepia(100%) hue-rotate(185deg) saturate(300%) brightness(0.8)' }}>
                     {/* Scattered logos */}
                     <div className="absolute -right-10 top-1/2 -translate-y-1/2 w-64 h-64 group-hover:-translate-x-6 group-hover:rotate-12 transition-all duration-1000">
                       <LeagueLogo league={league} className="w-full h-full object-contain" />
                     </div>
                     <div className="absolute right-1/4 -top-16 w-32 h-32 opacity-60 group-hover:translate-x-4 group-hover:-rotate-12 transition-all duration-1000">
                       <LeagueLogo league={league} className="w-full h-full object-contain" />
                     </div>
                     <div className="absolute left-1/3 -bottom-10 w-40 h-40 opacity-40 group-hover:-translate-y-4 group-hover:rotate-6 transition-all duration-1000">
                       <LeagueLogo league={league} className="w-full h-full object-contain" />
                     </div>
                     <div className="absolute right-1/2 top-4 w-24 h-24 opacity-30 group-hover:scale-110 transition-all duration-1000">
                       <LeagueLogo league={league} className="w-full h-full object-contain" />
                     </div>
                  </div>
                )}
                
                {/* Left Accent Glow Bar - Thicker and Always Visible */}
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${theme.accent} shadow-[0_0_15px_rgba(255,255,255,0.4)]`}></div>
                
                {/* Content */}
                <div className="flex items-center gap-4 relative z-10 pl-2">
                  {/* Premium Medium Logo */}
                  <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center relative group-hover:scale-105 group-hover:rotate-3 transition-transform duration-500">
                    {/* Subtle glow behind logo */}
                    <div className={`absolute inset-0 blur-lg opacity-20 ${theme.accent} rounded-full`} />
                    <LeagueLogo league={league} className="w-8 h-8 sm:w-10 sm:h-10 object-contain relative z-10 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]" />
                  </div>
                  
                  <div className="flex flex-col items-start text-left">
                    <span className={`${theme.textColor} font-bold text-[14px] sm:text-[16px] tracking-wider uppercase drop-shadow-md`}>
                      {league}
                    </span>
                    <span className="text-zinc-500 text-[10px] sm:text-[11px] font-semibold tracking-wide uppercase mt-0.5 group-hover:text-zinc-400 transition-colors">
                      Öne Çıkan Turnuva
                    </span>
                  </div>
                </div>
                
                {/* Right controls */}
                <div className="flex items-center gap-3 sm:gap-5 relative z-10">
                  <div className="hidden sm:flex flex-col items-end mr-2">
                     <span className="text-zinc-500 text-[10px] font-bold tracking-widest uppercase">Aktif</span>
                     <span className="text-[#00E5FF] text-[13px] font-black tracking-wide group-hover:drop-shadow-[0_0_8px_rgba(0,229,255,0.6)] transition-all">{leagueMatches.length} MAÇ</span>
                  </div>
                  <span className="sm:hidden bg-[#00E5FF]/10 border border-[#00E5FF]/20 text-[#00E5FF] text-[11px] font-black px-3 py-1.5 rounded shadow-[0_0_10px_rgba(0,229,255,0.15)] group-hover:shadow-[0_0_15px_rgba(0,229,255,0.3)] transition-all tracking-widest">
                    {leagueMatches.length} MAÇ
                  </span>
                  
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#121620] border border-white/5 group-hover:bg-[#00E5FF]/10 group-hover:border-[#00E5FF]/30 transition-all shadow-lg group-hover:shadow-[0_0_15px_rgba(0,229,255,0.2)]">
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-zinc-300 group-hover:text-[#00E5FF] transition-colors" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-zinc-300 group-hover:text-[#00E5FF] transition-colors" />
                    )}
                  </div>
                </div>
              </button>
              
              {isExpanded && (
                <div className="px-3 pb-3 pt-1 grid grid-cols-1 lg:grid-cols-2 gap-3 bg-[#11141c]">
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
