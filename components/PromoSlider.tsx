import React, { useRef } from 'react';
import { Megaphone, ChevronLeft, ChevronRight } from 'lucide-react';

const Logo21: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <div 
    className="relative overflow-hidden" 
    style={{ 
      width: '125px', 
      height: '38px', 
      animation: 'logo-pulse-glow 4s ease-in-out infinite',
      ...style 
    }}
  >
    <img 
      src="/21com-logo.png" 
      alt="21.com" 
      style={{ 
        width: '100%', 
        height: '100%', 
        objectFit: 'contain' 
      }} 
    />
    <div 
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent" 
      style={{
        maskImage: 'url(/21com-logo.png)',
        WebkitMaskImage: 'url(/21com-logo.png)',
        maskSize: 'contain',
        WebkitMaskSize: 'contain',
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskPosition: 'center',
        pointerEvents: 'none',
        width: '200%',
        height: '100%',
        animation: 'logo-shine 6s cubic-bezier(0.4, 0, 0.2, 1) infinite'
      }}
    />
  </div>
);

interface Promo {
  id: number;
  title1: string;
  title2: string;
  subtitle: string;
  buttonText: string;
  icon: string;
  title2Color?: string;
}

const PROMOS: Promo[] = [
  { id: 1, title1: "30$'A KADAR", title2: "FREE SPIN", subtitle: "Haftanın Oyunu", buttonText: "Hemen Oyna", icon: "🦊" },
  { id: 2, title1: "%30", title2: "NAKİT İADE", subtitle: "İlk Haftanızda. Her Gün.", buttonText: "Yatırım yap", icon: "🤑" },
  { id: 3, title1: "KAZANMA ŞANSI", title2: "$10.000 NAKİT", subtitle: "Dünya Kupası Sandıkları.\nBahis Yap. Kazan. Tekrarla.", buttonText: "Hemen Oyna", icon: "🎁" },
  { id: 4, title1: "BÜYÜK BAŞLA", title2: "7,000$'a kadar", subtitle: "+ 130 Free Spin\nİlk 4 yatırımınızda.", buttonText: "Yatırım yap", icon: "💎" },
  { id: 5, title1: "%100'LE BAŞLA", title2: "SPOR BONUSU", subtitle: "500$'a kadar", buttonText: "Yatırım Yap", icon: "⚽" },
  { id: 6, title1: "DÜNYA KUPASI", title2: "MEGA BOOST", subtitle: "Daha yüksek oranlar.\nDaha büyük kazançlar.", buttonText: "Bahis Yap", icon: "🏆" },
  { id: 7, title1: "%500'E VARAN", title2: "KAZANÇ BOOSTU", subtitle: "ACCA'nı oluştur.\nOranlara meydan oku.", buttonText: "Bahis Yap", icon: "🚀" },
  { id: 8, title1: "DÜNYA KUPASI", title2: "%20 EKSTRA", subtitle: "200$'a Kadar Bonus!", buttonText: "Bahis Yap", icon: "⚡" },
  { id: 9, title1: "APP'İ İNDİR", title2: "40 FREE SPIN AL", subtitle: "21'i yanında taşı.", buttonText: "Şimdi İndir", icon: "📱" },
  { id: 10, title1: "ÇEVİR KAZAN", title2: "5.000$ NAKİT", subtitle: "4 Free Spin. Her gün.", buttonText: "Şimdi Çevir", icon: "🎡" },
  { id: 11, title1: "21 Elite CLUB'A", title2: "HOŞ GELDİNİZ", subtitle: "Yükseldikçe kazan.", buttonText: "Hemen oyna", icon: "🛡️" },
  { id: 12, title1: "HER GÜN", title2: "%10 Bonus", subtitle: "Yatır. Oyna. Kazan.", buttonText: "Yatırım Yap", icon: "🎰" },
  { id: 13, title1: "DAVET ET & KAZAN", title2: "%20 NAKİT", subtitle: "Kazancını arttır.", buttonText: "Hemen Başla", icon: "🤝" },
  { id: 14, title1: "BÜYÜK OYNA", title2: "BİZLE KAL", subtitle: "21 kanallarına katıl.", buttonText: "Hemen katıl", icon: "💬" },
];

