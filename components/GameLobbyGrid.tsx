import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, Flame, Trophy, Target, Video } from 'lucide-react';
import { CasinoLobbyGame } from '../types';
import { ALL_GAMES } from '../data/games';

interface GameItem {
  id: string;
  title: string;
  image: string;
  players?: number;
}

const slotGames: GameItem[] = ALL_GAMES.filter(g => g.category === 'slots' || g.category === 'new').map(g => ({
  id: g.id.toString(),
  title: g.name.toUpperCase(),
  image: g.image,
  players: g.players
})).slice(0, 16);

const sportGames: GameItem[] = [
  { id: 'sp1', title: 'FOOTBALL', image: '/games/game_9.jpg' },
  { id: 'sp2', title: 'BASKETBALL', image: '/games/game_10.jpg' },
  { id: 'sp3', title: 'BASEBALL', image: '/games/game_11.jpg' },
  { id: 'sp4', title: 'HOCKEY', image: '/games/game_12.jpg' },
  { id: 'sp5', title: 'VOLLEYBALL', image: '/games/game_13.jpg' },
  { id: 'sp6', title: 'NFL', image: '/games/game_14.jpg' },
  { id: 'sp7', title: 'E-SPORTS', image: '/games/game_15.jpg' },
  { id: 'sp8', title: 'BADMINTON', image: '/games/game_16.jpg' },
];

const liveCasinoGames: GameItem[] = ALL_GAMES.filter(g => g.category === 'live').map(g => ({
  id: g.id.toString(),
  title: g.name.toUpperCase(),
  image: g.image,
  players: g.players
})).slice(0, 16);

const bigWins = [
  { id: 'w1', user: 'Wynn3658', amount: '6,4 Mn TRY', game: '/games/game_25.jpg' },
  { id: 'w2', user: 'Gizli', amount: '2 Mn TRY', game: '/games/game_26.jpg' },
  { id: 'w3', user: 'Gizli', amount: '48,1 B USDT', game: '/games/game_27.jpg' },
  { id: 'w4', user: 'Gizli', amount: '1,2 BTC', game: '/games/game_28.jpg' },
  { id: 'w5', user: 'Gizli', amount: '48,7 B USDT', game: '/games/game_29.jpg' },
  { id: 'w6', user: 'Gizli', amount: '78,6 B USDT', game: '/games/game_30.jpg' },
  { id: 'w7', user: 'Gizli', amount: '3,2 BTC', game: '/games/game_31.jpg' },
  { id: 'w8', user: 'Finley1652', amount: '322 B USDT', game: '/games/game_32.jpg' },
  { id: 'w9', user: 'Rowan2', amount: '56,7 B USDT', game: '/games/game_33.jpg' },
];

interface BlockProps {
  title: string;
  icon: React.ReactNode;
  games: GameItem[];
  showPlayers?: boolean;
  onGameClick?: (game: GameItem) => void;
}

