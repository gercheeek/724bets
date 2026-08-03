import React from 'react';
import { ArrowRight, ChevronDown, Gamepad2, Trophy } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface MainHeroProps {
  onRegisterClick: () => void;
  onNavigate: (view: string) => void;
}

export default function MainHero({ onRegisterClick, onNavigate }: MainHeroProps) {
  const { t } = useTranslation();
  return (
    <div className="w-full max-w-[1300px] mx-auto flex flex-col xl:flex-row items-start xl:items-center justify-between pt-2 pb-0 xl:pt-6 xl:pb-2 relative z-20 px-4 xl:px-8 gap-5 xl:gap-8">
      
      {/* Left Content Area (Text + Buttons) */}
      <div className="w-full xl:w-[50%] min-w-0 flex flex-col items-start text-left pr-0 xl:pr-8 relative">
        {/* Ambient Blue Orb Behind Text */}
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[150px] h-[150px] lg:w-[300px] lg:h-[300px] bg-[#00E5FF]/20 rounded-full blur-[60px] lg:blur-[80px] pointer-events-none animate-pulse-slow" />
        
        {/* Title */}
        <h1 
          className="text-[26px] sm:text-3xl xl:text-[36px] 2xl:text-[46px] font-black leading-snug xl:leading-[1.25] mb-2 xl:mb-3 font-sans tracking-tighter w-full drop-shadow-[0_4px_24px_rgba(255,255,255,0.15)] relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-white via-[#b3d4ff] to-white bg-[length:200%_auto] animate-[bg-gradient_4s_linear_infinite,fade-in-up_0.8s_ease-out_forwards] opacity-0"
        >
        {t('home.hero_title_1')} <br className="hidden md:block" /> {t('home.hero_title_2')}
      </h1>

        <p className="text-zinc-300 text-sm xl:text-base mb-3 xl:mb-5 font-medium max-w-lg leading-relaxed opacity-0 animate-[fade-in-up_0.8s_ease-out_0.1s_forwards]">
          Kripto odaklı, limitsiz ve kesintisiz bahis dünyasına adım atın. Favori oyunlarınızı oynarken sürpriz bonuslarla kazancınızı anında katlayın!
        </p>
      {/* Action Row */}
      <div 
        className="flex flex-row items-center gap-2 sm:gap-6 mb-2 xl:mb-6 w-full opacity-0 animate-[fade-in-up_0.8s_ease-out_0.2s_forwards]"
      >
        {/* Register Button */}
        <button 
          onClick={onRegisterClick} 
          className="relative overflow-hidden bg-gradient-to-r from-[#00E5FF] to-[#00b3cc] hover:brightness-110 text-[#0A0D14] font-black py-3 px-5 xl:py-4 xl:px-10 rounded-xl flex items-center gap-1.5 xl:gap-2 transition-all shadow-[0_0_20px_rgba(0,229,255,0.4)] xl:shadow-[0_0_30px_rgba(0,229,255,0.4)] hover:shadow-[0_0_50px_rgba(0,229,255,0.6)] hover:-translate-y-1 active:scale-95 text-[13px] xl:text-[15px] uppercase tracking-wide group z-10 shrink-0"
        >
          <span className="relative z-10 flex items-center gap-1 xl:gap-2">{t('home.register')} <ArrowRight className="w-4 h-4 xl:w-5 xl:h-5 ml-0.5 xl:ml-1 group-hover:translate-x-1 transition-transform" /></span>
          {/* Shimmer Effect overlay */}
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shine-sweep_1.5s_ease-in-out_infinite]" />
        </button>
        
        {/* Or Text */}
        <span className="text-zinc-500 font-bold text-[11px] lg:text-sm px-2 uppercase tracking-widest shrink-0">{t('home.or')}</span>
        
        {/* Social Login Select */}
        <button className="bg-[#131823]/80 backdrop-blur-md hover:bg-[#1a2130] rounded-xl px-4 py-3 lg:px-6 lg:py-4 flex items-center gap-3 lg:gap-5 border border-white/10 transition-all shadow-xl group hover:border-white/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95 flex-1 max-w-[160px] lg:max-w-none justify-center">
           <div className="flex items-center gap-3 lg:gap-5">
             {/* Steam */}
             <svg viewBox="0 0 24 24" className="w-5 h-5 lg:w-6 lg:h-6 text-zinc-400 group-hover:text-white transition-colors" fill="currentColor"><path d="M11.979 0C5.353 0 0 5.373 0 12.012c0 4.887 2.915 9.096 7.07 10.985l3.208-9.155a3.342 3.342 0 0 1-1.393-2.617c0-1.849 1.488-3.348 3.325-3.348 1.838 0 3.326 1.5 3.326 3.348 0 1.583-1.096 2.909-2.583 3.256l-3.346 9.489A11.968 11.968 0 0 0 23.958 12.01C23.958 5.373 18.605 0 11.979 0zm.23 7.854c-1.127 0-2.043.923-2.043 2.057 0 1.135.916 2.058 2.043 2.058 1.127 0 2.043-.923 2.043-2.058 0-1.134-.916-2.057-2.043-2.057z"/></svg>
             {/* Google */}
             <svg viewBox="0 0 24 24" className="w-5 h-5 lg:w-6 lg:h-6 opacity-80 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
             {/* Twitch */}
             <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 lg:w-6 lg:h-6 text-zinc-400 group-hover:text-[#9146FF] transition-colors"><path d="M2.149 0L.537 4.298v15.045h5.373v4.657h4.657l4.657-4.657h4.298l4.299-4.299V0H2.149zm17.194 13.612l-3.224 3.224h-4.298l-3.224 3.224v-3.224H5.373V1.612h13.97v12z"/><path d="M15.403 4.836h-1.612v5.373h1.612V4.836zM11.642 4.836H10.03v5.373h1.612V4.836z"/></svg>
           </div>
           <ChevronDown className="w-4 h-4 lg:w-5 lg:h-5 text-zinc-500 group-hover:text-white transition-colors ml-1 lg:ml-2" />
        </button>
      </div>
    </div>

      {/* Cards Grid (Right Side on Desktop) */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:gap-6 w-full xl:w-[50%] min-w-0 mt-2 xl:mt-0 opacity-0 animate-[fade-in-up_1s_ease-out_0.4s_forwards]">
        {/* Casino Card Wrapper for Floating */}
        <div className="animate-float-card" style={{ animationDelay: '0s' }}>
          {/* Casino Card */}
          <div 
            onClick={() => onNavigate('casino')} 
            className="group relative w-full aspect-[4/3] xl:aspect-[4/3] rounded-xl xl:rounded-2xl overflow-hidden cursor-pointer shadow-2xl flex flex-col border border-white/5 transition-all duration-300 hover:-translate-y-3 hover:scale-[1.04] hover:shadow-[0_20px_50px_rgba(0,229,255,0.4)] hover:border-[#00E5FF]/60 z-0 hover:z-10"
          >
          {/* Main Image Area */}
          <div className="flex-1 relative overflow-hidden bg-[#0d1421]">
             {/* Using mosaic_casino_bg.webp if exists, else fallback gradient */}
            <div 
              className="absolute inset-0 bg-center transition-transform duration-700 group-hover:scale-[1.1] opacity-90" 
              style={{ backgroundImage: "url('/images/mosaic_casino_bg.webp')", backgroundSize: "400%" }} 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#00E5FF]/40 to-transparent" />
          </div>
          {/* Bottom Bar */}
          <div className="h-9 xl:h-16 bg-[#131620] border-t border-[#00E5FF]/30 flex items-center justify-center px-1 xl:px-4 z-10 shrink-0 gap-1.5 xl:gap-2 group-hover:bg-[#00E5FF]/10 transition-colors">
            <Gamepad2 className="w-3.5 h-3.5 xl:w-6 xl:h-6 text-[#00E5FF]" />
            <span className="text-[#00E5FF] font-bold text-[12px] xl:text-lg tracking-wide">{t('home.casino')}</span>
            <ArrowRight className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-[#00E5FF] ml-0.5 xl:ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
        </div>

        {/* Sports Card Wrapper for Floating (Delayed) */}
        <div className="animate-float-card" style={{ animationDelay: '1.5s' }}>
          {/* Sports Card */}
          <div 
            onClick={() => onNavigate('sports')} 
            className="group relative w-full aspect-[4/3] xl:aspect-[4/3] rounded-xl xl:rounded-2xl overflow-hidden cursor-pointer shadow-2xl flex flex-col border border-white/5 transition-all duration-300 hover:-translate-y-3 hover:scale-[1.04] hover:shadow-[0_20px_50px_rgba(198,255,0,0.4)] hover:border-[#c6ff00]/60 z-0 hover:z-10"
          >
            {/* Main Image Area */}
            <div className="flex-1 relative overflow-hidden bg-[#1a1f2c]">
              <div 
                className="absolute inset-0 bg-center transition-transform duration-700 group-hover:scale-[1.1] opacity-90" 
                style={{ backgroundImage: "url('/images/mosaic_sports_bg.webp')", backgroundSize: "400%" }} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#c6ff00]/40 to-transparent" />
            </div>
            {/* Bottom Bar */}
            <div className="h-9 xl:h-16 bg-[#131620] border-t border-[#c6ff00]/30 flex items-center justify-center px-1 xl:px-4 z-10 shrink-0 gap-1.5 xl:gap-2 group-hover:bg-[#c6ff00]/10 transition-colors">
              <Trophy className="w-3.5 h-3.5 xl:w-6 xl:h-6 text-[#c6ff00]" />
              <span className="text-[#c6ff00] font-bold text-[12px] xl:text-lg tracking-wide whitespace-nowrap">{t('home.sportsbook')}</span>
              <ArrowRight className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-[#00E5FF] ml-0.5 xl:ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
