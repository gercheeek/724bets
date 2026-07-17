import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';

export interface Game {
  id: string | number;
  name: string;
  provider: string;
  img: string;
  players: number;
}

const NEW_GAMES_2: Game[] = [
  { id: 201, name: 'Gates of Olympus', provider: 'Pragmatic Play', img: 'https://cdn.bahisbey1438.com/plat/prd/Img/partners/1217/Games/Gates-of-Olympus-PragmaticPlay/Vertical/GatesofOlympus_20250328152430427.webp', players: 1245 },
  { id: 202, name: 'Sweet Bonanza', provider: 'Pragmatic Play', img: 'https://cdn2.softswiss.net/i/s4/pragmaticexternal/SweetBonanza.png', players: 980 },
  { id: 203, name: 'Starlight Princess', provider: 'Pragmatic Play', img: 'https://cdn2.softswiss.net/i/s4/pragmaticexternal/StarlightPrincess.png', players: 654 },
  { id: 204, name: 'Sugar Rush', provider: 'Pragmatic Play', img: 'https://cdn2.softswiss.net/i/s4/pragmaticexternal/SugarRush.png', players: 432 },
  { id: 205, name: 'Fruit Party', provider: 'Pragmatic Play', img: 'https://cdn2.softswiss.net/i/s4/pragmaticexternal/FruitParty.png', players: 321 },
  { id: 206, name: 'Wanted Dead or a Wild', provider: 'Hacksaw Gaming', img: 'https://cdn2.softswiss.net/i/s4/hacksaw/WantedDeadoraWild.png', players: 876 },
  { id: 207, name: 'Rip City', provider: 'Hacksaw Gaming', img: 'https://cdn2.softswiss.net/i/s4/hacksaw/RipCity.png', players: 543 },
  { id: 208, name: 'Chaos Crew', provider: 'Hacksaw Gaming', img: 'https://cdn2.softswiss.net/i/s4/hacksaw/ChaosCrew.png', players: 234 }
];

export const NewGamesSlider2 = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const currentScroll = scrollContainerRef.current.scrollLeft;
      const newScroll = direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: newScroll,
        behavior: 'smooth'
      });
      setScrollPosition(newScroll);
    }
  };

  return (
    <div className="w-full mt-6 mb-8 px-2">
      {/* Header & Navigation */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">Yeni Eklenenler 2</h2>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => scroll('left')}
            className="w-8 h-8 rounded-full bg-black/40 hover:bg-white/10 flex items-center justify-center border border-white/10 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="w-8 h-8 rounded-full bg-black/40 hover:bg-white/10 flex items-center justify-center border border-white/10 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
          </button>
        </div>
      </div>

      {/* Slider Container */}
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto hide-scrollbar gap-3 md:gap-4 snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {NEW_GAMES_2.map((game) => (
          <div key={game.id} className="flex-none snap-start group relative w-[140px] h-[190px] md:w-[160px] md:h-[220px] rounded-2xl overflow-hidden cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_10px_40px_rgba(0,255,163,0.25)] transition-all duration-500 transform hover:-translate-y-2 border border-white/5 hover:border-[#10B981]/40 flex flex-col items-center">
            
            <img src={game.img} alt={game.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Hover Actions */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 bg-black/70 backdrop-blur-[2px]">
              <button className="bg-[#10B981] hover:bg-[#00E676] text-black font-black text-[11px] sm:text-xs px-4 sm:px-6 py-2 rounded-lg shadow-[0_0_15px_rgba(0,255,163,0.4)] transform scale-90 group-hover:scale-100 transition-all duration-300 w-[85%]">
                GERÇEK OYNA
              </button>
              <button className="bg-[#2A2E3D] hover:bg-[#3A3F54] border border-white/10 text-white font-bold text-[11px] sm:text-xs px-4 sm:px-6 py-2 rounded-lg transform scale-90 group-hover:scale-100 transition-all duration-300 w-[85%]">
                EĞLENCE MODU
              </button>
            </div>

            {/* Active Players & Dot */}
            <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center gap-1.5 z-20">
              <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></div>
              <span className="text-[10px] sm:text-xs font-bold text-gray-300 drop-shadow-md">{game.players} Oyuncular</span>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
};
