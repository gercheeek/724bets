import React, { useState, useEffect } from 'react';
import { Dices } from 'lucide-react';

interface Bet {
  id: string;
  game: string;
  user: string;
  betAmount: number;
  currency: 'TRY' | 'USD' | 'EUR' | 'USDT' | 'ARS';
  multiplier: number;
  payout: number;
}

const GAMES = [
  'The Dog House Multihold™', 'Insurance Baccarat', 'Sweet Bonanza 1000',
  'VIP Flaming Hot Extreme', 'Big Bass Splash 1000', 'Gates of Olympus',
  'Lightning Roulette', 'Aviator', 'Crazy Time', 'Sugar Rush',
  'Starlight Princess', 'Fruit Party', 'Gonzo\'s Quest', 'Reactoonz'
];

const USERS = [
  'AndiH95', 'FrostGladiator7725', 'Kuba', 'Bekir42', 'Ruzzojona', 
  'Caner_34', 'AhmetX', 'Mehmet_Pro', 'ZeynepK', 'GamerTurk',
  'AliVeli44', 'Winner_01', 'LuckyStar', 'JackpotHunter', 'CasinoKing',
  'Veli_Pro', 'CrazyBettor', 'SweetBonanzaFan', 'RouletteMaster', 'Aviator_Pro',
  'HighRoller', 'BetNinja', 'CryptoWhale', 'TR_Gamer', 'Baskan_06',
  'Yilmaz_1905', 'Kral_1907', 'Kartal_1903', 'Efsane_X', 'Shadow_Hunter'
];

const CURRENCIES: ('TRY' | 'USD' | 'EUR' | 'USDT' | 'ARS')[] = ['TRY', 'USD', 'EUR', 'USDT', 'ARS'];

const generateRandomBet = (isBigBet = false, currentUsers: string[] = []): Bet => {
  const currency = CURRENCIES[Math.floor(Math.random() * CURRENCIES.length)];
  
  let baseBet = Math.random() * 100;
  if (isBigBet) baseBet = baseBet * 50 + 1000;
  else if (currency === 'TRY') baseBet = baseBet * 10 + 50;
  
  const betAmount = Number(baseBet.toFixed(2));
  
  // 30% chance of losing (0x multiplier), otherwise 0.1x to 100x
  const isLoss = Math.random() < 0.3 && !isBigBet;
  let multiplier = 0;
  
  if (!isLoss) {
    if (isBigBet) multiplier = Number((Math.random() * 50 + 5).toFixed(2));
    else multiplier = Number((Math.random() * 15 + 0.1).toFixed(2));
  }
  
  const payout = isLoss ? -betAmount : Number((betAmount * multiplier).toFixed(2));

  let availableUsers = USERS.filter(u => !currentUsers.includes(u));
  if (availableUsers.length === 0) availableUsers = USERS;
  const user = availableUsers[Math.floor(Math.random() * availableUsers.length)];

  return {
    id: Math.random().toString(36).substr(2, 9),
    game: GAMES[Math.floor(Math.random() * GAMES.length)],
    user,
    betAmount,
    currency,
    multiplier,
    payout
  };
};

const formatCurrency = (amount: number, currency: string) => {
  const absAmount = Math.abs(amount).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  
  switch (currency) {
    case 'TRY': return `₺${absAmount}`;
    case 'USD': return `$${absAmount}`;
    case 'EUR': return `€${absAmount}`;
    case 'ARS': return `AR$${absAmount}`;
    case 'USDT': return `${absAmount}`;
    default: return absAmount;
  }
};

