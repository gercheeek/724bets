import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    bgImage: 'https://images.unsplash.com/photo-1518605368461-1e1e38ce8058?auto=format&fit=crop&q=80&w=2000',
    left: { title: "FIFA WORLD CUP", subtitle: "FINAL" },
    center: { homeTeam: "Spain", homeFlag: "https://flagcdn.com/w160/es.png", awayTeam: "Argentina", awayFlag: "https://flagcdn.com/w160/ar.png", buttonText: "BET NOW" },
    right: { trophyImage: "https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/1f3c6.svg" }
  },
  {
    id: 2,
    bgImage: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&q=80&w=2000',
    left: { title: "GRAND SLAM", subtitle: "WIMBLEDON" },
    center: { homeTeam: "Alcaraz", homeFlag: "https://flagcdn.com/w160/es.png", awayTeam: "Djokovic", awayFlag: "https://flagcdn.com/w160/rs.png", buttonText: "BET NOW" },
    right: { trophyImage: "https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/1f3be.svg" }
  },
  {
    id: 3,
    bgImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=2000',
    left: { title: "FORMULA 1", subtitle: "MONACO GP" },
    center: { homeTeam: "Verstappen", homeFlag: "https://flagcdn.com/w160/nl.png", awayTeam: "Leclerc", awayFlag: "https://flagcdn.com/w160/mc.png", buttonText: "BET NOW" },
    right: { trophyImage: "https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/1f3ce.svg" }
  }
];

export const SportsTriptychSlider: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[activeIdx];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIdx((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIdx((prev) => (prev + 1) % SLIDES.length);
  };

  return (
    <div className="w-full relative px-4 pt-4 pb-2 group">
      
      {/* Slider Controls */}
      <button 
        onClick={handlePrev}
        className="absolute left-6 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity z-30 hover:bg-[#a855f7] hover:border-[#a855f7]"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button 
        onClick={handleNext}
        className="absolute right-6 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity z-30 hover:bg-[#a855f7] hover:border-[#a855f7]"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Triptych Container */}
      <div className="flex flex-col md:flex-row gap-[6px] h-auto md:h-[180px] lg:h-[220px]">
        
        {/* Left Panel */}
        <div 
          key={`left-${slide.id}`}
          className="flex-1 md:flex-none md:w-[32%] rounded-xl bg-no-repeat relative overflow-hidden shadow-2xl h-[140px] md:h-full border border-black/80 border-t-white/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] animate-fade-in-up group/panel cursor-pointer"
          style={{ 
            backgroundImage: `linear-gradient(to right, rgba(79,26,154,0.95) 0%, rgba(139,92,246,0.6) 50%, rgba(26,11,54,0.95) 100%), url(${slide.bgImage})`, 
            backgroundPosition: '0% 50%', 
            backgroundSize: '300% 100%' 
          }}
        >
          {/* Content */}
          <div className="absolute inset-0 p-5 md:p-8 flex flex-col justify-center items-start group-hover/panel:scale-105 transition-transform duration-700 ease-out">
            <h2 className="text-white font-black text-2xl md:text-[28px] lg:text-[34px] leading-none tracking-tighter uppercase drop-shadow-md">
              {slide.left.title}
            </h2>
            <h2 className="text-white font-black text-4xl md:text-5xl lg:text-6xl leading-none tracking-tighter uppercase mt-1 drop-shadow-lg">
              {slide.left.subtitle}
            </h2>
          </div>
        </div>

        {/* Center Panel */}
        <div 
          key={`center-${slide.id}`}
          className="flex-1 rounded-xl bg-no-repeat relative overflow-hidden shadow-2xl h-[200px] md:h-full border border-black/80 border-t-white/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] animate-fade-in-up group/panel cursor-pointer"
          style={{ 
            backgroundImage: `linear-gradient(to right, rgba(79,26,154,0.95) 0%, rgba(139,92,246,0.6) 50%, rgba(26,11,54,0.95) 100%), url(${slide.bgImage})`, 
            backgroundPosition: '50% 50%', 
            backgroundSize: '300% 100%' 
          }}
        >
          {/* Content */}
          <div className="absolute inset-0 p-4 flex flex-col items-center justify-center mt-2 group-hover/panel:scale-[1.02] transition-transform duration-700 ease-out">
            
            {/* Flags & Teams */}
            <div className="flex items-center justify-center gap-6 w-full">
              <div className="flex flex-col items-center gap-2.5 flex-1">
                <img src={slide.center.homeFlag} alt={slide.center.homeTeam} className="w-[70px] h-[46px] rounded-[3px] object-cover shadow-[0_5px_15px_rgba(0,0,0,0.5)] border border-white/10" />
                <span className="text-white font-bold italic text-[15px] tracking-wide">{slide.center.homeTeam}</span>
              </div>
              
              <div className="flex flex-col items-center justify-center shrink-0 mb-6">
                <span className="text-[#ffd700] font-black text-[22px] italic drop-shadow-[0_0_15px_rgba(255,215,0,0.5)] tracking-widest">VS</span>
              </div>

              <div className="flex flex-col items-center gap-2.5 flex-1">
                <img src={slide.center.awayFlag} alt={slide.center.awayTeam} className="w-[70px] h-[46px] rounded-[3px] object-cover shadow-[0_5px_15px_rgba(0,0,0,0.5)] border border-white/10" />
                <span className="text-white font-bold italic text-[15px] tracking-wide">{slide.center.awayTeam}</span>
              </div>
            </div>

            {/* Solid Yellow CTA Button with Shine Effect */}
            <button className="relative overflow-hidden mt-5 w-[160px] h-10 bg-[#ffd700] rounded-[6px] text-black font-black text-[13px] tracking-widest shadow-[0_5px_20px_rgba(255,215,0,0.3)] hover:scale-110 transition-transform duration-300 uppercase group/btn">
              <span className="relative z-10">{slide.center.buttonText}</span>
              <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/60 to-transparent skew-x-[-20deg] group-hover/btn:left-[200%] transition-all duration-700 ease-in-out"></div>
            </button>

          </div>
        </div>

        {/* Right Panel */}
        <div 
          key={`right-${slide.id}`}
          className="flex-1 md:flex-none md:w-[32%] rounded-xl bg-no-repeat relative overflow-hidden shadow-2xl h-[140px] md:h-full border border-black/80 border-t-white/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] animate-fade-in-up group/panel cursor-pointer"
          style={{ 
            backgroundImage: `linear-gradient(to right, rgba(79,26,154,0.95) 0%, rgba(139,92,246,0.6) 50%, rgba(26,11,54,0.95) 100%), url(${slide.bgImage})`, 
            backgroundPosition: '100% 50%', 
            backgroundSize: '300% 100%' 
          }}
        >
          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
             {/* Huge SVG emoji dropping shadow to look 3D, floats on hover */}
             <img 
               src={slide.right.trophyImage} 
               alt="Trophy" 
               className="h-[100px] md:h-[150px] object-contain relative z-10 filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)] group-hover/panel:-translate-y-3 group-hover/panel:scale-110 group-hover/panel:drop-shadow-[0_25px_35px_rgba(0,0,0,0.8)] transition-all duration-700 ease-out" 
             />
          </div>
        </div>

      </div>

      {/* Indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIdx(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ${activeIdx === idx ? 'w-8 bg-[#a855f7]' : 'w-2 bg-white/20'}`}
          />
        ))}
      </div>
    </div>
  );
};
