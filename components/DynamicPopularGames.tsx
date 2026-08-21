import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { GameCard } from './GameCards';
import { useGames } from '../contexts/GameContext';

export default function DynamicPopularGames({ onGameSelect, onViewChange }: { onGameSelect: (game: any) => void, onViewChange?: (view: string) => void }) {
  const { games } = useGames();
  const [dynamicPopularGames, setDynamicPopularGames] = useState<any[]>([]);

  const shuffleGamesList = (gamesArray: any[]) => {
    const arr = [...gamesArray];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  useEffect(() => {
    if (games && games.length > 0) {
      // Esnek popüler kelime listesi (Tier-1 Casino Slotra benzeri hit oyunlar)
      const popularKeywords = [
        'olympus', 'bonanza', 'sugar rush', 'starlight princess', 
        'bandit', 'bass splash', 'dog house', 'reactoonz', 'book of dead',
        'crazy time', 'lightning roulette', 'aviator', 'hades', 'zeus',
        'fruit party', 'le santa', 'shining crown', 'hot extreme'
      ];

      const topGames: any[] = [];
      const otherGames: any[] = [];

      games.forEach((game) => {
        const gameName = (game.name || '').toLowerCase();
        const imageUrl = (game.img || game.image || '').toLowerCase();
        
        // Sadece işe yaramaz spam/varyasyon oyunları ele
        const isSpamVariant = gameName.includes('dice') || gameName.includes('candyland') || gameName.includes('auto roulette');
        
        const isPlaceholder = imageUrl.includes('unsplash') || 
                              imageUrl.includes('picsum.photos') || 
                              imageUrl.includes('placehold') || 
                              imageUrl.includes('loremflickr') ||
                              imageUrl.includes('freepik') ||
                              imageUrl.includes('dummyimage') ||
                              imageUrl.includes('stock') ||
                              imageUrl.includes('mockup');
        
        if (!isSpamVariant && !isPlaceholder) {
          const isHit = popularKeywords.some(keyword => gameName.includes(keyword));
          if (isHit) {
            topGames.push(game);
          } else {
            otherGames.push(game);
          }
        }
      });

      // Benzersiz oyunları filtrele (Aynı isme sahip çoklu sağlayıcı varyantlarını engelle)
      const uniqueTopGames = Array.from(new Map(topGames.map(item => [item.name, item])).values());
      const uniqueOtherGames = Array.from(new Map(otherGames.map(item => [item.name, item])).values());

      const shuffledOthers = shuffleGamesList(uniqueOtherGames);
      // İlk 20 oyunu slider'a ver
      const finalPopularList = [...uniqueTopGames, ...shuffledOthers].slice(0, 20);

      setDynamicPopularGames(finalPopularList);
    }
  }, [games]);

  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (dynamicPopularGames.length === 0) return null;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4 px-2 md:px-0">
        <div className="flex items-center gap-2">
          <Star size={24} className="text-[#FFC107] animate-pulse drop-shadow-[0_0_8px_rgba(255,193,7,0.5)]" />
          <h2 className="text-xl md:text-2xl font-black text-white tracking-wide uppercase">Popüler Oyunlar</h2>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onViewChange?.('casino')}
            className="text-[11px] md:text-xs font-black text-white hover:text-white transition-all flex items-center gap-1 group cursor-pointer border border-[#00E5FF]/30 bg-[#00E5FF]/20 hover:bg-[#00E5FF]/30 px-3.5 py-1.5 rounded-full shadow-[0_0_10px_rgba(0,229,255,0.2)] hover:shadow-[0_0_15px_rgba(0,229,255,0.4)] uppercase tracking-wider"
          >
            <span>Tümünü Gör</span>
            <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform text-[#00E5FF] drop-shadow-[0_0_3px_#00E5FF]" />
          </button>
          <div className="flex items-center gap-1">
            <button onClick={() => scroll('left')} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center text-[#848B9D] hover:text-white transition-colors">
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => scroll('right')} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center text-[#848B9D] hover:text-white transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
      <div ref={scrollRef} className="w-full overflow-x-auto pb-4 snap-x snap-mandatory hide-scrollbar" style={{ scrollBehavior: 'smooth' }}>
        <div className="flex flex-nowrap gap-2 md:gap-3 animate-fade-in relative px-1 md:px-0">
          {dynamicPopularGames.map((game, index) => (
            <div key={`${game.id || index}`} className="w-[120px] sm:w-[140px] md:w-[160px] lg:w-[180px] flex-none shrink-0 snap-start animate-in fade-in duration-500">
              <GameCard game={game} onClick={() => onGameSelect(game)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
