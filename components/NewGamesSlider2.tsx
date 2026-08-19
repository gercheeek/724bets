import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export interface Game {
  id: string | number;
  name: string;
  provider: string;
  img: string;
  players: number;
  demoSymbol?: string;
  customDemoUrl?: string;
}

const NEW_GAMES_2: Game[] = [];

interface NewGamesSlider2Props {
  onPlayGame: (game: Game) => void;
}

export const NewGamesSlider2 = ({ onPlayGame }: NewGamesSlider2Props) => {
  const { t } = useLanguage();
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
        <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">{t('newly_added')}</h2>
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
        className="flex overflow-x-auto hide-scrollbar gap-2 md:gap-4 snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {NEW_GAMES_2.map((game) => (
          <div key={game.id} className="shrink-0 snap-start flex flex-col items-center group">
            <div 
              onClick={() => onPlayGame(game)}
              className="w-[110px] h-[137px] sm:w-[120px] sm:h-[150px] md:w-[130px] md:h-[162px] lg:w-[140px] lg:h-[175px] xl:w-[150px] xl:h-[187px] relative rounded-2xl overflow-hidden cursor-pointer shadow-[0_4px_15px_rgba(0,0,0,0.5)] hover:shadow-[0_10px_40px_rgba(54,255,196,0.25)] transition-all duration-500 transform group-hover:-translate-y-2 border border-white/5 hover:border-[#36ffc4]/30 bg-[#1a1c24]"
            >
              
              <img src={game.img} alt={game.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
              
              {/* Glow behind image on hover */}
              <div className="absolute inset-0 bg-[#36ffc4]/0 group-hover:bg-[#36ffc4]/10 transition-colors duration-500 mix-blend-overlay z-10"></div>
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>

              {/* Play button appears on hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-r from-[#10b981] to-[#36ffc4] hover:from-[#00E676] hover:to-[#10b981] shadow-[0_0_20px_rgba(54,255,196,0.5)] flex items-center justify-center border border-white/20 transform scale-90 group-hover:scale-100 transition-all duration-300">
                      <Play className="w-4 h-4 md:w-5 md:h-5 text-black fill-current ml-1" />
                  </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
