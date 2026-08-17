import React, { useState } from 'react';

interface ProceduralLogoProps {
  name: string;
  sport?: string;
}

// Simple hash function for string
const hashString = (str: string) => {
  if (!str) return 0;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
};

// Generate a pair of colors based on a hash
const generateColors = (hash: number, isSleek: boolean) => {
  const hues = [0, 30, 60, 120, 150, 210, 240, 270, 300, 330];
  const primaryHue = hues[hash % hues.length];
  const secondaryHue = hues[(hash + 3) % hues.length];
  
  if (isSleek) {
    return {
      primary: `hsl(${primaryHue}, 20%, 15%)`,
      secondary: `hsl(${secondaryHue}, 15%, 10%)`,
      accent: `hsl(${primaryHue}, 80%, 60%)`
    };
  }

  return {
    primary: `hsl(${primaryHue}, 70%, 45%)`,
    secondary: `hsl(${secondaryHue}, 80%, 35%)`,
    accent: `hsl(${(primaryHue + 180) % 360}, 90%, 60%)`
  };
};

const isLikelyFemale = (name: string) => {
  const n = name.toLowerCase();
  const parts = n.split(' ').filter(w => w.trim().length > 0);
  const first = parts[0] || '';
  const last = parts[parts.length - 1] || '';
  
  // Russian/Slavic female suffixes
  if (last.endsWith('ova') || last.endsWith('eva') || last.endsWith('aya') || last.endsWith('ina')) return true;
  
  // Exclude some common male names ending in a, i, e, y
  const exceptions = ['luca', 'andrea', 'nicola', 'denis', 'yuri', 'ali', 'mustafa', 'emre', 'tolga', 'arda', 'mika', 'iliya'];
  if (first.endsWith('a') || first.endsWith('i') || first.endsWith('e') || first.endsWith('y')) {
    if (!exceptions.includes(first)) return true;
  }
  
  const knownFemales = ['sonja', 'maileen', 'valentini', 'imogen', 'eugenia', 'liel', 'maria', 'anna', 'elena', 'chloe', 'zoe'];
  if (knownFemales.includes(first)) return true;
  
  return false;
};

export const ProceduralLogo: React.FC<ProceduralLogoProps> = React.memo(({ name, sport }) => {
  const [imgError, setImgError] = useState(false);

  const hash = hashString(name);
  const isFootball = !sport || sport.toLowerCase().includes('futbol') || sport.toLowerCase().includes('soccer');
  const isBasketball = sport?.toLowerCase().includes('basket');
  const isTennis = sport?.toLowerCase().includes('tenis') || sport?.toLowerCase().includes('tennis');
  const isVolleyball = sport?.toLowerCase().includes('voleybol') || sport?.toLowerCase().includes('volley');
  
  const colors = generateColors(hash, true); // Always sleek
  const patternType = 0; // Always solid gradient

  const getInitials = (teamName: string) => {
    if (!teamName) return 'T';
    if (teamName.includes('/')) {
      const parts = teamName.split('/');
      return (parts[0].trim()[0] + parts[1].trim()[0]).toUpperCase();
    }
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
    <div className="w-full h-full flex items-center justify-center relative drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)] group-hover:drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)] transition-all duration-300">
      <svg width="100%" height="100%" viewBox="0 0 40 40" className="absolute inset-0 z-0">
        <defs>
          {renderPattern()}
          <linearGradient id="gloss" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.4" />
            <stop offset="40%" stopColor="white" stopOpacity="0.05" />
            <stop offset="100%" stopColor="black" stopOpacity="0.4" />
          </linearGradient>
          <radialGradient id="glow" cx="50%" cy="0%" r="100%">
             <stop offset="0%" stopColor="white" stopOpacity="0.2"/>
             <stop offset="100%" stopColor="transparent" stopOpacity="0"/>
          </radialGradient>
        </defs>
        
        {/* Background Shape */}
        {isFootball ? (
          <>
            <path 
              d="M 20 2 L 4 7 V 18 C 4 28 14 35 20 38 C 26 35 36 28 36 18 V 7 Z"
              fill={getFill()} 
              stroke={colors.accent}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {/* Gloss Overlay */}
            <path 
              d="M 20 2 L 4 7 V 18 C 4 28 14 35 20 38 C 26 35 36 28 36 18 V 7 Z"
              fill="url(#gloss)" 
              pointerEvents="none"
            />
            <path 
              d="M 20 4 L 6 8.5 V 18 C 6 26.5 14.5 32.5 20 35 C 25.5 32.5 34 26.5 34 18 V 8.5 Z"
              fill="none" 
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1"
            />
          </>
        ) : (
          <>
            <circle 
              cx="20" cy="20" r="17" 
              fill={getFill()} stroke={colors.accent} strokeWidth="1.5"
            />
            {/* Gloss Overlay */}
            <circle 
              cx="20" cy="20" r="17" 
              fill="url(#gloss)" pointerEvents="none"
            />
            <circle 
              cx="20" cy="20" r="15" 
              fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1"
            />
          </>
        )}
      </svg>

      {/* Sport-Specific Watermark (Silhouette / Icon) */}
      {isTennis && (
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v4h-2zm0 6h2v2h-2z" />
            <circle cx="12" cy="12" r="10" fill="none" stroke="white" strokeWidth="1" />
            {/* Simple tennis ball curve */}
            <path d="M7 6c2.5 1.5 5 4 4.5 7.5" fill="none" stroke="white" strokeWidth="1.5" />
            <path d="M17 18c-2.5-1.5-5-4-4.5-7.5" fill="none" stroke="white" strokeWidth="1.5" />
          </svg>
        </div>
      )}

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
});
