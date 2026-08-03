import React, { useState, useEffect } from 'react';
import BetDetailsModal, { BetDetailData } from './BetDetailsModal';
import { Diamond } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const TICKER_GAMES = [
  { name: "Plinko", provider: '724bets', image: "/images/plinko_premium.jpg", type: 'slot' as const, path: "plinko", rules: "Topları yukarıdan bırakın, çarpan engellerini aşarak en yüksek kazanç kutusuna ulaşmasını sağlayın. Tamamen adil ve yüksek RTP oranına sahiptir." },
  { name: "Mission Uncrossable", provider: '724bets', image: "/images/mission_premium.jpg", type: 'slot' as const, path: "chicken-run", rules: "Tavuğu güvenle karşıya geçirin. Her başarılı adımda çarpanınız artsın, büyük ödülü kapın!" },
  { name: "Keno", provider: '724bets', image: "/images/keno_premium.jpg", type: 'keno' as const, path: "keno", rules: "Şanslı sayılarınızı seçin. Ne kadar çok eşleşme yakalarsanız, kazancınız o kadar büyük olur." },
  { name: "Blackjack", provider: '724bets', image: "/images/blackjack_premium.jpg", type: 'blackjack' as const, path: "blackjack-pro", rules: "Krupiyeyi 21'e en yakın skorla yenin. En popüler kart oyununda şansınızı deneyin." },
  { name: "Roulette", provider: '724bets', image: "/images/roulette_premium.jpg", type: 'slot' as const, path: "roulette", rules: "Şanslı rakamlarınızı seçin ve tekerleğin dönüşünü heyecanla bekleyin." },
  { name: "Limbo", provider: '724bets', image: "/images/mission_premium.jpg", type: 'slot' as const, path: "limbo", rules: "Hedef çarpanınızı belirleyin. Roket belirlediğiniz çarpanın üzerine çıktığı an bahis tutarınız o çarpan ile çarpılır." },
  { name: "Sugar Twist 1000", provider: "Pragmatic Play", image: "https://mediumrare.imgix.net/2782fa43a134b33c6c44f35edaa6850ef5cf9899a8a2efa9a2450ba5d30f5610?w=300&h=400&fit=min&auto=format", type: 'slot' as const, path: "sugar-twist-1000", rules: "Şeker dolu bir dünyaya adım atın ve 1000x çarpanlarla büyük kazançlar elde edin." },
  { name: "Undead Farm", provider: "True Labs", image: "https://mediumrare.imgix.net/79a6b3ce1158894cb6b085dc8d6fed994321449e248d49796b52ff0e38a742e0?w=560&h=750&fit=min&auto=format", type: 'slot' as const, path: "undead-farm", rules: "Korkunç ama eğlenceli zombilerle dolu bu çiftlikte büyük ödülleri toplayın." },
  { name: "Big Bass Rock and Roll", provider: "Pragmatic Play", image: "https://mediumrare.imgix.net/49950a8148c358e88455c78d8dd1abfbeb8d2dd31a7b7971f5515ae4091b6429?w=300&h=400&fit=min&auto=format", type: 'slot' as const, path: "big-bass-rock", rules: "Rock and Roll eşliğinde en büyük balıkları ve muhteşem ödülleri yakalayın." },
  { name: "Sweet Bonanza 2500", provider: "Pragmatic Play", image: "https://mediumrare.imgix.net/76411df1039d658a8b9c9f90c14467c7ca7c240feeed97274ea73208d786484e?w=300&h=400&fit=min&auto=format", type: 'slot' as const, path: "sweet-bonanza-2500", rules: "Klasik Sweet Bonanza keyfi şimdi daha yüksek çarpanlar ve ödüllerle karşınızda." }
];

const getRandom = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

