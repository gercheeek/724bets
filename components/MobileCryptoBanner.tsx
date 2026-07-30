import React from 'react';

export const MobileCryptoBanner: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[999999] bg-[#05070a] flex flex-col justify-center items-center overflow-hidden">
      {/* Background with cinematic grading */}
      <div className="absolute inset-0">
        <img 
          src="/images/bitcoin_hero_banner.jpg" 
          alt="Crypto Bonus" 
          className="w-full h-full object-cover opacity-60 scale-[1.2] grayscale-[20%] blur-[2px]" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070a] via-[#05070a]/80 to-[#05070a]/40"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#05070a] via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[#00E5FF]/5 mix-blend-color"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 text-center flex flex-col items-center justify-center w-full animate-fade-in-up">
        {/* Floating Crypto Icons (CSS animations) */}
        <div className="absolute top-[-100px] left-[10%] w-16 h-16 rounded-full bg-amber-500/20 blur-[20px] animate-[pulse_3s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-[-50px] right-[10%] w-20 h-20 rounded-full bg-[#00E5FF]/20 blur-[20px] animate-[pulse_4s_ease-in-out_infinite_1s]"></div>

        <h2 className="text-[36px] font-black leading-[1.1] tracking-tighter text-white mb-4 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-600 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)] block mb-1">
            KRİPTOYA ÖZEL
          </span>
          <span className="text-white text-[48px] block drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            %300 BONUS
          </span>
        </h2>

        <p className="text-[15px] text-zinc-300 font-medium leading-relaxed max-w-[280px] mx-auto drop-shadow-md mb-8">
          Kripto ile yatır, limitlere takılma, <span className="text-white font-black drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">%300 bonusu kap!</span>
        </p>

        {/* Loading Spinner */}
        <div className="flex flex-col items-center justify-center gap-3 mt-4">
          <div className="w-8 h-8 border-4 border-white/10 border-t-[#00E5FF] rounded-full animate-spin"></div>
          <span className="text-[11px] font-bold text-white/50 tracking-widest uppercase animate-pulse">Spor Bölümüne Geçiliyor...</span>
        </div>
      </div>
    </div>
  );
};

export default MobileCryptoBanner;
