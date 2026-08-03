import React, { useState, useEffect } from 'react';
import { Flame, ChevronLeft, ChevronRight } from 'lucide-react';
import { GameCard } from './GameCards';
import { ALL_GAMES, DEMO_GAMES } from '../data/games';

export default function DynamicNewGames({ onGameSelect }: { onGameSelect: (game: any) => void }) {
  const [dynamicNewGames, setDynamicNewGames] = useState<any[]>([]);

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
    const newPool = games.filter(g => g.category === 'new' || g.isNew);
    
    // Initial set
    setDynamicNewGames(shuffleGamesList(newPool).slice(0, 16));

    const interval = setInterval(() => {
      setDynamicNewGames(shuffleGamesList(newPool).slice(0, 16));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (dynamicNewGames.length === 0) return null;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <Flame size={24} className="text-[#00E5FF] animate-pulse" />
          <h2 className="text-xl md:text-2xl font-black text-white">Yeni</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[#848B9D] hidden sm:block">Tümünü Gör</span>
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
        {dynamicNewGames.map((game) => (
          <div key={game.id} className="animate-in fade-in duration-500">
            <GameCard game={game} onClick={() => onGameSelect(game)} />
          </div>
        ))}
      </div>
    </div>
  );
}
