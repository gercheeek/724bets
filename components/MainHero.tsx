import React from 'react';
import { ArrowRight, ChevronDown, Gamepad2, Trophy } from 'lucide-react';

interface MainHeroProps {
  onRegisterClick: () => void;
  onNavigate: (view: string) => void;
}

export default function MainHero({ onRegisterClick, onNavigate }: MainHeroProps) {
  return (
    <div className="w-full max-w-[1300px] mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between pt-8 pb-6 lg:pt-14 lg:pb-12 relative z-20 px-4 lg:px-8 gap-8 lg:gap-12">
      
      {/* Left Content Area (Text + Buttons) */}
      <div className="w-full lg:w-[40%] flex flex-col items-start text-left pr-0 lg:pr-8">
        {/* Title */}
        <h1 className="text-[28px] sm:text-4xl lg:text-[40px] font-extrabold text-white leading-tight mb-6 lg:mb-8 font-sans tracking-tight w-full">
        Sınırları Olmayan Bahis <br className="hidden lg:block" /> Deneyimini Yaşayın
      </h1>

      {/* Action Row */}
      <div className="flex flex-row items-center gap-3 sm:gap-4 mb-10 sm:mb-14">
        {/* Register Button */}
        <button 
          onClick={onRegisterClick} 
          className="bg-[#4ade80] hover:bg-[#22c55e] text-white font-bold py-3.5 px-6 sm:px-8 rounded-lg flex items-center gap-2 transition-colors shadow-lg"
        >
          Kaydol <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        
        {/* Or Text */}
        <span className="text-zinc-500 font-medium text-sm sm:text-base px-1 sm:px-2">Or</span>
        
        {/* Social Login Select */}
        <button className="bg-[#242938] hover:bg-[#2c3245] rounded-lg px-4 py-3 flex items-center gap-3 border border-white/5 transition-colors shadow-lg group">
           <div className="flex items-center gap-3">
             {/* Steam */}
             <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] text-white/90 group-hover:text-white transition-colors" fill="currentColor"><path d="M11.979 0C5.353 0 0 5.373 0 12.012c0 4.887 2.915 9.096 7.07 10.985l3.208-9.155a3.342 3.342 0 0 1-1.393-2.617c0-1.849 1.488-3.348 3.325-3.348 1.838 0 3.326 1.5 3.326 3.348 0 1.583-1.096 2.909-2.583 3.256l-3.346 9.489A11.968 11.968 0 0 0 23.958 12.01C23.958 5.373 18.605 0 11.979 0zm.23 7.854c-1.127 0-2.043.923-2.043 2.057 0 1.135.916 2.058 2.043 2.058 1.127 0 2.043-.923 2.043-2.058 0-1.134-.916-2.057-2.043-2.057z"/></svg>
             {/* Google */}
             <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] opacity-90 group-hover:opacity-100 transition-opacity"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
             {/* Twitch */}
             <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px] text-white/90 group-hover:text-white transition-colors"><path d="M2.149 0L.537 4.298v15.045h5.373v4.657h4.657l4.657-4.657h4.298l4.299-4.299V0H2.149zm17.194 13.612l-3.224 3.224h-4.298l-3.224 3.224v-3.224H5.373V1.612h13.97v12z"/><path d="M15.403 4.836h-1.612v5.373h1.612V4.836zM11.642 4.836H10.03v5.373h1.612V4.836z"/></svg>
           </div>
           <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-white ml-0 sm:ml-1" />
        </button>
      </div>
    </div>

      {/* Cards Grid (Right Side on Desktop) */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-5 w-full lg:w-[60%] mt-2 lg:mt-0">
        {/* Casino Card */}
        <div 
          onClick={() => onNavigate('casino')} 
          className="group relative w-full aspect-[3/4] sm:aspect-[4/5] rounded-xl lg:rounded-2xl overflow-hidden cursor-pointer shadow-2xl flex flex-col border border-white/5 transition-transform hover:-translate-y-1"
        >
          {/* Main Image Area */}
          <div className="flex-1 relative overflow-hidden bg-[#0d1421]">
             {/* Using mosaic_casino_bg.jpg if exists, else fallback gradient */}
            <div 
              className="absolute inset-0 bg-center transition-transform duration-700 group-hover:scale-[1.1] opacity-90" 
              style={{ backgroundImage: "url('/images/mosaic_casino_bg.jpg')", backgroundSize: "400%" }} 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#26629F]/80 to-transparent" />
          </div>
          {/* Bottom Bar */}
          <div className="h-12 sm:h-14 lg:h-16 bg-[#26629F] flex items-center justify-center px-2 sm:px-4 z-10 shrink-0 gap-2">
            <Gamepad2 className="w-5 h-5 sm:w-6 sm:h-6 text-white/90" />
            <span className="text-white font-bold text-base sm:text-lg tracking-wide">Casino</span>
            <ArrowRight className="w-4 h-4 text-white/70 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Sports Card */}
        <div 
          onClick={() => onNavigate('sports')} 
          className="group relative w-full aspect-[4/5] sm:aspect-[4/3] lg:aspect-square xl:aspect-[5/4] rounded-xl lg:rounded-2xl overflow-hidden cursor-pointer shadow-2xl flex flex-col border border-white/5 transition-transform hover:-translate-y-1"
        >
          {/* Main Image Area */}
          <div className="flex-1 relative overflow-hidden bg-[#1a1f2c]">
            <div 
              className="absolute inset-0 bg-center transition-transform duration-700 group-hover:scale-[1.1] opacity-90" 
              style={{ backgroundImage: "url('/images/mosaic_sports_bg.jpg')", backgroundSize: "400%" }} 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#363E51]/80 to-transparent" />
          </div>
          {/* Bottom Bar */}
          <div className="h-12 sm:h-14 lg:h-16 bg-[#363E51] flex items-center justify-center px-2 sm:px-4 z-10 shrink-0 gap-2">
            <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-white/90" />
            <span className="text-white font-bold text-base sm:text-lg tracking-wide whitespace-nowrap">Bahis Merkezi</span>
            <ArrowRight className="w-4 h-4 text-white/70 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

    </div>
  );
}
