import React, { useRef } from 'react';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';

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
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-3">
          {/* Custom Casino Chips Icon */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 p-[2px] shadow-[0_0_15px_rgba(250,204,21,0.3)]">
            <div className="w-full h-full bg-[#111317] rounded-full flex items-center justify-center">
              <div className="w-5 h-5 rounded-full border-2 border-dashed border-yellow-500 flex items-center justify-center">
                 <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              </div>
            </div>
          </div>
          <h2 className="text-white font-bold text-xl md:text-2xl tracking-tight">Canlı Oyunlar</h2>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="hidden md:block bg-[#1a1d24] hover:bg-[#232833] text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors border border-white/5">
            Tümünü görüntüle
          </button>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => scroll('left')}
              className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center bg-[#1a1d24] hover:bg-[#232833] rounded-lg border border-white/5 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-400" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center bg-[#1a1d24] hover:bg-[#232833] rounded-lg border border-white/5 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
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
                <div className="bg-[#00FFA3] text-black text-[9px] font-black uppercase px-1.5 py-0.5 rounded tracking-wider shadow-lg">
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
            <div className="absolute bottom-0 left-0 w-full p-3 flex flex-col items-center text-center z-10">
              <h3 className="text-white font-black text-xs md:text-sm leading-tight drop-shadow-md mb-1 px-1" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                {game.title}
              </h3>
              <p className="text-white/90 font-bold text-[9px] md:text-[10px] drop-shadow-md" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                {game.provider}
              </p>
            </div>
            
          </div>
        ))}
      </div>
      
    </div>
  );
}
