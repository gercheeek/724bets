import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

const tickerItems = [
  "45 kazandı <span class='text-[#00e676] font-black'>6.00x</span> oyun Kaosun Tangosu",
  "Gizli kazançlar <span class='text-[#00e676] font-black'>5,12x</span> oyun 2'yi birleştirin",
  "olgun ücret kazançları <span class='text-[#00e676] font-black'>166,20x</span> oyun Uçuş Modu",
  "comanteras kazanır <span class='text-[#00e676] font-black'>5,90x</span> oyun Zihinsel 2",
  "Gizli kazançlar <span class='text-[#00e676] font-black'>27.000x</span> oyun Dünya",
  "Vegas Pro kazanır <span class='text-[#00e676] font-black'>12.50x</span> oyun Sweet Bonanza",
];

const promoCards = [
  {
    id: 1,
    title: "BÜYÜK BAS\nPATLAMASI",
    subtitle: "Balık tutma sezonu daha\nda gürültülü hale geldi.",
    image: "https://cdn2.softswiss.net/i/s4/pragmaticexternal/BigBassSplash.png", 
    provider: "PRAGMATIC PLAY"
  },
  {
    id: 2,
    title: "GRUG ATEŞ\nYAKIYOR",
    subtitle: "Orman yangını Grug'la başladı.",
    image: "https://cdn2.softswiss.net/i/s4/hacksaw/WantedDeadoraWild.png", 
    provider: "HACKSAW GAMING"
  },
  {
    id: 3,
    title: "MÖ 3 MİLYON YIL",
    subtitle: "Tarihten önce eylem vardı.",
    image: "https://cdn2.softswiss.net/i/s4/betsoft/PrimalWilderness.png",
    provider: "BETSOFT"
  }
];

export default function GamePromos() {
  const [activeDot, setActiveDot] = useState(4);

  return (
    <div className="w-full flex flex-col mb-8 mt-2 overflow-hidden">
      
      {/* 1. Marquee Ticker */}
      <div className="w-full relative py-2 flex items-center overflow-hidden mb-4 px-4 lg:px-8">
        <div className="flex items-center gap-3 animate-marquee-left whitespace-nowrap w-max">
          {[...tickerItems, ...tickerItems, ...tickerItems].map((item, i) => (
            <div 
              key={i} 
              className="bg-[#1a1721] rounded-full px-4 py-1.5 border border-white/5 flex items-center justify-center shrink-0"
            >
              <span 
                className="text-white/80 text-[11px] font-medium tracking-wide"
                dangerouslySetInnerHTML={{ __html: item }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 2. Promo Cards Carousel */}
      <div className="w-full relative px-4 lg:px-8">
        <div className="flex gap-4 overflow-x-auto hide-scrollbar snap-x scroll-smooth pb-4" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
          {promoCards.map((card) => (
            <div 
              key={card.id}
              className="relative w-full sm:w-[calc(50%-8px)] lg:w-[calc(33.333%-11px)] shrink-0 snap-center rounded-[20px] overflow-hidden cursor-pointer group"
              style={{ backgroundColor: '#1a142c', minHeight: '180px' }}
            >
              {/* Abstract Sweeping Purple Background */}
              <div className="absolute inset-0 z-0">
                <div className="absolute right-[-20%] top-[-10%] w-[80%] h-[120%] bg-[#2a1c4d] rounded-[100%] origin-center group-hover:scale-110 transition-transform duration-700 ease-out"></div>
                <div className="absolute right-[-10%] top-[10%] w-[60%] h-[140%] bg-[#392467] rounded-[100%] origin-center group-hover:scale-105 transition-transform duration-1000 ease-out delay-75"></div>
              </div>

              {/* Content Grid */}
              <div className="relative z-10 w-full h-full flex justify-between p-5">
                
                {/* Left Side: Text and Button */}
                <div className="flex flex-col justify-between items-start w-[55%] h-full z-20">
                  <div className="flex flex-col">
                    <h3 className="text-white font-black text-[18px] leading-[1.1] mb-2 uppercase tracking-wide drop-shadow-md whitespace-pre-line" style={{ fontFamily: "'Outfit', sans-serif" }}>
                      {card.title}
                    </h3>
                    <p className="text-white/60 text-[11px] font-medium leading-snug whitespace-pre-line">
                      {card.subtitle}
                    </p>
                  </div>
                  
                  <button className="mt-4 bg-black/40 hover:bg-black/60 transition-colors backdrop-blur-md border border-white/5 rounded-full pl-2 pr-4 py-1.5 flex items-center gap-2 group/btn">
                    <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                      <ChevronRight className="w-3.5 h-3.5 text-white/80 group-hover/btn:text-white transition-colors" />
                    </div>
                    <span className="text-white/80 font-bold text-[11px] uppercase group-hover/btn:text-white transition-colors">Şimdi Oyna</span>
                  </button>
                </div>

                {/* Right Side: Image and Logo */}
                <div className="absolute right-0 bottom-0 h-[115%] w-[50%] z-10 flex flex-col justify-end items-end pb-3 pr-3">
                  <img 
                    src={card.image} 
                    alt={card.title}
                    className="absolute right-[-10%] bottom-0 w-[120%] h-[100%] object-cover object-bottom transition-transform duration-700 group-hover:scale-110 group-hover:-translate-y-2"
                    style={{ filter: 'drop-shadow(-10px 10px 20px rgba(0,0,0,0.6))' }}
                  />
                  <span className="relative z-20 text-white font-black italic text-[11px] tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] opacity-90 text-right">
                    {card.provider}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 3. Slider Dots */}
        <div className="flex items-center justify-center gap-1.5 mt-2 mb-2">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((dot) => (
            <button
              key={dot}
              onClick={() => setActiveDot(dot)}
              className={`h-1.5 transition-all duration-300 rounded-full ${activeDot === dot ? 'w-6 bg-[#9f50ff]' : 'w-1.5 bg-white/20 hover:bg-white/40'}`}
              aria-label={`Slide ${dot + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
