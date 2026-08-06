import React, { useState, useEffect } from 'react';
import { Crown, UserPlus, Trophy, Users, ChevronRight, Play } from 'lucide-react';
import { PlayerLogo } from './sports/PlayerLogo';

interface EsportsPromoBannerProps {
  onRegisterClick?: () => void;
  onViewChange?: (view: string) => void;
}

export default function EsportsPromoBanner({ onRegisterClick, onViewChange }: EsportsPromoBannerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 3;

  // Maç geri sayımı (Örnek: 2 saat 14 dk 59 sn)
  const [countdown, setCountdown] = useState({ h: 2, m: 14, s: 59 });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const countdownTimer = setInterval(() => {
      setCountdown(prev => {
        let { h, m, s } = prev;
        if (h === 0 && m === 0 && s === 0) return { h: 2, m: 14, s: 59 };
        s--;
        if (s < 0) {
          s = 59;
          m--;
          if (m < 0) {
            m = 59;
            h--;
          }
        }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(countdownTimer);
  }, []);

  const renderSlide0 = () => (
    <div className="w-full h-full relative overflow-hidden bg-[#0A101D] group cursor-pointer" onClick={onRegisterClick}>
      <img 
        src="/images/esports_team_wide_final.jpg" 
        alt="724bets Esports Team" 
        className="w-full h-full object-cover object-[center_top] opacity-100 transition-transform duration-1000 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-500 pointer-events-none"></div>
    </div>
  );

  const topMatches = [
    { id: 1, home: 'Galatasaray', away: 'Fenerbahçe', time: 'Bugün 20:00', odds: { '1': '2.10', 'X': '3.20', '2': '2.80' } },
    { id: 2, home: 'Real Madrid', away: 'Barcelona', time: 'Bugün 22:30', odds: { '1': '1.95', 'X': '3.50', '2': '3.40' } },
    { id: 3, home: 'Manchester City', away: 'Arsenal', time: 'Yarın 19:30', odds: { '1': '1.80', 'X': '3.60', '2': '4.10' } }
  ];

  const renderSlide1 = () => {
    const match = topMatches[0];
    
    return (
      <div className="w-full h-full flex flex-col bg-[#0A101D] overflow-hidden relative group cursor-pointer transition-colors duration-500 hover:bg-[#0c1322]" onClick={onRegisterClick}>
        
        {/* Backgrounds */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#10B981]/15 via-[#0A101D] to-[#0A101D] z-0 pointer-events-none" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#10B981]/5 rounded-full blur-[120px] z-0 pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:25px_25px] pointer-events-none z-0"></div>

        {/* Featured Countdown Badge */}
        <div className="absolute top-2 md:top-4 left-1/2 -translate-x-1/2 z-20 bg-gradient-to-r from-[#10b981]/20 to-[#059669]/10 border border-[#10b981]/40 rounded-b-xl md:rounded-lg px-6 py-1.5 md:py-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center gap-3 backdrop-blur-md">
           <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
           <span className="text-white font-black text-[12px] md:text-[16px] tracking-[0.2em] font-mono tabular-nums drop-shadow-md">
             {String(countdown.h).padStart(2, '0')}:{String(countdown.m).padStart(2, '0')}:{String(countdown.s).padStart(2, '0')}
           </span>
        </div>

        {/* Main Content - Full Height */}
        <div className="w-full h-full flex flex-row items-center justify-center p-4 md:px-16 md:pt-8 md:pb-4 z-10 max-w-[1000px] mx-auto">
            
            {/* Odds Column (Left) */}
            <div className="flex flex-col justify-center gap-3 md:gap-4 pr-6 md:pr-12 border-r border-white/10 w-[130px] md:w-[170px] shrink-0 h-full">
              <div className="flex flex-col">
                <span className="text-[9px] md:text-[10px] text-gray-400 font-bold uppercase tracking-widest truncate mb-0.5">{match.home}</span>
                <span className="text-white font-black text-[20px] md:text-[24px] leading-none drop-shadow-md text-[#10b981]">{match.odds['1']}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] md:text-[10px] text-gray-400 font-bold uppercase tracking-widest truncate mb-0.5">BERABERE</span>
                <span className="text-white font-black text-[20px] md:text-[24px] leading-none drop-shadow-md">{match.odds['X']}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] md:text-[10px] text-gray-400 font-bold uppercase tracking-widest truncate mb-0.5">{match.away}</span>
                <span className="text-white font-black text-[20px] md:text-[24px] leading-none drop-shadow-md">{match.odds['2']}</span>
              </div>
            </div>

            {/* Teams & Logos (Right) */}
            <div className="flex flex-row items-center justify-center gap-5 md:gap-10 flex-1 h-full py-1">
              
              {/* Home */}
              <div className="flex flex-col items-center gap-2 md:gap-3">
                <div className="w-20 h-20 md:w-24 md:h-24 relative transition-transform duration-500 group-hover:scale-110 drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]">
                  <PlayerLogo name={match.home} sport="soccer" />
                </div>
                <div className="bg-black/60 border border-white/10 rounded-full px-4 md:px-5 py-1 md:py-1.5 shadow-inner">
                  <span className="text-gray-200 font-black text-[9px] md:text-[12px] uppercase tracking-widest truncate block max-w-[90px] md:max-w-[140px] text-center group-hover:text-white transition-colors">{match.home}</span>
                </div>
              </div>
              
              {/* VS */}
              <div className="flex flex-col items-center gap-1 md:gap-2 relative">
                 <span className="text-[#10b981] font-black text-[10px] md:text-[11px] tracking-[0.2em] uppercase drop-shadow-[0_0_8px_rgba(16,185,129,0.5)] absolute -top-6 md:-top-8 whitespace-nowrap">
                  {match.time}
                 </span>
                 <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-[#1A233A] to-[#0A101D] border border-white/10 rounded-xl flex items-center justify-center rotate-45 shadow-[0_0_20px_rgba(0,0,0,0.6)] group-hover:border-[#10b981]/50 transition-colors">
                    <span className="text-white font-black text-[16px] md:text-[18px] italic -rotate-45 block transform opacity-90 drop-shadow-lg">VS</span>
                 </div>
              </div>

              {/* Away */}
              <div className="flex flex-col items-center gap-2 md:gap-3">
                <div className="w-20 h-20 md:w-24 md:h-24 relative transition-transform duration-500 group-hover:scale-110 drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]">
                  <PlayerLogo name={match.away} sport="soccer" />
                </div>
                <div className="bg-black/60 border border-white/10 rounded-full px-4 md:px-5 py-1 md:py-1.5 shadow-inner">
                  <span className="text-gray-200 font-black text-[9px] md:text-[12px] uppercase tracking-widest truncate block max-w-[90px] md:max-w-[140px] text-center group-hover:text-white transition-colors">{match.away}</span>
                </div>
              </div>

            </div>
            
        </div>
      </div>
    );
  };

  const slides = [renderSlide0, renderSlide1];

  return (
    <div className="w-full relative overflow-hidden bg-[#24262b] rounded-md md:rounded-[12px] mt-2 mb-4 border border-white/5 shadow-2xl h-[380px] md:h-[220px] xl:h-[240px]">
       
       <div 
          className="flex transition-transform duration-700 ease-in-out h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
       >
         {slides.map((renderSlide, idx) => (
           <div key={idx} className="w-full h-full shrink-0 relative">
             {renderSlide()}
           </div>
         ))}
       </div>
       
       {/* Pagination Dots */}
       <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-30">
         {slides.map((_, i) => (
           <button 
             key={i} 
             onClick={() => setCurrentSlide(i)} 
             className={`h-2 rounded-full transition-all duration-300 ${currentSlide === i ? 'bg-white w-6 shadow-[0_0_10px_white]' : 'bg-white/30 w-2 hover:bg-white/50'}`} 
             aria-label={`Slide ${i + 1}`}
           />
         ))}
       </div>
       
    </div>
  );
}

