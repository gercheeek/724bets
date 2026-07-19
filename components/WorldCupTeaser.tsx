import React, { useState, useEffect } from 'react';

interface WorldCupTeaserProps {
  onMatchClick?: (matchId: string) => void;
}

const slides = [
  {
    id: 'iphone',
    bgImage: 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?q=80&w=2000&auto=format&fit=crop',
    title: <><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#06b6d4] to-[#00B273]">iPhone 17 Pro Max</span> Çekilişi</>,
    subtitle: 'Yepyeni bir iPhone 17 Pro Max 256GB kazanma şansı için çekilişe hemen katılın!',
    buttonText: 'ŞİMDİ KATIL',
    statsLabel: 'Son Katılan',
    statsValue: 'MUZTAVASU'
  },
  {
    id: 'worldcup-double',
    bgImage: '/images/football_macro_hero.jpg',
    title: <><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10b981] to-[#34d399]">DÜNYA KUPASI 2026</span></>,
    subtitle: 'KÂRINIZI İKİYE KATLAYIN! Herhangi bir oyuncuya gol atar bahsi alın, ilk golü o atarsa kazancınızı ikiye katlayalım!',
    buttonText: 'ŞİMDİ OYNA',
    statsLabel: 'Maksimum Ödül',
    statsValue: '1000$'
  },
  {
    id: 'mlb-promo',
    bgImage: 'https://images.unsplash.com/photo-1508344928928-7137b29de216?q=80&w=2000&auto=format&fit=crop',
    title: <><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EF4444] to-[#F87171]">MLB PROMOSYONU</span></>,
    subtitle: 'KÂRINI İKİYE KATLA! Taraf bahsi alın, maç 8.5 sayının üzerinde biterse kârınızı anında ikiye katlayalım!',
    buttonText: 'BAHİS YAP',
    statsLabel: 'Maksimum Ödül',
    statsValue: '500$'
  }
];

const WorldCupTeaser: React.FC<WorldCupTeaserProps> = ({ onMatchClick }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === 0 ? 1 : 0));
    }, 5000); // 5 seconds per slide
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full flex flex-col gap-6 font-sans h-full">
      
      {/* HERO BANNER SLIDER */}
      <div className="w-full rounded-2xl overflow-hidden relative flex flex-col md:flex-row items-center min-h-[140px] md:min-h-[160px] h-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 group cursor-pointer">
        
        {/* Continuous Motion Style */}
        <style>{`
          @keyframes continuousPan {
            0% { transform: scale(1.15) translate(-2%, -1%); }
            50% { transform: scale(1.15) translate(2%, 1%); }
            100% { transform: scale(1.15) translate(-2%, -1%); }
          }
          .animate-pan {
            animation: continuousPan 20s linear infinite;
          }
        `}</style>

        {slides.map((slide, index) => (
          <div 
            key={slide.id} 
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            {/* Background Image & Overlay */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <div className="w-full h-full transform group-hover:scale-[1.15] transition-transform duration-1000 ease-out">
                <img 
                  src={slide.bgImage} 
                  alt={slide.id} 
                  className="w-full h-full object-cover object-center animate-pan"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/90 to-[#050505]/20 group-hover:from-[#050505] group-hover:via-[#050505]/80 group-hover:to-transparent transition-colors duration-500"></div>
              {/* Neon Green Glow Effect */}
              <div className="absolute top-0 left-0 w-1/2 h-full bg-[#06b6d4]/5 blur-[100px] pointer-events-none"></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between w-full p-4 md:p-8 lg:px-10 h-full gap-4 md:gap-0">
              
              {/* Title Area */}
              <div className="flex flex-col text-center md:text-left max-w-md transform group-hover:translate-x-2 transition-transform duration-500 w-full md:w-auto">
                <h2 className="text-white text-xl sm:text-2xl md:text-3xl lg:text-[34px] font-black tracking-tight leading-tight md:leading-none drop-shadow-lg mb-1 md:mb-2 font-['Outfit']">
                  {slide.title}
                </h2>
                <p className="text-[#848B9D] font-medium text-xs sm:text-sm mt-1 md:mt-2">
                  {slide.subtitle}
                </p>
              </div>

              {/* Action Area */}
              <div className="flex flex-col items-center md:items-end gap-3 md:gap-4 w-full md:w-auto shrink-0 transform group-hover:-translate-x-2 transition-transform duration-500">
                {/* Action Row */}
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      window.dispatchEvent(new CustomEvent('openAuthModal', { detail: 'register' }));
                    }}
                    className="relative overflow-hidden group/btn bg-transparent border-2 border-[#06b6d4] hover:bg-[#06b6d4]/10 text-white font-black px-8 h-10 md:h-12 text-[11px] sm:text-xs tracking-[0.15em] rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(0,255,163,0.1)] hover:shadow-[0_0_25px_rgba(0,255,163,0.3)] hover:-translate-y-0.5 flex items-center justify-center uppercase w-full md:w-auto"
                  >
                    <span className="relative z-10 flex items-center justify-center h-full pt-[2px]">{slide.buttonText}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#06b6d4]/20 to-transparent -translate-x-[100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Slider Controls / Indicators */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          {slides.map((_, idx) => (
            <button 
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentSlide(idx);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${currentSlide === idx ? 'w-6 bg-[#06b6d4]' : 'w-2 bg-white/20 hover:bg-white/40'}`}
            />
          ))}
        </div>
      </div>

    </div>
  );
};

export default WorldCupTeaser;
