import React, { useState } from 'react';
import {
  Menu, Trophy, Star, 
  Target, Gift, Ticket, MessageSquare, Globe, 
  Crown, ChevronDown, Clock, Sparkles, Cherry, Percent, Headphones, FileText
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
          background-color: #171b26;
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
                <div className="flex-1 flex bg-[#1e2330] rounded-md p-0.5 border border-white/5 shadow-inner relative overflow-hidden">
                  <button 
                    onClick={() => onViewChange('home')}
                    className={`flex-1 py-2 rounded-md text-sm font-bold transition-all relative z-10 flex items-center justify-center gap-2 ${
                      ((activeView === 'home') || activeView === 'blackjack' || activeView === 'originals') 
                        ? 'bg-[#1e88e5] text-white shadow-md' 
                        : 'text-[#8b95a5] hover:text-white'
                    }`}
                  >
                    {((activeView === 'home') || activeView === 'blackjack' || activeView === 'originals') && (
                      <Cherry className="absolute left-2 w-10 h-10 text-white/10 -rotate-12 pointer-events-none" />
                    )}
                    Casino
                  </button>
                  <button 
                    onClick={() => onViewChange('spor724')}
                    className={`flex-1 py-2 rounded-md text-sm font-bold transition-all relative z-10 ${
                      activeView === 'spor724' 
                        ? 'bg-[#1e88e5] text-white shadow-md' 
                        : 'text-[#8b95a5] hover:text-white'
                    }`}
                  >
                    Spor
                  </button>
                </div>
             </div>
          </div>

          {isOpen && (
            <div className="px-3 py-4 flex flex-col gap-4">
              
              {/* Promo Banner */}
              <div className="flex flex-col relative rounded-xl border border-yellow-500/20 overflow-hidden bg-gradient-to-br from-[#1e2330] to-[#171b26] p-3">
                 <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                       <Ticket className="text-yellow-500 w-8 h-8 shrink-0" />
                       <div className="flex flex-col">
                          <span className="text-white font-black text-lg italic tracking-tight leading-none">$20.000</span>
                          <span className="text-yellow-500 font-black text-[10px] tracking-wider uppercase">Haftalık Çekiliş</span>
                       </div>
                    </div>
                    <div className="bg-[#171b26] border border-yellow-500/50 rounded-full px-2 py-0.5 shadow-[0_0_8px_rgba(234,179,8,0.3)]">
                       <span className="text-white font-bold text-xs italic">20s</span>
                    </div>
                 </div>
                 
                 <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/5">
                    <div className="flex flex-col items-center">
                       <span className="text-[#8b95a5] text-[9px] font-bold uppercase tracking-wider">Günlük</span>
                       <span className="text-white font-black text-sm italic">$25K</span>
                    </div>
                    <div className="flex flex-col items-center">
                       <span className="text-[#8b95a5] text-[9px] font-bold uppercase tracking-wider">Haftalık</span>
                       <span className="text-white font-black text-sm italic">$100K</span>
                    </div>
                    <div className="flex flex-col items-center">
                       <span className="text-[#8b95a5] text-[9px] font-bold uppercase tracking-wider">Aylık</span>
                       <span className="text-white font-black text-sm italic">$500K</span>
                    </div>
                 </div>
              </div>

              {/* Main Navigation Links */}
              <div className="flex flex-col gap-1 mt-2">
                <button 
                  onClick={() => onViewChange('home')}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    activeView === 'home'
                    ? 'bg-[#1c2438] text-white' 
                    : 'text-[#8b95a5] hover:text-white hover:bg-[#1e2330]'
                  }`}
                >
                  <Crown className={`w-5 h-5 ${activeView === 'home' ? 'text-[#3b82f6]' : ''}`} />
                  <span className="font-bold text-[14px]">Anasayfa</span>
                </button>

                <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-[#8b95a5] hover:text-white hover:bg-[#1e2330]">
                  <Star className="w-5 h-5" />
                  <span className="font-bold text-[14px]">Sık Kullanılanlar</span>
                </button>

                <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-[#8b95a5] hover:text-white hover:bg-[#1e2330]">
                  <Clock className="w-5 h-5" />
                  <span className="font-bold text-[14px]">Son Oynanan</span>
                </button>

                <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-[#8b95a5] hover:text-white hover:bg-[#1e2330]">
                  <Sparkles className="w-5 h-5" />
                  <span className="font-bold text-[14px]">Yeni Çıkanlar</span>
                </button>

                <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-[#8b95a5] hover:text-white hover:bg-[#1e2330]">
                  <Trophy className="w-5 h-5" />
                  <span className="font-bold text-[14px] truncate w-40 text-left">FIFA Dünya Kupası 20...</span>
                </button>
              </div>

              <div className="w-full h-px bg-white/5 my-1"></div>

              {/* Accordions */}
              <div className="flex flex-col gap-2">
                {/* Casino */}
                <div className="flex flex-col bg-[#1e2330] rounded-xl border border-white/5 overflow-hidden">
                  <div 
                    onClick={() => setIsCasinoOpen(!isCasinoOpen)}
                    className="flex items-center justify-between p-3 cursor-pointer hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Cherry className="w-5 h-5 text-white" />
                      <span className="font-bold text-white text-[14px]">Casino</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-[#8b95a5] transition-transform ${isCasinoOpen ? 'rotate-180' : ''}`} />
                  </div>
                  {isCasinoOpen && (
                    <div className="flex flex-col py-1 bg-[#171b26] border-t border-white/5">
                      <button onClick={() => onViewChange('blackjack')} className="text-left px-11 py-2 text-[13px] font-bold text-[#8b95a5] hover:text-white transition-colors">Slotlar</button>
                      <button onClick={() => onViewChange('blackjack')} className="text-left px-11 py-2 text-[13px] font-bold text-[#8b95a5] hover:text-white transition-colors">Canlı Casino</button>
                    </div>
                  )}
                </div>

                {/* Originals */}
                <div className="flex flex-col bg-[#1e2330] rounded-xl border border-white/5 overflow-hidden">
                  <div 
                    onClick={() => setIsOriginalsOpen(!isOriginalsOpen)}
                    className="flex items-center justify-between p-3 cursor-pointer hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Target className="w-5 h-5 text-white" />
                      <span className="font-bold text-white text-[14px]">Originals</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-[#8b95a5] transition-transform ${isOriginalsOpen ? 'rotate-180' : ''}`} />
                  </div>
                  {isOriginalsOpen && (
                    <div className="flex flex-col py-1 bg-[#171b26] border-t border-white/5">
                      <button onClick={() => onViewChange('originals')} className="text-left px-11 py-2 text-[13px] font-bold text-[#8b95a5] hover:text-white transition-colors">Zar (Dice)</button>
                      <button onClick={() => onViewChange('originals')} className="text-left px-11 py-2 text-[13px] font-bold text-[#8b95a5] hover:text-white transition-colors">Plinko</button>
                      <button onClick={() => onViewChange('originals')} className="text-left px-11 py-2 text-[13px] font-bold text-[#8b95a5] hover:text-white transition-colors">Mayınlar (Mines)</button>
                    </div>
                  )}
                </div>

                {/* Promosyonlar */}
                <div className="flex flex-col bg-[#1e2330] rounded-xl border border-white/5 overflow-hidden">
                  <div 
                    onClick={() => setIsPromosOpen(!isPromosOpen)}
                    className="flex items-center justify-between p-3 cursor-pointer hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Percent className="w-5 h-5 text-white" />
                      <span className="font-bold text-white text-[14px]">Promosyonlar</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-[#8b95a5] transition-transform ${isPromosOpen ? 'rotate-180' : ''}`} />
                  </div>
                  {isPromosOpen && (
                    <div className="flex flex-col py-1 bg-[#171b26] border-t border-white/5">
                      <button onClick={() => onViewChange('promo')} className="text-left px-11 py-2 text-[13px] font-bold text-[#8b95a5] hover:text-white transition-colors">Hoşgeldin Bonusu</button>
                      <button onClick={() => onViewChange('promo')} className="text-left px-11 py-2 text-[13px] font-bold text-[#8b95a5] hover:text-white transition-colors">Kayıp Bonusu</button>
                    </div>
                  )}
                </div>
              </div>

              <div className="w-full h-px bg-white/5 my-2"></div>

              {/* Footer Links */}
              <div className="flex flex-col gap-1">
                <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-[#8b95a5] hover:text-white hover:bg-[#1e2330]">
                  <Gift className="w-5 h-5" />
                  <span className="font-bold text-[14px]">Ödüller</span>
                </button>
                <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-[#8b95a5] hover:text-white hover:bg-[#1e2330]">
                  <FileText className="w-5 h-5" />
                  <span className="font-bold text-[14px]">Blog</span>
                </button>
                <button 
                  onClick={() => window.dispatchEvent(new Event('openSupportChat'))}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-[#8b95a5] hover:text-white hover:bg-[#1e2330]"
                >
                  <Headphones className="w-5 h-5" />
                  <span className="font-bold text-[14px]">Canlı Destek</span>
                </button>
                <div 
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors text-[#8b95a5] hover:text-white hover:bg-[#1e2330]"
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
            <div className="flex flex-col items-center py-4 gap-4 w-full">
              {/* Collapsed icons only */}
              <button onClick={() => onViewChange('home')} className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${activeView === 'home' || activeView === 'blackjack' ? 'bg-[#1c2438] text-white border-l-2 border-[#3b82f6]' : 'text-[#8b95a5] hover:text-white hover:bg-[#1e2330]'}`}>
                <Crown className={`w-5 h-5 ${activeView === 'home' ? 'text-[#3b82f6]' : ''}`} />
              </button>
              <button className="w-10 h-10 rounded-lg flex items-center justify-center text-[#8b95a5] hover:text-white hover:bg-[#1e2330] transition-colors">
                <Star className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 rounded-lg flex items-center justify-center text-[#8b95a5] hover:text-white hover:bg-[#1e2330] transition-colors">
                <Clock className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 rounded-lg flex items-center justify-center text-[#8b95a5] hover:text-white hover:bg-[#1e2330] transition-colors">
                <Sparkles className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 rounded-lg flex items-center justify-center text-[#8b95a5] hover:text-white hover:bg-[#1e2330] transition-colors">
                <Trophy className="w-5 h-5" />
              </button>
              <div className="w-10 h-px bg-white/5 my-1"></div>
              <button onClick={() => {onToggle(); setIsCasinoOpen(true);}} className="w-10 h-10 rounded-lg flex items-center justify-center text-[#8b95a5] hover:text-white hover:bg-[#1e2330] transition-colors">
                <Cherry className="w-5 h-5" />
              </button>
              <button onClick={() => {onToggle(); setIsOriginalsOpen(true);}} className="w-10 h-10 rounded-lg flex items-center justify-center text-[#8b95a5] hover:text-white hover:bg-[#1e2330] transition-colors">
                <Target className="w-5 h-5" />
              </button>
              <button onClick={() => {onToggle(); setIsPromosOpen(true);}} className="w-10 h-10 rounded-lg flex items-center justify-center text-[#8b95a5] hover:text-white hover:bg-[#1e2330] transition-colors">
                <Percent className="w-5 h-5" />
              </button>
              <div className="w-10 h-px bg-white/5 my-1"></div>
              <button className="w-10 h-10 rounded-lg flex items-center justify-center text-[#8b95a5] hover:text-white hover:bg-[#1e2330] transition-colors">
                <Gift className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 rounded-lg flex items-center justify-center text-[#8b95a5] hover:text-white hover:bg-[#1e2330] transition-colors">
                <FileText className="w-5 h-5" />
              </button>
              <button onClick={() => window.dispatchEvent(new Event('openSupportChat'))} className="w-10 h-10 rounded-lg flex items-center justify-center text-[#8b95a5] hover:text-white hover:bg-[#1e2330] transition-colors">
                <Headphones className="w-5 h-5" />
              </button>
              <button onClick={() => {onToggle(); setIsLangOpen(!isLangOpen);}} className="w-10 h-10 rounded-lg flex items-center justify-center text-[#8b95a5] hover:text-white hover:bg-[#1e2330] transition-colors">
                <Globe className="w-5 h-5" />
              </button>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default Sidebar;
