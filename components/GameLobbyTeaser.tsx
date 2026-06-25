import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';

interface Game {
  id: string;
  name: string;
  provider: string;
  image: string;
  link: string;
  badge?: string;
  badgeColor?: string;
  favorites: number;
}

const LIVE_GAMES: Game[] = [
  { id: 'bj12', name: 'Privé Lounge Blackjack 12', provider: 'Pragmatic Play Live', image: 'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', link: 'https://gamdom.com/r/724bahis', badge: 'CANLI', badgeColor: '#ef4444', favorites: 106 },
  { id: 'bj6', name: 'Privé Lounge Blackjack 6', provider: 'Pragmatic Play Live', image: 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', link: 'https://gamdom.com/r/724bahis', badge: 'CANLI', badgeColor: '#ef4444', favorites: 66 },
  { id: 'vipr', name: 'VIP Roulette', provider: 'Evolution', image: 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', link: 'https://gamdom.com/r/724bahis', badge: 'CANLI', badgeColor: '#ef4444', favorites: 38 },
  { id: 'megar', name: 'Mega Roulette', provider: 'Pragmatic Play Live', image: 'https://images.unsplash.com/photo-1610484795325-1e0f6c2438c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', link: 'https://gamdom.com/r/724bahis', badge: 'CANLI', badgeColor: '#ef4444', favorites: 2451 },
  { id: 'bac1', name: 'Baccarat 1', provider: 'Pragmatic Play Live', image: 'https://images.unsplash.com/photo-1605870445919-838d190e8e1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', link: 'https://gamdom.com/r/724bahis', badge: 'CANLI', badgeColor: '#ef4444', favorites: 176 },
  { id: 'gbj1', name: 'Gamdom Privé Blackjack 1', provider: 'Pragmatic Play Live', image: 'https://images.unsplash.com/photo-1652361665403-125c1103c155?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', link: 'https://gamdom.com/r/724bahis', badge: 'ÖZEL', badgeColor: '#a855f7', favorites: 115 },
];

const CASINO_GAMES: Game[] = [
  { id: 'lefish', name: 'Le Fisherman', provider: 'Hacksaw Gaming', image: 'https://images.unsplash.com/photo-1599839619722-39751411ea63?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', link: 'https://gamdom.com/r/724bahis', favorites: 2443 },
  { id: 'hotf', name: 'Hot Fiesta', provider: 'Pragmatic Play', image: 'https://images.unsplash.com/photo-1579547945413-497e1b99ce46?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', link: 'https://gamdom.com/r/724bahis', favorites: 4014 },
  { id: 'neon', name: "N3ON'S SWEET WORLD", provider: 'Ludoland', image: 'https://images.unsplash.com/photo-1614314115160-c36399c54625?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', link: 'https://gamdom.com/r/724bahis', badge: 'ÖZEL', badgeColor: '#a855f7', favorites: 459 },
  { id: 'munch', name: 'Munchies', provider: 'Nolimit City', image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', link: 'https://gamdom.com/r/724bahis', favorites: 339 },
  { id: 'leather', name: 'Leatherheads', provider: 'Kitsune Studios', image: 'https://images.unsplash.com/photo-1508344928928-7165b67de128?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', link: 'https://gamdom.com/r/724bahis', badge: 'ERKEN ÇIKIŞ', badgeColor: '#f97316', favorites: 195 },
  { id: 'clash', name: 'Clash of Gods', provider: 'BGaming', image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', link: 'https://gamdom.com/r/724bahis', favorites: 314 },
];

interface GameLobbyTeaserProps {
  onViewChange?: (view: any) => void;
  onPlayGame?: (gameId: string) => void;
}

const GameLobbyTeaser: React.FC<GameLobbyTeaserProps> = ({ onViewChange, onPlayGame }) => {
  const liveScrollRef = useRef<HTMLDivElement>(null);
  const casinoScrollRef = useRef<HTMLDivElement>(null);

  const scroll = (ref: React.RefObject<HTMLDivElement>, direction: 'left' | 'right') => {
    if (ref.current) {
      ref.current.scrollBy({ left: direction === 'left' ? -400 : 400, behavior: 'smooth' });
    }
  };

  const GameCard = ({ game }: { game: Game }) => (
    <a
      href={game.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl bg-[#141822] transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50"
      style={{ width: '180px', height: '240px', textDecoration: 'none' }}
    >
      {/* Background Image */}
      <img
        src={game.image}
        alt={game.name}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      
      {/* Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
      
      {/* Badges */}
      <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
        {game.badge ? (
          <span
            className="rounded px-2 py-0.5 text-[10px] font-bold text-white shadow-sm"
            style={{ backgroundColor: game.badgeColor }}
          >
            {game.badge}
          </span>
        ) : (
          <span /> // Spacer
        )}
        <div className="flex items-center gap-1 rounded-full bg-black/40 px-2 py-1 backdrop-blur-md">
          <Heart className="h-3 w-3 fill-white text-white" />
          <span className="text-[10px] font-medium text-white">{game.favorites}</span>
        </div>
      </div>

      {/* Info */}
      <div className="absolute bottom-3 left-3 right-3">
        <h3 className="line-clamp-2 text-sm font-bold leading-tight text-white">{game.name}</h3>
        <p className="mt-1 truncate text-[11px] text-zinc-400">{game.provider}</p>
      </div>

      {/* Hover Overlay Play Icon */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 shadow-lg shadow-green-500/30">
          <svg className="ml-1 h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
    </a>
  );

  const GameSection = ({ 
    title, 
    iconColor, 
    games, 
    scrollRef 
  }: { 
    title: string; 
    iconColor: string; 
    games: Game[]; 
    scrollRef: React.RefObject<HTMLDivElement>;
  }) => (
    <div className="mb-8">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full shadow-sm" style={{ backgroundColor: iconColor, boxShadow: `0 0 10px ${iconColor}` }} />
          <h2 className="text-xl font-black tracking-tight text-white">{title}</h2>
        </div>
        
        <div className="flex items-center gap-2">
          <a href="https://gamdom.com/r/724bahis" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-zinc-400 transition-colors hover:text-white">
            Tümünü görüntüle
          </a>
          <div className="flex gap-1">
            <button
              onClick={() => scroll(scrollRef, 'left')}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-white backdrop-blur-sm transition-colors hover:bg-white/10"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scroll(scrollRef, 'right')}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-white backdrop-blur-sm transition-colors hover:bg-white/10"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid / Slider */}
      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 pt-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style>{`.flex::-webkit-scrollbar { display: none; }`}</style>
        {games.map(game => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-full font-['Inter']">
      <GameSection 
        title="Canlı Oyunlar" 
        iconColor="#ef4444" 
        games={LIVE_GAMES} 
        scrollRef={liveScrollRef} 
      />
      
      <GameSection 
        title="Kumarhane Oyunları" 
        iconColor="#eab308" 
        games={CASINO_GAMES} 
        scrollRef={casinoScrollRef} 
      />
    </div>
  );
};

export default GameLobbyTeaser;
