import React, { useState } from 'react';
import {
  Menu, Trophy, Star, 
  Target, Gift, Ticket, Globe, 
  Crown, ChevronDown, ChevronUp, Sparkles, Cherry, Percent, Headphones, FileText, Copy, Radio
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

  const [activeTab, setActiveTab] = useState<'casino' | 'spor'>('casino');
  
  // Accordion states
  const [isCasinoOpen, setIsCasinoOpen] = useState(false);
  const [isOriginalsOpen, setIsOriginalsOpen] = useState(false);
  const [isPromosOpen, setIsPromosOpen] = useState(false);

  const isRetroVIP = activeView === 'raffle' || activeView === 'originals' || activeView === 'vip';

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
          color: #d4d4d8;
        }
        .navy-sidebar-inner {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          overflow-x: hidden;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.1) transparent;
        }
        .navy-sidebar-inner::-webkit-scrollbar {
          width: 4px;
        }
        .navy-sidebar-inner::-webkit-scrollbar-track {
          background: transparent;
        }
        .navy-sidebar-inner::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.12);
          border-radius: 4px;
        }
        .navy-sidebar-inner::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.25);
        }
        .nav-item {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 14px;
          color: #94a3b8;
          transition: all 0.2s;
          cursor: pointer;
        }
        .nav-item:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.03);
        }
        .nav-item.active {
          color: #fff;
          background: var(--active-bg, #1e293b);
          border-left: 4px solid var(--active-border, #10b981);
          border-top-left-radius: 4px;
          border-bottom-left-radius: 4px;
        }
        .retro-vip-active .nav-item.active {
          background-color: rgba(0, 255, 255, 0.1) !important;
          border-left: 3px solid #00ffff !important;
          color: #00ffff !important;
          font-family: monospace;
          text-shadow: 0 0 5px #00ffff;
        }
        .retro-vip-active .nav-item.active svg {
          color: #ff00ff !important;
        }
        .retro-vip-active .nav-item {
          font-family: monospace;
        }
        .collapsible-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          font-weight: 800;
          font-size: 12px;
          color: #64748b;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          cursor: pointer;
          transition: color 0.2s;
        }
        .collapsible-header:hover {
          color: #fff;
        }
        .retro-vip-active-container {
          background: repeating-linear-gradient(to bottom, rgba(0, 255, 255, 0.03) 0px, rgba(0, 255, 255, 0.03) 1px, #050510 1px, #050510 3px), linear-gradient(180deg, #0a0a1a 0%, #03030a 100%) !important;
          border-right: 1px solid rgba(255, 0, 255, 0.2) !important;
        }
      `}</style>

      {/* Mobile Overlay */}
      <div className="sidebar-overlay" onClick={onToggle} style={{ display: 'none' }} />

      <div className={`navy-sidebar-container ${isOpen ? 'sidebar-open' : 'sidebar-collapsed'} ${isRetroVIP ? 'retro-vip-active retro-vip-active-container' : ''}`}>
        <div className="navy-sidebar-inner pb-6">
          
          {isOpen ? (
            <>
              {/* Header Toggle Section */}
              <div className="pt-4 px-3 mb-4">
                 <div className="flex bg-[#131313] rounded-xl p-1 border border-white/5">
                   <button 
                     onClick={() => setActiveTab('casino')}
                     className={`flex-1 py-2.5 rounded-lg text-[13px] font-bold transition-all flex items-center justify-center ${
                       activeTab === 'casino' 
                         ? 'bg-[#1e1e1e] text-white shadow-md' 
                         : 'text-zinc-500 hover:text-zinc-300'
                     }`}
                   >
                     Casino
                   </button>
                   <button 
                     onClick={() => setActiveTab('spor')}
                     className={`flex-1 py-2.5 rounded-lg text-[13px] font-bold transition-all flex items-center justify-center ${
                       activeTab === 'spor' 
                         ? 'bg-[#1e1e1e] text-white shadow-md' 
                         : 'text-zinc-500 hover:text-zinc-300'
                     }`}
                   >
                     Spor
                   </button>
                 </div>
              </div>

              {/* Main Navigation Links */}
              <div className="px-3 space-y-1 mb-4">
                <div className={`nav-item ${activeView === 'home' ? 'active' : ''}`} onClick={() => onViewChange('home')}>
                  <Crown className={`w-5 h-5 mr-3 ${activeView === 'home' ? 'text-emerald-400' : ''}`} />
                  Anasayfa
                </div>

                <div className="nav-item" onClick={() => onViewChange('sports')}>
                  <Star className="w-5 h-5 text-amber-400 mr-3" />
                  Sık Kullanılanlar
                </div>

                <div className="nav-item" onClick={() => onViewChange('mybets')}>
                  <Copy className="w-5 h-5 text-[#818cf8] mr-3" />
                  Bahislerim
                </div>
              </div>

              <div className="h-px bg-white/5 w-full my-2" />

              {/* Accordions */}
              <div className="px-3 space-y-1">
                {/* Casino */}
                <div>
                  <div className="collapsible-header" onClick={() => setIsCasinoOpen(!isCasinoOpen)}>
                    <div className="flex items-center gap-3">
                      <Cherry className="w-5 h-5 text-zinc-400" />
                      <span>CASİNO</span>
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_5px_rgba(16,185,129,0.5)]"></div>
                    </div>
                    {isCasinoOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                  {isCasinoOpen && (
                    <div className="pl-11 pr-2 pb-2 space-y-2">
                      <div className="text-zinc-400 hover:text-white text-sm font-semibold cursor-pointer py-1" onClick={() => onViewChange('blackjack')}>Popüler Slotlar</div>
                      <div className="text-zinc-400 hover:text-white text-sm font-semibold cursor-pointer py-1" onClick={() => onViewChange('blackjack')}>Canlı Casino</div>
                      <div className="text-zinc-400 hover:text-white text-sm font-semibold cursor-pointer py-1" onClick={() => onViewChange('blackjack')}>Masa Oyunları</div>
                    </div>
                  )}
                </div>

                <div className="h-px bg-white/5 w-[85%] mx-auto my-1" />

                {/* Originals */}
                <div>
                  <div className="collapsible-header" onClick={() => setIsOriginalsOpen(!isOriginalsOpen)}>
                    <div className="flex items-center gap-3">
                      <Target className="w-5 h-5 text-zinc-400" />
                      <span>ORİGİNALS</span>
                    </div>
                    {isOriginalsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                  {isOriginalsOpen && (
                    <div className="pl-11 pr-2 pb-2 space-y-2">
                      <div className="text-zinc-400 hover:text-white text-sm font-semibold cursor-pointer py-1" onClick={() => onViewChange('originals')}>Plinko</div>
                      <div className="text-zinc-400 hover:text-white text-sm font-semibold cursor-pointer py-1" onClick={() => onViewChange('originals')}>Crash</div>
                      <div className="text-zinc-400 hover:text-white text-sm font-semibold cursor-pointer py-1" onClick={() => onViewChange('originals')}>Mines</div>
                      <div className="text-fuchsia-400 hover:text-fuchsia-300 text-sm font-bold cursor-pointer py-1 flex items-center gap-2" onClick={() => onViewChange('retro-wheel')}>
                        Çarkıfelek <span className="text-[10px] bg-fuchsia-500/20 px-1 rounded border border-fuchsia-500/50">YENİ</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="h-px bg-white/5 w-[85%] mx-auto my-1" />
              </div>

              <div className="h-px bg-white/5 w-full my-4" />

              {/* Footer Links */}
              <div className="px-3 space-y-1 mt-2">
                <div className="nav-item" onClick={() => onViewChange('rewards')}>
                  <Gift className="w-5 h-5 text-[#0ea5e9] mr-3" />
                  Ödüller
                </div>
                <div className="nav-item" onClick={() => onViewChange('loyalty')}>
                  <Crown className="w-5 h-5 text-amber-500 mr-3" />
                  VIP Kulübü
                </div>
                <div className="nav-item" onClick={() => window.dispatchEvent(new Event('openSupportChat'))}>
                  <Headphones className="w-5 h-5 text-emerald-400 mr-3" />
                  Canlı Destek
                </div>
                <div className="nav-item">
                  <FileText className="w-5 h-5 text-zinc-400 mr-3" />
                  Kurallar & Şartlar
                </div>
                
                <div className="nav-item flex items-center justify-between">
                  <div className="flex items-center">
                    <Globe className="w-5 h-5 text-zinc-400 mr-3" />
                    Dil: Türkçe
                  </div>
                  <ChevronDown className="w-4 h-4 text-zinc-500" />
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center py-4 gap-4 w-full h-full bg-[#050505] relative z-[100]">
              <button onClick={onToggle} className="text-zinc-300 hover:text-[#10b981] p-2 mb-2">
                <Menu size={24} />
              </button>
              
              <button onClick={() => onViewChange('home')} className={`group relative w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${activeView === 'home' ? 'bg-[#181c2b] text-[#10b981]' : 'text-[#94a3b8] hover:text-[#10b981] hover:bg-white/5'}`}>
                <Crown className="w-5 h-5" />
                <div className="absolute left-full ml-4 px-2 py-1 bg-[#141722] text-white text-xs font-bold rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 whitespace-nowrap z-50">Anasayfa</div>
              </button>
              
              <div className="w-10 h-px bg-white/5 my-1"></div>
              
              <button onClick={() => {onToggle(); setIsCasinoOpen(true);}} className="group relative w-10 h-10 rounded-lg flex items-center justify-center text-[#94a3b8] hover:text-[#10b981] hover:bg-white/5 transition-colors">
                <Cherry className="w-5 h-5" />
                <div className="absolute left-full ml-4 px-2 py-1 bg-[#141722] text-white text-xs font-bold rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 whitespace-nowrap z-50">Casino</div>
              </button>
              <button onClick={() => {onToggle(); setIsOriginalsOpen(true);}} className="group relative w-10 h-10 rounded-lg flex items-center justify-center text-[#94a3b8] hover:text-[#10b981] hover:bg-white/5 transition-colors">
                <Target className="w-5 h-5" />
                <div className="absolute left-full ml-4 px-2 py-1 bg-[#141722] text-white text-xs font-bold rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 whitespace-nowrap z-50">Originals</div>
              </button>
              
              <div className="w-10 h-px bg-white/5 my-1"></div>
              
              <button onClick={() => window.dispatchEvent(new Event('openSupportChat'))} className="group relative w-10 h-10 rounded-lg flex items-center justify-center text-[#94a3b8] hover:text-[#10b981] hover:bg-white/5 transition-colors">
                <Headphones className="w-5 h-5 text-emerald-400" />
                <div className="absolute left-full ml-4 px-2 py-1 bg-[#141722] text-white text-xs font-bold rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 whitespace-nowrap z-50">Canlı Destek</div>
              </button>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default Sidebar;
