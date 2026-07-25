import React, { useState } from 'react';
import {
  Menu, Trophy, Star, Target, Gift, Ticket, Globe, Crown, ChevronDown, ChevronUp, 
  Sparkles, Cherry, Percent, Headphones, FileText, Copy, Radio, Flame, LayoutDashboard, 
  Gamepad2, Zap, Diamond, Calendar, Tv, Dices, ChevronLeft, ChevronRight, Clock, Search, LogOut, Clover, Play
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
}) => {
  const { t } = useLanguage();
  const { setActiveSport } = useBetting();

  // Accordion states
  const [isCasinoOpen, setIsCasinoOpen] = useState(false);
  const [isOriginalsOpen, setIsOriginalsOpen] = useState(false);
  const [isPromoOpen, setIsPromoOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  const isRetroVIP = activeView === 'raffle' || activeView === 'originals' || activeView === 'vip';

  const NavItem = ({ icon: Icon, label, isActive, onClick }: any) => (
    <div 
      className={`flex items-center py-3.5 mb-1 cursor-pointer transition-all duration-300 relative group mr-3 rounded-r-2xl
        ${isActive ? 'bg-[#0F141E] text-[#10b981] pl-5 border-y border-r border-white/5 shadow-[4px_0_15px_rgba(0,0,0,0.5)]' : 'text-zinc-400 hover:text-white hover:bg-white/5 pl-[21px]'}
      `}
      onClick={onClick}
    >
      {isActive && <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#10b981] rounded-r-sm shadow-[0_0_10px_rgba(16,185,129,0.5)] z-10"></div>}
      <Icon className={`w-5 h-5 min-w-[20px] transition-colors ${isActive ? 'text-emerald-400' : 'group-hover:text-emerald-400'}`} />
      
      <span className={`ml-3 font-bold text-[14px] whitespace-nowrap transition-all duration-300 ${!isOpen && 'opacity-0 translate-x-4 w-0 hidden'}`}>
        {label}
      </span>
      
      {/* Flyout for collapsed state */}
      {!isOpen && (
        <div className="absolute left-[calc(100%+8px)] top-0 bg-[#0a0d14] text-white px-4 py-2.5 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible whitespace-nowrap z-[999] transition-all border border-white/10 font-bold text-sm">
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
        {/* Spacer for top alignment if needed, or just start nav items */}

        {/* Toggle Button attached to the right edge */}
        <div className="relative h-6 shrink-0 w-full">
          <button 
            onClick={onToggle} 
            className="absolute top-2 -right-[12px] bg-[#111111] text-zinc-400 p-1.5 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)] border border-white/10 hover:text-white hover:scale-110 transition-all z-50 hidden md:block"
          >
            {isOpen ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          </button>
        </div>

        {/* Navigation Items */}
        <div className="codinglab-sidebar-inner pt-4">


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

          {/* Bottom Fixed Area */}
        </div>

        <div className="mt-auto w-full flex flex-col">
          {/* 724 TV BANNER - MATCHED */}
          <div className={`p-4 bg-[#0a0a0a] border-t border-white/5 transition-all duration-300 cursor-pointer hover:bg-[#141414] group ${!isOpen ? 'bg-transparent flex justify-center hover:bg-transparent border-transparent' : ''}`} onClick={() => onViewChange('724tv')}>
            <div className={`flex items-center ${!isOpen ? 'justify-center' : 'justify-between'}`}>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-500/30 relative transition-all group-hover:bg-amber-500/20 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                  <Tv className="w-5 h-5 text-amber-400" />
                  {!isOpen && (
                    <div className="absolute left-[calc(100%+16px)] top-1/2 -translate-y-1/2 bg-[#1a1a2e] text-white px-4 py-2.5 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible whitespace-nowrap z-[999] transition-all border border-white/5 font-bold text-sm">
                      724 TV
                    </div>
                  )}
                </div>
                <div className={`ml-3 flex flex-col transition-all duration-300 ${!isOpen && 'opacity-0 w-0 hidden'}`}>
                  <span className="text-white font-bold text-sm whitespace-nowrap">724 TV</span>
                  <span className="text-amber-400 text-[11px] font-bold whitespace-nowrap uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                    KESİNTİSİZ MAÇ
                  </span>
                </div>
              </div>
              {isOpen && (
                <button className="text-zinc-500 group-hover:text-amber-400 transition-colors shrink-0 p-2 bg-white/5 rounded-lg group-hover:bg-amber-500/10">
                  <Play className="w-4 h-4 ml-0.5" fill="currentColor" />
                </button>
              )}
            </div>
          </div>

          {/* Profile/Bonus Card at Bottom (Unauthenticated State) */}
          <div className={`p-4 bg-[#0a0a0a] border-t border-white/5 transition-all duration-300 cursor-pointer hover:bg-[#141414] group ${!isOpen ? 'bg-transparent flex justify-center hover:bg-transparent border-transparent' : ''}`} onClick={() => onViewChange('rewards')}>
            <div className={`flex items-center ${!isOpen ? 'justify-center' : 'justify-between'}`}>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/30 relative transition-all group-hover:bg-emerald-500/20 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                  <Clover className="w-5 h-5 text-emerald-400" />
                  {!isOpen && (
                    <div className="absolute left-[calc(100%+16px)] top-1/2 -translate-y-1/2 bg-[#1a1a2e] text-white px-4 py-2.5 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible whitespace-nowrap z-[999] transition-all border border-white/5 font-bold text-sm">
                      Bonuslar
                    </div>
                  )}
                </div>
                <div className={`ml-3 flex flex-col transition-all duration-300 ${!isOpen && 'opacity-0 w-0 hidden'}`}>
                  <span className="text-white font-bold text-sm whitespace-nowrap">Bonuslar</span>
                  <span className="text-emerald-400 text-[11px] font-bold whitespace-nowrap uppercase tracking-wider">Fırsatları Keşfet</span>
                </div>
              </div>
              {isOpen && (
                <button className="text-zinc-500 group-hover:text-emerald-400 transition-colors shrink-0 p-2 bg-white/5 rounded-lg group-hover:bg-emerald-500/10">
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default Sidebar;