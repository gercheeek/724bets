import React, { useState, useEffect, useRef } from 'react';
import BetDetailsModal, { BetDetailData } from './BetDetailsModal';
import { Diamond } from 'lucide-react';

const TICKER_GAMES = [
  { name: "Keno", provider: 'Rainbet', image: "https://rainbet-images.nyc3.cdn.digitaloceanspaces.com/slots/rainbet-keno.png", type: 'keno' as const },
  { name: "Dice", provider: 'Rainbet', image: "https://rainbet-images.nyc3.cdn.digitaloceanspaces.com/slots/rainbet-dice.png", type: 'dice' as const },
  { name: "Plinko", provider: 'Rainbet', image: "https://rainbet-images.nyc3.cdn.digitaloceanspaces.com/slots/rainbet-plinko.png", type: 'slot' as const },
  { name: "Mines", provider: 'Rainbet', image: "https://rainbet-images.nyc3.cdn.digitaloceanspaces.com/slots/rainbet-mines.png", type: 'slot' as const },
  { name: "War", provider: 'Rainbet', image: "https://rainbet-images.nyc3.cdn.digitaloceanspaces.com/slots/rainbet-war.png", type: 'slot' as const },
  { name: "Hilo", provider: 'Rainbet', image: "https://rainbet-images.nyc3.cdn.digitaloceanspaces.com/slots/rainbet-hilo.png", type: 'slot' as const },
  { name: "Blackjack", provider: 'Rainbet', image: "https://rainbet-images.nyc3.cdn.digitaloceanspaces.com/slots/rainbet-blackjack.png", type: 'blackjack' as const },
  { name: "Roulette", provider: 'Rainbet', image: "https://rainbet-images.nyc3.cdn.digitaloceanspaces.com/slots/rainbet-roulette.png", type: 'slot' as const }
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
      
      {/* Sticky Left Button */}
      <div className="absolute left-0 z-20 h-full flex items-center pl-4 bg-gradient-to-r from-[#0f141c] via-[#0f141c] to-transparent pr-12">
         <button className="bg-[#1a222f] hover:bg-[#263246] transition-colors border border-gray-700 rounded-lg px-4 py-2.5 flex items-center gap-2 shadow-xl whitespace-nowrap">
           <span className="w-2.5 h-2.5 rounded-full bg-[#00FFA3] animate-pulse shadow-[0_0_8px_rgba(0,255,163,0.8)]"></span>
           <span className="text-gray-300 font-bold text-xs uppercase tracking-wider">Canlı Kazançlar</span>
         </button>
      </div>

      {/* Horizontal Scrolling List */}
      <div 
        className="flex gap-3 overflow-x-auto hide-scrollbar w-full pl-[210px] md:pl-[240px] pr-4 scroll-smooth"
        style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
      >
        {wins.map((win) => (
          <div 
            key={win.id}
            onClick={() => setSelectedWin(win)}
            className="flex-shrink-0 flex items-center bg-[#1a222f] border border-[#263246] hover:border-gray-500 cursor-pointer transition-all p-2 rounded-xl min-w-[170px] animate-fade-in"
          >
            <img 
              src={win.image} 
              alt={win.game} 
              className="w-10 h-10 rounded-lg object-cover mr-3 bg-gray-900 shadow-md"
            />

            <div className="text-sm leading-tight flex flex-col justify-center">
              <p className="text-gray-400 text-[10px] font-semibold uppercase">{win.game}</p>
              <p className="text-gray-200 font-medium text-xs my-0.5">
                {win.user.substring(0, 4)}***{win.user.slice(-2)}
              </p>
              <p className="text-[#00FFA3] font-bold text-xs">{win.payout}</p>
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
