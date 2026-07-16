import React, { useState, useEffect } from 'react';
import { ChevronLeft, Maximize2, Minimize2, Wallet, User, Info, Trophy, Sparkles } from 'lucide-react';
import { SiteUser } from '../types';
import ModernChat from './ModernChat';

interface InGameLayoutProps {
  children: React.ReactNode;
  siteUser: SiteUser | null;
  onViewChange: (view: string) => void;
  gameTitle: string;
}

const InGameLayout: React.FC<InGameLayoutProps> = ({ children, siteUser, onViewChange, gameTitle }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showLeftPanel, setShowLeftPanel] = useState(true);
  const [showRightPanel, setShowRightPanel] = useState(true);

  // When fullscreen is toggled, hide/show panels
  useEffect(() => {
    if (isFullscreen) {
      setShowLeftPanel(false);
      setShowRightPanel(false);
    } else {
      setShowLeftPanel(true);
      setShowRightPanel(true);
    }
  }, [isFullscreen]);

  return (
    <div className="flex flex-col h-screen w-full bg-[#05070A] text-white overflow-hidden font-sans">
      
      {/* Top Bar - hides smoothly when fullscreen */}
      <header className={`flex items-center justify-between px-4 sm:px-6 bg-[#0B0E14] border-b border-[#10B981]/20 transition-all duration-500 ease-in-out ${isFullscreen ? 'h-0 opacity-0 overflow-hidden border-b-0' : 'h-16 opacity-100'}`}>
        
        {/* Left: Logo & Back Button */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onViewChange('home')}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="hidden sm:flex items-center gap-2 cursor-pointer" onClick={() => onViewChange('home')}>
             <span className="font-black text-2xl tracking-tighter text-white">724</span>
             <span className="font-black text-2xl tracking-tighter text-[#10B981]">BETS</span>
          </div>
          <div className="h-6 w-px bg-white/10 mx-2 hidden sm:block"></div>
          <h1 className="font-bold text-lg text-gray-200 tracking-wide uppercase drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">{gameTitle}</h1>
        </div>

        {/* Center: Quick Nav (Desktop) */}
        <div className="hidden lg:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
           <button onClick={() => onViewChange('casino')} className="text-gray-300 hover:text-white font-bold text-sm tracking-wider uppercase transition-colors relative group">
             Casino
             <span className="absolute -bottom-5 left-0 w-full h-0.5 bg-[#10B981] scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
           </button>
           <button onClick={() => onViewChange('sports')} className="text-gray-300 hover:text-white font-bold text-sm tracking-wider uppercase transition-colors relative group">
             Spor
             <span className="absolute -bottom-5 left-0 w-full h-0.5 bg-[#10B981] scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
           </button>
        </div>

        {/* Right: Balance & Profile */}
        <div className="flex items-center gap-3 sm:gap-4">
           {siteUser ? (
             <>
               <div className="flex items-center gap-3 bg-[#05070A] border border-white/10 rounded-full py-1.5 px-3 sm:px-4 shadow-inner">
                  <div className="flex flex-col items-end">
                     <span className="text-[10px] text-gray-400 font-medium uppercase tracking-widest leading-none mb-0.5">Bakiye</span>
                     <span className="text-sm sm:text-base font-black text-white leading-none font-mono tracking-tight">₺{siteUser.balance.toLocaleString('tr-TR')}</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#10B981] to-[#047857] flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                     <Wallet className="w-4 h-4 text-white" />
                  </div>
               </div>
               <button className="w-10 h-10 rounded-full bg-[#1A1D24] border border-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                  <User className="w-5 h-5 text-gray-300" />
               </button>
             </>
           ) : (
             <button onClick={() => onViewChange('home')} className="bg-[#10B981] hover:bg-[#0da070] text-black font-bold text-sm py-2 px-6 rounded-full transition-colors shadow-[0_0_20px_rgba(16,185,129,0.3)]">
               Giriş Yap
             </button>
           )}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Left Panel: Stats */}
        <aside className={`hidden xl:flex flex-col w-[320px] bg-[#0A0D11] border-r border-white/5 overflow-y-auto transition-all duration-500 ease-in-out ${showLeftPanel ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 absolute left-0 h-full'}`}>
           <div className="p-5 flex flex-col gap-6">
              
              {/* Player Stats Widget */}
              <div className="bg-[#11141D] rounded-xl p-4 border border-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.5)] relative overflow-hidden group">
                 <div className="absolute inset-0 bg-gradient-to-b from-[#10B981]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                 <div className="flex items-center gap-2 mb-4 relative z-10">
                    <Info className="w-4 h-4 text-[#10B981]" />
                    <h3 className="font-bold text-sm text-gray-200 tracking-wider uppercase">Oyuncu İstatistikleri</h3>
                 </div>
                 <div className="grid grid-cols-2 gap-3 relative z-10">
                    <div className="bg-[#05070A] rounded-lg p-3 border border-white/5 flex flex-col items-center justify-center">
                       <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Toplam Bahis</span>
                       <span className="text-lg font-black text-white font-mono">1,245</span>
                    </div>
                    <div className="bg-[#05070A] rounded-lg p-3 border border-white/5 flex flex-col items-center justify-center">
                       <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Kazanma Oranı</span>
                       <span className="text-lg font-black text-[#10B981] font-mono">%48.2</span>
                    </div>
                 </div>
              </div>

              {/* Leaderboard Widget */}
              <div className="bg-[#11141D] rounded-xl p-4 border border-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
                 <div className="flex items-center gap-2 mb-4">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    <h3 className="font-bold text-sm text-gray-200 tracking-wider uppercase">Lider Tablosu</h3>
                 </div>
                 <div className="flex flex-col gap-2">
                    {[
                      { rank: 1, name: 'CryptoKing', amount: '₺45,200', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
                      { rank: 2, name: 'BetMaster', amount: '₺28,900', color: 'text-gray-300', bg: 'bg-gray-300/10' },
                      { rank: 3, name: 'LuckyStrike', amount: '₺15,400', color: 'text-[#CD7F32]', bg: 'bg-[#CD7F32]/10' },
                    ].map((winner) => (
                      <div key={winner.rank} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                         <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${winner.bg} ${winner.color} text-[10px] font-black`}>{winner.rank}</div>
                            <span className="text-sm font-bold text-gray-300">{winner.name}</span>
                         </div>
                         <span className={`text-sm font-black font-mono ${winner.color}`}>{winner.amount}</span>
                      </div>
                    ))}
                 </div>
              </div>

              {/* Live Feed Widget */}
              <div className="bg-[#11141D] rounded-xl p-4 border border-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.5)] flex-1 min-h-[200px]">
                 <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-4 h-4 text-[#3B82F6]" />
                    <h3 className="font-bold text-sm text-gray-200 tracking-wider uppercase">Canlı Kazançlar</h3>
                 </div>
                 <div className="flex flex-col gap-3 relative overflow-hidden">
                    {/* Faded edges */}
                    <div className="absolute top-0 w-full h-4 bg-gradient-to-b from-[#11141D] to-transparent z-10"></div>
                    <div className="absolute bottom-0 w-full h-8 bg-gradient-to-t from-[#11141D] to-transparent z-10"></div>
                    
                    <div className="flex flex-col gap-3 animate-pulse">
                       {/* Mock items */}
                       <div className="flex items-center justify-between p-2 rounded-lg bg-gradient-to-r from-[#10B981]/10 to-transparent border-l-2 border-[#10B981]">
                          <div className="flex flex-col">
                             <span className="text-xs font-bold text-gray-300">Alex_724</span>
                             <span className="text-[10px] text-gray-500">Mines</span>
                          </div>
                          <span className="text-sm font-black text-[#10B981] font-mono">+₺1,250</span>
                       </div>
                       <div className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5">
                          <div className="flex flex-col">
                             <span className="text-xs font-bold text-gray-400">Can_Y</span>
                             <span className="text-[10px] text-gray-500">Blackjack Pro</span>
                          </div>
                          <span className="text-sm font-black text-white font-mono">+₺400</span>
                       </div>
                    </div>
                 </div>
              </div>

           </div>
        </aside>

        {/* Center Game Area */}
        <main className="flex-1 flex flex-col relative bg-black/40 p-0 sm:p-4 lg:p-6 shadow-inner transition-all duration-500">
           
           {/* Glow background behind game */}
           <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.05),transparent_70%)] pointer-events-none"></div>

           <div className="relative w-full h-full bg-[#0B0E14] sm:rounded-2xl border-0 sm:border border-[#10B981]/20 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col group">
              
              {/* Fullscreen Toggle */}
              <div className="absolute top-4 right-4 z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                 <button 
                   onClick={() => setIsFullscreen(!isFullscreen)}
                   className="p-2.5 bg-black/60 hover:bg-black backdrop-blur-sm border border-white/10 hover:border-[#10B981]/50 rounded-lg transition-all text-gray-300 hover:text-white shadow-lg"
                 >
                   {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                 </button>
              </div>

              {/* Inject the actual game (Blackjack Pro, etc.) */}
              <div className="flex-1 w-full h-full relative z-10 overflow-auto">
                 {children}
              </div>
           </div>
        </main>

        {/* Right Panel: Chat */}
        <aside className={`hidden xl:flex flex-col w-[350px] bg-[#0A0D11] border-l border-white/5 transition-all duration-500 ease-in-out ${showRightPanel ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 absolute right-0 h-full z-0'}`}>
           <div className="h-full w-full relative z-10">
              <ModernChat 
                open={true}
                onOpen={() => {}}
                onClose={() => {}}
                siteUser={siteUser}
                userRole={siteUser?.role || 'user'}
                isMobile={false}
              />
           </div>
        </aside>

      </div>
    </div>
  );
};

export default InGameLayout;
