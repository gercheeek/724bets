import React from 'react';

export const BaseGameCard: React.FC<{ game: any, onClick: () => void, variant?: 'cyan' | 'green' | 'purple' | 'gold' }> = ({ game, onClick, variant = 'cyan' }) => {
  const colors = {
    cyan: { border: 'hover:border-[#00E5FF]/50', shadow: 'hover:shadow-[0_10px_40px_rgba(0,229,255,0.3)]', glow: 'from-[#00E5FF]/20', ring: 'group-hover:ring-[#00E5FF]/50' },
    green: { border: 'hover:border-[#00E5FF]/50', shadow: 'hover:shadow-[0_10px_40px_rgba(0,229,255,0.3)]', glow: 'from-[#00E5FF]/20', ring: 'group-hover:ring-[#00E5FF]/50' },
    purple: { border: 'hover:border-[#00E5FF]/50', shadow: 'hover:shadow-[0_10px_40px_rgba(0,229,255,0.3)]', glow: 'from-[#00E5FF]/20', ring: 'group-hover:ring-[#00E5FF]/50' },
    gold: { border: 'hover:border-[#00E5FF]/50', shadow: 'hover:shadow-[0_10px_40px_rgba(0,229,255,0.3)]', glow: 'from-[#00E5FF]/20', ring: 'group-hover:ring-[#00E5FF]/50' }
  };
  const theme = colors[variant];

  return (
    <div 
      className={`group relative flex flex-col cursor-pointer rounded-2xl overflow-hidden transition-all duration-500 hover:z-10 border border-white/5 bg-transparent ${theme.border} shadow-[0_4px_15px_rgba(0,0,0,0.5)] ${theme.shadow} hover:-translate-y-2 w-full`}
      tabIndex={0}
      onClick={onClick}
    >
      <div className="relative w-full aspect-[4/5] overflow-hidden rounded-2xl bg-black/50">
        <img src={game.img || game.image} alt={game.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" loading="lazy" />
        
        {/* Inner Glow / Glassmorphism */}
        <div className={`absolute inset-0 bg-gradient-to-t ${theme.glow} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay z-10`}></div>
        <div className={`absolute inset-0 ring-1 ring-inset ring-white/10 ${theme.ring} rounded-2xl z-20 pointer-events-none transition-all duration-500`}></div>
        

      </div>
    </div>
  );
};

export const GameCard: React.FC<{ game: any, onClick: () => void, onDemoClick?: () => void }> = (props) => <BaseGameCard {...props} variant="cyan" />;
export const NewGameCard: React.FC<{ game: any, onClick: () => void, onDemoClick?: () => void }> = (props) => <BaseGameCard {...props} variant="cyan" />;
