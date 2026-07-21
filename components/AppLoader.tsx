import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Club } from 'lucide-react';
import SlotText from './SlotText';

interface AppLoaderProps {
  fadeOut?: boolean;
  onComplete?: () => void;
  isReady?: boolean;
}

const AppLoader: React.FC<AppLoaderProps> = ({ fadeOut = false, onComplete, isReady = true }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div 
      className={`fixed inset-0 z-[999999] bg-black flex items-center justify-center transition-opacity duration-500 ${fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'}`}
    >
      <div className="flex flex-col items-center justify-center animate-pulse">
        <div className="logo-text-724 group flex items-center overflow-hidden">
          <span className="flex items-center" style={{
            fontSize: '40px',
            fontFamily: "'Inter', sans-serif",
            fontWeight: 900,
            color: '#fff',
          }}>
            <div className="flex">
               <SlotText text="724" className="text-white lowercase tracking-tight" />
               <SlotText text="bets" className="text-[#10b981] lowercase tracking-tight" onComplete={onComplete} isReady={isReady} />
            </div>
            <div className="flex items-center justify-center w-8 h-8 ml-2 -mt-6">
               <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full text-[#10b981] drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]">
                  {/* 3-leaf clover (Shamrock) */}
                  <path d="M 50,48 C 30,30 35,10 50,20 C 65,10 70,30 50,48 Z" />
                  <path d="M 46,52 C 30,35 10,40 20,55 C 10,70 30,75 46,52 Z" />
                  <path d="M 54,52 C 70,35 90,40 80,55 C 90,70 70,75 54,52 Z" />
                  <path d="M 50,52 Q 45,75 40,90 L 46,90 Q 51,75 50,52 Z" />
               </svg>
            </div>
          </span>
        </div>
        <div className="mt-8 w-32 h-1 bg-[#111111] rounded-full overflow-hidden">
          <div className="h-full bg-[#10b981] w-1/2 rounded-full animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite]" />
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AppLoader;
