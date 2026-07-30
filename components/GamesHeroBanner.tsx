import React, { useRef, useState, useEffect } from 'react';
import { Zap, ArrowRight, Star, ChevronRight, Info, Crown } from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';

const AnimatedJackpot = () => {
  const [jackpot, setJackpot] = useState(12450890.45);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setJackpot(prev => prev + (Math.random() * 2));
    }, 150);
  return () => clearInterval(interval);
  }, []);

  return (
    <span style={{ fontVariantNumeric: 'tabular-nums' }}>
      ₺{jackpot.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    </span>
  );
};

const HeroBanner = ({ onNavigate }: { onNavigate?: (v: string) => void }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [hoveredGameId, setHoveredGameId] = useState<string | null>(null);
  const [isLoadingGame, setIsLoadingGame] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
  };

  const calcTilt = () => {
    if (!cardRef.current || !isHovering) return { x: 0, y: 0 };
    const rect = cardRef.current.getBoundingClientRect();
    const x = (mousePos.x - rect.width / 2) / (rect.width / 2);
    const y = -(mousePos.y - rect.height / 2) / (rect.height / 2);
    // max 3 degrees
    return { x: y * 3, y: x * 3 };
  };

  const tilt = calcTilt();


  const handlePlayGame = (gameId: string) => {
    setIsLoadingGame(gameId);
    setTimeout(() => {
      setIsLoadingGame(null);
      // Try to open standard game if possible, otherwise dispatch custom event
      window.dispatchEvent(new CustomEvent('openGame', { detail: gameId }));
      // Let's also dispatch navigate event since it might be an original game
      const path = gameId;
      if (onNavigate) { onNavigate(path); } else { window.history.pushState(null, '', '/' + path); window.dispatchEvent(new Event('popstate')); }
    }, 3000);
  };

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{
        transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: isHovering ? 'none' : 'transform 0.5s ease-out',
        transformStyle: 'preserve-3d'
      }}
      className="arcade-cursor relative w-full bg-[#050505] border-b border-white/5 md:rounded-[2rem] md:border overflow-hidden px-6 py-6 md:px-8 md:py-10 flex items-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] group z-10"
    >
      
      {/* Cursor Spotlight (Flashlight Effect) */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-10"
        style={{
          opacity: isHovering ? 1 : 0,
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0, 255, 255, 0.08), transparent 50%)`
        }}
      ></div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        
        .font-arcade {
           font-family: 'Press Start 2P', cursive;
        }

        @keyframes slow-pan {
          0% { transform: scale(1.1) translate(0, 0); }
          50% { transform: scale(1.15) translate(-2%, 2%); }
          100% { transform: scale(1.1) translate(0, 0); }
        }
        @keyframes shine-sweep {
          0% { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(200%) skewX(-15deg); }
        }
        .shine-effect::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 50%;
          height: 100%;
          background: linear-gradient(to right, transparent, rgba(255,255,255,0.4), transparent);
          transform: translateX(-100%) skewX(-15deg);
          animation: shine-sweep 3s infinite;
        }
        .glint-text {
           background-size: 200% auto;
           animation: text-shine 4s linear infinite;
        }
        @keyframes text-shine {
           to { background-position: 200% center; }
        }
        .retro-cyan-text {
           background-image: url("data:image/svg+xml,%3Csvg width='4' height='4' viewBox='0 0 4 4' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='1' fill='rgba(0,0,0,0.5)'/%3E%3C/svg%3E"), linear-gradient(to right, #00ff88, #008888, #00ff88);
           background-size: 4px 4px, 200% auto;
           background-position: 0 0, 0 center;
           animation: text-shine 4s linear infinite;
           -webkit-background-clip: text;
           background-clip: text;
           color: transparent;
        }
        @keyframes pulse-neon {
          0%, 100% { box-shadow: 0 0 15px rgba(0, 255, 255, 0.2), 0 0 30px rgba(0, 255, 255, 0.1); }
          50% { box-shadow: 0 0 25px rgba(0, 255, 255, 0.8), 0 0 50px rgba(0, 255, 255, 0.4); }
        }
        .animate-pulse-neon {
          animation: pulse-neon 2s infinite ease-in-out;
        }
        .pixel-bar-track {
           background-image: linear-gradient(90deg, rgba(255,255,255,0.05) 85%, transparent 85%);
           background-size: 8px 100%;
        }
        .pixel-bar-fill {
           background-image: linear-gradient(90deg, #a855f7 85%, transparent 85%);
           background-size: 8px 100%;
           box-shadow: 0 0 15px rgba(255, 0, 255, 0.5);
        }
        @keyframes glitch-anim {
          0% { transform: translate(0) }
          20% { transform: translate(-2px, 2px) }
          40% { transform: translate(-2px, -2px) }
          60% { transform: translate(2px, 2px) }
          80% { transform: translate(2px, -2px) }
          100% { transform: translate(0) }
        }
        .hover-glitch:hover {
          animation: glitch-anim 0.2s cubic-bezier(.25, .46, .45, .94) both;
        }
        .arcade-cursor {
          cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%2300ffff' d='M11 0h2v11h11v2H13v11h-2V13H0v-2h11V0z'/%3E%3C/svg%3E") 12 12, crosshair;
        }
        @keyframes fade-in-right-anim {
          0% { opacity: 0; transform: translateX(30px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .stagger-enter {
          animation: fade-in-right-anim 0.6s cubic-bezier(0.16, 1, 0.3, 1) backwards;
        }
      `}</style>


      {isLoadingGame && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050505] animate-fade-in backdrop-blur-md">
          <div className="flex flex-col items-center gap-6 animate-pulse">
            <img src="/logo.png" alt="724BETS" className="h-16 md:h-20 drop-shadow-[0_0_20px_rgba(0,255,136,0.5)] animate-bounce" />
            <div className="text-[#00ff88] font-arcade text-xl md:text-2xl tracking-widest drop-shadow-[0_0_10px_rgba(0,255,136,0.8)]">
              OYUN YÜKLENIYOR...
            </div>
            {/* Loading Bar */}
            <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden mt-4">
              <div className="h-full bg-gradient-to-r from-[#00ff88] to-[#a855f7] animate-[shimmer_3s_ease-in-out_forwards] w-full" style={{ transformOrigin: 'left', animationName: 'shimmer', animationDuration: '3s' }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Breathing Mesh / Cinematic Particle Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
         {/* Particles reacting to hover by slightly increasing opacity/blur */}
         <div className={`absolute top-[-20%] left-[-10%] w-[50%] h-[120%] bg-emerald-500/10 rounded-[100%] animate-[slow-pan_10s_ease-in-out_infinite] mix-blend-screen transition-all duration-700 ${isHovering ? 'blur-[100px] opacity-100' : 'blur-[120px] opacity-70'}`}></div>
         <div className={`absolute bottom-[-20%] right-[-10%] w-[60%] h-[120%] bg-purple-600/10 rounded-[100%] animate-[slow-pan_15s_ease-in-out_infinite_reverse] mix-blend-screen transition-all duration-700 ${isHovering ? 'blur-[120px] opacity-100' : 'blur-[150px] opacity-70'}`}></div>
         
         {/* Retro CRT Scanlines Overlay */}
         <div className="absolute inset-0 z-10 pointer-events-none mix-blend-overlay opacity-30" style={{ background: 'repeating-linear-gradient(transparent, transparent 2px, rgba(0, 255, 255, 0.1) 2px, rgba(0, 255, 255, 0.1) 4px)' }}></div>
         
         {/* Noise overlay for texture */}
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] mix-blend-overlay z-10"></div>
      </div>

      {/* Content wrapper with Parallax Z-translation */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center relative z-20" style={{ transform: 'translateZ(40px)' }}>
        {/* Left Column */}
        <div className="flex flex-col items-start text-left space-y-1">
          {/* Removed badge */}
          
          <h1 className="text-xl md:text-2xl lg:text-3xl font-black tracking-tight text-white leading-[1.1] drop-shadow-[0_0_15px_rgba(0,255,136,0.5)] cursor-default">
            EN ÇOK KAZANDIRAN <br className="hidden md:block"/> 
            
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] via-white to-[#00ff88] drop-shadow-[0_0_20px_rgba(0,255,136,0.4)] ml-2 md:ml-0 glint-text hover:brightness-125 transition-all text-2xl md:text-3xl lg:text-4xl inline-block mt-1 font-arcade tracking-wider">
              OYUNLAR
            </span>
          </h1>
          
          {/* Animated Jackpot */}
          <div className="mt-2 mb-1 flex flex-col items-start gap-1">
             <div className="text-[10px] text-zinc-500 font-arcade uppercase" style={{ fontFamily: "'Press Start 2P', monospace" }}>Toplam Dağıtılan Ödül</div>
             <div className="text-xl md:text-2xl lg:text-3xl font-arcade text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] to-[#a855f7] drop-shadow-[0_0_10px_rgba(255,0,255,0.8)] tracking-wider" style={{ fontFamily: "'Press Start 2P', monospace" }}>
               <AnimatedJackpot />
             </div>
          </div>
        </div>

        {/* Right Column: Gamified Vertical Ranks Carousel */}
        <div className="flex flex-col justify-center gap-1.5 w-full max-w-sm mx-auto md:ml-auto perspective-1000 mt-10 md:mt-0 relative z-20">
          
          {[
            { id: 'plinko', name: 'PLINKO', color: 'text-[#00ff88]', image: '/images/flat-plinko.jpg', players: 1245, maxWin: '1000x' },
            { id: 'limbo', name: 'LIMBO', color: 'text-[#a855f7]', image: '/images/flat-mission.jpg', players: 843, maxWin: '10,000x' },
            { id: 'roulette', name: 'ROULETTE', color: 'text-emerald-400', image: '/images/flat-roulette.jpg', players: 3201, maxWin: '36x' },
            { id: 'blackjack', name: 'BLACKJACK', color: 'text-white', image: '/images/flat-blackjack.jpg', players: 2150, maxWin: '2.5x' },
            { id: 'keno', name: 'KENO', color: 'text-yellow-400', image: '/images/flat-keno.webp', players: 540, maxWin: '500x' },
          ].map((game, idx) => {
            const isHovered = hoveredGameId ? game.id === hoveredGameId : idx === 0;
            
            const handlePlayGame = (gameId: string) => {
              setIsLoadingGame(gameId);
              setTimeout(() => {
                setIsLoadingGame(null);
                window.dispatchEvent(new CustomEvent('openGame', { detail: gameId }));
                const path = gameId;
                if (onNavigate) { onNavigate(path); } else { window.history.pushState(null, '', '/' + path); window.dispatchEvent(new Event('popstate')); }
              }, 3000);
            };

            return (
              <div 
                key={game.id} 
                className="stagger-enter touch-manipulation cursor-pointer group" 
                style={{ animationDelay: `${idx * 150}ms` }}
                onMouseEnter={() => setHoveredGameId(game.id)}
                onMouseLeave={() => setHoveredGameId(null)}
                onClick={() => handlePlayGame(game.id)}
              >
                <div 
                  className={`relative rounded-2xl p-[1px] transition-all duration-700 overflow-hidden tilt-card ${isHovered ? 'scale-105 z-10 my-1 shadow-[0_0_20px_rgba(0,255,136,0.3)]' : 'scale-95 opacity-[0.65] grayscale z-0'}`} 
                  style={{ transform: isHovered ? 'rotateX(0deg)' : (idx < 2 ? 'rotateX(5deg) translateY(5px)' : 'rotateX(-5deg) translateY(-5px)') }}
                >
                   {/* Animated Border for Active Game */}
                   {isHovered && (
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250%] h-[250%] bg-gradient-to-br from-[#00ff88]/0 via-[#00ff88]/80 to-[#a855f7]/0 opacity-70 animate-[spin-slow_4s_linear_infinite] pointer-events-none z-0"></div>
                   )}

                   <div 
                     className={`relative rounded-[calc(1rem-1px)] z-10 flex flex-col overflow-hidden transition-colors duration-500 ${isHovered ? 'border-none' : 'border border-white/5'}`}
                   >
                     {/* Background Image */}
                     <div 
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 ease-out"
                        style={{ backgroundImage: `url(${game.image})`, transform: isHovered ? 'scale(1.1)' : 'scale(1.0)' }}
                     />
                     {/* Dark Negro Overlay (Lighter for more visibility) */}
                     <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/90 via-[#050505]/60 to-transparent z-0 mix-blend-multiply"></div>
                     <div className="absolute inset-0 bg-black/30 z-0 transition-opacity duration-500 group-hover:bg-black/10"></div>

                     {/* Content */}
                     <div className="relative z-10 p-2.5 md:p-3 flex flex-col">
                        <div className="flex items-center gap-4">
                           <div className="flex-1">
                              <h4 className={`text-[13px] md:text-[15px] font-black tracking-widest transition-colors ${isHovered ? 'text-[#00ff88] drop-shadow-[0_0_8px_rgba(0,255,136,0.8)]' : 'text-slate-200'}`}>{game.name}</h4>
                              <div className="text-[9px] md:text-[10px] text-zinc-400 font-bold uppercase mt-0.5 tracking-wider flex items-center gap-1.5">
                                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_5px_#00ff88]"></span>
                                 {game.players} Aktif Oyuncu
                              </div>
                           </div>
                        </div>

                        <div className={`transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden ${isHovered ? 'max-h-[80px] opacity-100 mt-2 pt-2 border-t border-white/10' : 'max-h-0 opacity-0 mt-0 pt-0 border-t-0'}`}>
                           <div className="flex justify-between items-center rounded-lg">
                              <div className="flex flex-col">
                                 <span className="text-[9px] md:text-[10px] text-zinc-500 uppercase font-black tracking-wider drop-shadow-md">Max Kazanç</span>
                                 <span className="text-[12px] md:text-[14px] font-black text-[#a855f7] drop-shadow-[0_0_8px_rgba(168,85,247,1)]">{game.maxWin}</span>
                              </div>
                              <button onClick={(e) => { e.stopPropagation(); handlePlayGame(game.id); }} className="bg-[#00ff88]/10 hover:bg-[#00ff88]/30 text-[#00ff88] border border-[#00ff88]/50 px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(0,255,136,0.3)] hover:shadow-[0_0_25px_rgba(0,255,136,0.6)] backdrop-blur-md">
                                 Hemen Oyna
                              </button>
                           </div>
                        </div>
                     </div>
                   </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
