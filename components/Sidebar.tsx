import React, { useState, useMemo } from 'react';
import {
  Menu, Trophy, Star, 
  Target, Gift, Ticket, MessageSquare, Globe, 
  Crown, ChevronDown, ChevronUp, Clock, Sparkles, Cherry, Percent, Headphones, FileText, Copy, Radio, Flame, CalendarDays, Activity, Gamepad2
} from 'lucide-react';
import { NavVisibility } from './Header';
import { useLanguage } from '../contexts/LanguageContext';
import { useBetting } from '../contexts/BettingContext';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  activeView: string;
  onViewChange: (view: string) => void;
  userRole?: string | null;
  navVisibility?: NavVisibility;
  onStartTour?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  activeView,
  onViewChange,
  userRole,
}) => {
  const { t, language } = useLanguage();
  const { setActiveLeague, activeSport, setActiveSport, events } = useBetting();

  // Local parser to count matches per sport dynamically from the WS events
  const sportsListWithCounts = useMemo(() => {
    if (!events || events.length === 0) return [];
    
    const sportCounts: Record<string, number> = {};
    events.forEach((ev: any) => {
      const data = ev.data;
      if (!data || !data.participants) return;
      
      let isFinished = data.status === 'finished' || data.status === 'ended' || data.status === 'closed';
      let isLive = data.status === 'in_progress' || data.is_live_betting === true || isFinished;
      if (!isLive) return;

      const countryName = data.country?.name || '';
      const tournamentName = data.tournament?.name || '';
      const league = countryName ? `${countryName} - ${tournamentName}` : tournamentName;

      const isFakeMatch = 
        league.toLowerCase().includes('cyber') || 
        league.toLowerCase().includes('esoccer') ||
        league.toLowerCase().includes('simulated') ||
        league.toLowerCase().includes('srl') ||
        league.toLowerCase().includes('virtual') ||
        (data.participants.home || '').toLowerCase().includes('esports') ||
        (data.sport?.name || '').toLowerCase().includes('e-sports');
        
      if (isFakeMatch) return;

      let sport = data.sport?.name || 'Soccer';
      const n = sport.toLowerCase();
      if (n.includes('futbol') || n.includes('soccer') || n.includes('football')) sport = 'Futbol';
      else if (n.includes('basketbol') || n.includes('basketball')) sport = 'Basketbol';
      else if (n.includes('tenis') || n.includes('tennis')) sport = 'Tenis';
      else if (n.includes('voleybol') || n.includes('volleyball')) sport = 'Voleybol';
      else if (n.includes('hentbol') || n.includes('handball')) sport = 'Hentbol';
      else if (n.includes('buz hokeyi') || n.includes('ice hockey')) sport = 'Buz Hokeyi';
      else if (n.includes('masa tenisi') || n.includes('table tennis')) sport = 'Masa Tenisi';
      else if (n.includes('e-spor') || n.includes('esports')) sport = 'E-Spor';
      else sport = 'Futbol'; // fallback

      sportCounts[sport] = (sportCounts[sport] || 0) + 1;
    });

    return Object.keys(sportCounts).map(sport => ({
      name: sport,
      count: sportCounts[sport]
    }));
  }, [events]);

  const getSportIcon = (sportName: string) => {
    const name = sportName.toLowerCase();
    if (name.includes('futbol') || name.includes('soccer')) return <Activity size={15} className="text-emerald-500 shrink-0" />;
    if (name.includes('basketbol') || name.includes('basketball')) return <Target size={15} className="text-orange-500 shrink-0" />;
    if (name.includes('tenis') || name.includes('tennis')) return <Trophy size={15} className="text-yellow-500 shrink-0" />;
    if (name.includes('voleybol') || name.includes('volleyball')) return <Clock size={15} className="text-blue-500 shrink-0" />;
    if (name.includes('e-spor') || name.includes('esports')) return <Gamepad2 size={15} className="text-purple-500 shrink-0" />;
    if (name.includes('hentbol') || name.includes('handball')) return <Flame size={15} className="text-red-500 shrink-0" />;
    return <Activity size={15} className="text-zinc-500 shrink-0" />;
  };
  
  // Accordion collapsible states
  const [isQuickLinksOpen, setIsQuickLinksOpen] = useState(true);
  const [isAllSportsOpen, setIsAllSportsOpen] = useState(true);
  const [isFavLeaguesOpen, setIsFavLeaguesOpen] = useState(true);
  const [isCasinoOpen, setIsCasinoOpen] = useState(false);
  const [isOriginalsOpen, setIsOriginalsOpen] = useState(false);
  const [isPromosOpen, setIsPromosOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  return (
    <>
      <style>{`
        .navy-sidebar-container {
          width: 100%;
          background-color: #09090b;
          display: flex;
          flex-direction: column;
          height: 100%;
          position: relative;
          z-index: 10;
          color: #d4d4d8;
        }
        .navy-sidebar-inner {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          overflow-x: hidden;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.1) transparent;
        }
        .navy-sidebar-inner::-webkit-scrollbar {
          width: 4px;
        }
        .navy-sidebar-inner::-webkit-scrollbar-track {
          background: transparent;
        }
        .navy-sidebar-inner::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.12);
          border-radius: 4px;
        }
        .navy-sidebar-inner::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.25);
        }
      `}</style>

      {/* Mobile Overlay */}
      <div className="sidebar-overlay" onClick={onToggle} style={{ display: 'none' }} />

      <div className={`navy-sidebar-container ${isOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
        <div className="navy-sidebar-inner">
          
          {/* Header Toggle Section */}
          <div className="h-[60px] lg:h-[65px] w-full shrink-0 flex items-center px-3 border-b border-zinc-800/40 relative z-50">
             <div className="flex items-center w-full gap-2">
                <button onClick={onToggle} className="text-zinc-400 hover:text-white p-1 lg:hidden">
                  <Menu size={20} />
                </button>
                {isOpen && (
                  <div className="flex-1 flex bg-zinc-900/90 rounded-lg p-1 border border-zinc-800/50 shadow-inner relative overflow-hidden">
                    <button 
                      onClick={() => onViewChange('blackjack')}
                      className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all relative z-10 flex items-center justify-center gap-1.5 ${
                        (activeView === 'blackjack' || activeView === 'originals') 
                          ? 'bg-emerald-500 text-black shadow-md' 
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      {(activeView === 'blackjack' || activeView === 'originals') && (
                        <Cherry className="w-4 h-4 text-black/30 pointer-events-none" />
                      )}
                      Casino
                    </button>
                    <button 
                      onClick={() => onViewChange('spor724')}
                      className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all relative z-10 ${
                        activeView === 'spor724' 
                          ? 'bg-emerald-500 text-black shadow-md' 
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      Spor
                    </button>
                  </div>
                )}
             </div>
          </div>

          {/* Main Scrollable Content */}
          {isOpen && (
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
              
              {/* Promo Banner (Original Top Position) */}
              <div 
                onClick={() => onViewChange('raffle')}
                className="flex flex-col relative rounded-2xl border border-zinc-800/50 border-t-white/10 border-l-white/10 overflow-hidden bg-[#16141d]/80 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent backdrop-blur-2xl p-3 shadow-[inset_0_1px_2px_rgba(255,255,255,0.15),0_10px_30px_rgba(0,0,0,0.3)] hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.2),0_15px_40px_rgba(0,0,0,0.4)] hover:-translate-y-0.5 transition-all duration-500 group cursor-pointer"
              >
                 {/* Glassmorphism Shine Overlay */}
                 <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                 
                 <div className="flex justify-between items-start relative z-10">
                    <div className="flex items-center gap-2">
                        <Ticket className="text-amber-400 w-7 h-7 shrink-0 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
                        <div className="flex flex-col">
                           <span className="text-white font-black text-base italic tracking-tight leading-none drop-shadow-md">$20.000</span>
                           <span className="text-amber-400 font-black text-[10px] tracking-wider uppercase drop-shadow-sm">Haftalık Çekiliş</span>
                       </div>
                    </div>
                    <div className="bg-zinc-950 border border-amber-500/50 rounded-full px-2 py-0.5 shadow-[0_0_8px_rgba(251,191,36,0.3)]">
                       <span className="text-white font-bold text-xs italic">20s</span>
                    </div>
                 </div>
                 
                 <div className="flex justify-between items-center mt-2.5 pt-2.5 border-t border-zinc-800/50 relative z-10">
                    <div className="flex flex-col items-center">
                       <span className="text-zinc-400 text-[9px] font-bold uppercase tracking-wider">Günlük</span>
                       <span className="text-white font-black text-xs italic drop-shadow-md">$25K</span>
                    </div>
                    <div className="flex flex-col items-center">
                       <span className="text-zinc-400 text-[9px] font-bold uppercase tracking-wider">Haftalık</span>
                       <span className="text-white font-black text-xs italic drop-shadow-md">$100K</span>
                    </div>
                    <div className="flex flex-col items-center">
                       <span className="text-zinc-400 text-[9px] font-bold uppercase tracking-wider">Aylık</span>
                       <span className="text-white font-black text-xs italic drop-shadow-md">$500K</span>
                    </div>
                 </div>
              </div>

              {/* Top Section: Main Navigation Links */}
              <div className="flex flex-col space-y-1">
                {/* Anasayfa */}
                <button 
                  onClick={() => onViewChange('home')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all relative group ${
                    activeView === 'home'
                      ? 'bg-zinc-800/80 text-white border-l-4 border-emerald-500 shadow-sm' 
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/40 border-l-4 border-transparent'
                  }`}
                >
                  <Crown className={`w-4 h-4 shrink-0 ${activeView === 'home' ? 'text-emerald-400' : 'text-zinc-400 group-hover:text-zinc-200'}`} />
                  <span>Anasayfa</span>
                </button>

                {/* Seka Çark */}
                <button 
                  onClick={() => onViewChange('luckywheel')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-bold transition-all relative group ${
                    activeView === 'luckywheel' || activeView === 'wheel'
                      ? 'bg-sky-500/10 text-sky-400 border-l-4 border-sky-500 shadow-sm' 
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/40 border-l-4 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Sparkles className={`w-4 h-4 shrink-0 ${activeView === 'luckywheel' || activeView === 'wheel' ? 'text-sky-400' : 'text-sky-400/80 group-hover:text-sky-300'}`} />
                    <span>Seka Çark</span>
                  </div>
                  <span className="text-[9px] font-black bg-sky-500/20 text-sky-300 border border-sky-500/30 px-1.5 py-0.5 rounded tracking-wider uppercase">
                    YENİ
                  </span>
                </button>

                {/* Canlı Maçlar */}
                <button 
                  onClick={() => {
                    onViewChange('spor724');
                    if (setActiveLeague) setActiveLeague(null);
                  }} 
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-bold transition-all relative group ${
                    activeView === 'spor724'
                      ? 'bg-rose-500/10 text-rose-400 border-l-4 border-rose-500 shadow-sm' 
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/40 border-l-4 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Radio className={`w-4 h-4 shrink-0 ${activeView === 'spor724' ? 'text-rose-500 animate-pulse' : 'text-rose-400 group-hover:text-rose-300'}`} />
                    <span>Canlı Maçlar</span>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                </button>

                {userRole && userRole !== 'guest' && (
                  <>
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all text-zinc-400 hover:text-white hover:bg-zinc-800/40 border-l-4 border-transparent">
                      <Star className="w-4 h-4 shrink-0 text-amber-400" />
                      <span>Sık Kullanılanlar</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all text-zinc-400 hover:text-white hover:bg-zinc-800/40 border-l-4 border-transparent">
                      <Copy className="w-4 h-4 shrink-0 text-indigo-400" />
                      <span>Bahislerim</span>
                    </button>
                  </>
                )}
              </div>

              {/* ═══════════ SPORTS SECTION ═══════════ */}
              {(activeView === 'spor724' || activeView === 'upcomingMatches' || activeView === 'mobile-bulletin' || activeView.startsWith('sports')) ? (
                <div className="space-y-3 pt-2">
                  
                  {/* Hızlı Erişim Accordion */}
                  <div className="pt-2 border-t border-zinc-800/40">
                    <button 
                      onClick={() => setIsQuickLinksOpen(!isQuickLinksOpen)}
                      className="w-full flex items-center justify-between px-2 py-1.5 text-zinc-400 hover:text-zinc-200 transition-colors group cursor-pointer"
                    >
                      <span className="text-[11px] font-black uppercase tracking-wider text-zinc-500 group-hover:text-zinc-300">
                        {language === 'tr' ? 'Hızlı Erişim' : 'Quick Links'}
                      </span>
                      {isQuickLinksOpen ? (
                        <ChevronUp size={14} className="text-zinc-500 group-hover:text-zinc-300 transition-transform" />
                      ) : (
                        <ChevronDown size={14} className="text-zinc-500 group-hover:text-zinc-300 transition-transform" />
                      )}
                    </button>

                    {isQuickLinksOpen && (
                      <div className="mt-1 space-y-0.5">
                        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/40 transition-all text-xs font-semibold">
                          <Flame size={15} className="text-orange-500 shrink-0" />
                          <span>{language === 'tr' ? 'Popüler Karşılaşmalar' : 'Popular Matches'}</span>
                        </button>
                        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/40 transition-all text-xs font-semibold">
                          <Star size={15} className="text-yellow-500 shrink-0" />
                          <span>{language === 'tr' ? 'Favorilerim' : 'My Favorites'}</span>
                        </button>
                        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/40 transition-all text-xs font-semibold">
                          <Clock size={15} className="text-blue-500 shrink-0" />
                          <span>{language === 'tr' ? 'Yaklaşan Maçlar' : 'Upcoming Matches'}</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Tüm Sporlar Accordion */}
                  <div className="pt-2 border-t border-zinc-800/40">
                    <button 
                      onClick={() => setIsAllSportsOpen(!isAllSportsOpen)}
                      className="w-full flex items-center justify-between px-2 py-1.5 text-zinc-400 hover:text-zinc-200 transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-black uppercase tracking-wider text-zinc-500 group-hover:text-zinc-300">
                          {language === 'tr' ? 'Tüm Sporlar' : 'All Sports'}
                        </span>
                        <span className="text-[10px] font-semibold text-zinc-500 bg-zinc-800/60 px-1.5 py-0.2 rounded-full">
                          {sportsListWithCounts.length}
                        </span>
                      </div>
                      {isAllSportsOpen ? (
                        <ChevronUp size={14} className="text-zinc-500 group-hover:text-zinc-300 transition-transform" />
                      ) : (
                        <ChevronDown size={14} className="text-zinc-500 group-hover:text-zinc-300 transition-transform" />
                      )}
                    </button>

                    {isAllSportsOpen && (
                      <div className="mt-1 space-y-0.5">
                        {sportsListWithCounts.map(sport => {
                          const isActive = activeSport === sport.name;
                          return (
                            <button
                              key={sport.name}
                              onClick={() => {
                                onViewChange('spor724');
                                setActiveSport(sport.name);
                                if (setActiveLeague) setActiveLeague(null);
                              }}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                                isActive 
                                  ? 'bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500' 
                                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/40 border-l-2 border-transparent'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                {getSportIcon(sport.name)}
                                <span>{sport.name}</span>
                              </div>
                              <span className="text-[10px] font-medium text-zinc-500 ml-auto tabular-nums">
                                {sport.count}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Popüler Ligler Accordion */}
                  <div className="pt-2 border-t border-zinc-800/40">
                    <button 
                      onClick={() => setIsFavLeaguesOpen(!isFavLeaguesOpen)}
                      className="w-full flex items-center justify-between px-2 py-1.5 text-zinc-400 hover:text-zinc-200 transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <Trophy className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors shrink-0" />
                        <span className="text-[11px] font-black uppercase tracking-wider text-zinc-500 group-hover:text-zinc-300">Popüler Ligler</span>
                      </div>
                      {isFavLeaguesOpen ? (
                        <ChevronUp size={14} className="text-zinc-500 group-hover:text-zinc-300 transition-transform" />
                      ) : (
                        <ChevronDown size={14} className="text-zinc-500 group-hover:text-zinc-300 transition-transform" />
                      )}
                    </button>
                    
                    {isFavLeaguesOpen && (
                      <div className="mt-1 space-y-0.5">
                        {[
                          { title: 'Süper Lig', country: 'tr' },
                          { title: 'Premier Lig', country: 'gb' },
                          { title: 'La Liga', country: 'es' },
                          { title: 'Bundesliga', country: 'de' },
                          { title: 'Serie A', country: 'it' },
                          { title: 'Ligue 1', country: 'fr' },
                          { title: 'Şampiyonlar Ligi', country: 'eu' },
                          { title: 'UEFA Avrupa Ligi', country: 'eu' },
                          { title: 'NBA', country: 'us' }
                        ].map((league, idx) => (
                          <button 
                            key={idx} 
                            onClick={() => {
                              onViewChange('spor724');
                              if (setActiveLeague) setActiveLeague(league.title);
                            }}
                            className="w-full flex items-center gap-3 px-3 py-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800/40 rounded-lg transition-colors text-xs font-medium group text-left"
                          >
                            <img src={`https://flagcdn.com/w20/${league.country}.png`} alt={league.country} className="w-4 h-3 rounded-sm object-cover opacity-70 group-hover:opacity-100 shrink-0" />
                            <span>{league.title}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* ═══════════ CASINO & OTHER SECTIONS ═══════════ */
                <div className="space-y-3 pt-2">
                  
                  {/* Casino Accordion */}
                  <div className="pt-2 border-t border-zinc-800/40">
                    <button 
                      onClick={() => setIsCasinoOpen(!isCasinoOpen)}
                      className="w-full flex items-center justify-between px-2 py-1.5 text-zinc-400 hover:text-zinc-200 transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <Cherry className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors shrink-0" />
                        <span className="text-[11px] font-black uppercase tracking-wider text-zinc-500 group-hover:text-zinc-300">Casino</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 ml-1"></div>
                      </div>
                      {isCasinoOpen ? (
                        <ChevronUp size={14} className="text-zinc-500 group-hover:text-zinc-300 transition-transform" />
                      ) : (
                        <ChevronDown size={14} className="text-zinc-500 group-hover:text-zinc-300 transition-transform" />
                      )}
                    </button>
                    {isCasinoOpen && (
                      <div className="mt-1 space-y-0.5">
                        <button onClick={() => onViewChange('blackjack')} className="w-full flex items-center gap-3 px-3 py-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800/40 rounded-lg transition-colors text-xs font-medium text-left">Lobi</button>
                        <button className="w-full flex items-center gap-3 px-3 py-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800/40 rounded-lg transition-colors text-xs font-medium text-left">Slotlar</button>
                        <button className="w-full flex items-center gap-3 px-3 py-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800/40 rounded-lg transition-colors text-xs font-medium text-left">Canlı Casino</button>
                        <button className="w-full flex items-center gap-3 px-3 py-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800/40 rounded-lg transition-colors text-xs font-medium text-left">Rulet</button>
                        <button className="w-full flex items-center gap-3 px-3 py-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800/40 rounded-lg transition-colors text-xs font-medium text-left">Blackjack</button>
                        <button className="w-full flex items-center gap-3 px-3 py-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800/40 rounded-lg transition-colors text-xs font-medium text-left">Baccarat</button>
                      </div>
                    )}
                  </div>

                  {/* Originals Accordion */}
                  <div className="pt-2 border-t border-zinc-800/40">
                    <button 
                      onClick={() => setIsOriginalsOpen(!isOriginalsOpen)}
                      className="w-full flex items-center justify-between px-2 py-1.5 text-zinc-400 hover:text-zinc-200 transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <Target className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors shrink-0" />
                        <span className="text-[11px] font-black uppercase tracking-wider text-zinc-500 group-hover:text-zinc-300">Originals</span>
                      </div>
                      {isOriginalsOpen ? (
                        <ChevronUp size={14} className="text-zinc-500 group-hover:text-zinc-300 transition-transform" />
                      ) : (
                        <ChevronDown size={14} className="text-zinc-500 group-hover:text-zinc-300 transition-transform" />
                      )}
                    </button>
                    {isOriginalsOpen && (
                      <div className="mt-1 space-y-0.5">
                        <button onClick={() => onViewChange('originals')} className="w-full flex items-center gap-3 px-3 py-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800/40 rounded-lg transition-colors text-xs font-medium text-left">Crash</button>
                        <button onClick={() => onViewChange('originals')} className="w-full flex items-center gap-3 px-3 py-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800/40 rounded-lg transition-colors text-xs font-medium text-left">Dice</button>
                        <button onClick={() => onViewChange('originals')} className="w-full flex items-center gap-3 px-3 py-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800/40 rounded-lg transition-colors text-xs font-medium text-left">Plinko</button>
                        <button onClick={() => onViewChange('originals')} className="w-full flex items-center gap-3 px-3 py-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800/40 rounded-lg transition-colors text-xs font-medium text-left">Mines</button>
                      </div>
                    )}
                  </div>

                  {/* Promosyonlar Accordion */}
                  <div className="pt-2 border-t border-zinc-800/40">
                    <button 
                      onClick={() => setIsPromosOpen(!isPromosOpen)}
                      className="w-full flex items-center justify-between px-2 py-1.5 text-zinc-400 hover:text-zinc-200 transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <Percent className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors shrink-0" />
                        <span className="text-[11px] font-black uppercase tracking-wider text-zinc-500 group-hover:text-zinc-300">Promosyonlar</span>
                      </div>
                      {isPromosOpen ? (
                        <ChevronUp size={14} className="text-zinc-500 group-hover:text-zinc-300 transition-transform" />
                      ) : (
                        <ChevronDown size={14} className="text-zinc-500 group-hover:text-zinc-300 transition-transform" />
                      )}
                    </button>
                    {isPromosOpen && (
                      <div className="mt-1 space-y-0.5">
                        <button className="w-full flex items-center gap-3 px-3 py-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800/40 rounded-lg transition-colors text-xs font-medium text-left">Hoşgeldin Bonusu</button>
                        <button className="w-full flex items-center gap-3 px-3 py-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800/40 rounded-lg transition-colors text-xs font-medium text-left">Yatırım Bonusları</button>
                        <button className="w-full flex items-center gap-3 px-3 py-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800/40 rounded-lg transition-colors text-xs font-medium text-left">Kayıp Bonusları</button>
                      </div>
                    )}
                  </div>

                </div>
              )}

            </div>
          )}

          {/* ═══════════ STICKY FOOTER (Bottom Section) ═══════════ */}
          {isOpen && (
            <div className="mt-auto shrink-0 border-t border-zinc-800/50 bg-[#09090b] pt-2 pb-3 px-3 flex flex-col space-y-1">
              
              {/* Corporate / Support Footer Links */}
              <button 
                onClick={() => onViewChange('loyalty')}
                className="w-full flex items-center gap-3 px-2.5 py-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/40 transition-colors text-xs font-medium group"
              >
                <Gift className="w-3.5 h-3.5 text-cyan-400 shrink-0 group-hover:scale-110 transition-transform" />
                <span>Ödüller</span>
              </button>
              
              <button 
                onClick={() => onViewChange('loyalty')}
                className="w-full flex items-center gap-3 px-2.5 py-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/40 transition-colors text-xs font-medium group"
              >
                <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
                <span>VIP Kulübü</span>
              </button>

              <button 
                onClick={() => window.dispatchEvent(new Event('openSupportChat'))}
                className="w-full flex items-center gap-3 px-2.5 py-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/40 transition-colors text-xs font-medium group"
              >
                <Headphones className="w-3.5 h-3.5 text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />
                <span>Canlı Destek</span>
              </button>

              <button 
                onClick={() => onViewChange('rules')}
                className="w-full flex items-center gap-3 px-2.5 py-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/40 transition-colors text-xs font-medium group"
              >
                <FileText className="w-3.5 h-3.5 text-zinc-400 shrink-0 group-hover:scale-110 transition-transform" />
                <span>Kurallar & Şartlar</span>
              </button>

              {/* Language Toggle */}
              <div 
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer text-zinc-400 hover:text-white hover:bg-zinc-800/40 transition-colors text-xs font-medium"
              >
                <div className="flex items-center gap-3">
                  <Globe className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span>Dil: Türkçe</span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-zinc-500 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
              </div>
            </div>
          )}

          {/* Collapsed Sidebar Mode (Icons Only) */}
          {!isOpen && (
            <div className="flex flex-col items-center py-4 gap-4 w-full relative z-[100]">
              <button onClick={() => onViewChange('home')} className={`group relative w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${activeView === 'home' ? 'bg-zinc-900 text-white border-l-2 border-emerald-500' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}`}>
                <Crown className={`w-5 h-5 ${activeView === 'home' ? 'text-emerald-500' : ''}`} />
                <div className="absolute left-full ml-4 px-2 py-1 bg-zinc-900 text-white text-xs font-bold rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 whitespace-nowrap z-50">Anasayfa</div>
              </button>
              <button onClick={() => onViewChange('luckywheel')} className="group relative w-10 h-10 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors">
                <Sparkles className="w-5 h-5 text-sky-400" />
                <div className="absolute left-full ml-4 px-2 py-1 bg-zinc-900 text-white text-xs font-bold rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 whitespace-nowrap z-50">Seka Çark</div>
              </button>
              <button onClick={() => onViewChange('spor724')} className="group relative w-10 h-10 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors">
                <Radio className="w-5 h-5 text-rose-500" />
                <div className="absolute left-full ml-4 px-2 py-1 bg-zinc-900 text-white text-xs font-bold rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 whitespace-nowrap z-50">Canlı Maçlar</div>
              </button>
              <div className="w-10 h-px bg-white/5 my-1"></div>
              <button onClick={() => {onToggle(); setIsCasinoOpen(true);}} className="group relative w-10 h-10 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors">
                <Cherry className="w-5 h-5" />
                <div className="absolute left-full ml-4 px-2 py-1 bg-zinc-900 text-white text-xs font-bold rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 whitespace-nowrap z-50">Casino</div>
              </button>
              <button onClick={() => {onToggle(); setIsOriginalsOpen(true);}} className="group relative w-10 h-10 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors">
                <Target className="w-5 h-5" />
                <div className="absolute left-full ml-4 px-2 py-1 bg-zinc-900 text-white text-xs font-bold rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 whitespace-nowrap z-50">Originals</div>
              </button>
              <button onClick={() => {onToggle(); setIsPromosOpen(true);}} className="group relative w-10 h-10 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors">
                <Percent className="w-5 h-5" />
                <div className="absolute left-full ml-4 px-2 py-1 bg-zinc-900 text-white text-xs font-bold rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 whitespace-nowrap z-50">Promosyonlar</div>
              </button>
              <div className="w-10 h-px bg-white/5 my-1"></div>
              <button onClick={() => onViewChange('loyalty')} className="group relative w-10 h-10 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors">
                <Gift className="w-5 h-5 text-cyan-400" />
                <div className="absolute left-full ml-4 px-2 py-1 bg-zinc-900 text-white text-xs font-bold rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 whitespace-nowrap z-50">Ödüller</div>
              </button>
              <button onClick={() => window.dispatchEvent(new Event('openSupportChat'))} className="group relative w-10 h-10 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors">
                <Headphones className="w-5 h-5 text-emerald-400" />
                <div className="absolute left-full ml-4 px-2 py-1 bg-zinc-900 text-white text-xs font-bold rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 whitespace-nowrap z-50">Canlı Destek</div>
              </button>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default Sidebar;
