import React, { useState } from 'react';
import { Trophy, Dice5 } from 'lucide-react';

type Bet = {
  id: string;
  game: string;
  user: string;
  betAmount: number;
  multiplier: number;
  payout: number;
  currency: 'USDT' | 'EUR' | 'USD';
};

const RECENT_BETS: Bet[] = [
  { id: '1', game: 'Gates of Olympus 1000', user: 'JohnD***', betAmount: 7.09, multiplier: 13.95, payout: 98.89, currency: 'USDT' },
  { id: '2', game: 'Keep\'Em', user: 'Telat45', betAmount: 28.08, multiplier: 0.08, payout: 2.16, currency: 'USDT' },
  { id: '3', game: 'Starlight Princess', user: 'Kral_Tr', betAmount: 27.64, multiplier: 2.19, payout: 60.55, currency: 'EUR' },
  { id: '4', game: 'Sweet Bonanza 1000', user: 'Winner007', betAmount: 50.91, multiplier: 1.69, payout: 85.91, currency: 'EUR' },
  { id: '5', game: 'Big Bass Bonanza 1000', user: 'Kral_Tr', betAmount: 24.41, multiplier: 0.78, payout: 19.05, currency: 'USD' },
  { id: '6', game: 'Sugar Rush', user: 'alkinho10', betAmount: 39.53, multiplier: 3.32, payout: 131.22, currency: 'EUR' },
  { id: '7', game: 'Starlight Princess', user: 'Kral_Tr', betAmount: 32.99, multiplier: 11.98, payout: 395.26, currency: 'USDT' },
  { id: '8', game: 'Angel vs Sinner', user: 'JohnD***', betAmount: 35.50, multiplier: 1.54, payout: 54.69, currency: 'USDT' },
];

const HIGH_ROLLERS: Bet[] = [
  { id: '9', game: 'Blackjack PRO', user: 'HighRoller1', betAmount: 5000.00, multiplier: 2.50, payout: 12500.00, currency: 'USDT' },
  { id: '10', game: 'Plinko PRO', user: 'Whale***', betAmount: 1000.00, multiplier: 100.00, payout: 100000.00, currency: 'EUR' },
  { id: '11', game: 'Dice', user: 'Lucky_7', betAmount: 2500.00, multiplier: 2.00, payout: 5000.00, currency: 'USD' },
];

const CurrencyIcon = ({ type }: { type: Bet['currency'] }) => {
  if (type === 'USDT') {
    return <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-emerald-500 text-white text-[10px] font-bold">₮</span>;
  }
  if (type === 'EUR') {
    return <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-500 text-white text-[10px] font-bold">€</span>;
  }
  return <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-green-600 text-white text-[10px] font-bold">$</span>;
};

const formatCurrency = (amount: number, currency: string) => {
  if (currency === 'EUR') return `€${amount.toFixed(2)}`;
  if (currency === 'USD') return `$${amount.toFixed(2)}`;
  return amount.toFixed(2);
};

