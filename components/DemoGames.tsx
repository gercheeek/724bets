import React, { useState } from 'react';
import { Play, AlertTriangle } from 'lucide-react';

interface Game {
  id: string;
  name: string;
  symbol: string;
  image: string;
}

const GAMES: Game[] = [
  {
    id: 'olympus',
    name: 'Gates of Olympus',
    symbol: 'vs20olympgate',
    image: 'https://images.unsplash.com/photo-1608889175123-8ec330b86f84?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: 'bonanza',
    name: 'Sweet Bonanza',
    symbol: 'vs20sweetbonanza',
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: 'sugarrush',
    name: 'Sugar Rush',
    symbol: 'vs20sugarrush',
    image: 'https://images.unsplash.com/photo-1534080391025-097b03b2af3f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: 'starlight',
    name: 'Starlight Princess',
    symbol: 'vs20starlight',
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: 'bigbass',
    name: 'Big Bass Bonanza',
    symbol: 'vs10bbbonanza',
    image: 'https://images.unsplash.com/photo-1517462964-21fdcec3f25b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  }
];

const DemoGames: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<Game>(GAMES[0]);
  const [loading, setLoading] = useState(true);

  const handleGameSelect = (game: Game) => {
    setLoading(true);
    setSelectedGame(game);
  };

  const iframeSrc = `https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?lang=tr&cur=TRY&gameSymbol=${selectedGame.symbol}&jurisdiction=99&lobbyUrl=https://724bahis.net`;

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 flex flex-col items-center relative">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-[#F5A623]/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Page Title */}
      <div className="text-center mb-10 relative z-10">
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#F5C963] via-[#F5A623] to-[#D48E1A] uppercase italic drop-shadow-[0_0_15px_rgba(245,166,35,0.5)]">
          Demo Casino Oyunları
        </h1>
        <p className="text-[#F5C963]/80 text-sm md:text-base mt-3 max-w-lg mx-auto font-bold tracking-wide">
          Kayıt olmadan, para yatırmadan Pragmatic Play'in en popüler oyunlarını anında deneyimleyin!
        </p>
      </div>

      {/* Game Selector Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 w-full mb-10 relative z-10">
        {GAMES.map((game) => {
          const isSelected = selectedGame.id === game.id;
          return (
            <button
              key={game.id}
              onClick={() => handleGameSelect(game)}
              className={`relative overflow-hidden rounded-lg border-2 aspect-[4/3] group transition-all duration-300 flex flex-col justify-end p-3 ${
                isSelected
                  ? 'border-[#F5A623] shadow-[0_0_20px_rgba(245,166,35,0.4)] scale-[1.05] z-10'
                  : 'border-zinc-800/80 hover:border-[#F5A623]/50 bg-zinc-900/40 opacity-80 hover:opacity-100 hover:shadow-[0_0_15px_rgba(245,166,35,0.2)]'
              }`}
            >
              {/* Background Tint */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
              
              {/* Game Poster Image */}
              <div 
                className={`absolute inset-0 bg-cover bg-center transition-transform duration-700 ${isSelected ? 'scale-110' : 'group-hover:scale-110'}`}
                style={{ 
                  backgroundImage: `url(${game.image})`,
                  backgroundColor: '#18181b'
                }}
              />

              {/* Game Details */}
              <div className="relative z-20 w-full flex flex-col text-left">
                <span className={`text-[9px] uppercase font-black tracking-[0.2em] ${isSelected ? 'text-[#F5A623] drop-shadow-md' : 'text-slate-400'}`}>
                  Pragmatic Play
                </span>
                <span className={`text-sm md:text-base font-black truncate drop-shadow-lg ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                  {game.name}
                </span>
              </div>

              {/* Play Badge */}
              <div className={`absolute top-2 right-2 p-2 rounded-full z-20 transition-all duration-300 shadow-lg ${
                isSelected ? 'bg-[#F5A623] text-black scale-100' : 'bg-black/80 text-[#F5A623] opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100'
              }`}>
                <Play size={12} fill="currentColor" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Game Window Container */}
      <div className="w-full relative rounded-lg overflow-hidden bg-zinc-950 shadow-[0_0_40px_rgba(0,0,0,0.8)] border border-white/5 flex flex-col z-10 group">
        {/* Animated Neon Border */}
        <div className="absolute -inset-[1px] bg-gradient-to-r from-[#F5A623]/0 via-[#F5A623]/50 to-[#F5A623]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-sm pointer-events-none z-0" />
        
        {/* Top bar of game container */}
        <div className="bg-[#0f1115]/90 backdrop-blur-md border-b border-white/10 px-5 py-3 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <span className="w-3 h-3 rounded-full bg-green-500/80" />
            <span className="text-xs font-bold text-slate-400 ml-2 tracking-wide uppercase">
              {selectedGame.name} (Demo Modu)
            </span>
          </div>
          <div className="flex items-center justify-center gap-2 py-2 px-4 bg-gradient-to-r from-[#F5A623]/10 via-[#F5A623]/5 to-[#F5A623]/10 border-b border-[#F5A623]/20 rounded">
            <div className="w-2 h-2 rounded-full bg-[#F5A623] animate-pulse shadow-[0_0_8px_rgba(245,166,35,0.5)]" />
            <span className="text-[11px] font-bold text-[#F5A623] uppercase tracking-widest">
              Demo Mod: Sanal Bakiye ile Oynuyorsunuz
            </span>
            <div className="w-2 h-2 rounded-full bg-[#F5A623] animate-pulse shadow-[0_0_8px_rgba(245,166,35,0.5)]" />
          </div>
        </div>

        {/* The Game Iframe */}
        <div className="relative w-full aspect-video min-height-[400px] md:min-height-[600px] bg-black">
        <div className="w-full h-full">
          <iframe
            key={iframeSrc}
            src={iframeSrc}
            onLoad={() => setLoading(false)}
            frameBorder="0"
            width="100%"
            height="100%"
            allowFullScreen
            scrolling="no"
            className="absolute inset-0"
            title={`${selectedGame.name} Demo`}
          />
        </div>
        </div>

        {/* Iframe Warning Text */}
        <div className="bg-zinc-900/60 p-4 border-t border-zinc-800/80 flex items-center justify-center gap-3">
          <AlertTriangle className="w-5 h-5 text-[#F5A623] flex-shrink-0 animate-pulse" />
          <p className="text-xs md:text-sm font-bold text-[#F5A623]/90 tracking-wide text-center">
            Bu bir demo / deneme oyunudur. Gerçek para içermez ve kazançlar gerçek paraya dönüştürülemez.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DemoGames;
