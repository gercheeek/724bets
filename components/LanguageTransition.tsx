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
        <div className="absolute inset-0 bg-[#10B981] blur-[120px] opacity-25 rounded-full scale-150 animate-pulse" />
        
        {/* 724BETS text animation */}
        <div className={`transform transition-all duration-700 cubic-bezier(0.34, 1.56, 0.64, 1) ${visible ? 'scale-110 translate-y-0 opacity-100' : 'scale-75 translate-y-12 opacity-0'}`}>
          <span className="flex items-center text-[60px] md:text-[90px] font-black font-['Outfit'] tracking-tighter text-white drop-shadow-[0_0_25px_rgba(0,255,163,0.35)] select-none">
            724<span className="text-[#10B981]">BETS</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default LanguageTransition;
