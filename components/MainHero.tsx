import React from 'react';
import { ArrowRight, ChevronDown, Gamepad2, Trophy } from 'lucide-react';

interface MainHeroProps {
  onRegisterClick: () => void;
  onNavigate: (view: string) => void;
}

export default function MainHero({ onRegisterClick, onNavigate }: MainHeroProps) {
  return (
    <div className="w-full max-w-[900px] mx-auto flex flex-col items-start lg:items-center pt-8 pb-6 lg:pt-14 lg:pb-12 text-left lg:text-center relative z-20 px-4">
      
      {/* Title */}
      <h1 className="text-[28px] sm:text-4xl lg:text-[42px] font-black text-white leading-[1.2] mb-6 lg:mb-8 font-sans tracking-tight w-full">
        Sınırları Olmayan Bahis Deneyimini <br className="hidden sm:block" /> Yaşayın
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
        <button className="bg-[#242938] hover:bg-[#2c3245] rounded-lg px-3 sm:px-4 py-3 sm:py-3.5 flex items-center gap-2 sm:gap-3 border border-white/5 transition-colors shadow-lg group">
           <div className="flex -space-x-1 sm:-space-x-2">
             {/* Steam */}
             <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#171a21] border-2 border-[#242938] flex items-center justify-center z-30 group-hover:border-[#2c3245] transition-colors">
               <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" fill="currentColor"><path d="M11.979 0C5.353 0 0 5.373 0 12.012c0 4.887 2.915 9.096 7.07 10.985l3.208-9.155a3.342 3.342 0 0 1-1.393-2.617c0-1.849 1.488-3.348 3.325-3.348 1.838 0 3.326 1.5 3.326 3.348 0 1.583-1.096 2.909-2.583 3.256l-3.346 9.489A11.968 11.968 0 0 0 23.958 12.01C23.958 5.373 18.605 0 11.979 0zm.23 7.854c-1.127 0-2.043.923-2.043 2.057 0 1.135.916 2.058 2.043 2.058 1.127 0 2.043-.923 2.043-2.058 0-1.134-.916-2.057-2.043-2.057z"/></svg>
             </div>
             {/* Google */}
             <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white border-2 border-[#242938] flex items-center justify-center z-20 group-hover:border-[#2c3245] transition-colors">
               <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 sm:w-4 sm:h-4"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
             </div>
             {/* Twitch */}
             <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#9146FF] border-2 border-[#242938] flex items-center justify-center z-10 group-hover:border-[#2c3245] transition-colors">
               <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white"><path d="M2.149 0L.537 4.298v15.045h5.373v4.657h4.657l4.657-4.657h4.298l4.299-4.299V0H2.149zm17.194 13.612l-3.224 3.224h-4.298l-3.224 3.224v-3.224H5.373V1.612h13.97v12z"/><path d="M15.403 4.836h-1.612v5.373h1.612V4.836zM11.642 4.836H10.03v5.373h1.612V4.836z"/></svg>
             </div>
           </div>
           <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-white ml-0 sm:ml-1" />
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-6 w-full mt-2">
        {/* Casino Card */}
        <div 
          onClick={() => onNavigate('casino')} 
          className="group relative w-full aspect-[4/5] sm:aspect-[4/3] rounded-xl lg:rounded-[1.25rem] overflow-hidden cursor-pointer shadow-2xl flex flex-col border border-white/5"
        >
          {/* Main Image Area */}
          <div className="flex-1 relative overflow-hidden bg-[#0d1421]">
             {/* Using mosaic_casino_bg.jpg if exists, else fallback gradient */}
            <div 
              className="absolute inset-0 bg-center transition-transform duration-700 group-hover:scale-[1.05] opacity-90" 
              style={{ backgroundImage: "url('/images/mosaic_casino_bg.jpg')", backgroundSize: "300%" }} 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#26629F]/50 to-transparent" />
          </div>
          {/* Bottom Bar */}
          <div className="h-14 sm:h-16 bg-[#26629F] flex items-center px-5 sm:px-6 z-10 shrink-0">
            <Gamepad2 className="w-6 h-6 sm:w-7 sm:h-7 text-white/80 mr-3" />
            <span className="text-white font-bold text-lg sm:text-xl tracking-wide">Casino</span>
          </div>
        </div>

        {/* Sports Card */}
        <div 
          onClick={() => onNavigate('sports')} 
          className="group relative w-full aspect-[4/5] sm:aspect-[4/3] rounded-xl lg:rounded-[1.25rem] overflow-hidden cursor-pointer shadow-2xl flex flex-col border border-white/5"
        >
          {/* Main Image Area */}
          <div className="flex-1 relative overflow-hidden bg-[#1a1f2c]">
            <div 
              className="absolute inset-0 bg-center transition-transform duration-700 group-hover:scale-[1.05] opacity-90" 
              style={{ backgroundImage: "url('/images/mosaic_sports_bg.jpg')", backgroundSize: "300%" }} 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#363E51]/50 to-transparent" />
          </div>
          {/* Bottom Bar */}
          <div className="h-14 sm:h-16 bg-[#363E51] flex items-center px-5 sm:px-6 z-10 shrink-0">
            <Trophy className="w-6 h-6 sm:w-7 sm:h-7 text-white/80 mr-3" />
            <span className="text-white font-bold text-lg sm:text-xl tracking-wide">Bahis Merkezi</span>
          </div>
        </div>
      </div>

    </div>
  );
}