export const PromoSlider: React.FC = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = React.useState(false);
  const requestRef = useRef<number | null>(null);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -326, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 326, behavior: 'smooth' });
    }
  };

  const handleCardClick = () => {
    window.open('https://21.com', '_blank');
  };

  // Continuous smooth auto-scrolling
  const animate = () => {
    if (sliderRef.current && !isPaused) {
      const slider = sliderRef.current;
      slider.scrollLeft += 0.8; // Slow continuous speed (pixels per frame)
      
      const halfWidth = slider.scrollWidth / 2;
      if (slider.scrollLeft >= halfWidth) {
        slider.scrollLeft -= halfWidth;
      }
    }
    requestRef.current = requestAnimationFrame(animate);
  };

  React.useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isPaused]);

  // Duplicate promos to create a seamless infinite loop
  const duplicatedPromos = [...PROMOS, ...PROMOS];

  return (
    <div 
      className="relative w-full group/slider mb-6"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Left Navigation Arrow (Visible on Hover) */}
      <button 
        onClick={scrollLeft}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/70 hover:bg-black/90 flex items-center justify-center transition-all opacity-0 group-hover/slider:opacity-100 border border-white/10 hover:scale-105 active:scale-95 shadow-lg"
      >
        <ChevronLeft className="w-5 h-5 text-white" />
      </button>

      {/* Right Navigation Arrow (Visible on Hover) */}
      <button 
        onClick={scrollRight}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/70 hover:bg-black/90 flex items-center justify-center transition-all opacity-0 group-hover/slider:opacity-100 border border-white/10 hover:scale-105 active:scale-95 shadow-lg"
      >
        <ChevronRight className="w-5 h-5 text-white" />
      </button>

      {/* Slider Container */}
      <div 
        ref={sliderRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 select-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style dangerouslySetInnerHTML={{__html: `
          .promo-slider-container::-webkit-scrollbar { display: none; }
          @keyframes logo-shine {
            0% { transform: translateX(-150%) skewX(-25deg); }
            12% { transform: translateX(150%) skewX(-25deg); }
            18% { transform: translateX(-150%) skewX(-25deg); }
            28% { transform: translateX(150%) skewX(-25deg); }
            100% { transform: translateX(150%) skewX(-25deg); }
          }
          @keyframes logo-pulse-glow {
            0%, 100% { filter: drop-shadow(0 2px 4px rgba(0,0,0,0.65)) drop-shadow(0 0 4px rgba(118, 225, 59, 0.2)); }
            50% { filter: drop-shadow(0 4px 8px rgba(0,0,0,0.5)) drop-shadow(0 0 12px rgba(118, 225, 59, 0.6)); }
          }
        `}} />
        
        {duplicatedPromos.map((promo, index) => (
          <div 
            key={`${promo.id}-${index}`}
            onClick={handleCardClick}
            className="snap-start shrink-0 relative bg-[#1a1a1a] rounded-xl border border-[#333] overflow-hidden cursor-pointer group transition-all duration-300 hover:border-[#555] hover:-translate-y-1"
            style={{ width: '310px', height: '160px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
          >
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[#000000] pointer-events-none" />
            
            <div className="relative z-10 p-5 h-full flex flex-col justify-between">
              <div>
                <h3 className="text-white font-black text-lg leading-tight uppercase" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                  {promo.title1}
                </h3>
                <h3 className="font-black text-[17px] leading-tight uppercase" style={{ color: promo.title2Color || '#76e13b', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                  {promo.title2}
                </h3>
                <p className="text-gray-300 text-[11px] mt-1.5 leading-snug whitespace-pre-line font-semibold">
                  {promo.subtitle}
                </p>
              </div>
              
              <div>
                <button className="px-4 py-1.5 border border-[#444] rounded-md text-white text-[11px] font-bold bg-transparent group-hover:bg-[#333] transition-colors">
                  {promo.buttonText}
                </button>
              </div>
            </div>

            {/* 21.com Logo Representation */}
            <div 
              className="absolute right-3.5 bottom-3.5 select-none pointer-events-none transition-transform duration-500"
            >
              <Logo21 />
            </div>
            {/* Reflection on emoji */}
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white/5 to-transparent pointer-events-none" />
          </div>
        ))}
      </div>
    </div>
  );
};
