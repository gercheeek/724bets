import React from 'react';
import { Search } from 'lucide-react';

interface MobileQuickLinksProps {
  onSearchClick: () => void;
  onViewChange: (view: string) => void;
}

const MobileQuickLinks: React.FC<MobileQuickLinksProps> = ({ onSearchClick, onViewChange }) => {
  return (
    <div className="flex flex-col gap-3 px-3 py-2 w-full lg:hidden mb-2">
      {/* Buttons Row */}
      <div className="grid grid-cols-2 gap-3">
        {/* CASINO Button */}
        <button 
          onClick={() => onViewChange('blackjack')}
          className="bg-[#161920] border border-[#242933] rounded-xl p-3 flex items-center gap-3 hover:bg-[#1C2028] transition-colors shadow-lg group"
        >
          <div className="text-3xl filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform">🎰</div>
          <div className="flex flex-col items-start justify-center">
            <span className="text-white font-black text-sm tracking-wide leading-tight">CASINO</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.8)] animate-pulse"></div>
              <span className="text-zinc-400 text-[11px] font-bold tracking-tight">17.221 Oynuyor</span>
            </div>
          </div>
        </button>

        {/* SPOR Button */}
        <button 
          onClick={() => onViewChange('sports2')}
          className="bg-[#161920] border border-[#242933] rounded-xl p-3 flex items-center gap-3 hover:bg-[#1C2028] transition-colors shadow-lg group"
        >
          <div className="text-3xl filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform">⚽</div>
          <div className="flex flex-col items-start justify-center">
            <span className="text-white font-black text-sm tracking-wide leading-tight">SPOR</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.8)] animate-pulse"></div>
              <span className="text-zinc-400 text-[11px] font-bold tracking-tight">7.409 Oynuyor</span>
            </div>
          </div>
        </button>
      </div>

      {/* Search Bar */}
      <div 
        onClick={onSearchClick}
        className="w-full bg-[#0A0D14] border border-[#161920] rounded-xl p-3.5 flex items-center gap-3 cursor-pointer hover:border-[#242933] transition-colors shadow-inner"
      >
        <Search className="w-5 h-5 text-zinc-500" strokeWidth={2.5} />
        <span className="text-zinc-500 text-sm font-bold tracking-wide">Oyunları Ara</span>
      </div>
    </div>
  );
};

export default MobileQuickLinks;
