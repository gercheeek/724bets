import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Flame, Trophy, Target } from 'lucide-react';
import { CasinoLobbyGame } from '../types';

interface GameItem {
  id: string;
  title: string;
  image: string;
  players?: number;
}

const slotGames: GameItem[] = [
  { id: 's1', title: 'SUGAR RUSH SUPER SCATTER', image: 'https://picsum.photos/seed/slot1/300/400', players: 375 },
  { id: 's2', title: 'GATES OF OLYMPUS SUPER SCATTER', image: 'https://picsum.photos/seed/slot2/300/400', players: 632 },
  { id: 's3', title: 'WANTED DEAD OR A WILD', image: 'https://picsum.photos/seed/slot3/300/400', players: 320 },
  { id: 's4', title: 'SWEET BONANZA 1000', image: 'https://picsum.photos/seed/slot4/300/400', players: 610 },
  { id: 's5', title: 'SUGAR RUSH 1000', image: 'https://picsum.photos/seed/slot5/300/400', players: 621 },
  { id: 's6', title: 'LE BANDIT', image: 'https://picsum.photos/seed/slot6/300/400', players: 226 },
  { id: 's7', title: 'GATES OF OLYMPUS 1000', image: 'https://picsum.photos/seed/slot7/300/400', players: 625 },
  { id: 's8', title: 'LE FISHERMAN', image: 'https://picsum.photos/seed/slot8/300/400', players: 188 },
];

const sportGames: GameItem[] = [
  { id: 'sp1', title: 'FOOTBALL', image: 'https://picsum.photos/seed/sp1/300/400' },
  { id: 'sp2', title: 'BASKETBALL', image: 'https://picsum.photos/seed/sp2/300/400' },
  { id: 'sp3', title: 'BASEBALL', image: 'https://picsum.photos/seed/sp3/300/400' },
  { id: 'sp4', title: 'HOCKEY', image: 'https://picsum.photos/seed/sp4/300/400' },
  { id: 'sp5', title: 'VOLLEYBALL', image: 'https://picsum.photos/seed/sp5/300/400' },
  { id: 'sp6', title: 'NFL', image: 'https://picsum.photos/seed/sp6/300/400' },
  { id: 'sp7', title: 'E-SPORTS', image: 'https://picsum.photos/seed/sp7/300/400' },
  { id: 'sp8', title: 'BADMINTON', image: 'https://picsum.photos/seed/sp8/300/400' },
];

const liveCasinoGames: GameItem[] = [
  { id: 'c1', title: 'LIVE ROULETTE', image: 'https://picsum.photos/seed/casino1/300/400', players: 1205 },
  { id: 'c2', title: 'GOLD BLACKJACK', image: 'https://picsum.photos/seed/casino2/300/400', players: 850 },
  { id: 'c3', title: 'SWEET BONANZA CANDYLAND', image: 'https://picsum.photos/seed/casino3/300/400', players: 2341 },
  { id: 'c4', title: 'BACCARAT', image: 'https://picsum.photos/seed/casino6/300/400', players: 540 },
  { id: 'c5', title: 'CRAZY TIME', image: 'https://picsum.photos/seed/casino4/300/400', players: 4100 },
  { id: 'c6', title: 'MONOPOLY LIVE', image: 'https://picsum.photos/seed/casino5/300/400', players: 1800 },
  { id: 'c7', title: 'MEGA WHEEL', image: 'https://picsum.photos/seed/casino7/300/400', players: 900 },
  { id: 'c8', title: 'CASINO HOLDEM', image: 'https://picsum.photos/seed/casino8/300/400', players: 300 },
];

const bigWins = [
  { id: 'w1', user: 'Wynn3658', amount: '6,4 Mn TRY', game: 'https://picsum.photos/seed/w1/200/300' },
  { id: 'w2', user: 'Gizli', amount: '2 Mn TRY', game: 'https://picsum.photos/seed/w2/200/300' },
  { id: 'w3', user: 'Gizli', amount: '48,1 B USDT', game: 'https://picsum.photos/seed/w3/200/300' },
  { id: 'w4', user: 'Gizli', amount: '1,2 BTC', game: 'https://picsum.photos/seed/w4/200/300' },
  { id: 'w5', user: 'Gizli', amount: '48,7 B USDT', game: 'https://picsum.photos/seed/w5/200/300' },
  { id: 'w6', user: 'Gizli', amount: '78,6 B USDT', game: 'https://picsum.photos/seed/w6/200/300' },
  { id: 'w7', user: 'Gizli', amount: '3,2 BTC', game: 'https://picsum.photos/seed/w7/200/300' },
  { id: 'w8', user: 'Finley1652', amount: '322 B USDT', game: 'https://picsum.photos/seed/w8/200/300' },
  { id: 'w9', user: 'Rowan2', amount: '56,7 B USDT', game: 'https://picsum.photos/seed/w9/200/300' },
];

interface BlockProps {
  title: string;
  icon: React.ReactNode;
  games: GameItem[];
  showPlayers?: boolean;
}

