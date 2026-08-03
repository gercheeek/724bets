import React, { useState, useEffect } from 'react';
import { Rocket, CircleDashed, Coins, Target, Dice5 } from 'lucide-react';

type Bet = {
  id: string;
  game: string;
  user: string;
  betAmount: number;
  multiplier: number;
  profit: number;
  currency: 'USDT' | 'BTC' | 'ETH' | 'TRY';
};

const RECENT_BETS_DATA: Bet[] = [
  { id: '1', game: 'Piggy Bank', user: 'EliteOcean418146', betAmount: 4.98, multiplier: 1.10, profit: 0.49, currency: 'TRY' },
  { id: '2', game: 'QUEEN OF INCA', user: 'Gizlenmiş', betAmount: 2.85, multiplier: 0.90, profit: -0.28, currency: 'USDT' },
  { id: '3', game: 'Limbo', user: 'Pukhtoon123', betAmount: 4.74, multiplier: 1.01, profit: 0.04, currency: 'USDT' },
  { id: '4', game: 'Plinko', user: 'kazkaz0000', betAmount: 9.49, multiplier: 0.29, profit: -6.74, currency: 'USDT' },
  { id: '5', game: 'Wheel', user: 'Gizlenmiş', betAmount: 3.96, multiplier: 0.00, profit: -3.96, currency: 'USDT' },
  { id: '6', game: 'Money Coming Expand Bets', user: 'Npltahwzbxcc', betAmount: 4.98, multiplier: 0.00, profit: -4.98, currency: 'TRY' },
  { id: '7', game: 'Hilo', user: 'CRYPBO', betAmount: 75.98, multiplier: 0.00, profit: -75.98, currency: 'USDT' },
  { id: '8', game: 'Gorilla', user: 'DHsrb', betAmount: 11884.09, multiplier: 0.00, profit: -11884.09, currency: 'USDT' },
  { id: '9', game: 'LEGEND OF INCA', user: 'Danica671', betAmount: 3.60, multiplier: 0.70, profit: -1.08, currency: 'USDT' },
  { id: '10', game: 'Fast Crash', user: 'TNT_bocaj', betAmount: 9.48, multiplier: 0.00, profit: -9.48, currency: 'USDT' },
  { id: '11', game: 'Starlight Princess', user: 'AhmetCan', betAmount: 2.50, multiplier: 15.00, profit: 35.00, currency: 'USDT' },
  { id: '12', game: 'Sweet Bonanza', user: 'Vip_Kral', betAmount: 200.00, multiplier: 0.00, profit: -200.00, currency: 'TRY' },
  { id: '13', game: 'Gates of Olympus', user: 'Zeus007', betAmount: 50.00, multiplier: 5.50, profit: 225.00, currency: 'USDT' },
  { id: '14', game: 'Dice', user: 'Roll_Master', betAmount: 0.05, multiplier: 2.00, profit: 0.05, currency: 'BTC' },
  { id: '15', game: 'Keno', user: 'Gizlenmiş', betAmount: 15.00, multiplier: 0.00, profit: -15.00, currency: 'USDT' },
  { id: '16', game: 'Plinko', user: 'DropIt', betAmount: 5.00, multiplier: 0.20, profit: -4.00, currency: 'USDT' },
  { id: '17', game: 'Mines', user: 'BoomBoom', betAmount: 12.00, multiplier: 1.50, profit: 6.00, currency: 'USDT' },
  { id: '18', game: 'Limbo', user: 'RocketMan', betAmount: 100.00, multiplier: 1.01, profit: 1.00, currency: 'USDT' },
  { id: '19', game: 'Roulette', user: 'SpinWin', betAmount: 0.10, multiplier: 36.00, profit: 3.50, currency: 'ETH' },
  { id: '20', game: 'Blackjack', user: 'DealerBust', betAmount: 1000.00, multiplier: 2.00, profit: 1000.00, currency: 'TRY' },
  { id: '21', game: 'Baccarat', user: 'PlayerOne', betAmount: 25.00, multiplier: 0.00, profit: -25.00, currency: 'USDT' },
  { id: '22', game: 'Crash', user: 'ToTheMoon', betAmount: 10.00, multiplier: 10.50, profit: 95.00, currency: 'USDT' },
  { id: '23', game: 'Wheel', user: 'Gizlenmiş', betAmount: 2.00, multiplier: 5.00, profit: 8.00, currency: 'USDT' },
  { id: '24', game: 'Hilo', user: 'HighLow', betAmount: 50.00, multiplier: 0.00, profit: -50.00, currency: 'USDT' },
  { id: '25', game: 'Dice', user: 'Lucky_7', betAmount: 1.00, multiplier: 9.90, profit: 8.90, currency: 'USDT' },
];

