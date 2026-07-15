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
  { name: "Sweet Bonanza", provider: 'Pragmatic Play', image: "https://cdn2.softswiss.net/i/s3/pragmaticexternal/SweetBonanza.png", type: 'slot' as const },
  { name: "The Dog House", provider: 'Pragmatic Play', image: "https://cdn2.softswiss.net/i/s3/pragmaticexternal/TheDogHouse.png", type: 'slot' as const },
  { name: "Gates of Olympus", provider: 'Pragmatic Play', image: "https://placehold.co/400x400/2C184A/FFD700/png?text=Gates+of\\nOlympus", type: 'slot' as const },
  { name: "Wanted Dead or a Wild", provider: 'Hacksaw Gaming', image: "https://placehold.co/400x400/1A1110/FF4500/png?text=Wanted\\nDead\\nor+a+Wild", type: 'slot' as const },
  { name: "Sugar Rush", provider: 'Pragmatic Play', image: "https://cdn2.softswiss.net/i/s3/pragmaticexternal/SugarRush.png", type: 'slot' as const }
];

const önIsimler = ["Alpha", "Crypto", "Degen", "Whale", "Vegas", "Joker", "Lucky", "Zeus", "Shadow", "VIP", "Player", "Star", "King", "Matrix", "Neon"];
const sonIsimler = ["Pro", "X", "99", "777", "Boss", "Kral", "Lord", "Master", "Winner", "Hunter", "Gamer", "Collector", "Fiend", "Rider"];
const MULTIPLIERS = [1.2, 1.5, 2.0, 3.4, 5.0, 10.0, 25.5, 100.0, 500.0, 0.0, 0.5];

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
    <div className="w-full relative flex items-center bg-[#0f141c] overflow-hidden py-4 border-b border-gray-800">
      
      {/* Sleek Floating Live Badge */}
      <div className="absolute left-0 top-0 bottom-0 z-20 flex items-center pl-4 md:pl-6 pointer-events-none bg-gradient-to-r from-[#0f141c] via-[#0f141c]/90 to-transparent pr-24">
         <div className="bg-[#151921]/80 backdrop-blur-md border border-white/5 rounded-full px-4 py-2 flex items-center gap-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
           <div className="relative flex items-center justify-center">
             <span className="absolute w-3 h-3 rounded-full bg-[#00FFA3] animate-ping opacity-60"></span>
             <span className="relative w-1.5 h-1.5 rounded-full bg-[#00FFA3] shadow-[0_0_8px_#00FFA3]"></span>
           </div>
           <span className="text-white font-black text-[10px] md:text-xs uppercase tracking-[0.2em] mt-[1px]">Canlı</span>
         </div>
      </div>

      {/* Horizontal Scrolling List */}
      <div 
        className="flex gap-4 overflow-x-auto hide-scrollbar w-full pl-[130px] md:pl-[160px] pr-8 scroll-smooth"
        style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
      >
        {wins.map((win) => (
          <div 
            key={win.id}
            onClick={() => setSelectedWin(win)}
            className="flex-shrink-0 flex items-center bg-[#13171F] border border-white/5 hover:border-[#00FFA3]/30 hover:bg-[#181d26] cursor-pointer transition-all duration-300 p-2.5 md:p-3 rounded-2xl min-w-[210px] md:min-w-[240px] animate-fade-in hover:shadow-[0_0_20px_rgba(0,255,163,0.05)] group"
          >
            <div className="relative mr-3 md:mr-4 shrink-0">
              <div className="absolute inset-0 bg-[#00FFA3] blur-md opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-xl" />
              <img 
                src={win.image} 
                alt={win.game} 
                className="relative w-12 h-12 md:w-14 md:h-14 rounded-xl object-cover bg-gray-900 shadow-lg border border-white/10"
              />
            </div>

            <div className="text-sm leading-tight flex flex-col justify-center">
              <p className="text-gray-400 text-[11px] md:text-xs font-bold uppercase tracking-wider mb-0.5">{win.game}</p>
              <p className="text-gray-100 font-semibold text-sm md:text-base my-0.5 truncate max-w-[120px] md:max-w-[140px]">
                {win.user.substring(0, 4)}***{win.user.slice(-2)}
              </p>
              <p className="text-[#00FFA3] font-black text-sm md:text-base tracking-tight mt-0.5">{win.payout}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedWin && (
        <BetDetailsModal data={selectedWin} onClose={() => setSelectedWin(null)} />
      )}
    </div>
  );
}
