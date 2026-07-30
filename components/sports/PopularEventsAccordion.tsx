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
          bgImage: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=1200&auto=format&fit=crop'
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
          bgImage: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop'
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
          bgImage: 'https://images.unsplash.com/photo-1551280857-2b9bbe5240f5?q=80&w=1200&auto=format&fit=crop'
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
          bgImage: 'https://images.unsplash.com/photo-1574629810360-7efbb6b08561?q=80&w=1200&auto=format&fit=crop'
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
          bgImage: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?q=80&w=1200&auto=format&fit=crop'
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
          bgImage: 'https://images.unsplash.com/photo-1518605368461-1ee7e16104bc?q=80&w=1200&auto=format&fit=crop'
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
            <div key={league} className={`group ${theme.bgGlow} backdrop-blur-xl rounded-xl rounded-bl-sm overflow-hidden transition-all duration-500 shadow-lg hover:shadow-2xl border border-white/[0.03] border-l-[3px] ${theme.accentBorder} ${theme.accentShadow} relative mt-3`}>
              <button 
                onClick={() => toggleLeague(league)}
                className={`w-full flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 relative overflow-hidden transition-all text-left bg-transparent group`}
              >
                {/* Advanced Ambient Radial Glow from the left */}
                <div className={`absolute inset-0 opacity-40 group-hover:opacity-70 transition-opacity duration-700 bg-[radial-gradient(ellipse_at_left,_var(--tw-gradient-stops))] ${theme.radialGlow} via-transparent to-transparent pointer-events-none z-0`} />
                
                {/* Elegant Deep Mesh Base */}
                <div className="absolute inset-0 bg-[#07090d]/60 group-hover:bg-[#07090d]/40 pointer-events-none transition-colors duration-700 z-0" />
                
                {/* Custom Cinematic Background Image */}
                {(theme as any).bgImage && (
                  <div 
                    className="absolute inset-0 pointer-events-none opacity-30 group-hover:opacity-50 transition-all duration-1000 z-0 bg-cover bg-center bg-no-repeat mix-blend-screen grayscale-[0.3]"
                    style={{ 
                      backgroundImage: `url(${(theme as any).bgImage})`,
                      maskImage: 'linear-gradient(to right, transparent 15%, black 90%)',
                      WebkitMaskImage: 'linear-gradient(to right, transparent 15%, black 90%)'
                    }} 
                  />
                )}
                
                {/* Turkish Flag Watermark (Only for Turkish Teams) */}
                {(theme as any).isTurkish && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-64 h-64 opacity-[0.03] group-hover:opacity-[0.07] group-hover:scale-110 transition-all duration-700 pointer-events-none overflow-hidden flex items-center justify-end pr-4">
                    <svg viewBox="0 0 1200 800" className="w-full h-full fill-white mix-blend-screen drop-shadow-[0_0_10px_rgba(255,255,255,1)]">
                      <circle cx="425" cy="400" r="200" fill="white"/>
                      <circle cx="475" cy="400" r="160" fill="black" style={{ mixBlendMode: 'destination-out' }}/>
                      <polygon points="760,400 642,438 678,323 583,406 700,466" fill="white"/>
                    </svg>
                  </div>
                )}
                
                {/* Massive, Elegant Watermark Logo for other leagues */}
                {!(theme as any).isTurkish && (
                  <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-48 h-48 opacity-[0.03] group-hover:opacity-[0.08] group-hover:-translate-x-4 transition-all duration-1000 pointer-events-none grayscale brightness-200 contrast-125 mix-blend-screen">
                     <LeagueLogo league={league} className="w-full h-full object-contain" />
                  </div>
                )}
                
                {/* Content */}
                <div className="flex items-center gap-4 relative z-10 pl-1 flex-1 min-w-0">
                  {/* Advanced Animated League Logo */}
                  <div className={`relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center overflow-hidden rounded-[1rem] p-[2px] group-hover:scale-105 transition-transform duration-500 shadow-[0_10px_20px_rgba(0,0,0,0.5)] shrink-0 z-10 bg-[#0A0D14]`}>
                    <span className={`absolute inset-[-1000%] animate-[spin_4s_linear_infinite] opacity-30 group-hover:opacity-100 transition-opacity duration-500`} style={{ background: `conic-gradient(from 90deg at 50% 50%, transparent 0%, ${(theme as any).hexColor || '#00E5FF'} 80%, transparent 100%)` }} />
                    <div className="absolute inset-[2px] bg-[#0A0D14] rounded-[14px]"></div>
                    <div className={`absolute inset-[2px] ${theme.bgGlow} rounded-[14px] mix-blend-screen`}></div>
                    <div className="relative h-full w-full rounded-[14px] bg-gradient-to-b from-white/10 to-transparent flex items-center justify-center backdrop-blur-md">
                      {isTennis ? (
                         <span className="text-3xl drop-shadow-lg relative z-10">🎾</span>
                      ) : (
                         <LeagueLogo league={league} className="w-10 h-10 sm:w-11 sm:h-11 object-contain relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" />
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-start text-left min-w-0 flex-1 pr-4">
                    <span className={`${theme.textColor} font-bold text-[14px] sm:text-[16px] tracking-wider uppercase drop-shadow-md truncate w-full`} title={league}>
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
                     <span className={`${theme.statColor} text-[13px] font-black tracking-wide drop-shadow-md transition-all`}>{leagueMatches.length} MAÇ</span>
                  </div>
                  <span className={`sm:hidden bg-white/5 border border-white/10 ${theme.statColor} text-[11px] font-black px-3 py-1.5 rounded shadow-lg transition-all tracking-widest`}>
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
