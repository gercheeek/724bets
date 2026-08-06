import React, { useState, useEffect } from 'react';
import { UserPlus, Crown } from 'lucide-react';

interface HeroWelcomeBannerProps {
  onRegisterClick?: () => void;
}

export default function HeroWelcomeBanner({ onRegisterClick }: HeroWelcomeBannerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slides = [
    {
      id: 'csgo',
      image: '/images/esports_team_wide_final.jpg',
      imageClass: 'object-cover object-center md:object-[center_right] w-full h-full',
      overlayClass: 'bg-transparent',
      subtitle: (
        <p className="text-[12px] md:text-[14px] text-zinc-300 font-medium tracking-wide uppercase opacity-90 drop-shadow-md">
          2026 CS:GO Brezilya Şampiyonu <span className="text-white font-bold">PAULISTAS</span> Resmi Sponsoru
        </p>
      )
    },
    {
      id: 'avai',
      image: '/images/avai_logo.svg',
      bgImage: '/images/sports_bg_premium.jpg',
      imageClass: 'object-contain object-right pr-2 md:pr-8 lg:pr-12 w-[85%] md:w-[90%] lg:w-[85%] ml-auto drop-shadow-[0_0_30px_rgba(0,150,255,0.6)]',
      overlayClass: 'bg-transparent',
      subtitle: (
        <p className="text-[12px] md:text-[14px] text-zinc-300 font-medium tracking-wide uppercase opacity-90 drop-shadow-md relative z-10">
          2026 - 2027 <span className="text-white font-bold">AVAÍ FC</span> Resmi Sponsoru
        </p>
      ),
      extraElement: null
    },
    {
      id: 'poatan',
      image: '/images/poatan.jpg',
      imageClass: 'poatan-mask object-contain object-right w-[110%] md:w-[80%] lg:w-[70%] ml-auto mix-blend-screen drop-shadow-[0_0_20px_rgba(0,0,0,0.8)] translate-x-4 md:translate-x-0',
      overlayClass: 'bg-transparent',
      subtitle: (
        <p className="text-[12px] md:text-[14px] text-zinc-300 font-medium tracking-wide uppercase opacity-90 drop-shadow-md relative z-10">
          2027 <span className="text-[#00E5FF] font-bold drop-shadow-[0_0_10px_rgba(0,229,255,0.8)]">ALEX "POATAN" PEREIRA</span> Resmi Sponsoru
        </p>
      ),
      extraElement: (
         <>
           {/* Premium Cinematic Lighting (Cyan Backlight) */}
           
           {/* Premium Cinematic Lighting (Cyan Backlight) */}
           <div className="absolute top-1/2 right-[15%] -translate-y-1/2 w-[300px] h-[300px] bg-[#00E5FF]/20 blur-[100px] rounded-full pointer-events-none z-[1] hidden md:block" />

           {/* Giant Premium Watermark */}
           <div className="absolute top-1/2 right-[2%] -translate-y-1/2 font-black text-white/[0.03] text-[12rem] xl:text-[16rem] leading-none tracking-tighter pointer-events-none z-[2] select-none hidden md:block">
             POATAN
           </div>

           <style>{`
             img.poatan-mask {
               /* Radial gradient perfectly fades the image to 0% opacity at its edges, impossible to have a sharp line */
               mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black 40%, transparent 100%);
               -webkit-mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black 40%, transparent 100%);
             }
           `}</style>
         </>
      )
    }
  ];

  return (
    <div className="w-full bg-gradient-to-b md:bg-gradient-to-r from-[#0d0f14] via-[#1A1C23] to-[#0d0f14] rounded-2xl overflow-hidden relative mb-4 flex flex-col md:flex-row md:items-center group shadow-[0_20px_50px_rgba(0,0,0,0.5)] md:before:absolute md:before:inset-0 md:before:shadow-[inset_0_0_80px_rgba(0,0,0,0.7)] before:z-10 before:pointer-events-none min-h-[280px] md:min-h-[310px]">
      
      {/* Crown Watermark */}
      <div className="absolute -left-12 -top-12 opacity-[0.03] pointer-events-none z-10 hidden md:block">
         <Crown className="w-[450px] h-[450px] text-white -rotate-12" strokeWidth={1} />
      </div>

      {/* Slider Images Background */}
      {slides.map((slide, index) => (
        <div 
          key={slide.id} 
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${currentSlide === index ? 'opacity-100 z-0' : 'opacity-0 -z-10'}`}
        >
          {/* Extra Elements (e.g. Logo & Name in empty space) */}
          {currentSlide === index && slide.extraElement}

          {/* Background Layer (If specified) */}
          {(slide as any).bgImage && (
             <div 
               className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-screen"
               style={{ backgroundImage: `url(${(slide as any).bgImage})` }}
             />
          )}

          {/* IMAGE AREA (Unified for Mobile & Desktop) */}
          <div className="absolute inset-0 z-0 flex justify-end pointer-events-none">
            <div 
               className="w-full md:w-[60%] h-full relative flex justify-end ml-auto"
               style={{ 
                 maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 100%)', 
                 WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 100%)' 
               }}
            >
               <img 
                 src={slide.image} 
                 alt="Sponsor" 
                 className={`transform group-hover:scale-105 transition-transform duration-1000 ease-out ${slide.imageClass} opacity-100`}
               />
               <div className={`absolute inset-0 ${slide.overlayClass}`} />
            </div>
          </div>
        </div>
      ))}

      {/* Content Area (Unified for Mobile & Desktop) */}
      <div className="w-full md:w-[55%] relative z-20 flex flex-col justify-center px-4 sm:px-6 md:px-8 md:pl-16 py-6 sm:py-8 min-h-[280px] md:min-h-[310px] mt-0 bg-transparent">
         
         {/* Text Backdrop Vignette - Ensures Text Readability Over Opaque Images */}
         <div className="absolute inset-y-0 left-0 w-[80%] sm:w-[70%] md:w-[110%] bg-gradient-to-r from-[#0d0f14] via-[#0d0f14]/80 to-transparent z-[-1] pointer-events-none" />

         <div className="flex flex-col items-start w-[85%] sm:w-full relative z-10">

             <h2 
               className="text-[26px] sm:text-[36px] md:text-[50px] leading-[1.05] mb-2 sm:mb-4 text-left font-normal tracking-normal uppercase drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)] font-['Impact',sans-serif] w-full"
               style={{ 
                 WebkitMaskImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.05' numOctaves='3'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.6 0.4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                 maskImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.05' numOctaves='3'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.6 0.4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
               }}
             >
               <span className="text-[#E0E4EB] relative inline-block transform hover:scale-[1.02] transition-transform duration-500 cursor-default">
                 KAZANANLARIN
               </span>
               <br />
               <span className="text-[#00E5FF] relative inline-block transform hover:scale-[1.02] transition-transform duration-500 cursor-default drop-shadow-[0_0_20px_rgba(0,229,255,0.4)]">
                 ADRESİ
               </span>
             </h2>

             {/* Sponsor Subtitle Wrapper for Fade Effect */}
             <div className="mb-4 sm:mb-6 text-left relative h-12 sm:h-10 w-[90%] md:w-full flex justify-start">
               {slides.map((slide, index) => (
                 <div 
                   key={slide.id}
                   className={`absolute transition-all duration-700 w-full ${currentSlide === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}
                 >
                   {slide.subtitle}
                 </div>
               ))}
             </div>

             {/* Main Button (Refined) */}
             <div className="mb-5 inline-block z-30" onClick={onRegisterClick}>
               <button 
                 className="relative px-6 sm:px-8 py-2.5 bg-[#00E5FF] hover:bg-[#00c9e0] text-black font-bold text-[13px] sm:text-[13.5px] tracking-wide rounded-full transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,229,255,0.3)] hover:shadow-[0_0_20px_rgba(0,229,255,0.5)] hover:-translate-y-0.5 cursor-pointer"
               >
                 <UserPlus className="w-[16px] h-[16px]" strokeWidth={2.5} />
                 Kayıt Ol
               </button>
             </div>

             {/* Or Quick Register Text */}
             <div className="text-[#656A76] text-[11px] font-medium mb-2.5 w-full text-left">Veya Hızlı Kayıt</div>

             {/* Social Buttons */}
             <div className="flex items-center gap-3 z-30">
               <button 
                 onClick={() => window.dispatchEvent(new CustomEvent('openAuthModal', { detail: 'register' }))}
                 className="flex items-center gap-2.5 bg-[#161820] hover:bg-[#1f232e] border border-white/10 hover:border-white/20 text-gray-200 hover:text-white text-[13px] font-semibold py-2 px-5 rounded-xl transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.3)] hover:shadow-[0_4px_20px_rgba(66,133,244,0.15)] hover:-translate-y-0.5 cursor-pointer"
               >
                  <svg className="w-[15px] h-[15px]" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  Google
               </button>
               <button 
                 onClick={() => window.dispatchEvent(new CustomEvent('openAuthModal', { detail: 'register' }))}
                 className="flex items-center gap-2.5 bg-[#161820] hover:bg-[#0088cc]/15 border border-[#0088cc]/30 hover:border-[#0088cc]/60 text-gray-200 hover:text-white text-[13px] font-semibold py-2 px-5 rounded-xl transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.3)] hover:shadow-[0_4px_20px_rgba(0,136,204,0.25)] hover:-translate-y-0.5 cursor-pointer"
               >
                  <svg className="w-[15px] h-[15px]" viewBox="0 0 24 24" fill="#0088cc"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.94z"/></svg>
                  Telegram
               </button>
             </div>
             
             {/* Slider Indicators */}
             <div className="flex items-center gap-2 mt-6 z-30">
               {slides.map((_, idx) => (
                 <div 
                   key={idx}
                   onClick={(e) => { e.stopPropagation(); setCurrentSlide(idx); }}
                   className={`h-1.5 rounded-full cursor-pointer transition-all duration-500 ${currentSlide === idx ? 'w-6 bg-[#00E5FF] shadow-[0_0_10px_rgba(0,229,255,0.6)]' : 'w-2 bg-white/20 hover:bg-white/40'}`}
                 />
               ))}
             </div>

         </div>
      </div>
    </div>
  );
}
