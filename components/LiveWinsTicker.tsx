import React, { useState, useEffect, useRef } from 'react';
import BetDetailsModal, { BetDetailData } from './BetDetailsModal';
import { ALL_GAMES } from '../data/games';

const USERS = [
  'Gizli', 'Cosm***', 'tagx***', 'brad***', 'make***', 'Poro***', 'nabo***', 'Stro***', 
  'Just***', 'Fast***', '7san***', 'Yilmaz***', 'Ahmet***', 'Joao***', 'Carlos***', 'Maria***'
];

const MULTIPLIERS = [1.2, 1.5, 2.0, 3.4, 5.0, 10.0, 25.5, 100.0, 500.0, 0.0, 0.5];

// Helper to get random item
const getRandom = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

// Generate a random bet detail based on game type
const generateFakeBet = (): BetDetailData => {
  const game = getRandom(ALL_GAMES);
  const user = getRandom(USERS);
  const userRank = Math.floor(Math.random() * 100);
  
  // Decide type based on game name (simple heuristic)
  let type: 'slot' | 'blackjack' | 'keno' | 'dice' = 'slot';
  const nameLower = game.name.toLowerCase();
  if (nameLower.includes('blackjack')) type = 'blackjack';
  else if (nameLower.includes('keno')) type = 'keno';
  else if (nameLower.includes('dice') || nameLower.includes('limbo')) type = 'dice';
  
  const betAmountRaw = (Math.random() * 100 + 1).toFixed(2);
  const multiplierRaw = getRandom(MULTIPLIERS);
  const payoutRaw = (parseFloat(betAmountRaw) * multiplierRaw).toFixed(2);
  
  const now = new Date();
  
  const data: BetDetailData = {
    id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
    game: game.name,
    provider: game.provider || 'Pragmatic Play',
    image: game.image,
    user,
    userRank,
    time: `${now.getDate()} Tem ${now.getFullYear()} ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`,
    betAmount: `$${betAmountRaw}`,
    multiplier: `${multiplierRaw.toFixed(2)}x`,
    payout: `$${payoutRaw}`,
    type
  };
  
  // Generate game specific visuals
  if (type === 'blackjack') {
    const cards = ['2♠', '3♥', '4♦', '5♣', '6♠', '7♥', '8♦', '9♣', '10♠', 'J♥', 'Q♦', 'K♣', 'A♠'];
    data.cards = {
      player: [getRandom(cards), getRandom(cards)],
      dealer: [getRandom(cards), getRandom(cards)],
      playerScore: Math.floor(Math.random() * 10) + 12,
      dealerScore: Math.floor(Math.random() * 6) + 17
    };
  } else if (type === 'keno') {
    const selected = [];
    while(selected.length < 10) {
      const n = Math.floor(Math.random() * 40) + 1;
      if (!selected.includes(n)) selected.push(n);
    }
    const hits = selected.filter(() => Math.random() > 0.5);
    data.kenoNumbers = { selected, hits };
  } else if (type === 'dice') {
    data.diceRoll = Math.random() * 100;
  }
  
  return data;
};

export default function LiveWinsTicker() {
  const [wins, setWins] = useState<BetDetailData[]>([]);
  const [selectedWin, setSelectedWin] = useState<BetDetailData | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initial populate
  useEffect(() => {
    const initial = Array.from({ length: 15 }).map(generateFakeBet);
    setWins(initial);
  }, []);

  // Interval to add new wins
  useEffect(() => {
    const interval = setInterval(() => {
      setWins(prev => {
        const newWins = [generateFakeBet(), ...prev];
        if (newWins.length > 30) newWins.pop(); // keep array manageable
        return newWins;
      });
    }, 2500); // Add a new win every 2.5 seconds
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="w-full relative flex items-center bg-[#0B0E14] overflow-hidden py-4 border-b border-white/5">
      
      {/* Sticky Left Button */}
      <div className="absolute left-0 z-20 h-full flex items-center pl-4 bg-gradient-to-r from-[#0B0E14] via-[#0B0E14] to-transparent pr-12">
         <button className="bg-[#2A2E3D] hover:bg-[#3A3F54] transition-colors border border-white/10 rounded-lg px-4 py-2.5 flex items-center gap-2 shadow-xl whitespace-nowrap">
           <span className="w-2.5 h-2.5 rounded-full bg-[#00FFA3] animate-pulse shadow-[0_0_8px_rgba(0,255,163,0.8)]"></span>
           <span className="text-gray-300 font-bold text-sm">Canlı Kazançlar</span>
         </button>
      </div>

      {/* Horizontal Scrolling List */}
      <div 
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto hide-scrollbar w-full pl-[180px] md:pl-[200px] pr-4 scroll-smooth"
        style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
      >
        {wins.map((win, i) => (
          <div 
            key={win.id}
            onClick={() => setSelectedWin(win)}
            className="flex flex-col items-center flex-shrink-0 cursor-pointer group transition-transform hover:-translate-y-1 w-24 md:w-28 animate-fade-in"
          >
            {/* Game Image Card */}
            <div className="w-full aspect-[3/4] rounded-lg overflow-hidden border border-white/5 shadow-lg relative bg-[#151821]">
              <img src={win.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-2 left-0 right-0 text-center px-1">
                <span className="text-white text-[10px] md:text-xs font-black uppercase tracking-tight block truncate drop-shadow-md">
                  {win.game}
                </span>
                <span className="text-gray-400 text-[8px] md:text-[9px] uppercase block truncate mt-0.5">
                  {win.provider}
                </span>
              </div>
            </div>
            
            {/* User and Payout */}
            <div className="mt-2 text-center flex flex-col items-center w-full px-1">
               <div className="flex items-center gap-1 mb-0.5 justify-center">
                 <Diamond className={`w-2.5 h-2.5 ${getRankColor(win.userRank)}`} fill="currentColor" />
                 <span className="text-gray-400 text-[10px] md:text-xs truncate max-w-[80px] font-medium">{win.user}</span>
               </div>
               <span className="text-[#00FFA3] font-bold text-xs md:text-sm">
                 {win.payout}
               </span>
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

const getRankColor = (rank: number) => {
  if (rank > 80) return 'text-yellow-400';
  if (rank > 50) return 'text-gray-300';
  if (rank > 20) return 'text-[#CD7F32]';
  return 'text-blue-400';
};
