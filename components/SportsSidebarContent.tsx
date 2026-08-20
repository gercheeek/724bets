import React, { useState, useEffect } from 'react';
import { 
  PlayCircle, Clock, LayoutGrid, Receipt, 
  ChevronDown, ChevronUp, Target, Gamepad2, Trophy, Flag,
  Crosshair, Dribbble, Globe, Timer, ChevronRight, Star
} from 'lucide-react';
import { PlayerLogo } from './sports/PlayerLogo';
import { useBetting } from '../contexts/BettingContext';

interface SportsSidebarContentProps {
  isOpen: boolean;
  onViewChange: (view: string) => void;
  onToggle?: () => void;
}

// Reusable SVG icons for sports without direct lucide match
const SoccerIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10" />
    <polygon points="12 4 15 9 10 9" fill="currentColor" />
    <polygon points="12 20 9 15 14 15" fill="currentColor" />
    <polygon points="4 12 9 9 9 14" fill="currentColor" />
    <polygon points="20 12 15 15 15 10" fill="currentColor" />
  </svg>
);

const TennisIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10" />
    <path d="M7 7c3 0 5-2 5-5M17 17c-3 0-5 2-5 5" />
  </svg>
);

const VolleyballIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10" strokeDasharray="3 3"/>
    <path d="M12 2c0 6 4 10 10 10M2 12c6 0 10 4 10 10M12 22c0-6-4-10-10-10M22 12c-6 0-10-4-10-10"/>
  </svg>
);

const PingPongIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="4" y="10" width="16" height="4" rx="1" />
    <path d="M12 14v6M10 20h4" />
    <circle cx="12" cy="6" r="2" fill="currentColor" />
  </svg>
);

const MmaIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <polygon points="12 2 19 9 12 16 5 9 12 2" />
    <polygon points="12 10 17 15 12 22 7 15 12 10" fill="currentColor"/>
  </svg>
);

