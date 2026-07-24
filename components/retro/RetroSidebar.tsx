import React from 'react';

interface RetroSidebarProps {
  onGameSelect?: (game: string) => void;
  activeGame?: string;
}

const RetroSidebar: React.FC<RetroSidebarProps> = ({ onGameSelect, activeGame = 'wheel' }) => {
  return (
    <div className="w-full h-full pixel-border flex flex-col">
      <div className="retro-font-primary text-[#06b6d4] text-center border-b-[4px] border-[#06b6d4] pb-4 mb-4 retro-text-glow text-sm uppercase">
        Arcade Menu
      </div>
      
      <div className="flex-1 flex flex-col gap-4 overflow-y-auto retro-scrollbar pr-2">
        {/* Wheel of Luck Button */}
        <div 
          onClick={() => onGameSelect && onGameSelect('wheel')}
          className={`border-[2px] border-[#06b6d4] p-3 cursor-pointer transition-none group ${activeGame === 'wheel' ? 'bg-[#06b6d4] text-[#0a0a0a]' : 'hover:bg-[#06b6d4] hover:text-[#0a0a0a]'}`}
        >
          <h3 className={`retro-font-secondary text-xl mb-1 ${activeGame === 'wheel' ? 'text-[#0a0a0a]' : 'text-[#06b6d4] group-hover:text-[#0a0a0a]'}`}>Wheel of Luck</h3>
          <p className={`retro-font-secondary text-sm ${activeGame === 'wheel' ? 'text-[#0a0a0a]' : 'text-gray-400 group-hover:text-[#0a0a0a]'}`}>[ PLAY NOW ]</p>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t-[4px] border-[#06b6d4] text-center">
        <span className="retro-font-primary text-[10px] text-[#ff00ff] retro-text-glow-purple">INSERT COIN</span>
      </div>
    </div>
  );
};

export default RetroSidebar;