const GameBlock: React.FC<BlockProps> = ({ title, icon, games, showPlayers, onGameClick }) => {
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
            <div key={game.id} onClick={() => onGameClick?.(game)} className="flex flex-col gap-2 group cursor-pointer" style={{ width: 'calc(100vw / 2.5 - 12px)', maxWidth: '170px', scrollSnapAlign: 'start' }}>
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
  const [selectedGame, setSelectedGame] = useState<GameItem | null>(null);
  const [showDemoIframe, setShowDemoIframe] = useState(false);

  const getDemoUrl = (game: GameItem | null): string | null => {
    if (!game) return null;
    
    // In a real scenario, this would come from the game object directly
    // For now, we only support known Pragmatic Play demos via this public URL
    const nameString = (game.title || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    let symbol = null;
    
    if (nameString.includes('sweetbonanza')) symbol = 'vs20sweetbonanza';
    else if (nameString.includes('gatesofolympus')) symbol = 'vs20olympgate';
    else if (nameString.includes('sugarrush')) symbol = 'vs20sugarrush';
    else if (nameString.includes('starlightprincess')) symbol = 'vs20starlight';
    else if (nameString.includes('bigbass')) symbol = 'vs10bbbonanza';
    
    if (!symbol) return null; // No fallback! If we don't know it, we don't show it.
  
    return `https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?lang=tr&cur=TRY&gameSymbol=${symbol}&jurisdiction=99&lobbyUrl=https://724bahis.net`;
  };

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
      <GameBlock 
        title="Popüler Oyunlar" 
        icon={<Flame className="w-5 h-5 text-white" fill="white" />} 
        games={slots} 
        showPlayers={true}
        onGameClick={(game) => setSelectedGame(game)}
      />
      
      {/* 2. Popüler Sporlar */}
      <GameBlock 
        title="Popüler Sporlar" 
        icon={<Trophy className="w-5 h-5 text-white" />} 
        games={sports} 
        showPlayers={false}
        onGameClick={(game) => setSelectedGame(game)}
      />

      {/* 3. Canlı Casino */}
      <GameBlock 
        title="Canlı Casino" 
        icon={<Video className="w-5 h-5 text-white" />} 
        games={live} 
        showPlayers={true}
        onGameClick={(game) => setSelectedGame(game)}
      />

      {/* GAME MODAL */}
      {selectedGame && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 z-[99999] flex p-4 bg-black/90 backdrop-blur-sm overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedGame(null);
              setShowDemoIframe(false);
            }
          }}
        >
          {showDemoIframe && getDemoUrl(selectedGame) ? (
            <div className="relative m-auto z-10 w-full max-w-5xl h-[80vh] bg-[#0F121A] rounded-xl overflow-hidden shadow-2xl border border-[#2A2E3D] animate-fade-in flex flex-col">
              <div className="flex items-center justify-between p-4 bg-[#1A1D29] border-b border-[#2A2E3D]">
                <div className="flex items-center gap-3">
                   <div className="w-2.5 h-2.5 rounded-full bg-[#00FFA3] animate-pulse shadow-[0_0_10px_rgba(0,255,163,0.8)]" />
                   <span className="text-white font-bold">{selectedGame.title || 'Demo Oyunu'}</span>
                   <span className="bg-[#00FFA3]/10 text-[#00FFA3] border border-[#00FFA3]/20 text-[10px] px-2 py-0.5 rounded font-black tracking-widest uppercase ml-2">Eğlence Modu</span>
                </div>
                <button onClick={() => setShowDemoIframe(false)} className="w-8 h-8 flex items-center justify-center bg-[#2A2E3D] hover:bg-[#3A3F54] rounded-lg text-white transition-colors">✕</button>
              </div>
              <div className="flex-1 w-full bg-black relative">
                <iframe 
                  src={getDemoUrl(selectedGame)!}
                  className="absolute inset-0 w-full h-full border-0"
                  allowFullScreen
                  title={selectedGame.title || 'Demo Game'}
                />
              </div>
            </div>
          ) : (
            <div className="relative m-auto z-10 bg-[#1A1D29] rounded-2xl border border-[#2A2E3D] w-full max-w-[400px] shadow-2xl overflow-hidden animate-fade-in">
              <button onClick={() => { setSelectedGame(null); setShowDemoIframe(false); }} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-black/40 hover:bg-black/60 rounded-full text-white transition-all z-20 backdrop-blur-sm">✕</button>
              
              <div className="relative aspect-video w-full flex flex-col items-center justify-center">
                <div className="absolute inset-0 bg-[#0F121A]">
                  <img src={selectedGame.image} className="w-full h-full object-cover opacity-50" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1D29] to-transparent" />
                </div>
                
                <div className="relative z-10 w-24 h-24 mt-8 rounded-xl overflow-hidden border border-white/10 shadow-2xl">
                  <img src={selectedGame.image} className="w-full h-full object-cover" />
                </div>
              </div>

              <div className="relative z-10 px-6 pb-8 pt-4 text-center flex flex-col items-center">
                <h3 className="text-2xl font-black text-white mb-1">{selectedGame.title || 'Casino Slot'}</h3>
                <p className="text-[#00FFA3] text-sm font-bold mb-6">Pragmatic Play</p>

                <div className="w-full grid grid-cols-2 gap-3 mb-6 bg-[#0F121A] p-3 rounded-lg border border-[#2A2E3D]">
                  <div className="flex flex-col items-center">
                    <span className="text-[#848B9D] text-xs font-medium mb-1">RTP</span>
                    <span className="text-white font-mono font-bold text-sm">96.50%</span>
                  </div>
                  <div className="flex flex-col items-center border-l border-[#2A2E3D]">
                    <span className="text-[#848B9D] text-xs font-medium mb-1">Volatilite</span>
                    <span className="text-white font-bold text-sm">Yüksek</span>
                  </div>
                </div>

                <div className="w-full flex flex-col gap-3">
                  <button 
                     onClick={() => {
                        window.dispatchEvent(new CustomEvent('openLoginModal'));
                     }}
                     className="w-full flex items-center justify-center gap-2 bg-[#00FFA3] hover:bg-[#00E676] text-black font-black py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(0,255,163,0.3)] uppercase tracking-wider text-sm"
                  >
                     <Flame className="w-4 h-4" />
                     Gerçek Parayla Oyna
                  </button>
                  
                  {getDemoUrl(selectedGame) && (
                     <button 
                       onClick={() => setShowDemoIframe(true)}
                       className="w-full bg-[#1F2331] hover:bg-[#2A2E3D] border border-[#2A2E3D] text-white font-bold py-3.5 rounded-xl transition-colors text-sm"
                     >
                       Eğlencesine Oyna (Demo)
                     </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>,
        document.body
      )}
    </div>
  );
};

export default GameLobbyGrid;
