import React from 'react';
import { Crown, UserPlus } from 'lucide-react';

interface EsportsPromoBannerProps {
  onRegisterClick?: () => void;
}

export default function EsportsPromoBanner({ onRegisterClick }: EsportsPromoBannerProps) {
  return (
    <div className="w-full relative overflow-hidden bg-[#24262b] rounded-md md:rounded-[12px] mt-2 mb-4 flex flex-col md:flex-row items-center border border-white/5 shadow-2xl h-auto md:h-[280px] xl:h-[300px]">
      
      {/* Background Graphic Left (Large Abstraction like the 'B' in BC Game) */}
      <div className="absolute -left-12 -top-12 opacity-5 pointer-events-none z-10 hidden md:block">
         <Crown className="w-[300px] h-[300px] text-white -rotate-12" />
      </div>

      {/* The Esports Team Image (Right Side) */}
      <div 
        className="absolute right-0 top-0 bottom-0 w-full md:w-[80%] xl:w-[75%] z-0 flex justify-end pointer-events-none"
        style={{ maskImage: 'linear-gradient(to right, transparent 0%, black 15%)', WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 15%)' }}
      >
        <img 
          src="/images/esports_team_wide_final.jpg" 
          alt="724bets Esports Team" 
          className="w-full h-full object-cover object-[right_10%] opacity-90"
        />
      </div>

      {/* Left Content Area (Centered Text & Buttons) */}
      <div className="w-full md:w-[45%] relative z-20 flex flex-col items-center justify-center text-center px-6 py-10 md:py-0 h-full">
         
         <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-zinc-400 font-black text-[22px] md:text-[26px] xl:text-[30px] leading-[1.1] tracking-wide drop-shadow-[0_2px_10px_rgba(255,255,255,0.1)] mb-5 uppercase italic text-center">
           Kazananların Adresi
         </h2>

         <button 
           onClick={onRegisterClick}
           className="group relative w-full max-w-[160px] overflow-hidden rounded-full font-bold text-[14px] py-2.5 transition-all duration-300 shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:shadow-[0_0_30px_rgba(0,229,255,0.6)] hover:-translate-y-1 mb-4"
         >
           {/* Gradient Background */}
           <div className="absolute inset-0 bg-gradient-to-r from-[#00E5FF] to-[#00b3cc] opacity-90 group-hover:opacity-100 transition-opacity"></div>
           
           {/* Shine effect */}
           <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-r from-transparent via-white to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
           
           {/* Button Content */}
           <div className="relative flex items-center justify-center gap-1.5 text-[#06080e] tracking-wide">
             <UserPlus className="w-4 h-4" />
             <span>Üye Ol</span>
           </div>
         </button>

         <span className="text-gray-400 text-[12px] font-medium tracking-wide mb-3">Veya Hızlı Kayıt</span>
         
         <div className="flex gap-3 w-full max-w-[280px]">
           <button className="flex-1 flex items-center justify-center gap-2 bg-[#1A1C20] hover:bg-[#2c3036] border border-white/5 rounded-lg py-2.5 transition-all shadow-md active:scale-95">
             <svg viewBox="0 0 24 24" className="w-4 h-4"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
             <span className="text-zinc-200 font-semibold text-[13px] tracking-wide">Google</span>
           </button>
           <button className="flex-1 flex items-center justify-center gap-2 bg-[#1A1C20] hover:bg-[#2c3036] border border-white/5 rounded-lg py-2.5 transition-all shadow-md active:scale-95">
             <svg viewBox="0 0 24 24" className="w-4 h-4"><path fill="#229ED9" d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
             <span className="text-zinc-200 font-semibold text-[13px] tracking-wide">Telegram</span>
           </button>
         </div>
      </div>
       
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
