import React from 'react';
import RetroWheel from './RetroWheel';

const RetroMain: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col gap-6">
      {/* Header Area */}
      <div className="w-full flex justify-between items-center pixel-border p-4">
        <h1 className="retro-font-primary text-xl md:text-2xl text-[color:var(--theme-accent)] retro-text-glow">
          724BETS ARCADE
        </h1>
        <div className="retro-font-secondary text-2xl text-[#ff00ff] retro-text-glow-purple">
          SCORE: 999999
        </div>
      </div>

      {/* Main Wheel Area */}
      <div className="flex-1 pixel-border flex items-center justify-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-[color:var(--theme-accent)]/5"></div>
        
        <div className="text-center z-10 w-full h-full flex flex-col items-center justify-center">
           <RetroWheel />
        </div>
      </div>
    </div>
  );
};

export default RetroMain;
