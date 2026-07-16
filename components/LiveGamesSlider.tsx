import React, { useRef } from 'react';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

// Using an SVG that resembles the Gamdom Live Games icon
const LiveCasinoIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#F59E0B"/>
    <circle cx="12" cy="12" r="7" fill="#111317"/>
    <circle cx="12" cy="12" r="4" fill="#F59E0B"/>
  </svg>
);

const LIVE_GAMES = [
  {
    id: 1,
    title: 'PRIVÉ LOUNGE BLACKJACK 12',
    provider: 'Pragmatic Play Live',
    image: '/images/dealer_blonde_green.jpg',
    gradient: 'from-[#22c55e] to-transparent', // Green
    viewers: 279,
    isExclusive: false,
  },
  {
    id: 2,
    title: 'PRIVÉ LOUNGE BLACKJACK 6',
    provider: 'Pragmatic Play Live',
    image: '/images/dealer_man_vest.jpg',
    gradient: 'from-[#a3e635] to-transparent', // Lime/Yellow
    viewers: 257,
    isExclusive: false,
  },
  {
    id: 3,
    title: 'VIP ROULETTE',
    provider: 'Evolution',
    image: '/images/dealer_brunette_red.jpg',
    gradient: 'from-[#ec4899] to-transparent', // Pink
    viewers: 203,
    isExclusive: false,
  },
  {
    id: 4,
    title: 'MEGA ROULETTE',
    provider: 'Pragmatic Play Live',
    image: '/images/dealer_man_tuxedo.jpg',
    gradient: 'from-[#1d4ed8] to-transparent', // Blue
    viewers: 2479,
    isExclusive: false,
  },
  {
    id: 5,
    title: 'BACCARAT 1',
    provider: 'Pragmatic Play Live',
    image: '/images/dealer_blonde_green.jpg', // Reusing
    gradient: 'from-[#ef4444] to-transparent', // Red
    viewers: 198,
    isExclusive: false,
  },
  {
    id: 6,
    title: 'GAMDOM PRIVÉ BLACKJACK 2',
    provider: 'Pragmatic Play Live',
    image: '/images/dealer_brunette_red.jpg', // Reusing
    gradient: 'from-[#22c55e] to-transparent', // Green
    viewers: 55,
    isExclusive: true,
  },
  {
    id: 7,
    title: 'GAMDOM LOBBY',
    provider: 'Pragmatic Play Live',
    image: '/images/dealer_blonde_green.jpg', // Reusing
    gradient: 'from-[#22c55e] to-transparent', // Green
    viewers: 51,
    isExclusive: true,
  }
];

export default function LiveGamesSlider() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 md:px-0 my-8">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <LiveCasinoIcon />
          <h2 className="text-white text-lg md:text-xl font-bold">{t('live_games')}</h2>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => scroll('left')}
            className="w-8 h-8 rounded-md bg-[#2A2D35] hover:bg-[#3A3D45] flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-400" />
          </button>
          <button className="px-3 h-8 rounded-md bg-[#2A2D35] hover:bg-[#3A3D45] flex items-center justify-center transition-colors text-[13px] font-bold text-gray-300">
            {t('view_all')}
          </button>
          <button 
            onClick={() => scroll('right')}
            className="w-8 h-8 rounded-md bg-[#2A2D35] hover:bg-[#3A3D45] flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Cards Slider */}
      <div 
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto custom-scrollbar pb-4 snap-x snap-mandatory hide-scrollbar"
      >
        <style dangerouslySetInnerHTML={{__html: `
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}} />
        {LIVE_GAMES.map((game) => (
          <div 
            key={game.id} 
            className="relative flex-shrink-0 w-[160px] md:w-[185px] h-[240px] md:h-[280px] rounded-xl overflow-hidden group cursor-pointer snap-start shadow-[0_8px_30px_rgb(0,0,0,0.4)]"
          >
            {/* Background Image */}
            <img 
              src={game.image} 
              alt={game.title} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            
            {/* Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t ${game.gradient} via-transparent to-transparent opacity-90`}></div>
            
            {/* Top Left Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1 items-start z-10">
              {game.isExclusive && (
                <div className="bg-[#10B981] text-black text-[9px] font-black uppercase px-1.5 py-0.5 rounded tracking-wider shadow-lg">
                  ÖZEL
                </div>
              )}
              <div className="bg-[#FF1744] text-white text-[9px] font-black uppercase px-1.5 py-0.5 rounded tracking-wider shadow-lg">
                CANLI
              </div>
            </div>

            {/* Top Right Heart & Viewers */}
            <div className="absolute top-2 right-2 flex flex-col items-center gap-0.5 z-10">
              <div className="bg-black/40 backdrop-blur-md rounded-md p-1 border border-white/10 hover:bg-black/60 transition-colors">
                <Heart className="w-4 h-4 text-gray-300 group-hover:text-white transition-colors" />
              </div>
              <div className="bg-black/50 backdrop-blur-md px-1.5 py-0.5 rounded text-[9px] font-bold text-gray-300">
                {game.viewers}
              </div>
            </div>

            {/* Bottom Content */}
            <div className="absolute bottom-0 left-0 w-full p-2 md:p-3 flex flex-col items-center text-center z-10 pb-3 md:pb-4">
              <h3 
                className="text-white leading-[1.1] mb-0.5 px-1 drop-shadow-[0_2px_4px_rgba(0,0,0,1)]" 
                style={{ 
                  fontFamily: "'Oswald', 'Impact', 'Arial Narrow', sans-serif", 
                  fontSize: '15px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  transform: 'scaleY(1.15)'
                }}
              >
                {game.title}
              </h3>
              <p 
                className="text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,1)] mt-1" 
                style={{ 
                  fontFamily: "'Oswald', 'Impact', 'Arial Narrow', sans-serif", 
                  fontSize: '9px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                {game.provider}
              </p>
            </div>
            
          </div>
        ))}
      </div>
      
    </div>
  );
}
