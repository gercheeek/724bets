import React, { useState } from 'react';

export const BaseGameCard: React.FC<{ game: any, onClick: () => void, variant?: 'cyan' | 'green' | 'purple' | 'gold' }> = ({ game, onClick, variant = 'cyan' }) => {
  const [imgError, setImgError] = useState(false);
  const imageUrl = game.img || game.image;
  const isPlaceholder = imageUrl && (
    imageUrl.includes('unsplash') || 
    imageUrl.includes('picsum.photos') || 
    imageUrl.includes('placehold') || 
    imageUrl.includes('loremflickr') ||
    imageUrl.includes('freepik') ||
    imageUrl.includes('dummyimage') ||
    imageUrl.includes('stock') ||
    imageUrl.includes('mockup')
  );
  const hasImage = imageUrl && imageUrl.length > 5 && !imgError && !isPlaceholder;

  const colors = {
    cyan: { border: 'hover:border-[#00E5FF]/30', shadow: 'hover:shadow-[0_8px_25px_rgba(0,229,255,0.2)]', glow: 'from-[#00E5FF]/10', ring: 'group-hover:ring-[#00E5FF]/30' },
    green: { border: 'hover:border-[#00E5FF]/30', shadow: 'hover:shadow-[0_8px_25px_rgba(0,229,255,0.2)]', glow: 'from-[#00E5FF]/10', ring: 'group-hover:ring-[#00E5FF]/30' },
    purple: { border: 'hover:border-[#00E5FF]/30', shadow: 'hover:shadow-[0_8px_25px_rgba(0,229,255,0.2)]', glow: 'from-[#00E5FF]/10', ring: 'group-hover:ring-[#00E5FF]/30' },
    gold: { border: 'hover:border-[#00E5FF]/30', shadow: 'hover:shadow-[0_8px_25px_rgba(0,229,255,0.2)]', glow: 'from-[#00E5FF]/10', ring: 'group-hover:ring-[#00E5FF]/30' }
  };
  const theme = colors[variant];

  return (
    <div 
      className={`group relative flex flex-col cursor-pointer rounded-2xl overflow-hidden transition-all duration-500 hover:z-10 border border-white/5 bg-transparent ${theme.border} shadow-[0_4px_12px_rgba(0,0,0,0.3)] ${theme.shadow} hover:-translate-y-1 w-full max-w-[160px] mx-auto`}
      tabIndex={0}
      onClick={onClick}
    >
      <div className="relative w-full aspect-[3/4] overflow-hidden rounded-2xl bg-[#0A0C10]">
        {hasImage ? (
          <img 
            src={imageUrl} 
            alt={game.name} 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 z-0" 
            loading="lazy" 
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-3 bg-gradient-to-br from-[#12141A] to-[#0A0C10] z-0">
            <div className="w-10 h-10 mb-3 rounded-xl bg-gradient-to-br from-[#00E5FF]/10 to-purple-500/10 flex items-center justify-center border border-white/5">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="url(#gradient)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#00E5FF" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                  <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline>
               </svg>
            </div>
            <span className="text-white/90 font-bold text-center text-xs tracking-wide line-clamp-2 leading-snug">{game.name || 'Oyun'}</span>
            <span className="text-gray-500 text-[10px] font-medium mt-1 uppercase tracking-wider">{game.provider || 'Casino'}</span>
          </div>
        )}
        
        {/* Inner Glow / Glassmorphism */}
        <div className={`absolute inset-0 bg-gradient-to-t ${theme.glow} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay z-10 pointer-events-none`}></div>
        <div className={`absolute inset-0 ring-1 ring-inset ring-white/5 ${theme.ring} rounded-2xl z-20 pointer-events-none transition-all duration-500`}></div>
      </div>
    </div>
  );
};

export const GameCard: React.FC<{ game: any, onClick: () => void, onDemoClick?: () => void }> = (props) => <BaseGameCard {...props} variant="cyan" />;
export const NewGameCard: React.FC<{ game: any, onClick: () => void, onDemoClick?: () => void }> = (props) => <BaseGameCard {...props} variant="cyan" />;

