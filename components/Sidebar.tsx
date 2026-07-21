import React, { useState, useMemo } from 'react';
import {
  Menu, Trophy, Star, 
  Target, Gift, Ticket, MessageSquare, Globe, 
  Crown, ChevronDown, Clock, Sparkles, Cherry, Percent, Headphones, FileText, Copy, Radio, Flame, CalendarDays, Activity, Gamepad2
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
    if (name.includes('futbol') || name.includes('soccer')) return <Activity size={16} className="text-emerald-500" />;
    if (name.includes('basketbol') || name.includes('basketball')) return <Target size={16} className="text-orange-500" />;
    if (name.includes('tenis') || name.includes('tennis')) return <Trophy size={16} className="text-yellow-500" />;
    if (name.includes('voleybol') || name.includes('volleyball')) return <Clock size={16} className="text-blue-500" />;
    if (name.includes('e-spor') || name.includes('esports')) return <Gamepad2 size={16} className="text-purple-500" />;
    if (name.includes('hentbol') || name.includes('handball')) return <Flame size={16} className="text-red-500" />;
    return <Activity size={16} className="text-zinc-500" />;
  };
  
  // Accordion states
  const [isCasinoOpen, setIsCasinoOpen] = useState(false);
  const [isOriginalsOpen, setIsOriginalsOpen] = useState(false);
  const [isPromosOpen, setIsPromosOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isFavLeaguesOpen, setIsFavLeaguesOpen] = useState(false);

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
          overflow-x: hidden;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .navy-sidebar-inner::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Overlay for mobile */}
      <div className="sidebar-overlay" onClick={onToggle} style={{ display: 'none' }} />

      <div className={`navy-sidebar-container ${isOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
        <div className="navy-sidebar-inner pb-20">
          
          {/* Header Toggle */}
          <div className="h-[60px] lg:h-[70px] w-full shrink-0 flex items-center px-3 lg:px-4 pt-1 lg:pt-2 border-b border-zinc-800/50 relative z-50">
             <div className="flex items-center w-full gap-2">
                <button onClick={onToggle} className="text-white/70 hover:text-white p-1 lg:hidden">
                  <Menu size={20} />
                </button>
                {isOpen && (
                  <div className="flex-1 flex bg-zinc-900 rounded-md p-0.5 border border-zinc-800/50 shadow-inner relative overflow-hidden">
                    <button 
                      onClick={() => onViewChange('blackjack')}
                      className={`flex-1 py-1.5 lg:py-2 rounded-md text-xs lg:text-sm font-bold transition-all relative z-10 flex items-center justify-center gap-1.5 lg:gap-2 ${
                        (activeView === 'blackjack' || activeView === 'originals') 
                          ? 'bg-emerald-500 text-black shadow-md' 
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      {(activeView === 'blackjack' || activeView === 'originals') && (
                        <Cherry className="absolute left-1 lg:left-2 w-8 h-8 lg:w-10 lg:h-10 text-white/10 -rotate-12 pointer-events-none" />
                      )}
                      Casino
                    </button>
                    <button 
                      onClick={() => onViewChange('spor724')}
                      className={`flex-1 py-1.5 lg:py-2 rounded-md text-xs lg:text-sm font-bold transition-all relative z-10 ${
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

          {isOpen && (
            <div className="px-2 lg:px-3 py-3 lg:py-4 flex flex-col gap-3 lg:gap-4">
              
              {/* Promo Banner */}
              <div className="flex flex-col relative rounded-[14px] lg:rounded-[20px] border border-zinc-800/50 border-t-white/10 border-l-white/10 overflow-hidden bg-[#16141d]/80 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent backdrop-blur-2xl p-2.5 lg:p-3 shadow-[inset_0_1px_2px_rgba(255,255,255,0.15),0_10px_30px_rgba(0,0,0,0.3)] hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.2),0_15px_40px_rgba(0,0,0,0.4)] hover:-translate-y-0.5 transition-all duration-500 group cursor-pointer">
                 {/* Glassmorphism Shine Overlay */}
                 <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                 {/* Sweeping Light Beam */}
                 <div className="absolute top-0 left-[-100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] group-hover:left-[200%] transition-all duration-1000 ease-in-out pointer-events-none"></div>
                 
                 <div className="flex justify-between items-start relative z-10">
                    <div className="flex items-center gap-1.5 lg:gap-2">
                        <Ticket className="text-amber-400 w-6 h-6 lg:w-8 lg:h-8 shrink-0 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
                        <div className="flex flex-col">
                           <span className="text-white font-black text-base lg:text-lg italic tracking-tight leading-none drop-shadow-md">$20.000</span>
                           <span className="text-amber-400 font-black text-[9px] lg:text-[10px] tracking-wider uppercase drop-shadow-sm">Haftalık Çekiliş</span>
                       </div>
                    </div>
                    <div className="bg-zinc-950 border border-amber-500/50 rounded-full px-1.5 lg:px-2 py-0.5 shadow-[0_0_8px_rgba(251,191,36,0.3)]">
                       <span className="text-white font-bold text-[10px] lg:text-xs italic">20s</span>
                    </div>
                 </div>
                 
                 <div className="flex justify-between items-center mt-2 lg:mt-3 pt-2 lg:pt-3 border-t border-zinc-800/50 relative z-10">
                    <div className="flex flex-col items-center">
                       <span className="text-zinc-400 text-[8px] lg:text-[9px] font-bold uppercase tracking-wider">Günlük</span>
                       <span className="text-white font-black text-xs lg:text-sm italic drop-shadow-md">$25K</span>
                    </div>
                    <div className="flex flex-col items-center">
                       <span className="text-zinc-400 text-[8px] lg:text-[9px] font-bold uppercase tracking-wider">Haftalık</span>
                       <span className="text-white font-black text-xs lg:text-sm italic drop-shadow-md">$100K</span>
                    </div>
                    <div className="flex flex-col items-center">
                       <span className="text-zinc-400 text-[8px] lg:text-[9px] font-bold uppercase tracking-wider">Aylık</span>
                       <span className="text-white font-black text-xs lg:text-sm italic drop-shadow-md">$500K</span>
                    </div>
                 </div>
              </div>

              {/* Main Navigation Links */}
              <div className="flex flex-col gap-1 lg:gap-2 mt-2 lg:mt-4">
                <button 
                  onClick={() => onViewChange('home')}
                  className={`flex items-center gap-2.5 lg:gap-3 px-2.5 lg:px-3 py-2 lg:py-2.5 rounded-lg transition-colors group ${
                    activeView === 'home'
                    ? 'bg-zinc-900 text-white' 
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  <Crown className={`w-4 h-4 lg:w-5 lg:h-5 icon-wiggle ${activeView === 'home' ? 'text-[#06b6d4]' : ''}`} stroke="currentColor" fill="rgba(6,182,212,0.2)" strokeWidth={1.5} />
                  <span className="font-bold text-[13px] lg:text-[14px]">Anasayfa</span>
                </button>

                {/* Seka Çark Button in Sidebar */}
                <button 
                  onClick={() => onViewChange('luckywheel')}
                  className={`flex items-center gap-2.5 lg:gap-3 px-2.5 lg:px-3 py-2 lg:py-2.5 rounded-xl transition-all group relative overflow-hidden border ${
                    activeView === 'luckywheel'
                    ? 'bg-[#0ea5e9]/20 border-[#0ea5e9] text-white shadow-[0_0_15px_rgba(14,165,233,0.4)]' 
                    : 'bg-gradient-to-r from-[#0ea5e9]/10 to-transparent border-[#0ea5e9]/30 text-white hover:bg-[#0ea5e9]/20 hover:border-[#0ea5e9]'
                  }`}
                >
                  <div className="relative w-5 h-5 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-[#38bdf8] animate-pulse absolute" />
                    <Sparkles className="w-4 h-4 text-[#0ea5e9] animate-spin duration-3000" />
                  </div>
                  <span className="font-black text-[13px] lg:text-[14px] text-transparent bg-clip-text bg-gradient-to-r from-white to-[#7dd3fc] uppercase tracking-wide">
                    Seka Çark
                  </span>
                  <span className="ml-auto text-[10px] font-black bg-[#0ea5e9] text-black px-1.5 py-0.5 rounded-md animate-pulse">
                    YENİ
                  </span>
                </button>

                {userRole && userRole !== 'guest' && (
                  <>
                    <button className="flex items-center gap-2.5 lg:gap-3 px-2.5 lg:px-3 py-2 lg:py-2.5 rounded-lg transition-colors text-zinc-400 hover:text-white hover:bg-zinc-900 group">
                      <Star className="w-4 h-4 lg:w-5 lg:h-5 icon-wiggle" stroke="currentColor" fill="rgba(16,185,129,0.2)" strokeWidth={1.5} />
                      <span className="font-bold text-[13px] lg:text-[14px]">Sık Kullanılanlar</span>
                    </button>

                    <button className="flex items-center gap-2.5 lg:gap-3 px-2.5 lg:px-3 py-2 lg:py-2.5 rounded-lg transition-colors text-zinc-400 hover:text-white hover:bg-zinc-900 group">
                      <Copy className="w-4 h-4 lg:w-5 lg:h-5 icon-wiggle" stroke="currentColor" fill="rgba(99,102,241,0.2)" strokeWidth={1.5} />
                      <span className="font-bold text-[13px] lg:text-[14px]">Bahislerim</span>
                    </button>
                  </>
                )}
                
                <div className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800/50">
                  <button 
                    onClick={() => {
                      onViewChange('spor724');
                      if (setActiveLeague) setActiveLeague(null);
                    }} 
                    className={`w-full flex items-center justify-start gap-2.5 lg:gap-3 px-3 lg:px-4 py-2.5 lg:py-3 transition-colors group ${activeView === 'spor724' ? 'text-white bg-white/[0.04]' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'}`}
                  >
                    <Radio className="w-4 h-4 lg:w-5 lg:h-5 icon-wiggle text-red-500" stroke="currentColor" fill="rgba(239,68,68,0.2)" strokeWidth={1.5} />
                    <span className="font-bold text-[13px] lg:text-[14px]">Canlı Maçlar</span>
                  </button>
                </div>
                

              </div>

              <div className="h-[1px] w-full bg-white/5 my-1 lg:my-2" />

              {/* Accordions / View-Specific Lists */}
              <div className="flex flex-col gap-1.5 lg:gap-2">
                
                {/* ═══════════ SPORTS SECTION (Only shown in sports views) ═══════════ */}
                {(activeView === 'spor724' || activeView === 'upcomingMatches' || activeView === 'mobile-bulletin' || activeView.startsWith('sports')) ? (
                  <>
                    {/* Hızlı Erişim */}
                    <div className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800/50 p-2 space-y-1">
                      <div className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] px-2 py-1">
                        {language === 'tr' ? 'Hızlı Erişim' : 'Quick Links'}
                      </div>
                      <button className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-all text-xs font-semibold">
                        <Flame size={14} className="text-orange-500 drop-shadow-[0_0_6px_rgba(249,115,22,0.3)]" />
                        <span>{language === 'tr' ? 'Popüler Karşılaşmalar' : 'Popular Matches'}</span>
                      </button>
                      <button className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-all text-xs font-semibold">
                        <Star size={14} className="text-yellow-500 drop-shadow-[0_0_6px_rgba(234,179,8,0.3)]" />
                        <span>{language === 'tr' ? 'Favorilerim' : 'My Favorites'}</span>
                      </button>
                      <button className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-all text-xs font-semibold">
                        <Clock size={14} className="text-blue-500 drop-shadow-[0_0_6px_rgba(59,130,246,0.3)]" />
                        <span>{language === 'tr' ? 'Yaklaşan Maçlar' : 'Upcoming Matches'}</span>
                      </button>
                    </div>

                    {/* Tüm Sporlar */}
                    <div className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800/50 p-2 space-y-1">
                      <div className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] px-2 py-1 flex items-center justify-between">
                        <span>{language === 'tr' ? 'Tüm Sporlar' : 'All Sports'}</span>
                        <span className="bg-white/5 px-1.5 py-0.5 rounded text-[8px] text-zinc-400">{sportsListWithCounts.length}</span>
                      </div>
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
                            className={`w-full flex items-center justify-between px-2 py-2 rounded-lg text-xs font-bold transition-all ${
                              isActive 
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50 border border-transparent'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              {getSportIcon(sport.name)}
                              <span>{sport.name}</span>
                            </div>
                            <span className="text-[9px] text-zinc-500">{sport.count}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Popüler Ligler Accordion */}
                    <div className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800/50">
                      <button 
                        onClick={() => setIsFavLeaguesOpen(!isFavLeaguesOpen)}
                        className="w-full flex items-center justify-between px-3 lg:px-4 py-2.5 lg:py-3 text-white hover:bg-zinc-800/50 transition-colors group"
                      >
                        <div className="flex items-center gap-2.5 lg:gap-3">
                          <Trophy className="w-4 h-4 lg:w-5 lg:h-5 text-zinc-400 group-hover:text-white transition-colors" />
                          <span className="font-bold text-[13px] lg:text-[14px]">Popüler Ligler</span>
                        </div>
                        <ChevronDown size={14} className={`text-zinc-400 transition-transform duration-300 ${isFavLeaguesOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isFavLeaguesOpen && (
                        <div className="px-2 pb-2 flex flex-col">
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
                              className="flex items-center gap-2.5 lg:gap-3 px-3 lg:px-4 py-1.5 lg:py-2 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-colors text-left group"
                            >
                              <img src={`https://flagcdn.com/w20/${league.country}.png`} alt={league.country} className="w-3.5 h-3.5 lg:w-4 lg:h-4 rounded-sm object-cover opacity-70 group-hover:opacity-100" />
                              <span className="text-[12px] lg:text-[13px] font-medium">{league.title}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    {/* Casino Accordion */}
                    <div className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800/50">
                      <button 
                        onClick={() => setIsCasinoOpen(!isCasinoOpen)}
                        className="w-full flex items-center justify-between px-3 lg:px-4 py-2.5 lg:py-3 text-white hover:bg-zinc-800/50 transition-colors group"
                      >
                        <div className="flex items-center gap-2.5 lg:gap-3">
                          <Cherry className="w-4 h-4 lg:w-5 lg:h-5 text-zinc-400 group-hover:text-white transition-colors" />
                          <span className="font-bold text-[13px] lg:text-[14px]">Casino</span>
                          <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-emerald-500 ml-1 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                        </div>
                        <ChevronDown size={14} className={`text-zinc-400 transition-transform duration-300 ${isCasinoOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isCasinoOpen && (
                        <div className="px-2 pb-2 flex flex-col gap-0.5">
                          <button onClick={() => onViewChange('blackjack')} className="flex items-center gap-2.5 px-3 lg:px-4 py-1.5 lg:py-2 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-colors text-left text-[12px] lg:text-[13px] font-medium">Lobi</button>
                          <button className="flex items-center gap-2.5 px-3 lg:px-4 py-1.5 lg:py-2 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-colors text-left text-[12px] lg:text-[13px] font-medium">Slotlar</button>
                          <button className="flex items-center gap-2.5 px-3 lg:px-4 py-1.5 lg:py-2 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-colors text-left text-[12px] lg:text-[13px] font-medium">Canlı Casino</button>
                          <button className="flex items-center gap-2.5 px-3 lg:px-4 py-1.5 lg:py-2 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-colors text-left text-[12px] lg:text-[13px] font-medium">Rulet</button>
                          <button className="flex items-center gap-2.5 px-3 lg:px-4 py-1.5 lg:py-2 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-colors text-left text-[12px] lg:text-[13px] font-medium">Blackjack</button>
                          <button className="flex items-center gap-2.5 px-3 lg:px-4 py-1.5 lg:py-2 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-colors text-left text-[12px] lg:text-[13px] font-medium">Baccarat</button>
                          <button className="flex items-center gap-2.5 px-3 lg:px-4 py-1.5 lg:py-2 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-colors text-left text-[12px] lg:text-[13px] font-medium">Show Oyunları</button>
                        </div>
                      )}
                    </div>

                    {/* Originals Accordion */}
                    <div className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800/50">
                      <button 
                        onClick={() => setIsOriginalsOpen(!isOriginalsOpen)}
                        className="w-full flex items-center justify-between px-3 lg:px-4 py-2.5 lg:py-3 text-white hover:bg-zinc-800/50 transition-colors group"
                      >
                        <div className="flex items-center gap-2.5 lg:gap-3">
                          <Target className="w-4 h-4 lg:w-5 lg:h-5 text-zinc-400 group-hover:text-white transition-colors" />
                          <span className="font-bold text-[13px] lg:text-[14px]">Originals</span>
                        </div>
                        <ChevronDown size={14} className={`text-zinc-400 transition-transform duration-300 ${isOriginalsOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isOriginalsOpen && (
                        <div className="px-2 pb-2 flex flex-col gap-0.5">
                          <button onClick={() => onViewChange('originals')} className="flex items-center gap-2.5 px-3 lg:px-4 py-1.5 lg:py-2 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-colors text-left text-[12px] lg:text-[13px] font-medium">Crash</button>
                          <button onClick={() => onViewChange('originals')} className="flex items-center gap-2.5 px-3 lg:px-4 py-1.5 lg:py-2 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-colors text-left text-[12px] lg:text-[13px] font-medium">Dice</button>
                          <button onClick={() => onViewChange('originals')} className="flex items-center gap-2.5 px-3 lg:px-4 py-1.5 lg:py-2 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-colors text-left text-[12px] lg:text-[13px] font-medium">Plinko</button>
                          <button onClick={() => onViewChange('originals')} className="flex items-center gap-2.5 px-3 lg:px-4 py-1.5 lg:py-2 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-colors text-left text-[12px] lg:text-[13px] font-medium">Mines</button>
                          <button onClick={() => onViewChange('originals')} className="flex items-center gap-2.5 px-3 lg:px-4 py-1.5 lg:py-2 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-colors text-left text-[12px] lg:text-[13px] font-medium">Keno</button>
                        </div>
                      )}
                    </div>

                    {/* Promosyonlar Accordion */}
                    <div className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800/50">
                      <button 
                        onClick={() => setIsPromosOpen(!isPromosOpen)}
                        className="w-full flex items-center justify-between px-3 lg:px-4 py-2.5 lg:py-3 text-white hover:bg-zinc-800/50 transition-colors group"
                      >
                        <div className="flex items-center gap-2.5 lg:gap-3">
                          <Percent className="w-4 h-4 lg:w-5 lg:h-5 text-zinc-400 group-hover:text-white transition-colors" />
                          <span className="font-bold text-[13px] lg:text-[14px]">Promosyonlar</span>
                        </div>
                        <ChevronDown size={14} className={`text-zinc-400 transition-transform duration-300 ${isPromosOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isPromosOpen && (
                        <div className="px-2 pb-2 flex flex-col gap-0.5">
                          <button className="flex items-center gap-2.5 px-3 lg:px-4 py-1.5 lg:py-2 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-colors text-left text-[12px] lg:text-[13px] font-medium">Hoşgeldin Bonusu</button>
                          <button className="flex items-center gap-2.5 px-3 lg:px-4 py-1.5 lg:py-2 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-colors text-left text-[12px] lg:text-[13px] font-medium">Yatırım Bonusları</button>
                          <button className="flex items-center gap-2.5 px-3 lg:px-4 py-1.5 lg:py-2 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-colors text-left text-[12px] lg:text-[13px] font-medium">Kayıp Bonusları</button>
                          <button className="flex items-center gap-2.5 px-3 lg:px-4 py-1.5 lg:py-2 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-colors text-left text-[12px] lg:text-[13px] font-medium">Turnuvalar</button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              <div className="h-[1px] w-full bg-white/5 my-1 lg:my-2" />

              {/* Bottom Links */}
              <div className="flex flex-col gap-1 lg:gap-2">
                <button className="flex items-center gap-2.5 lg:gap-3 px-2.5 lg:px-3 py-2 lg:py-2.5 rounded-lg transition-colors text-zinc-400 hover:text-white hover:bg-zinc-900 group">
                  <Gift className="w-4 h-4 lg:w-5 lg:h-5 text-[#06b6d4] icon-wiggle" strokeWidth={1.5} />
                  <span className="font-bold text-[13px] lg:text-[14px]">Ödüller</span>
                </button>
                <button className="flex items-center gap-2.5 lg:gap-3 px-2.5 lg:px-3 py-2 lg:py-2.5 rounded-lg transition-colors text-zinc-400 hover:text-white hover:bg-zinc-900 group">
                  <Star className="w-4 h-4 lg:w-5 lg:h-5 text-amber-400 icon-wiggle" strokeWidth={1.5} />
                  <span className="font-bold text-[13px] lg:text-[14px]">VIP Kulübü</span>
                </button>
                <button className="flex items-center gap-2.5 lg:gap-3 px-2.5 lg:px-3 py-2 lg:py-2.5 rounded-lg transition-colors text-zinc-400 hover:text-white hover:bg-zinc-900 group">
                  <Headphones className="w-4 h-4 lg:w-5 lg:h-5 icon-wiggle" strokeWidth={1.5} />
                  <span className="font-bold text-[13px] lg:text-[14px]">Canlı Destek</span>
                </button>
                <button className="flex items-center gap-2.5 lg:gap-3 px-2.5 lg:px-3 py-2 lg:py-2.5 rounded-lg transition-colors text-zinc-400 hover:text-white hover:bg-zinc-900 group">
                  <FileText className="w-4 h-4 lg:w-5 lg:h-5 icon-wiggle" strokeWidth={1.5} />
                  <span className="font-bold text-[13px] lg:text-[14px]">Kurallar & Şartlar</span>
                </button>
                <div 
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className="flex items-center justify-between px-2.5 lg:px-3 py-2 lg:py-2.5 rounded-lg cursor-pointer transition-colors text-zinc-400 hover:text-white hover:bg-zinc-900"
                >
                  <div className="flex items-center gap-2.5 lg:gap-3">
                    <Globe className="w-4 h-4 lg:w-5 lg:h-5" />
                    <span className="font-bold text-[13px] lg:text-[14px]">Dil: Türkçe</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
                </div>
              </div>

            </div>
          )}

          {!isOpen && (
            <div className="flex flex-col items-center py-4 gap-4 w-full relative z-[100]">
              {/* Collapsed icons only */}
              <button onClick={() => onViewChange('home')} className={`group relative w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${activeView === 'home' || activeView === 'blackjack' ? 'bg-zinc-900 text-white border-l-2 border-[#10b981]' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}`}>
                <Crown className={`w-5 h-5 ${activeView === 'home' ? 'text-emerald-500' : ''}`} />
                <div className="absolute left-full ml-4 px-2 py-1 bg-zinc-900 text-white text-xs font-bold rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 whitespace-nowrap z-50">Anasayfa</div>
              </button>
              <button className="group relative w-10 h-10 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors">
                <Star className="w-5 h-5" />
                <div className="absolute left-full ml-4 px-2 py-1 bg-zinc-900 text-white text-xs font-bold rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 whitespace-nowrap z-50">Sık Kullanılanlar</div>
              </button>
              <button className="group relative w-10 h-10 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors">
                <Copy className="w-5 h-5" />
                <div className="absolute left-full ml-4 px-2 py-1 bg-zinc-900 text-white text-xs font-bold rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 whitespace-nowrap z-50">Bahislerim</div>
              </button>
              <button onClick={() => onViewChange('spor724')} className="group relative w-10 h-10 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors">
                <Radio className="w-5 h-5" />
                <div className="absolute left-full ml-4 px-2 py-1 bg-zinc-900 text-white text-xs font-bold rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 whitespace-nowrap z-50">Canlı Maçlar</div>
              </button>
              {(activeView === 'spor724' || activeView === 'mobile-bulletin' || activeView.startsWith('sports')) && (
                <button onClick={() => {onToggle(); setIsFavLeaguesOpen(true);}} className="group relative w-10 h-10 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors">
                  <Trophy className="w-5 h-5" />
                  <div className="absolute left-full ml-4 px-2 py-1 bg-zinc-900 text-white text-xs font-bold rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 whitespace-nowrap z-50">Popüler Ligler</div>
                </button>
              )}
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
              <button className="group relative w-10 h-10 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors">
                <Gift className="w-5 h-5" />
                <div className="absolute left-full ml-4 px-2 py-1 bg-zinc-900 text-white text-xs font-bold rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 whitespace-nowrap z-50">Ödüller</div>
              </button>
              <button className="group relative w-10 h-10 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors">
                <FileText className="w-5 h-5" />
                <div className="absolute left-full ml-4 px-2 py-1 bg-zinc-900 text-white text-xs font-bold rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 whitespace-nowrap z-50">Blog</div>
              </button>
              <button onClick={() => window.dispatchEvent(new Event('openSupportChat'))} className="group relative w-10 h-10 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors">
                <Headphones className="w-5 h-5" />
                <div className="absolute left-full ml-4 px-2 py-1 bg-zinc-900 text-white text-xs font-bold rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 whitespace-nowrap z-50">Canlı Destek</div>
              </button>
              <button onClick={() => {onToggle(); setIsLangOpen(!isLangOpen);}} className="group relative w-10 h-10 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors">
                <Globe className="w-5 h-5" />
                <div className="absolute left-full ml-4 px-2 py-1 bg-zinc-900 text-white text-xs font-bold rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 whitespace-nowrap z-50">Dil Seçimi</div>
              </button>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default Sidebar;
