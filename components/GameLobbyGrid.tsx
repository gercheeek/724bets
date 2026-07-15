import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, Flame, Trophy, Target, Video, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
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
  { id: 'sp1', title: 'FOOTBALL', image: '/images/sports_football.jpg' },
  { id: 'sp2', title: 'BASKETBALL', image: '/images/sports_basketball.jpg' },
  { id: 'sp3', title: 'BASEBALL', image: '/images/sports_baseball.jpg' },
  { id: 'sp4', title: 'HOCKEY', image: '/images/sports_hockey.jpg' },
  { id: 'sp5', title: 'VOLLEYBALL', image: '/images/sports_volleyball.jpg' },
  { id: 'sp6', title: 'NFL', image: '/images/sports_nfl.jpg' },
  { id: 'sp7', title: 'E-SPORTS', image: '/images/sports_esports.jpg' },
  { id: 'sp8', title: 'BADMINTON', image: '/images/sports_badminton.jpg' },
];

const liveCasinoGames: GameItem[] = ALL_GAMES.filter(g => g.category === 'live').map(g => ({
  id: g.id.toString(),
  title: g.name.toUpperCase(),
  image: g.image,
  players: g.players
})).slice(0, 16);

interface BlockProps {
  title: string;
  icon: React.ReactNode;
  games: GameItem[];
  showPlayers?: boolean;
  isSports?: boolean;
  onGameClick?: (game: GameItem) => void;
}

