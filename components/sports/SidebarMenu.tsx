import React from 'react';
import { Activity, Star, Flame, Trophy, Clock, Search, Home, Cherry, PlaySquare, Gift, ChevronRight } from 'lucide-react';

export const SidebarMenu: React.FC<{
  activeSport: string;
  setActiveSport: (s: string) => void;
  sportsList: string[];
  language: string;
  getSportIcon: (sport: string) => React.ReactNode;
}> = ({ activeSport, setActiveSport, sportsList, language, getSportIcon }) => {
  return (
    <div className="hidden lg:flex w-[260px] flex-col bg-zinc-950 border-r border-white/5 shrink-0 h-full overflow-y-auto custom-scrollbar shadow-[4px_0_24px_rgba(0,0,0,0.4)] z-20">
      
      {/* Header / Logo Area */}
      <div className="p-5 border-b border-white/5 sticky top-0 bg-zinc-950/90 backdrop-blur-xl z-20 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 flex items-center justify-center border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)] relative overflow-hidden">
             <div className="absolute inset-0 bg-emerald-500/10 blur-md"></div>
             <Activity className="w-5 h-5 text-emerald-400 relative z-10" />
          </div>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-400 font-black text-lg tracking-widest uppercase drop-shadow-sm">724SPORTS</span>
        </div>
        
        {/* Search Input */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors group-focus-within:text-emerald-400 text-zinc-500">
            <Search className="w-4 h-4" />
          </div>
          <input 
            type="text" 
            placeholder={language === 'tr' ? 'Takım veya maç ara...' : 'Search team or match...'}
            className="w-full bg-zinc-900/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-zinc-200 text-[13px] font-medium focus:outline-none focus:border-emerald-500/50 focus:bg-zinc-900 transition-all placeholder:text-zinc-600 shadow-inner group-hover:border-white/20"
          />
        </div>
      </div>

      <div className="flex-1 px-3 py-4 space-y-6">

        {/* Main Menu Links */}
        <div>
          <div className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-3 px-3">
            {language === 'tr' ? 'Ana Menü' : 'Main Menu'}
          </div>
          <div className="space-y-1">
            <button className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all group">
              <div className="flex items-center gap-3">
                <Home className="w-[18px] h-[18px] text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                <span className="text-[13px] font-bold">{language === 'tr' ? 'Ana Sayfa' : 'Home'}</span>
              </div>
            </button>
            <button className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all group">
              <div className="flex items-center gap-3">
                <Cherry className="w-[18px] h-[18px] text-zinc-500 group-hover:text-pink-500 transition-colors" />
                <span className="text-[13px] font-bold">Casino</span>
              </div>
            </button>
            <button className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all group">
              <div className="flex items-center gap-3">
                <PlaySquare className="w-[18px] h-[18px] text-zinc-500 group-hover:text-blue-500 transition-colors" />
                <span className="text-[13px] font-bold">{language === 'tr' ? 'Canlı Casino' : 'Live Casino'}</span>
              </div>
            </button>
            <button className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all group">
              <div className="flex items-center gap-3">
                <Gift className="w-[18px] h-[18px] text-zinc-500 group-hover:text-yellow-500 transition-colors" />
                <span className="text-[13px] font-bold">{language === 'tr' ? 'Promosyonlar' : 'Promotions'}</span>
              </div>
            </button>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <div className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-3 px-3">
            {language === 'tr' ? 'Hızlı Erişim' : 'Quick Links'}
          </div>
          <div className="space-y-1">
            <button className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all group">
              <div className="flex items-center gap-3">
                <Flame className="w-[18px] h-[18px] text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]" />
                <span className="text-[13px] font-bold">Popüler Karşılaşmalar</span>
              </div>
            </button>
            <button className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all group">
              <div className="flex items-center gap-3">
                <Star className="w-[18px] h-[18px] text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.4)]" />
                <span className="text-[13px] font-bold">Favorilerim</span>
              </div>
            </button>
            <button className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all group">
              <div className="flex items-center gap-3">
                <Clock className="w-[18px] h-[18px] text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.4)]" />
                <span className="text-[13px] font-bold">Yaklaşan Maçlar</span>
              </div>
            </button>
          </div>
        </div>

        {/* Sports List */}
        <div>
          <div className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-3 px-3 flex items-center justify-between">
            <span>{language === 'tr' ? 'Tüm Sporlar' : 'All Sports'}</span>
            <span className="bg-white/5 px-2 py-0.5 rounded text-[9px] text-zinc-400">{sportsList.length}</span>
          </div>
          <div className="space-y-1">
            {sportsList.map(sport => {
              const isActive = activeSport === sport;
              return (
                <button
                  key={sport}
                  onClick={() => setActiveSport(sport)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] font-bold transition-all group relative overflow-hidden ${
                    isActive 
                      ? 'text-emerald-400 bg-gradient-to-r from-emerald-500/10 to-transparent border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]' 
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-emerald-500 rounded-r-full shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                  )}
                  <div className="flex items-center gap-3">
                    <span className={`transition-all duration-300 ${isActive ? 'scale-110 text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'text-zinc-500 group-hover:text-zinc-400 group-hover:scale-110'}`}>
                      {getSportIcon(sport)}
                    </span>
                    <span className="tracking-wide relative z-10">{sport}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 opacity-70 relative z-10 text-emerald-500" />}
                </button>
              )
            })}
          </div>
        </div>
        
      </div>
    </div>
  );
};
