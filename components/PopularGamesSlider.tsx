import React, { useRef } from 'react';
import { Flame, ChevronLeft, ChevronRight } from 'lucide-react';

const POPULAR_GAMES = [
  { id: 1, name: 'SWEET BONANZA 1000', provider: 'PRAGMATIC PLAY', players: 134, bg: 'from-pink-500 to-rose-500' },
  { id: 2, name: 'ZEUS VS HADES GODS OF WAR', provider: 'PRAGMATIC PLAY', players: 137, bg: 'from-blue-600 to-indigo-800' },
  { id: 3, name: 'BIG BASS SPLASH', provider: 'PRAGMATIC PLAY', players: 133, bg: 'from-emerald-500 to-teal-700' },
  { id: 4, name: 'BIG BASS BONANZA', provider: 'PRAGMATIC PLAY', players: 153, bg: 'from-blue-500 to-cyan-600' },
  { id: 5, name: 'SUGAR RUSH 1000', provider: 'PRAGMATIC PLAY', players: 127, bg: 'from-fuchsia-500 to-purple-600' },
  { id: 6, name: 'LE FISHERMAN', provider: 'HACKSAW', players: 142, bg: 'from-sky-400 to-blue-500' },
  { id: 7, name: 'MUNCHY MILO', provider: 'HACKSAW', players: 146, bg: 'from-rose-400 to-pink-600' },
  { id: 8, name: 'WILD WEST DUELS', provider: 'PRAGMATIC PLAY', players: 121, bg: 'from-orange-500 to-red-600' },
];

export default function PopularGamesSlider() {
  const scrollRef = useRef<HTMLDivElement>(null);

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
        {POPULAR_GAMES.map((game) => (
          <div key={game.id} className="flex flex-col gap-2 shrink-0 snap-start group cursor-pointer w-[140px] md:w-[160px]">
            {/* Game Card */}
            <div className={`w-full aspect-[3/4] rounded-xl bg-gradient-to-b ${game.bg} p-3 flex flex-col justify-end relative overflow-hidden shadow-lg transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_10px_20px_rgba(0,0,0,0.5)] border border-white/10`}>
              {/* Pattern Overlay */}
              <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
              
              {/* Text Content */}
              <div className="relative z-10 flex flex-col items-center text-center w-full">
                <h3 className="text-white font-black text-[13px] md:text-sm leading-none uppercase tracking-tighter drop-shadow-md mb-1 line-clamp-2">
                  {game.name}
                </h3>
                <span className="text-white/80 text-[9px] md:text-[10px] font-bold uppercase tracking-widest drop-shadow-sm">
                  {game.provider}
                </span>
              </div>
            </div>

            {/* Players Counter */}
            <div className="flex items-center justify-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FFA3] shadow-[0_0_5px_#00FFA3]"></span>
              <span className="text-gray-400 text-[10px] md:text-xs">
                <span className="text-white font-bold mr-1">{game.players}</span>
                Oyuncular
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
