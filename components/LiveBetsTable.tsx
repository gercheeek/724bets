import React, { useState, useEffect } from 'react';
import { Trophy, Dice5 } from 'lucide-react';

interface Bet {
  id: string;
  game: string;
  user: string;
  amount: string;
  amountRaw: number;
  currency: 'BTC' | 'USD' | 'TRY' | 'EUR' | 'USDT';
  multiplier: number;
  payout: string;
  payoutRaw: number;
  isWin: boolean;
}

const GAME_NAMES = [
  'Angel vs Sinner', 'Gates of Olympus 1000', '11158', 'Big Bass Bonanza 1000',
  'Fury of Anubis', "Keep'Em", 'Sweet Bonanza 1000', 'Sugar Rush',
  'Starlight Princess', 'Wanted Dead or a Wild'
];

const USERS = [
  'mamoun995', 'YE***', 'DarkViking7949', 'DAVOOO1312', 'Telat45',
  'alkinho10', 'LuckyS21', 'JohnD***', 'Kral_Tr', 'Winner007'
];

const CURRENCIES = ['BTC', 'USD', 'TRY', 'EUR', 'USDT'] as const;

const generateRandomBet = (isHighRoller = false): Bet => {
  const currency = CURRENCIES[Math.floor(Math.random() * CURRENCIES.length)];
  let amountRaw = 0;
  
  if (isHighRoller) {
    if (currency === 'BTC') amountRaw = Math.random() * 0.5 + 0.05;
    else if (currency === 'TRY') amountRaw = Math.random() * 50000 + 5000;
    else amountRaw = Math.random() * 2000 + 500;
  } else {
    if (currency === 'BTC') amountRaw = Math.random() * 0.005 + 0.0001;
    else if (currency === 'TRY') amountRaw = Math.random() * 1500 + 10;
    else amountRaw = Math.random() * 50 + 1;
  }

  const isWin = Math.random() > 0.6;
  const multiplier = isWin ? (Math.random() * 15 + 1.1) : (Math.random() * 0.9);
  const payoutRaw = amountRaw * multiplier;

  const formatMoney = (val: number, c: string) => {
    if (c === 'BTC') return val.toFixed(8);
    if (c === 'TRY') return '₺' + val.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (c === 'USD') return '$' + val.toFixed(2);
    if (c === 'EUR') return '€' + val.toFixed(2);
    if (c === 'USDT') return val.toFixed(2);
    return val.toFixed(2);
  };

  return {
    id: Math.random().toString(36).substring(7),
    game: GAME_NAMES[Math.floor(Math.random() * GAME_NAMES.length)],
    user: USERS[Math.floor(Math.random() * USERS.length)],
    amount: formatMoney(amountRaw, currency),
    amountRaw,
    currency,
    multiplier: Number(multiplier.toFixed(2)),
    payout: formatMoney(payoutRaw, currency),
    payoutRaw,
    isWin
  };
};

const CurrencyBadge = ({ currency }: { currency: string }) => {
  if (currency === 'BTC') return <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#F7931A] text-white text-[10px] font-bold ml-2">₿</span>;
  if (currency === 'USD') return <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#2E7D32] text-white text-[11px] font-bold ml-2">$</span>;
  if (currency === 'TRY') return <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#E53935] text-white text-[10px] font-bold ml-2">₺</span>;
  if (currency === 'EUR') return <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#1565C0] text-white text-[11px] font-bold ml-2">€</span>;
  if (currency === 'USDT') return <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#26A17B] text-white text-[10px] font-bold ml-2">₮</span>;
  return null;
};

const LiveBetsTable = () => {
  const [activeTab, setActiveTab] = useState<'recent' | 'high'>('recent');
  const [recentBets, setRecentBets] = useState<Bet[]>([]);
  const [highBets, setHighBets] = useState<Bet[]>([]);

  // Initial load
  useEffect(() => {
    const initialRecent = Array.from({ length: 8 }, () => generateRandomBet(false));
    const initialHigh = Array.from({ length: 8 }, () => generateRandomBet(true)).sort((a, b) => b.amountRaw - a.amountRaw);
    setRecentBets(initialRecent);
    setHighBets(initialHigh);
  }, []);

  // Fake real-time updates for recent bets
  useEffect(() => {
    if (activeTab !== 'recent') return;
    
    const interval = setInterval(() => {
      setRecentBets(prev => {
        const newBet = generateRandomBet(false);
        return [newBet, ...prev.slice(0, 7)];
      });
    }, 2500); // Add a new bet every 2.5 seconds

    return () => clearInterval(interval);
  }, [activeTab]);

  const displayBets = activeTab === 'recent' ? recentBets : highBets;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 mt-4">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Trophy className="w-5 h-5 text-gray-300 mr-3" />
        <h2 className="text-xl font-bold text-white tracking-tight">Bahisler ve Liderlik Tabloları</h2>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 mb-4">
        <button 
          onClick={() => setActiveTab('recent')}
          className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${activeTab === 'recent' ? 'bg-[#1F232B] text-white shadow-md' : 'bg-transparent text-gray-400 hover:text-white hover:bg-white/5'}`}
        >
          Son Bahisler
        </button>
        <button 
          onClick={() => setActiveTab('high')}
          className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${activeTab === 'high' ? 'bg-[#1F232B] text-white shadow-md' : 'bg-transparent text-gray-400 hover:text-white hover:bg-white/5'}`}
        >
          Büyük Bahisler
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-[#151821] rounded-xl border border-white/5 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse whitespace-nowrap min-w-[700px]">
            <thead>
              <tr className="bg-[#1A1F29] border-b border-white/5 text-xs font-semibold text-gray-400">
                <th className="py-4 px-6 rounded-tl-xl w-[30%]">Oyun</th>
                <th className="py-4 px-6 w-[20%]">Kullanıcı</th>
                <th className="py-4 px-6 text-right w-[20%]">Bahis miktarı</th>
                <th className="py-4 px-6 text-right w-[15%]">Çarpan</th>
                <th className="py-4 px-6 text-right rounded-tr-xl w-[15%]">Ödeme</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium">
              {displayBets.map((bet, idx) => (
                <tr 
                  key={bet.id} 
                  className={`border-b border-white/5 transition-colors hover:bg-white/[0.02] ${idx === 0 && activeTab === 'recent' ? 'animate-[pulse_1s_ease-out]' : ''}`}
                >
                  <td className="py-3 px-6 text-gray-200">
                    <div className="flex items-center">
                      <Dice5 className="w-4 h-4 text-gray-500 mr-3 shrink-0" />
                      <span className="truncate">{bet.game}</span>
                    </div>
                  </td>
                  <td className="py-3 px-6 text-gray-400 truncate max-w-[120px]">
                    {bet.user}
                  </td>
                  <td className="py-3 px-6 text-right">
                    <div className="flex items-center justify-end">
                      <span className="text-gray-300">{bet.amount}</span>
                      <CurrencyBadge currency={bet.currency} />
                    </div>
                  </td>
                  <td className="py-3 px-6 text-right text-gray-400">
                    {bet.multiplier}X
                  </td>
                  <td className="py-3 px-6 text-right">
                    <div className="flex items-center justify-end">
                      <span className={bet.isWin ? 'text-[#00FFA3]' : 'text-gray-400'}>
                        {bet.payout}
                      </span>
                      <CurrencyBadge currency={bet.currency} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
};

export default LiveBetsTable;
