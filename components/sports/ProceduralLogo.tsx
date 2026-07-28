import React from 'react';

interface ProceduralLogoProps {
  name: string;
}

// Simple hash function for string
const hashString = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
};

// Generate a pair of colors based on a hash
const generateColors = (hash: number) => {
  const hues = [0, 30, 60, 120, 150, 210, 240, 270, 300, 330];
  const primaryHue = hues[hash % hues.length];
  const secondaryHue = hues[(hash + 3) % hues.length];
  
  return {
    primary: `hsl(${primaryHue}, 70%, 45%)`,
    secondary: `hsl(${secondaryHue}, 80%, 35%)`,
    accent: `hsl(${(primaryHue + 180) % 360}, 90%, 60%)`
  };
};

export const ProceduralLogo: React.FC<ProceduralLogoProps> = ({ name }) => {
  const hash = hashString(name);
  const colors = generateColors(hash);
  const patternType = hash % 4; // 0: Solid, 1: Stripes, 2: Halves, 3: Quarters

  const getInitials = (teamName: string) => {
    if (!teamName) return 'T';
    const words = teamName.split(' ').filter(w => w.length > 0);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return teamName.substring(0, 2).toUpperCase();
  };

  const initials = getInitials(name);

  // SVG patterns
  const renderPattern = () => {
    switch (patternType) {
      case 1: // Vertical stripes
        return (
          <pattern id={`stripes-${hash}`} patternUnits="userSpaceOnUse" width="10" height="40">
            <rect width="5" height="40" fill={colors.primary} />
            <rect x="5" width="5" height="40" fill={colors.secondary} />
          </pattern>
        );
      case 2: // Diagonal Halves
        return (
          <linearGradient id={`halves-${hash}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="50%" stopColor={colors.primary} />
            <stop offset="50%" stopColor={colors.secondary} />
          </linearGradient>
        );
      case 3: // Quarters
        return (
          <pattern id={`quarters-${hash}`} patternUnits="userSpaceOnUse" width="20" height="20">
            <rect width="10" height="10" fill={colors.primary} />
            <rect x="10" width="10" height="10" fill={colors.secondary} />
            <rect y="10" width="10" height="10" fill={colors.secondary} />
            <rect x="10" y="10" width="10" height="10" fill={colors.primary} />
          </pattern>
        );
      default: // Solid Gradient
        return (
          <linearGradient id={`solid-${hash}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colors.primary} />
            <stop offset="100%" stopColor={colors.secondary} />
          </linearGradient>
        );
    }
  };

  const getFill = () => {
    switch (patternType) {
      case 1: return `url(#stripes-${hash})`;
      case 2: return `url(#halves-${hash})`;
      case 3: return `url(#quarters-${hash})`;
      default: return `url(#solid-${hash})`;
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center relative drop-shadow-[0_2px_5px_rgba(0,0,0,0.7)]">
      <svg width="100%" height="100%" viewBox="0 0 40 40" className="absolute inset-0 z-0">
        <defs>
          {renderPattern()}
        </defs>
        
        {/* Crest shape (Shield) */}
        <path 
          d="M 5,5 L 35,5 L 35,20 C 35,32 20,38 20,38 C 20,38 5,32 5,20 Z" 
          fill={getFill()} 
          stroke={colors.accent}
          strokeWidth="1.5"
        />
        
        {/* Subtle inner highlight */}
        <path 
          d="M 7,7 L 33,7 L 33,20 C 33,30 20,35 20,35 C 20,35 7,30 7,20 Z" 
          fill="none" 
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1"
        />
      </svg>

      {/* Initials Overlay */}
      <span 
        className="z-10 font-black text-white tracking-tighter mix-blend-overlay opacity-90 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]"
        style={{ fontSize: '10px' }}
      >
        {initials}
      </span>
      <span 
        className="z-10 absolute inset-0 flex items-center justify-center font-black text-white/90 tracking-tighter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
        style={{ fontSize: '10px' }}
      >
        {initials}
      </span>
    </div>
  );
};
