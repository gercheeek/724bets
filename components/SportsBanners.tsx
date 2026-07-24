import React, { useState, useEffect } from 'react';

const banners = [
  {
    id: 'slots',
    bgImage: '/images/slots_banner_purple.jpg',
    title: <><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D946EF] to-[#8B5CF6]">Slot Oyna</span> & Kazan</>,
    subtitle: 'Tüm yatırım yöntemleri geçerli. Hemen Al!',
    buttonText: 'KAYIT OL',
    accentColor: 'from-[#D946EF]/20 to-[#8B5CF6]/20',
    borderColor: 'border-[#D946EF]',
    hoverBg: 'hover:bg-[#D946EF]/10',
    shadow: 'shadow-[#D946EF]/10',
    hoverShadow: 'hover:shadow-[#D946EF]/30',
  },
  {
    id: 'basketball',
    bgImage: '/images/basketball_banner_blue.jpg',
    title: <><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10b981] to-[#34d399]">5000$</span> Hoş Geldin</>,
    subtitle: 'Spor bahislerinde geçerli dev bonus seni bekliyor!',
    buttonText: 'KAYIT OL',
    accentColor: 'from-[#10b981]/20 to-[#34d399]/20',
    borderColor: 'border-[#10b981]',
    hoverBg: 'hover:bg-[#10b981]/10',
    shadow: 'shadow-[#10b981]/10',
    hoverShadow: 'hover:shadow-[#10b981]/30',
  },
  {
    id: 'treasure',
    bgImage: '/images/treasure_banner_teal.jpg',
    title: <><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#14B8A6] to-[#2DD4BF]">Hazineyi</span> Keşfet</>,
    subtitle: 'Casino ve spor lobilerinde şansını katla!',
    buttonText: 'KAYIT OL',
    accentColor: 'from-[#14B8A6]/20 to-[#2DD4BF]/20',
    borderColor: 'border-[#14B8A6]',
    hoverBg: 'hover:bg-[#14B8A6]/10',
    shadow: 'shadow-[#14B8A6]/10',
    hoverShadow: 'hover:shadow-[#14B8A6]/30',
  },
  {
    id: 'crypto_vip',
    bgImage: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=800&auto=format&fit=crop',
    title: <><span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-600 drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]">KRİPTOYA ÖZEL</span> %300 BONUS</>,
    subtitle: <span className="text-[#94a3b8]">Kripto ile yatır, limitlere takılma, <span className="text-[#00E701] font-bold drop-shadow-[0_0_8px_rgba(0,231,1,0.5)]">%300 bonusu kap!</span></span>,
    buttonText: 'HEMEN YATIR',
    accentColor: 'from-yellow-500/20 to-amber-600/20',
    borderColor: 'border-yellow-500',
    hoverBg: 'hover:bg-yellow-500/10',
    shadow: 'shadow-yellow-500/20',
    hoverShadow: 'hover:shadow-yellow-500/40',
  }
];

const SportsBanners: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % banners.length);
    }, 5000); // 5 seconds per slide for premium feel
    return () => clearInterval(timer);
  }, []);

  const handleRegisterClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.dispatchEvent(new CustomEvent('openAuthModal', { detail: 'register' }));
  };

  const renderBannerContent = (banner: any) => (
    <>
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0 flex justify-end">
        <div className="w-[90%] md:w-[75%] h-full relative">
          {/* Soft mask to blend the left edge of the image smoothly */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/60 to-transparent z-10 w-[50%] md:w-[40%]"></div>
          
          <img 
            src={banner.bgImage} 
            alt="Banner" 
            className="w-full h-full object-cover object-center md:object-right transform group-hover:scale-105 transition-transform duration-[1500ms] ease-out"
          />
        </div>
        
        {/* Global Dark Gradient to guarantee text readability on the left */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/40 to-transparent z-10 w-full"></div>
        
        {/* Colored Ambient Glow based on banner theme */}
        <div className={`absolute inset-0 bg-gradient-to-br ${banner.accentColor} opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10 mix-blend-screen`}></div>
      </div>

      {/* Content */}
      <div className="relative z-20 p-6 md:p-12 flex flex-col justify-center h-full w-[95%] md:w-[60%] lg:w-[50%] gap-3 bg-gradient-to-r from-[#050505] via-[#050505]/80 to-transparent">
        <div className="flex flex-col transform group-hover:translate-x-2 transition-transform duration-700">
          <h3 className="text-white text-[24px] md:text-[40px] lg:text-[48px] font-black leading-[1.1] mb-2 md:mb-4 font-['Outfit'] drop-shadow-lg tracking-tight">
            {banner.title}
          </h3>
          <p className="text-[#cbd5e1] text-[12px] md:text-[15px] lg:text-[16px] font-medium leading-relaxed drop-shadow-md">
            {banner.subtitle}
          </p>
        </div>
        
        <div className="mt-2 md:mt-4 transform group-hover:translate-x-2 transition-transform duration-700 delay-75">
          <button 
            onClick={handleRegisterClick}
            className={`relative overflow-hidden group/btn bg-black/60 border border-white/20 hover:${banner.borderColor} ${banner.hoverBg} text-white font-bold px-8 py-3 md:px-10 md:py-4 text-[12px] md:text-[14px] tracking-[0.15em] rounded-xl transition-all duration-300 shadow-lg ${banner.hoverShadow} flex items-center justify-center uppercase w-max`}
          >
            <span className="relative z-10">{banner.buttonText}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="w-full relative h-[200px] md:h-[280px] lg:h-[340px] rounded-[20px] overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.6)] border border-white/5 bg-[#050505]">
      {banners.map((banner, index) => (
        <div 
          key={banner.id}
          onClick={handleRegisterClick}
          className={`absolute inset-0 w-full h-full cursor-pointer transition-opacity duration-1000 ease-in-out group ${
            index === activeIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
           {renderBannerContent(banner)}
        </div>
      ))}
      
      {/* Premium Pagination Dots */}
      <div className="absolute bottom-4 md:bottom-6 left-6 md:left-12 flex gap-2 z-30">
        {banners.map((_, idx) => (
           <button 
             key={idx} 
             onClick={(e) => { e.stopPropagation(); setActiveIndex(idx); }}
             className={`h-1.5 md:h-2 rounded-full transition-all duration-500 ${
               idx === activeIndex 
                 ? 'w-8 md:w-12 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]' 
                 : 'w-2 bg-white/30 hover:bg-white/60'
             }`} 
           />
        ))}
      </div>
    </div>
  );
};

export default SportsBanners;
