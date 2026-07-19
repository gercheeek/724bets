import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { AnimatedOdd } from './AnimatedOdd';

export const SportsHeroBanner: React.FC = () => {
  const { language } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);

  // 3 Premium Mock Matches with their respective player cutouts
  const heroMatches = [
    {
      id: 'mock-match-1',
      homeTeam: 'İSPANYA',
      awayTeam: 'ARJANTİN',
      score: '1 - 0',
      minute: "75'",
      isLive: true,
      homeOdd: '1.95',
      drawOdd: '3.40',
      awayOdd: '2.80',
      homePlayerImg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Lamine_Yamal_France_v_Spain_7.24.26-142.jpg/960px-Lamine_Yamal_France_v_Spain_7.24.26-142.jpg',
      awayPlayerImg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Leo_Messi_Argentina_v_Egypt_7_July_2026-1.jpg/960px-Leo_Messi_Argentina_v_Egypt_7_July_2026-1.jpg'
    },
    {
      id: 'mock-match-2',
      homeTeam: 'FRANSA',
      awayTeam: 'PORTEKİZ',
      score: '2 - 2',
      minute: "88'",
      isLive: true,
      homeOdd: '2.45',
      drawOdd: '2.10',
      awayOdd: '4.20',
      homePlayerImg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/2022_FIFA_World_Cup_France_4%E2%80%931_Australia_-_%287%29_%28cropped%29.jpg/800px-2022_FIFA_World_Cup_France_4%E2%80%931_Australia_-_%287%29_%28cropped%29.jpg',
      awayPlayerImg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Cristiano_Ronaldo_playing_for_Al_Nassr_FC_against_Persepolis%2C_September_2023_%28cropped%29.jpg/800px-Cristiano_Ronaldo_playing_for_Al_Nassr_FC_against_Persepolis%2C_September_2023_%28cropped%29.jpg'
    },
    {
      id: 'mock-match-3',
      homeTeam: 'İNGİLTERE',
      awayTeam: 'BREZİLYA',
      score: '0 - 0',
      minute: "12'",
      isLive: true,
      homeOdd: '2.80',
      drawOdd: '3.10',
      awayOdd: '2.30',
      homePlayerImg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Jude_Bellingham_Real_Madrid.jpg/800px-Jude_Bellingham_Real_Madrid.jpg',
      awayPlayerImg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Vinicius_Jr_2021.jpg/800px-Vinicius_Jr_2021.jpg'
    }
  ];

  useEffect(() => {
    if (heroMatches.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % heroMatches.length);
    }, 5000); // Rotate every 5 seconds
    return () => clearInterval(interval);
  }, [heroMatches.length]);

  if (!heroMatches || heroMatches.length === 0) return null;

  const currentMatch = heroMatches[activeIndex] || heroMatches[0];

  return (
    <div className="w-full relative px-4 pt-4 pb-2 group">
      <div className="w-full h-[200px] md:h-[240px] lg:h-[280px] rounded-2xl bg-[#050505] relative overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.8)] border border-white/[0.05] group/banner">
        
        {/* Background Stadium */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50 scale-100 group-hover/banner:scale-105 transition-transform duration-[10s] ease-out"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1518605368461-1e1e38ce8058?auto=format&fit=crop&q=80&w=2000')` }}
        ></div>
        
        {/* Dark Overlays for Cinematic Depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#050505]/95"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/90 via-transparent to-[#050505]/90"></div>
        
        {/* Green/Turquoise Glow behind Text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-[#10b981] opacity-[0.15] blur-[100px] rounded-full pointer-events-none transition-all duration-700"></div>

        {/* Left Player */}
        {currentMatch.homePlayerImg && (
          <div key={`home-${currentMatch.id}`} className="hidden md:block absolute bottom-0 left-0 w-[45%] h-full pointer-events-none z-10 animate-fade-in-right">
             <div 
               className="absolute inset-0 bg-cover bg-top opacity-80 mix-blend-luminosity filter contrast-125"
               style={{
                 backgroundImage: `url('${currentMatch.homePlayerImg}')`,
                 WebkitMaskImage: 'radial-gradient(circle at 40% 40%, black 20%, transparent 70%)',
                 maskImage: 'radial-gradient(circle at 40% 40%, black 20%, transparent 70%)'
               }}
             ></div>
          </div>
        )}

        {/* Right Player */}
        {currentMatch.awayPlayerImg && (
          <div key={`away-${currentMatch.id}`} className="hidden md:block absolute bottom-0 right-0 w-[45%] h-full pointer-events-none z-10 animate-fade-in-left">
             <div 
               className="absolute inset-0 bg-cover bg-top opacity-80 mix-blend-luminosity filter contrast-125"
               style={{
                 backgroundImage: `url('${currentMatch.awayPlayerImg}')`,
                 WebkitMaskImage: 'radial-gradient(circle at 60% 40%, black 20%, transparent 70%)',
                 maskImage: 'radial-gradient(circle at 60% 40%, black 20%, transparent 70%)'
               }}
             ></div>
          </div>
        )}

        {/* Center Content Area */}
        <div key={`content-${currentMatch.id}`} className="absolute inset-0 flex flex-col items-center justify-center z-20 pt-4 pb-4 px-4 animate-fade-in">
          
          {/* Top Tag & Event Name */}
          <div className="flex flex-col items-center gap-2 mb-3 md:mb-4 animate-fade-in-up">
            {currentMatch.isLive && (
              <div className="flex items-center gap-2 md:gap-3 mt-1 bg-black/40 px-4 py-1.5 rounded-full border border-white/5 backdrop-blur-md">
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-500 animate-pulse shadow-[0_0_12px_rgba(239,68,68,1)]"></div>
                <span className="text-base md:text-lg font-black tracking-[0.2em] uppercase text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">
                  {currentMatch.minute}
                </span>
              </div>
            )}
          </div>

          {/* Aggressive Typography for Teams & Score/VS */}
          <div className="flex items-center justify-between w-full max-w-[800px] mb-8 md:mb-10 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            {/* Home Team */}
            <div className="flex-1 flex justify-end">
              <h1 className="text-white font-black text-3xl md:text-5xl lg:text-[56px] uppercase tracking-tighter drop-shadow-[0_15px_25px_rgba(0,0,0,1)] text-right leading-none pb-1 line-clamp-2 max-w-[300px]">
                {currentMatch.homeTeam}
              </h1>
            </div>
            
            {/* Center Score / VS */}
            <div className="flex-shrink-0 mx-4 md:mx-8">
              {(currentMatch.score !== '-' && currentMatch.score.includes(' - ')) ? (
                <div className="flex items-center justify-center gap-3 md:gap-5 bg-gradient-to-b from-black/80 to-black/40 border border-white/10 rounded-2xl px-6 md:px-8 py-3 md:py-4 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.8)] relative overflow-hidden group/score">
                   {/* Inner Glow */}
                   <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-50"></div>
                   <span className="text-white font-black text-4xl md:text-5xl lg:text-[52px] tabular-nums drop-shadow-2xl leading-none relative z-10">{currentMatch.score.split(' - ')[0]}</span>
                   <span className="text-[#36ffc4] font-black text-2xl md:text-3xl drop-shadow-[0_0_15px_rgba(54,255,196,0.5)] leading-none relative z-10">-</span>
                   <span className="text-white font-black text-4xl md:text-5xl lg:text-[52px] tabular-nums drop-shadow-2xl leading-none relative z-10">{currentMatch.score.split(' - ')[1]}</span>
                </div>
              ) : (
                <div className="bg-gradient-to-b from-[#10b981]/20 to-[#10b981]/5 border border-[#10b981]/30 rounded-2xl px-4 py-2 md:px-5 md:py-3 backdrop-blur-md shadow-[0_0_25px_rgba(16,185,129,0.3)]">
                  <span className="text-[#36ffc4] font-black italic text-xl md:text-3xl lg:text-[32px] drop-shadow-[0_0_10px_rgba(54,255,196,0.6)] leading-none">VS</span>
                </div>
              )}
            </div>

            {/* Away Team */}
            <div className="flex-1 flex justify-start">
              <h1 className="text-white font-black text-3xl md:text-5xl lg:text-[56px] uppercase tracking-tighter drop-shadow-[0_15px_25px_rgba(0,0,0,1)] text-left leading-none pb-1 line-clamp-2 max-w-[300px]">
                {currentMatch.awayTeam}
              </h1>
            </div>
          </div>

          {/* Dynamic Odds Buttons (Glassmorphism) */}
          <div className="flex items-center justify-center gap-3 w-full max-w-[600px] animate-fade-in-up" style={{ animationDelay: '300ms' }}>
             {[
               { label: `1 ${currentMatch.homeTeam.substring(0,3)}`, odd: currentMatch.homeOdd || '2.40' },
               { label: 'X', odd: currentMatch.drawOdd || '3.10' },
               { label: `2 ${currentMatch.awayTeam.substring(0,3)}`, odd: currentMatch.awayOdd || '2.80' }
             ].map((btn, idx) => (
               <button 
                 key={idx} 
                 className="flex-1 h-[52px] md:h-[60px] rounded-xl bg-gradient-to-b from-white/[0.08] to-black/40 hover:from-[#10b981]/20 hover:to-black/60 border border-white/[0.08] hover:border-[#36ffc4]/50 backdrop-blur-xl flex flex-col items-center justify-center gap-1 group/odd transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.6)] hover:shadow-[0_0_40px_rgba(54,255,196,0.2)] hover:-translate-y-1 relative overflow-hidden"
               >
                 {/* Inner Glow on Hover */}
                 <div className="absolute inset-0 bg-gradient-to-t from-[#36ffc4]/10 to-transparent opacity-0 group-hover/odd:opacity-100 transition-opacity duration-300"></div>
                 {/* Shine effect */}
                 <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] group-hover/odd:left-[200%] transition-all duration-700 ease-in-out"></div>
                 
                 <span className="text-[#a1a1aa] group-hover/odd:text-[#36ffc4] font-black text-[9px] md:text-[11px] uppercase tracking-[0.1em] md:tracking-[0.2em] transition-colors relative z-10 truncate px-1 w-full text-center">{btn.label}</span>
                 <div className="relative z-10 text-white group-hover/odd:text-white font-black text-base md:text-xl tracking-wider drop-shadow-md">
                   <AnimatedOdd value={btn.odd} />
                 </div>
               </button>
             ))}
          </div>

          {/* Slider Indicators */}
          {heroMatches.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-30">
              {heroMatches.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`h-1.5 rounded-full transition-all duration-500 ${activeIndex === idx ? 'w-6 bg-[#36ffc4] shadow-[0_0_10px_rgba(54,255,196,0.5)]' : 'w-2 bg-white/20'}`}
                />
              ))}
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
};
