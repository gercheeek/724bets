import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    bgImage: 'https://images.unsplash.com/photo-1518605368461-1e1e38ce8058?auto=format&fit=crop&q=80&w=2000', // Stadium
    overlay: 'from-[#4f1a9a]/95 via-[#3a0b76]/80 to-[#1a0b36]/90', // Vibrant purple
    left: {
      title: "FIFA WORLD CUP",
      subtitle: "FİNALİ",
      accent: "DÜNYA KUPASI 2026"
    },
    center: {
      homeTeam: "İspanya",
      homeFlag: "https://flagcdn.com/w80/es.png",
      awayTeam: "Arjantin",
      awayFlag: "https://flagcdn.com/w80/ar.png",
      date: "YARIN, 22:00",
      buttonText: "HEMEN BAHİS YAP"
    },
    right: {
      trophyImage: "https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/1f3c6.svg", // Reliable SVG Trophy
      bonusText: "100.000₺ ÖDÜL"
    }
  },
  {
    id: 2,
    bgImage: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&q=80&w=2000', // Tennis
    overlay: 'from-[#065f46]/95 via-[#047857]/80 to-[#022c22]/90', // Vibrant green/emerald
    left: {
      title: "GRAND SLAM",
      subtitle: "WIMBLEDON",
      accent: "TEK ERKEKLER FİNALİ"
    },
    center: {
      homeTeam: "Alcaraz",
      homeFlag: "https://flagcdn.com/w80/es.png",
      awayTeam: "Djokovic",
      awayFlag: "https://flagcdn.com/w80/rs.png",
      date: "PAZAR, 16:00",
      buttonText: "CANLI İZLE & OYNA"
    },
    right: {
      trophyImage: "https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/1f3be.svg", // Tennis
      bonusText: "VIP AVANTAJLAR"
    }
  },
  {
    id: 3,
    bgImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=2000', // F1 / Racing
    overlay: 'from-[#be123c]/95 via-[#e11d48]/80 to-[#4c0519]/90', // Vibrant Red
    left: {
      title: "FORMULA 1",
      subtitle: "MONACO GP",
      accent: "SEZONUN YARIŞI"
    },
    center: {
      homeTeam: "Verstappen",
      homeFlag: "https://flagcdn.com/w80/nl.png",
      awayTeam: "Leclerc",
      awayFlag: "https://flagcdn.com/w80/mc.png",
      date: "24 TEMMUZ, 15:00",
      buttonText: "EN YÜKSEK ORANLAR"
    },
    right: {
      trophyImage: "https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/1f3ce.svg", // Racing
      bonusText: "%20 KAYIP BONUSU"
    }
  }
];

export const SportsTriptychSlider: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
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
        className="absolute left-6 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity z-30 hover:bg-[#10b981] hover:border-[#10b981]"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button 
        onClick={handleNext}
        className="absolute right-6 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity z-30 hover:bg-[#10b981] hover:border-[#10b981]"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Triptych Container */}
      <div className="flex flex-col md:flex-row gap-2 h-auto md:h-[180px] lg:h-[220px]">
        
        {/* Left Panel */}
        <div 
          className="flex-1 md:flex-none md:w-[30%] lg:w-[28%] rounded-2xl bg-cover bg-no-repeat relative overflow-hidden shadow-2xl transition-all duration-700 h-[140px] md:h-full border border-white/5"
          style={{ backgroundImage: `url(${slide.bgImage})`, backgroundPosition: '0% 50%', backgroundSize: '300% 100%' }}
        >
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.overlay} backdrop-blur-[2px] transition-colors duration-700`}></div>
          <div className="absolute inset-0 p-5 md:p-6 flex flex-col justify-center animate-fade-in-up">
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-[10px] font-bold tracking-widest w-fit mb-3 border border-white/30 backdrop-blur-md">
              {slide.left.accent}
            </span>
            <h2 className="text-white font-black text-xl md:text-2xl lg:text-3xl leading-none tracking-tight">
              {slide.left.title}
            </h2>
            <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 font-black text-2xl md:text-3xl lg:text-4xl leading-none mt-1">
              {slide.left.subtitle}
            </h2>
          </div>
        </div>

        {/* Center Panel */}
        <div 
          className="flex-1 rounded-2xl bg-cover bg-no-repeat relative overflow-hidden shadow-2xl transition-all duration-700 h-[200px] md:h-full border border-white/10"
          style={{ backgroundImage: `url(${slide.bgImage})`, backgroundPosition: '50% 50%', backgroundSize: '300% 100%' }}
        >
          <div className={`absolute inset-0 bg-gradient-to-t ${slide.overlay} backdrop-blur-[1px] transition-colors duration-700`}></div>
          
          <div className="absolute inset-0 p-4 flex flex-col items-center justify-between animate-fade-in-up">
            
            {/* Flags & Teams */}
            <div className="flex items-center justify-center gap-4 md:gap-8 w-full mt-2">
              <div className="flex flex-col items-center gap-2 flex-1">
                <img src={slide.center.homeFlag} alt={slide.center.homeTeam} className="w-12 h-8 md:w-16 md:h-11 rounded-sm object-cover shadow-lg border border-white/10" />
                <span className="text-white font-bold text-sm md:text-base">{slide.center.homeTeam}</span>
              </div>
              
              <div className="flex flex-col items-center justify-center shrink-0">
                <span className="text-[#10b981] font-black text-xl italic drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">VS</span>
                <span className="text-gray-400 text-[10px] font-bold tracking-widest mt-1">{slide.center.date}</span>
              </div>

              <div className="flex flex-col items-center gap-2 flex-1">
                <img src={slide.center.awayFlag} alt={slide.center.awayTeam} className="w-12 h-8 md:w-16 md:h-11 rounded-sm object-cover shadow-lg border border-white/10" />
                <span className="text-white font-bold text-sm md:text-base">{slide.center.awayTeam}</span>
              </div>
            </div>

            {/* CTA Button */}
            <button className="w-full max-w-[240px] h-10 md:h-12 bg-gradient-to-r from-[#ffd700] to-[#ffaa00] rounded-xl flex items-center justify-center gap-2 text-black font-black text-sm md:text-base tracking-wider shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:scale-105 transition-transform">
              <Play className="w-4 h-4 fill-black" />
              {slide.center.buttonText}
            </button>

          </div>
        </div>

        {/* Right Panel */}
        <div 
          className="flex-1 md:flex-none md:w-[30%] lg:w-[28%] rounded-2xl bg-cover bg-no-repeat relative overflow-hidden shadow-2xl transition-all duration-700 h-[140px] md:h-full border border-white/5"
          style={{ backgroundImage: `url(${slide.bgImage})`, backgroundPosition: '100% 50%', backgroundSize: '300% 100%' }}
        >
          <div className={`absolute inset-0 bg-gradient-to-l ${slide.overlay} backdrop-blur-[2px] transition-colors duration-700`}></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center animate-fade-in-up">
            <div className="w-16 h-16 md:w-24 md:h-24 relative">
               <div className="absolute inset-0 bg-white opacity-20 blur-2xl rounded-full"></div>
               <img src={slide.right.trophyImage} alt="Trophy" className="w-full h-full object-contain relative z-10 drop-shadow-2xl filter brightness-110" />
            </div>
            <div className="mt-3 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
              <span className="text-white font-bold tracking-widest text-xs md:text-sm">{slide.right.bonusText}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Indicators */}
      <div className="flex justify-center gap-2 mt-3">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIdx(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ${activeIdx === idx ? 'w-6 bg-[#10b981]' : 'w-1.5 bg-white/20'}`}
          />
        ))}
      </div>
    </div>
  );
};
