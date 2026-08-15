import React, { useState, useMemo } from 'react';

const CasinoLogo: React.FC = () => {
  const [animationKey, setAnimationKey] = useState(0);
  
  const triggerAnimation = () => {
    setAnimationKey(prev => prev + 1);
  };

  const finalWord = "724bets".split('');
  
  const reels = useMemo(() => {
    return finalWord.map((char, i) => {
      // Much longer strips so it spins for a longer time
      const stripLength = 25 + i * 8; 
      const strip = [];
      const isNumberPart = i < 3;
      const symbols = isNumberPart ? "0123456789" : "abcdefghjklnopqrstuvxyz";
      
      for (let j = 0; j < stripLength - 1; j++) {
        strip.push(symbols[Math.floor(Math.random() * symbols.length)]);
      }
      strip.push(char);
      return strip;
    });
  }, [animationKey]);

  return (
    <div 
      className="flex items-center cursor-pointer select-none"
      onMouseEnter={triggerAnimation}
    >
      <style>{`
        @keyframes fullSlotReel {
          0% { transform: translateY(0); filter: blur(2.5px); }
          50% { filter: blur(1px); }
          85% { filter: blur(0px); }
          100% { transform: translateY(calc(-100% + 1.2em)); filter: blur(0); }
        }
      `}</style>
      
      {/* Hidden Overflow for the physical reels */}
      <div className="flex overflow-hidden h-[1.2em] leading-[1.2em]" style={{ alignItems: 'flex-start' }}>
        {reels.map((strip, i) => {
          const isNumberPart = i < 3;
          // Longer duration: Starts at 2.0s, last letter finishes at ~4.4s
          const duration = 2.0 + (i * 0.4); 
          
          return (
            <div 
              key={`${i}-${animationKey}`}
              className={`flex flex-col font-black text-center ${isNumberPart ? 'text-white' : 'text-[#00E5FF]'}`}
              style={{
                width: isNumberPart ? '0.62em' : '0.65em',
                // Updated easing for a more dramatic, prolonged slow-down at the end
                animation: `fullSlotReel ${duration}s cubic-bezier(0.15, 1, 0.3, 1) forwards`
              }}
            >
              {strip.map((sym, idx) => (
                <span 
                  key={idx} 
                  className="flex items-center justify-center shrink-0 h-[1.2em]"
                  style={{ fontVariantNumeric: 'tabular-nums' }}
                >
                  {sym}
                </span>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CasinoLogo;
