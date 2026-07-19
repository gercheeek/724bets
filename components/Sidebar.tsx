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
  userRole,
}) => {
  const { t } = useLanguage();
  
  // Accordion states
  const [isCasinoOpen, setIsCasinoOpen] = useState(false);
  const [isOriginalsOpen, setIsOriginalsOpen] = useState(false);
  const [isPromosOpen, setIsPromosOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isFavLeaguesOpen, setIsFavLeaguesOpen] = useState(false);

  return (
    <>
      <style>{`
        .navy-sidebar-container {
          width: 100%;
          background-color: #050505;
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
          <div className="h-[60px] lg:h-[70px] w-full shrink-0 flex items-center px-3 lg:px-4 pt-1 lg:pt-2 border-b border-white/5 relative z-50">
             <div className="flex items-center w-full gap-2">
                <button onClick={onToggle} className="text-white/70 hover:text-white p-1 lg:hidden">
                  <Menu size={20} />
                </button>
                {isOpen && (
                  <div className="flex-1 flex bg-[#111111] rounded-md p-0.5 border border-white/5 shadow-inner relative overflow-hidden">
                    <button 
                      onClick={() => onViewChange('blackjack')}
                      className={`flex-1 py-1.5 lg:py-2 rounded-md text-xs lg:text-sm font-bold transition-all relative z-10 flex items-center justify-center gap-1.5 lg:gap-2 ${
                        (activeView === 'blackjack' || activeView === 'originals') 
                          ? 'bg-[#10b981] text-black shadow-md' 
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {(activeView === 'blackjack' || activeView === 'originals') && (
                        <Cherry className="absolute left-1 lg:left-2 w-8 h-8 lg:w-10 lg:h-10 text-white/10 -rotate-12 pointer-events-none" />
                      )}
                      Casino
                    </button>
                    <button 
                      onClick={() => onViewChange('spor724')}
                      className={`flex-1 py-1.5 lg:py-2 rounded-md text-xs lg:text-sm font-bold transition-all relative z-10 ${
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
            <div className="px-2 lg:px-3 py-3 lg:py-4 flex flex-col gap-3 lg:gap-4">
              
              {/* Promo Banner */}
              <div className="flex flex-col relative rounded-[14px] lg:rounded-[20px] border border-white/5 border-t-white/10 border-l-white/10 overflow-hidden bg-[#16141d]/80 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent backdrop-blur-2xl p-2.5 lg:p-3 shadow-[inset_0_1px_2px_rgba(255,255,255,0.15),0_10px_30px_rgba(0,0,0,0.3)] hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.2),0_15px_40px_rgba(0,0,0,0.4)] hover:-translate-y-0.5 transition-all duration-500 group cursor-pointer">
                 {/* Glassmorphism Shine Overlay */}
                 <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                 {/* Sweeping Light Beam */}
                 <div className="absolute top-0 left-[-100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] group-hover:left-[200%] transition-all duration-1000 ease-in-out pointer-events-none"></div>
                 
                 <div className="flex justify-between items-start relative z-10">
                    <div className="flex items-center gap-1.5 lg:gap-2">
                        <Ticket className="text-amber-400 w-6 h-6 lg:w-8 lg:h-8 shrink-0 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
                        <div className="flex flex-col">
                           <span className="text-white font-black text-base lg:text-lg italic tracking-tight leading-none drop-shadow-md">$20.000</span>
                           <span className="text-amber-400 font-black text-[9px] lg:text-[10px] tracking-wider uppercase drop-shadow-sm">Haftalık Çekiliş</span>
                       </div>
                    </div>
                    <div className="bg-[#050505] border border-amber-500/50 rounded-full px-1.5 lg:px-2 py-0.5 shadow-[0_0_8px_rgba(251,191,36,0.3)]">
                       <span className="text-white font-bold text-[10px] lg:text-xs italic">20s</span>
                    </div>
                 </div>
                 
                 <div className="flex justify-between items-center mt-2 lg:mt-3 pt-2 lg:pt-3 border-t border-white/5 relative z-10">
                    <div className="flex flex-col items-center">
                       <span className="text-slate-400 text-[8px] lg:text-[9px] font-bold uppercase tracking-wider">Günlük</span>
                       <span className="text-white font-black text-xs lg:text-sm italic drop-shadow-md">$25K</span>
                    </div>
                    <div className="flex flex-col items-center">
                       <span className="text-slate-400 text-[8px] lg:text-[9px] font-bold uppercase tracking-wider">Haftalık</span>
                       <span className="text-white font-black text-xs lg:text-sm italic drop-shadow-md">$100K</span>
                    </div>
                    <div className="flex flex-col items-center">
                       <span className="text-slate-400 text-[8px] lg:text-[9px] font-bold uppercase tracking-wider">Aylık</span>
                       <span className="text-white font-black text-xs lg:text-sm italic drop-shadow-md">$500K</span>
                    </div>
                 </div>
              </div>

              {/* Main Navigation Links */}
              <div className="flex flex-col gap-1 lg:gap-2 mt-2 lg:mt-4">
                <button 
                  onClick={() => onViewChange('home')}
                  className={`flex items-center gap-2.5 lg:gap-3 px-2.5 lg:px-3 py-2 lg:py-2.5 rounded-lg transition-colors group ${
                    activeView === 'home'
                    ? 'bg-[#111111] text-white' 
                    : 'text-slate-400 hover:text-white hover:bg-[#111111]'
                  }`}
                >
                  <Crown className={`w-4 h-4 lg:w-5 lg:h-5 icon-wiggle ${activeView === 'home' ? 'text-[#06b6d4]' : ''}`} stroke="currentColor" fill="rgba(6,182,212,0.2)" strokeWidth={1.5} />
                  <span className="font-bold text-[13px] lg:text-[14px]">Anasayfa</span>
                </button>

                {userRole && userRole !== 'guest' && (
                  <>
                    <button className="flex items-center gap-2.5 lg:gap-3 px-2.5 lg:px-3 py-2 lg:py-2.5 rounded-lg transition-colors text-slate-400 hover:text-white hover:bg-[#111111] group">
                      <Star className="w-4 h-4 lg:w-5 lg:h-5 icon-wiggle" stroke="currentColor" fill="rgba(16,185,129,0.2)" strokeWidth={1.5} />
                      <span className="font-bold text-[13px] lg:text-[14px]">Sık Kullanılanlar</span>
                    </button>

                    <button className="flex items-center gap-2.5 lg:gap-3 px-2.5 lg:px-3 py-2 lg:py-2.5 rounded-lg transition-colors text-slate-400 hover:text-white hover:bg-[#111111] group">
                      <Copy className="w-4 h-4 lg:w-5 lg:h-5 icon-wiggle" stroke="currentColor" fill="rgba(99,102,241,0.2)" strokeWidth={1.5} />
                      <span className="font-bold text-[13px] lg:text-[14px]">Bahislerim</span>
                    </button>
                  </>
                )}
                
                <button className="flex items-center gap-2.5 lg:gap-3 px-2.5 lg:px-3 py-2 lg:py-2.5 rounded-lg transition-colors text-slate-400 hover:text-white hover:bg-[#111111] group">
                  <Radio className="w-4 h-4 lg:w-5 lg:h-5 icon-wiggle text-red-500" stroke="currentColor" fill="rgba(239,68,68,0.2)" strokeWidth={1.5} />
                  <span className="font-bold text-[13px] lg:text-[14px]">Canlı Maçlar</span>
                </button>
              </div>

              <div className="h-[1px] w-full bg-white/5 my-1 lg:my-2" />

              {/* Accordions */}
              <div className="flex flex-col gap-1.5 lg:gap-2">
                
                {/* Popüler Ligler Accordion */}
                <div className="bg-[#111111] rounded-xl overflow-hidden border border-white/5">
                  <button 
                    onClick={() => setIsFavLeaguesOpen(!isFavLeaguesOpen)}
                    className="w-full flex items-center justify-between px-3 lg:px-4 py-2.5 lg:py-3 text-white hover:bg-white/5 transition-colors group"
                  >
                    <div className="flex items-center gap-2.5 lg:gap-3">
                      <Trophy className="w-4 h-4 lg:w-5 lg:h-5 text-slate-400 group-hover:text-white transition-colors" />
                      <span className="font-bold text-[13px] lg:text-[14px]">Popüler Ligler</span>
                    </div>
                    <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${isFavLeaguesOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isFavLeaguesOpen && (
                    <div className="px-2 pb-2 flex flex-col">
                      {[
                        { title: 'Süper Lig', country: 'tr' },
                        { title: 'Premier Lig', country: 'gb' },
                        { title: 'La Liga', country: 'es' },
                        { title: 'Bundesliga', country: 'de' },
                        { title: 'Serie A', country: 'it' },
                        { title: 'Ligue 1', country: 'fr' },
                        { title: 'NBA', country: 'us' }
                      ].map((league, idx) => (
                        <button key={idx} className="flex items-center gap-2.5 lg:gap-3 px-3 lg:px-4 py-1.5 lg:py-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-left group">
                          <img src={`https://flagcdn.com/w20/${league.country}.png`} alt={league.country} className="w-3.5 h-3.5 lg:w-4 lg:h-4 rounded-sm object-cover opacity-70 group-hover:opacity-100" />
                          <span className="text-[12px] lg:text-[13px] font-medium">{league.title}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Casino Accordion */}
                <div className="bg-[#111111] rounded-xl overflow-hidden border border-white/5">
                  <button 
                    onClick={() => setIsCasinoOpen(!isCasinoOpen)}
                    className="w-full flex items-center justify-between px-3 lg:px-4 py-2.5 lg:py-3 text-white hover:bg-white/5 transition-colors group"
                  >
                    <div className="flex items-center gap-2.5 lg:gap-3">
                      <Cherry className="w-4 h-4 lg:w-5 lg:h-5 text-slate-400 group-hover:text-white transition-colors" />
                      <span className="font-bold text-[13px] lg:text-[14px]">Casino</span>
                      <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-[#10b981] ml-1 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                    </div>
                    <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${isCasinoOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isCasinoOpen && (
                    <div className="px-2 pb-2 flex flex-col gap-0.5">
                      <button onClick={() => onViewChange('blackjack')} className="flex items-center gap-2.5 px-3 lg:px-4 py-1.5 lg:py-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-left text-[12px] lg:text-[13px] font-medium">Lobi</button>
                      <button className="flex items-center gap-2.5 px-3 lg:px-4 py-1.5 lg:py-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-left text-[12px] lg:text-[13px] font-medium">Slotlar</button>
                      <button className="flex items-center gap-2.5 px-3 lg:px-4 py-1.5 lg:py-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-left text-[12px] lg:text-[13px] font-medium">Canlı Casino</button>
                      <button className="flex items-center gap-2.5 px-3 lg:px-4 py-1.5 lg:py-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-left text-[12px] lg:text-[13px] font-medium">Rulet</button>
                      <button className="flex items-center gap-2.5 px-3 lg:px-4 py-1.5 lg:py-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-left text-[12px] lg:text-[13px] font-medium">Blackjack</button>
                      <button className="flex items-center gap-2.5 px-3 lg:px-4 py-1.5 lg:py-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-left text-[12px] lg:text-[13px] font-medium">Baccarat</button>
                      <button className="flex items-center gap-2.5 px-3 lg:px-4 py-1.5 lg:py-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-left text-[12px] lg:text-[13px] font-medium">Show Oyunları</button>
                    </div>
                  )}
                </div>

                {/* Originals Accordion */}
                <div className="bg-[#111111] rounded-xl overflow-hidden border border-white/5">
                  <button 
                    onClick={() => setIsOriginalsOpen(!isOriginalsOpen)}
                    className="w-full flex items-center justify-between px-3 lg:px-4 py-2.5 lg:py-3 text-white hover:bg-white/5 transition-colors group"
                  >
                    <div className="flex items-center gap-2.5 lg:gap-3">
                      <Target className="w-4 h-4 lg:w-5 lg:h-5 text-slate-400 group-hover:text-white transition-colors" />
                      <span className="font-bold text-[13px] lg:text-[14px]">Originals</span>
                    </div>
                    <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${isOriginalsOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOriginalsOpen && (
                    <div className="px-2 pb-2 flex flex-col gap-0.5">
                      <button onClick={() => onViewChange('originals')} className="flex items-center gap-2.5 px-3 lg:px-4 py-1.5 lg:py-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-left text-[12px] lg:text-[13px] font-medium">Crash</button>
                      <button onClick={() => onViewChange('originals')} className="flex items-center gap-2.5 px-3 lg:px-4 py-1.5 lg:py-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-left text-[12px] lg:text-[13px] font-medium">Dice</button>
                      <button onClick={() => onViewChange('originals')} className="flex items-center gap-2.5 px-3 lg:px-4 py-1.5 lg:py-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-left text-[12px] lg:text-[13px] font-medium">Plinko</button>
                      <button onClick={() => onViewChange('originals')} className="flex items-center gap-2.5 px-3 lg:px-4 py-1.5 lg:py-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-left text-[12px] lg:text-[13px] font-medium">Mines</button>
                      <button onClick={() => onViewChange('originals')} className="flex items-center gap-2.5 px-3 lg:px-4 py-1.5 lg:py-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-left text-[12px] lg:text-[13px] font-medium">Keno</button>
                    </div>
                  )}
                </div>

                {/* Promosyonlar Accordion */}
                <div className="bg-[#111111] rounded-xl overflow-hidden border border-white/5">
                  <button 
                    onClick={() => setIsPromosOpen(!isPromosOpen)}
                    className="w-full flex items-center justify-between px-3 lg:px-4 py-2.5 lg:py-3 text-white hover:bg-white/5 transition-colors group"
                  >
                    <div className="flex items-center gap-2.5 lg:gap-3">
                      <Percent className="w-4 h-4 lg:w-5 lg:h-5 text-slate-400 group-hover:text-white transition-colors" />
                      <span className="font-bold text-[13px] lg:text-[14px]">Promosyonlar</span>
                    </div>
                    <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${isPromosOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isPromosOpen && (
                    <div className="px-2 pb-2 flex flex-col gap-0.5">
                      <button className="flex items-center gap-2.5 px-3 lg:px-4 py-1.5 lg:py-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-left text-[12px] lg:text-[13px] font-medium">Hoşgeldin Bonusu</button>
                      <button className="flex items-center gap-2.5 px-3 lg:px-4 py-1.5 lg:py-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-left text-[12px] lg:text-[13px] font-medium">Yatırım Bonusları</button>
                      <button className="flex items-center gap-2.5 px-3 lg:px-4 py-1.5 lg:py-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-left text-[12px] lg:text-[13px] font-medium">Kayıp Bonusları</button>
                      <button className="flex items-center gap-2.5 px-3 lg:px-4 py-1.5 lg:py-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-left text-[12px] lg:text-[13px] font-medium">Turnuvalar</button>
                    </div>
                  )}
                </div>
              </div>

              <div className="h-[1px] w-full bg-white/5 my-1 lg:my-2" />

              {/* Bottom Links */}
              <div className="flex flex-col gap-1 lg:gap-2">
                <button className="flex items-center gap-2.5 lg:gap-3 px-2.5 lg:px-3 py-2 lg:py-2.5 rounded-lg transition-colors text-slate-400 hover:text-white hover:bg-[#111111] group">
                  <Gift className="w-4 h-4 lg:w-5 lg:h-5 text-[#06b6d4] icon-wiggle" strokeWidth={1.5} />
                  <span className="font-bold text-[13px] lg:text-[14px]">Ödüller</span>
                </button>
                <button className="flex items-center gap-2.5 lg:gap-3 px-2.5 lg:px-3 py-2 lg:py-2.5 rounded-lg transition-colors text-slate-400 hover:text-white hover:bg-[#111111] group">
                  <Star className="w-4 h-4 lg:w-5 lg:h-5 text-amber-400 icon-wiggle" strokeWidth={1.5} />
                  <span className="font-bold text-[13px] lg:text-[14px]">VIP Kulübü</span>
                </button>
                <button className="flex items-center gap-2.5 lg:gap-3 px-2.5 lg:px-3 py-2 lg:py-2.5 rounded-lg transition-colors text-slate-400 hover:text-white hover:bg-[#111111] group">
                  <Headphones className="w-4 h-4 lg:w-5 lg:h-5 icon-wiggle" strokeWidth={1.5} />
                  <span className="font-bold text-[13px] lg:text-[14px]">Canlı Destek</span>
                </button>
                <button className="flex items-center gap-2.5 lg:gap-3 px-2.5 lg:px-3 py-2 lg:py-2.5 rounded-lg transition-colors text-slate-400 hover:text-white hover:bg-[#111111] group">
                  <FileText className="w-4 h-4 lg:w-5 lg:h-5 icon-wiggle" strokeWidth={1.5} />
                  <span className="font-bold text-[13px] lg:text-[14px]">Kurallar & Şartlar</span>
                </button>
                <div 
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className="flex items-center justify-between px-2.5 lg:px-3 py-2 lg:py-2.5 rounded-lg cursor-pointer transition-colors text-slate-400 hover:text-white hover:bg-[#111111]"
                >
                  <div className="flex items-center gap-2.5 lg:gap-3">
                    <Globe className="w-4 h-4 lg:w-5 lg:h-5" />
                    <span className="font-bold text-[13px] lg:text-[14px]">Dil: Türkçe</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
                </div>
              </div>

            </div>
          )}

          {!isOpen && (
            <div className="flex flex-col items-center py-4 gap-4 w-full relative z-[100]">
              {/* Collapsed icons only */}
              <button onClick={() => onViewChange('home')} className={`group relative w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${activeView === 'home' || activeView === 'blackjack' ? 'bg-[#111111] text-white border-l-2 border-[#10b981]' : 'text-slate-400 hover:text-white hover:bg-[#111111]'}`}>
                <Crown className={`w-5 h-5 ${activeView === 'home' ? 'text-[#10b981]' : ''}`} />
                <div className="absolute left-full ml-4 px-2 py-1 bg-[#111111] text-white text-xs font-bold rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 whitespace-nowrap z-50">Anasayfa</div>
              </button>
              <button className="group relative w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#111111] transition-colors">
                <Star className="w-5 h-5" />
                <div className="absolute left-full ml-4 px-2 py-1 bg-[#111111] text-white text-xs font-bold rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 whitespace-nowrap z-50">Sık Kullanılanlar</div>
              </button>
              <button className="group relative w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#111111] transition-colors">
                <Copy className="w-5 h-5" />
                <div className="absolute left-full ml-4 px-2 py-1 bg-[#111111] text-white text-xs font-bold rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 whitespace-nowrap z-50">Bahislerim</div>
              </button>
              <button className="group relative w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#111111] transition-colors">
                <Radio className="w-5 h-5" />
                <div className="absolute left-full ml-4 px-2 py-1 bg-[#111111] text-white text-xs font-bold rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 whitespace-nowrap z-50">Canlı Maçlar</div>
              </button>
              <button onClick={() => {onToggle(); setIsFavLeaguesOpen(true);}} className="group relative w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#111111] transition-colors">
                <Trophy className="w-5 h-5" />
                <div className="absolute left-full ml-4 px-2 py-1 bg-[#111111] text-white text-xs font-bold rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 whitespace-nowrap z-50">Popüler Ligler</div>
              </button>
              <div className="w-10 h-px bg-white/5 my-1"></div>
              <button onClick={() => {onToggle(); setIsCasinoOpen(true);}} className="group relative w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#111111] transition-colors">
                <Cherry className="w-5 h-5" />
                <div className="absolute left-full ml-4 px-2 py-1 bg-[#111111] text-white text-xs font-bold rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 whitespace-nowrap z-50">Casino</div>
              </button>
              <button onClick={() => {onToggle(); setIsOriginalsOpen(true);}} className="group relative w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#111111] transition-colors">
                <Target className="w-5 h-5" />
                <div className="absolute left-full ml-4 px-2 py-1 bg-[#111111] text-white text-xs font-bold rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 whitespace-nowrap z-50">Originals</div>
              </button>
              <button onClick={() => {onToggle(); setIsPromosOpen(true);}} className="group relative w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#111111] transition-colors">
                <Percent className="w-5 h-5" />
                <div className="absolute left-full ml-4 px-2 py-1 bg-[#111111] text-white text-xs font-bold rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 whitespace-nowrap z-50">Promosyonlar</div>
              </button>
              <div className="w-10 h-px bg-white/5 my-1"></div>
              <button className="group relative w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#111111] transition-colors">
                <Gift className="w-5 h-5" />
                <div className="absolute left-full ml-4 px-2 py-1 bg-[#111111] text-white text-xs font-bold rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 whitespace-nowrap z-50">Ödüller</div>
              </button>
              <button className="group relative w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#111111] transition-colors">
                <FileText className="w-5 h-5" />
                <div className="absolute left-full ml-4 px-2 py-1 bg-[#111111] text-white text-xs font-bold rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 whitespace-nowrap z-50">Blog</div>
              </button>
              <button onClick={() => window.dispatchEvent(new Event('openSupportChat'))} className="group relative w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#111111] transition-colors">
                <Headphones className="w-5 h-5" />
                <div className="absolute left-full ml-4 px-2 py-1 bg-[#111111] text-white text-xs font-bold rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 whitespace-nowrap z-50">Canlı Destek</div>
              </button>
              <button onClick={() => {onToggle(); setIsLangOpen(!isLangOpen);}} className="group relative w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#111111] transition-colors">
                <Globe className="w-5 h-5" />
                <div className="absolute left-full ml-4 px-2 py-1 bg-[#111111] text-white text-xs font-bold rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 whitespace-nowrap z-50">Dil Seçimi</div>
              </button>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default Sidebar;
