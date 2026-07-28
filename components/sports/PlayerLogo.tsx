import React, { useState, useEffect } from 'react';
import { ProceduralLogo } from './ProceduralLogo';

interface PlayerLogoProps {
  name: string;
  fallbackLogo: string;
}

const normalize = (str: string) => {
  if (!str) return '';
  return str.toLowerCase()
    .replace(/ fc$/i, '')
    .replace(/ afc$/i, '')
    .replace(/^fc /i, '')
    .replace(/[^\w\sğüşıöç]/g, '')
    .trim()
    .replace(/\s+/g, '-');
};

export const PlayerLogo: React.FC<PlayerLogoProps> = ({ name, fallbackLogo }) => {
  const [hasError, setHasError] = useState(false);
  const [imgUrl, setImgUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!name) {
       setHasError(true);
       return;
    }
    
    // We only use the explicitly downloaded logos in public/assets/logos/
    const normalizedName = normalize(name);
    setImgUrl(`/assets/logos/${normalizedName}.png`);
    setHasError(false);
  }, [name]);

  const handleError = () => {
    setHasError(true);
  };

  if (hasError || !imgUrl) {
    return <ProceduralLogo name={name} />;
  }

  return (
    <img 
      src={imgUrl} 
      alt={name} 
      className="w-full h-full object-contain p-0.5 filter drop-shadow-[0_2px_5px_rgba(0,0,0,0.7)] hover:scale-110 transition-transform duration-300"
      onError={handleError}
      loading="lazy"
    />
  );
};
