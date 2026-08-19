import React, { useState, useEffect } from 'react';
import { Dices, ChevronLeft, ChevronRight } from 'lucide-react';
import { GameCard } from './GameCards';
import { ALL_GAMES, DEMO_GAMES } from '../data/games';

export default function DynamicSlotsGames({ onGameSelect, onViewChange }: { onGameSelect: (game: any) => void, onViewChange?: (view: string) => void }) {
  const [dynamicSlotsGames, setDynamicSlotsGames] = useState<any[]>([]);

  const shuffleGamesList = (gamesArray: any[]) => {
    const arr = [...gamesArray];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await fetch('/api/casino/games');
        const data = await res.json();
        if (data.success && Array.isArray(data.games)) {
          const slotsOnly = data.games.filter((g: any) => g.type !== 'live').map((g: any) => ({
            id: g.id,
            name: g.name,
            provider: g.provider,
            category: 'slots',
            img: g.image,
            image: g.image,
            vendorCode: g.vendorCode,
            gameCode: g.gameCode
          }));
          setDynamicSlotsGames(shuffleGamesList(slotsOnly).slice(0, 16));
        }
      } catch (e) {
        console.error('Failed to fetch slot games:', e);
      }
    };
    fetchGames();
  }, []);

  if (dynamicSlotsGames.length === 0) return null;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <Dices size={24} className="text-[#a855f7] animate-pulse" />
          <h2 className="text-xl md:text-2xl font-black text-white">Slotlar</h2>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => onViewChange?.('casino')} className="text-[11px] md:text-xs font-black text-white hover:text-white transition-all flex items-center gap-1 group cursor-pointer border border-[#00E5FF]/30 bg-[#00E5FF]/20 hover:bg-[#00E5FF]/30 px-3.5 py-1.5 rounded-full shadow-[0_0_10px_rgba(0,229,255,0.2)] hover:shadow-[0_0_15px_rgba(0,229,255,0.4)] uppercase tracking-wider">
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
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2 md:gap-3 w-full animate-fade-in relative px-1 md:px-0">
        {dynamicSlotsGames.map((game) => (
          <div key={game.id} className="animate-in fade-in duration-500">
            <GameCard game={game} onClick={() => onGameSelect(game)} />
          </div>
        ))}
      </div>
    </div>
  );
}
