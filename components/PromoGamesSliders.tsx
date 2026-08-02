import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Info, Rocket, Star } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export interface PromoGame {
  id: string;
  name: string;
  provider: string;
  image: string;
  bgColor: string; // The bottom gradient color
  hasDropsAndWins?: boolean;
}

const THOUSAND_X_GAMES: PromoGame[] = [
  { id: '1', name: 'BIG BASS\nSPLASH 1000', provider: 'PRAGMATIC PLAY', image: '/images/promo/BigBassSplash.png', bgColor: 'from-[#D97706] to-[#F59E0B]', hasDropsAndWins: false },
  { id: '2', name: 'GATES OF\nOLYMPUS 1000', provider: 'PRAGMATIC PLAY', image: '/images/promo/GatesofOlympus1000.png', bgColor: 'from-[#DB2777] to-[#F472B6]', hasDropsAndWins: true },
  { id: '3', name: 'WISDOM OF\nATHENA 1000 XMAS', provider: 'PRAGMATIC PLAY', image: '/images/promo/WisdomofAthena.png', bgColor: 'from-[#BE185D] to-[#F43F5E]', hasDropsAndWins: true },
  { id: '4', name: 'SUGAR RUSH\n1000', provider: 'PRAGMATIC PLAY', image: '/images/promo/SugarRush1000.png', bgColor: 'from-[#7C3AED] to-[#A855F7]', hasDropsAndWins: true },
  { id: '5', name: 'WISDOM OF\nATHENA 1000', provider: 'PRAGMATIC PLAY', image: '/images/promo/WisdomofAthena.png', bgColor: 'from-[#C2410C] to-[#EF4444]', hasDropsAndWins: true },
  { id: '6', name: 'GATES OF\nOLYMPUS XMAS 1000', provider: 'PRAGMATIC PLAY', image: '/images/promo/GatesofOlympus1000.png', bgColor: 'from-[#B91C1C] to-[#EF4444]', hasDropsAndWins: true },
  { id: '7', name: 'STARLIGHT\nPRINCESS 1000', provider: 'PRAGMATIC PLAY', image: '/images/promo/StarlightPrincess1000.png', bgColor: 'from-[#0284C7] to-[#38BDF8]', hasDropsAndWins: true },
];

const DROPS_AND_WINS_GAMES: PromoGame[] = [
  { id: '11', name: 'BIG BASS VEGAS\nDOUBLE DOWN DELUXE', provider: 'PRAGMATIC PLAY', image: '/images/promo/BigBassSplash.png', bgColor: 'from-[#B45309] to-[#F59E0B]', hasDropsAndWins: true },
  { id: '12', name: 'GATES OF OLYMPUS\nSUPER SCATTER', provider: 'PRAGMATIC PLAY', image: '/images/promo/GatesofOlympus.png', bgColor: 'from-[#C2410C] to-[#F97316]', hasDropsAndWins: true },
  { id: '13', name: 'FRUIT\nPARTY', provider: 'PRAGMATIC PLAY', image: '/images/promo/FruitParty2.png', bgColor: 'from-[#BE123C] to-[#EF4444]', hasDropsAndWins: true },
  { id: '14', name: '5 LIONS\nMEGAWAYS', provider: 'PRAGMATIC PLAY', image: '/images/promo/5Lions.png', bgColor: 'from-[#1D4ED8] to-[#3B82F6]', hasDropsAndWins: true },
  { id: '15', name: 'SUGAR\nRUSH', provider: 'PRAGMATIC PLAY', image: '/images/promo/SugarRush.png', bgColor: 'from-[#4338CA] to-[#8B5CF6]', hasDropsAndWins: true },
  { id: '16', name: 'GATES OF\nOLYMPUS', provider: 'PRAGMATIC PLAY', image: '/images/promo/GatesofOlympus.png', bgColor: 'from-[#4C1D95] to-[#7C3AED]', hasDropsAndWins: true },
  { id: '17', name: 'SWEET RUSH\nBONANZA', provider: 'PRAGMATIC PLAY', image: '/images/promo/SweetBonanza.png', bgColor: 'from-[#BE185D] to-[#F43F5E]', hasDropsAndWins: true },
];

