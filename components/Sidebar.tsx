import React, { useState } from 'react';
import {
  Menu, Trophy, Star, 
  Target, Gift, Ticket, MessageSquare, Globe, 
  Crown, ChevronDown, Clock, Sparkles, Cherry, Percent, Headphones, FileText, Copy, Radio
} from 'lucide-react';
import { NavVisibility } from './Header';
import { useLanguage } from '../contexts/LanguageContext';

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
  
  // Accordion states
  const [isCasinoOpen, setIsCasinoOpen] = useState(false);
  const [isOriginalsOpen, setIsOriginalsOpen] = useState(false);
  const [isPromosOpen, setIsPromosOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  return (
    <>
      <style>{`
        .navy-sidebar-container {
          width: 100%;
          background-color: #0B0E14;
          display: flex;
          flex-direction: column;
          height: 100%;
          position: relative;
          z-index: 10;
          color: #8b95a5;
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
          <div className="h-[70px] w-full shrink-0 flex items-center px-4 pt-2 border-b border-white/5 relative z-50">
             <div className="flex items-center w-full gap-2">
                <button onClick={onToggle} className="text-white/70 hover:text-white p-1 lg:hidden">
                  <Menu size={24} />
                </button>
                {isOpen && (
                  <div className="flex-1 flex bg-[#14141a] rounded-md p-0.5 border border-white/5 shadow-inner relative overflow-hidden">
                    <button 
                      onClick={() => onViewChange('blackjack')}
                      className={`flex-1 py-2 rounded-md text-sm font-bold transition-all relative z-10 flex items-center justify-center gap-2 ${
                        (activeView === 'blackjack' || activeView === 'originals') 
                          ? 'bg-[#10b981] text-black shadow-md' 
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {(activeView === 'blackjack' || activeView === 'originals') && (
                        <Cherry className="absolute left-2 w-10 h-10 text-white/10 -rotate-12 pointer-events-none" />
                      )}
                      Casino
                    </button>
                    <button 
                      onClick={() => onViewChange('spor724')}
                      className={`flex-1 py-2 rounded-md text-sm font-bold transition-all relative z-10 ${
                        activeView === 'spor724' 
                          ? 'bg-[#10b981] text-black shadow-md' 
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Spor
                    </button>
                  </div>
                )}
             </div>
          </div>

          {isOpen && (
            <div className="px-3 py-4 flex flex-col gap-4">
              
              {/* Promo Banner */}
              <div className="flex flex-col relative rounded-[20px] border border-white/5 border-t-white/10 border-l-white/10 overflow-hidden bg-[#16141d]/80 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent backdrop-blur-2xl p-3 shadow-[inset_0_1px_2px_rgba(255,255,255,0.15),0_10px_30px_rgba(0,0,0,0.3)] hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.2),0_15px_40px_rgba(0,0,0,0.4)] hover:-translate-y-0.5 transition-all duration-500 group cursor-pointer">
                 {/* Glassmorphism Shine Overlay */}
                 <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                 {/* Sweeping Light Beam */}
                 <div className="absolute top-0 left-[-100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] group-hover:left-[200%] transition-all duration-1000 ease-in-out pointer-events-none"></div>
                 
                 <div className="flex justify-between items-start relative z-10">
                    <div className="flex items-center gap-2">
                        <Ticket className="text-amber-400 w-8 h-8 shrink-0 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
                        <div className="flex flex-col">
                           <span className="text-white font-black text-lg italic tracking-tight leading-none drop-shadow-md">$20.000</span>
                           <span className="text-amber-400 font-black text-[10px] tracking-wider uppercase drop-shadow-sm">Haftalık Çekiliş</span>
                       </div>
                    </div>
                    <div className="bg-[#0B0E14] border border-amber-500/50 rounded-full px-2 py-0.5 shadow-[0_0_8px_rgba(251,191,36,0.3)]">
                       <span className="text-white font-bold text-xs italic">20s</span>
                    </div>
                 </div>
                 
                 <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/5 relative z-10">
                    <div className="flex flex-col items-center">
                       <span className="text-slate-400 text-[9px] font-bold uppercase tracking-wider">Günlük</span>
                       <span className="text-white font-black text-sm italic drop-shadow-md">$25K</span>
                    </div>
                    <div className="flex flex-col items-center">
                       <span className="text-slate-400 text-[9px] font-bold uppercase tracking-wider">Haftalık</span>
                       <span className="text-white font-black text-sm italic drop-shadow-md">$100K</span>
                    </div>
                    <div className="flex flex-col items-center">
                       <span className="text-slate-400 text-[9px] font-bold uppercase tracking-wider">Aylık</span>
                       <span className="text-white font-black text-sm italic drop-shadow-md">$500K</span>
                    </div>
                 </div>
              </div>

              {/* Main Navigation Links */}
              <div className="flex flex-col gap-2 mt-4">
                <button 
                  onClick={() => onViewChange('home')}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${
                    activeView === 'home'
                    ? 'bg-[#14141a] text-white' 
                    : 'text-slate-400 hover:text-white hover:bg-[#14141a]'
                  }`}
                >
                  <Crown className={`w-5 h-5 icon-wiggle ${activeView === 'home' ? 'text-[#06b6d4]' : ''}`} stroke="currentColor" fill="rgba(6,182,212,0.2)" strokeWidth={1.5} />
                  <span className="font-bold text-[14px]">Anasayfa</span>
                </button>

                <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-slate-400 hover:text-white hover:bg-[#14141a] group">
                  <Star className="w-5 h-5 icon-wiggle" stroke="currentColor" fill="rgba(16,185,129,0.2)" strokeWidth={1.5} />
                  <span className="font-bold text-[14px]">Sık Kullanılanlar</span>
                </button>

                <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-slate-400 hover:text-white hover:bg-[#14141a] group">
                  <Copy className="w-5 h-5 icon-wiggle" stroke="currentColor" fill="rgba(16,185,129,0.2)" strokeWidth={1.5} />
                  <span className="font-bold text-[14px]">Bahislerim</span>
                </button>

                <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-slate-400 hover:text-white hover:bg-[#14141a] group">
                  <Radio className="w-5 h-5 icon-wiggle" stroke="currentColor" fill="rgba(16,185,129,0.2)" strokeWidth={1.5} />
                  <span className="font-bold text-[14px]">Canlı Maçlar</span>
                </button>

                <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-slate-400 hover:text-white hover:bg-[#14141a] group">
                  <Trophy className="w-5 h-5 icon-wiggle" stroke="currentColor" fill="rgba(16,185,129,0.2)" strokeWidth={1.5} />
                  <span className="font-bold text-[14px] truncate w-40 text-left">Favori Ligler</span>
                </button>
              </div>

              <div className="w-full h-px bg-white/5 my-4"></div>

              {/* Accordions */}
              <div className="flex flex-col gap-3">
                {/* Casino */}
                <div className="flex flex-col bg-[#14141a] rounded-xl border border-white/5 overflow-hidden">
                  <div 
                    onClick={() => setIsCasinoOpen(!isCasinoOpen)}
                    className="flex items-center justify-between p-3 cursor-pointer hover:bg-white/5 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <Cherry className="w-5 h-5 text-white icon-wiggle" stroke="currentColor" fill="rgba(16,185,129,0.2)" strokeWidth={1.5} />
                      <span className="font-bold text-white text-[14px] flex items-center gap-2">
                        Casino
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]"></span>
                        </span>
                      </span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isCasinoOpen ? 'rotate-180' : ''}`} />
                  </div>
                  {isCasinoOpen && (
                    <div className="flex flex-col py-1 bg-[#0B0E14] border-t border-white/5">
                      <button onClick={() => onViewChange('blackjack')} className="text-left px-11 py-2 text-[13px] font-bold text-slate-400 hover:text-white transition-colors">Slotlar</button>
                      <button onClick={() => onViewChange('blackjack')} className="text-left px-11 py-2 text-[13px] font-bold text-slate-400 hover:text-white transition-colors">Canlı Casino</button>
                    </div>
                  )}
                </div>

                {/* Originals */}
                <div className="flex flex-col bg-[#14141a] rounded-xl border border-white/5 overflow-hidden">
                  <div 
                    onClick={() => setIsOriginalsOpen(!isOriginalsOpen)}
                    className="flex items-center justify-between p-3 cursor-pointer hover:bg-white/5 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <Target className="w-5 h-5 text-white icon-wiggle" stroke="currentColor" fill="rgba(16,185,129,0.2)" strokeWidth={1.5} />
                      <span className="font-bold text-white text-[14px]">Originals</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOriginalsOpen ? 'rotate-180' : ''}`} />
                  </div>
                  {isOriginalsOpen && (
                    <div className="flex flex-col py-1 bg-[#0B0E14] border-t border-white/5">
                      <button onClick={() => onViewChange('originals')} className="text-left px-11 py-2 text-[13px] font-bold text-slate-400 hover:text-white transition-colors">Zar (Dice)</button>
                      <button onClick={() => onViewChange('originals')} className="text-left px-11 py-2 text-[13px] font-bold text-slate-400 hover:text-white transition-colors">Plinko</button>
                      <button onClick={() => onViewChange('originals')} className="text-left px-11 py-2 text-[13px] font-bold text-slate-400 hover:text-white transition-colors">Mayınlar (Mines)</button>
                    </div>
                  )}
                </div>

                {/* Promosyonlar */}
                <div className="flex flex-col bg-[#14141a] rounded-xl border border-white/5 overflow-hidden">
                  <div 
                    onClick={() => setIsPromosOpen(!isPromosOpen)}
                    className="flex items-center justify-between p-3 cursor-pointer hover:bg-white/5 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <Percent className="w-5 h-5 text-white icon-wiggle" stroke="currentColor" fill="rgba(16,185,129,0.2)" strokeWidth={1.5} />
                      <span className="font-bold text-white text-[14px]">Promosyonlar</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isPromosOpen ? 'rotate-180' : ''}`} />
                  </div>
                  {isPromosOpen && (
                    <div className="flex flex-col py-1 bg-[#0B0E14] border-t border-white/5">
                      <button onClick={() => onViewChange('promo')} className="text-left px-11 py-2 text-[13px] font-bold text-slate-400 hover:text-white transition-colors">Hoşgeldin Bonusu</button>
                      <button onClick={() => onViewChange('promo')} className="text-left px-11 py-2 text-[13px] font-bold text-slate-400 hover:text-white transition-colors">Kayıp Bonusu</button>
                    </div>
                  )}
                </div>
              </div>

              <div className="w-full h-px bg-white/5 my-4"></div>

              {/* Footer Links */}
              <div className="flex flex-col gap-2 mb-6">
                <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-slate-400 hover:text-white hover:bg-[#14141a] group">
                  <Gift className="w-5 h-5 icon-wiggle" stroke="currentColor" fill="rgba(16,185,129,0.2)" strokeWidth={1.5} />
                  <span className="font-bold text-[14px]">Ödüller</span>
                </button>
                <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-slate-400 hover:text-white hover:bg-[#14141a] group">
                  <FileText className="w-5 h-5 icon-wiggle" stroke="currentColor" fill="rgba(16,185,129,0.2)" strokeWidth={1.5} />
                  <span className="font-bold text-[14px]">Blog</span>
                </button>
                <button 
                  onClick={() => window.dispatchEvent(new Event('openSupportChat'))}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-slate-400 hover:text-white hover:bg-[#14141a] group"
                >
                  <Headphones className="w-5 h-5 icon-wiggle" stroke="currentColor" fill="rgba(16,185,129,0.2)" strokeWidth={1.5} />
                  <span className="font-bold text-[14px]">Canlı Destek</span>
                </button>
                <div 
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors text-slate-400 hover:text-white hover:bg-[#14141a]"
                >
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5" />
                    <span className="font-bold text-[14px]">Dil: Türkçe</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
                </div>
              </div>

            </div>
          )}

          {!isOpen && (
            <div className="flex flex-col items-center py-4 gap-4 w-full relative z-[100]">
              {/* Collapsed icons only */}
              <button onClick={() => onViewChange('home')} className={`group relative w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${activeView === 'home' || activeView === 'blackjack' ? 'bg-[#14141a] text-white border-l-2 border-[#10b981]' : 'text-slate-400 hover:text-white hover:bg-[#14141a]'}`}>
                <Crown className={`w-5 h-5 ${activeView === 'home' ? 'text-[#10b981]' : ''}`} />
                <div className="absolute left-full ml-4 px-2 py-1 bg-[#1A1D29] text-white text-xs font-bold rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 whitespace-nowrap z-50">Anasayfa</div>
              </button>
              <button className="group relative w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#14141a] transition-colors">
                <Star className="w-5 h-5" />
                <div className="absolute left-full ml-4 px-2 py-1 bg-[#1A1D29] text-white text-xs font-bold rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 whitespace-nowrap z-50">Sık Kullanılanlar</div>
              </button>
              <button className="group relative w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#14141a] transition-colors">
                <Copy className="w-5 h-5" />
                <div className="absolute left-full ml-4 px-2 py-1 bg-[#1A1D29] text-white text-xs font-bold rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 whitespace-nowrap z-50">Bahislerim</div>
              </button>
              <button className="group relative w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#14141a] transition-colors">
                <Radio className="w-5 h-5" />
                <div className="absolute left-full ml-4 px-2 py-1 bg-[#1A1D29] text-white text-xs font-bold rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 whitespace-nowrap z-50">Canlı Maçlar</div>
              </button>
              <button className="group relative w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#14141a] transition-colors">
                <Trophy className="w-5 h-5" />
                <div className="absolute left-full ml-4 px-2 py-1 bg-[#1A1D29] text-white text-xs font-bold rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 whitespace-nowrap z-50">Favori Ligler</div>
              </button>
              <div className="w-10 h-px bg-white/5 my-1"></div>
              <button onClick={() => {onToggle(); setIsCasinoOpen(true);}} className="group relative w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#14141a] transition-colors">
                <Cherry className="w-5 h-5" />
                <div className="absolute left-full ml-4 px-2 py-1 bg-[#1A1D29] text-white text-xs font-bold rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 whitespace-nowrap z-50">Casino</div>
              </button>
              <button onClick={() => {onToggle(); setIsOriginalsOpen(true);}} className="group relative w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#14141a] transition-colors">
                <Target className="w-5 h-5" />
                <div className="absolute left-full ml-4 px-2 py-1 bg-[#1A1D29] text-white text-xs font-bold rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 whitespace-nowrap z-50">Originals</div>
              </button>
              <button onClick={() => {onToggle(); setIsPromosOpen(true);}} className="group relative w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#14141a] transition-colors">
                <Percent className="w-5 h-5" />
                <div className="absolute left-full ml-4 px-2 py-1 bg-[#1A1D29] text-white text-xs font-bold rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 whitespace-nowrap z-50">Promosyonlar</div>
              </button>
              <div className="w-10 h-px bg-white/5 my-1"></div>
              <button className="group relative w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#14141a] transition-colors">
                <Gift className="w-5 h-5" />
                <div className="absolute left-full ml-4 px-2 py-1 bg-[#1A1D29] text-white text-xs font-bold rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 whitespace-nowrap z-50">Ödüller</div>
              </button>
              <button className="group relative w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#14141a] transition-colors">
                <FileText className="w-5 h-5" />
                <div className="absolute left-full ml-4 px-2 py-1 bg-[#1A1D29] text-white text-xs font-bold rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 whitespace-nowrap z-50">Blog</div>
              </button>
              <button onClick={() => window.dispatchEvent(new Event('openSupportChat'))} className="group relative w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#14141a] transition-colors">
                <Headphones className="w-5 h-5" />
                <div className="absolute left-full ml-4 px-2 py-1 bg-[#1A1D29] text-white text-xs font-bold rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 whitespace-nowrap z-50">Canlı Destek</div>
              </button>
              <button onClick={() => {onToggle(); setIsLangOpen(!isLangOpen);}} className="group relative w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#14141a] transition-colors">
                <Globe className="w-5 h-5" />
                <div className="absolute left-full ml-4 px-2 py-1 bg-[#1A1D29] text-white text-xs font-bold rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 whitespace-nowrap z-50">Dil Seçimi</div>
              </button>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default Sidebar;
