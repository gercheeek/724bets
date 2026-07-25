import React, { useRef, useState, useEffect } from 'react';
import { Zap, ArrowRight, Star, ChevronRight, Info, Crown, Trophy } from 'lucide-react';

const AnimatedVolume = () => {
  const [volume, setVolume] = useState(12450890.45);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setVolume(prev => prev + (Math.random() * 2));
    }, 150);
  return () => clearInterval(interval);
  }, []);

  return (
    <span className="flex items-baseline font-mono tracking-tighter" style={{ fontVariantNumeric: 'tabular-nums' }}>
      <span className="text-emerald-400 font-light mr-1 opacity-90 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]">₺</span>
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-300">
        {volume.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </span>
    </span>
  );
};

const SportsHeroBanner = ({ onNavigate }: { onNavigate?: (v: string) => void }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [hoveredMatchId, setHoveredMatchId] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isCarouselHovered, setIsCarouselHovered] = useState(false);
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
    return { x: y * 3, y: x * 3 };
  };

  const tilt = calcTilt();

  const TOP_MATCHES = [
    { 
      id: 'm1', 
      league: 'Counter-Strike 2', 
      team1: 'Sinners', 
      team2: 'FUT Esports', 
      color: 'text-[#00ff88]', 
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2940&auto=format&fit=crop', 
      viewers: 12450, 
      odds: { home: '2.10', draw: '-', away: '1.65' }
    },
    { 
      id: 'm2', 
      league: 'Boks', 
      team1: 'Tyson Fury', 
      team2: 'Mariusz Wach', 
      color: 'text-[#a855f7]', 
      image: 'https://images.unsplash.com/photo-1518605368461-1ee7c5320746?q=80&w=2890&auto=format&fit=crop', 
      viewers: 58240, 
      odds: { home: '2.80', draw: '-', away: '2.25' }
    },
    { 
      id: 'm3', 
      league: 'Şampiyonlar Ligi', 
      team1: 'Real Madrid', 
      team2: 'Barcelona', 
      color: 'text-emerald-400', 
      image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=2940&auto=format&fit=crop', 
      viewers: 134100, 
      odds: { home: '1.85', draw: '3.40', away: '1.95' }
    },
    { 
      id: 'm4', 
      league: 'NBA', 
      team1: 'Lakers', 
      team2: 'Warriors', 
      color: 'text-yellow-400', 
      image: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=2938&auto=format&fit=crop', 
      viewers: 89300, 
      odds: { home: '2.10', draw: '-', away: '2.90' }
    },
    { 
      id: 'm5', 
      league: 'Tenis', 
      team1: 'Alcaraz', 
      team2: 'Djokovic', 
      color: 'text-white', 
      image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=2786&auto=format&fit=crop', 
      viewers: 72500, 
      odds: { home: '1.45', draw: '-', away: '2.85' }
    },
  ];

  useEffect(() => {
    if (isCarouselHovered) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % TOP_MATCHES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isCarouselHovered, TOP_MATCHES.length]);

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
      className="relative w-full bg-[#050505] border-b border-white/5 md:rounded-[2rem] md:border overflow-hidden px-6 py-4 md:px-8 md:py-6 flex items-center shadow-lg group z-10"
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
        @keyframes slow-pan {
          0% { transform: scale(1.1) translate(0, 0); }
          50% { transform: scale(1.15) translate(-2%, 2%); }
          100% { transform: scale(1.1) translate(0, 0); }
        }
        .glint-text {
           background-size: 200% auto;
           animation: text-shine 4s linear infinite;
        }
        @keyframes text-shine {
           to { background-position: 200% center; }
        }
        @keyframes fade-in-right-anim {
          0% { opacity: 0; transform: translateX(30px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .stagger-enter {
          animation: fade-in-right-anim 0.6s cubic-bezier(0.16, 1, 0.3, 1) backwards;
        }
      `}</style>

      {/* Breathing Mesh / Cinematic Particle Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
         <div className={`absolute top-[-20%] left-[-10%] w-[50%] h-[120%] bg-emerald-500/5 rounded-[100%] animate-[slow-pan_10s_ease-in-out_infinite] mix-blend-screen transition-all duration-700 ${isHovering ? 'blur-[100px] opacity-70' : 'blur-[120px] opacity-40'}`}></div>
         <div className={`absolute bottom-[-20%] right-[-10%] w-[60%] h-[120%] bg-blue-600/5 rounded-[100%] animate-[slow-pan_15s_ease-in-out_infinite_reverse] mix-blend-screen transition-all duration-700 ${isHovering ? 'blur-[120px] opacity-70' : 'blur-[150px] opacity-40'}`}></div>
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] mix-blend-overlay z-10"></div>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center relative z-20" style={{ transform: 'translateZ(40px)' }}>
        {/* Left Column */}
        <div className="flex flex-col items-start text-left space-y-2">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-[1.1] cursor-default">
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-white to-white/70">YAKLAŞAN</span> <br className="hidden md:block"/> 
            
            <span className="relative inline-block mt-1">
              <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-[#00ff88] ml-2 md:ml-0 tracking-tighter">
                MAÇLAR
              </span>
            </span>
          </h1>
          
          <div className="mt-8 flex flex-col items-start gap-1.5 relative group">
             <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
             
             <div className="relative flex flex-col items-start bg-gradient-to-r from-[#111] to-[#0a0a0a] border border-white/5 rounded-2xl px-5 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_8px_20px_rgba(0,0,0,0.5)] transform transition-transform duration-300 group-hover:-translate-y-1">
               <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse shadow-[0_0_8px_#00ff88]"></div>
                  <span className="text-[9px] md:text-[10px] text-zinc-400 font-bold uppercase tracking-[0.3em]">GÜNLÜK BAHİS HACMİ</span>
               </div>
               
               <div className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
                 <AnimatedVolume />
               </div>
             </div>
          </div>
        </div>

        {/* Right Column: Clean Premium Crossfade Carousel */}
        <div 
           className="relative flex flex-col justify-center w-full max-w-sm mx-auto md:ml-auto mt-6 md:mt-0 z-20"
           onMouseEnter={() => setIsCarouselHovered(true)}
           onMouseLeave={() => setIsCarouselHovered(false)}
        >
          <div className="relative w-full h-[180px] md:h-[190px]">
            {TOP_MATCHES.map((match, idx) => {
              const isActive = idx === activeIndex;
              const isHovered = hoveredMatchId ? match.id === hoveredMatchId : isActive;
              
              return (
                <div 
                  key={match.id} 
                  className={`absolute inset-0 touch-manipulation cursor-pointer group transition-all duration-700 ease-in-out ${isActive ? 'opacity-100 z-20 translate-x-0' : 'opacity-0 z-0 translate-x-8 pointer-events-none'}`} 
                  onMouseEnter={() => setHoveredMatchId(match.id)}
                  onMouseLeave={() => setHoveredMatchId(null)}
                >
                  <div className={`relative h-full w-full rounded-2xl transition-all duration-500 overflow-hidden ${isHovered ? 'shadow-[0_20px_50px_rgba(0,0,0,0.9)] scale-[1.02] bg-gradient-to-b from-[#1a1a1a] to-black' : 'shadow-2xl scale-100 bg-[#0a0a0a]'}`}>
                   {isHovered && (
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250%] h-[250%] bg-gradient-to-br from-[#00ff88]/0 via-[#00ff88]/10 to-blue-500/0 opacity-50 animate-[spin-slow_4s_linear_infinite] pointer-events-none z-0"></div>
                   )}

                   <div 
                     className={`relative h-full rounded-2xl z-10 flex flex-col overflow-hidden transition-all duration-500 ${isHovered ? 'shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]' : ''}`}
                   >
                     {/* Background Image */}
                     <div 
                        className="absolute inset-0 bg-cover bg-right bg-no-repeat transition-transform duration-700 ease-out opacity-80"
                        style={{ backgroundImage: `url(${match.image})`, transform: isHovered ? 'scale(1.05)' : 'scale(1.0)' }}
                     />
                     {/* Premium Borderless Gradient Overlay */}
                     <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-0"></div>
                     <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-0 opacity-60"></div>
                     <div className="absolute inset-0 bg-black/20 z-0 transition-opacity duration-500 group-hover:bg-black/0"></div>

                     {/* Content */}
                     <div className="relative z-10 p-2.5 md:p-3 flex flex-col">
                        <div className="flex items-center gap-4">
                           <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[9px] font-black uppercase text-emerald-400 bg-gradient-to-r from-emerald-500/20 to-emerald-900/20 px-2 py-0.5 rounded shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">{match.league}</span>
                              </div>
                              <h4 className={`text-[12px] md:text-[14px] font-black tracking-wide transition-colors ${isHovered ? 'text-white' : 'text-slate-300'}`}>
                                {match.team1} <span className="text-zinc-500 font-normal mx-1">vs</span> {match.team2}
                              </h4>
                              <div className="text-[9px] md:text-[10px] text-zinc-400 font-bold uppercase mt-1 tracking-wider flex items-center gap-1.5">
                                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_5px_#00ff88]"></span>
                                 {match.viewers.toLocaleString('tr-TR')}
                              </div>
                            </div>
                         </div>

                         <div className={`transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden ${isHovered ? 'max-h-[80px] opacity-100 mt-3 pt-3' : 'max-h-0 opacity-0 mt-0 pt-0'}`}>
                           <div className="flex gap-2">
                             {/* 1 */}
                             <button className="flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-[#222] to-[#111] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_4px_10px_rgba(0,0,0,0.5)] hover:from-emerald-900/40 hover:to-emerald-950/20 group/btn transition-all py-1.5 rounded-lg">
                               <span className="text-[9px] text-zinc-500 group-hover/btn:text-emerald-400 font-bold mb-0.5 transition-colors">1</span>
                               <span className="text-[11px] font-black text-white">{match.odds.home}</span>
                             </button>
                             {/* X (Draw) */}
                             {match.odds.draw !== '-' && (
                               <button className="flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-[#222] to-[#111] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_4px_10px_rgba(0,0,0,0.5)] hover:from-emerald-900/40 hover:to-emerald-950/20 group/btn transition-all py-1.5 rounded-lg">
                                 <span className="text-[9px] text-zinc-500 group-hover/btn:text-emerald-400 font-bold mb-0.5 transition-colors">X</span>
                                 <span className="text-[11px] font-black text-white">{match.odds.draw}</span>
                               </button>
                             )}
                             {/* 2 */}
                             <button className="flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-[#222] to-[#111] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_4px_10px_rgba(0,0,0,0.5)] hover:from-emerald-900/40 hover:to-emerald-950/20 group/btn transition-all py-1.5 rounded-lg">
                               <span className="text-[9px] text-zinc-500 group-hover/btn:text-emerald-400 font-bold mb-0.5 transition-colors">2</span>
                               <span className="text-[11px] font-black text-white">{match.odds.away}</span>
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

          {/* Pagination Dots */}
          <div className="flex items-center justify-center gap-2 mt-4 z-30">
            {TOP_MATCHES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-500 ${idx === activeIndex ? 'w-6 bg-emerald-400' : 'w-1.5 bg-white/20 hover:bg-white/40'}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default SportsHeroBanner;