const SportsSidebarContent: React.FC<SportsSidebarContentProps> = ({ isOpen, onViewChange, onToggle }) => {
  const { events, global1xBetMatches } = useBetting();
  const liveCount = global1xBetMatches?.length > 0 ? global1xBetMatches.length : events.filter((e: any) => e.isLive).length;
  
  const [activeMenu, setActiveMenu] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.includes('/canli')) return 'live';
      if (path.includes('/yaklasan')) return 'upcoming';
      if (path.includes('/hepsi')) return 'hepsi';
    }
    return '';
  });

  useEffect(() => {
    const handleSync = (e: any) => {
      const tab = e.detail;
      if (tab === 'canli') setActiveMenu('live');
      else if (tab === 'upcoming') setActiveMenu('upcoming');
      else if (tab === 'home' || tab === 'all') setActiveMenu('hepsi');
      else setActiveMenu('');
    };

    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.includes('/canli')) setActiveMenu('live');
      else if (path.includes('/yaklasan')) setActiveMenu('upcoming');
      else if (path.includes('/hepsi')) setActiveMenu('hepsi');
      else setActiveMenu('');
    };

    window.addEventListener('syncSportsMenu', handleSync);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('syncSportsMenu', handleSync);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [isTopSportsOpen, setIsTopSportsOpen] = useState(false);
  const [isFutbolOpen, setIsFutbolOpen] = useState(false);
  
  useEffect(() => {
    const handleLocationChange = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  useEffect(() => {
    if (window.location.pathname.endsWith('/bulten')) {
      setActiveMenu('bulten');
    }
  }, [currentPath]);

  const activeSlug = currentPath.startsWith('/spor/') ? currentPath.split('/')[2] : '';

  return (
    <div className="flex flex-col w-full text-slate-300 bg-transparent">
      <div className="flex flex-col w-full pt-2">
        
        {/* TOP SECTION */}
        <div className="flex flex-col gap-0 mb-4 mt-2">
          
          <button 
            onClick={() => { 
              setActiveMenu('canli'); 
              onViewChange('spor724'); 
              window.dispatchEvent(new CustomEvent('changeSportsTab', { detail: 'canli' }));
              if (window.innerWidth < 1024) onToggle?.();
            }}
            className={`flex items-center justify-between py-2.5 mb-1 cursor-pointer transition-all duration-300 relative group px-2 mx-2 rounded-xl ${activeMenu === 'canli' ? 'text-white bg-gradient-to-r from-white/10 to-transparent border-none' : 'text-[#8b92a5] hover:bg-white/5 hover:text-white border-none'}`}
          >
            {/* Island UI Glowing Indicator */}
            {activeMenu === 'canli' && <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-[4px] h-[50%] rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-300 z-10" />}
            <div className="flex items-center">
              <PlayCircle className={`w-5 h-5 min-w-[20px] transition-all duration-300 ml-2.5 ${activeMenu === 'canli' ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : 'text-[#8b92a5] group-hover:text-white group-hover:scale-110'}`} strokeWidth={activeMenu === 'canli' ? 2.5 : 2} />
              {isOpen && <span className="ml-4 font-semibold text-[14px] tracking-tight whitespace-nowrap">Canlı Etkinlikler</span>}
            </div>
            {isOpen && (
              <div className="bg-white/10 border border-white/20 px-2 py-0.5 rounded-md text-white shadow-[0_0_8px_rgba(255,255,255,0.2)] text-[11px] font-black">{liveCount}</div>
            )}
            {!isOpen && (
               <div className="absolute left-[calc(100%+12px)] top-auto bg-[#1a1d29] text-white px-2.5 py-1.5 rounded shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible whitespace-nowrap z-[999] transition-all font-bold text-xs">
                 Canlı Etkinlikler
               </div>
            )}
          </button>          <button 
            onClick={() => { 
              setActiveMenu('upcoming'); 
              onViewChange('spor724'); 
              window.dispatchEvent(new CustomEvent('changeSportsTab', { detail: 'upcoming' }));
              if (window.innerWidth < 1024) onToggle?.();
            }}
            className={`flex items-center justify-between py-2.5 mb-1 cursor-pointer transition-all duration-300 relative group px-2 mx-2 rounded-xl ${activeMenu === 'upcoming' ? 'text-white bg-gradient-to-r from-white/10 to-transparent border-none' : 'text-[#8b92a5] hover:bg-white/5 hover:text-white border-none'}`}
          >
            {activeMenu === 'upcoming' && <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-[4px] h-[50%] rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-300 z-10" />}
            <div className="flex items-center">
              <Clock className={`w-5 h-5 min-w-[20px] transition-all duration-300 ml-2.5 ${activeMenu === 'upcoming' ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : 'text-[#8b92a5] group-hover:text-white group-hover:scale-110'}`} strokeWidth={activeMenu === 'upcoming' ? 2.5 : 2} />
              {isOpen && <span className="ml-4 font-semibold text-[14px] tracking-tight whitespace-nowrap">Yaklaşanlar</span>}
            </div>
            {!isOpen && (
               <div className="absolute left-[calc(100%+12px)] top-auto bg-[#1a1d29] text-white px-2.5 py-1.5 rounded shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible whitespace-nowrap z-[999] transition-all font-bold text-xs">
                 Yaklaşanlar
               </div>
            )}
          </button>

          <button 
            onClick={() => { 
              setActiveMenu('tahminler'); 
              onViewChange('tahminler'); 
              if (window.innerWidth < 1024) onToggle?.();
            }}
            className={`flex items-center justify-between py-2.5 mb-1 cursor-pointer transition-all duration-300 relative group px-2 mx-2 rounded-xl ${activeMenu === 'tahminler' ? 'text-[color:var(--theme-accent)] bg-gradient-to-r from-[color:var(--theme-accent)]/15 to-transparent border-none shadow-[0_4px_20px_rgba(0,0,0,0.2)]' : 'text-[#8b92a5] hover:bg-white/5 hover:text-white border-none'}`}
          >
            {activeMenu === 'tahminler' && <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-[4px] h-[50%] rounded-full bg-[color:var(--theme-accent)] shadow-[0_0_12px_var(--theme-accent-glow)] transition-all duration-300 z-10" />}
            <div className="flex items-center">
              <Target className={`w-5 h-5 min-w-[20px] transition-all duration-300 ml-2.5 ${activeMenu === 'tahminler' ? 'text-[color:var(--theme-accent)] drop-shadow-[0_0_8px_var(--theme-accent-glow)] scale-110' : 'text-[#8b92a5] group-hover:text-white group-hover:scale-110'}`} strokeWidth={activeMenu === 'tahminler' ? 2.5 : 2} />
              {isOpen && <span className="ml-4 font-semibold text-[14px] tracking-tight whitespace-nowrap text-white">Tahminler</span>}
            </div>
            {!isOpen && (
               <div className="absolute left-[calc(100%+12px)] top-auto bg-[#1a1d29] text-white px-2.5 py-1.5 rounded shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible whitespace-nowrap z-[999] transition-all font-bold text-xs">
                 Tahminler
               </div>
            )}
          </button>

          <button 
            onClick={() => { 
              setActiveMenu('hepsi'); 
              onViewChange('spor724'); 
              window.dispatchEvent(new CustomEvent('changeSportsTab', { detail: 'home' }));
              if (window.innerWidth < 1024) onToggle?.();
            }}
            className={`flex items-center justify-between py-2.5 mb-1 cursor-pointer transition-all duration-300 relative group px-2 mx-2 rounded-xl ${activeMenu === 'hepsi' ? 'text-white bg-gradient-to-r from-white/10 to-transparent border-none' : 'text-[#8b92a5] hover:bg-white/5 hover:text-white border-none'}`}
          >
            {activeMenu === 'hepsi' && <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-[4px] h-[50%] rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-300 z-10" />}
            <div className="flex items-center">
              <LayoutGrid className={`w-5 h-5 min-w-[20px] transition-all duration-300 ml-2.5 ${activeMenu === 'hepsi' ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : 'text-[#8b92a5] group-hover:text-white group-hover:scale-110'}`} strokeWidth={activeMenu === 'hepsi' ? 2.5 : 2} />
              {isOpen && <span className="ml-4 font-semibold text-[14px] tracking-tight whitespace-nowrap">Hepsi</span>}
            </div>
            {!isOpen && (
               <div className="absolute left-[calc(100%+12px)] top-auto bg-[#1a1d29] text-white px-2.5 py-1.5 rounded shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible whitespace-nowrap z-[999] transition-all font-bold text-xs">
                 Hepsi
               </div>
            )}
          </button>

          <button 
            onClick={() => { 
              setActiveMenu('bahislerim'); 
              onViewChange('spor724'); 
              window.dispatchEvent(new CustomEvent('changeSportsTab', { detail: 'mybets' }));
              if (window.innerWidth < 1024) onToggle?.();
            }}
            className={`flex items-center justify-between py-2.5 mb-1 cursor-pointer transition-all duration-300 relative group px-2 mx-2 rounded-xl ${activeMenu === 'bahislerim' ? 'text-white bg-gradient-to-r from-white/10 to-transparent border-none' : 'text-[#8b92a5] hover:bg-white/5 hover:text-white border-none'}`}
          >
            {activeMenu === 'bahislerim' && <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-[4px] h-[50%] rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-300 z-10" />}
            <div className="flex items-center">
              <Receipt className={`w-5 h-5 min-w-[20px] transition-all duration-300 ml-2.5 ${activeMenu === 'bahislerim' ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : 'text-[#8b92a5] group-hover:text-white group-hover:scale-110'}`} strokeWidth={activeMenu === 'bahislerim' ? 2.5 : 2} />
              {isOpen && <span className="ml-4 font-semibold text-[14px] tracking-tight whitespace-nowrap">Takip Ettiklerim</span>}
            </div>
            {!isOpen && (
               <div className="absolute left-[calc(100%+12px)] top-auto bg-[#1a1d29] text-white px-2.5 py-1.5 rounded shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible whitespace-nowrap z-[999] transition-all font-bold text-xs">
                 Takip Ettiklerim
               </div>
            )}
          </button>


        </div>

        {/* Divider */}
        <div className="h-[1px] w-[calc(100%-24px)] mx-auto bg-white/5 mb-4"></div>

        {/* EN IYI SPORLAR */}
        {isOpen && (
           <div 
             className="px-5 mx-3 mb-3 mt-1 flex items-center justify-between cursor-pointer group"
             onClick={(e) => {
               e.stopPropagation();
               setIsTopSportsOpen(!isTopSportsOpen);
             }}
           >
             <span className="text-[11px] font-bold text-[#4b5563] uppercase tracking-[0.1em] group-hover:text-white transition-colors">EN İYİ SPORLAR</span>
             <ChevronDown className={`w-4 h-4 text-[#4b5563] group-hover:text-white transition-transform duration-300 ${isTopSportsOpen ? 'rotate-180' : ''}`} />
           </div>
        )}

        {(isTopSportsOpen || !isOpen) && (
        <div className="flex flex-col gap-1 mb-4">
          {[
            { id: 'futbol', name: 'Futbol', Icon: SoccerIcon, activeColor: 'text-[#10b981]', hoverColor: 'group-hover:text-white', bgGradient: 'from-[#10b981]/10', shadow: 'shadow-[0_0_15px_#10b981]', drop: '' },
            { id: 'cs2', name: 'CS2', Icon: Crosshair, activeColor: 'text-[#f59e0b]', hoverColor: 'group-hover:text-white', bgGradient: 'from-[#f59e0b]/10', shadow: 'shadow-[0_0_15px_#f59e0b]', drop: '' },
            { id: 'tenis', name: 'Tenis', Icon: TennisIcon, activeColor: 'text-[#eab308]', hoverColor: 'group-hover:text-white', bgGradient: 'from-[#eab308]/10', shadow: 'shadow-[0_0_15px_#eab308]', drop: '' },
            { id: 'basketbol', name: 'Basketbol', Icon: Dribbble, activeColor: 'text-[#f97316]', hoverColor: 'group-hover:text-white', bgGradient: 'from-[#f97316]/10', shadow: 'shadow-[0_0_15px_#f97316]', drop: '' },
            { id: 'fifa', name: 'FIFA', Icon: Gamepad2, activeColor: 'text-[#3b82f6]', hoverColor: 'group-hover:text-white', bgGradient: 'from-[#3b82f6]/10', shadow: 'shadow-[0_0_15px_#3b82f6]', drop: '' },
            { id: 'valorant', name: 'Valorant', Icon: Target, activeColor: 'text-[#f43f5e]', hoverColor: 'group-hover:text-white', bgGradient: 'from-[#f43f5e]/10', shadow: 'shadow-[0_0_15px_#f43f5e]', drop: '' },
            { id: 'voleybol', name: 'Voleybol', Icon: VolleyballIcon, activeColor: 'text-[#8b5cf6]', hoverColor: 'group-hover:text-white', bgGradient: 'from-[#8b5cf6]/10', shadow: 'shadow-[0_0_15px_#8b5cf6]', drop: '' },
            { id: 'masatenisi', name: 'Masa Tenisi', Icon: PingPongIcon, activeColor: 'text-[color:var(--theme-accent)]', hoverColor: 'group-hover:text-white', bgGradient: 'from-[color:var(--theme-accent)]/10', shadow: 'shadow-[0_0_15px_#06b6d4]', drop: '' },
            { id: 'formula1', name: 'Formula 1', Icon: Trophy, activeColor: 'text-[#ef4444]', hoverColor: 'group-hover:text-white', bgGradient: 'from-[#ef4444]/10', shadow: 'shadow-[0_0_15px_#ef4444]', drop: '' },
            { id: 'mma', name: 'MMA', Icon: MmaIcon, activeColor: 'text-[#dc2626]', hoverColor: 'group-hover:text-white', bgGradient: 'from-[#dc2626]/10', shadow: 'shadow-[0_0_15px_#dc2626]', drop: '' },
          ].map((sport) => {
             const isActive = activeSlug === sport.id;
             return (
             <button
               key={sport.id}
               onClick={() => {
                 window.history.pushState(null, '', `/spor/${sport.id}`);
                 window.dispatchEvent(new PopStateEvent('popstate'));
                 if (window.innerWidth < 1024) onToggle?.();
               }}
               className={`flex items-center justify-between py-3 mb-1.5 cursor-pointer transition-all duration-300 relative group px-2 mx-2 rounded-xl ${isActive ? 'bg-gradient-to-r from-white/10 to-transparent text-white' : 'text-[#8b92a5] hover:bg-white/5 hover:text-white border-none'} ${!isOpen ? 'justify-center' : ''}`}
             >
               {isActive && <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-[4px] h-[50%] rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)] z-10 transition-all duration-300"></div>}
               <div className="flex items-center">
                 <sport.Icon className={`w-5 h-5 min-w-[20px] transition-all duration-300 ml-2.5 ${isActive ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : 'text-[#8b92a5] group-hover:scale-110 group-hover:text-white'}`} />
                 {isOpen && <span className={`ml-4 font-semibold text-[14px] tracking-tight whitespace-nowrap transition-colors ${isActive ? 'text-white' : 'text-[#8b92a5] group-hover:text-white'}`}>{sport.name}</span>}
               </div>
               {!isOpen && (
                 <div className="absolute left-[calc(100%+12px)] top-auto bg-[#1a1d29] text-white px-2.5 py-1.5 rounded shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible whitespace-nowrap z-[999] transition-all font-bold text-xs">
                   {sport.name}
                 </div>
               )}
             </button>
             );
          })}
        </div>
        )}

        {/* Divider */}
        <div className="h-[1px] w-[calc(100%-24px)] mx-auto bg-white/5 mb-4"></div>

        {/* BOTTOM SPORTS */}
        <div className="flex flex-col gap-0">
          
          {/* Futbol Accordion (Formerly Spor) */}
          <div className="flex flex-col">
            <button
              onClick={() => {
                if (isOpen) {
                  setIsFutbolOpen(!isFutbolOpen);
                } else {
                  window.history.pushState(null, '', `/spor/futbol`);
                  window.dispatchEvent(new PopStateEvent('popstate'));
                  if (window.innerWidth < 1024) onToggle?.();
                }
              }}
              className={`flex items-center justify-between py-2.5 mb-1 cursor-pointer transition-all duration-200 relative group px-2 mx-3 ${isFutbolOpen ? 'text-white' : 'text-[#8b92a5] hover:text-white'} ${!isOpen ? 'justify-center' : ''}`}
            >
              <div className="flex items-center">
                <SoccerIcon className={`w-5 h-5 min-w-[20px] transition-colors ml-2.5 ${isFutbolOpen ? 'text-white' : 'text-[#8b92a5] group-hover:text-white'}`} />
                {isOpen && <span className={`ml-4 font-semibold text-[14px] tracking-tight whitespace-nowrap transition-colors ${isFutbolOpen ? 'text-white' : 'text-[#8b92a5] group-hover:text-white'}`}>Futbol</span>}
              </div>
              {isOpen && (
                 isFutbolOpen 
                 ? <ChevronUp className="w-4 h-4 text-white transition-colors" /> 
                 : <ChevronDown className="w-4 h-4 text-[#8b92a5] group-hover:text-white transition-colors" />
              )}
              {!isOpen && (
                <div className="absolute left-[calc(100%+12px)] top-auto bg-[#1a1d29] text-white px-2.5 py-1.5 rounded shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible whitespace-nowrap z-[999] transition-all font-bold text-xs">
                  Futbol
                </div>
              )}
            </button>
            
            {/* Submenu for Futbol */}
            {isOpen && isFutbolOpen && (
              <div className="flex flex-col pl-6 ml-5 border-l border-white/10 mb-2 relative">
                {[
                  { id: 'yaklasan', name: 'Yaklaşan', Icon: PlayCircle },
                  { id: 'uzun-vadeli', name: 'Uzun Vadeli Bahisler', Icon: Timer },
                  { id: 'uefa', name: 'UEFA Şampiyonlar Ligi', logoName: 'uefa-champions-league' },
                  { id: 'kulup', name: 'Kulüp Hazırlık Maçları', logoName: 'fifa-club-world-cup' },
                  { id: 'conmebol', name: 'CONMEBOL Sudamericana', logoName: 'conmebol-copa-amrica-2024' },
                  { id: 'tumunu-goruntule', name: 'Tümünü Görüntüle', Icon: LayoutGrid },
                ].map((sub: any) => (
                  <button
                    key={sub.id}
                    onClick={() => {
                      window.history.pushState(null, '', `/spor/futbol/${sub.id}`);
                      window.dispatchEvent(new PopStateEvent('popstate'));
                      if (window.innerWidth < 1024) onToggle?.();
                    }}
                    className="flex items-center py-2.5 mt-0.5 cursor-pointer text-[#8b92a5] hover:text-white transition-colors group"
                  >
                    {sub.logoName ? (
                      <div className="w-5 h-5 min-w-[20px] mr-3 bg-white/10 rounded-full flex items-center justify-center p-0.5 group-hover:bg-white/20 transition-colors shadow-inner overflow-hidden">
                        <PlayerLogo name={sub.logoName} fallbackLogo="" sport="futbol" />
                      </div>
                    ) : (
                      <sub.Icon className={`w-5 h-5 min-w-[20px] mr-3 ${sub.color ? sub.color : 'text-[#8b92a5] group-hover:text-white'} transition-colors ${sub.color ? 'bg-blue-500/20 rounded-full' : ''}`} />
                    )}
                    <span className="font-bold text-[13px] tracking-tight truncate max-w-[150px]">{sub.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {[
            { id: 'espor', name: 'Tüm Espor Oyunları', Icon: Gamepad2 },
            { id: 'yaris', name: 'Tüm Yarışlar', Icon: Flag },
          ].map((item) => (
             <button
               key={item.id}
               onClick={() => {
                 window.history.pushState(null, '', `/spor/${item.id}`);
                 window.dispatchEvent(new PopStateEvent('popstate'));
                 if (window.innerWidth < 1024) onToggle?.();
               }}
               className={`flex items-center justify-between py-2.5 mb-1 cursor-pointer transition-all duration-200 relative group px-2 mx-3 text-[#8b92a5] hover:text-white ${!isOpen ? 'justify-center' : ''}`}
             >
               <div className="flex items-center">
                 <item.Icon className="w-5 h-5 min-w-[20px] transition-colors ml-2.5 text-[#8b92a5] group-hover:text-white" />
                 {isOpen && <span className="ml-4 font-semibold text-[14px] tracking-tight whitespace-nowrap transition-colors text-[#8b92a5] group-hover:text-white">{item.name}</span>}
               </div>
               {isOpen && <ChevronDown className="w-4 h-4 text-[#8b92a5] group-hover:text-white transition-colors" />}
               {!isOpen && (
                 <div className="absolute left-[calc(100%+12px)] top-auto bg-[#1a1d29] text-white px-2.5 py-1.5 rounded shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible whitespace-nowrap z-[999] transition-all font-bold text-xs">
                   {item.name}
                 </div>
               )}
             </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SportsSidebarContent;
