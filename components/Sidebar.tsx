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

  const [liveMatches, setLiveMatches] = useState<any[]>([]);

  React.useEffect(() => {
    if (!events || events.length === 0) {
      fetch('/live_matches.json')
        .then(res => res.json())
        .then(data => setLiveMatches(data))
        .catch(() => {});
    }
  }, [events]);

  const sportsListWithCounts = useMemo(() => {
    const sourceEvents = (events && events.length > 0) ? events : liveMatches;
    if (!sourceEvents || sourceEvents.length === 0) return [];
    
    const sportCounts: Record<string, number> = {};
    sourceEvents.forEach((ev: any) => {
      const data = ev.data || ev; // Handle both wrapped and raw formats
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
  }, [events, liveMatches]);

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
          background-color: #0b0e14;
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
          <div className="h-[72px] w-full shrink-0 flex items-center px-3 relative z-50">
             <div className="flex items-center w-full gap-3">
                <button onClick={onToggle} className="text-zinc-300 hover:text-white p-1">
                  <Menu size={24} />
                </button>
                {isOpen && (
                  <div className="flex-1 flex bg-[#12141d] rounded-md p-0.5 border border-white/5 shadow-inner relative overflow-hidden">
                    <button 
                      onClick={() => onViewChange('blackjack')}
                      className={`flex-1 py-1.5 rounded-md text-sm font-semibold transition-all relative z-10 flex items-center justify-center gap-1.5 ${
                        (activeView === 'blackjack' || activeView === 'originals') 
                          ? 'bg-[#1e2230] text-white shadow-md' 
                          : 'text-zinc-300 hover:text-white'
                      }`}
                    >
                      Casino
                    </button>
                    <button 
                      onClick={() => onViewChange('spor724')}
                      className={`flex-1 py-1.5 rounded-md text-sm font-semibold transition-all relative z-10 flex items-center justify-center gap-2 ${
                        (activeView === 'spor724' || activeView === 'home' || activeView === 'gercek') 
                          ? 'bg-[#f59e0b] text-white shadow-md' 
                          : 'text-zinc-300 hover:text-white'
                      }`}
                    >
                      <Target className="w-4 h-4 opacity-50" />
                      Spor
                    </button>
                  </div>
                )}
             </div>
          </div>

          {/* Main Scrollable Content */}
          {isOpen && (
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
              
              {/* Promo Banner */}
              <div 
                onClick={() => onViewChange('raffle')}
                className="flex flex-col relative rounded-xl border border-white/5 overflow-hidden bg-gradient-to-b from-[#141722] to-[#0c0d14] p-3 shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
              >
                 <div className="flex justify-between items-start relative z-10">
                    <div className="flex items-center gap-2.5">
                        <Ticket className="text-amber-400 w-8 h-8 shrink-0 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
                        <div className="flex flex-col">
                           <span className="text-white font-black text-lg italic tracking-tight leading-none drop-shadow-md">$20.000</span>
                           <span className="text-amber-400 font-bold text-[11px] tracking-wider uppercase drop-shadow-sm">Haftalık Çekiliş</span>
                       </div>
                    </div>
                    <div className="bg-transparent border border-amber-500/50 rounded-md px-2 py-0.5 shadow-[0_0_8px_rgba(251,191,36,0.15)]">
                       <span className="text-white font-bold text-xs italic">3g</span>
                    </div>
                 </div>
                 
                 <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/5 relative z-10">
                    <div className="flex flex-col items-center">
                       <span className="text-[#64748b] text-[10px] font-bold uppercase tracking-wider">Günlük</span>
                       <span className="text-white font-black text-sm italic drop-shadow-md">$25K</span>
                    </div>
                    <div className="flex flex-col items-center">
                       <span className="text-[#64748b] text-[10px] font-bold uppercase tracking-wider">Haftalık</span>
                       <span className="text-white font-black text-sm italic drop-shadow-md">$100K</span>
                    </div>
                    <div className="flex flex-col items-center">
                       <span className="text-[#64748b] text-[10px] font-bold uppercase tracking-wider">Aylık</span>
                       <span className="text-white font-black text-sm italic drop-shadow-md">$500K</span>
                    </div>
                 </div>
              </div>

              {/* Navigation Links Group */}
              <div className="space-y-1">
                <button 
                  onClick={() => onViewChange('home')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                    activeView === 'home' 
                      ? 'bg-[#181c2b] text-white shadow-md' 
                      : 'text-[#94a3b8] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Crown className="w-5 h-5 text-zinc-400 shrink-0" />
                    <span>Anasayfa</span>
                  </div>
                </button>

                <button 
                  onClick={() => onViewChange('spor724')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                    activeView === 'spor724' 
                      ? 'bg-[#181c2b] text-white shadow-md' 
                      : 'text-[#94a3b8] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-zinc-400 shrink-0" />
                    <span>Sık Kullanılanlar</span>
                  </div>
                </button>

                <button 
                  onClick={() => onViewChange('mybets')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                    activeView === 'mybets' 
                      ? 'bg-[#181c2b] text-white shadow-md' 
                      : 'text-[#94a3b8] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Trophy className="w-5 h-5 text-zinc-400 shrink-0" />
                    <span>Bahislerim</span>
                  </div>
                </button>

                <button 
                  onClick={() => onViewChange('gercek')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                    (activeView === 'gercek' || activeView === 'spor724' || activeView === 'sports')
                      ? 'bg-[#181c2b] text-white shadow-md' 
                      : 'text-[#94a3b8] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Trophy className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>Spor</span>
                  </div>
                  <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider">
                    CANLI & BÜLTEN
                  </span>
                </button>

                <button 
                  onClick={() => onViewChange('wheel')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                    (activeView === 'wheel' || activeView === 'luckywheel')
                      ? 'bg-[#181c2b] text-white shadow-md' 
                      : 'text-[#94a3b8] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
                    <span>Şans Çarkı</span>
                  </div>
                </button>
              </div>

              <div className="h-px bg-white/5 w-full my-2" />

              {/* Spor Collapsible Accordion */}
              <div className="space-y-1">
                <button 
                  onClick={() => setIsAllSportsOpen(!isAllSportsOpen)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-[#64748b] hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-amber-400" />
                    <span>Spor</span>
                  </div>
                  {isAllSportsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {isAllSportsOpen && (
                  <div className="pl-2 space-y-1.5 pt-2 pb-1">
                    {sportsListWithCounts.map((sport) => (
                      <button
                        key={sport.name}
                        onClick={() => {
                          setActiveSport(sport.name);
                          onViewChange('spor724');
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 sm:py-3 rounded-xl text-sm transition-all ${
                          activeSport === sport.name 
                            ? 'bg-[#181c2b] text-white font-semibold shadow-md' 
                            : 'text-[#94a3b8] hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {getSportIcon(sport.name)}
                          <span className="truncate max-w-[150px] font-medium">{sport.name}</span>
                        </div>
                        <span className="text-xs text-[#94a3b8] font-bold px-2 py-0.5 rounded-md bg-[#131926] border border-[#1b2335] shrink-0 ml-1">{sport.count}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Promosyonlar Collapsible Accordion */}
              <div className="space-y-1">
                <button 
                  onClick={() => setIsPromosOpen(!isPromosOpen)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-[#64748b] hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Percent className="w-4 h-4 text-emerald-400" />
                    <span>Promosyonlar</span>
                  </div>
                  {isPromosOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {isPromosOpen && (
                  <div className="pl-2 space-y-0.5 pt-1">
                    <button onClick={() => onViewChange('raffle')} className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-[#94a3b8] hover:text-white hover:bg-white/5 transition-all">
                      <div className="flex items-center gap-2.5">
                        <Gift className="w-4 h-4 text-amber-400" />
                        <span>Haftalık Çekiliş</span>
                      </div>
                    </button>
                    <button onClick={() => onViewChange('raffle')} className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-[#94a3b8] hover:text-white hover:bg-white/5 transition-all">
                      <div className="flex items-center gap-2.5">
                        <Crown className="w-4 h-4 text-amber-400" />
                        <span>VIP Bonusları</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              <div className="h-px bg-white/5 w-full my-2" />

              {/* Bottom Menu Links */}
              <div className="space-y-1 pt-1">
                <button onClick={() => onViewChange('raffle')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all text-[#94a3b8] hover:text-white hover:bg-white/5">
                  <Gift className="w-5 h-5 shrink-0" />
                  <span>Ödüller</span>
                </button>
                <button onClick={() => onViewChange('blog')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all text-[#94a3b8] hover:text-white hover:bg-white/5">
                  <FileText className="w-5 h-5 shrink-0" />
                  <span>Blog</span>
                </button>
                <button onClick={() => window.dispatchEvent(new Event('openSupportChat'))} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all text-[#94a3b8] hover:text-white hover:bg-white/5">
                  <Headphones className="w-5 h-5 shrink-0" />
                  <span>Canlı Destek</span>
                </button>
                <button onClick={() => setIsLangOpen(!isLangOpen)} className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-all text-[#94a3b8] hover:text-white hover:bg-white/5">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 shrink-0" />
                    <span>Dil: Türkçe</span>
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Collapsed Sidebar Mode (Icons Only) */}
          {!isOpen && (
            <div className="flex flex-col items-center py-4 gap-4 w-full h-full bg-[#0b0e14] relative z-[100]">
              <button onClick={onToggle} className="text-zinc-300 hover:text-white p-2 mb-2">
                <Menu size={24} />
              </button>
              
              <button onClick={() => onViewChange('home')} className={`group relative w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${activeView === 'home' ? 'bg-[#181c2b] text-[#5b8def]' : 'text-[#94a3b8] hover:text-white hover:bg-white/5'}`}>
                <Crown className="w-5 h-5" />
                <div className="absolute left-full ml-4 px-2 py-1 bg-[#141722] text-white text-xs font-bold rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 whitespace-nowrap z-50">Anasayfa</div>
              </button>
              <button onClick={() => onViewChange('gercek')} className={`group relative w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${(activeView === 'gercek' || activeView === 'spor724' || activeView === 'sports') ? 'bg-[#181c2b] text-[#5b8def]' : 'text-[#94a3b8] hover:text-white hover:bg-white/5'}`}>
                <Trophy className="w-5 h-5 text-emerald-400" />
                <div className="absolute left-full ml-4 px-2 py-1 bg-[#141722] text-white text-xs font-bold rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 whitespace-nowrap z-50">Spor</div>
              </button>
              <button onClick={() => onViewChange('wheel')} className={`group relative w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${activeView === 'wheel' ? 'bg-[#181c2b] text-[#5b8def]' : 'text-[#94a3b8] hover:text-white hover:bg-white/5'}`}>
                <Sparkles className="w-5 h-5 text-amber-400" />
                <div className="absolute left-full ml-4 px-2 py-1 bg-[#141722] text-white text-xs font-bold rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 whitespace-nowrap z-50">Şans Çarkı</div>
              </button>
              <div className="w-10 h-px bg-white/5 my-1"></div>
              <button onClick={() => {onToggle(); setIsAllSportsOpen(true);}} className="group relative w-10 h-10 rounded-lg flex items-center justify-center text-[#94a3b8] hover:text-white hover:bg-white/5 transition-colors">
                <Target className="w-5 h-5" />
                <div className="absolute left-full ml-4 px-2 py-1 bg-[#141722] text-white text-xs font-bold rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 whitespace-nowrap z-50">Spor</div>
              </button>
              <button onClick={() => {onToggle(); setIsPromosOpen(true);}} className="group relative w-10 h-10 rounded-lg flex items-center justify-center text-[#94a3b8] hover:text-white hover:bg-white/5 transition-colors">
                <Percent className="w-5 h-5" />
                <div className="absolute left-full ml-4 px-2 py-1 bg-[#141722] text-white text-xs font-bold rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 whitespace-nowrap z-50">Promosyonlar</div>
              </button>
              <div className="w-10 h-px bg-white/5 my-1"></div>
              <button onClick={() => window.dispatchEvent(new Event('openSupportChat'))} className="group relative w-10 h-10 rounded-lg flex items-center justify-center text-[#94a3b8] hover:text-white hover:bg-white/5 transition-colors">
                <Headphones className="w-5 h-5" />
                <div className="absolute left-full ml-4 px-2 py-1 bg-[#141722] text-white text-xs font-bold rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 whitespace-nowrap z-50">Canlı Destek</div>
              </button>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default Sidebar;
