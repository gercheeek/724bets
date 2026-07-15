import React, { useRef } from 'react';
import { Flame, ChevronLeft, ChevronRight } from 'lucide-react';
import { ALL_GAMES } from '../data/games';

export default function PopularGamesSlider() {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Get first 8 slot games to display as popular games
  const popularGames = ALL_GAMES.filter(g => g.category === 'slots' || g.category === 'new').slice(0, 8);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 mt-8">
      {/* Header */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-white" fill="white" />
          <h2 className="text-white font-bold text-lg md:text-xl tracking-tight">Popüler Oyunlar</h2>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => scroll('left')}
            className="w-8 h-8 rounded bg-[#1A1D24] border border-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#232833] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="h-8 px-4 rounded bg-[#1A1D24] border border-white/5 flex items-center justify-center text-gray-300 text-xs font-bold hover:text-white hover:bg-[#232833] transition-colors">
            Hepsi
          </button>
          <button 
            onClick={() => scroll('right')}
            className="w-8 h-8 rounded bg-[#1A1D24] border border-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#232833] transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Slider */}
      <div 
        ref={scrollRef}
        className="w-full flex overflow-x-auto gap-3 pb-4 scrollbar-hide snap-x px-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {popularGames.map((game) => (
          <div key={game.id} className="flex flex-col gap-2 shrink-0 snap-start group cursor-pointer w-[140px] md:w-[160px]">
            {/* Game Card */}
            <div className={`w-full aspect-[3/4] rounded-xl bg-[#111317] flex flex-col justify-end relative overflow-hidden shadow-lg transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_10px_20px_rgba(0,0,0,0.5)] border border-white/10`}>
              <img src={game.image} alt={game.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              {/* Optional dark gradient at bottom for readability if needed, but screenshot games have text built in */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            {/* Players Counter */}
            <div className="flex items-center justify-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FFA3] shadow-[0_0_5px_#00FFA3]"></span>
              <span className="text-gray-400 text-[10px] md:text-xs">
                <span className="text-white font-bold mr-1">{game.players || Math.floor(Math.random() * 500) + 100}</span>
                Oyuncular
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
