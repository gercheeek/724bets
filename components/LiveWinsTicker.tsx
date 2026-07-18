import React, { useState, useEffect } from 'react';
import BetDetailsModal, { BetDetailData } from './BetDetailsModal';
import { Diamond } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const TICKER_GAMES = [
  { name: "Plinko", provider: 'ahbapbet', image: "/images/flat-plinko.jpg", type: 'slot' as const, path: "plinko", rules: "Topları yukarıdan bırakın, çarpan engellerini aşarak en yüksek kazanç kutusuna ulaşmasını sağlayın. Tamamen adil ve yüksek RTP oranına sahiptir." },
  { name: "Mission Uncrossable", provider: 'ahbapbet', image: "/images/flat-mission.jpg", type: 'slot' as const, path: "chicken-run", rules: "Tavuğu güvenle karşıya geçirin. Her başarılı adımda çarpanınız artsın, büyük ödülü kapın!" },
  { name: "Keno", provider: 'ahbapbet', image: "/images/flat-keno.jpg", type: 'keno' as const, path: "keno", rules: "Şanslı sayılarınızı seçin. Ne kadar çok eşleşme yakalarsanız, kazancınız o kadar büyük olur." },
  { name: "Blackjack", provider: 'ahbapbet', image: "/images/flat-blackjack.jpg", type: 'blackjack' as const, path: "blackjack", rules: "Krupiyeyi 21'e en yakın skorla yenin. En popüler kart oyununda şansınızı deneyin." },
  { name: "Roulette", provider: 'ahbapbet', image: "/images/flat-roulette.jpg", type: 'slot' as const, path: "roulette", rules: "Şanslı rakamlarınızı seçin ve tekerleğin dönüşünü heyecanla bekleyin." },
  { name: "Limbo", provider: 'ahbapbet', image: "/images/flat-keno.jpg", type: 'slot' as const, path: "limbo", rules: "Hedef çarpanınızı belirleyin. Roket belirlediğiniz çarpanın üzerine çıktığı an bahis tutarınız o çarpan ile çarpılır." }
];

const getRandom = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

// Format to local currency like $1.240,50
const formatCurrency = (amount: number) => {
  return '$' + amount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const generateFakeBet = (): BetDetailData => {
  const game = getRandom(TICKER_GAMES);
  const userId = Math.floor(100000 + Math.random() * 900000);
  const user = `Üye #${userId}`;
  const userRank = Math.floor(Math.random() * 100);
  
  // Mostly low bets between $1 and $20, occasionally up to $100
  const isHighRoll = Math.random() > 0.85;
  const betAmountRaw = isHighRoll ? (Math.random() * 80 + 20) : (Math.random() * 19 + 1);
  
  // Mostly low multipliers 1.2x to 5x, occasionally up to 1000x
  const isMegaWin = Math.random() > 0.98;
  const isBigWin = Math.random() > 0.85;
  const multiplierRaw = isMegaWin ? (Math.random() * 500 + 50) : (isBigWin ? (Math.random() * 15 + 5) : (Math.random() * 3 + 1.2));
  
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

export default function LiveWinsTicker() {
  const [wins, setWins] = useState<BetDetailData[]>([]);
  const [selectedWin, setSelectedWin] = useState<BetDetailData | null>(null);
  const { t } = useLanguage();

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
    <div className="w-full flex flex-col mb-1 relative mt-2">
      <div className="w-full relative flex items-center bg-transparent overflow-hidden pt-8 pb-5">
        
        {/* Canlı Kazançlar Badge top left */}
        <div className="absolute top-2 left-4 flex items-center gap-2 z-10 bg-[#00E676]/10 px-3 py-1 rounded-full border border-[#00E676]/30 backdrop-blur-md">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E676] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#00E676] shadow-[0_0_10px_#00E676]"></span>
          </span>
          <span className="text-[#00E676] font-bold text-[10px] tracking-widest uppercase">{t('winners_title') || 'Canlı Kazançlar'}</span>
        </div>

        {/* Horizontal Scrolling List (Full Width) */}
        <div 
          className="flex gap-2.5 md:gap-4 overflow-x-auto hide-scrollbar w-full px-4 md:px-8 scroll-smooth"
          style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
        >
          {wins.map((win) => (
            <div 
              key={win.id}
              onClick={() => setSelectedWin(win)}
              className="flex-shrink-0 flex flex-col items-center cursor-pointer transition-all duration-300 hover:-translate-y-2 group w-[100px] md:w-[130px]"
            >
              {/* Game Cover */}
              <div className="w-full aspect-[3/4] rounded-[12px] md:rounded-2xl overflow-hidden relative shadow-[0_5px_15px_rgba(0,0,0,0.5)] mb-3 bg-[#14141a] border border-white/10 group-hover:border-[#00E676]/50 group-hover:shadow-[0_0_20px_rgba(0,230,118,0.2)] transition-all">
                 <img 
                   src={win.image} 
                   alt={win.game} 
                   className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                 />
                 
                 <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </div>

              {/* User Info */}
              <div className="flex items-center gap-1.5 w-full justify-center px-1 mb-1.5">
                 <span className="text-gray-400 font-semibold text-[11px] md:text-xs truncate tracking-wide group-hover:text-white transition-colors">{win.user}</span>
              </div>
              
              {/* Payout */}
              <span className="text-[#00E676] font-black text-xs md:text-sm tracking-wide bg-[#00E676]/10 px-2 py-0.5 rounded-md drop-shadow-[0_0_5px_rgba(0,230,118,0.3)]">
                 {win.payout}
              </span>
            </div>
          ))}
        </div>

        {selectedWin && (
          <BetDetailsModal data={selectedWin} onClose={() => setSelectedWin(null)} />
        )}
      </div>
    </div>
  );
}
