import React, { useState } from 'react';
import {
  Menu, Home, Trophy, Star, Gamepad2, Plus, Minus,
  HelpCircle, ShieldCheck, Globe, PlayCircle, List,
  Activity, Target, Circle, Dribbble, Monitor, 
  Crosshair, Tv, Gift, Shield, Ticket, Users, MessageSquare, Send, ChevronLeft,
  BarChart3
} from 'lucide-react';
import { NavVisibility } from './Header';

interface MenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  view?: string;
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

  const topGrid = [
    { id: 'lobi', label: 'LOBİ', icon: <Home className="w-5 h-5 mb-1" />, view: 'home' },
    { id: 'esports', label: 'E-SPORLAR', icon: <Gamepad2 className="w-5 h-5 mb-1" />, view: 'esports' },
    { id: 'canli', label: 'CANLI', icon: <PlayCircle className="w-5 h-5 mb-1" />, view: 'sports2' },
    { id: 'bahislerim', label: 'BAHİSLERİM', icon: <List className="w-5 h-5 mb-1" />, view: 'coupons' },
  ];

  const menuConfig: MenuItem[] = [
    { id: 'tv', label: '724TV', icon: <Tv className="w-4 h-4 text-zinc-400" />, view: '724tv' },
    { id: 'analysis', label: 'ANALİZLER', icon: <BarChart3 className="w-4 h-4 text-zinc-400" />, view: 'analysis', visKey: 'analysis' },
    { id: 'cekilis', label: 'ÇEKİLİŞ', icon: <Gift className="w-4 h-4 text-zinc-400" />, view: 'cekilis', visKey: 'cekilis' },
    { id: 'raffle', label: 'BİLET', icon: <Ticket className="w-4 h-4 text-zinc-400" />, view: 'raffle', visKey: 'raffle' },
    { id: 'fifa', label: 'FIFA DÜNYA KUPASI', icon: <Trophy className="w-4 h-4 text-zinc-400" />, view: 'sports' },
    { 
      id: 'senin-icin', 
      label: 'SENİN İÇİN SEÇİLDİ', 
      icon: <Star className="w-4 h-4 text-zinc-400" />,
      subItems: [
        { id: 'fifa-sub', label: 'FIFA Dünya Kupası', icon: <Globe className="w-4 h-4 text-[#00FFA3]/60" />, view: 'sports' },
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
        <div key={item.id} className="flex flex-col">
          <div 
            onClick={() => {
              if (item.subItems) {
                setOpenGroups(prev => ({ ...prev, [item.id]: !prev[item.id] }));
              } else if (item.view) {
                onViewChange(item.view);
              }
            }}
            className={isOpen 
              ? `flex items-center justify-between px-4 py-3 cursor-pointer transition-all ${!item.subItems && isItemActive ? 'bg-[#1A253A] text-white border-l-2 border-[#00FFA3]' : 'hover:bg-white/5 text-[#A0A0A0] border-l-2 border-transparent'} mx-0`
              : `flex items-center justify-center w-12 h-12 rounded-lg transition-all mx-auto mb-1 cursor-pointer ${!item.subItems && isItemActive ? 'bg-[#00FFA3] text-black' : 'text-zinc-400 hover:bg-[#1A253A] hover:text-white'}`
            }
            title={!isOpen ? item.label : undefined}
          >
            {isOpen ? (
              <>
                <div className="flex items-center gap-3">
                  <span className={`flex-shrink-0 ${!item.subItems && isItemActive ? 'text-[#00FFA3]' : 'text-zinc-400'}`}>
                    {item.icon}
                  </span>
                  <span className={`text-[12px] font-bold tracking-wider ${!item.subItems && isItemActive ? 'text-white' : 'text-[#A0A0A0]'}`}>
                    {item.label}
                  </span>
                </div>
                {item.subItems && (
                  <div className="flex items-center justify-center w-5 h-5 rounded bg-[#1A253A] text-[#00FFA3] shadow-sm shadow-black/20 hover:scale-105 transition-transform">
                    {isOpenAccordion ? <Minus className="w-3.5 h-3.5 stroke-[3]" /> : <Plus className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                )}
              </>
            ) : (
              item.icon
            )}
          </div>

          {/* SubItems Render */}
          {isOpen && item.subItems && isOpenAccordion && (
            <div className="flex flex-col mt-0.5 mb-1 bg-[#090C12]/50 py-1 border-l-2 border-transparent">
              {filterItems(item.subItems).map(sub => {
                const isSubActive = sub.view === activeView;
                return (
                  <div
                    key={sub.id}
                    onClick={() => sub.view && onViewChange(sub.view)}
                    className={`flex items-center gap-3 py-2 px-4 pl-12 cursor-pointer transition-all ${
                      isSubActive ? 'text-[#00FFA3]' : 'text-[#888] hover:bg-white/5 hover:text-zinc-200'
                    }`}
                  >
                    <span className="flex-shrink-0 opacity-80">{sub.icon}</span>
                    <span className="text-[13px] font-medium tracking-wide truncate">
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
        @media (max-width: 767px) {
          .gamdom-sidebar-container {
            display: none !important;
          }
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
        
        {/* Toggle / Expand Button overlay */}
        <div className="absolute top-[85px] right-0 z-50 overflow-visible pointer-events-none">
           <button 
             onClick={onToggle} 
             className="w-7 h-10 bg-[#161C28] hover:bg-[#1C2333] border border-l-0 border-[#2A3441]/40 flex items-center justify-center text-zinc-400 hover:text-white rounded-r-md cursor-pointer pointer-events-auto transition-all shadow-md transform translate-x-full"
           >
             {isOpen ? <ChevronLeft className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
           </button>
        </div>

        <div className="gamdom-sidebar-inner pb-20">
          
          {/* Spacer to align sidebar content below Header */}
          <div className="h-[60px] w-full shrink-0 border-b border-white/5 bg-[#0F1219]"></div>

          
          {/* Top 2x2 Grid */}
          {isOpen ? (
            <div className="grid grid-cols-2 gap-2 p-3 border-b border-white/5 bg-[#0F1219]">
              {topGrid.map(item => {
                const isActive = activeView === item.view;
                return (
                  <button
                    key={item.id}
                    onClick={() => item.view && onViewChange(item.view)}
                    className={`flex flex-col items-center justify-center py-3 rounded-lg transition-all ${
                      isActive 
                        ? 'bg-[#00FFA3] text-black font-black' 
                        : 'bg-[#131C28] text-zinc-400 hover:bg-[#1A253A] hover:text-white font-bold'
                    }`}
                  >
                    {item.icon}
                    <span className="text-[11px] tracking-wider uppercase mt-1">{item.label}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col gap-2 p-2 pb-1 border-b border-white/5 bg-[#0F1219]">
              {topGrid.map(item => {
                const isActive = activeView === item.view;
                return (
                  <button
                    key={item.id}
                    onClick={() => item.view && onViewChange(item.view)}
                    className={`flex items-center justify-center w-12 h-12 rounded-lg transition-all mx-auto ${
                      isActive 
                        ? 'bg-[#00FFA3] text-black' 
                        : 'bg-[#131C28] text-zinc-400 hover:bg-[#1A253A] hover:text-white'
                    }`}
                  >
                    {item.icon}
                  </button>
                );
              })}
            </div>
          )}

          {/* Main Menu List */}
          <div className="flex flex-col bg-[#0F1219] pt-2">
            {renderNavList(menuConfig)}
          </div>

          <div className="w-full h-px bg-white/5 my-2"></div>

          {/* Extras / Other Games */}
          <div className="flex flex-col bg-[#0F1219]">
            {renderNavList(extrasConfig)}
          </div>

        </div>
      </div>
    </>
  );
};

export default Sidebar;
