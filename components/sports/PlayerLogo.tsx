import React, { useState } from 'react';
import { ProceduralLogo } from './ProceduralLogo';
import logoIndex from '../../public/assets/logo-index.json';

interface PlayerLogoProps {
  name: string;
  fallbackLogo: string;
}

const normalize = (str: string) => {
  if (!str) return '';
  const charMap: Record<string, string> = { 'ğ':'g', 'ü':'u', 'ş':'s', 'ı':'i', 'ö':'o', 'ç':'c' };
  let s = str.toLowerCase();
  s = s.replace(/[ğüşıöç]/g, m => charMap[m]);
  return s
    .replace(/\s+(fc|afc|sc|asd|cf|fk|nk|hnk|us|as|sk|ik)$/i, '')
    .replace(/^(fc|afc|sc|asd|cf|fk|nk|hnk|us|as|sk|ik|cd|sd)\s+/i, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
};

const logoCache = new Map<string, string | null>();

export const findBestLogoMatch = (rawName: string) => {
  if (!rawName) return null;
  
  if (logoCache.has(rawName)) {
    return logoCache.get(rawName);
  }

  const norm = normalize(rawName);
  let match: string | null = null;
  
  // 1. Birebir tam eşleşme (örn: "fenerbahçe" -> "fenerbahçe.png")
  if (logoIndex.includes(norm)) {
    match = norm;
  } 
  // 2. Prefix eşleşmesi
  else if (logoIndex.find((file: string) => file.startsWith(norm + '-'))) {
    match = logoIndex.find((file: string) => file.startsWith(norm + '-')) || null;
  }
  // 3. İçinde geçme eşleşmesi
  else if (logoIndex.find((file: string) => norm.includes(file))) {
    match = logoIndex.find((file: string) => norm.includes(file)) || null;
  }
  // 4. En uzun kelimeden fuzzy (esnek) arama
  else {
    const words = norm.split('-');
    const longestWord = [...words].sort((a, b) => b.length - a.length)[0];
    
    if (longestWord && longestWord.length > 4) {
        const partialMatch = logoIndex.find((file: string) => file.includes(longestWord));
        if (partialMatch) match = partialMatch;
    }
  }
  
  logoCache.set(rawName, match);
  return match;
}

export const PlayerLogo: React.FC<PlayerLogoProps> = ({ name, fallbackLogo }) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Akıllı eşleşme algoritması ile lokal dosyayı bul
  const bestMatch = findBestLogoMatch(name);
  const localImgUrl = bestMatch ? `/assets/logos/${bestMatch}.png` : null;

  const urls = [localImgUrl, fallbackLogo].filter(Boolean) as string[];
  const [pipelineStep, setPipelineStep] = useState(0);
  const currentUrl = urls[pipelineStep];

  const handleError = () => {
    const nextStep = pipelineStep + 1;
    if (nextStep < urls.length) {
      setPipelineStep(nextStep);
    } else {
      setHasError(true);
    }
  };
  
  const handleLoad = () => {
    setIsLoaded(true);
  };

  if (hasError || !currentUrl) {
    return <ProceduralLogo name={name} />;
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <img 
        src={currentUrl} 
        alt={name} 
        className="w-full h-full object-contain p-0.5 filter drop-shadow-[0_2px_5px_rgba(0,0,0,0.7)] hover:scale-110 transition-transform duration-300"
        onError={handleError}
        onLoad={handleLoad}
      />
    </div>
  );
};