// Format to local currency like ₺10,86M or ₺9.987,07K
const formatCurrency = (amount: number) => {
  if (amount >= 1000000) {
    return '₺' + (amount / 1000000).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + 'M';
  } else if (amount >= 1000) {
    return '₺' + (amount / 1000).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + 'K';
  }
  return '₺' + amount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const generateFakeBet = (t: any, filterType: 'all' | 'originals' | 'slots' | 'casino' = 'all'): BetDetailData => {
  let filteredGames = TICKER_GAMES;
  if (filterType === 'originals') {
    filteredGames = TICKER_GAMES.filter(g => g.provider === '724bets' && g.name !== 'Blackjack' && g.name !== 'Roulette');
  } else if (filterType === 'slots') {
    filteredGames = TICKER_GAMES.filter(g => g.provider !== '724bets' && g.type === 'slot');
  } else if (filterType === 'casino') {
    filteredGames = TICKER_GAMES.filter(g => g.name === 'Blackjack' || g.name === 'Roulette');
  }
  
  if (filteredGames.length === 0) filteredGames = TICKER_GAMES;
  
  const game = getRandom(filteredGames);
  let user = '';
  const rand = Math.random();
  if (rand < 0.45) {
    user = 'Gizlenmiş';
  } else if (rand < 0.75) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    user = Array.from({length: 6}, () => chars[Math.floor(Math.random() * chars.length)]).join('') + '...';
  } else {
    user = `tony${Math.floor(Math.random() * 9000 + 1000)}`;
  }

  const userRank = Math.floor(Math.random() * 100);
  
  // BC Game style huge bets to get millions/thousands payout
  const betAmountRaw = Math.random() * 8000 + 1000;
  
  // High multipliers
  const isMegaWin = Math.random() > 0.85;
  const multiplierRaw = isMegaWin ? (Math.random() * 5000 + 500) : (Math.random() * 100 + 10);
  
  const payoutRaw = betAmountRaw * multiplierRaw;
  
  const now = new Date();
  
  const data: BetDetailData = {
    id: Math.random().toString(36).substr(2, 9),
    game: game.name,
    provider: game.provider,
    image: game.image,
    user,
    userRank,
    time: `${now.getDate()} Tem ${now.getFullYear()} ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`,
    betAmount: formatCurrency(betAmountRaw),
    multiplier: `${multiplierRaw.toFixed(2)}x`,
    payout: formatCurrency(payoutRaw),
    type: game.type,
    rules: game.rules,
    path: game.path
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

export default function LiveWinsTicker({ guestTheme = "retro" }: { guestTheme?: "retro" | "luxury" }) {
  const [wins, setWins] = useState<BetDetailData[]>([]);
  const [selectedWin, setSelectedWin] = useState<BetDetailData | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'originals' | 'slots' | 'casino'>('all');
  const { t } = useLanguage();

  useEffect(() => {
    // Generate a fixed number of items for the infinite loop
    const initial = Array.from({ length: 30 }).map(() => generateFakeBet(t, activeTab));
    setWins(initial);
  }, [activeTab, t]);

  return (
    <div className="w-full flex flex-col mb-1 relative px-0 md:px-2">
      <div className="w-full relative flex flex-col bg-[#1c1e22] rounded-xl overflow-hidden py-2.5 mt-1">
        
        {/* BC Game Style Header Row (Side by side) */}
        <div className="w-full flex items-center justify-start gap-3 md:gap-5 px-3 md:px-5 mb-2.5">
          <div className="flex items-center gap-1.5">
            {/* BC Game Style Static Dot */}
            <div className="flex items-center justify-center h-[9px] w-[9px] rounded-full bg-[#00E5FF]/20 border border-[#00E5FF]/40">
              <span className="h-[4px] w-[4px] rounded-full bg-[#00E5FF]"></span>
            </div>
            <h2 className="text-white text-[11px] md:text-[13px] font-bold tracking-wide">Son Zamanlardaki Büyük Kazançlar</h2>
          </div>
          
          {/* Category Tabs */}
          <div className="hidden md:flex items-center gap-3 md:gap-4 text-[10px] md:text-[12px] font-medium text-gray-400">
            <button 
              onClick={() => setActiveTab('all')}
              className={`pb-1 transition-colors ${activeTab === 'all' ? 'text-white border-b-2 border-[#00E5FF]' : 'border-b-2 border-transparent hover:text-white'}`}
            >
              Tüm
            </button>
            <button 
              onClick={() => setActiveTab('originals')}
              className={`pb-1 transition-colors ${activeTab === 'originals' ? 'text-white border-b-2 border-[#00E5FF]' : 'border-b-2 border-transparent hover:text-white'}`}
            >
              724bets Orijinaller
            </button>
            <button 
              onClick={() => setActiveTab('slots')}
              className={`pb-1 transition-colors ${activeTab === 'slots' ? 'text-white border-b-2 border-[#00E5FF]' : 'border-b-2 border-transparent hover:text-white'}`}
            >
              Slotlar
            </button>
            <button 
              onClick={() => setActiveTab('casino')}
              className={`pb-1 transition-colors ${activeTab === 'casino' ? 'text-white border-b-2 border-[#00E5FF]' : 'border-b-2 border-transparent hover:text-white'}`}
            >
              Canlı Casino
            </button>
          </div>
        </div>

        {/* Smooth Infinite Marquee List */}
        <div 
          className="relative w-full overflow-hidden flex mt-2"
          style={{ maskImage: 'linear-gradient(to right, transparent, black 3%, black 97%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 3%, black 97%, transparent)' }}
        >
          <style>{`
            @keyframes marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .animate-marquee {
              animation: marquee 50s linear infinite;
              display: flex;
              width: max-content;
              will-change: transform;
              transform: translateZ(0);
              backface-visibility: hidden;
            }
            .animate-marquee:hover {
              animation-play-state: paused;
            }
          `}</style>

          <div className="animate-marquee gap-4 md:gap-5 pl-2" style={{ WebkitTransform: 'translate3d(0,0,0)', transform: 'translate3d(0,0,0)', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
            {/* First Set */}
            {wins.map((win) => (
              <div 
                key={win.id}
                onClick={() => setSelectedWin(win)}
                className="flex-shrink-0 flex flex-col items-start cursor-pointer hover:opacity-80 transition-opacity w-[55px] md:w-[70px] group"
              >
                {/* Game Cover */}
                <div className="w-full aspect-square rounded-xl overflow-hidden mb-1.5 bg-[#111111] border border-white/5 shadow-md group-hover:border-[#00E5FF]/30 transition-colors" style={{ transform: 'translateZ(0)' }}>
                   <img src={win.image} alt={win.game} className="w-full h-full object-cover" style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'translateZ(0)' }} />
                </div>
                {/* User Info */}
                <div className="flex items-center gap-1 w-full text-slate-400 mb-0.5 px-0.5">
                   <svg className="w-[9px] h-[9px] flex-shrink-0 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                   <span className="font-medium text-[8px] md:text-[9.5px] truncate tracking-wide">{win.user}</span>
                </div>
                {/* Payout */}
                <span className="text-[#00E676] font-semibold text-[9px] md:text-[10px] tracking-wide px-0.5">{win.payout}</span>
              </div>
            ))}
            
            {/* Second Set for Seamless Loop */}
            {wins.map((win) => (
              <div 
                key={`${win.id}-dup`}
                onClick={() => setSelectedWin(win)}
                className="flex-shrink-0 flex flex-col items-start cursor-pointer hover:opacity-80 transition-opacity w-[55px] md:w-[70px] group"
              >
                {/* Game Cover */}
                <div className="w-full aspect-square rounded-xl overflow-hidden mb-1.5 bg-[#111111] border border-white/5 shadow-md group-hover:border-[#00E5FF]/30 transition-colors" style={{ transform: 'translateZ(0)' }}>
                   <img src={win.image} alt={win.game} className="w-full h-full object-cover" style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'translateZ(0)' }} />
                </div>
                {/* User Info */}
                <div className="flex items-center gap-1 w-full text-slate-400 mb-0.5 px-0.5">
                   <svg className="w-[9px] h-[9px] flex-shrink-0 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                   <span className="font-medium text-[8px] md:text-[9.5px] truncate tracking-wide">{win.user}</span>
                </div>
                {/* Payout */}
                <span className="text-[#00E676] font-semibold text-[9px] md:text-[10px] tracking-wide px-0.5">{win.payout}</span>
              </div>
            ))}
          </div>
        </div>

        {selectedWin && (
          <BetDetailsModal data={selectedWin} onClose={() => setSelectedWin(null)} />
        )}
      </div>
    </div>
  );
}