export default function LiveBetsTable() {
  const [activeTab, setActiveTab] = useState<'recent' | 'high'>('recent');
  
  const displayData = activeTab === 'recent' ? RECENT_BETS : HIGH_ROLLERS;

  return (
    <div className="w-full mx-auto mt-8 md:mt-12 mb-10 font-sans">
      
      {/* Title */}
      <div className="flex items-center gap-3 mb-6 px-2 md:px-0">
        <Trophy className="w-5 h-5 md:w-6 md:h-6 text-gray-300" strokeWidth={1.5} />
        <h2 className="text-lg md:text-2xl font-bold text-gray-200 tracking-tight">Bahisler ve Liderlik Tabloları</h2>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 md:gap-4 mb-4 px-2 md:px-0 overflow-x-auto pb-2 scrollbar-hide">
        <button 
          onClick={() => setActiveTab('recent')}
          className={`px-4 md:px-5 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-semibold transition-all whitespace-nowrap ${activeTab === 'recent' ? 'bg-[#2a2e38] text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
        >
          Son Bahisler
        </button>
        <button 
          onClick={() => setActiveTab('high')}
          className={`px-4 md:px-5 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-semibold transition-all whitespace-nowrap ${activeTab === 'high' ? 'bg-[#2a2e38] text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
        >
          Büyük Bahisler
        </button>
      </div>

      {/* Table Container */}
      <div className="w-full bg-[#11131a] rounded-xl md:rounded-2xl border border-white/[0.03] shadow-2xl overflow-hidden">
        
        {/* Mobile View (Cards) */}
        <div className="block md:hidden">
          {displayData.map((bet) => {
            const isWin = bet.multiplier >= 1;
            return (
              <div key={bet.id} className="p-4 border-b border-white/[0.03] flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-gray-300 font-medium text-sm">
                    <div className="w-4 h-4 rounded-[3px] border border-gray-600/50 flex items-center justify-center">
                      <Dice5 className="w-2.5 h-2.5 text-gray-400" />
                    </div>
                    <span>{bet.game}</span>
                  </div>
                  <span className="text-gray-500 text-xs">{bet.user}</span>
                </div>
                
                <div className="flex justify-between items-center text-xs bg-black/20 p-2.5 rounded-lg border border-white/[0.02]">
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-500">Bahis</span>
                    <div className="flex items-center gap-1.5 text-gray-300 font-medium">
                      <span>{formatCurrency(bet.betAmount, bet.currency)}</span>
                      <CurrencyIcon type={bet.currency} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 items-center">
                    <span className="text-gray-500">Çarpan</span>
                    <span className="text-gray-400 font-medium">{bet.multiplier.toFixed(2)}X</span>
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    <span className="text-gray-500">Ödeme</span>
                    <div className="flex items-center gap-1.5">
                      <span className={`font-bold ${isWin ? 'text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.3)]' : 'text-gray-400'}`}>
                        {formatCurrency(bet.payout, bet.currency)}
                      </span>
                      <CurrencyIcon type={bet.currency} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop View (Table) */}
        <div className="hidden md:block w-full overflow-x-auto scrollbar-hide">
          <div className="min-w-[800px] w-full">
            {/* Table Header */}
            <div className="grid grid-cols-5 px-6 py-4 border-b border-white/[0.03] text-gray-500 text-xs font-semibold bg-black/10">
              <div className="col-span-1">Oyun</div>
              <div className="col-span-1">Kullanıcı</div>
              <div className="col-span-1 text-right">Bahis miktarı</div>
              <div className="col-span-1 text-right">Çarpan</div>
              <div className="col-span-1 text-right">Ödeme</div>
            </div>

            {/* Table Body */}
            <div className="flex flex-col">
              {displayData.map((bet) => {
                const isWin = bet.multiplier >= 1;
                return (
                  <div 
                    key={bet.id} 
                    className="grid grid-cols-5 px-6 py-4 border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors items-center text-sm"
                  >
                    {/* Oyun */}
                    <div className="col-span-1 flex items-center gap-3 text-gray-300 font-medium truncate pr-4">
                      <div className="w-4 h-4 rounded-[3px] border border-gray-600/50 flex items-center justify-center shrink-0">
                        <Dice5 className="w-2.5 h-2.5 text-gray-400" />
                      </div>
                      <span className="truncate">{bet.game}</span>
                    </div>

                    {/* Kullanıcı */}
                    <div className="col-span-1 text-gray-500 font-medium truncate pr-4">
                      {bet.user}
                    </div>

                    {/* Bahis miktarı */}
                    <div className="col-span-1 flex items-center justify-end gap-2 text-gray-300">
                      <span>{formatCurrency(bet.betAmount, bet.currency)}</span>
                      <CurrencyIcon type={bet.currency} />
                    </div>

                    {/* Çarpan */}
                    <div className="col-span-1 text-right text-gray-400 font-medium">
                      {bet.multiplier.toFixed(2)}X
                    </div>

                    {/* Ödeme */}
                    <div className="col-span-1 flex items-center justify-end gap-2">
                      <span className={`font-bold ${isWin ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.2)]' : 'text-gray-400'}`}>
                        {formatCurrency(bet.payout, bet.currency)}
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
