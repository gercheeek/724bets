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
    <div className="hidden lg:flex w-[260px] flex-col bg-[#0b0e14]/90 backdrop-blur-2xl border-r border-white/[0.03] shrink-0 h-full overflow-y-auto custom-scrollbar shadow-[10px_0_30px_rgba(0,0,0,0.5)] z-20">
      
      {/* Header / Logo Area */}
      <div className="p-5 border-b border-white/[0.03] sticky top-0 bg-[#0b0e14]/80 backdrop-blur-xl z-20 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00E5FF]/20 to-[#00E5FF]/5 flex items-center justify-center border border-[#00E5FF]/30 shadow-[0_0_15px_rgba(0,229,255,0.2)] relative overflow-hidden group-hover:shadow-[0_0_25px_rgba(0,229,255,0.4)] transition-all">
             <div className="absolute inset-0 bg-[#00E5FF]/10 blur-md"></div>
             <Activity className="w-5 h-5 text-[#00E5FF] relative z-10" />
          </div>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00E5FF] font-black text-lg tracking-widest uppercase drop-shadow-[0_0_8px_rgba(0,229,255,0.3)]">724SPORTS</span>
        </div>
        
        {/* Search Input */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors group-focus-within:text-[#00E5FF] text-zinc-500">
            <Search className="w-4 h-4 group-focus-within:drop-shadow-[0_0_5px_rgba(0,229,255,0.5)] transition-all" />
          </div>
          <input 
            type="text" 
            placeholder={language === 'tr' ? 'Takım veya maç ara...' : 'Search team or match...'}
            className="w-full bg-[#121620]/60 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-zinc-200 text-[13px] font-medium focus:outline-none focus:border-[#00E5FF]/50 focus:bg-[#151a25] transition-all placeholder:text-zinc-600 shadow-inner hover:border-white/10 focus:shadow-[0_0_15px_rgba(0,229,255,0.1)]"
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
            <button className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.03] hover:shadow-[inset_0_0_20px_rgba(255,255,255,0.02)] transition-all group">
              <div className="flex items-center gap-3">
                <Home className="w-[18px] h-[18px] text-zinc-500 group-hover:text-[#00E5FF] group-hover:drop-shadow-[0_0_8px_rgba(0,229,255,0.5)] transition-all" />
                <span className="text-[13px] font-bold">{language === 'tr' ? 'Ana Sayfa' : 'Home'}</span>
              </div>
            </button>
            <button className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.03] hover:shadow-[inset_0_0_20px_rgba(255,255,255,0.02)] transition-all group">
              <div className="flex items-center gap-3">
                <Cherry className="w-[18px] h-[18px] text-zinc-500 group-hover:text-pink-400 group-hover:drop-shadow-[0_0_8px_rgba(244,114,182,0.5)] transition-all" />
                <span className="text-[13px] font-bold">Casino</span>
              </div>
            </button>
            <button className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.03] hover:shadow-[inset_0_0_20px_rgba(255,255,255,0.02)] transition-all group">
              <div className="flex items-center gap-3">
                <PlaySquare className="w-[18px] h-[18px] text-zinc-500 group-hover:text-blue-400 group-hover:drop-shadow-[0_0_8px_rgba(96,165,250,0.5)] transition-all" />
                <span className="text-[13px] font-bold">{language === 'tr' ? 'Canlı Casino' : 'Live Casino'}</span>
              </div>
            </button>
            <button className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.03] hover:shadow-[inset_0_0_20px_rgba(255,255,255,0.02)] transition-all group">
              <div className="flex items-center gap-3">
                <Gift className="w-[18px] h-[18px] text-zinc-500 group-hover:text-yellow-400 group-hover:drop-shadow-[0_0_8px_rgba(250,204,21,0.5)] transition-all" />
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
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('changeSportsTab', { detail: 'favorites' }))}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all group"
            >
              <div className="flex items-center gap-3">
                <Star className="w-[18px] h-[18px] text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.4)]" />
                <span className="text-[13px] font-bold">Favorilerim</span>
              </div>
            </button>
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('changeSportsTab', { detail: 'upcoming' }))}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all group"
            >
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
            <span className="bg-[#00E5FF]/10 border border-[#00E5FF]/20 px-2 py-0.5 rounded text-[10px] font-black text-[#00E5FF] shadow-[0_0_8px_rgba(0,229,255,0.2)]">{sportsList.length}</span>
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
                      ? 'text-[#00E5FF] bg-gradient-to-r from-[#00E5FF]/10 via-[#00E5FF]/5 to-transparent border border-[#00E5FF]/20 shadow-[0_0_15px_rgba(0,229,255,0.05)]' 
                      : 'text-zinc-400 hover:text-white hover:bg-white/[0.03] border border-transparent hover:shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]'
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-3/4 w-[3px] bg-[#00E5FF] rounded-r-full shadow-[0_0_12px_#00E5FF]" />
                  )}
                  <div className="flex items-center gap-3">
                    <span className={`transition-all duration-300 ${isActive ? 'scale-110 text-[#00E5FF] drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]' : 'text-zinc-500 group-hover:text-[#00E5FF] group-hover:drop-shadow-[0_0_8px_rgba(0,229,255,0.5)] group-hover:scale-110'}`}>
                      {getSportIcon(sport)}
                    </span>
                    <span className="tracking-wide relative z-10">{sport}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 relative z-10 text-[#00E5FF] drop-shadow-[0_0_5px_rgba(0,229,255,0.5)]" />}
                </button>
              )
            })}
          </div>
        </div>
        
      </div>
    </div>
  );
};
