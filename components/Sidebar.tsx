import React, { useState } from 'react';
import {
  Menu, Trophy, Star, Target, Gift, Ticket, Globe, Crown, ChevronDown, ChevronUp, 
  Sparkles, Cherry, Percent, Headphones, FileText, Copy, Radio, Flame, LayoutDashboard, 
  Gamepad2, Zap, Diamond, Calendar, Tv, Dices, ChevronLeft, ChevronRight, Clock, Search, LogOut, Clover, Play
} from 'lucide-react';
import { NavVisibility } from './Header';
import { useLanguage } from '../contexts/LanguageContext';
import { useBetting } from '../contexts/BettingContext';
import SportsSidebarContent from './SportsSidebarContent';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  activeView: string;
  onViewChange: (view: string) => void;
  userRole?: string | null;
  siteUser?: any | null;
  navVisibility?: NavVisibility;
  onStartTour?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  activeView,
  onViewChange,
  siteUser
}) => {
  const { t } = useLanguage();
  const { setActiveSport } = useBetting();

  // Accordion states
  const [isCasinoOpen, setIsCasinoOpen] = useState(false);
  const [isOriginalsOpen, setIsOriginalsOpen] = useState(false);
  const [isPromoOpen, setIsPromoOpen] = useState(true); // Promosyonlar expanded in screenshot

  const isSportsView = ['sports', 'spor724', 'gercek', 'upcomingMatches'].includes(activeView);
  const isCasinoView = ['casino', 'slots', 'live-casino', 'originals'].includes(activeView);

  const NavItem = ({ icon: Icon, label, isActive, onClick, iconColor = 'text-[#8b92a5]', activeIconColor = 'text-white' }: any) => (
    <div 
      className={`flex items-center py-2.5 mb-1 cursor-pointer transition-all duration-200 relative group px-2 rounded-lg mx-3
        ${isActive ? 'bg-[#242d40] text-white shadow-sm' : 'text-[#8b92a5] hover:text-white hover:bg-[#242d40]'}
      `}
      onClick={onClick}
    >
      {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] bg-[#1075fc] rounded-r-md z-10"></div>}
      <Icon className={`w-5 h-5 min-w-[20px] transition-colors ml-2 ${isActive ? activeIconColor : iconColor + ' group-hover:text-white'}`} />
      
      <span className={`ml-4 font-semibold text-[14px] tracking-tight whitespace-nowrap transition-all duration-300 ${!isOpen && 'opacity-0 translate-x-4 w-0 hidden'}`}>
        {label}
      </span>
      
      {/* Flyout for collapsed state */}
      {!isOpen && (
        <div className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 bg-[#1b2230] text-white px-2.5 py-1.5 rounded shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible whitespace-nowrap z-[999] transition-all border border-white/10 font-bold text-xs">
          {label}
        </div>
      )}
    </div>
  );

  const AccordionItem = ({ icon: Icon, label, isOpenState, setIsOpenState, children }: any) => {
    return (
      <div className={`relative group mx-3 mb-2 transition-all duration-300 rounded-lg ${isOpen ? 'overflow-hidden' : ''} bg-[#242d40] border ${isOpenState ? 'border-white/5' : 'border-transparent hover:border-white/5'}`}>
        <div 
          className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-all duration-300 text-white`}
          onClick={() => {
            if (isOpen) setIsOpenState(!isOpenState);
          }}
        >
          <div className="flex items-center">
            <Icon className={`w-5 h-5 min-w-[20px] text-white`} />
            <span className={`ml-4 font-semibold text-[14px] whitespace-nowrap transition-all duration-300 ${!isOpen && 'opacity-0 hidden'}`}>
              {label}
            </span>
          </div>
          {isOpen && (
            <ChevronDown className={`w-4 h-4 text-[#8b92a5] transition-transform duration-300 ${isOpenState ? 'rotate-180' : ''}`} />
          )}
        </div>

        {/* Submenu for Expanded State */}
        {isOpen && isOpenState && (
          <div className="pb-2 pt-1 px-1">
            {children}
          </div>
        )}

        {/* Flyout Submenu for Collapsed State */}
        {!isOpen && (
          <div className="absolute left-[calc(100%+8px)] top-0 bg-[#1b2230] rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible z-[999] transition-all border border-white/10 min-w-[200px] overflow-hidden">
            <div className="px-4 py-3 border-b border-white/5 bg-[#141a25]">
              <span className="font-bold text-white text-sm">{label}</span>
            </div>
            <div className="py-2">
              {children}
            </div>
          </div>
        )}
      </div>
    );
  };

  const SubMenuItem = ({ label, isActive, onClick }: any) => (
    <div 
      className={`px-3 py-2 mx-2 rounded-md cursor-pointer transition-colors whitespace-nowrap text-[13px] font-semibold flex items-center
        ${isOpen ? 'pl-11 relative before:absolute before:left-[24px] before:top-1/2 before:w-1.5 before:h-1.5 before:bg-[#4b5563] before:rounded-full before:-translate-y-1/2' : 'hover:bg-white/5'}
        ${isActive ? 'text-white before:!bg-white bg-white/5' : 'text-[#8b92a5] hover:text-white hover:bg-white/5'}
      `}
      onClick={onClick}
    >
      {label}
    </div>
  );

  return (
    <>
      <style>{`
        .codinglab-sidebar {
          background-color: transparent;
          transition: all 0.4s ease;
          position: relative;
          z-index: 100;
          display: flex;
          flex-direction: column;
          height: 100%;
          width: 100%;
        }
        .codinglab-sidebar.open {
          width: 100%;
        }
        .codinglab-sidebar.closed {
          width: 100%;
        }
        .codinglab-sidebar-inner {
          flex: 1;
        }
        .codinglab-sidebar.open .codinglab-sidebar-inner {
          overflow-y: auto;
          overflow-x: hidden;
        }
        .codinglab-sidebar.closed .codinglab-sidebar-inner {
          overflow-y: visible;
          overflow-x: visible;
        }
        .codinglab-sidebar-inner::-webkit-scrollbar {
          width: 4px;
        }
        .codinglab-sidebar-inner::-webkit-scrollbar-track {
          background: transparent;
        }
        .codinglab-sidebar-inner::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
      `}</style>

      {/* Mobile Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onToggle} />
      )}

      <div className={`codinglab-sidebar ${isOpen ? 'open' : 'closed'}`}>

        <div className="codinglab-sidebar-inner pt-2 pb-4">
          
          {/* Vertical Toggle Box for Collapsed State */}
          {!isOpen && (
            <div className="flex flex-col items-center bg-[#1b2230] p-1 rounded-[8px] w-12 mx-auto mb-6">
              <button onClick={() => onViewChange('casino')} className={`w-10 h-10 flex items-center justify-center rounded-[6px] transition-colors mb-1 ${activeView !== 'spor724' ? 'bg-[#0f7bff] text-white shadow-md' : 'text-gray-400 hover:text-white'}`}>
                <Cherry className="w-5 h-5" />
              </button>
              <button onClick={() => onViewChange('spor724')} className={`w-10 h-10 flex items-center justify-center rounded-[6px] transition-colors ${activeView === 'spor724' ? 'bg-[#0f7bff] text-white shadow-md' : 'text-gray-400 hover:text-white'}`}>
                <Target className="w-5 h-5" />
              </button>
            </div>
          )}

          {isSportsView ? (
            <SportsSidebarContent isOpen={isOpen} onViewChange={onViewChange} />
          ) : (
            <>
              {/* LOGGED IN USER MENU */}
              {/* HAFTALIK ÇEKİLİŞ BANNER */}
              <div className={`mx-4 mb-6 relative overflow-hidden rounded-xl bg-[#1b2230] p-3 cursor-pointer transition-all ${!isOpen && 'hidden'}`}>
                <div className="flex items-center gap-3">
                  <Ticket className="w-8 h-8 text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.3)]" />
                  <div className="flex flex-col">
                    <span className="text-white font-black text-lg italic leading-tight">$20.000</span>
                    <span className="text-yellow-500 font-bold text-[11px] tracking-wider uppercase">HAFTALIK ÇEKİLİŞ</span>
                  </div>
                  <div className="ml-auto bg-[#141a25] rounded px-2 py-0.5 text-white font-bold text-xs">
                    6g
                  </div>
                </div>
                
                {/* STATS */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/5 text-center">
                    <div className="flex flex-col">
                      <span className="text-[#8b92a5] text-[9px] font-black uppercase tracking-wider mb-0.5">Günlük</span>
                      <span className="text-white font-bold text-[13px]">$25K</span>
                    </div>
                    <div className="flex flex-col border-x border-white/5">
                      <span className="text-[#8b92a5] text-[9px] font-black uppercase tracking-wider mb-0.5">Haftalık</span>
                      <span className="text-white font-bold text-[13px]">$100K</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[#8b92a5] text-[9px] font-black uppercase tracking-wider mb-0.5">Aylık</span>
                      <span className="text-white font-bold text-[13px]">$500K</span>
                    </div>
                </div>
              </div>

              {/* Main Links */}
              <NavItem icon={Crown} label="Anasayfa" isActive={activeView === 'home'} onClick={() => onViewChange('home')} />
              <NavItem icon={Star} label="Sık Kullanılanlar" isActive={activeView === 'favorites'} onClick={() => onViewChange('favorites')} />
              <NavItem icon={Clock} label="Son Oynanan" isActive={activeView === 'recent'} onClick={() => onViewChange('recent')} />
              <NavItem icon={Sparkles} label="Yeni Çıkanlar" isActive={activeView === 'new'} onClick={() => onViewChange('new')} />

              <div className="w-full h-px bg-white/5 my-4" />

              {/* Collapsible Sections */}
              <AccordionItem icon={Cherry} label="Casino" isOpenState={isCasinoOpen} setIsOpenState={setIsCasinoOpen}>
                <SubMenuItem label="Tüm Oyunlar" isActive={activeView === 'casino'} onClick={() => onViewChange('casino')} />
                <SubMenuItem label="Slotlar" isActive={activeView === 'slots'} onClick={() => onViewChange('slots')} />
                <SubMenuItem label="Canlı Casino" isActive={activeView === 'live-casino'} onClick={() => onViewChange('live-casino')} />
              </AccordionItem>

              <AccordionItem icon={Radio} label="Originals" isOpenState={isOriginalsOpen} setIsOpenState={setIsOriginalsOpen}>
                <SubMenuItem label="Tüm Originals" isActive={activeView === 'originals'} onClick={() => onViewChange('originals')} />
                <SubMenuItem label="Crash" isActive={activeView === 'crash'} onClick={() => onViewChange('crash')} />
                <SubMenuItem label="Plinko" isActive={activeView === 'plinko'} onClick={() => onViewChange('plinko')} />
              </AccordionItem>

              <AccordionItem icon={Percent} label="Promosyonlar" isOpenState={isPromoOpen} setIsOpenState={setIsPromoOpen}>
                <SubMenuItem label="Bonuslar" isActive={activeView === 'promo'} onClick={() => onViewChange('promo')} />
                <SubMenuItem label="Turnuvalar" isActive={activeView === 'tournaments'} onClick={() => onViewChange('tournaments')} />
              </AccordionItem>
              
              <div className="mt-4 mb-2">
                {/* VIP */}
                <div 
                  className={`flex items-center py-2.5 cursor-pointer transition-all duration-200 relative group px-2 rounded-lg mx-3 hover:bg-[#242d40] ${activeView === 'vip' ? 'bg-[#242d40]' : ''}`}
                  onClick={() => onViewChange('vip')}
                >
                  {activeView === 'vip' && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] bg-[#1075fc] rounded-r-md z-10"></div>}
                  <Trophy className="w-5 h-5 min-w-[20px] text-purple-400 ml-2 group-hover:text-purple-300" />
                  <span className={`ml-4 font-bold text-[14px] text-white tracking-tight whitespace-nowrap transition-all duration-300 ${!isOpen && 'opacity-0 translate-x-4 w-0 hidden'}`}>
                    VIP
                  </span>
                  <div className={`ml-auto bg-transparent border border-purple-500/50 rounded px-2 py-0.5 text-white font-bold text-[10px] italic transition-all ${!isOpen && 'hidden'}`}>
                    ÖZEL
                  </div>
                </div>

                {/* Daily Race */}
                <div 
                  className={`flex items-center py-2.5 cursor-pointer transition-all duration-200 relative group px-2 rounded-lg mx-3 hover:bg-[#242d40] mt-1`}
                >
                  <Crown className="w-6 h-6 min-w-[24px] text-yellow-500 ml-1.5 group-hover:text-yellow-400" />
                  <div className={`ml-3.5 flex flex-col transition-all duration-300 ${!isOpen && 'opacity-0 translate-x-4 w-0 hidden'}`}>
                    <span className="font-bold text-[14px] text-white tracking-tight leading-tight">$25K</span>
                    <span className="text-[11px] text-[#8b92a5]">Günlük Ya...</span>
                  </div>
                  <div className={`ml-auto bg-transparent border border-yellow-500/50 rounded px-2 py-0.5 text-white font-mono text-[11px] transition-all ${!isOpen && 'hidden'}`}>
                    04:36:43
                  </div>
                </div>
                
                {/* Weekly Race */}
                <div 
                  className={`flex items-center py-2.5 cursor-pointer transition-all duration-200 relative group px-2 rounded-lg mx-3 hover:bg-[#242d40] mt-1`}
                >
                  <Crown className="w-6 h-6 min-w-[24px] text-yellow-500 ml-1.5 group-hover:text-yellow-400" />
                  <div className={`ml-3.5 flex flex-col transition-all duration-300 ${!isOpen && 'opacity-0 translate-x-4 w-0 hidden'}`}>
                    <span className="font-bold text-[14px] text-white tracking-tight leading-tight">$100K</span>
                    <span className="text-[11px] text-[#8b92a5]">Haftalık Yarış</span>
                  </div>
                  <div className={`ml-auto bg-transparent border border-yellow-500/50 rounded px-2 py-0.5 text-white font-bold text-[11px] transition-all ${!isOpen && 'hidden'}`}>
                    5g
                  </div>
                </div>
                
                {/* Monthly Race */}
                <div 
                  className={`flex items-center py-2.5 cursor-pointer transition-all duration-200 relative group px-2 rounded-lg mx-3 hover:bg-[#242d40] mt-1`}
                >
                  <Crown className="w-6 h-6 min-w-[24px] text-yellow-500 ml-1.5 group-hover:text-yellow-400" />
                  <div className={`ml-3.5 flex flex-col transition-all duration-300 ${!isOpen && 'opacity-0 translate-x-4 w-0 hidden'}`}>
                    <span className="font-bold text-[14px] text-white tracking-tight leading-tight">$500K</span>
                    <span className="text-[11px] text-[#8b92a5]">Aylık Yarış</span>
                  </div>
                  <div className={`ml-auto bg-transparent border border-yellow-500/50 rounded px-2 py-0.5 text-white font-bold text-[11px] transition-all ${!isOpen && 'hidden'}`}>
                    5g
                  </div>
                </div>

                <NavItem icon={Target} label="Meydan Okumalar" isActive={false} onClick={() => {}} />
                <NavItem icon={Percent} label="Promosyonlar" isActive={false} onClick={() => {}} />
              </div>
            </>
          )}

        </div>

        {/* Bottom Section (Sticky at bottom) */}
        <div className="w-full flex flex-col pt-3 pb-3 gap-1 border-t border-white/5 bg-[#171e2e] relative z-20 mt-auto">
          <NavItem icon={Gift} label="Ödüller" isActive={activeView === 'rewards'} onClick={() => onViewChange('rewards')} />
          <NavItem icon={FileText} label="Belge" isActive={false} onClick={() => {}} />
          <NavItem icon={Headphones} label="Canlı Destek" isActive={false} onClick={() => window.dispatchEvent(new CustomEvent('openMobileChatPanel'))} />
          <NavItem icon={Globe} label="Dil" isActive={false} onClick={() => {}} />
        </div>

      </div>
    </>
  );
};

export default Sidebar;