const CurrencyBadge: React.FC<{ currency: string }> = ({ currency }) => {
  const getBadgeStyle = () => {
    switch (currency) {
      case 'TRY': return 'bg-red-600 text-white';
      case 'USD': return 'bg-blue-600 text-white';
      case 'EUR': return 'bg-blue-500 text-white';
      case 'USDT': return 'bg-[#26A17B] text-white';
      case 'ARS': return 'bg-sky-400 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getSymbol = () => {
    switch (currency) {
      case 'TRY': return '₺';
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'USDT': return '₮';
      case 'ARS': return 'ARS';
      default: return '$';
    }
  };

  return (
    <span className={`inline-flex items-center justify-center w-[18px] h-[18px] rounded-full text-[9px] font-bold ml-1.5 shadow-sm ${getBadgeStyle()}`}>
      {getSymbol()}
    </span>
  );
};

const LiveBetsFeed: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'recent' | 'big'>('recent');
  const [recentBets, setRecentBets] = useState<Bet[]>([]);
  const [bigBets, setBigBets] = useState<Bet[]>([]);

  // Initial Data Load
  useEffect(() => {
    let currentRecent: string[] = [];
    const initialRecent = Array.from({ length: 8 }, () => {
      const b = generateRandomBet(false, currentRecent);
      currentRecent.push(b.user);
      return b;
    });

    let currentBig: string[] = [];
    const initialBig = Array.from({ length: 8 }, () => {
      const b = generateRandomBet(true, currentBig);
      currentBig.push(b.user);
      return b;
    });

    setRecentBets(initialRecent);
    setBigBets(initialBig);
  }, []);

  // Live Feed Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeTab === 'recent') {
        setRecentBets(prev => {
          const currentUsers = prev.map(b => b.user);
          const newBet = generateRandomBet(false, currentUsers);
          return [newBet, ...prev].slice(0, 8);
        });
      } else {
        // Big bets happen less frequently, simulate by only adding sometimes
        if (Math.random() > 0.5) {
          setBigBets(prev => {
            const currentUsers = prev.map(b => b.user);
            const newBet = generateRandomBet(true, currentUsers);
            return [newBet, ...prev].slice(0, 8);
          });
        }
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [activeTab]);

  const displayBets = activeTab === 'recent' ? recentBets : bigBets;

  return (
    <div className="w-full max-w-[1200px] mx-auto font-sans mt-8 mb-12">
      
      {/* TABS */}
      <div className="flex items-center gap-2 mb-4 px-2 sm:px-0">
        <button 
          onClick={() => setActiveTab('recent')}
          className={`px-6 py-2 rounded-full text-[13px] font-bold transition-all ${
            activeTab === 'recent' 
            ? 'bg-[#1A1D24] text-white shadow-lg border border-[#2C2F3D]' 
            : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Son Bahisler
        </button>
        <button 
          onClick={() => setActiveTab('big')}
          className={`px-6 py-2 rounded-full text-[13px] font-bold transition-all ${
            activeTab === 'big' 
            ? 'bg-[#1A1D24] text-white shadow-lg border border-[#2C2F3D]' 
            : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Büyük Bahisler
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-[#12141A] rounded-xl border border-[#2C2F3D] overflow-hidden shadow-2xl">
        
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-[#1A1D24] border-b border-[#2C2F3D] text-[11px] font-bold text-gray-400 uppercase tracking-wider">
          <div className="col-span-4">Oyun</div>
          <div className="col-span-3">Kullanıcı</div>
          <div className="col-span-2 text-right">Bahis miktarı</div>
          <div className="col-span-1 text-right">Çarpan</div>
          <div className="col-span-2 text-right">Ödeme</div>
        </div>

        {/* Table Body */}
        <div className="flex flex-col relative min-h-[400px] overflow-hidden bg-[#16181F]">
          {displayBets.map((bet, index) => (
            <div 
              key={bet.id}
              className="grid grid-cols-12 gap-4 px-6 py-3.5 border-b border-[#2C2F3D]/50 hover:bg-[#1A1D24] transition-colors items-center animate-fade-in-down"
            >
              {/* Oyun */}
              <div className="col-span-4 flex items-center gap-2">
                <Dices size={14} className="text-gray-500" />
                <span className="text-[13px] font-bold text-white truncate">{bet.game}</span>
              </div>
              
              {/* Kullanıcı */}
              <div className="col-span-3">
                <span className="text-[13px] text-gray-300 truncate block">{bet.user}</span>
              </div>

              {/* Bahis miktarı */}
              <div className="col-span-2 flex items-center justify-end">
                <span className="text-[13px] font-medium text-white">
                  {formatCurrency(bet.betAmount, bet.currency)}
                </span>
                <CurrencyBadge currency={bet.currency} />
              </div>

              {/* Çarpan */}
              <div className="col-span-1 text-right">
                <span className="text-[13px] font-medium text-gray-300">
                  {bet.multiplier.toFixed(2)}X
                </span>
              </div>

              {/* Ödeme */}
              <div className="col-span-2 flex items-center justify-end">
                <span className={`text-[13px] font-bold ${bet.payout > 0 ? 'text-[#00FFA3]' : 'text-white'}`}>
                  {bet.payout < 0 ? '-' : ''}{formatCurrency(bet.payout, bet.currency)}
                </span>
                <CurrencyBadge currency={bet.currency} />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default LiveBetsFeed;
