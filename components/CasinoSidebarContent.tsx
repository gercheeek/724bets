import React from 'react';
import { PlayCircle, Star, TrendingUp, Sparkles } from 'lucide-react';

interface CasinoSidebarContentProps {
  isOpen: boolean;
  onViewChange: (view: string) => void;
  onToggle?: () => void;
}

import rawCasinoData from '../data/slotra_casino.json';

const CASINO_GAMES: any[] = [];

const CasinoSidebarContent: React.FC<CasinoSidebarContentProps> = ({ isOpen, onViewChange, onToggle }) => {
  return (
    <div className="flex flex-col w-full text-slate-300 bg-transparent">
      
      {/* Top Filter Buttons */}
      <div className="flex flex-col gap-1 mb-4 mt-2 px-3">
        <button className="flex items-center gap-3 py-2.5 px-3 rounded-lg bg-gradient-to-r from-[#00E5FF]/10 to-transparent text-[#00E5FF] border border-[#00E5FF]/20 cursor-pointer transition-all hover:bg-[#00E5FF]/20 group">
          <PlayCircle className="w-5 h-5 text-[#00E5FF] drop-shadow-[0_0_8px_rgba(0,229,255,0.6)] group-hover:scale-110 transition-transform" />
          {isOpen && <span className="font-semibold text-[14px] tracking-tight">Canlı Oyunlar</span>}
        </button>
        <button className="flex items-center gap-3 py-2.5 px-3 rounded-lg text-[#8b92a5] hover:bg-white/5 hover:text-white cursor-pointer transition-all group">
          <Star className="w-5 h-5 group-hover:text-zinc-300 group-hover:scale-110 transition-all" />
          {isOpen && <span className="font-semibold text-[14px] tracking-tight">Favorilerim</span>}
        </button>
      </div>

      {/* Popular Games Section */}
      {isOpen && (
        <div className="px-4 mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#00E5FF]" />
            <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Popüler Canlı Casino</span>
          </div>
        </div>
      )}

      {/* Game Thumbnails Grid/List */}
      <div className={`flex flex-col gap-2 px-3 ${isOpen ? '' : 'items-center'}`}>
        {CASINO_GAMES.map((game) => (
          <div 
            key={game.id}
            onClick={() => window.dispatchEvent(new CustomEvent('openAuthModal', { detail: 'register' }))}
            className={`relative group rounded-xl overflow-hidden cursor-pointer transition-all duration-300 border border-white/5 hover:border-[#00E5FF]/40 ${isOpen ? 'h-16' : 'w-10 h-10'}`}
          >
            {/* Background Image */}
            <img 
              src={game.image} 
              alt={game.name}
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
              onError={(e) => {
                // Fallback for broken images
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=500&auto=format&fit=crop&q=60";
              }}
            />
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent pointer-events-none" />

            {/* Content (Only when open) */}
            {isOpen && (
              <div className="absolute inset-0 flex flex-col justify-center px-4 z-10">
                <span className="text-white font-bold text-[13px] truncate drop-shadow-md group-hover:text-[#00E5FF] transition-colors">{game.name}</span>
                <span className="text-gray-400 font-semibold text-[10px] uppercase tracking-wider truncate">{game.provider}</span>
              </div>
            )}

            {/* Play Button Overlay (Visible on hover) */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px] z-20">
               <Sparkles className="w-5 h-5 text-[#00E5FF]" />
            </div>

            {/* Tooltip (When closed) */}
            {!isOpen && (
              <div className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 bg-[#1a1d29] text-white px-2.5 py-1.5 rounded shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible whitespace-nowrap z-[999] transition-all border border-white/10">
                <div className="font-bold text-xs">{game.name}</div>
                <div className="text-[9px] text-[#00E5FF]">{game.provider}</div>
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};

export default CasinoSidebarContent;
