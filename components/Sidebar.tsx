"use client";
import React from 'react';
import { 
  Crown, Cherry, Tv, Radio, Percent, Diamond, Users, Gift, FileText, Headphones, Target, Menu, Globe, Ticket
} from 'lucide-react';
import SportsSidebarContent from './SportsSidebarContent';

interface SidebarProps {
  isOpen: boolean;
  onToggle?: () => void;
  activeView: string;
  onViewChange: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle, activeView, onViewChange }) => {
  const isSportsView = ['sports', 'spor724', 'gercek', 'upcomingMatches'].includes(activeView);
  const isCasinoView = ['casino', 'slots', 'live-casino', 'originals'].includes(activeView);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, route: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (route === 'openChat') {
      window.dispatchEvent(new CustomEvent('openSupportChat'));
    } else if (route === 'openLang') {
      // Dil degistirme eylemi
    } else {
      onViewChange(route);
    }
    
    if (window.innerWidth < 1024 && onToggle) {
      onToggle();
    }
  };

  const menuItems = [
    { id: 'home', label: 'Anasayfa', icon: Crown, route: 'home' },
    { type: 'spacer', height: 'h-3' },
    { id: 'live-casino', label: 'Canlı Casino', icon: Tv, route: 'live-casino' },
    { id: 'originals', label: 'Originals', icon: Radio, route: 'originals' },
    { id: 'promo', label: 'Promosyonlar', icon: Percent, route: 'promo' },
    { type: 'spacer', height: 'h-4' },
    { id: 'vip-club', label: 'VIP Kulübü', icon: Diamond, route: 'vip-club' },
    { id: 'affiliate', label: 'İş Ortaklığı', icon: Users, route: 'affiliate/overview' },
  ];

  const bottomItems = [
    { id: 'tv', label: '724TV', icon: Tv, route: '724tv' },
    { id: 'docs', label: 'Kullanım Şartları', icon: FileText, route: 'docs' },
    { id: 'support', label: 'Canlı Destek', icon: Headphones, route: 'openChat' },
    { id: 'lang', label: 'Dil', icon: Globe, route: 'openLang' }
  ];

  const renderLink = (item: any) => {
    if (item.type === 'spacer') {
      return <div key={Math.random()} className={`w-full ${item.height} relative z-[9999]`} />;
    }

    const isActive = activeView === item.route;
    const href = item.route === 'home' ? '/' : (['openChat', 'openLang'].includes(item.route) ? '#' : `/${item.route}`);

    return (
      <a
        key={item.id}
        href={href}
        onClick={(e) => handleNavClick(e, item.route)}
        className={`w-full flex items-center py-3 cursor-pointer transition-colors duration-200 relative group text-left border-none bg-transparent outline-none z-[9999] pointer-events-auto
          ${isActive ? 'text-white' : 'text-[#8b92a5] hover:text-white'}
          ${isOpen ? 'px-6' : 'px-4 justify-center'}
        `}
      >
        {/* Active Pill Indicator */}
        {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] bg-[#00E5FF] shadow-[0_0_10px_#00E5FF] rounded-r-md z-10" />}
        
        <item.icon className={`w-[22px] h-[22px] min-w-[22px] transition-colors ${isActive ? 'text-white' : 'text-[#8b92a5] group-hover:text-white'} ${!isOpen ? 'mx-auto' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
        
        <span className={`ml-4 font-semibold text-[15px] tracking-tight whitespace-nowrap transition-all duration-300 ${!isOpen ? 'opacity-0 translate-x-4 w-0 hidden' : 'opacity-100'}`}>
          {item.label}
        </span>

        {/* Tooltip for collapsed mode */}
        {!isOpen && (
          <div className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 bg-[#1b2230] text-white px-3 py-1.5 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible whitespace-nowrap z-[99999] transition-all border border-white/10 font-bold text-xs pointer-events-none">
            {item.label}
          </div>
        )}
      </a>
    );
  };

  return (
    <div className={`relative z-[99999] pointer-events-auto flex flex-col h-full bg-[#0A0D14] transition-[width] duration-300 ${isOpen ? 'w-[280px]' : 'w-[78px]'}`}>
      
      {/* Top Header: Menu Toggle + Horizontal Nav Toggle */}
      <div className={`h-[72px] flex items-center px-4 shrink-0 transition-all duration-300 relative z-[99999] pointer-events-auto gap-3`}>
        <button 
          onClick={onToggle}
          className={`w-10 h-10 flex flex-shrink-0 items-center justify-center text-[#8b92a5] hover:text-white rounded-xl transition-all relative z-[99999] pointer-events-auto cursor-pointer`}
        >
          <Menu className="w-[26px] h-[26px]" strokeWidth={2} />
        </button>

        {/* Horizontal Toggle for Casino / Spor */}
        <div className={`flex-1 flex items-center bg-[#131823] p-1 rounded-xl h-[44px] transition-all duration-300 relative z-[99999] pointer-events-auto border border-white/5 ${!isOpen ? 'opacity-0 w-0 hidden' : 'opacity-100'}`}>
          <button 
            onClick={() => { onViewChange('casino'); if (window.innerWidth < 1024) onToggle?.(); }}
            className={`flex-1 flex items-center justify-center h-full rounded-lg font-bold text-[14px] transition-all duration-300 cursor-pointer pointer-events-auto z-[99999] ${isCasinoView ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]' : 'text-[#8b92a5] hover:text-white border border-transparent'}`}
          >
            <Cherry className={`w-[18px] h-[18px] mr-2 transition-colors ${isCasinoView ? 'text-purple-400' : ''}`} />
            Casino
          </button>
          <button 
            onClick={() => { onViewChange('spor724'); if (window.innerWidth < 1024) onToggle?.(); }}
            className={`flex-1 flex items-center justify-center h-full rounded-lg font-bold text-[14px] transition-all duration-300 cursor-pointer pointer-events-auto z-[99999] ${isSportsView ? 'bg-gradient-to-r from-[#22c55e]/20 to-[#10b981]/20 border border-[#22c55e]/30 text-white shadow-[0_0_15px_rgba(34,197,94,0.3)]' : 'text-[#8b92a5] hover:text-white border border-transparent'}`}
          >
            <Target className={`w-[18px] h-[18px] mr-2 transition-colors ${isSportsView ? 'text-[#22c55e]' : ''}`} />
            Spor
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden pt-2 pb-4 relative z-[99999] pointer-events-auto">
        
        {/* Weekly Giveaway Banner */}
        {(!isSportsView) && (
          <div className={`mx-4 mb-6 mt-2 relative overflow-hidden rounded-2xl bg-[#131823] p-4 cursor-pointer transition-all border border-white/5 ${!isOpen && 'hidden'}`} onClick={() => onViewChange('cekilis')}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-[42px] h-[32px] flex flex-shrink-0 items-center justify-center">
                 <Ticket className="w-8 h-8 text-[#FFB800]" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <div className="text-white font-black text-[22px] leading-none tracking-tight">$20.000</div>
                <div className="text-[#FFB800] text-[10px] font-bold tracking-widest mt-1">HAFTALIK ÇEKİLİŞ</div>
              </div>
              <div className="text-white font-bold text-[13px] bg-white/5 px-2.5 py-1 rounded-md">
                6g
              </div>
            </div>
            <div className="w-full h-[1px] bg-white/5 mb-3" />
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[#8b92a5] text-[9px] font-bold tracking-wider mb-0.5">GÜNLÜK</span>
                <span className="text-white font-bold text-[13px]">$25K</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[#8b92a5] text-[9px] font-bold tracking-wider mb-0.5">HAFTALIK</span>
                <span className="text-white font-bold text-[13px]">$100K</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[#8b92a5] text-[9px] font-bold tracking-wider mb-0.5">AYLIK</span>
                <span className="text-white font-bold text-[13px]">$500K</span>
              </div>
            </div>
          </div>
        )}

        {/* Main Menu Items or Sports Content */}
        {isSportsView ? (
          <SportsSidebarContent isOpen={isOpen} onViewChange={onViewChange} onToggle={onToggle} />
        ) : (
          <nav className="flex flex-col w-full relative z-[99999] pointer-events-auto">
            {menuItems.map(item => renderLink(item))}
          </nav>
        )}

      </div>

      {/* Bottom Sticky Section */}
      <div className="w-full flex flex-col pt-4 pb-4 gap-1 border-t border-white/5 bg-[#0A0D14] mt-auto relative z-[99999] pointer-events-auto">
        <nav className="flex flex-col w-full relative z-[99999] pointer-events-auto">
          {bottomItems.map(item => renderLink(item))}
        </nav>
      </div>

    </div>
  );
};

export default Sidebar;