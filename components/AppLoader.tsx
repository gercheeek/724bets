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
            <SlotText text="724" className="text-white" />
            <SlotText text="BETS" className="text-[#10B981] ml-[2px]" onComplete={onComplete} isReady={isReady} />
          </span>
        </div>
        <div className="mt-8 w-32 h-1 bg-[#1A1D29] rounded-full overflow-hidden">
          <div className="h-full bg-[#10B981] w-1/2 rounded-full animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite]" />
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AppLoader;
