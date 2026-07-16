import React, { useState, useEffect, useRef } from 'react';
import BetDetailsModal, { BetDetailData } from './BetDetailsModal';
import { Diamond } from 'lucide-react';

const TICKER_GAMES = [
  // Rainbet Originals (Weighted heavily to appear more often)
  { name: "Dice", provider: '724Bets', image: "/images/rainbet-dice.jpg", type: 'dice' as const },
  { name: "Dice", provider: '724Bets', image: "/images/rainbet-dice.jpg", type: 'dice' as const },
  { name: "Plinko", provider: '724Bets', image: "/images/rainbet-plinko.jpg", type: 'slot' as const },
  { name: "Plinko", provider: '724Bets', image: "/images/rainbet-plinko.jpg", type: 'slot' as const },
  { name: "Mines", provider: '724Bets', image: "/images/rainbet-mines.jpg", type: 'slot' as const },
  { name: "Mines", provider: '724Bets', image: "/images/rainbet-mines.jpg", type: 'slot' as const },
  { name: "Keno", provider: '724Bets', image: "/images/rainbet-keno.jpg", type: 'keno' as const },
  { name: "War", provider: '724Bets', image: "/images/rainbet-war.jpg", type: 'slot' as const },
  { name: "Hilo", provider: '724Bets', image: "/images/rainbet-hilo.jpg", type: 'slot' as const },
  { name: "Roulette", provider: '724Bets', image: "/images/rainbet-roulette.jpg", type: 'slot' as const },
  
  // Provider Slots (Fewer)
  { name: "Sweet Bonanza", provider: 'Pragmatic Play', image: "https://cdn2.softswiss.net/i/s4/pragmaticexternal/SweetBonanza.png", type: 'slot' as const },
  { name: "Wanted Dead or a Wild", provider: 'Hacksaw Gaming', image: "https://cdn2.softswiss.net/i/s4/hacksaw/WantedDeadoraWild.png", type: 'slot' as const }
];

const önIsimler = ["Alpha", "Crypto", "Degen", "Whale", "Vegas", "Joker", "Lucky", "Zeus", "Shadow", "VIP", "Player", "Star", "King", "Matrix", "Neon"];
const sonIsimler = ["Pro", "X", "99", "777", "Boss", "Kral", "Lord", "Master", "Winner", "Hunter", "Gamer", "Collector", "Fiend", "Rider"];
const MULTIPLIERS = [1.2, 1.5, 2.0, 2.5, 3.0, 5.0, 10.0, 25.0, 50.0, 0.0];
const BET_AMOUNTS = [0.5, 1, 2, 4, 5, 10, 15, 20, 25, 50];

const getRankColor = (rank: number) => {
  if (rank > 80) return 'text-yellow-400';
  if (rank > 50) return 'text-gray-300';
  if (rank > 20) return 'text-[#CD7F32]';
  return 'text-blue-400';
};

const getRandom = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

const generateFakeBet = (): BetDetailData => {
  const game = getRandom(TICKER_GAMES);
  const rastgeleOn = getRandom(önIsimler);
  const rastgeleSon = getRandom(sonIsimler);
  const user = `${rastgeleOn}${rastgeleSon}`;
  const userRank = Math.floor(Math.random() * 100);
  
  const betAmountRaw = getRandom(BET_AMOUNTS).toFixed(2);
  const multiplierRaw = getRandom(MULTIPLIERS);
  const payoutRaw = (parseFloat(betAmountRaw) * multiplierRaw).toFixed(2);
  
  const now = new Date();
  
  const data: BetDetailData = {
    id: Math.random().toString(36).substr(2, 9),
    game: game.name,
    provider: game.provider,
    image: game.image,
    user,
    userRank,
    time: `${now.getDate()} Tem ${now.getFullYear()} ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`,
    betAmount: `$${betAmountRaw}`,
    multiplier: `${multiplierRaw.toFixed(2)}x`,
    payout: `$${payoutRaw}`,
    type: game.type
  };
  
  if (game.type === 'blackjack') {
    const cards = ['2♠', '3♥', '4♦', '5♣', '6♠', '7♥', '8♦', '9♣', '10♠', 'J♥', 'Q♦', 'K♣', 'A♠'];
    data.cards = {
      player: [getRandom(cards), getRandom(cards)],
      dealer: [getRandom(cards), getRandom(cards)],
      playerScore: Math.floor(Math.random() * 10) + 12,
      dealerScore: Math.floor(Math.random() * 6) + 17
    };
  } else if (game.type === 'keno') {
    const selected = [];
    while(selected.length < 10) {
      const n = Math.floor(Math.random() * 40) + 1;
      if (!selected.includes(n)) selected.push(n);
    }
    const hits = selected.filter(() => Math.random() > 0.5);
    data.kenoNumbers = { selected, hits };
  } else if (game.type === 'dice') {
    data.diceRoll = Math.random() * 100;
  }
  
  return data;
};

export default function LiveWinsTicker() {
  const [wins, setWins] = useState<BetDetailData[]>([]);
  const [selectedWin, setSelectedWin] = useState<BetDetailData | null>(null);

  useEffect(() => {
    const initial = Array.from({ length: 25 }).map(() => generateFakeBet());
    setWins(initial);

    const interval = setInterval(() => {
      setWins((prev) => {
        const newWins = [generateFakeBet(), ...prev];
        if (newWins.length > 30) newWins.pop(); 
        return newWins;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full relative flex items-center bg-[#0B0E14] overflow-hidden py-3 border-b border-white/5">
      
      {/* Horizontal Scrolling List (Full Width) */}
      <div 
        className="flex gap-2.5 md:gap-4 overflow-x-auto hide-scrollbar w-full px-4 md:px-8 scroll-smooth"
        style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
      >
        {wins.map((win) => (
          <div 
            key={win.id}
            onClick={() => setSelectedWin(win)}
            className="flex-shrink-0 flex flex-col items-center cursor-pointer transition-all duration-300 hover:-translate-y-1 group w-[80px] md:w-[96px]"
          >
            {/* Game Cover */}
            <div className="w-full aspect-[3/4] rounded-[10px] md:rounded-xl overflow-hidden relative shadow-lg mb-2.5 bg-[#151922] ring-1 ring-white/5 group-hover:ring-white/10 transition-all">
               <img 
                 src={win.image} 
                 alt={win.game} 
                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
               />
               <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </div>

            {/* User Info */}
            <div className="flex items-center gap-1.5 w-full justify-center px-1 mb-1">
               <Diamond className={`w-2.5 h-2.5 md:w-3 md:h-3 ${getRankColor(win.userRank)} shrink-0 opacity-90`} fill="currentColor" />
               <span className="text-[#848B9D] font-semibold text-[10px] md:text-[11px] truncate tracking-wide">{win.user.substring(0, 4)}...</span>
            </div>
            
            {/* Payout */}
            <span className="text-[#00E676] font-black text-[11px] md:text-[13px] tracking-wide">
               {win.payout}
            </span>
          </div>
        ))}
      </div>

      {selectedWin && (
        <BetDetailsModal data={selectedWin} onClose={() => setSelectedWin(null)} />
      )}
    </div>
  );
}
