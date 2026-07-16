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
    <div className="w-full relative overflow-hidden rounded-xl bg-[#0B0E14] border border-[#FF3366]/30 p-1 mb-4 shadow-[0_0_20px_rgba(255,51,102,0.1)] group transition-all duration-500 hover:shadow-[0_0_30px_rgba(255,51,102,0.2)]">
      {/* Background Image & Effects */}
      <div className="absolute inset-0 z-0 overflow-hidden rounded-lg">
        <img src="/images/limited_promo_bg_vibrant.jpg" className="w-full h-full object-cover opacity-60 mix-blend-screen scale-105 group-hover:scale-100 transition-transform duration-1000" alt="" />
        {/* Soft radial gradient to focus on content */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#0B0E14_80%)]"></div>
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0E14] via-[#0B0E14]/80 to-[#0B0E14]"></div>
      </div>

      {/* Subtle sweeping light effect */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1500 z-10 pointer-events-none"></div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 px-4 py-3">
        
        {/* Left Side: Text Only */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 w-full md:w-auto text-center md:text-left">
          <div className="flex flex-col justify-center">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
              <h3 className="text-white font-black text-lg md:text-xl tracking-tight uppercase" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                5.000₺ HOŞ GELDİN BONUSU
              </h3>
              <span className="bg-[#FF3366]/20 text-[#FF3366] border border-[#FF3366]/50 text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest hidden sm:inline-block">
                Sınırlı Süre
              </span>
            </div>
            <p className="text-gray-300 text-sm font-medium pl-0 md:pl-7">
              10.000₺ Yap, <strong className="text-white text-base bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">2.500₺ Nakit Çek!</strong>
            </p>
          </div>
        </div>

        {/* Right Side: Timer & Action */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-center md:justify-end shrink-0 mt-2 md:mt-0">
          {/* Minimal Timer */}
          <div className="flex flex-col items-center justify-center bg-black/40 border border-white/10 rounded-lg px-4 py-2 backdrop-blur-md">
            <span className="text-[#848B9D] text-[10px] font-bold uppercase tracking-widest mb-0.5">Kalan Süre</span>
            <div className="flex items-center gap-1.5 text-white font-mono font-bold text-lg">
              <Timer className="w-4 h-4 text-[#FF3366]" />
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
          </div>

          {/* Primary CTA Button (Green) */}
          <button 
            onClick={() => window.dispatchEvent(new Event('openDepositModal'))}
            className="relative overflow-hidden group/btn bg-[#00FFA3] hover:bg-[#00E676] text-black font-black px-6 py-3 rounded-lg shadow-[0_0_20px_rgba(0,255,163,0.3)] hover:shadow-[0_0_30px_rgba(0,255,163,0.5)] transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2 uppercase tracking-wide text-sm"
          >
            <span className="relative z-10">BONUSU KAP</span>
            <ArrowRight className="relative z-10 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            <div className="absolute inset-0 bg-white/20 -translate-x-[100%] group-hover/btn:translate-x-[100%] transition-transform duration-500"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LimitedTimePromo;
