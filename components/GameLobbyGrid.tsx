import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';

interface GameItem {
  id: string;
  title: string;
  image: string;
  badge?: string;
  badgeColor?: 'red' | 'blue';
  provider?: string;
  limits?: string;
  isLarge?: boolean;
}

const slotGames: GameItem[] = [
  { id: 's1', title: 'BLACK LOUNGE', image: 'https://picsum.photos/seed/slot1/800/600', isLarge: true },
  { id: 's2', title: 'SUPER SANTA LINK', image: 'https://picsum.photos/seed/slot2/400/300', badge: 'PİYANGO', badgeColor: 'blue' },
  { id: 's3', title: 'GATES OF OLYMPUS', image: 'https://picsum.photos/seed/slot3/400/300', badge: 'EN İYİ', badgeColor: 'red' },
  { id: 's4', title: 'RISING RICHES', image: 'https://picsum.photos/seed/slot4/400/300', badge: 'PİYANGO', badgeColor: 'blue' },
  { id: 's5', title: 'GATES OF OLYMPUS SCATTER', image: 'https://picsum.photos/seed/slot5/400/300', badge: 'EN İYİ', badgeColor: 'blue' },
  { id: 's6', title: 'GATES OF BAHİSBEY 1000', image: 'https://picsum.photos/seed/slot6/400/300', badge: 'EN İYİ', badgeColor: 'blue' },
  { id: 's7', title: '40 BURNING HOT', image: 'https://picsum.photos/seed/slot7/400/300', badge: 'EN İYİ', badgeColor: 'red' },
  { id: 's8', title: 'SWEET BONANZA', image: 'https://picsum.photos/seed/slot8/400/300', badge: 'EN İYİ', badgeColor: 'blue' },
  { id: 's9', title: 'GATES OF OLYMPUS 1000', image: 'https://picsum.photos/seed/slot9/400/300', badge: 'EN İYİ', badgeColor: 'red' },
];

const liveCasinoGames: GameItem[] = [
  { id: 'c1', title: 'LIVE ROULETTE', image: 'https://picsum.photos/seed/casino1/800/600', isLarge: true, limits: '10-100K TRY' },
  { id: 'c2', title: 'GOLD BLACKJACK', image: 'https://picsum.photos/seed/casino2/400/300', limits: '750-150K TRY', provider: 'imaginelive' },
  { id: 'c3', title: 'BLACKJACK', image: 'https://picsum.photos/seed/casino3/400/300', limits: '175-50K TRY', provider: 'creedroomz' },
  { id: 'c4', title: 'SWEET BONANZA CANDYLAND', image: 'https://picsum.photos/seed/casino4/400/300', limits: '4-40K TRY' },
  { id: 'c5', title: 'BLACKJACK H', image: 'https://picsum.photos/seed/casino5/400/300', limits: '175-50K TRY', provider: 'creedroomz' },
  { id: 'c6', title: 'BACCARAT', image: 'https://picsum.photos/seed/casino6/400/300', limits: '5-36K TRY', provider: 'creedroomz' },
  { id: 'c7', title: 'GOLD ROULETTE', image: 'https://picsum.photos/seed/casino7/400/300', limits: '5-36K TRY', provider: 'imaginelive' },
  { id: 'c8', title: 'BLACKJACK Q', image: 'https://picsum.photos/seed/casino8/400/300', limits: '250-50K TRY', provider: 'creedroomz' },
  { id: 'c9', title: 'ROULETTE VIP', image: 'https://picsum.photos/seed/casino9/400/300', provider: 'creedroomz' },
];

interface BlockProps {
  title: string;
  tabs: string[];
  games: GameItem[];
}

const GameBlock: React.FC<BlockProps> = ({ title, tabs, games }) => {
  const [activeTab, setActiveTab] = useState(tabs[0]);
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
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 ${
                activeTab === tab
                  ? 'bg-[#00FFA3] text-black shadow-[0_0_15px_rgba(0,255,163,0.4)]'
                  : 'bg-[#2A2D35] text-gray-300 hover:bg-[#3A3D45]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 hidden sm:flex">
          <button onClick={() => scroll('left')} className="w-8 h-8 rounded-lg bg-[#2A2D35] hover:bg-[#3A3D45] flex items-center justify-center transition-colors group">
            <ChevronLeft className="w-5 h-5 text-gray-400 group-hover:text-white" />
          </button>
          <button onClick={() => scroll('right')} className="w-8 h-8 rounded-lg bg-[#2A2D35] hover:bg-[#3A3D45] flex items-center justify-center transition-colors group">
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white" />
          </button>
        </div>
      </div>

      {/* Grid / Slider Container */}
      <div 
        ref={scrollRef}
        className="overflow-x-auto hide-scrollbar pb-4 -mx-2 px-2"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 min-w-[800px] md:min-w-full">
          {games.map((game, index) => (
            <div 
              key={game.id} 
              className={`
                relative rounded-xl overflow-hidden group cursor-pointer bg-zinc-900 border border-white/5
                ${game.isLarge ? 'col-span-2 row-span-2 h-full' : 'col-span-1 aspect-[4/3]'}
                hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all duration-300 hover:-translate-y-1
              `}
              style={{ scrollSnapAlign: 'start' }}
            >
              {/* Image */}
              <img 
                src={game.image} 
                alt={game.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Dark Overlay on Hover */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
                <div className="w-12 h-12 rounded-full bg-[#00FFA3] flex items-center justify-center translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 shadow-[0_0_20px_rgba(0,255,163,0.5)]">
                  <Play className="w-6 h-6 text-black ml-1" fill="currentColor" />
                </div>
              </div>

              {/* Top Badges */}
              {game.badge && (
                <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-md text-[9px] font-black uppercase text-white z-10 shadow-lg ${
                  game.badgeColor === 'red' ? 'bg-red-600' : 'bg-blue-600'
                }`}>
                  {game.badge}
                </div>
              )}

              {/* Provider Logo (Transparent Overlay) */}
              {game.provider && (
                <div className="absolute bottom-2 left-2 z-10 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded text-[8px] font-bold text-white/80 uppercase">
                  {game.provider}
                </div>
              )}

              {/* Limits Text */}
              {game.limits && (
                <div className="absolute bottom-0 right-0 z-10 bg-black/60 backdrop-blur-md px-2 py-1 rounded-tl-lg text-[10px] font-bold text-white">
                  {game.limits}
                </div>
              )}
              
              {/* Optional Gradient at bottom for text readability if we had titles */}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
              
              {/* Title (visible on hover or always, design choice - we will hide by default as per screenshot style which has titles baked into images mostly, but we can show it at bottom) */}
              <div className="absolute bottom-2 left-2 right-2 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
                {/* <p className="text-white text-xs font-bold truncate">{game.title}</p> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const GameLobbyGrid: React.FC = () => {
  return (
    <div className="w-full bg-[#1A1D24] rounded-2xl p-4 md:p-6 shadow-2xl border border-white/5 my-8">
      <GameBlock 
        title="Slot Oyunları" 
        tabs={['EN POPÜLER', 'Yeni Slotlar']} 
        games={slotGames} 
      />
      
      {/* Decorative divider */}
      <div className="w-full h-[1px] bg-white/5 mb-8" />
      
      <GameBlock 
        title="Canlı Casino" 
        tabs={['EN POPÜLER', 'Blackjack', 'Roulette']} 
        games={liveCasinoGames} 
      />
    </div>
  );
};

export default GameLobbyGrid;
