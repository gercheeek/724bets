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
      className={`fixed inset-0 z-[999999] bg-[#0a0b0e] flex items-center justify-center transition-opacity duration-500 pointer-events-none ${visible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="relative flex flex-col items-center justify-center">
        {/* Glow behind text */}
        <div className="absolute inset-0 bg-[#10B981] blur-[100px] opacity-20 rounded-full scale-150 animate-pulse" />
        
        {/* 724BETS text animation */}
        <div className={`transform transition-all duration-700 ease-out ${visible ? 'scale-100 translate-y-0 opacity-100' : 'scale-50 translate-y-10 opacity-0'}`}>
          <span className="flex items-center text-[50px] md:text-[80px] font-black font-['Inter'] tracking-tight text-white drop-shadow-[0_0_15px_rgba(0,255,163,0.5)]">
            724<span className="text-[#10B981]">BETS</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default LanguageTransition;
