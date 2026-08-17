import React, { useState, useEffect } from 'react';

interface LiveMatchRadarProps {
  homePossession?: number;
  awayPossession?: number;
  homeAttacks?: number;
  awayAttacks?: number;
}

export const LiveMatchRadar: React.FC<LiveMatchRadarProps> = ({ 
  homePossession = 50, 
  awayPossession = 50,
  homeAttacks = 0,
  awayAttacks = 0
}) => {
  const [action, setAction] = useState('SAFE');
  const [team, setTeam] = useState('HOME');

  useEffect(() => {
    const interval = setInterval(() => {
      const isHomeDominating = homePossession > 55 || homeAttacks > awayAttacks * 1.5;
      const isAwayDominating = awayPossession > 55 || awayAttacks > homeAttacks * 1.5;
      
      let nextTeam = 'HOME';
      if (isHomeDominating) nextTeam = Math.random() < 0.7 ? 'HOME' : 'AWAY';
      else if (isAwayDominating) nextTeam = Math.random() < 0.7 ? 'AWAY' : 'HOME';
      else nextTeam = Math.random() < 0.5 ? 'HOME' : 'AWAY';

      const rand = Math.random();
      let nextAction = 'SAFE';
      if (rand < 0.3) nextAction = 'POSSESSION';
      else if (rand < 0.6) nextAction = 'DANGEROUS_ATTACK';
      else if (rand < 0.75) nextAction = 'FREE_KICK';
      else nextAction = 'SAFE';

      setAction(nextAction);
      setTeam(nextTeam);
    }, 4000);
    return () => clearInterval(interval);
  }, [homePossession, awayPossession, homeAttacks, awayAttacks]);

  return (
    <div className="w-full bg-transparent border-b border-white/5 relative">
      {/* 3D Pitch SVG - High Tech Radar Mode */}
      <div className="relative w-full h-[180px] md:h-[220px] bg-[#08090b] overflow-hidden" style={{ perspective: '800px' }}>
        
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)]" style={{ backgroundSize: '20px 20px', transform: 'rotateX(45deg) scale(1.5)' }}></div>
        
        {/* Pitch Lines - Glowing Tech Style */}
        <svg viewBox="0 0 800 500" className="absolute inset-0 w-full h-full opacity-40 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" style={{ transform: 'rotateX(35deg) scale(1.1) translateY(-10%)' }}>
          {/* Outer Field Glow */}
          <rect x="20" y="20" width="760" height="460" fill="rgba(255,255,255,0.01)" stroke="white" strokeWidth="2.5" />
          <line x1="400" y1="20" x2="400" y2="480" stroke="white" strokeWidth="2.5" />
          <circle cx="400" cy="250" r="70" fill="none" stroke="white" strokeWidth="2.5" />
          <circle cx="400" cy="250" r="3" fill="white" />
          {/* Penalty Areas */}
          <rect x="20" y="100" width="130" height="300" fill="rgba(255,255,255,0.02)" stroke="white" strokeWidth="2.5" />
          <circle cx="110" cy="250" r="3" fill="white" />
          <path d="M 150 180 A 70 70 0 0 1 150 320" fill="none" stroke="white" strokeWidth="2.5" />
          
          <rect x="650" y="100" width="130" height="300" fill="rgba(255,255,255,0.02)" stroke="white" strokeWidth="2.5" />
          <circle cx="690" cy="250" r="3" fill="white" />
          <path d="M 650 180 A 70 70 0 0 0 650 320" fill="none" stroke="white" strokeWidth="2.5" />
          
          {/* Goal Areas */}
          <rect x="20" y="180" width="40" height="140" fill="none" stroke="white" strokeWidth="2.5" />
          <rect x="740" y="180" width="40" height="140" fill="none" stroke="white" strokeWidth="2.5" />
          
          {/* Goals */}
          <rect x="10" y="210" width="10" height="80" fill="none" stroke="white" strokeWidth="2" />
          <rect x="780" y="210" width="10" height="80" fill="none" stroke="white" strokeWidth="2" />
        </svg>

        {/* Dynamic Action Zone overlay with 3D transform */}
        <div className="absolute inset-0" style={{ transform: 'rotateX(35deg) scale(1.1) translateY(-10%)' }}>
          <div className={`absolute inset-0 transition-opacity duration-1000 ${action === 'DANGEROUS_ATTACK' ? 'opacity-100' : 'opacity-0'}`}>
             <div className={`absolute top-0 bottom-0 w-[40%] bg-gradient-to-r ${team === 'HOME' ? 'from-transparent to-[#ef4444]/40 right-10' : 'from-[#ef4444]/40 to-transparent left-10'} mix-blend-screen blur-md`}></div>
          </div>

          <div className={`absolute inset-0 transition-opacity duration-1000 ${action === 'POSSESSION' ? 'opacity-100' : 'opacity-0'}`}>
             <div className={`absolute top-[20%] bottom-[20%] w-[50%] ${team === 'HOME' ? 'left-[10%]' : 'right-[10%]'} rounded-full bg-[#3b82f6]/20 blur-2xl`}></div>
          </div>
        </div>
        
        {/* Floating Text Indicator - High Tech */}
        <div className={`absolute top-6 left-1/2 -translate-x-1/2 bg-[#0c0e14]/80 backdrop-blur-md border px-5 py-2 rounded-full z-10 transition-all duration-500 flex items-center gap-2.5 shadow-lg ${action === 'DANGEROUS_ATTACK' ? 'border-[#ef4444]/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : action === 'SAFE' ? 'border-[#10b981]/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'border-white/10'}`}>
           <span className="text-white text-[10px] font-bold tracking-wider uppercase whitespace-nowrap">
             {action === 'DANGEROUS_ATTACK' && <span className="text-[#ef4444]">TEHLİKELİ ATAK</span>}
             {action === 'POSSESSION' && <span className="text-zinc-300">TOPLA OYNAMA</span>}
             {action === 'FREE_KICK' && <span className="text-[color:var(--theme-accent)]">SERBEST VURUŞ</span>}
             {action === 'SAFE' && <span className="text-[#10b981]">GÜVENLİ BÖLGE</span>}
           </span>
           <span className="text-zinc-500 text-[9px] whitespace-nowrap">({team === 'HOME' ? 'EV' : 'DEP'})</span>
        </div>
      </div>
    </div>
  );
};
