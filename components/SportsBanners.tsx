import React from 'react';

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
    title: <><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] to-[#60A5FA]">5000$</span> Hoş Geldin</>,
    subtitle: 'Spor bahislerinde geçerli dev bonus seni bekliyor!',
    buttonText: 'KAYIT OL',
    accentColor: 'from-[#3B82F6]/20 to-[#60A5FA]/20',
    borderColor: 'border-[#3B82F6]',
    hoverBg: 'hover:bg-[#3B82F6]/10',
    shadow: 'shadow-[#3B82F6]/10',
    hoverShadow: 'hover:shadow-[#3B82F6]/30',
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
  }
];

const SportsBanners: React.FC = () => {
  const handleRegisterClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.dispatchEvent(new CustomEvent('openAuthModal', { detail: 'register' }));
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-4 font-sans mb-6">
      {banners.map((banner) => (
        <div 
          key={banner.id} 
          onClick={handleRegisterClick}
          className="relative rounded-[16px] overflow-hidden min-h-[160px] md:min-h-[190px] shadow-[0_8px_30px_rgb(0,0,0,0.4)] group cursor-pointer border border-white/5 bg-[#0B0E14] transition-all duration-300 hover:-translate-y-1 hover:border-white/10"
        >
          {/* Background Image Container */}
          <div className="absolute inset-0 z-0 flex justify-end">
            <div className="w-[80%] h-full relative">
              {/* Soft mask to blend the left edge of the image smoothly */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#0B0E14] via-[#0B0E14]/80 to-transparent z-10 w-[60%]"></div>
              
              <img 
                src={banner.bgImage} 
                alt="Banner" 
                className="w-full h-full object-cover object-right transform group-hover:scale-110 transition-transform duration-700 ease-out"
              />
            </div>
            
            {/* Global Dark Gradient to guarantee text readability on the left */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B0E14] via-[#0B0E14]/90 to-transparent z-10 w-full"></div>
            
            {/* Colored Ambient Glow based on banner theme */}
            <div className={`absolute inset-0 bg-gradient-to-br ${banner.accentColor} opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10 mix-blend-screen`}></div>
          </div>

          {/* Content */}
          <div className="relative z-20 p-5 flex flex-col justify-center h-full w-[85%] sm:w-[75%] md:w-[85%] lg:w-[90%] gap-3">
            <div className="flex flex-col transform group-hover:translate-x-1 transition-transform duration-500">
              <h3 className="text-white text-[19px] sm:text-[22px] md:text-[20px] xl:text-[24px] font-black leading-[1.1] mb-1.5 font-['Outfit'] drop-shadow-lg tracking-tight">
                {banner.title}
              </h3>
              <p className="text-[#94a3b8] text-[11px] sm:text-xs font-medium leading-relaxed drop-shadow-md">
                {banner.subtitle}
              </p>
            </div>
            
            <div className="mt-1 transform group-hover:translate-x-1 transition-transform duration-500 delay-75">
              <button 
                onClick={handleRegisterClick}
                className={`relative overflow-hidden group/btn bg-transparent border ${banner.borderColor} ${banner.hoverBg} text-white font-bold px-6 py-2.5 text-[10px] sm:text-[11px] tracking-[0.1em] rounded-lg transition-all duration-300 shadow-[0_0_10px_rgba(0,0,0,0)] ${banner.hoverShadow} flex items-center justify-center uppercase w-max`}
              >
                <span className="relative z-10">{banner.buttonText}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SportsBanners;
