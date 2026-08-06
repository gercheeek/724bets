import React, { useState, useEffect } from 'react';
import BetDetailsModal, { BetDetailData } from './BetDetailsModal';
import { Diamond } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const TICKER_GAMES = [
  // 724bets Originals
  { name: "Plinko", provider: '724bets', image: "/images/plinko_premium.jpg", type: 'slot' as const, path: "plinko", rules: "Topları yukarıdan bırakın, çarpan engellerini aşarak en yüksek kazanç kutusuna ulaşmasını sağlayın. (Çarpan: 0.2x - 1000x)" },
  { name: "Mission Uncrossable", provider: '724bets', image: "/images/mission_premium.jpg", type: 'slot' as const, path: "chicken-run", rules: "Tavuğu güvenle karşıya geçirin. Her başarılı adımda çarpanınız artsın. (Çarpan: 1.0x - 1000x)" },
  { name: "Keno", provider: '724bets', image: "/images/keno_premium.jpg", type: 'keno' as const, path: "keno", rules: "Şanslı sayılarınızı seçin. Eşleşme yakaladıkça kazancınız büyüsün. (Çarpan: 1.0x - 10000x)" },
  { name: "Limbo", provider: '724bets', image: "/images/limbo_premium.jpg", type: 'slot' as const, path: "limbo", rules: "Hedef çarpanınızı belirleyin, roket belirlediğiniz çarpanın üzerine çıkarsa kazanın. (Çarpan: 1.01x - 1,000,000x)" },
  { name: "Mines", provider: '724bets', image: "/images/mines_premium.jpg", type: 'slot' as const, path: "mines", rules: "Mayınlara basmadan elmasları bulun. Ne kadar çok elmas, o kadar büyük çarpan! (Çarpan: 1.01x - 5,000,000x)" },
  { name: "Dice", provider: '724bets', image: "/images/dice_premium.jpg", type: 'dice' as const, path: "dice", rules: "Zarın düşeceği aralığı tahmin edin, şansınızı katlayın. (Çarpan: 1.01x - 99x)" },
  { name: "Crash", provider: '724bets', image: "/images/crash_premium.jpg", type: 'slot' as const, path: "crash", rules: "Roket patlamadan önce bahis bozdurun. Risk alın, daha çok kazanın! (Çarpan: 1.01x - 100,000x)" },
  { name: "Hilo", provider: '724bets', image: "/images/blackjack_premium.jpg", type: 'slot' as const, path: "hilo", rules: "Sıradaki kartın yüksek mi düşük mü olacağını tahmin edin. (Çarpan: 1.1x - 12x)" },

  // Live Casino
  { name: "Blackjack", provider: '724bets', image: "/images/blackjack_premium.jpg", type: 'blackjack' as const, path: "blackjack-pro", rules: "Krupiyeyi 21'e en yakın skorla yenin. (Ödemeler: Normal 2x, Blackjack 2.5x)" },
  { name: "Roulette", provider: '724bets', image: "/images/roulette_premium.jpg", type: 'slot' as const, path: "roulette", rules: "Şanslı rakamlarınızı seçin ve çarkın dönüşünü bekleyin. (Çarpan: 1x - 36x)" },
  { name: "Casino Arena", provider: "Evolution", image: "/images/slots/arena.webp", type: 'slot' as const, path: "arena", rules: "Devasa arenada en büyük çarpanları yakalayın!" },
  { name: "Legion Gold", provider: "Play'n GO", image: "/images/slots/legiongold.webp", type: 'slot' as const, path: "legion-gold", rules: "Roma lejyonu ile altına hücum edin." },

  // Popular Slots
  { name: "The Dog House", provider: "Pragmatic Play", image: "/images/slots/doghouse.webp", type: 'slot' as const, path: "dog-house", rules: "Sevimli köpeklerle x3 çarpanlı wild'ları yakalayın!" },
  { name: "Fruit Shop", provider: "NetEnt", image: "/images/slots/fruitshop.webp", type: 'slot' as const, path: "fruit-shop", rules: "Taze meyvelerle bedava dönüşler kazanın." },
  { name: "Out of the Woods", provider: "Hacksaw Gaming", image: "/images/slots/outofthewoods.webp", type: 'slot' as const, path: "out-of-the-woods", rules: "Karanlık ormandan büyük ödüllerle çıkın." },
  { name: "Crabby", provider: "Hacksaw Gaming", image: "/images/slots/crabby.webp", type: 'slot' as const, path: "crabby", rules: "Okyanusun derinliklerinde hazineleri bulun." },
  { name: "Sugar Twist 1000", provider: "Pragmatic Play", image: "https://mediumrare.imgix.net/2782fa43a134b33c6c44f35edaa6850ef5cf9899a8a2efa9a2450ba5d30f5610?w=300&h=400&fit=min&auto=format", type: 'slot' as const, path: "sugar-twist-1000", rules: "Şeker dünyasında 1000x çarpanlarla kazanın." },
  { name: "Undead Farm", provider: "True Labs", image: "https://mediumrare.imgix.net/79a6b3ce1158894cb6b085dc8d6fed994321449e248d49796b52ff0e38a742e0?w=560&h=750&fit=min&auto=format", type: 'slot' as const, path: "undead-farm", rules: "Zombi çiftliğinde büyük ödülleri toplayın." },
  { name: "Big Bass Rock and Roll", provider: "Pragmatic Play", image: "https://mediumrare.imgix.net/49950a8148c358e88455c78d8dd1abfbeb8d2dd31a7b7971f5515ae4091b6429?w=300&h=400&fit=min&auto=format", type: 'slot' as const, path: "big-bass-rock", rules: "Rock eşliğinde dev balıkları yakalayın." },
  { name: "Sweet Bonanza 2500", provider: "Pragmatic Play", image: "https://mediumrare.imgix.net/76411df1039d658a8b9c9f90c14467c7ca7c240feeed97274ea73208d786484e?w=300&h=400&fit=min&auto=format", type: 'slot' as const, path: "sweet-bonanza-2500", rules: "Klasik efsane şimdi daha büyük kazandırıyor." }
];

