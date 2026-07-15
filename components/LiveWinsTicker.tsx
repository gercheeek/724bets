import React, { useState, useEffect, useRef } from 'react';
import BetDetailsModal, { BetDetailData } from './BetDetailsModal';
import { Diamond } from 'lucide-react';

const TICKER_GAMES = [
  // Rainbet Originals
  { name: "Keno", provider: 'Rainbet', image: "/images/rainbet-keno.jpg", type: 'keno' as const },
  { name: "Dice", provider: 'Rainbet', image: "/images/rainbet-dice.jpg", type: 'dice' as const },
  { name: "Plinko", provider: 'Rainbet', image: "/images/rainbet-plinko.jpg", type: 'slot' as const },
  { name: "Mines", provider: 'Rainbet', image: "/images/rainbet-mines.jpg", type: 'slot' as const },
  { name: "War", provider: 'Rainbet', image: "/images/rainbet-war.jpg", type: 'slot' as const },
  { name: "Hilo", provider: 'Rainbet', image: "/images/rainbet-hilo.jpg", type: 'slot' as const },
  { name: "Blackjack", provider: 'Rainbet', image: "/images/rainbet-blackjack.jpg", type: 'blackjack' as const },
  { name: "Roulette", provider: 'Rainbet', image: "/images/rainbet-roulette.jpg", type: 'slot' as const },
  
  // Provider Slots
  { name: "Sweet Bonanza", provider: 'Pragmatic Play', image: "https://cdn2.softswiss.net/i/s4/pragmaticexternal/SweetBonanza.png", type: 'slot' as const },
  { name: "The Dog House", provider: 'Pragmatic Play', image: "https://cdn2.softswiss.net/i/s4/pragmaticexternal/TheDogHouse.png", type: 'slot' as const },
  { name: "Gates of Olympus", provider: 'Pragmatic Play', image: "https://cdn.bahisbey1438.com/plat/prd/Img/partners/1217/Games/Gates-of-Olympus-PragmaticPlay/Vertical/GatesofOlympus_20250328152430427.webp", type: 'slot' as const },
  { name: "Wanted Dead or a Wild", provider: 'Hacksaw Gaming', image: "https://cdn2.softswiss.net/i/s4/hacksaw/WantedDeadoraWild.png", type: 'slot' as const },
  { name: "Sugar Rush", provider: 'Pragmatic Play', image: "https://cdn2.softswiss.net/i/s4/pragmaticexternal/SugarRush.png", type: 'slot' as const }
];

const önIsimler = ["Alpha", "Crypto", "Degen", "Whale", "Vegas", "Joker", "Lucky", "Zeus", "Shadow", "VIP", "Player", "Star", "King", "Matrix", "Neon"];
const sonIsimler = ["Pro", "X", "99", "777", "Boss", "Kral", "Lord", "Master", "Winner", "Hunter", "Gamer", "Collector", "Fiend", "Rider"];
const MULTIPLIERS = [1.2, 1.5, 2.0, 3.4, 5.0, 10.0, 25.5, 100.0, 500.0, 0.0, 0.5];

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
  
  const betAmountRaw = (Math.random() * 2500 + 0.5).toFixed(2);
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
      
      {/* Premium Gamdom-Style Floating Live Badge */}
      <div className="absolute left-0 top-0 bottom-0 z-20 flex items-center pl-2 md:pl-6 pr-16 pointer-events-none bg-gradient-to-r from-[#0B0E14] via-[#0B0E14] to-transparent">
         <div className="bg-[#0B0E14]/80 backdrop-blur-md rounded-full px-4 py-2.5 flex items-center gap-3 border border-[#00FFA3]/30 shadow-[0_0_20px_rgba(0,255,163,0.15)] relative overflow-hidden">
           {/* Inner green glow */}
           <div className="absolute inset-0 bg-[#00FFA3]/5"></div>
           
           <div className="relative flex items-center justify-center">
             <span className="absolute w-3 h-3 rounded-full bg-[#00FFA3] animate-ping opacity-40"></span>
             <span className="relative w-2 h-2 rounded-full bg-[#00FFA3] shadow-[0_0_12px_#00FFA3]"></span>
           </div>
           <span className="relative text-[#00FFA3] font-black text-[10px] md:text-[11px] tracking-widest uppercase drop-shadow-[0_0_8px_rgba(0,255,163,0.5)]">Canlı Kazançlar</span>
         </div>
      </div>

      {/* Horizontal Scrolling List */}
      <div 
        className="flex gap-2.5 md:gap-4 overflow-x-auto hide-scrollbar w-full pl-[160px] md:pl-[190px] pr-8 scroll-smooth"
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
