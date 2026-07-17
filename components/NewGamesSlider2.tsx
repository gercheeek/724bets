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

const NEW_GAMES_2: Game[] = [
  { id: 115, name: '12 Coins', provider: 'Wazdan', img: 'https://cdn.bahisbey1438.com/plat/prd/Img/Games/12-Coins-Grand-Gold-Edition-Santas-Jackpots-Wazdan/Vertical/12CoinsGrandGoldEditionSantasJackpots.webp', players: 204 },
  { id: 1160, name: 'Out of the Woods', provider: 'Pragmatic Play', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/6a5523109e9fec840eaeed00', demoSymbol: 'vs25bstackwild', players: 278 },
  { id: 1161, name: 'Legion Gold And The Throne Of Dead', provider: 'Play\'n GO', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/6a5523235229c24dca9f40d6', customDemoUrl: 'https://acccw.playngonetwork.com/casino/ContainerLauncher?pid=1857&brand=b2b_anj&gid=throneofdead&practice=1&lang=en_GB&div=gameWrapper&embedmode=iframe&channel=mobile&origin=https%3A%2F%2Fslotra.com', players: 335 },
  { id: 1162, name: 'Big Bass Blast', provider: 'Pragmatic Play', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/6a4f6a30db4d711f8d6a96e9', demoSymbol: 'vs10bbasblitz', players: 190 },
  { id: 1163, name: 'The Dog House Megaways 1000', provider: 'Pragmatic Play', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/6a5524d03da928ad473ccbc8', demoSymbol: 'vswaysdh1000', players: 371 },
  { id: 1164, name: 'Arena of Iron', provider: 'Hacksaw Gaming', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/6a5524e39666981d0311ce45', customDemoUrl: 'https://d2sx83al1f82za.cloudfront.net/2309/1.4.4/index.html?language=en&channel=mobile&gameid=2309&mode=2&token=123token&partner=slotra&env=https://d2sx83al1f82za.cloudfront.net/demo/api&realmoneyenv=https://d2sx83al1f82za.cloudfront.net/api&alwaysredirect=true', players: 449 }
];

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
        className="flex overflow-x-auto hide-scrollbar gap-3 md:gap-4 snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {NEW_GAMES_2.map((game) => (
          <div key={game.id} className="flex-none snap-start group relative w-[140px] h-[190px] md:w-[160px] md:h-[220px] rounded-2xl overflow-hidden cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_10px_40px_rgba(0,255,163,0.25)] transition-all duration-500 transform hover:-translate-y-2 border border-white/5 hover:border-[#10B981]/40">
            
            <img src={game.img} alt={game.name} className="absolute inset-0 w-full h-full object-fill transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Hover Actions */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 bg-black/70 backdrop-blur-[2px]">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onPlayGame(game);
                }}
                className="bg-[#10B981] hover:bg-[#00E676] text-black font-black text-[11px] sm:text-xs px-4 sm:px-6 py-2 rounded-lg shadow-[0_0_15px_rgba(0,255,163,0.4)] transform scale-90 group-hover:scale-100 transition-all duration-300 w-[85%]"
              >
                {t('play_real_money')}
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onPlayGame(game);
                }}
                className="bg-[#2A2E3D] hover:bg-[#3A3F54] border border-white/10 text-white font-bold text-[11px] sm:text-xs px-4 sm:px-6 py-2 rounded-lg transform scale-90 group-hover:scale-100 transition-all duration-300 w-[85%]"
              >
                {t('play_demo')}
              </button>
            </div>

            {/* Active Players & Dot */}
            <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center gap-1.5 z-20">
              <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></div>
              <span className="text-[10px] sm:text-xs font-bold text-gray-300 drop-shadow-md">{game.players} {t('players')}</span>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
};
