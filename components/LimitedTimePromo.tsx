import React, { useState, useEffect } from 'react';
import { Timer, Gift, Sparkles, ArrowRight } from 'lucide-react';

const LimitedTimePromo = () => {
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (timeLeft <= 0) return;
    
    const interval = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [timeLeft]);

  if (!isVisible || timeLeft <= 0) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="w-full relative overflow-hidden rounded-xl bg-[#0B0E14] border border-red-500/20 p-1 mb-4 shadow-[0_0_30px_rgba(239,68,68,0.15)] group hover:shadow-[0_0_50px_rgba(239,68,68,0.3)] hover:border-red-500/40 transition-all duration-500 hover:-translate-y-0.5">
      {/* Vibrant Premium Background */}
      <div className="absolute inset-0 z-0">
        <img src="/images/limited_promo_bg_vibrant.jpg" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 mix-blend-screen" alt="" />
        {/* Gradients to keep text readable but let the sides shine */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0E14]/90 via-[#0B0E14]/60 to-[#0B0E14]/80"></div>
        {/* Pulsing red glow */}
        <div className="absolute inset-0 bg-red-900/10 mix-blend-color-dodge animate-pulse"></div>
      </div>

      {/* Animated border line */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000 z-10"></div>
      
      <div className="absolute top-0 right-0 w-[50%] h-full bg-gradient-to-l from-red-500/20 to-transparent pointer-events-none z-10"></div>

      <div className="relative z-10 flex flex-col xl:flex-row items-center justify-between gap-4 p-3 lg:p-4">
        
        {/* Left Side: Icon & Text */}
        <div className="flex items-center gap-3 w-full xl:w-auto">
          <div className="relative shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center animate-pulse">
            <Gift className="w-5 h-5 md:w-6 md:h-6 text-red-500" />
            <Sparkles className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 text-yellow-400" />
          </div>
          <div className="flex flex-col">
            <h3 className="text-white font-black text-sm sm:text-base md:text-lg tracking-wide flex flex-wrap items-center gap-2">
              İLK ÜYELERE ÖZEL REDDEDİLEMEYECEK TEKLİF!
              <span className="bg-red-500 text-white text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider animate-pulse whitespace-nowrap">Sınırlı Süre</span>
            </h3>
            <p className="text-gray-300 text-xs sm:text-sm mt-0.5 font-medium">
              Hemen yatır <strong className="text-[#00FFA3]">5.000 TL Bonus</strong> al. 10.000 TL yap, <strong className="text-white">2.500 TL Çek!</strong>
            </p>
          </div>
        </div>

        {/* Right Side: Timer & Action */}
        <div className="flex items-center justify-between w-full xl:w-auto gap-3 shrink-0">
          <div className="flex flex-col items-center justify-center bg-black/50 border border-white/5 rounded-lg px-3 sm:px-4 py-1.5 min-w-[80px]">
            <span className="text-gray-400 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest mb-0.5">Kalan Süre</span>
            <div className="flex items-center gap-1 sm:gap-1.5 text-red-500 font-mono font-bold text-base sm:text-lg">
              <Timer className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
          </div>

          <button 
            onClick={() => window.dispatchEvent(new Event('openDepositModal'))}
            className="relative overflow-hidden group/btn bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-black px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:shadow-[0_0_30px_rgba(239,68,68,0.6)] transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-1.5 sm:gap-2 uppercase tracking-wider text-[11px] sm:text-sm"
          >
            <span className="relative z-10 whitespace-nowrap">BONUSU KAP!</span>
            <ArrowRight className="relative z-10 w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/btn:translate-x-1 transition-transform" />
            <div className="absolute inset-0 bg-white/20 -translate-x-[100%] group-hover/btn:translate-x-[100%] transition-transform duration-500"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LimitedTimePromo;
