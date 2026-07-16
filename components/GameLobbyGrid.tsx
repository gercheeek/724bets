import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, Flame, Trophy, Target, Video, X, Play, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { CasinoLobbyGame } from '../types';
import { ALL_GAMES } from '../data/games';

interface GameItem {
  id: string;
  title: string;
  image: string;
  players?: number;
  demoSymbol?: string | null;
}

const slotGames: GameItem[] = ALL_GAMES.filter(g => g.category === 'slots' || g.category === 'new').map(g => ({
  id: g.id.toString(),
  title: g.name.toUpperCase(),
  image: g.image,
  players: g.players,
  demoSymbol: g.demoSymbol
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
  players: g.players,
  demoSymbol: g.demoSymbol
})).slice(0, 16);

const getDemoUrl = (game: GameItem | null): string | null => {
  if (!game) return null;
  if (game.demoSymbol) {
    return `https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?lang=tr&cur=TRY&gameSymbol=${game.demoSymbol}&jurisdiction=99&lobbyUrl=https://724bahis.net`;
  }
  const nameString = (game.title || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  let symbol = null;
  if (nameString.includes('sweetbonanza1000')) symbol = 'vs20sbonz1000';
  else if (nameString.includes('sweetbonanza')) symbol = 'vs20sweetbonanza';
  else if (nameString.includes('gatesofolympus')) symbol = 'vs20olympgate';
  else if (nameString.includes('sugarrush')) symbol = 'vs20sugarrush';
  else if (nameString.includes('starlightprincess')) symbol = 'vs20starlight';
  else if (nameString.includes('bigbass')) symbol = 'vs10bbbonanza';
  if (!symbol) return null;
  return `https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?lang=tr&cur=TRY&gameSymbol=${symbol}&jurisdiction=99&lobbyUrl=https://724bahis.net`;
};

interface BlockProps {
  title: string;
  icon: React.ReactNode;
  games: GameItem[];
  showPlayers?: boolean;
  isSports?: boolean;
  onGameClick?: (game: GameItem) => void;
  onDemoClick?: (game: GameItem) => void;
}

const GameBlock: React.FC<BlockProps> = ({ title, icon, games, showPlayers, isSports, onGameClick, onDemoClick }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="mb-6 md:mb-8 w-full">
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
                
                <div className="casino-card-wrapper relative rounded-xl overflow-hidden aspect-[3/4] bg-[#111317] z-10 transition-all duration-300 transform group-hover:-translate-y-2 border border-transparent group-hover:border-[#10B981]/50">
                  <img 
                    src={game.image} 
                    alt={game.title}
                    className="absolute inset-0 !w-full !h-full !object-cover !object-center block transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                  {/* Hover Buttons */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto bg-black/60 backdrop-blur-[2px]">
                      <button 
                         onClick={(e) => { e.stopPropagation(); onGameClick?.(game); }}
                         className="w-[80%] flex items-center justify-center gap-2 bg-[#10B981] hover:bg-[#00E676] text-black font-black py-2.5 rounded-lg transition-transform hover:scale-105 shadow-[0_0_15px_rgba(0,255,163,0.4)] text-[11px] uppercase tracking-wider"
                      >
                         GERÇEK OYNA
                      </button>
                      
                      {getDemoUrl(game) && (
                         <button 
                           onClick={(e) => { e.stopPropagation(); onDemoClick?.(game); }}
                           className="w-[80%] flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold py-2.5 rounded-lg transition-transform hover:scale-105 text-[11px] uppercase tracking-wider backdrop-blur-md"
                         >
                           DEMO OYNA
                         </button>
                      )}
                  </div>
                </div>
              </div>

              {!isSports && showPlayers && game.players && (
                <div className="flex items-center justify-center gap-1.5 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_8px_rgba(0,255,163,0.6)]"></div>
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
    <div className="w-full bg-transparent p-0 my-4 md:my-6">

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
            <div className="relative w-full max-w-[1600px] w-[95vw] h-[90vh] bg-black rounded-xl md:rounded-2xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col border border-white/5">
               <div className="h-12 md:h-14 bg-[#0B0E14] flex items-center justify-between px-4 md:px-6 border-b border-white/5 flex-shrink-0">
                  <div className="flex items-center gap-3">
                     <div className="flex gap-1.5 opacity-50 hover:opacity-100 transition-opacity hidden md:flex">
                         <span className="w-3 h-3 rounded-full bg-red-500"></span>
                         <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                         <span className="w-3 h-3 rounded-full bg-green-500"></span>
                     </div>
                     <span className="text-white font-bold text-sm md:text-base tracking-wide uppercase">{selectedGame.title} <span className="text-[#10B981] font-black text-[10px] md:text-xs ml-2 border border-[#10B981]/30 bg-[#10B981]/10 px-2 py-0.5 rounded-full">DEMO</span></span>
                  </div>
                  <button onClick={() => setShowDemoIframe(false)} className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
               </div>
               <iframe 
                 src={getDemoUrl(selectedGame)!}
                 className="w-full flex-1 border-0 bg-[#0B0E14]"
                 allowFullScreen
                 title={selectedGame.title || 'Demo Game'}
               />
            </div>
          ) : (
            <div className="relative m-auto z-10 bg-[#111317] rounded-3xl border border-white/5 w-[90vw] md:w-[600px] lg:w-[650px] shadow-[0_30px_100px_rgba(0,0,0,0.9)] overflow-hidden animate-fade-in flex flex-col items-center p-6 md:p-10">
              <button 
                  onClick={() => { setSelectedGame(null); setShowDemoIframe(false); }}
                  className="absolute top-4 right-4 z-50 w-8 h-8 md:w-10 md:h-10 bg-black/40 hover:bg-white/10 rounded-full flex items-center justify-center text-white/50 hover:text-white transition-all border border-white/10 shadow-lg"
              >
                  <X className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              
              <div className="w-[120px] h-[160px] md:w-[150px] md:h-[200px] shrink-0 mt-2 mb-6 drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)] relative group cursor-pointer" onClick={() => setShowDemoIframe(true)}>
                   <img src={selectedGame.image} alt={selectedGame.title} className="absolute inset-0 w-full h-full object-cover rounded-xl border border-white/10 shadow-2xl transition-transform duration-500 group-hover:scale-105" />
                   <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 rounded-xl flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <Play className="w-5 h-5 text-white fill-current ml-1" />
                      </div>
                   </div>
              </div>

              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase mb-8 text-center drop-shadow-lg">
                  {selectedGame.title || 'Casino Slot'}
              </h1>

              <div className="w-full mb-10 text-left">
                  <h3 className="text-white font-bold text-sm md:text-base mb-3 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 text-zinc-400" />
                      Oyun Hakkında
                  </h3>
                  <p className="text-zinc-400 text-xs md:text-sm leading-relaxed">
                      {selectedGame.title} oyunu tamamen şeffaf ve %100 kanıtlanabilir adil (Provably Fair) altyapısıyla çalışmaktadır. Sonuçlar önceden belirlenir ve dışarıdan asla müdahale edilemez. Pragmatic Play kalitesiyle hemen oynamaya başla ve devasa çarpanları yakala.
                  </p>
              </div>

              <div className="w-full mt-auto flex flex-col sm:flex-row gap-3">
                  <button 
                      onClick={() => window.dispatchEvent(new CustomEvent('openLoginModal'))}
                      className="flex-1 h-14 md:h-16 rounded-xl md:rounded-2xl bg-[#10B981] hover:bg-[#00e693] text-black font-black text-lg tracking-wide flex items-center justify-center gap-3 transition-all duration-300 transform hover:scale-[1.02] active:scale-95 shadow-[0_0_40px_rgba(0,255,163,0.3)] hover:shadow-[0_0_60px_rgba(0,255,163,0.5)]"
                  >
                      GERÇEK OYNA
                  </button>
                  
                  {getDemoUrl(selectedGame) && (
                      <button 
                        onClick={() => setShowDemoIframe(true)}
                        className="flex-1 h-14 md:h-16 rounded-xl md:rounded-2xl bg-[#1F2331] hover:bg-[#2A2E3D] border border-[#2A2E3D] text-white font-black text-lg tracking-wide flex items-center justify-center gap-3 transition-all duration-300 transform hover:scale-[1.02] active:scale-95"
                      >
                          <Play className="w-5 h-5 fill-current" />
                          DEMO OYNA
                      </button>
                  )}
              </div>
              
              <div className="flex items-center justify-center gap-2 mt-4 text-center w-full">
                  <span className="text-zinc-500 text-[9px] md:text-[10px] font-bold uppercase tracking-widest">
                      ŞU AN <span className="text-[#10B981]">{selectedGame.players?.toLocaleString('tr-TR')} OYUNCU</span> AKTİF
                  </span>
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
