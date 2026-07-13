import React, { useState } from 'react';
import {
  Menu, Home, Trophy, Star, Gamepad2, Plus, Minus,
  HelpCircle, ShieldCheck, Globe, PlayCircle, List,
  Activity, Target, Circle, Dribbble, Monitor, 
  Crosshair, Tv, Gift, Shield, Ticket, Users, MessageSquare, Send, ChevronLeft,
  BarChart3, Crown, Dices, Flame, ChevronUp, ChevronDown
} from 'lucide-react';
import { NavVisibility } from './Header';

interface MenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  view?: string;
  href?: string;
  visKey?: keyof NavVisibility;
  requireRole?: boolean;
  subItems?: MenuItem[];
}

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
  navVisibility,
  onStartTour,
}) => {
  // Track open state of accordions
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [isCasinoOpen, setIsCasinoOpen] = useState(false);
  const [isSporOpen, setIsSporOpen] = useState(false);
  const [isSponsorlukOpen, setIsSponsorlukOpen] = useState(false);

  const topGrid: MenuItem[] = [
    { id: 'canli', label: 'CANLI', icon: <Flame className="w-5 h-5 mb-1" />, view: 'sports' },
    { id: 'casino', label: 'CASINO', icon: <Target className="w-5 h-5 mb-1" />, view: 'blackjack' },
  ];

  const menuConfig: MenuItem[] = [
    { 
      id: 'senin-icin', 
      label: 'SENİN İÇİN SEÇİLDİ', 
      icon: <Star className="w-4 h-4 text-zinc-400" />,
      subItems: [
        { id: 'uefa', label: 'UEFA Avrupa Ligi', icon: <Globe className="w-4 h-4 text-[#00FFA3]/60" />, view: 'sports' },
        { id: 'wimbledon-w', label: 'Wimbledon Kadınlar Tenisi', icon: <Globe className="w-4 h-4 text-[#00FFA3]/60" />, view: 'sports' },
        { id: 'wimbledon-m', label: 'Wimbledon Tek Erkekler', icon: <Globe className="w-4 h-4 text-[#00FFA3]/60" />, view: 'sports' },
        { id: 'conference', label: 'UEFA Conference League', icon: <Globe className="w-4 h-4 text-[#00FFA3]/60" />, view: 'sports' },
      ]
    },
    {
      id: 'ana-sporlar',
      label: 'ANA SPORLAR',
      icon: <Trophy className="w-4 h-4 text-zinc-400" />,
      subItems: [
        { id: 'futbol', label: 'Futbol', icon: <Target className="w-4 h-4 text-zinc-400" />, view: 'sports' },
        { id: 'tenis', label: 'Tenis', icon: <Circle className="w-4 h-4 text-zinc-400" />, view: 'sports' },
        { id: 'basketbol', label: 'Basketbol', icon: <Dribbble className="w-4 h-4 text-zinc-400" />, view: 'sports' },
        { id: 'beyzbol', label: 'Beyzbol', icon: <Target className="w-4 h-4 text-zinc-400" />, view: 'sports' },
        { id: 'mma', label: 'MMA', icon: <Activity className="w-4 h-4 text-zinc-400" />, view: 'sports' }
      ]
    },
    {
      id: 'tum-sporlar',
      label: 'TÜM SPORLAR',
      icon: <List className="w-4 h-4 text-zinc-400" />,
      subItems: [
        { id: 'ragbi', label: 'Ragbi', icon: <Target className="w-4 h-4 text-zinc-400" />, view: 'sports' },
        { id: 'avustralya', label: 'Avustralya Futbolu', icon: <Target className="w-4 h-4 text-zinc-400" />, view: 'sports' },
        { id: 'hentbol', label: 'Hentbol', icon: <Target className="w-4 h-4 text-zinc-400" />, view: 'sports' },
        { id: 'kriket', label: 'Kriket', icon: <Target className="w-4 h-4 text-zinc-400" />, view: 'sports' },
        { id: 'voleybol', label: 'Voleybol', icon: <Target className="w-4 h-4 text-zinc-400" />, view: 'sports' },
        { id: 'dart', label: 'Dart', icon: <Target className="w-4 h-4 text-zinc-400" />, view: 'sports' },
        { id: 'boks', label: 'Boks', icon: <Target className="w-4 h-4 text-zinc-400" />, view: 'sports' },
        { id: 'buz-hokeyi', label: 'Buz Hokeyi', icon: <Target className="w-4 h-4 text-zinc-400" />, view: 'sports' },
        { id: 'masa-tenisi', label: 'Masa Tenisi', icon: <Circle className="w-4 h-4 text-zinc-400" />, view: 'sports' },
      ]
    },
    {
      id: 'tum-esporlar',
      label: 'TÜM E-SPORLAR',
      icon: <Gamepad2 className="w-4 h-4 text-zinc-400" />,
      subItems: [
        { id: 'efutbol', label: 'eFutbol', icon: <Globe className="w-4 h-4 text-zinc-400" />, view: 'esports' },
        { id: 'nba2k', label: 'NBA2K', icon: <Dribbble className="w-4 h-4 text-zinc-400" />, view: 'esports' },
        { id: 'cs2', label: 'CS2', icon: <Crosshair className="w-4 h-4 text-zinc-400" />, view: 'esports' },
        { id: 'dota2', label: 'Dota 2', icon: <Monitor className="w-4 h-4 text-zinc-400" />, view: 'esports' },
        { id: 'valorant', label: 'Valorant', icon: <Activity className="w-4 h-4 text-zinc-400" />, view: 'esports' },
        { id: 'lol', label: 'League of Legends', icon: <Shield className="w-4 h-4 text-zinc-400" />, view: 'esports' },
      ]
    },
    { id: 'analiz', label: '724BETS ANALİZ & CANLI BÜLTEN', icon: <BarChart3 className="w-4 h-4 text-[#00FFA3]" />, view: 'analysis' },
    { id: 'at-yarisi', label: 'AT YARIŞI', icon: <Activity className="w-4 h-4 text-zinc-400" />, view: 'sports' },
    { id: 'sss', label: 'SSS', icon: <HelpCircle className="w-4 h-4 text-zinc-400" /> },
    { id: 'kurallar', label: 'BAHİS KURALLARI', icon: <ShieldCheck className="w-4 h-4 text-zinc-400" /> },
    { id: 'oran', label: 'ORAN FORMATI', icon: <Globe className="w-4 h-4 text-zinc-400" />, subItems: [] },
  ];

  const extrasConfig: MenuItem[] = [
    {
      id: 'diger',
      label: 'DİĞER OYUNLAR',
      icon: <Target className="w-4 h-4 text-zinc-400" />,
      subItems: [
        { id: 'casino', label: '724Casino', icon: <Target className="w-4 h-4 text-zinc-400" />, view: 'blackjack', visKey: 'blackjack' },
        { id: 'live-casino', label: 'Canlı Casino', icon: <Target className="w-4 h-4 text-zinc-400" />, view: 'live-casino' },
        { id: 'toto', label: '724TOTO', icon: <Target className="w-4 h-4 text-zinc-400" />, view: 'pool', visKey: 'pool' },
        { id: 'loyalty', label: 'Görevler', icon: <Trophy className="w-4 h-4 text-zinc-400" />, view: 'loyalty', visKey: 'loyalty' },
        { id: 'trusted-sites', label: 'Güvenilir Siteler', icon: <Shield className="w-4 h-4 text-zinc-400" />, view: 'trusted-sites', visKey: 'trustedSites' },
        { id: 'giveaway', label: 'Çekiliş Yönetimi', icon: <Gift className="w-4 h-4 text-zinc-400" />, view: 'giveaway', requireRole: true },
      ]
    }
  ];

  const filterItems = (items: MenuItem[]) => {
    return items.filter((item) => {
      if (item.visKey && navVisibility?.[item.visKey] === false) return false;
      if (item.requireRole && !userRole) return false;
      return true;
    });
  };

  const renderNavList = (items: MenuItem[]) => {
    return filterItems(items).map((item) => {
      const hasSubItems = item.subItems && item.subItems.length > 0;
      const isOpenAccordion = openGroups[item.id];
      const isItemActive = item.view === activeView;
      
      return (
        <div 
          key={item.id} 
          className={`group mb-2 transition-all duration-300 rounded-lg ${
            item.subItems && isOpenAccordion 
              ? 'border border-[#00FFA3]/50 shadow-[0_0_15px_rgba(0,255,163,0.15)] bg-[#1A1D24]' 
              : 'border border-transparent hover:border-[#00FFA3]/30 hover:shadow-[0_0_15px_rgba(0,255,163,0.1)]'
          }`}
        >
          <div 
            onClick={() => {
              if (item.subItems) {
                setOpenGroups(prev => ({ ...prev, [item.id]: !prev[item.id] }));
              } else if (item.href) {
                window.open(item.href, '_blank');
              } else if (item.view) {
                onViewChange(item.view);
              }
            }}
            className={isOpen 
              ? `flex items-center justify-between px-4 py-3 cursor-pointer transition-all ${
                  item.subItems 
                    ? `bg-[#1A1D24] text-white rounded-t-lg border-b border-white/5` 
                    : isItemActive 
                      ? 'bg-[#1A253A] text-white border-l-2 border-[#00FFA3]' 
                      : 'hover:bg-[#00FFA3]/10 hover:text-white text-white/70 border-l-2 border-transparent'
                }`
              : `flex items-center justify-center w-12 h-12 rounded-xl transition-all mx-auto mb-1 cursor-pointer ${!item.subItems && isItemActive ? 'bg-[#00FFA3] text-black' : 'text-white/70 hover:bg-[#1A253A] hover:text-white'}`
            }
            title={!isOpen ? item.label : undefined}
          >
            {isOpen ? (
              <>
                <div className="flex items-center gap-3">
                  <span className={`flex-shrink-0 ${item.subItems || isItemActive ? 'text-white' : 'text-white/70'}`}>
                    {item.icon}
                  </span>
                  <span className={`text-[15px] font-bold tracking-wide ${item.subItems || isItemActive ? 'text-white' : 'text-white/70'}`}>
                    {item.label}
                  </span>
                </div>
                {item.subItems && (
                  <div className="flex items-center justify-center w-6 h-6 rounded bg-white/10 text-white hover:bg-white/20 transition-colors">
                    {isOpenAccordion ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                )}
              </>
            ) : (
              item.icon
            )}
          </div>

          {/* SubItems Render */}
          {isOpen && item.subItems && isOpenAccordion && (
            <div className="flex flex-col py-3 bg-[#161920] rounded-b-lg">
              {filterItems(item.subItems).map(sub => {
                const isSubActive = sub.view === activeView;
                return (
                  <div
                    key={sub.id}
                    onClick={() => sub.view && onViewChange(sub.view)}
                    className={`flex items-center gap-3 py-2.5 px-4 cursor-pointer transition-all ${
                      isSubActive ? 'text-[#00FFA3]' : 'text-zinc-200 hover:text-white hover:bg-[#00FFA3]/10 hover:text-white'
                    }`}
                  >
                    <span className={`flex-shrink-0 ${isSubActive ? 'text-[#00FFA3]' : 'text-white/70'}`}>{sub.icon}</span>
                    <span className="text-[14px] font-bold tracking-wide truncate">
                      {sub.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <>
      <style>{`
        .gamdom-sidebar-container {
          width: 100%;
          background-color: #0F1219;
          display: flex;
          flex-direction: column;
          height: 100%;
          position: relative;
          z-index: 10;
        }
        .gamdom-sidebar-inner {
          width: 100%;
          height: 100%;
          overflow-x: hidden;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          scrollbar-width: none; /* Hide scrollbar for Firefox */
          -ms-overflow-style: none; /* Hide scrollbar for IE/Edge */
        }
        .gamdom-sidebar-inner::-webkit-scrollbar {
          display: none; /* Hide scrollbar for Chrome/Safari/Opera */
        }
      `}</style>

      {/* Overlay for mobile */}
      <div className="sidebar-overlay" onClick={onToggle} style={{ display: 'none' }} />

      <div className={`gamdom-sidebar-container ${isOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
        <div className="gamdom-sidebar-inner pb-20">
          
          {/* Spacer to align sidebar content below Header */}
          <div className="h-[70px] w-full shrink-0 flex items-center px-4 pt-2">
             {isOpen && (
               <div className="flex items-center gap-1 ml-2 select-none">
                 <span className="text-white font-black text-2xl tracking-tighter" style={{ fontFamily: 'Inter, sans-serif' }}>
                   724<span className="text-[#00FFA3]">BETS</span>
                 </span>
               </div>
             )}
          </div>

          
          {/* Top 2x2 Grid */}
          {activeView !== 'kral' && (
            isOpen ? (
              <div className="grid grid-cols-2 gap-2 px-3 pb-3">
                {topGrid.map(item => {
                  const isActive = activeView === item.view;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (item.id === 'canli') {
                          window.dispatchEvent(new CustomEvent('internal-navigate', { detail: { url: 'https://bahisbey1438.com/tr/sport/live/football/?btag=59649488_330539' } }));
                        }
                        if (item.href) {
                          window.open(item.href, '_blank');
                        } else if (item.view) {
                          onViewChange(item.view);
                        }
                      }}
                      className={`flex flex-col items-center justify-center py-3 rounded-xl transition-all ${
                        isActive 
                          ? 'bg-[#00FFA3] text-black font-black' 
                          : 'bg-[#131C28] text-white/70 hover:bg-[#1A253A] hover:text-white font-bold'
                      }`}
                    >
                      {item.icon}
                      <span className="text-[11px] tracking-wider uppercase mt-1">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col gap-2 p-2 pb-3">
                {topGrid.map(item => {
                  const isActive = activeView === item.view;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (item.id === 'canli') {
                          window.dispatchEvent(new CustomEvent('internal-navigate', { detail: { url: 'https://bahisbey1438.com/tr/sport/live/football/?btag=59649488_330539' } }));
                        }
                        if (item.href) {
                          window.open(item.href, '_blank');
                        } else if (item.view) {
                          onViewChange(item.view);
                        }
                      }}
                      className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all mx-auto ${
                        isActive 
                          ? 'bg-[#00FFA3] text-black shadow-[0_0_15px_rgba(0,255,163,0.3)]' 
                          : 'bg-[#131C28] text-white/70 hover:bg-[#1A253A] hover:text-white'
                      }`}
                    >
                      {item.icon}
                    </button>
                  );
                })}
              </div>
            )
          )}

          {/* Unified 5 Menu Blocks (Casino, Spor, Kodu Kullan etc, Sponsorluk, Support) */}
          {activeView !== 'kral' && (
            <div className={`flex flex-col gap-1 px-3 py-2 ${!isOpen ? 'items-center' : ''}`}>
              
              {/* Block 1: Casino Accordion */}
              <div className={`flex flex-col ${!isOpen ? 'w-12 items-center' : 'w-full'}`}>
                <div 
                  onClick={() => setIsCasinoOpen(!isCasinoOpen)}
                  className={`flex items-center justify-between cursor-pointer rounded-xl hover:bg-[#00FFA3]/10 hover:text-white transition-colors ${isOpen ? 'py-3 px-3' : 'p-3 w-full justify-center'}`}
                >
                  <div className="flex items-center gap-3">
                    <Dices className="w-5 h-5 text-white/70 shrink-0" />
                    {isOpen && <span className="text-[13px] font-bold text-white tracking-wide">Casino</span>}
                  </div>
                  {isOpen && <ChevronLeft className={`w-4 h-4 text-white/70 transition-transform ${isCasinoOpen ? '-rotate-90' : ''}`} />}
                </div>
                
                {isOpen && isCasinoOpen && (
                  <div className="flex flex-col py-1">
                    <div onClick={() => onViewChange('blackjack')} className="flex items-center gap-3 py-2.5 px-4 pl-12 cursor-pointer hover:bg-[#00FFA3]/10 hover:text-white text-[#888] hover:text-zinc-200">
                      <span className="text-[13px] font-medium tracking-wide">724Casino / Slotlar</span>
                    </div>
                    <div onClick={() => onViewChange('blackjack')} className="flex items-center gap-3 py-2.5 px-4 pl-12 cursor-pointer hover:bg-[#00FFA3]/10 hover:text-white text-[#888] hover:text-zinc-200">
                      <span className="text-[13px] font-medium tracking-wide">Canlı Casino</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Block 2: Spor Link */}
              <div className={`flex flex-col mt-1 ${!isOpen ? 'w-12 items-center' : 'w-full'}`}>
                <div onClick={() => onViewChange('sports')} className={`flex items-center gap-3 cursor-pointer rounded-xl hover:bg-[#00FFA3]/10 hover:text-white transition-colors ${isOpen ? 'py-3 px-3' : 'p-3 w-full justify-center'}`}>
                  <Activity className="w-5 h-5 text-white/70 shrink-0" />
                  {isOpen && <span className="text-[13px] font-bold text-white tracking-wide">Spor</span>}
                </div>
                <div onClick={() => onViewChange('sports-beta')} className={`flex items-center gap-3 cursor-pointer rounded-xl hover:bg-[#00FFA3]/10 hover:text-[#00FFA3] transition-colors ${isOpen ? 'py-3 px-3' : 'p-3 w-full justify-center'}`}>
                  <Activity className="w-5 h-5 text-[#00FFA3] shrink-0" />
                  {isOpen && <span className="text-[13px] font-bold text-[#00FFA3] tracking-wide">Spor 2 (Özel)</span>}
                </div>
              </div>

              <div className="w-full h-px bg-white/5 my-2"></div>

              {/* Block 3: Kodu Kullan etc. */}
              <div className={`flex flex-col mt-1 ${!isOpen ? 'w-12 items-center' : 'w-full'}`}>
                <div onClick={() => onViewChange('promo')} className={`flex items-center gap-3 cursor-pointer rounded-xl hover:bg-[#00FFA3]/10 hover:text-white transition-colors ${isOpen ? 'py-3 px-3' : 'p-3 w-full justify-center'}`}>
                  <Ticket className="w-5 h-5 text-white/70 shrink-0" />
                  {isOpen && <span className="text-[13px] font-bold text-white tracking-wide">Kodu Kullan</span>}
                </div>
                <div onClick={() => onViewChange('referral')} className={`flex items-center gap-3 cursor-pointer rounded-xl hover:bg-[#00FFA3]/10 hover:text-white transition-colors ${isOpen ? 'py-3 px-3' : 'p-3 w-full justify-center'}`}>
                  <Users className="w-5 h-5 text-white/70 shrink-0" />
                  {isOpen && <span className="text-[13px] font-bold text-white tracking-wide">Arkadaşını Davet Et</span>}
                </div>
                <div className={`flex items-center gap-3 cursor-pointer rounded-xl hover:bg-[#00FFA3]/10 hover:text-white transition-colors ${isOpen ? 'py-3 px-3' : 'p-3 w-full justify-center'}`}>
                  <Send className="w-5 h-5 text-white/70 shrink-0" />
                  {isOpen && <span className="text-[13px] font-bold text-white tracking-wide">Telegram</span>}
                </div>
                <div className={`flex items-center gap-3 cursor-pointer rounded-xl hover:bg-[#00FFA3]/10 hover:text-white transition-colors ${isOpen ? 'py-3 px-3' : 'p-3 w-full justify-center'}`}>
                  <div className="w-5 h-5 text-white/70 shrink-0 flex items-center justify-center border border-zinc-300 rounded-sm">
                    <span className="text-[10px] font-black leading-none">↓</span>
                  </div>
                  {isOpen && <span className="text-[13px] font-bold text-white tracking-wide">Uygulamayı İndir</span>}
                </div>
              </div>

              <div className="w-full h-px bg-white/5 my-2"></div>

              {/* Block 4: Sponsorluk Accordion */}
              <div className={`flex flex-col mt-1 ${!isOpen ? 'w-12 items-center' : 'w-full'}`}>
                <div 
                  onClick={() => setIsSponsorlukOpen(!isSponsorlukOpen)}
                  className={`flex items-center justify-between cursor-pointer rounded-xl hover:bg-[#00FFA3]/10 hover:text-white transition-colors ${isOpen ? 'py-3 px-3' : 'p-3 w-full justify-center'}`}
                >
                  <div className="flex items-center gap-3">
                    <Crown className="w-5 h-5 text-white/70 shrink-0" />
                    {isOpen && <span className="text-[13px] font-bold text-white tracking-wide">Sponsorluk</span>}
                  </div>
                  {isOpen && <ChevronLeft className={`w-4 h-4 text-white/70 transition-transform ${isSponsorlukOpen ? '-rotate-90' : ''}`} />}
                </div>
                
                {isOpen && isSponsorlukOpen && (
                  <div className="flex flex-col py-1">
                    <div className="flex items-center gap-3 py-2.5 px-4 pl-12 text-[#888] text-[13px] font-medium">
                      <span>Sponsorluk Anlaşmaları Yakında...</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="w-full h-px bg-white/5 my-2"></div>

              {/* Block 5: Canlı Destek & Türkçe */}
              <div className={`flex flex-col mt-1 ${!isOpen ? 'w-12 items-center' : 'w-full'}`}>
                <div 
                  onClick={() => window.dispatchEvent(new Event('openSupportChat'))}
                  className={`flex items-center gap-3 cursor-pointer rounded-xl hover:bg-[#00FFA3]/10 hover:text-white transition-colors ${isOpen ? 'py-3 px-3' : 'p-3 w-full justify-center'}`}
                >
                  <MessageSquare className="w-5 h-5 text-white/70 shrink-0 fill-current" />
                  {isOpen && <span className="text-[13px] font-bold text-white tracking-wide">Canlı Destek</span>}
                </div>
                <div className={`flex items-center justify-between cursor-pointer rounded-xl hover:bg-[#00FFA3]/10 hover:text-white transition-colors ${isOpen ? 'py-3 px-3' : 'p-3 w-full justify-center'}`}>
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-white/70 shrink-0" />
                    {isOpen && <span className="text-[13px] font-bold text-white tracking-wide">Türkçe</span>}
                  </div>
                  {isOpen && <ChevronLeft className="w-4 h-4 text-white/70 -rotate-90" />}
                </div>
              </div>

            </div>
          )}

          {/* Extras / Other Games */}
          {activeView === 'kral' && (
            <div className="flex flex-col bg-[#0F1219]">
              {renderNavList(extrasConfig)}
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default Sidebar;
