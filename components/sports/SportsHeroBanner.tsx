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
    <div className="flex items-baseline font-mono tracking-tighter drop-shadow-[0_0_15px_rgba(245,158,11,0.4)]" style={{ fontVariantNumeric: 'tabular-nums' }}>
      <span className="text-amber-500 font-light mr-1.5 md:mr-2 text-2xl md:text-3xl lg:text-4xl">₺</span>
      <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-[#ffe484] to-[#f59e0b] drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
        {volume.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </span>
    </div>
  );
};

const SportsHeroBanner = ({ onNavigate }: { onNavigate?: (v: string) => void }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
  };

  return (
    <div className="w-full relative z-20 px-0 flex flex-col pt-4 pb-8">
      
      {/* The ULTRA Banner */}
      <div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className="w-full relative bg-[#05070a] rounded-[2.5rem] p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-12 border-t border-white/[0.08] border-b border-black shadow-[0_20px_80px_rgba(0,0,0,0.9)] overflow-hidden group"
      >
        {/* Dynamic Interactive Spotlight */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-300 mix-blend-screen"
          style={{
            opacity: isHovering ? 1 : 0,
            background: `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, rgba(245, 158, 11, 0.1), transparent 40%)`
          }}
        ></div>

        {/* Deep Cyber Grid Background - Thinner & Larger */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>
        
        {/* Massive Base Glows */}
        <div className="absolute top-0 right-0 w-[50%] h-[100%] bg-amber-500/10 blur-[150px] rounded-full pointer-events-none z-0"></div>
        <div className="absolute bottom-0 left-0 w-[40%] h-[80%] bg-blue-600/5 blur-[150px] rounded-full pointer-events-none z-0"></div>

        {/* Left Side: Cyber Brand */}
        <div className="relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left gap-4 lg:w-[45%] xl:w-[40%] shrink-0">
          
          {/* Refined Custom Label */}
          <div className="flex items-center gap-3">
             <div className="relative flex items-center justify-center w-6 h-6 rounded-full border border-amber-500/30 bg-amber-500/10 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                <span className="absolute animate-ping w-2 h-2 rounded-full bg-amber-400 opacity-75"></span>
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
             </div>
             <span className="text-amber-500 text-[10px] md:text-xs font-bold uppercase tracking-[0.25em]">
               1 EYLÜL'DE SONLANIYOR
             </span>
          </div>

          {/* Balanced Typography */}
          <div className="flex flex-col mt-3 lg:mt-4 gap-0 lg:gap-1">
            <h2 className="text-[36px] sm:text-[46px] lg:text-[56px] font-black italic tracking-tighter leading-none text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
              SPOR
            </h2>
            <h2 className="text-[44px] sm:text-[54px] lg:text-[68px] font-black italic tracking-tighter leading-[0.9] text-transparent bg-clip-text bg-gradient-to-br from-[#ffe885] via-[#fdb931] to-[#b37a00] drop-shadow-[0_4px_20px_rgba(245,158,11,0.3)] pb-2">
              JACKPOT
            </h2>
          </div>

          <p className="text-zinc-400 text-sm md:text-[15px] font-medium max-w-[340px] mt-2 lg:mt-4 tracking-wide leading-relaxed">
            Spor bahislerinde en yüksek çevrimi yap, dev ödülü paylaş!
          </p>
        </div>

        {/* Right Side: The Vault Display */}
        <div className="relative z-10 flex flex-col w-full md:w-[80%] lg:w-auto flex-1 lg:max-w-[420px] xl:max-w-[480px] shrink-0 min-w-0" onClick={() => onNavigate && onNavigate('jackpot')}>
          
          {/* Refined Glassmorphic Vault Box */}
          <div className="relative w-full bg-gradient-to-br from-[#0b101a]/90 to-[#121824]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6 shadow-[0_15px_40px_rgba(0,0,0,0.8)] cursor-pointer overflow-hidden group/vault transition-all duration-500 hover:border-amber-500/30 hover:shadow-[0_20px_50px_rgba(245,158,11,0.15)]">
            
            {/* Inner Vault Glare */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            
            <span className="block text-zinc-500 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.3em] mb-1.5 drop-shadow-md">GÜNCEL HAVUZ</span>
            
            {/* The Animated Numbers - Scaled down to prevent clipping */}
            <div className="text-3xl sm:text-4xl lg:text-[40px] xl:text-[48px] font-black tracking-tighter group-hover/vault:scale-[1.02] transition-transform duration-500 ease-out whitespace-nowrap overflow-visible">
              <AnimatedVolume />
            </div>

            {/* Clean Action Button inside the Vault */}
            <div className="mt-3 md:mt-4 flex items-center justify-between border-t border-white/5 pt-3 group/btn">
               <div className="flex items-center gap-3">
                 <span className="text-amber-500 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] group-hover/btn:text-amber-400 transition-colors">SIRALAMAYI GÖR</span>
                 <ArrowRight className="w-3.5 h-3.5 text-amber-500 group-hover/btn:translate-x-2 transition-transform duration-300" />
               </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default SportsHeroBanner;
