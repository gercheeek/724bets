import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Lock, Map, Crown } from 'lucide-react';

interface GamificationPanelProps {
  className?: string;
  isLoggedIn?: boolean;
  onLoginClick?: () => void;
  onAdventureClick?: () => void;
}

export const GamificationPanel: React.FC<GamificationPanelProps> = ({ 
  className = '', 
  isLoggedIn = false, 
  onLoginClick,
  onAdventureClick 
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div 
      className={`w-full bg-[#050505] rounded-2xl md:rounded-3xl border border-white/5 hover:border-emerald-500/30 shadow-2xl overflow-hidden flex flex-col relative group cursor-pointer transition-colors duration-500 ${className}`}
      onClick={isLoggedIn ? onAdventureClick : onLoginClick}
    >
      {/* Background FX - Solid Dark with Subtle Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute top-[-50%] right-[-10%] w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[80px] group-hover:scale-110 transition-transform duration-1000" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-screen" />
      
      {/* Animated Path Preview */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
      
      <div className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        
        {/* Left Side: Icon & Titles */}
        <div className="flex items-center gap-5 w-full md:w-auto">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 p-[1px] shadow-[0_0_30px_rgba(16,185,129,0.3)] shrink-0 group-hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] transition-shadow">
            <div className="w-full h-full bg-[#0A0D14] rounded-2xl flex items-center justify-center">
               <Map className="w-8 h-8 text-emerald-400" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Premium Hazine Haritası</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-emerald-400 group-hover:to-cyan-400 transition-all">
              724Bets Serüveni
            </h2>
            <p className="text-gray-400 text-sm mt-1 font-medium">7 noktalı haritayı tamamla, büyük ganimeti kap!</p>
          </div>
        </div>

        {/* Right Side: CTA & Preview */}
        <div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto mt-4 md:mt-0">
          
          {/* Stops Preview (Desktop Only) */}
          <div className="hidden lg:flex items-center gap-3 mr-4">
            {[1, 2, 3].map((stop) => (
              <div key={stop} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#141822] border border-white/10 flex items-center justify-center relative">
                   {stop === 1 ? (
                     <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping"></div>
                   ) : null}
                   <Lock className={`w-4 h-4 ${stop === 1 ? 'text-emerald-400' : 'text-gray-600'}`} />
                </div>
                {stop !== 3 && <div className="w-6 h-[2px] bg-white/10" />}
              </div>
            ))}
            <div className="w-6 h-[2px] bg-white/10" />
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fuchsia-600 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(217,70,239,0.3)]">
               <Crown className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* CTA Button */}
          <button 
            className="w-full md:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-black uppercase tracking-widest hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.4)]"
            onClick={(e) => {
              e.stopPropagation();
              if (isLoggedIn && onAdventureClick) {
                onAdventureClick();
              } else if (!isLoggedIn && onLoginClick) {
                onLoginClick();
              }
            }}
          >
            {isLoggedIn ? 'Maceraya Başla' : 'Giriş Yap & Başla'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
};
