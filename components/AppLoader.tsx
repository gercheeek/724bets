import React from 'react';
import { Club } from 'lucide-react';

interface AppLoaderProps {
  fadeOut?: boolean;
}

const AppLoader: React.FC<AppLoaderProps> = ({ fadeOut = false }) => {
  return (
    <div 
      className={`fixed inset-0 z-[999999] bg-black flex items-center justify-center transition-opacity duration-500 pointer-events-none ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
    >
      <div className="flex flex-col items-center justify-center animate-pulse">
        <div className="logo-text-724 group flex items-center overflow-hidden">
          <Club className="w-12 h-12 md:w-16 md:h-16 text-[#00FFA3] transition-transform duration-500 mr-2" strokeWidth={2.5} />
          <span className="flex items-center" style={{
            fontSize: '40px',
            fontFamily: "'Inter', sans-serif",
            fontWeight: 900,
            color: '#fff',
          }}>
            <span className="slot-text">724</span>
            <span className="neon-text text-[#00FFA3] ml-[2px]">BETS</span>
          </span>
        </div>
        <div className="mt-8 w-32 h-1 bg-[#1A1D29] rounded-full overflow-hidden">
          <div className="h-full bg-[#00FFA3] w-1/2 rounded-full animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite]" />
        </div>
      </div>
    </div>
  );
};

export default AppLoader;
