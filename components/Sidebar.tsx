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
  const [isPromoOpen, setIsPromoOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  const isRetroVIP = activeView === 'raffle' || activeView === 'originals' || activeView === 'vip';

  const isSportsView = ['sports', 'spor724', 'gercek', 'upcomingMatches'].includes(activeView);
  const isCasinoView = ['casino', 'slots', 'live-casino', 'originals'].includes(activeView);

  const NavItem = ({ icon: Icon, label, isActive, onClick }: any) => (
    <div 
      className={`flex items-center py-2.5 mb-1 cursor-pointer transition-all duration-200 relative group mx-2 rounded-lg
        ${isActive ? 'bg-white/10 text-white shadow-sm' : 'text-zinc-400 hover:text-white hover:bg-white/[0.03]'}
      `}
      onClick={onClick}
    >
      {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-[3px] bg-emerald-500 rounded-r-md shadow-[0_0_8px_rgba(16,185,129,0.5)] z-10"></div>}
      <Icon className={`w-[18px] h-[18px] min-w-[18px] transition-colors ml-4 ${isActive ? 'text-emerald-400' : 'text-zinc-400 group-hover:text-zinc-300'}`} />
      
      <span className={`ml-3.5 font-semibold text-[13px] tracking-tight whitespace-nowrap transition-all duration-300 ${!isOpen && 'opacity-0 translate-x-4 w-0 hidden'}`}>
        {label}
      </span>
      
      {/* Flyout for collapsed state */}
      {!isOpen && (
        <div className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 bg-[#1a1d29] text-white px-2.5 py-1.5 rounded shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible whitespace-nowrap z-[999] transition-all border border-white/10 font-bold text-xs">
          {label}
        </div>
      )}
    </div>
  );

  const AccordionItem = ({ icon: Icon, label, isOpenState, setIsOpenState, children }: any) => {
    return (
      <div className={`relative group mx-3 mb-2 transition-all duration-300 rounded-xl ${isOpen ? 'overflow-hidden' : ''} bg-[#0F121A] border ${isOpenState ? 'border-white/15 shadow-[0_4px_20px_rgba(0,0,0,0.5)]' : 'border-white/5'}`}>
        <div 
          className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-all duration-300
            ${isOpenState ? 'text-[#10b981]' : 'text-zinc-400 hover:text-white bg-white/[0.02]'}
          `}
          onClick={() => {
            if (isOpen) setIsOpenState(!isOpenState);
          }}
        >
          <div className="flex items-center">
            <Icon className={`w-5 h-5 min-w-[20px] transition-colors ${isOpenState ? 'text-emerald-400' : 'group-hover:text-emerald-400'}`} />
            <span className={`ml-3 font-bold text-[14px] whitespace-nowrap transition-all duration-300 ${!isOpen && 'opacity-0 hidden'}`}>
              {label}
            </span>
          </div>
          {isOpen && (
            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpenState ? 'rotate-180' : ''}`} />
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
          <div className="absolute left-[calc(100%+8px)] top-0 bg-[#0a0d14] rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible z-[999] transition-all border border-white/10 min-w-[200px] overflow-hidden">
            <div className="px-4 py-3 border-b border-white/5 bg-[#141424]">
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
      className={`px-3 py-2 mx-2 rounded-lg cursor-pointer transition-colors whitespace-nowrap text-[13px] font-semibold flex items-center
        ${isOpen ? 'pl-10 relative before:absolute before:left-[22px] before:top-1/2 before:w-1.5 before:h-1.5 before:bg-white/20 before:rounded-full before:-translate-y-1/2' : 'hover:bg-white/5'}
        ${isActive ? 'text-emerald-400 before:!bg-emerald-400 bg-white/5' : 'text-zinc-400 hover:text-white hover:bg-white/5'}
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
          background-color: #0A0D14; /* Deep dark matching the rest of the site */
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
        /* Custom scrollbar */
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
          width: 0px;
        }
      `}</style>

      {/* Mobile Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onToggle} />
      )}

      <div className={`codinglab-sidebar ${isOpen ? 'open' : 'closed'} ${isRetroVIP ? 'bg-[#050510] border-r-fuchsia-500/20' : ''}`}>


        {/* Navigation Items */}
        <div className="codinglab-sidebar-inner pt-1">

          {isSportsView ? (
            <SportsSidebarContent isOpen={isOpen} onViewChange={onViewChange} />
          ) : siteUser ? (
            <>
              {/* LOGGED IN USER MENU */}
              {/* HAFTALIK ÇEKİLİŞ BANNER */}
              <div className={`mx-4 mb-6 relative overflow-hidden rounded-xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 to-transparent p-3 cursor-pointer hover:border-yellow-500/40 transition-all ${!isOpen && 'hidden'}`}>
                <div className="flex items-center gap-3">
                  <Ticket className="w-8 h-8 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" />
                  <div className="flex flex-col">
                    <span className="text-white font-black text-lg italic leading-tight">$20.000</span>
                    <span className="text-yellow-400 font-bold text-[11px] tracking-wider uppercase">HAFTALIK ÇEKİLİŞ</span>
                  </div>
                  <div className="ml-auto bg-black/50 border border-yellow-500/30 rounded px-2 py-0.5 text-white font-mono text-xs">
                    15s
                  </div>
                </div>
                
                {/* STATS */}
                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-yellow-500/10 text-center">
                    <div className="flex flex-col">
                      <span className="text-zinc-500 text-[9px] font-black uppercase">Günlük</span>
                      <span className="text-white font-bold text-xs">$25K</span>
                    </div>
                    <div className="flex flex-col border-x border-yellow-500/10">
                      <span className="text-zinc-500 text-[9px] font-black uppercase">Haftalık</span>
                      <span className="text-white font-bold text-xs">$100K</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-zinc-500 text-[9px] font-black uppercase">Aylık</span>
                      <span className="text-white font-bold text-xs">$500K</span>
                    </div>
                </div>
              </div>

              <NavItem icon={Crown} label="Anasayfa" isActive={activeView === 'home'} onClick={() => onViewChange('home')} />
              <NavItem icon={Star} label="Sık Kullanılanlar" isActive={activeView === 'favorites'} onClick={() => onViewChange('favorites')} />
              <NavItem icon={Clock} label="Son Oynanan" isActive={activeView === 'recent'} onClick={() => onViewChange('recent')} />
              <NavItem icon={Sparkles} label="Yeni Çıkanlar" isActive={activeView === 'new'} onClick={() => onViewChange('new')} />

              <div className="w-full h-px bg-white/5 my-3" />

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
            </>
          ) : (
            <>
              {isCasinoView ? (
                <>
                  <NavItem icon={Gamepad2} label="Slotlar" isActive={activeView === 'slots'} onClick={() => onViewChange('slots')} />
                  <NavItem icon={Dices} label="Canlı Casino" isActive={activeView === 'live-casino'} onClick={() => onViewChange('live-casino')} />
                  <NavItem icon={LayoutDashboard} label="Sağlayıcılar" isActive={false} onClick={() => {}} />
                  <NavItem icon={Diamond} label="Orijinal Oyunlar" isActive={activeView === 'originals'} onClick={() => onViewChange('originals')} />
                </>
              ) : (
                <>
                  <NavItem icon={Crown} label="Anasayfa" isActive={activeView === 'home'} onClick={() => onViewChange('home')} />
                  <NavItem icon={Target} label="Canlı Spor" isActive={activeView === 'spor724'} onClick={() => onViewChange('spor724')} />
                  <NavItem icon={Gamepad2} label="Popüler Slotlar" isActive={activeView === 'slots'} onClick={() => onViewChange('slots')} />
                  <NavItem icon={Dices} label="Canlı Casino" isActive={activeView === 'live-casino'} onClick={() => onViewChange('live-casino')} />
                </>
              )}
            </>
          )}

          {/* Bottom Fixed Area */}
        </div>

        <div className="mt-auto w-full flex flex-col pt-3 pb-3 gap-1 border-t border-white/10 bg-[#06080d] shadow-[0_-10px_20px_rgba(0,0,0,0.3)] z-20 relative">
          <NavItem icon={Headphones} label="Canlı Destek" isActive={false} onClick={() => window.dispatchEvent(new CustomEvent('openMobileChatPanel'))} />
          <NavItem icon={Gift} label="Promosyonlar" isActive={activeView === 'promo' || activeView === 'rewards'} onClick={() => onViewChange('promo')} />
        </div>

      </div>
    </>
  );
};

export default Sidebar;