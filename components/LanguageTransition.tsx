import React, { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageTransition: React.FC = () => {
  const { isAnimating } = useLanguage();
  const [render, setRender] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isAnimating) {
      setRender(true);
      // Small delay to allow DOM to render before adding visible class for CSS transition
      setTimeout(() => setVisible(true), 10);
    } else {
      setVisible(false);
      // Wait for fade out animation before unmounting
      const timer = setTimeout(() => setRender(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  if (!render) return null;

  return (
    <div 
      className={`fixed inset-0 z-[999999] bg-[#0a0b0e]/95 backdrop-blur-md flex items-center justify-center transition-all duration-500 ease-in-out ${visible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
    >
      <div className="relative flex flex-col items-center justify-center">
        {/* Glow behind text */}
        <div className="absolute inset-0 bg-[#06b6d4] blur-[120px] opacity-25 rounded-full scale-150 animate-pulse" />
        
        {/* 724BETS text animation */}
        <div className={`transform transition-all duration-700 cubic-bezier(0.34, 1.56, 0.64, 1) ${visible ? 'scale-110 translate-y-0 opacity-100' : 'scale-75 translate-y-12 opacity-0'}`}>
          <span className="flex items-center text-[60px] md:text-[90px] font-black font-['Outfit'] tracking-tighter text-[#06b6d4] drop-shadow-[0_0_25px_rgba(0,255,163,0.35)] select-none lowercase">
            724bets
            <div className="flex items-center justify-center w-8 h-8 md:w-12 md:h-12 rounded-full border-[4px] md:border-[6px] border-[#06b6d4] ml-3 -mt-16 md:-mt-24">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-[#06b6d4] w-4 h-4 md:w-6 md:h-6">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
               </svg>
            </div>
          </span>
        </div>
      </div>
    </div>
  );
};

export default LanguageTransition;
