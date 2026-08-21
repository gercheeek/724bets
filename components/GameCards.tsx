import React, { useState } from 'react';

export const BaseGameCard: React.FC<{ game: any, onClick: () => void, variant?: 'cyan' | 'green' | 'purple' | 'gold' }> = ({ game, onClick, variant = 'cyan' }) => {
  const [imgError, setImgError] = useState(false);
  const imageUrl = game.img || game.image;
  const hasImage = imageUrl && imageUrl.length > 5 && !imgError && !imageUrl.includes('unsplash');

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
      <div className="relative w-full aspect-[3/4] overflow-hidden rounded-2xl bg-[#111317]">
        {hasImage ? (
          <img 
            src={imageUrl} 
            alt={game.name} 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 z-0" 
            loading="lazy" 
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#1A1F2D] to-[#111317] z-0">
            <div className="w-14 h-14 mb-4 rounded-xl bg-gradient-to-br from-[#00E5FF]/20 to-purple-500/20 flex items-center justify-center border border-white/5 shadow-inner">
               <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="url(#gradient)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#00E5FF" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                  <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline>
               </svg>
            </div>
            <span className="text-white font-bold text-center text-sm tracking-wide line-clamp-3 leading-tight drop-shadow-md">{game.name || 'Oyun'}</span>
            <span className="text-gray-400 text-xs font-medium mt-2">{game.provider || 'Casino'}</span>
          </div>
        )}
        
        {/* Inner Glow / Glassmorphism */}
        <div className={`absolute inset-0 bg-gradient-to-t ${theme.glow} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay z-10 pointer-events-none`}></div>
        <div className={`absolute inset-0 ring-1 ring-inset ring-white/10 ${theme.ring} rounded-2xl z-20 pointer-events-none transition-all duration-500`}></div>
      </div>
    </div>
  );
};

export const GameCard: React.FC<{ game: any, onClick: () => void, onDemoClick?: () => void }> = (props) => <BaseGameCard {...props} variant="cyan" />;
export const NewGameCard: React.FC<{ game: any, onClick: () => void, onDemoClick?: () => void }> = (props) => <BaseGameCard {...props} variant="cyan" />;

