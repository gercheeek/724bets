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
          <button className="text-[11px] md:text-xs font-black text-white hover:text-white transition-all flex items-center gap-1 group cursor-pointer border border-[#00E5FF]/30 bg-[#00E5FF]/20 hover:bg-[#00E5FF]/30 px-3.5 py-1.5 rounded-full shadow-[0_0_10px_rgba(0,229,255,0.2)] hover:shadow-[0_0_15px_rgba(0,229,255,0.4)] uppercase tracking-wider">
            <span>Tümünü Gör</span>
            <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform text-[#00E5FF] drop-shadow-[0_0_3px_#00E5FF]" />
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
      <div className="w-full overflow-x-auto pb-4 snap-x snap-mandatory hide-scrollbar" style={{ scrollBehavior: 'smooth' }}>
        <div className="grid grid-rows-2 grid-flow-col gap-2 md:gap-3 min-w-max animate-fade-in relative px-1 md:px-0">
          {dynamicNewGames.map((game) => (
            <div key={game.id} className="animate-in fade-in duration-500 w-[110px] sm:w-[130px] md:w-[150px] lg:w-[170px] shrink-0 snap-start">
              <GameCard game={game} onClick={() => onGameSelect(game)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
