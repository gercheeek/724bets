import React from 'react';
import { ArrowRight, Clover } from 'lucide-react';

interface MainHeroProps {
  onRegisterClick: () => void;
  onNavigate: (view: string) => void;
}

export default function MainHero({ onRegisterClick, onNavigate }: MainHeroProps) {
  return (
    <div className="w-full relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#0a0f18] to-[#111827] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/[0.03] mb-5 min-h-[200px] lg:min-h-[240px] flex items-center group">
      
      {/* Brand Ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center">
        {/* Brand Glows */}
        <div className="absolute top-0 left-[20%] w-[40%] h-[100%] bg-[#10b981] rounded-full blur-[150px] opacity-[0.03]"></div>
        <div className="absolute bottom-0 right-[10%] w-[30%] h-[100%] bg-blue-500 rounded-full blur-[150px] opacity-[0.03]"></div>
        {/* Subtle Grid */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4=')] opacity-50"></div>
      </div>

      <div className="relative z-10 w-full flex flex-col lg:flex-row items-center p-4 sm:p-6 lg:p-8 gap-4 sm:gap-6 lg:gap-8">
        
        {/* Left Content - Brand Focused */}
        <div className="flex-1 flex flex-col justify-center text-center lg:text-left z-20">
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 mb-3 w-fit mx-auto lg:mx-0">
            <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></div>
            <span className="text-[10px] font-bold text-[#10B981] uppercase tracking-widest">Sadece 724Bets'te</span>
          </div>

          <h1 className="text-[22px] sm:text-[30px] lg:text-[40px] font-black text-white leading-[1.1] tracking-tight mb-4 font-['Outfit']">
            Sınırları Olmayan Bahis <br />
            <span className="text-gray-300">Deneyimini Yaşayın</span>
          </h1>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
            <button 
              onClick={onRegisterClick}
              className="whitespace-nowrap w-full sm:w-auto bg-[#10B981] hover:bg-[#0ea875] text-[#022C22] font-black py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]"
            >
              Kaydol <ArrowRight className="w-4 h-4" />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="w-[1px] h-8 bg-white/10 hidden sm:block mx-2"></div>
              
              {/* Brand Integrated Socials */}
              <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 hover:border-white/10 transition-all hover:-translate-y-1 group/btn">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-400 group-hover/btn:text-white transition-colors" fill="currentColor"><path d="M11.979 0C5.353 0 0 5.373 0 12.012c0 4.887 2.915 9.096 7.07 10.985l3.208-9.155a3.342 3.342 0 0 1-1.393-2.617c0-1.849 1.488-3.348 3.325-3.348 1.838 0 3.326 1.5 3.326 3.348 0 1.583-1.096 2.909-2.583 3.256l-3.346 9.489A11.968 11.968 0 0 0 23.958 12.01C23.958 5.373 18.605 0 11.979 0zm.23 7.854c-1.127 0-2.043.923-2.043 2.057 0 1.135.916 2.058 2.043 2.058 1.127 0 2.043-.923 2.043-2.058 0-1.134-.916-2.057-2.043-2.057z"/></svg>
              </button>
              <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 hover:border-white/10 transition-all hover:-translate-y-1 group/btn">
                <svg viewBox="0 0 24 24" className="w-4 h-4 grayscale opacity-70 group-hover/btn:grayscale-0 group-hover/btn:opacity-100 transition-all"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              </button>
              <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-[#9146FF]/20 hover:border-[#9146FF]/50 transition-all hover:-translate-y-1 group/btn">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-gray-400 group-hover/btn:text-[#9146FF] transition-colors"><path d="M2.149 0L.537 4.298v15.045h5.373v4.657h4.657l4.657-4.657h4.298l4.299-4.299V0H2.149zm17.194 13.612l-3.224 3.224h-4.298l-3.224 3.224v-3.224H5.373V1.612h13.97v12z"/><path d="M15.403 4.836h-1.612v5.373h1.612V4.836zM11.642 4.836H10.03v5.373h1.612V4.836z"/></svg>
              </button>
            </div>
          </div>
        </div>

        {/* Right Cards - Premium Glassmorphism 3D Style */}
        <div className="w-full lg:w-auto flex items-center justify-center gap-3 lg:gap-5 z-20 perspective-[1000px]">
          
          {/* Casino Card */}
          <div 
            onClick={() => onNavigate('casino')}
            className="w-[110px] sm:w-[130px] lg:w-[160px] aspect-[4/5] rounded-2xl overflow-hidden relative group cursor-pointer bg-[#0a0f18] shadow-[0_15px_40px_rgba(0,0,0,0.6)] hover:shadow-[0_20px_50px_rgba(16,185,129,0.3)] transform hover:-translate-y-2 transition-all duration-500"
          >
            {/* Inner Border (Top Light) */}
            <div className="absolute inset-0 rounded-2xl border-t border-l border-white/10 group-hover:border-[#10B981]/50 z-20 transition-colors duration-500 pointer-events-none"></div>
            
            {/* Flat Minimalist 2D Background - Casino */}
            <div className="absolute inset-0 z-0 bg-[#091510] overflow-hidden flex items-center justify-center">
              {/* Soft Radial Glow */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.15)_0%,transparent_60%)]"></div>
              
              {/* Vector Clover Icon */}
              <div className="relative transform group-hover:scale-110 group-hover:rotate-[15deg] transition-all duration-700 ease-out flex items-center justify-center w-full h-full pb-6 sm:pb-8">
                 <Clover className="w-[60px] h-[60px] sm:w-[85px] sm:h-[85px] text-[#10B981] drop-shadow-[0_0_20px_rgba(16,185,129,0.4)]" strokeWidth={1.5} />
              </div>
              
              {/* Bottom Gradient for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f18] via-[#0a0f18]/40 to-transparent"></div>
            </div>
            
            <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 pb-4 sm:pb-5 flex flex-col items-center z-10">
              <h3 className="text-white font-black text-base sm:text-lg lg:text-xl tracking-wider uppercase">Casino</h3>
              <div className="w-5 h-1 bg-gradient-to-r from-[#10B981] to-[#059669] rounded-full mt-1 mb-1 sm:mt-1.5 sm:mb-1.5 transform origin-center group-hover:w-16 transition-all duration-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]"></div>
              <div className="flex items-center gap-1.5 text-gray-300 group-hover:text-white transition-colors duration-300">
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest drop-shadow-md">Keşfet</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1.5 transition-transform duration-300" />
              </div>
            </div>
          </div>

          {/* Sports Card */}
          <div 
            onClick={() => onNavigate('sports')}
            className="w-[110px] sm:w-[130px] lg:w-[160px] aspect-[4/5] rounded-2xl overflow-hidden relative group cursor-pointer bg-[#0a0f18] shadow-[0_15px_40px_rgba(0,0,0,0.6)] hover:shadow-[0_20px_50px_rgba(59,130,246,0.3)] transform hover:-translate-y-2 transition-all duration-500"
          >
            {/* Inner Border (Top Light) */}
            <div className="absolute inset-0 rounded-2xl border-t border-l border-white/10 group-hover:border-blue-500/50 z-20 transition-colors duration-500 pointer-events-none"></div>
            
            {/* Flat Minimalist 2D Background - Sports */}
            <div className="absolute inset-0 z-0 bg-[#091018] overflow-hidden flex items-center justify-center">
              {/* Soft Radial Glow */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15)_0%,transparent_60%)]"></div>
              
              {/* Vector Clover Icon (Sports Theme Colors) */}
              <div className="relative transform group-hover:scale-110 group-hover:rotate-[15deg] transition-all duration-700 ease-out flex items-center justify-center w-full h-full pb-6 sm:pb-8">
                 <Clover className="w-[60px] h-[60px] sm:w-[85px] sm:h-[85px] text-[#3b82f6] drop-shadow-[0_0_20px_rgba(59,130,246,0.4)]" strokeWidth={1.5} />
              </div>

              {/* Bottom Gradient for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f18] via-[#0a0f18]/40 to-transparent"></div>
            </div>

            <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 pb-4 sm:pb-5 flex flex-col items-center z-10">
              <h3 className="text-white font-black text-base sm:text-lg lg:text-xl tracking-wider uppercase">Bahis</h3>
              <div className="w-5 h-1 bg-gradient-to-r from-[#3b82f6] to-[#2563eb] rounded-full mt-1 mb-1 sm:mt-1.5 sm:mb-1.5 transform origin-center group-hover:w-16 transition-all duration-500 shadow-[0_0_15px_rgba(59,130,246,0.8)]"></div>
              <div className="flex items-center gap-1.5 text-gray-300 group-hover:text-white transition-colors duration-300">
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest drop-shadow-md">Oyna</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1.5 transition-transform duration-300" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
