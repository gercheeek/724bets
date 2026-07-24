import re

with open('/Users/alex/Desktop/7_24bets-landing-page/components/VIPHeroBanner.tsx', 'w') as f:
    f.write("""import React, { useState, useEffect } from 'react';
import { ArrowRight, Trophy, Terminal, Gamepad2 } from 'lucide-react';
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

const VIPHeroBanner = () => {
  const ranks = [
    { id: 'demir', name: 'DEMİR', reqXp: 1000, active: false, done: true },
    { id: 'bronz', name: 'BRONZ', reqXp: 2500, active: true, progress: 65, currentXp: 1625, done: false },
    { id: 'gumus', name: 'GÜMÜŞ', reqXp: 10000, active: false, done: false },
    { id: 'altin', name: 'ALTIN', reqXp: 25000, active: false, done: false },
    { id: 'elmas', name: 'ELMAS', reqXp: 100000, active: false, done: false },
  ];

  return (
    <div className="w-full bg-[#020202] border-4 border-[#ff00ff] p-4 md:p-8 flex flex-col md:flex-row gap-6 md:gap-10 relative overflow-hidden font-arcade shadow-[8px_8px_0_rgba(255,0,255,0.4)] mb-4">
        
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
          .font-arcade { font-family: 'Press Start 2P', monospace; }
        `}</style>

        {/* Scanline Background */}
        <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30 z-0" style={{ background: 'repeating-linear-gradient(transparent, transparent 2px, rgba(0, 255, 255, 0.15) 2px, rgba(0, 255, 255, 0.15) 4px)' }}></div>
        
        {/* Subtle grid */}
        <div className="absolute inset-0 pointer-events-none opacity-10 z-0" style={{ backgroundImage: 'linear-gradient(#00ffff 1px, transparent 1px), linear-gradient(90deg, #00ffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

        {/* ── LEFT SIDE: TERMINAL / INFO ── */}
        <div className="flex-1 relative z-10 flex flex-col justify-between bg-black border-2 border-[#00ffff] p-6 md:p-8 shadow-[inset_0_0_20px_rgba(0,255,255,0.2)]">
           
           <div>
               <div className="flex items-center gap-3 mb-8 border-b-2 border-dashed border-[#00ffff]/50 pb-4">
                  <Gamepad2 className="w-6 h-6 text-[#00ffff] animate-pulse" />
                  <span className="text-[#00ffff] text-[10px] md:text-xs tracking-widest uppercase mt-1">VIP_SYSTEM.EXE</span>
               </div>

               <div className="flex flex-col gap-5 text-[9px] md:text-[11px] text-white leading-relaxed uppercase">
                   <p className="flex items-start gap-2">
                       <span className="text-[#ff00ff]">{'>'}</span> OYUNUNUZU KAZANCA DÖNÜŞTÜRÜN_
                   </p>
                   <p className="flex items-start gap-2">
                       <span className="text-[#ff00ff]">{'>'}</span> ÖZEL ÖDÜLLERİN KİLİDİNİ AÇIN_
                   </p>
                   <p className="flex items-start gap-2">
                       <span className="text-[#ff00ff]">{'>'}</span> SINIRLARI ZORLAYIN_
                   </p>
               </div>

               <button className="mt-10 bg-transparent border-2 border-[#ff00ff] text-[#ff00ff] px-6 py-4 text-[9px] md:text-[11px] uppercase hover:bg-[#ff00ff] hover:text-black transition-all flex items-center gap-4 group shadow-[4px_4px_0_rgba(255,0,255,0.4)] hover:shadow-[0_0_0_rgba(255,0,255,0)] hover:translate-x-1 hover:translate-y-1">
                   <span>HEMEN KATIL</span>
                   <ArrowRight className="w-4 h-4" />
               </button>
           </div>

           <div className="mt-10 pt-6 border-t-2 border-dashed border-[#00ffff]/50">
               <div className="text-zinc-500 text-[8px] mb-3 uppercase flex items-center gap-2">
                   <Terminal className="w-3 h-3" /> MEGA_KASA_IKRAMIYESI
               </div>
               <div className="text-white text-lg md:text-2xl drop-shadow-[3px_3px_0_#00ffff]">
                   <AnimatedJackpot />
               </div>
           </div>
        </div>

        {/* ── RIGHT SIDE: RANK PROGRESS ── */}
        <div className="flex-1 relative z-10 flex flex-col bg-black border-2 border-[#ff00ff] p-6 md:p-8 shadow-[inset_0_0_20px_rgba(255,0,255,0.2)]">
            
            <h3 className="text-white text-[10px] md:text-xs mb-8 border-b-2 border-dashed border-[#ff00ff]/50 pb-4 flex items-center gap-3">
                <Trophy className="w-5 h-5 text-yellow-400" /> RÜTBE_DURUMU
            </h3>
            
            <div className="flex flex-col gap-5 justify-center flex-1">
               {ranks.map((rank) => (
                  <div key={rank.id} className={`flex flex-col ${rank.active ? 'opacity-100' : (rank.done ? 'opacity-60' : 'opacity-30')}`}>
                     <div className="flex items-center gap-4">
                         <div className={`text-[10px] md:text-xs font-bold ${rank.active ? 'text-[#00ffff] animate-pulse' : 'text-white'}`}>
                             {rank.active ? '[>]' : (rank.done ? '[X]' : '[ ]')}
                         </div>
                         <div className={`text-[10px] md:text-xs uppercase tracking-wider ${rank.active ? 'text-[#00ffff]' : 'text-white'}`}>
                             {rank.name}
                         </div>
                     </div>
                     
                     {rank.active && (
                         <div className="mt-4 pl-10">
                             <div className="flex justify-between items-center mb-3 text-[7px] md:text-[8px] text-zinc-400 uppercase">
                                 <span>İLERLEME: %{rank.progress}</span>
                                 <span><AnimatedCounter value={rank.currentXp || 0} /> / {rank.reqXp} XP</span>
                             </div>
                             {/* Pixel Progress Bar */}
                             <div className="w-full h-3 md:h-4 border-[2px] border-[#00ffff] bg-black p-[2px]">
                                 <div className="h-full bg-[#00ffff]" style={{ width: `${rank.progress}%`, backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(0,0,0,0.5) 4px, rgba(0,0,0,0.5) 6px)' }} />
                             </div>
                         </div>
                     )}
                     
                     {!rank.active && !rank.done && (
                         <div className="mt-2 pl-10 text-[7px] text-zinc-500 uppercase">
                             HEDEF: {rank.reqXp} XP
                         </div>
                     )}
                  </div>
               ))}
            </div>
        </div>

    </div>
  );
};

export default VIPHeroBanner;
""")

