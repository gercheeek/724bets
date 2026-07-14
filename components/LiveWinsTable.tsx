import React, { useState, useEffect } from 'react';

// Fake Data Arrays
const USERS = [
  // Turkish
  'YılmazT', 'Ahmet_K', 'SelinCan', 'Burak99', 'Elif_TR', 'EmreX', 'MuratBahis', 'ZeynepKral', 'Caner44',
  // Brazilian
  'JoaoSilva', 'Lucas_BR', 'PedroF', 'MariaSantos', 'GabrielG', 'Mateus_99', 'RafaelBR', 'ThiagoV',
  // Spanish / Argentine
  'Carlos_AR', 'DiegoM', 'JuanPerez', 'Pablo_Esp', 'AlejandroX', 'Sofia_Ar', 'JavierM', 'MartinL'
];

const GAMES = [
  { name: 'Keno', color: 'bg-green-500', icon: '🎰' },
  { name: 'Moon Princess', color: 'bg-purple-500', icon: '👸' },
  { name: 'Blackjack', color: 'bg-red-600', icon: '🃏' },
  { name: 'Wanted Boosted', color: 'bg-orange-500', icon: '🤠' },
  { name: 'Dead by Noon', color: 'bg-yellow-600', icon: '🌵' },
  { name: 'Gladiator Legends', color: 'bg-gray-700', icon: '⚔️' },
  { name: 'Sweet Bonanza', color: 'bg-pink-500', icon: '🍬' },
  { name: 'Gates of Olympus', color: 'bg-blue-600', icon: '⚡' },
  { name: 'Crazy Time', color: 'bg-yellow-500', icon: '🎡' },
  { name: 'Roulette', color: 'bg-red-500', icon: '🎯' }
];

interface WinRecord {
  id: number;
  game: typeof GAMES[0];
  user: string;
  time: string;
  bet: number;
  multiplier: number;
  payout: number;
  isHighRoller: boolean;
  isHidden: boolean;
}

export default function LiveWinsTable() {
  const [wins, setWins] = useState<WinRecord[]>([]);
  
  // Initial fill
  useEffect(() => {
    const initialWins = Array.from({ length: 8 }).map((_, i) => generateRandomWin(i));
    setWins(initialWins.sort((a, b) => b.id - a.id));
    
    // Simulate real-time updates
    let counter = 100;
    const interval = setInterval(() => {
      setWins(prev => {
        const newWin = generateRandomWin(counter++);
        const updated = [newWin, ...prev].slice(0, 8); // Keep 8 rows
        return updated;
      });
    }, 2500); // New win every 2.5s
    
    return () => clearInterval(interval);
  }, []);

  const generateRandomWin = (id: number): WinRecord => {
    const game = GAMES[Math.floor(Math.random() * GAMES.length)];
    const isHidden = Math.random() > 0.7;
    const user = isHidden ? 'Hidden user' : USERS[Math.floor(Math.random() * USERS.length)];
    
    const bet = parseFloat((Math.random() * 20 + 0.5).toFixed(2));
    let multiplier = 0;
    let payout = 0;
    
    // 70% chance to win something, 30% to lose (multiplier 0)
    if (Math.random() > 0.3) {
      multiplier = parseFloat((Math.random() * 5 + 1.1).toFixed(2));
      payout = parseFloat((bet * multiplier).toFixed(2));
    }
    
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    return {
      id,
      game,
      user,
      time,
      bet,
      multiplier,
      payout,
      isHighRoller: bet > 10,
      isHidden
    };
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto mt-12 mb-12 px-4 md:px-0">
      
      {/* Table Header */}
      <div className="hidden md:grid grid-cols-12 gap-4 text-[#5c677d] text-[11px] font-black tracking-widest uppercase mb-3 px-4">
        <div className="col-span-3">Oyun</div>
        <div className="col-span-3">Kullanıcı</div>
        <div className="col-span-2">Zaman</div>
        <div className="col-span-1">Bahis</div>
        <div className="col-span-1">Çarpan</div>
        <div className="col-span-2 text-right">Ödeme</div>
      </div>

      {/* Table Body */}
      <div className="flex flex-col gap-2">
        {wins.map((win) => (
          <div 
            key={win.id} 
            className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-center bg-[#1a1d24]/60 hover:bg-[#232833] border border-[#2c313c]/50 rounded-xl p-3 md:px-4 md:py-3 transition-colors animate-fade-in-down"
          >
            {/* Game */}
            <div className="col-span-1 md:col-span-3 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl shadow-inner ${win.game.color}`}>
                {win.game.icon}
              </div>
              <span className="text-white font-bold text-sm">{win.game.name}</span>
            </div>

            {/* User */}
            <div className="col-span-1 md:col-span-3 flex items-center gap-3">
              <div className={`w-6 h-6 rounded flex items-center justify-center text-[10px] ${win.isHidden ? 'bg-[#00E676] text-black' : 'bg-[#2c313c] text-white'}`}>
                {win.isHidden ? '👤' : win.user.charAt(0)}
              </div>
              {win.isHighRoller && !win.isHidden && (
                 <span className="text-xs" title="High Roller">👑</span>
              )}
              {win.isHidden && (
                 <span className="text-xs" title="VIP">💎</span>
              )}
              <span className={`text-sm font-bold ${win.isHidden ? 'text-[#5c677d] italic' : 'text-[#a0a5b5]'}`}>
                {win.user}
              </span>
            </div>

            {/* Time */}
            <div className="hidden md:flex col-span-2 items-center text-[#5c677d] font-bold text-sm">
              {win.time}
            </div>

            {/* Bet */}
            <div className="col-span-1 md:col-span-1 flex items-center gap-2">
              <span className="md:hidden text-[#5c677d] text-xs font-bold uppercase w-16">Bahis:</span>
              <div className="flex items-center gap-1">
                 <div className="w-4 h-4 rounded-full bg-[#00E676] text-black font-black flex items-center justify-center text-[9px]">$</div>
                 <span className="text-white font-black text-sm">{win.bet.toFixed(2)}</span>
              </div>
            </div>

            {/* Multiplier */}
            <div className="col-span-1 md:col-span-1 flex items-center">
              <span className="md:hidden text-[#5c677d] text-xs font-bold uppercase w-16">Çarpan:</span>
              {win.multiplier > 0 ? (
                <span className="text-[#00E676] font-black text-xs bg-[#00E676]/10 px-2 py-0.5 rounded-full border border-[#00E676]/20">
                  x{win.multiplier.toFixed(2)}
                </span>
              ) : (
                <span className="text-[#5c677d] font-bold text-sm">-</span>
              )}
            </div>

            {/* Payout */}
            <div className="col-span-1 md:col-span-2 flex items-center md:justify-end gap-2">
              <span className="md:hidden text-[#5c677d] text-xs font-bold uppercase w-16">Ödeme:</span>
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-[#00E676] text-black font-black flex items-center justify-center text-[11px] shadow-[0_0_8px_rgba(0,230,118,0.4)]">$</div>
                <span className={`font-black ${win.payout > 0 ? 'text-[#00E676]' : 'text-white'} text-base`}>
                  {win.payout > 0 ? '+' : ''}{win.payout.toFixed(2)}
                </span>
              </div>
            </div>
            
          </div>
        ))}
      </div>
      
    </div>
  );
}
