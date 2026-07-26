import React, { useState, useEffect } from 'react';

const banners = [
  {
    id: 'slots',
    bgImage: '/images/mosaic_casino_bg.jpg',
    title: <><span className="text-[#10B981]">Slot Oyna</span> & Kazan</>,
    subtitle: 'Tüm yatırım yöntemleri geçerli. Hemen Al!',
    buttonText: 'KAYIT OL',
    hoverShadow: 'hover:shadow-[#10B981]/30',
  },
  {
    id: 'sports',
    bgImage: '/images/sports_bg_premium.jpg',
    title: <><span className="text-white">5000$</span> <span className="text-blue-500">Hoş Geldin</span></>,
    subtitle: 'Spor bahislerinde geçerli dev bonus seni bekliyor!',
    buttonText: 'KAYIT OL',
    hoverShadow: 'hover:shadow-blue-500/30',
  },
  {
    id: 'vip',
    bgImage: '/images/vip_casino_card.jpg',
    title: <><span className="text-yellow-500">VIP</span> Ayrıcalıkları</>,
    subtitle: 'Sana özel bonuslar ve nakit iade fırsatları!',
    buttonText: 'KEŞFET',
    hoverShadow: 'hover:shadow-yellow-500/30',
  },
  {
    id: 'crypto_vip',
    bgImage: '/images/bitcoin_hero_banner.jpg',
    title: <><span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-600 drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]">KRİPTOYA ÖZEL</span> %300 BONUS</>,
    subtitle: <span className="text-[#94a3b8]">Kripto ile yatır, limitlere takılma, <span className="text-white font-black drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">%300 bonusu kap!</span></span>,
    buttonText: 'HEMEN YATIR',
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
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full relative">
          {/* Strong mask on the left to cover the image under the text */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f18] via-[#0a0f18]/90 to-transparent z-10 w-[80%] md:w-[60%]"></div>
          
          <img 
            src={banner.bgImage} 
            alt="Banner" 
            className="w-full h-full object-cover object-center md:object-right transform group-hover:scale-105 transition-transform duration-[1500ms] ease-out opacity-80"
          />
        </div>
        
        {/* Global Dark Gradient to guarantee text readability on the left */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f18] via-[#0a0f18]/60 to-transparent z-10 w-full"></div>
      </div>

      {/* Content */}
      <div className="relative z-20 p-5 md:p-8 flex flex-col justify-center h-full w-[95%] md:w-[70%] lg:w-[50%] gap-2">
        <div className="flex flex-col transform group-hover:translate-x-2 transition-transform duration-700">
          <h3 className="text-white text-[24px] md:text-[32px] lg:text-[40px] font-black leading-[1.1] mb-1.5 md:mb-2 font-['Outfit'] drop-shadow-lg tracking-tight">
            {banner.title}
          </h3>
          <p className="text-[#cbd5e1] text-[12px] md:text-[14px] lg:text-[15px] font-medium leading-relaxed drop-shadow-md">
            {banner.subtitle}
          </p>
        </div>
      </div>
    </>
  );

  return (
    <div className="w-full relative h-[130px] md:h-[160px] lg:h-[180px] rounded-[20px] overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.4)] border border-white/[0.03] bg-[#0a0f18]">
      {banners.map((banner, index) => (
        <div 
          key={banner.id}
          onClick={handleRegisterClick}
          className={`absolute inset-0 w-full h-full cursor-pointer transition-all duration-1000 ease-in-out group ${index === activeIndex ? 'opacity-100 pointer-events-auto visible z-10' : 'opacity-0 pointer-events-none invisible z-0'}`}
          
        >
           {renderBannerContent(banner)}
        </div>
      ))}
    </div>
  );
};

export default SportsBanners;