const HIGH_ROLLERS: Bet[] = [
  { id: '11', game: 'Blackjack PRO', user: 'HighRoller1', betAmount: 5000.00, multiplier: 2.50, profit: 7500.00, currency: 'USDT' },
  { id: '12', game: 'Plinko PRO', user: 'Whale***', betAmount: 1.50, multiplier: 100.00, profit: 150.00, currency: 'BTC' },
  { id: '13', game: 'Dice', user: 'Lucky_7', betAmount: 25000.00, multiplier: 2.00, profit: 25000.00, currency: 'TRY' },
];

const BET_RACE: Bet[] = [
  { id: '14', game: 'Gates of Olympus 1000', user: 'JohnD***', betAmount: 150.00, multiplier: 13.95, profit: 1942.50, currency: 'USDT' },
  { id: '15', game: 'Sweet Bonanza 1000', user: 'Winner007', betAmount: 5.50, multiplier: 1.69, profit: 3.79, currency: 'ETH' },
];

const CurrencyIcon = ({ type }: { type: Bet['currency'] }) => {
  if (type === 'USDT') {
    return <span className="inline-flex items-center justify-center w-[16px] h-[16px] rounded-full bg-[#26A17B] text-white text-[9px] font-bold">₮</span>;
  }
  if (type === 'BTC') {
    return <span className="inline-flex items-center justify-center w-[16px] h-[16px] rounded-full bg-[#F7931A] text-white text-[9px] font-bold">₿</span>;
  }
  if (type === 'ETH') {
    return <span className="inline-flex items-center justify-center w-[16px] h-[16px] rounded-full bg-[#627EEA] text-white text-[9px] font-bold">Ξ</span>;
  }
  if (type === 'TRY') {
    return <span className="inline-flex items-center justify-center w-[16px] h-[16px] rounded-full bg-[#E53935] text-white text-[9px] font-bold">₺</span>;
  }
  return null;
};