const GameBlock: React.FC<BlockProps> = ({ title, icon, games, showPlayers }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="mb-10 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-white text-lg md:text-xl font-bold">{title}</h2>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => scroll('left')} className="w-8 h-8 rounded-md bg-[#2A2D35] hover:bg-[#3A3D45] flex items-center justify-center transition-colors">
            <ChevronLeft className="w-5 h-5 text-gray-400" />
          </button>
          <button className="px-3 h-8 rounded-md bg-[#2A2D35] hover:bg-[#3A3D45] flex items-center justify-center transition-colors text-[13px] font-bold text-gray-300">
            Hepsi
          </button>
          <button onClick={() => scroll('right')} className="w-8 h-8 rounded-md bg-[#2A2D35] hover:bg-[#3A3D45] flex items-center justify-center transition-colors">
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Grid / Slider Container */}
      <div 
        ref={scrollRef}
        className="overflow-x-auto hide-scrollbar -mx-2 px-2"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        <div className="flex gap-3 min-w-max pb-4">
          {games.map((game) => (
            <div key={game.id} className="flex flex-col gap-2 group cursor-pointer" style={{ width: 'calc(100vw / 2.5 - 12px)', maxWidth: '170px', scrollSnapAlign: 'start' }}>
              <div className="casino-card-wrapper relative rounded-xl overflow-hidden aspect-[3/4] bg-zinc-900 shadow-md group-hover:shadow-[0_8px_20px_rgba(0,0,0,0.5)] transition-all duration-300 group-hover:-translate-y-1">
                <img 
                  src={game.image} 
                  alt={game.title}
                  className="absolute inset-0 !w-full !h-full !object-cover !object-center block"
                />
              </div>
              {showPlayers && game.players && (
                <div className="flex items-center justify-center gap-1.5 mt-1">
                  <div className="w-2 h-2 rounded-full bg-[#00FFA3] shadow-[0_0_8px_rgba(0,255,163,0.6)]"></div>
                  <span className="text-gray-400 text-[11px] font-medium"><span className="text-white font-bold">{game.players}</span> Oyuncular</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};



interface GameLobbyGridProps {
  customGames?: CasinoLobbyGame[];
}

const GameLobbyGrid: React.FC<GameLobbyGridProps> = ({ customGames = [] }) => {
  const activeCustomGames = customGames.filter(g => g.isActive);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick(prev => prev + 1);
    }, 2000); // Daha sık güncellenmesi için 2 saniyede bir
    return () => clearInterval(interval);
  }, []);

  const getDynamicPlayers = (gameId: string) => {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const timeFraction = (hour + minute / 60) / 24;

    // Gece 22:00 zirve, Gündüz 10:00 dip noktası olsun.
    const peakFraction = 22 / 24;
    const timeFactor = Math.cos(2 * Math.PI * (timeFraction - peakFraction)); // -1 ile 1 arası
    const timeMultiplier = (timeFactor + 1) / 2; // 0 ile 1 arası

    // Oyunlara özel sabit bir sayı varyasyonu (seed ile)
    let seed = 0;
    for (let i = 0; i < gameId.length; i++) {
      seed += gameId.charCodeAt(i);
    }
    const gameVariation = (seed % 61) - 30; // -30 ile +30 arası

    // Her saniye değiştiğini hissettirmek için birden fazla sinüs dalgası
    // tick değeri saniyede bir veya belirlenen interval'da artıyor.
    const fluctuation = Math.sin((tick * 1.3) + seed) * 12 + Math.cos((tick * 0.8) + seed * 2) * 8; 

    // Gündüzleri daha az, geceleri daha fazla:
    // Minimum 140, Maksimum 350 olacak şekilde base ayarlıyoruz.
    const basePlayers = 150 + timeMultiplier * 180; // 150 ile 330 arası değişir

    let finalPlayers = Math.round(basePlayers + gameVariation + fluctuation);

    // Kesin sınırlar: En az 120, En fazla 370
    if (finalPlayers < 120) finalPlayers = 120;
    if (finalPlayers > 370) finalPlayers = 370;

    return finalPlayers;
  };

  // Mix custom slots if provided, else use default visual data
  const slots = activeCustomGames.length > 0
    ? activeCustomGames.filter(g => g.type === 'slot').map((g, idx) => ({
        id: g.id,
        title: g.name.toUpperCase(),
        image: g.image || 'https://picsum.photos/seed/' + g.id + '/400/300',
        players: getDynamicPlayers(g.id),
      }))
    : slotGames.map(g => ({
        ...g,
        players: getDynamicPlayers(g.id)
      }));

  const sports = activeCustomGames.filter(g => g.type === 'sport').length > 0
    ? activeCustomGames.filter(g => g.type === 'sport').map((g) => ({
        id: g.id,
        title: g.name.toUpperCase(),
        image: g.image || 'https://picsum.photos/seed/' + g.id + '/400/300',
      }))
    : sportGames;

  const live = activeCustomGames.filter(g => g.type === 'live').length > 0
    ? activeCustomGames.filter(g => g.type === 'live').map((g, idx) => ({
        id: g.id,
        title: g.name.toUpperCase(),
        image: g.image || 'https://picsum.photos/seed/' + g.id + '/400/300',
        players: getDynamicPlayers(g.id),
      }))
    : liveCasinoGames.map(g => ({
        ...g,
        players: getDynamicPlayers(g.id)
      }));

  return (
    <div className="w-full bg-transparent p-0 my-8">
      {/* 1. Popüler Oyunlar */}
      <GameBlock 
        title="Popüler Oyunlar" 
        icon={<Flame className="w-5 h-5 text-white" fill="white" />} 
        games={slots} 
        showPlayers={true}
      />
      
      {/* 2. Popüler Sporlar */}
      <GameBlock 
        title="Popüler Sporlar" 
        icon={<Target className="w-5 h-5 text-white" />} 
        games={sports} 
        showPlayers={false}
      />
      
      {/* 3. Canlı Casino */}
      <GameBlock 
        title="Canlı Casino" 
        icon={<span className="w-4 h-4 rounded-full bg-[#00E676] animate-pulse inline-block" />} 
        games={live} 
        showPlayers={true}
      />


    </div>
  );
};

export default GameLobbyGrid;