const GameCard = ({ game, onClick }: { game: PromoGame, onClick: () => void }) => {
  return (
    <div 
      onClick={onClick}
      className="w-[110px] h-[137px] sm:w-[120px] sm:h-[150px] md:w-[130px] md:h-[162px] lg:w-[140px] lg:h-[175px] xl:w-[150px] xl:h-[187px] relative rounded-2xl overflow-hidden cursor-pointer shadow-[0_4px_15px_rgba(0,0,0,0.5)] hover:shadow-[0_10px_40px_rgba(0,229,255,0.25)] transition-all duration-500 transform group-hover:-translate-y-2 border border-white/5 hover:border-[#00E5FF]/30 bg-[#1a1c24] group"
    >
      {/* Background Image */}
      <img src={game.image} alt={game.name.replace('\n', ' ')} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
      
      {/* Drops & Wins Ribbon */}
      {game.hasDropsAndWins && (
        <div className="absolute top-0 left-0 z-20">
          <div className="w-10 h-10 overflow-hidden relative rounded-tl-2xl">
             <div className="absolute top-2 -left-3 w-16 bg-black text-white text-[4px] font-black uppercase tracking-widest text-center py-0.5 -rotate-45 shadow-lg border-y border-white/20 flex flex-col items-center justify-center leading-none gap-0.5">
               <span>DROPS</span>
               <span>& WINS</span>
             </div>
          </div>
        </div>
      )}

      {/* Glow behind image on hover */}
      <div className="absolute inset-0 bg-[#00E5FF]/0 group-hover:bg-[#00E5FF]/10 transition-colors duration-500 mix-blend-overlay z-10"></div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>

      {/* Play button appears on hover */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-r from-[#00b3cc] to-[#00E5FF] hover:from-[#00E5FF] hover:to-[#00b3cc] shadow-[0_0_20px_rgba(0,229,255,0.5)] flex items-center justify-center border border-white/20 transform scale-90 group-hover:scale-100 transition-all duration-300">
              <svg viewBox="0 0 24 24" className="w-4 h-4 md:w-5 md:h-5 text-[#0A0D14] fill-current ml-1"><path d="M8 5v14l11-7z"/></svg>
          </div>
      </div>
    </div>
  );
};

export const PromoGamesSliders = () => {
  const scrollRef1 = useRef<HTMLDivElement>(null);
  const scrollRef2 = useRef<HTMLDivElement>(null);

  const scroll = (ref: React.RefObject<HTMLDivElement>, direction: 'left' | 'right') => {
    if (ref.current) {
      ref.current.scrollBy({ left: direction === 'left' ? -300 : 300, behavior: 'smooth' });
    }
  };

  const handlePlay = (game: PromoGame) => {
    // Dispatch custom event to open the game in iframe
    const gameData = {
      id: game.id,
      name: game.name.replace('\n', ' '),
      provider: game.provider,
      img: game.image,
      category: 'slots',
    };
    window.dispatchEvent(new CustomEvent('open-game-iframe', { detail: gameData }));
  };

  return (
    <div className="w-full flex flex-col gap-6 md:gap-8 py-4 md:py-6 relative z-10 px-4 md:px-6 max-w-[1600px] mx-auto">
      
      {/* 1000x Slotlar */}
      <div className="flex flex-col gap-3 md:gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Rocket className="w-5 h-5 md:w-6 md:h-6 text-white" />
            <h2 className="text-white text-lg md:text-xl font-bold tracking-wide">1000x Slotlar</h2>
          </div>
          <div className="flex gap-1.5 md:gap-2">
            <button onClick={() => scroll(scrollRef1, 'left')} className="w-7 h-7 md:w-8 md:h-8 rounded bg-[#1a2130] border border-white/5 hover:bg-[#252a36] hover:border-white/20 flex items-center justify-center transition-colors shadow-sm">
              <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
            </button>
            <button onClick={() => scroll(scrollRef1, 'right')} className="w-7 h-7 md:w-8 md:h-8 rounded bg-[#1a2130] border border-white/5 hover:bg-[#252a36] hover:border-white/20 flex items-center justify-center transition-colors shadow-sm">
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
            </button>
          </div>
        </div>
        <div 
          ref={scrollRef1}
          className="flex gap-3 md:gap-4 overflow-x-auto hide-scrollbar scroll-smooth snap-x snap-mandatory pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {THOUSAND_X_GAMES.map(game => (
            <div key={game.id} className="snap-start">
               <GameCard game={game} onClick={() => handlePlay(game)} />
            </div>
          ))}
        </div>
      </div>

      {/* Drop & Wins */}
      <div className="flex flex-col gap-3 md:gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 md:w-6 md:h-6 text-white" fill="white" />
            <h2 className="text-white text-lg md:text-xl font-bold tracking-wide">Drop & Wins</h2>
          </div>
          <div className="flex gap-1.5 md:gap-2">
            <button onClick={() => scroll(scrollRef2, 'left')} className="w-7 h-7 md:w-8 md:h-8 rounded bg-[#1a2130] border border-white/5 hover:bg-[#252a36] hover:border-white/20 flex items-center justify-center transition-colors shadow-sm">
              <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
            </button>
            <button onClick={() => scroll(scrollRef2, 'right')} className="w-7 h-7 md:w-8 md:h-8 rounded bg-[#1a2130] border border-white/5 hover:bg-[#252a36] hover:border-white/20 flex items-center justify-center transition-colors shadow-sm">
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
            </button>
          </div>
        </div>
        <div 
          ref={scrollRef2}
          className="flex gap-3 md:gap-4 overflow-x-auto hide-scrollbar scroll-smooth snap-x snap-mandatory pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {DROPS_AND_WINS_GAMES.map(game => (
            <div key={game.id} className="snap-start">
               <GameCard game={game} onClick={() => handlePlay(game)} />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default PromoGamesSliders;