const formatCurrency = (amount: number, currency: string) => {
  if (currency === 'TRY') return `₺${amount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  return amount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const getGameIcon = (game: string) => {
  const g = game.toLowerCase();
  if (g.includes('limbo') || g.includes('crash')) return <Rocket className="w-3.5 h-3.5 text-[#facc15]" />;
  if (g.includes('plinko')) return <CircleDashed className="w-3.5 h-3.5 text-[#f43f5e]" />;
  if (g.includes('wheel')) return <Target className="w-3.5 h-3.5 text-[#a855f7]" />;
  if (g.includes('piggy') || g.includes('money')) return <Coins className="w-3.5 h-3.5 text-[#3b82f6]" />;
  return <Dice5 className="w-3.5 h-3.5 text-[#00E5FF]" />;
};

export default function LiveBetsTable() {
  const [activeTab, setActiveTab] = useState<'recent' | 'high' | 'race'>('recent');
  
  // State for live updating recent bets
  const [recentBets, setRecentBets] = useState<Bet[]>(RECENT_BETS_DATA.slice(0, 10));

  // Simulate live feed updates for "Son Bahis"
  useEffect(() => {
    const interval = setInterval(() => {
      setRecentBets(prev => {
        // Pick a random bet from the pool to simulate a new incoming bet
        const randomBet = RECENT_BETS_DATA[Math.floor(Math.random() * RECENT_BETS_DATA.length)];
        const newBet = { ...randomBet, id: Math.random().toString(36).substring(7) };
        
        // Add to top, keep only 10
        const updated = [newBet, ...prev];
        if (updated.length > 10) updated.pop();
        
        return updated;
      });
    }, 2500); // Update every 2.5 seconds

    return () => clearInterval(interval);
  }, []);
  
  const displayData = activeTab === 'recent' ? recentBets : activeTab === 'high' ? HIGH_ROLLERS : BET_RACE;

  return (
    <div className="w-full mt-2 font-sans mb-8">
      
      {/* Title & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4 px-2">
        <h2 className="text-lg md:text-xl font-bold text-white tracking-wide">En son tur ve Yarış</h2>
        
        <div className="flex bg-[#121722]/80 border border-white/5 rounded-md overflow-hidden">
          <button 
            onClick={() => setActiveTab('recent')}
            className={`px-4 py-2 text-xs md:text-sm font-medium transition-all ${activeTab === 'recent' ? 'bg-[#1b2230] text-white shadow-md' : 'text-gray-400 hover:text-gray-200'}`}
          >
            Son Bahis
          </button>
          <button 
            onClick={() => setActiveTab('high')}
            className={`px-4 py-2 text-xs md:text-sm font-medium transition-all ${activeTab === 'high' ? 'bg-[#1b2230] text-white shadow-md' : 'text-gray-400 hover:text-gray-200'}`}
          >
            Yüksek Silindir
          </button>
          <button 
            onClick={() => setActiveTab('race')}
            className={`px-4 py-2 text-xs md:text-sm font-medium transition-all ${activeTab === 'race' ? 'bg-[#1b2230] text-white shadow-md' : 'text-gray-400 hover:text-gray-200'}`}
          >
            Bahis Yarışması
          </button>
        </div>
      </div>

      {/* Table Container - Transparent to match theme */}
      <div className="w-full">
        
        {/* Mobile View */}
        <div className="block md:hidden flex flex-col gap-2">
          {displayData.map((bet) => {
            const isWin = bet.profit > 0;
            return (
              <div key={bet.id} className="p-3 bg-[#121722]/80 hover:bg-[#1b2230] transition-colors rounded-lg border border-white/5 flex flex-col gap-2 shadow-sm">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-gray-200 font-medium text-sm">
                    {getGameIcon(bet.game)}
                    <span>{bet.game}</span>
                  </div>
                  <span className="text-gray-400 text-xs">{bet.user}</span>
                </div>
                
                <div className="flex justify-between items-center text-xs mt-1">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-gray-500">Bahis Miktarı</span>
                    <div className="flex items-center gap-1 text-gray-300">
                      <span>{formatCurrency(bet.betAmount, bet.currency)}</span>
                      <CurrencyIcon type={bet.currency} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-0.5 items-center">
                    <span className="text-gray-500">Çarpan</span>
                    <span className="text-gray-300">{bet.multiplier.toFixed(2)}x</span>
                  </div>
                  <div className="flex flex-col gap-0.5 items-end">
                    <span className="text-gray-500">Kar</span>
                    <div className="flex items-center gap-1">
                      <span className={`font-semibold ${isWin ? 'text-[#10b981]' : 'text-gray-400'}`}>
                        {isWin ? '+' : ''}{formatCurrency(bet.profit, bet.currency)}
                      </span>
                      <CurrencyIcon type={bet.currency} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop View */}
        <div className="hidden md:block w-full overflow-x-auto scrollbar-hide">
          <div className="min-w-[800px] w-full">
            {/* Table Header */}
            <div className="grid grid-cols-5 px-4 py-2 mb-2 text-gray-500 text-[11px] font-semibold uppercase tracking-wider">
              <div className="col-span-1">Oyun</div>
              <div className="col-span-1">Oyuncu</div>
              <div className="col-span-1 text-right">Bahis Miktarı</div>
              <div className="col-span-1 text-right">Çarpan</div>
              <div className="col-span-1 text-right">Kar</div>
            </div>

            {/* Table Body - Rows with gaps */}
            <div className="flex flex-col gap-2">
              {displayData.map((bet) => {
                const isWin = bet.profit > 0;
                return (
                  <div 
                    key={bet.id} 
                    className="grid grid-cols-5 px-4 py-3 bg-[#121722]/80 hover:bg-[#1b2230] hover:border-[#00E5FF]/20 border border-white/5 transition-all rounded-lg items-center text-sm shadow-sm hover:shadow-md"
                  >
                    {/* Oyun */}
                    <div className="col-span-1 flex items-center gap-2.5 text-gray-200 font-medium truncate pr-2">
                      <div className="w-5 h-5 rounded flex items-center justify-center bg-black/20 shrink-0">
                        {getGameIcon(bet.game)}
                      </div>
                      <span className="truncate text-[13px]">{bet.game}</span>
                    </div>

                    {/* Oyuncu */}
                    <div className="col-span-1 text-gray-300 font-medium truncate pr-2 text-[13px]">
                      {bet.user}
                    </div>

                    {/* Bahis miktarı */}
                    <div className="col-span-1 flex items-center justify-end gap-1.5 text-gray-300 text-[13px]">
                      <span>{formatCurrency(bet.betAmount, bet.currency)}</span>
                      <CurrencyIcon type={bet.currency} />
                    </div>

                    {/* Çarpan */}
                    <div className="col-span-1 text-right text-gray-400 text-[13px]">
                      {bet.multiplier.toFixed(2)}x
                    </div>

                    {/* Kar */}
                    <div className="col-span-1 flex items-center justify-end gap-1.5">
                      <span className={`font-semibold text-[13px] ${isWin ? 'text-[#10b981]' : 'text-gray-400'}`}>
                        {isWin ? '+' : ''}{formatCurrency(bet.profit, bet.currency)}
                      </span>
                      <CurrencyIcon type={bet.currency} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