const GameBlock: React.FC<BlockProps> = ({ title, icon, games, showPlayers, isSports, onGameClick }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

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
            {t('view_all')}
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
        <div className="flex gap-3 md:gap-4 min-w-max pb-4 pt-2">
          {games.map((game) => (
            <div key={game.id} onClick={() => onGameClick?.(game)} className="flex flex-col gap-2 cursor-pointer relative" style={{ width: 'calc(100vw / 2.5 - 12px)', maxWidth: '170px', scrollSnapAlign: 'start' }}>
              
              <div className="relative group w-full h-full">
                <div 
                  className="absolute -inset-1 rounded-[1.5rem] bg-cover bg-center opacity-0 group-hover:opacity-75 transition-opacity duration-500 z-0 scale-95 translate-y-2 pointer-events-none"
                  style={{ backgroundImage: `url(${game.image})`, filter: 'blur(20px) saturate(150%) brightness(1.2)' }}
                ></div>
                
                <div className="casino-card-wrapper relative rounded-xl overflow-hidden aspect-[3/4] bg-[#111317] z-10 transition-transform duration-300 group-hover:-translate-y-1">
                  <img 
                    src={game.image} 
                    alt={game.title}
                    className="absolute inset-0 !w-full !h-full !object-cover !object-center block transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </div>

              {!isSports && showPlayers && game.players && (
                <div className="flex items-center justify-center gap-1.5 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-[#00FFA3] shadow-[0_0_8px_rgba(0,255,163,0.6)]"></div>
                  <span className="text-gray-400 text-[10px] md:text-[11px] font-medium"><span className="text-white font-bold">{game.players}</span> {t('players')}</span>
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
  const { t } = useLanguage();

  const getDemoUrl = (game: GameItem | null): string | null => {
    if (!game) return null;
    const nameString = (game.title || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    let symbol = null;
    if (nameString.includes('sweetbonanza')) symbol = 'vs20sweetbonanza';
    else if (nameString.includes('gatesofolympus')) symbol = 'vs20olympgate';
    else if (nameString.includes('sugarrush')) symbol = 'vs20sugarrush';
    else if (nameString.includes('starlightprincess')) symbol = 'vs20starlight';
    else if (nameString.includes('bigbass')) symbol = 'vs10bbbonanza';
    if (!symbol) return null;
    return `https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?lang=tr&cur=TRY&gameSymbol=${symbol}&jurisdiction=99&lobbyUrl=https://724bahis.net`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTick(prev => prev + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const getDynamicPlayers = (gameId: string) => {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const timeFraction = (hour + minute / 60) / 24;
    const peakFraction = 22 / 24;
    const timeFactor = Math.cos(2 * Math.PI * (timeFraction - peakFraction));
    const timeMultiplier = (timeFactor + 1) / 2;
    let seed = 0;
    for (let i = 0; i < gameId.length; i++) { seed += gameId.charCodeAt(i); }
    const gameVariation = (seed % 61) - 30;
    const fluctuation = Math.sin((tick * 1.3) + seed) * 12 + Math.cos((tick * 0.8) + seed * 2) * 8; 
    const basePlayers = 150 + timeMultiplier * 180;
    let finalPlayers = Math.round(basePlayers + gameVariation + fluctuation);
    if (finalPlayers < 120) finalPlayers = 120;
    if (finalPlayers > 370) finalPlayers = 370;
    return finalPlayers;
  };

  const slots = activeCustomGames.length > 0
    ? activeCustomGames.filter(g => g.type === 'slot').map((g) => ({
        id: g.id,
        title: g.name.toUpperCase(),
        image: g.image || 'https://picsum.photos/seed/' + g.id + '/400/300',
        players: getDynamicPlayers(g.id),
      }))
    : slotGames.map(g => ({ ...g, players: getDynamicPlayers(g.id) }));

  const sports = activeCustomGames.filter(g => g.type === 'sport').length > 0
    ? activeCustomGames.filter(g => g.type === 'sport').map((g) => ({
        id: g.id,
        title: g.name.toUpperCase(),
        image: g.image || 'https://picsum.photos/seed/' + g.id + '/400/300',
      }))
    : sportGames;

  const live = activeCustomGames.filter(g => g.type === 'live').length > 0
    ? activeCustomGames.filter(g => g.type === 'live').map((g) => ({
        id: g.id,
        title: g.name.toUpperCase(),
        image: g.image || 'https://picsum.photos/seed/' + g.id + '/400/300',
        players: getDynamicPlayers(g.id),
      }))
    : liveCasinoGames.map(g => ({ ...g, players: getDynamicPlayers(g.id) }));

  return (
    <div className="w-full bg-transparent p-0 my-8">
      <GameBlock 
        title={t('popular_games')} 
        icon={<Flame className="w-5 h-5 text-white" fill="white" />} 
        games={slots} 
        showPlayers={true}
        onGameClick={(game) => setSelectedGame(game)}
      />

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
            <div className="relative w-full max-w-5xl h-[80vh] bg-black rounded-2xl overflow-hidden shadow-2xl flex flex-col">
               <div className="h-12 bg-[#1A1D29] flex items-center justify-between px-4 border-b border-white/10 flex-shrink-0">
                  <div className="flex items-center gap-2">
                     <span className="w-3 h-3 rounded-full bg-red-500"></span>
                     <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                     <span className="w-3 h-3 rounded-full bg-green-500"></span>
                     <span className="text-white font-bold ml-4">{selectedGame.title} (DEMO)</span>
                  </div>
                  <button onClick={() => setShowDemoIframe(false)} className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-red-500 hover:text-white rounded-lg transition-colors text-gray-400">
                    <X className="w-5 h-5" />
                  </button>
               </div>
               <iframe 
                 src={getDemoUrl(selectedGame)!}
                 className="w-full flex-1 border-0"
                 allowFullScreen
                 title={selectedGame.title || 'Demo Game'}
               />
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

                <div className="w-full flex flex-col gap-3">
                  <button 
                     onClick={() => window.dispatchEvent(new CustomEvent('openLoginModal'))}
                     className="w-full flex items-center justify-center gap-2 bg-[#00FFA3] hover:bg-[#00E676] text-black font-black py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(0,255,163,0.3)] uppercase tracking-wider text-sm"
                  >
                     <Flame className="w-4 h-4" />
                     {t('play_real_money')}
                  </button>
                  
                  {getDemoUrl(selectedGame) && (
                     <button 
                       onClick={() => setShowDemoIframe(true)}
                       className="w-full bg-[#1F2331] hover:bg-[#2A2E3D] border border-[#2A2E3D] text-white font-bold py-3.5 rounded-xl transition-colors text-sm"
                     >
                       {t('play_demo')}
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
