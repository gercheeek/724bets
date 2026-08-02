import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { GameCard } from './GameCards';
import { ALL_GAMES, DEMO_GAMES } from '../data/games';

export default function DynamicPopularGames({ onGameSelect, onViewChange }: { onGameSelect: (game: any) => void, onViewChange?: (view: string) => void }) {
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
    const games = [...ALL_GAMES, ...DEMO_GAMES];
    const popularPool = games.filter(g => g.category === 'popular' || g.isPopular || g.lobbyCategory === 'popular' || g.badgeText === 'Popüler');
    
    // Initial set
    setDynamicPopularGames(shuffleGamesList(popularPool).slice(0, 16));

    const interval = setInterval(() => {
      setDynamicPopularGames(shuffleGamesList(popularPool).slice(0, 16));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (dynamicPopularGames.length === 0) return null;

  return (
    <div className="mb-4 mt-8 w-full">
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <Star size={24} className="text-[#FFC107] animate-pulse" />
          <h2 className="text-xl md:text-2xl font-black text-white">Popüler Oyunlar</h2>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onViewChange?.('casino')} // Redirects to Casino (could be specific tab if supported, usually Casino has tabs. Or maybe a specific method to switch tabs in Casino)
            className="text-sm font-medium text-[#848B9D] hidden sm:block hover:text-white cursor-pointer transition-colors"
          >
            Tümünü Gör
          </button>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#848B9D] hover:text-white transition-colors">
              <ChevronLeft size={16} />
            </button>
            <button className="w-8 h-8 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#848B9D] hover:text-white transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2 md:gap-3 w-full animate-fade-in relative px-1 md:px-0">
        {dynamicPopularGames.map((game) => (
          <div key={game.id} className="animate-in fade-in duration-500">
            <GameCard game={game} onClick={() => onGameSelect(game)} />
          </div>
        ))}
      </div>
    </div>
  );
}
