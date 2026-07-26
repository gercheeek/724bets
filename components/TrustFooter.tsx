import React from 'react';
import { Check, Zap, Star } from 'lucide-react';

export const TrustFooter = () => {
  return (
    <div className="w-full bg-[#0d1017] border-t border-white/5 py-3 px-4 md:px-6 lg:px-8 mt-auto hidden sm:flex flex-col md:flex-row items-center justify-between gap-4 h-16">
      
      {/* Left Badges */}
      <div className="flex items-center gap-4">
        {/* GAMECHECK Badge */}
        <div className="flex items-center bg-[#13171e] rounded-full border border-white/5 pr-4 pl-1 py-1 h-8">
          <div className="w-6 h-6 rounded-full bg-[#008753] flex items-center justify-center mr-2 shadow-[0_0_10px_rgba(0,135,83,0.3)]">
            <Check className="w-4 h-4 text-white stroke-[3]" />
          </div>
          <span className="text-white font-black tracking-widest text-[10px]">GAMECHECK</span>
        </div>

        {/* TANZANITE CERTIFIED */}
        <div className="flex items-center bg-[#13171e] rounded border border-[#ffb800]/20 px-2 py-1 h-8">
          <div className="relative w-5 h-5 flex items-center justify-center mr-2">
            <div className="absolute inset-0 bg-[#ffb800] rotate-45 rounded-[3px] opacity-20"></div>
            <Zap className="w-3 h-3 text-[#ffb800] z-10" fill="currentColor" />
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-white font-black text-[9px] leading-none mb-[2px]">TANZANITE</span>
            <span className="text-white/60 font-bold text-[8px] leading-none">CERTIFIED</span>
          </div>
        </div>

        {/* Trustpilot */}
        <div className="flex items-center gap-1.5 ml-2 opacity-50 hover:opacity-100 transition-opacity cursor-pointer">
          <div className="w-5 h-5 bg-[#00b67a] flex items-center justify-center rounded-sm">
            <Star className="w-3.5 h-3.5 text-white fill-current" />
          </div>
          <span className="text-white font-bold text-sm tracking-wide">Trustpilot</span>
        </div>
      </div>

      {/* Right Crypto Icons */}
      <div className="flex items-center gap-2">
        {/* BTC */}
        <div className="w-7 h-7 rounded-md bg-[#f7931a] flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-sm">₿</span>
        </div>
        {/* ETH */}
        <div className="w-7 h-7 rounded-md bg-[#627eea] flex items-center justify-center shadow-lg">
          <svg className="w-4 h-4 text-white" viewBox="0 0 32 32" fill="currentColor">
            <path d="M15.925 23.969L15.875 24v7.519l.05.012 11.231-15.825L15.925 23.969z" opacity=".6"/><path d="M15.925 23.969L4.694 15.706 15.925 31.531v-7.562z" opacity=".6"/><path d="M15.925 22.062L27.1 15.112 15.925.5v21.562z" opacity=".8"/><path d="M15.925 22.062V.5L4.744 15.112l11.181 6.95z" opacity=".4"/>
          </svg>
        </div>
        {/* LTC */}
        <div className="w-7 h-7 rounded-md bg-[#bfbbbb] flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-sm">Ł</span>
        </div>
        {/* USDT */}
        <div className="w-7 h-7 rounded-md bg-[#26a17b] flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-sm">₮</span>
        </div>
        {/* TRX */}
        <div className="w-7 h-7 rounded-md bg-[#ef0027] flex items-center justify-center shadow-lg">
          <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 32 32" fill="currentColor">
            <path d="M2.28 12.83l9.04 15.14c.28.47.93.43 1.15-.07L29.74 3.7c.21-.48-.22-.97-.68-.78L13.23 9.4c-.16.07-.3.18-.4.32L2.28 12.83z" />
          </svg>
        </div>
        {/* XRP */}
        <div className="w-7 h-7 rounded-md bg-[#23292f] flex items-center justify-center shadow-lg border border-white/10">
          <span className="text-white font-bold text-sm">✕</span>
        </div>
        {/* DOGE */}
        <div className="w-7 h-7 rounded-md bg-[#c2a633] flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-sm">Ð</span>
        </div>
        {/* SOL */}
        <div className="w-7 h-7 rounded-md bg-gradient-to-tr from-[#9945FF] to-[#14F195] flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-sm">S</span>
        </div>
        
        {/* +45 */}
        <div className="w-8 h-7 rounded-md bg-[#1e2329] flex items-center justify-center shadow-lg border border-white/5 ml-1">
          <span className="text-white/80 font-bold text-[10px]">+45</span>
        </div>
      </div>

    </div>
  );
};
