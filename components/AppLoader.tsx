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
            <SlotText text="ahbapbet" className="text-[#06b6d4] lowercase tracking-tight" onComplete={onComplete} isReady={isReady} />
            <div className="flex items-center justify-center w-5 h-5 rounded-full border-[3px] border-[#06b6d4] ml-2 -mt-6">
               <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-[#06b6d4]">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
               </svg>
            </div>
          </span>
        </div>
        <div className="mt-8 w-32 h-1 bg-[#111111] rounded-full overflow-hidden">
          <div className="h-full bg-[#06b6d4] w-1/2 rounded-full animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite]" />
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AppLoader;