const getRandom = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

// Format to USD currency like $10.86M or $9,987.07K or $150.00
const formatCurrency = (amount: number) => {
  if (amount >= 1000000) {
    return '$' + (amount / 1000000).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + 'M';
  } else if (amount >= 1000) {
    return '$' + (amount / 1000).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + 'K';
  }
  return '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const getRealisticMultiplier = (gameType: string, gameName: string): number => {
  const name = gameName.toLowerCase();
  const type = gameType.toLowerCase();

  if (type === 'blackjack') {
    // Blackjack wins are either 2x (standard win) or 2.5x (blackjack)
    return Math.random() > 0.3 ? 2.0 : 2.5;
  }
  
  if (type === 'dice') {
    // Dice multipliers: 1.01x to 99x
    return Number((Math.random() * 97.99 + 1.01).toFixed(2));
  }
  
  if (name.includes('roulette') || type === 'roulette') {
    // Roulette payouts: 2x, 3x, 4x, 6x, 9x, 12x, 18x, 36x
    const options = [2, 3, 4, 6, 9, 12, 18, 36];
    return options[Math.floor(Math.random() * options.length)];
  }
  
  if (name.includes('hilo') || name.includes('hi-lo')) {
    // Hilo payouts: 1.1x to 12x
    return Number((Math.random() * 10.9 + 1.1).toFixed(2));
  }
  
  if (name.includes('mines')) {
    // Mines: 1.01x to 500x
    const isMega = Math.random() > 0.95;
    return Number((isMega ? Math.random() * 450 + 50 : Math.random() * 20 + 1.1).toFixed(2));
  }
  
  if (name.includes('limbo')) {
    // Limbo: 1.01x to 1000x
    const isMega = Math.random() > 0.95;
    return Number((isMega ? Math.random() * 900 + 100 : Math.random() * 10 + 1.01).toFixed(2));
  }
  
  if (name.includes('crash')) {
    // Crash: 1.01x to 200x
    const isMega = Math.random() > 0.95;
    return Number((isMega ? Math.random() * 180 + 20 : Math.random() * 5 + 1.01).toFixed(2));
  }
  
  if (name.includes('plinko')) {
    // Plinko: 1.1x to 1000x
    const options = [1.1, 1.5, 2, 4, 9, 15, 33, 110, 1000];
    const weights = [30, 25, 20, 12, 7, 4, 1.5, 0.4, 0.1]; // weighted distribution
    let r = Math.random() * 100;
    let sum = 0;
    for (let i = 0; i < options.length; i++) {
      sum += weights[i];
      if (r <= sum) return options[i];
    }
    return 2;
  }
  
  if (name.includes('keno')) {
    // Keno: 1.5x to 1000x (rarely 10000x)
    const isMega = Math.random() > 0.98;
    return Number((isMega ? Math.random() * 9000 + 1000 : Math.random() * 100 + 1.5).toFixed(2));
  }
  
  // Slots and general games
  const isMegaWin = Math.random() > 0.97;
  if (isMegaWin) {
    return Number((Math.random() * 4800 + 200).toFixed(2)); // up to 5000x
  }
  return Number((Math.random() * 48 + 2).toFixed(2)); // standard slot wins 2x - 50x
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
  
  // Realistic simulated bet amounts ($0.10 to $100.00)
  const betAmountRaw = Math.random() > 0.8
    ? Math.floor(Math.random() * 90 + 10) // 20% higher bets ($10 to $100)
    : Number((Math.random() * 9.8 + 0.2).toFixed(2)); // 80% lower bets ($0.20 to $10)
  
  // Realistic oyuna özel çarpanlar
  const multiplierRaw = getRealisticMultiplier(game.type, game.name);
  
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

export default React.memo(function LiveWinsTicker({ guestTheme = "retro" }: { guestTheme?: "retro" | "luxury" }) {
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
      <div className="w-full relative flex flex-col bg-[#0A0C10] border border-white/5 shadow-[0_4px_20px_rgba(0,0,0,0.4)] rounded-xl overflow-hidden py-3 mt-1">
        
        {/* BC Game Style Header Row (Side by side) */}
        <div className="w-full flex items-center justify-start gap-3 md:gap-5 px-3 md:px-5 mb-3">
          <div className="flex items-center gap-2">
            {/* BC Game Style Static Dot */}
            <div className="flex items-center justify-center h-[10px] w-[10px] rounded-full bg-[#00E5FF]/20 border border-[#00E5FF]/50 shadow-[0_0_10px_rgba(0,229,255,0.6)]">
              <span className="h-[4px] w-[4px] rounded-full bg-[#00E5FF] shadow-[0_0_5px_#00E5FF]"></span>
            </div>
            <h2 className="text-white text-[12px] md:text-[14px] font-black tracking-wide drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">Son Zamanlardaki Büyük Kazançlar</h2>
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
                className="flex-shrink-0 flex flex-col items-start cursor-pointer w-[65px] md:w-[80px] group transition-all duration-300 hover:-translate-y-1"
              >
                {/* Game Cover */}
                <div className="w-full aspect-square rounded-xl overflow-hidden mb-2 bg-[#0A0C10] border border-white/5 shadow-[0_4px_10px_rgba(0,0,0,0.5)] group-hover:border-[#00E5FF]/50 group-hover:shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-all duration-300 relative" style={{ transform: 'translate3d(0,0,0)', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
                   <div className="absolute inset-0 bg-[#00E5FF]/0 group-hover:bg-[#00E5FF]/10 transition-colors z-10 pointer-events-none"></div>
                   <img src={win.image} alt={win.game} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" style={{ transform: 'translate3d(0,0,0)', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', willChange: 'transform' }} />
                </div>
                {/* User Info */}
                <div className="flex items-center gap-1 w-full text-slate-400 mb-0.5 px-0.5 group-hover:text-white transition-colors duration-300">
                   <svg className="w-[10px] h-[10px] flex-shrink-0 text-slate-500 group-hover:text-[#00E5FF] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                   <span className="font-semibold text-[10px] md:text-[11px] truncate tracking-wide">{win.user}</span>
                </div>
                {/* Payout */}
                <span className="text-[#00E5FF] font-black text-[11px] md:text-[12px] tracking-wider px-0.5 drop-shadow-[0_0_5px_rgba(0,230,118,0.4)] group-hover:drop-shadow-[0_0_8px_rgba(0,230,118,0.6)] transition-all">{win.payout}</span>
              </div>
            ))}
            
            {/* Second Set for Seamless Loop */}
            {wins.map((win) => (
              <div 
                key={`${win.id}-dup`}
                onClick={() => setSelectedWin(win)}
                className="flex-shrink-0 flex flex-col items-start cursor-pointer w-[65px] md:w-[80px] group transition-all duration-300 hover:-translate-y-1"
              >
                {/* Game Cover */}
                <div className="w-full aspect-square rounded-xl overflow-hidden mb-2 bg-[#0A0C10] border border-white/5 shadow-[0_4px_10px_rgba(0,0,0,0.5)] group-hover:border-[#00E5FF]/50 group-hover:shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-all duration-300 relative" style={{ transform: 'translate3d(0,0,0)', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
                   <div className="absolute inset-0 bg-[#00E5FF]/0 group-hover:bg-[#00E5FF]/10 transition-colors z-10 pointer-events-none"></div>
                   <img src={win.image} alt={win.game} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" style={{ transform: 'translate3d(0,0,0)', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', willChange: 'transform' }} />
                </div>
                {/* User Info */}
                <div className="flex items-center gap-1 w-full text-slate-400 mb-0.5 px-0.5 group-hover:text-white transition-colors duration-300">
                   <svg className="w-[10px] h-[10px] flex-shrink-0 text-slate-500 group-hover:text-[#00E5FF] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                   <span className="font-semibold text-[10px] md:text-[11px] truncate tracking-wide">{win.user}</span>
                </div>
                {/* Payout */}
                <span className="text-[#00E5FF] font-black text-[11px] md:text-[12px] tracking-wider px-0.5 drop-shadow-[0_0_5px_rgba(0,230,118,0.4)] group-hover:drop-shadow-[0_0_8px_rgba(0,230,118,0.6)] transition-all">{win.payout}</span>
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
});
