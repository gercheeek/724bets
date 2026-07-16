import React, { useState, useEffect } from 'react';
import { ChevronLeft, Maximize2, Minimize2, Wallet, User, Info, Trophy, Sparkles, ChevronRight, MessageSquare, Activity, X } from 'lucide-react';
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
  const [isMobileLeftOpen, setIsMobileLeftOpen] = useState(false);
  const [isMobileRightOpen, setIsMobileRightOpen] = useState(false);

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
        
        {/* Mobile/Tablet Overlays */}
        {(isMobileLeftOpen || (isMobileRightOpen && window.innerWidth < 768)) && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 xl:hidden" onClick={() => {setIsMobileLeftOpen(false); setIsMobileRightOpen(false);}}></div>
        )}

        {/* Tablet Left Toggle Button */}
        <button 
          onClick={() => setIsMobileLeftOpen(true)}
          className={`hidden md:flex xl:hidden absolute left-0 top-1/2 -translate-y-1/2 z-30 p-2 bg-[#3B82F6]/20 border border-[#3B82F6]/50 hover:bg-[#3B82F6]/40 backdrop-blur-md rounded-r-xl transition-all shadow-[0_0_15px_rgba(59,130,246,0.5)] ${showLeftPanel && !isFullscreen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
          <ChevronRight className="w-6 h-6 text-[#3B82F6]" />
        </button>

        {/* Left Panel: Stats */}
        <aside className={`
          flex flex-col bg-[#0f172a]/80 backdrop-blur-xl border-r border-blue-500/15 hover:border-blue-500/30 overflow-y-auto transition-all duration-500 ease-in-out z-50
          fixed inset-y-0 left-0 w-[80%] sm:w-[320px] xl:relative xl:w-[20%] xl:translate-x-0
          ${isMobileLeftOpen ? 'translate-x-0 opacity-100 shadow-[20px_0_50px_rgba(0,0,0,0.8)]' : '-translate-x-full opacity-0 xl:opacity-100 xl:shadow-none'}
          ${!showLeftPanel ? 'xl:-translate-x-full xl:opacity-0 xl:absolute' : ''}
        `}>
           <div className="p-5 flex flex-col gap-6 relative">
              
              {/* Close Button Mobile/Tablet */}
              <button onClick={() => setIsMobileLeftOpen(false)} className="absolute top-4 right-4 xl:hidden p-1 bg-white/5 rounded-md hover:bg-white/10 text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
              
              {/* Player Stats Widget */}
              <div className="bg-black/20 rounded-xl p-4 border border-blue-500/15 hover:border-blue-500/30 shadow-[0_8px_30px_rgba(0,0,0,0.5)] relative overflow-hidden group transition-colors">
                 <div className="absolute inset-0 bg-gradient-to-b from-[#10B981]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                 <div className="flex items-center gap-2 mb-4 relative z-10">
                    <Info className="w-4 h-4 text-[#10B981]" />
                    <h3 className="font-bold text-sm text-gray-200 tracking-wider uppercase">Oyuncu İstatistikleri</h3>
                 </div>
                 <div className="grid grid-cols-2 gap-3 relative z-10">
                    <div className="bg-[#05070A]/50 rounded-lg p-3 border border-blue-500/10 flex flex-col items-center justify-center">
                       <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Toplam Bahis</span>
                       <span className="text-lg font-black text-white font-mono tracking-tighter">1,245</span>
                    </div>
                    <div className="bg-[#05070A]/50 rounded-lg p-3 border border-blue-500/10 flex flex-col items-center justify-center">
                       <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Kazanma Oranı</span>
                       <span className="text-lg font-black text-[#10B981] font-mono tracking-tighter">%48.2</span>
                    </div>
                 </div>
              </div>

              {/* Leaderboard Widget */}
              <div className="bg-black/20 rounded-xl p-4 border border-blue-500/15 hover:border-blue-500/30 shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-colors">
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
                         <span className={`text-sm font-black font-mono tracking-tighter ${winner.color}`}>{winner.amount}</span>
                      </div>
                    ))}
                 </div>
              </div>

              {/* Live Feed Widget */}
              <div className="bg-black/20 rounded-xl p-4 border border-blue-500/15 hover:border-blue-500/30 shadow-[0_8px_30px_rgba(0,0,0,0.5)] flex-1 min-h-[250px] transition-colors flex flex-col overflow-hidden">
                 <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-4 h-4 text-[#3B82F6] animate-pulse" />
                    <h3 className="font-bold text-sm text-gray-200 tracking-wider uppercase">⚡ Canlı Yayın</h3>
                 </div>
                 <div className="flex-1 relative overflow-hidden group/ticker">
                    {/* Faded edges */}
                    <div className="absolute top-0 w-full h-8 bg-gradient-to-b from-[#0f172a] to-transparent z-10 pointer-events-none"></div>
                    <div className="absolute bottom-0 w-full h-8 bg-gradient-to-t from-[#0f172a] to-transparent z-10 pointer-events-none"></div>
                    
                    {/* Ticker Animation */}
                    <style>{`
                      @keyframes ticker {
                        0% { transform: translateY(0); }
                        100% { transform: translateY(-50%); }
                      }
                      .animate-ticker {
                        animation: ticker 15s linear infinite;
                      }
                    `}</style>
                    <div className="flex flex-col gap-2 absolute top-0 left-0 w-full animate-ticker group-hover/ticker:[animation-play-state:paused]">
                       
                       {/* Repeat items for infinite scroll effect */}
                       {[1, 2].map((set) => (
                         <React.Fragment key={set}>
                           <div className="flex items-center justify-between p-2 rounded-lg bg-gradient-to-r from-[#10B981]/20 to-transparent border-l-2 border-[#10B981] animate-pulse">
                              <div className="flex flex-col">
                                 <span className="text-[11px] font-bold text-gray-300 font-mono">14:22 | AhM***</span>
                                 <span className="text-[10px] text-gray-400">Blackjack Pro</span>
                              </div>
                              <span className="text-sm font-black text-[#10B981] font-mono tracking-tighter drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]">x12.5</span>
                           </div>
                           <div className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors">
                              <div className="flex flex-col">
                                 <span className="text-[11px] font-bold text-gray-400 font-mono">14:21 | DeN***</span>
                                 <span className="text-[10px] text-gray-500">Mines</span>
                              </div>
                              <span className="text-sm font-black text-white font-mono tracking-tighter">x2.0</span>
                           </div>
                           <div className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors">
                              <div className="flex flex-col">
                                 <span className="text-[11px] font-bold text-gray-400 font-mono">14:20 | XxS***</span>
                                 <span className="text-[10px] text-gray-500">Plinko</span>
                              </div>
                              <span className="text-sm font-black text-white font-mono tracking-tighter">x1.5</span>
                           </div>
                           <div className="flex items-center justify-between p-2 rounded-lg bg-gradient-to-r from-[#10B981]/20 to-transparent border-l-2 border-[#10B981] animate-pulse">
                              <div className="flex flex-col">
                                 <span className="text-[11px] font-bold text-gray-300 font-mono">14:18 | Pro***</span>
                                 <span className="text-[10px] text-gray-400">Blackjack Pro</span>
                              </div>
                              <span className="text-sm font-black text-[#10B981] font-mono tracking-tighter drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]">x25.0</span>
                           </div>
                         </React.Fragment>
                       ))}

                    </div>
                 </div>
              </div>

           </div>
        </aside>

        {/* Center Game Area */}
        <main className="flex-1 w-full md:w-[75%] xl:w-[60%] flex flex-col relative bg-black/40 p-0 sm:p-4 lg:p-6 shadow-inner transition-all duration-500">
           
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
        <aside className={`
          flex flex-col bg-[#0f172a]/80 backdrop-blur-xl border-l border-blue-500/15 hover:border-blue-500/30 transition-all duration-500 ease-in-out z-50
          fixed inset-y-0 right-0 w-[80%] sm:w-[350px] md:relative md:w-[25%] xl:w-[20%] md:translate-x-0
          ${isMobileRightOpen ? 'translate-x-0 opacity-100 shadow-[-20px_0_50px_rgba(0,0,0,0.8)]' : 'translate-x-full opacity-0 md:opacity-100 md:shadow-none'}
          ${!showRightPanel ? 'md:translate-x-full md:opacity-0 md:absolute' : ''}
        `}>
           <div className="h-full w-full relative z-10 font-mono tracking-tight pt-10 md:pt-0">
              
              {/* Close Button Mobile */}
              <button onClick={() => setIsMobileRightOpen(false)} className="absolute top-2 right-4 md:hidden p-1 bg-white/5 rounded-md hover:bg-white/10 text-gray-400 hover:text-white z-20">
                <X className="w-5 h-5" />
              </button>

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
      
      {/* Mobile FABs */}
      <div className={`md:hidden absolute bottom-6 left-4 z-30 transition-transform duration-500 ${!showLeftPanel || isMobileLeftOpen || isFullscreen ? 'translate-y-24' : 'translate-y-0'}`}>
         <button onClick={() => setIsMobileLeftOpen(true)} className="w-12 h-12 bg-black/60 backdrop-blur-md border border-[#3B82F6]/50 rounded-full flex items-center justify-center text-[#3B82F6] shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:scale-110 transition-transform">
           <Activity className="w-5 h-5" />
         </button>
      </div>
      <div className={`md:hidden absolute bottom-6 right-4 z-30 transition-transform duration-500 ${!showRightPanel || isMobileRightOpen || isFullscreen ? 'translate-y-24' : 'translate-y-0'}`}>
         <button onClick={() => setIsMobileRightOpen(true)} className="w-12 h-12 bg-black/60 backdrop-blur-md border border-[#10B981]/50 rounded-full flex items-center justify-center text-[#10B981] shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:scale-110 transition-transform">
           <MessageSquare className="w-5 h-5" />
         </button>
      </div>

    </div>
  );
};

export default InGameLayout;
